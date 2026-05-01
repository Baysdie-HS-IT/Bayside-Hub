# Bayside Hub

## Overview
Bayside Hub is a role-aware school operations platform built with Next.js 14 (App Router) and Supabase. It centralizes classes, assignments, clubs, events, announcements, internal tools, and administrative workflows in a single interface.

The project combines a polished frontend shell with typed backend utilities, database-level row-level security (RLS), and test coverage for role-based UI rendering and secure announcement creation.

## Features
- Role-based hub navigation for **student**, **teacher**, **staff**, and **admin** users
- Complete `/hub/*` page suite with a consistent visual system
- Supabase-backed authorization helpers for club announcement permissions
- Secure announcement creation route with clear error handling
- Interactive classroom booking floor plan that shows room locations by floor and booked-vs-available status colors
- Vitest + React Testing Library coverage for role-based component behavior and accessibility
- Route-handler integration tests for success, auth, validation, and RLS cases

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

## Additional Documentation
- API contract: [`docs/api-reference.md`](docs/api-reference.md)
- Scalable architecture design: [`docs/architecture.md`](docs/architecture.md)
- Database and RLS schema: [`docs/database-schema.md`](docs/database-schema.md)
- Project wiki home: [`docs/wiki/Home.md`](docs/wiki/Home.md)
