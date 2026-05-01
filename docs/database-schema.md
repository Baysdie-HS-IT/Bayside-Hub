# Bayside Hub Database Relationships

- `roles` defines the allowed application roles: student, teacher, staff, and admin.
- `users` extends `auth.users`; every app user belongs to one role.
- `classes` belongs to a teacher user. `enrollments` joins students to classes.
- `clubs` may have an advisor and many `club_board_members`.
- `events` may be schoolwide or attached to a club. `event_registrations` joins users to events.
- `announcements` are polymorphic by `scope`: global announcements have no target, club announcements target `clubs`, and class announcements target `classes`.
- `metrics_cache` stores dashboard aggregates that can be refreshed by a scheduled job.
- `audit_logs` stores append-only security and administrative activity.

Important RLS behavior:
- All authenticated users can read clubs, board membership, published events, and global announcements.
- Club board members can update only the `clubs`, `events`, and `announcements` rows tied to their own club.
- Admins can update all club/event/announcement rows and read audit logs.
- Other users remain read-only for `clubs`, `club_board_members`, `announcements`, and `events`.
