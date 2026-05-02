# Bayside Hub Scalable Architecture

## 1. Goals
- Keep authorization strict and explicit for school data
- Scale read-heavy hub views and timeline feeds
- Preserve fast page loads on Vercel with cache-aware APIs
- Ensure club board members can edit only their own club resources

---

## 2. Next.js 14 App Router Structure

Recommended production layout:

```text
app/
|- (marketing)/
|  `- page.tsx
|- hub/
|  |- layout.tsx
|  |- page.tsx
|  |- classes/page.tsx
|  |- assignments/page.tsx
|  |- clubs/page.tsx
|  |- events/page.tsx
|  |- rosters/page.tsx
|  |- announcements/page.tsx
|  |- tools/page.tsx
|  `- admin/page.tsx
|- api/
|  |- clubs/route.ts
|  |- events/route.ts
|  |- announcements/route.ts
|  |- admin/route.ts
|  `- club-announcements/route.ts
|- layout.tsx
`- globals.css
```

Guidelines:
- Keep route handlers thin (validation + orchestration only)
- Move shared auth/authorization to `lib/auth/*`
- Keep data contracts typed and reused between UI and API clients

---

## 3. Supabase Schema + RLS

Current schema (`supabase/schema.sql`) already includes scalable primitives:
- Role system: `roles`, `users`
- Academic data: `classes`, `enrollments`
- Activity data: `clubs`, `club_board_members`, `events`, `event_registrations`
- Communication: `announcements`
- Operations: `metrics_cache`, `audit_logs`

Core RLS helpers:
- `current_app_role()`
- `is_admin()`
- `is_teacher()`
- `is_club_board_member(club_id)`
- `can_manage_club(club_id)`
- `is_class_member(class_id)`

RLS policy strategy:
1. Default deny on all tables
2. Read policies for audience-appropriate visibility
3. Write policies scoped by role and ownership
4. Admin override only where explicitly required

---

## 4. Auth Flow

1. User authenticates via Supabase Auth.
2. Next.js route handler/server component reads session and user via Supabase server client.
3. App role resolves from `users -> roles` (DB source of truth).
4. Route-level guards perform early checks (required fields, role intent).
5. Supabase write executes.
6. RLS performs final authorization gate.
7. API returns explicit status code (`401`, `403`, `400`, `500`) with structured error payload.

This dual enforcement (app checks + RLS) protects against logic bugs and direct client misuse.

---

## 5. Role-Based Routing

### UI-level routing
- `quickAccessItems` controls role-aware navigation visibility.
- Dashboard role previews should remain display-only; real authority is server-side.

### Server-level routing
- Add route guards by segment:
  - `/hub/admin`: admin only
  - `/hub/tools`: staff/admin
  - `/hub/rosters`: teacher/admin
- Enforce route handler auth in every `/api/*` entry point.

Recommended pattern:
- Centralize guards in `lib/auth/guards.ts`
- Return consistent unauthorized/forbidden responses

---

## 6. Club Board Editing Authority

Authority model:
- Membership rows in `club_board_members` are the source of truth.
- Board members may edit only records tied to their own `club_id`.
- Admins may edit all clubs/events/announcements.

Enforcement path:
1. API receives request with target `clubId`.
2. Helper (e.g., `canCreateClubAnnouncement`) checks admin role or board membership.
3. Supabase write executes with authenticated user context.
4. RLS policies (`is_club_board_member`, `can_manage_club`) allow/deny.

This ensures scoped editing even if an API-level check is bypassed.

---

## 7. Events System

### Overview
The events system provides a centralized hub for school-wide and club-specific events. Students discover events via calendar and list views; event owners manage registrations and attendees.

### Data model
- **`events` table**: title, description, location, starts_at, ends_at, capacity (optional), tags (optional array), status (draft/published/cancelled), created_by
- **`event_registrations` table**: event_id, user_id, attendee_name, attendee_email, registered_at

### Authorization
- Anyone can view published upcoming events
- Event owners (created_by) and admins can edit/delete events
- Capacity enforcement: RSVP prevented when registrations reach capacity (409 Conflict)
- Attendee list visible to event owners/admins only; public sees registration count

### Features
- **Month/week calendar view** with event popovers
- **Search and tag filtering** for discoverability
- **RSVP registration** with capacity checks (server-side)
- **iCal download** and **Google Calendar** links
- **Attendee management**: list view, CSV export (owners only)
- **Admin controls**: edit/delete events (owners/admins)
- **Event creation with tags and capacity**

### API endpoints
- `GET /api/events?search=<str>&tag=<str>&start=<ISO>&end=<ISO>` — list events with optional filters
- `POST /api/events` — create event (authenticated users)
- `GET /api/events/[id]` — fetch single event
- `PATCH /api/events/[id]` — update event (owner/admin)
- `DELETE /api/events/[id]` — delete event (owner/admin)
- `POST /api/events/[id]/register` — register user; returns 409 if full
- `GET /api/events/[id]/registrations` — list attendees (owner view) or count (public)
- `GET /api/events/[id]/ical` — download iCal file
- `GET /api/events/[id]/export` — download attendee CSV (owner/admin)

### UI routes
- `/hub/events` — event hub with calendar + list
- `/hub/events/[id]` — event detail and attendee list
- `/hub/events/[id]/edit` — edit event form (owners/admins)
- `/hub/events/new` — create event form

---

## 8. Event + Announcement Pipelines

### Event pipeline
1. Validate payload (`title`, schedule bounds, club ownership).
2. Authorize user (admin or board member of club).
3. Insert/update `events`.
4. Append `audit_logs` record (`event.created` / `event.updated`).
5. Revalidate event feed cache tags.

### Announcement pipeline
1. Validate scope contract:
   - `global`: no `club_id`/`class_id`
   - `club`: requires `club_id`
   - `class`: requires `class_id`
2. Authorize by scope (admin/board/teacher).
3. Insert announcement row.
4. Emit audit event (`announcement.created`).
5. Revalidate tags for affected audience feeds.

---

## 9. Caching Strategy

### App layer (Next.js)
- Use tagged fetch caching for read-heavy pages:
  - `clubs`, `events`, `announcements`, `metrics`
- Trigger `revalidateTag()` from mutation handlers.

### Data layer (Supabase)
- Keep high-level aggregates in `metrics_cache`.
- Refresh metrics on schedule (cron) and after major admin actions.

### API response strategy
- Cursor-based pagination for large feeds.
- Conservative cache headers for authenticated responses.
- Optional edge caching only for non-sensitive/public payloads.

---

## 10. Vercel Deployment Architecture

### Environments
- **Preview:** branch deployments for QA and role testing
- **Production:** protected branch deployment with migration gate

### Build and release flow
1. CI: `npm run typecheck && npm run test && npm run build`
2. Apply Supabase migrations/schema changes
3. Deploy to Vercel
4. Run post-deploy smoke tests for critical APIs

### Runtime config
- Store secrets in Vercel project settings
- Keep service-role keys server-only
- Use separate Supabase projects for preview vs production

### Observability
- Vercel request logs and function traces
- Structured API error payloads for rapid triage
- Audit log review in admin workflows

---

## 11. Scaling Roadmap
- Add background jobs for notifications and digest delivery
- Introduce queue/outbox pattern for non-blocking side effects
- Add per-endpoint rate limiting for write operations
- Expand contract tests for all route handlers
- Maintain strict parity between route guards and RLS policies
