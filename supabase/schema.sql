-- Bayside Hub complete PostgreSQL schema.
-- Apply in Supabase SQL editor or through migrations after enabling pgcrypto.

create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'teacher', 'staff', 'admin');
create type public.club_board_role as enum ('president', 'vice_president', 'treasurer', 'secretary', 'advisor', 'director');
create type public.event_status as enum ('draft', 'published', 'cancelled');
create type public.announcement_scope as enum ('global', 'club', 'class');
create type public.metric_key as enum ('students_total', 'teachers_total', 'staff_total', 'clubs_active', 'events_upcoming');
create type public.audit_event_type as enum (
  'club.profile.updated',
  'event.created',
  'event.updated',
  'announcement.created',
  'admin.action'
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name public.app_role not null unique,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id),
  email text not null unique,
  full_name text not null,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.users(id) on delete restrict,
  name text not null,
  course_code text,
  room text,
  school_year text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.users(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (class_id, student_id)
);

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  banner_url text,
  advisor_id uuid references public.users(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.club_board_members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  board_role public.club_board_role not null default 'director',
  created_at timestamptz not null default now(),
  unique (club_id, user_id)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references public.clubs(id) on delete cascade,
  title text not null,
  description text not null default '',
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  capacity integer check (capacity is null or capacity > 0),
  status public.event_status not null default 'published',
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  attendee_name text not null,
  attendee_email text not null,
  registered_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  scope public.announcement_scope not null,
  club_id uuid references public.clubs(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  author_id uuid references public.users(id) on delete set null,
  title text not null,
  body text not null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint announcements_scope_target check (
    (scope = 'global' and club_id is null and class_id is null)
    or (scope = 'club' and club_id is not null and class_id is null)
    or (scope = 'class' and class_id is not null and club_id is null)
  )
);

create table public.metrics_cache (
  key public.metric_key primary key,
  value integer not null default 0,
  computed_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.users(id) on delete set null,
  event_type public.audit_event_type not null,
  entity_table text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index users_role_id_idx on public.users(role_id);
create index classes_teacher_id_idx on public.classes(teacher_id);
create index enrollments_student_id_idx on public.enrollments(student_id);
create index enrollments_class_id_idx on public.enrollments(class_id);
create index clubs_advisor_id_idx on public.clubs(advisor_id);
create index club_board_members_user_id_idx on public.club_board_members(user_id);
create index club_board_members_club_id_idx on public.club_board_members(club_id);
create index events_club_id_starts_at_idx on public.events(club_id, starts_at);
create index events_starts_at_idx on public.events(starts_at);
create index event_registrations_user_id_idx on public.event_registrations(user_id);
create index announcements_scope_published_at_idx on public.announcements(scope, published_at desc);
create index announcements_club_id_idx on public.announcements(club_id);
create index announcements_class_id_idx on public.announcements(class_id);
create index audit_logs_created_at_idx on public.audit_logs(created_at desc);
create index audit_logs_actor_id_idx on public.audit_logs(actor_id);

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select r.name from public.users u join public.roles r on r.id = u.role_id where u.id = auth.uid()),
    'student'::public.app_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.current_app_role() = 'admin'::public.app_role;
$$;

create or replace function public.is_teacher()
returns boolean
language sql
stable
as $$
  select public.current_app_role() = 'teacher'::public.app_role;
$$;

create or replace function public.is_club_board_member(target_club_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.club_board_members cbm
    where cbm.club_id = target_club_id
      and cbm.user_id = auth.uid()
  );
$$;

create or replace function public.can_manage_club(target_club_id uuid)
returns boolean
language sql
stable
as $$
  select public.is_admin() or public.is_club_board_member(target_club_id);
$$;

create or replace function public.is_class_member(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.enrollments e
    where e.class_id = target_class_id and e.student_id = auth.uid()
  ) or exists (
    select 1 from public.classes c
    where c.id = target_class_id and c.teacher_id = auth.uid()
  );
$$;

alter table public.roles enable row level security;
alter table public.users enable row level security;
alter table public.classes enable row level security;
alter table public.enrollments enable row level security;
alter table public.clubs enable row level security;
alter table public.club_board_members enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.announcements enable row level security;
alter table public.metrics_cache enable row level security;
alter table public.audit_logs enable row level security;

create policy "roles are readable" on public.roles for select to authenticated using (true);
create policy "admins manage roles" on public.roles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "users read active users" on public.users for select to authenticated using (is_active or public.is_admin());
create policy "users update self basic profile" on public.users for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "admins manage users" on public.users for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "classes readable by members and admins" on public.classes for select to authenticated using (
  public.is_admin() or teacher_id = auth.uid() or public.is_class_member(id)
);
create policy "teachers create own classes" on public.classes for insert to authenticated with check (
  public.is_admin() or (public.is_teacher() and teacher_id = auth.uid())
);
create policy "teachers update own classes" on public.classes for update to authenticated using (
  public.is_admin() or teacher_id = auth.uid()
) with check (
  public.is_admin() or teacher_id = auth.uid()
);

create policy "enrollments readable by class members" on public.enrollments for select to authenticated using (
  public.is_admin() or student_id = auth.uid() or public.is_class_member(class_id)
);
create policy "admins manage enrollments" on public.enrollments for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "clubs readable by authenticated users" on public.clubs for select to authenticated using (true);
create policy "admins create clubs" on public.clubs for insert to authenticated with check (public.is_admin());
create policy "admins update all clubs" on public.clubs for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "club board updates only own club" on public.clubs for update to authenticated using (
  public.is_club_board_member(id)
) with check (
  public.is_club_board_member(id)
);
create policy "admins delete clubs" on public.clubs for delete to authenticated using (public.is_admin());

create policy "club board members readable" on public.club_board_members for select to authenticated using (true);
create policy "admins manage club board" on public.club_board_members for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "events readable by authenticated users" on public.events for select to authenticated using (status = 'published' or public.can_manage_club(club_id));
create policy "admin or board create events" on public.events for insert to authenticated with check (
  public.is_admin() or (club_id is not null and public.is_club_board_member(club_id))
);
create policy "admin or board update own club events" on public.events for update to authenticated using (
  public.is_admin() or (club_id is not null and public.is_club_board_member(club_id))
) with check (
  public.is_admin() or (club_id is not null and public.is_club_board_member(club_id))
);
create policy "admin or board delete own club events" on public.events for delete to authenticated using (
  public.is_admin() or (club_id is not null and public.is_club_board_member(club_id))
);

create policy "users register themselves" on public.event_registrations for insert to authenticated with check (user_id = auth.uid());
create policy "registrations readable by owner teacher admin" on public.event_registrations for select to authenticated using (
  user_id = auth.uid() or public.is_teacher() or public.is_admin()
);
create policy "users delete own registrations" on public.event_registrations for delete to authenticated using (user_id = auth.uid());

create policy "announcements readable by audience" on public.announcements for select to authenticated using (
  scope = 'global'
  or public.is_admin()
  or (scope = 'club' and club_id is not null)
  or (scope = 'class' and class_id is not null and public.is_class_member(class_id))
);
create policy "admins create global announcements" on public.announcements for insert to authenticated with check (
  public.is_admin() and scope = 'global'
);
create policy "club board creates own club announcements" on public.announcements for insert to authenticated with check (
  scope = 'club' and club_id is not null and public.is_club_board_member(club_id)
);
create policy "teachers create class announcements" on public.announcements for insert to authenticated with check (
  scope = 'class' and class_id is not null and exists (
    select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid()
  )
);
create policy "admins or owners update announcements" on public.announcements for update to authenticated using (
  public.is_admin()
  or (scope = 'club' and club_id is not null and public.is_club_board_member(club_id))
  or (scope = 'class' and class_id is not null and exists (
    select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid()
  ))
) with check (
  public.is_admin()
  or (scope = 'club' and club_id is not null and public.is_club_board_member(club_id))
  or (scope = 'class' and class_id is not null and exists (
    select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid()
  ))
);
create policy "admins or owners delete announcements" on public.announcements for delete to authenticated using (
  public.is_admin()
  or (scope = 'club' and club_id is not null and public.is_club_board_member(club_id))
  or (scope = 'class' and class_id is not null and exists (
    select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid()
  ))
);

create policy "metrics readable by authenticated users" on public.metrics_cache for select to authenticated using (true);
create policy "admins manage metrics" on public.metrics_cache for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admins read audit logs" on public.audit_logs for select to authenticated using (public.is_admin());
create policy "authenticated users append own audit logs" on public.audit_logs for insert to authenticated with check (actor_id = auth.uid());
