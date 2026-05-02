# Bayside Hub API Reference

This document defines the API contract for scalable route handlers under `app/api/*`.

> Current codebase includes `POST /api/club-announcements`. The endpoints below define the production-ready contract for `/api/clubs`, `/api/events`, `/api/announcements`, and `/api/admin`.

---

## `/api/clubs`

### `GET /api/clubs`
**Purpose:** List clubs visible to the authenticated user.

**Params (query):**
- `search?: string`
- `isActive?: "true" | "false"`
- `limit?: number` (default `20`, max `100`)
- `cursor?: string` (opaque pagination cursor)

**Response (`200`):**
```ts
type ClubsListResponse = {
  data: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    advisorId: string | null;
    isActive: boolean;
  }>;
  nextCursor: string | null;
};
```

**Errors:**
- `400` invalid query params
- `401` authentication required
- `500` unexpected server error

### `POST /api/clubs`
**Purpose:** Create a club (admin only).

**Params (body):**
```ts
type CreateClubBody = {
  name: string;
  slug: string;
  description?: string;
  advisorId?: string | null;
};
```

**Response (`201`):**
```ts
type CreateClubResponse = { id: string };
```

**Errors:**
- `400` validation failure
- `401` authentication required
- `403` forbidden (non-admin)
- `409` slug already exists
- `500` unexpected server error

**Example TS code:**
```ts
export async function createClub(body: CreateClubBody) {
  const response = await fetch("/api/clubs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Create club failed: ${response.status}`);
  }

  return (await response.json()) as CreateClubResponse;
}
```

---

## `/api/events`

### `GET /api/events`
**Purpose:** List published upcoming events with optional search/filter.

**Params (query):**
- `search?: string` — search event title
- `tag?: string` — filter by single tag
- `start?: string` (ISO datetime) — filter events starting on/after this date
- `end?: string` (ISO datetime) — filter events starting on/before this date

**Response (`200`):**
```ts
type EventsListResponse = {
  events: Array<{
    id: string;
    club_id: string | null;
    title: string;
    description: string;
    location: string | null;
    starts_at: string;
    ends_at: string | null;
    capacity: number | null;
    tags: string[] | null;
  }>;
};
```

**Errors:**
- `400` invalid query params
- `500` unexpected server error

### `POST /api/events`
**Purpose:** Create a published event (authenticated users).

**Params (body):**
```ts
type CreateEventBody = {
  club_id?: string | null;
  title: string;
  description?: string;
  location?: string | null;
  starts_at: string; // ISO datetime, required
  ends_at?: string | null;
  capacity?: number | null;
  tags?: string[]; // comma-separated in form; array in JSON
  status?: "draft" | "published"; // default "published"
};
```

**Response (`200`):**
```ts
type CreateEventResponse = { event: any };
```

**Errors:**
- `400` validation failure
- `401` not authenticated
- `500` unexpected server error

### `PATCH /api/events/[id]`
**Purpose:** Update an event (event owner or admin).

**Params (body):**
```ts
type UpdateEventBody = Partial<{
  title: string;
  description: string;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  capacity: number | null;
  tags: string[];
  status: "draft" | "published" | "cancelled";
}>;
```

**Response (`200`):**
```ts
type UpdateEventResponse = { event: any };
```

**Errors:**
- `400` validation failure
- `401` not authenticated
- `403` not owner or admin
- `404` event not found
- `500` unexpected server error

### `DELETE /api/events/[id]`
**Purpose:** Delete an event (event owner or admin).

**Response (`200`):**
```ts
type DeleteEventResponse = { ok: true };
```

**Errors:**
- `401` not authenticated
- `403` not owner or admin
- `404` event not found
- `500` unexpected server error

### `POST /api/events/[id]/register`
**Purpose:** Register authenticated user for an event (RSVP).

**Params (body):**
```ts
type RegisterEventBody = {
  name?: string;
  email?: string;
};
```

**Response (`200`):**
```ts
type RegisterResponse = { registration: any };
```

**Errors:**
- `400` registration failed
- `401` not authenticated
- `409` event is full (capacity reached)
- `500` unexpected server error

### `GET /api/events/[id]/registrations`
**Purpose:** Get event attendee list (event owner/admin) or count (public).

**Response (`200`):**
- If owner: `{ registrations: [...], count: N }`
- If public: `{ count: N }`

```ts
type RegistrationsResponse = {
  registrations?: Array<{
    id: string;
    attendee_name: string;
    attendee_email: string;
    registered_at: string;
  }>;
  count: number;
};
```

**Errors:**
- `404` event not found
- `500` unexpected server error

### `GET /api/events/[id]/ical`
**Purpose:** Download event as iCal file.

**Response (`200`):**
```
Content-Type: text/calendar; charset=utf-8
Content-Disposition: attachment; filename="event-[id].ics"
```

**Errors:**
- `404` event not found
- `500` unexpected server error

### `GET /api/events/[id]/export`
**Purpose:** Export attendee list as CSV (event owner/admin).

**Response (`200`):**
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="event-[id]-attendees.csv"
```

CSV columns: `id,attendee_name,attendee_email,registered_at`

**Errors:**
- `401` not authenticated
- `403` not owner or admin
- `404` event not found
- `500` unexpected server error


---

## `/api/announcements`

### `GET /api/announcements`
**Purpose:** List announcements visible to the user's audience scope.

**Params (query):**
- `scope?: "global" | "club" | "class"`
- `clubId?: string`
- `classId?: string`
- `limit?: number`
- `cursor?: string`

**Response (`200`):**
```ts
type AnnouncementsListResponse = {
  data: Array<{
    id: string;
    scope: "global" | "club" | "class";
    clubId: string | null;
    classId: string | null;
    authorId: string | null;
    title: string;
    body: string;
    publishedAt: string;
  }>;
  nextCursor: string | null;
};
```

**Errors:**
- `400` invalid query params
- `401` authentication required
- `500` unexpected server error

### `POST /api/announcements`
**Purpose:** Create an announcement with scope-aware authorization.

**Params (body):**
```ts
type CreateAnnouncementBody =
  | { scope: "global"; title: string; body: string }
  | { scope: "club"; clubId: string; title: string; body: string }
  | { scope: "class"; classId: string; title: string; body: string };
```

**Response (`201`):**
```ts
type CreateAnnouncementResponse = { id: string };
```

**Errors:**
- `400` validation failure
- `401` authentication required
- `403` forbidden by role/RLS
- `500` unexpected server error

**Example TS code:**
```ts
export async function createAnnouncement(body: CreateAnnouncementBody) {
  const response = await fetch("/api/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Create announcement failed: ${response.status}`);
  }

  return (await response.json()) as CreateAnnouncementResponse;
}
```

---

## `/api/admin`

### `GET /api/admin`
**Purpose:** Return admin dashboard data (metrics + recent audit logs). Admin only.

**Params (query):**
- `auditLimit?: number` (default `50`, max `200`)

**Response (`200`):**
```ts
type AdminDashboardResponse = {
  metrics: Array<{ key: string; value: number; computedAt: string }>;
  auditLogs: Array<{
    id: string;
    actorId: string | null;
    eventType: string;
    entityTable: string;
    entityId: string | null;
    metadata: Record<string, unknown>;
    createdAt: string;
  }>;
};
```

**Errors:**
- `401` authentication required
- `403` admin role required
- `500` unexpected server error

### `POST /api/admin`
**Purpose:** Execute audited administrative actions. Admin only.

**Params (body):**
```ts
type AdminActionBody =
  | { action: "refresh_metrics" }
  | { action: "assign_role"; userId: string; role: "student" | "teacher" | "staff" | "admin" }
  | { action: "deactivate_user"; userId: string };
```

**Response (`200`):**
```ts
type AdminActionResponse = {
  ok: true;
  action: AdminActionBody["action"];
  auditLogId: string;
};
```

**Errors:**
- `400` invalid action payload
- `401` authentication required
- `403` admin role required
- `404` target user not found
- `500` unexpected server error

**Example TS code:**
```ts
export async function runAdminAction(body: AdminActionBody) {
  const response = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Admin action failed: ${response.status}`);
  }

  return (await response.json()) as AdminActionResponse;
}
```

---

## Error Envelope Recommendation
Use a consistent error shape across endpoints:

```ts
type ApiError = {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
};
```
