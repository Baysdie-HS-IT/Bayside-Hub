# Bayside Hub

## Overview
Bayside Hub is a role-aware school operations platform built with Next.js 14 (App Router) and Supabase. It centralizes classes, assignments, clubs, events, announcements, internal tools, and administrative workflows in a single interface.

The project combines a polished frontend shell with typed backend utilities, database-level row-level security (RLS), and test coverage for role-based UI rendering and secure announcement creation.

## Features
- **Role-based hub navigation** for student, teacher, staff, and admin users with intelligent sidebar and user menu
- **Complete `/hub/*` page suite** with consistent design system and responsive layout
- **Centralized events system**:
  - Month/week calendar view with event popovers
  - Search and tag-based filtering for event discovery
  - RSVP registration with capacity management (409 on full)
  - Event owner dashboard: manage attendees, export CSV, view registrations
  - iCal download and Google Calendar integration links
  - Admin event management: create, edit, delete with proper authorization
- **Theme persistence**: light/dark mode with SSR cookie sync and localStorage backup
- **Authentication**: magic link and OAuth (Google/GitHub/Apple) with server-side session handling
- **Supabase-backed authorization** helpers for club announcement permissions and role-based RLS
- **Interactive classroom booking floor plan** showing room locations and availability by floor
- **Vitest + React Testing Library coverage** for role-based component behavior and accessibility
- **Route-handler integration tests** for success, auth, validation, and RLS cases

## Tech Stack
| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 App Router, React 18, Tailwind CSS |
| Backend/API | Next.js Route Handlers |
| Database/Auth | Supabase (PostgreSQL + Auth + RLS) |
| Language | TypeScript (strict mode) |
| Testing | Vitest, React Testing Library, jsdom |
| Deployment | Vercel + Supabase |

## Folder Structure
```text
Bayside_hub/
|- app/
|  |- api/
|  |  `- club-announcements/
|  |- hub/
|  |  |- admin/ announcements/ assignments/ classes/ clubs/ events/ rosters/ tools/
|  |  |- layout.tsx
|  |  `- page.tsx
|  |- globals.css
|  |- layout.tsx
|  `- page.tsx
|- components/
|  |- hub/
|  `- quick-access-links.tsx
|- docs/
|  |- api-reference.md
|  |- architecture.md
|  |- wiki/
|  |  |- Home.md
|  |  |- Platform-Overview.md
|  |  |- Roles-and-Access.md
|  |  |- Classroom-Booking-System.md
|  |  `- Developer-Operations.md
|  `- database-schema.md
|- lib/
|  |- auth/
|  `- supabase/
`- supabase/
   `- schema.sql
```

## Environment Variables
| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL used by server-side route client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key used by server-side route client |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional (recommended for admin jobs) | Privileged server-only key for administrative/background operations |
| `NEXT_PUBLIC_APP_URL` | Optional | Canonical app URL for links/callback generation |

## Deployment
### Local
1. Install dependencies: `npm install`
2. Configure `.env.local` with required variables
3. Run dev server: `npm run dev`
4. Validate locally: `npm run typecheck && npm run test && npm run build`

### Vercel
1. Import repository into Vercel
2. Set environment variables for Preview and Production
3. Use `npm run build` as the build command
4. Apply Supabase schema/migrations from `supabase/schema.sql`
5. Deploy and verify route-handler behavior with authenticated test users

## Role-Based Access Model
| Role | Core Access |
| --- | --- |
| Student | Read classes, assignments, clubs, events, announcements |
| Teacher | Manage class-scoped workflows, rosters, class announcements |
| Staff | Access events, announcements, internal operational tools |
| Admin | Full platform access, user/role governance, audit and administrative control |

Authorization is enforced in two layers:
1. **UI layer** via role-aware navigation (`lib/auth/roles.ts`)
2. **Data layer** via Supabase RLS policies and helper functions in `supabase/schema.sql`

## Club Board Editing Authority
Club board authority is scoped to a user's own club and enforced through both route logic and RLS:

- Membership is represented in `public.club_board_members`
- `public.is_club_board_member(club_id)` and `public.can_manage_club(club_id)` enforce scope
- Board members can update only their club's records (`clubs`, `events`, `announcements` with club scope)
- Admins retain global override authority
- The `canCreateClubAnnouncement` helper in `lib/auth/announcement-permissions.ts` mirrors this rule before write attempts

## Events System

The events hub provides a centralized way for students to discover and register for school activities.

### For Students
- Browse upcoming events on `/hub/events` with calendar and list views
- Search events by title or filter by tag
- Switch between month and week calendar views
- Click events to see details, capacity, and registration status
- RSVP to events (blocked if at capacity)
- Add events to Google Calendar or download as iCal

### For Event Organizers
- Create events on `/hub/events/new` with title, description, time, location, capacity, and tags
- View attendee list and registration count on the event detail page
- Edit or delete events you created (or admin can manage any event)
- Export attendee list as CSV for record-keeping
- Share event details via iCal or Google Calendar links

### Technical
- Events are stored in `public.events` with optional capacity limits
- Registrations are tracked in `public.event_registrations`
- Server-side capacity checks prevent registration when full (HTTP 409)
- Event owners and admins see full attendee details; others see count only
- All APIs include proper auth checks and RLS enforcement
- See `docs/api-reference.md` for complete API documentation

## Additional Documentation

- API contract: [`docs/api-reference.md`](docs/api-reference.md)
- Scalable architecture design: [`docs/architecture.md`](docs/architecture.md)
- Database and RLS schema: [`docs/database-schema.md`](docs/database-schema.md)
- Project wiki home: [`docs/wiki/Home.md`](docs/wiki/Home.md)
