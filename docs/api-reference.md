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
**Purpose:** List published events (plus manageable draft/cancelled events for authorized users).

**Params (query):**
- `clubId?: string`
- `status?: "draft" | "published" | "cancelled"`
- `startsAfter?: string` (ISO datetime)
- `startsBefore?: string` (ISO datetime)
- `limit?: number`
- `cursor?: string`

**Response (`200`):**
```ts
type EventsListResponse = {
  data: Array<{
    id: string;
    clubId: string | null;
    title: string;
    description: string;
    location: string | null;
    startsAt: string;
    endsAt: string | null;
    capacity: number | null;
    status: "draft" | "published" | "cancelled";
  }>;
  nextCursor: string | null;
};
```

**Errors:**
- `400` invalid query params
- `401` authentication required
- `500` unexpected server error

### `POST /api/events`
**Purpose:** Create an event (admin or board member of target club).

**Params (body):**
```ts
type CreateEventBody = {
  clubId: string | null; // null for schoolwide event (admin only)
  title: string;
  description?: string;
  location?: string;
  startsAt: string; // ISO datetime
  endsAt?: string | null;
  capacity?: number | null;
  status?: "draft" | "published" | "cancelled";
};
```

**Response (`201`):**
```ts
type CreateEventResponse = { id: string };
```

**Errors:**
- `400` validation failure
- `401` authentication required
- `403` forbidden by role/RLS
- `500` unexpected server error

**Example TS code:**
```ts
export async function createEvent(body: CreateEventBody) {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Create event failed: ${response.status}`);
  }

  return (await response.json()) as CreateEventResponse;
}
```

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
