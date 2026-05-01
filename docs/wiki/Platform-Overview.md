# Platform Overview

## Product summary

Bayside Hub is a role-aware school operations platform for day-to-day academic, activity, communication, and operational workflows.

Core surfaces include:

- Dashboard (`/hub`)
- Classes (`/hub/classes`)
- Assignments (`/hub/assignments`)
- Clubs (`/hub/clubs`)
- Events (`/hub/events`)
- Rosters (`/hub/rosters`)
- Announcements (`/hub/announcements`)
- Internal tools (`/hub/tools`)
- Admin (`/hub/admin`)

## Operating model

1. Users authenticate through Supabase Auth.
2. Role-aware navigation in the UI shows relevant surfaces by audience.
3. Server-side checks and Supabase RLS enforce final permissions for data access and write operations.

## Tech stack

- Next.js 14 App Router
- React 18
- TypeScript (strict mode)
- Supabase (PostgreSQL + Auth + RLS)
- Vitest + React Testing Library
