# Roles and Access

## Supported roles

| Role | Primary access |
| --- | --- |
| Student | Classes, assignments, clubs, events, announcements |
| Teacher | Assignments, rosters, class workflows, events, announcements |
| Staff | Events, announcements, internal tools |
| Admin | Full platform access and governance |

## Permission enforcement

Authorization is intentionally enforced in two layers:

1. **UI layer**: role-aware navigation and quick access links (`lib/auth/roles.ts`)
2. **Data layer**: Supabase row-level security (RLS) in `supabase/schema.sql`

## Club board scope

Club board edits are scoped to a user’s own club:

- Membership source: `public.club_board_members`
- RLS helpers: `is_club_board_member(club_id)`, `can_manage_club(club_id)`
- Admins maintain global override permissions

This dual model reduces accidental overexposure and keeps authority explicit.
