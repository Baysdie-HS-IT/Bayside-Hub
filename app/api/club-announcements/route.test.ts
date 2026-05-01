import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { canCreateClubAnnouncement } from "@/lib/auth/announcement-permissions";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

vi.mock("@/lib/supabase/auth", () => ({
  createSupabaseRouteClient: vi.fn()
}));

vi.mock("@/lib/auth/announcement-permissions", () => ({
  canCreateClubAnnouncement: vi.fn()
}));

const createSupabaseRouteClientMock = vi.mocked(createSupabaseRouteClient);
const canCreateClubAnnouncementMock = vi.mocked(canCreateClubAnnouncement);

function request(body: unknown) {
  return new Request("http://localhost/api/club-announcements", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

type MockSupabaseOptions = Readonly<{
  user?: { id: string; app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> } | null;
  userError?: { message: string } | null;
  insertError?: { code?: string; message: string };
}>;

function mockSupabase(options?: MockSupabaseOptions) {
  const single = vi.fn().mockResolvedValue(
    options?.insertError
      ? { data: null, error: options.insertError }
      : { data: { id: "announcement-1" }, error: null }
  );
  const select = vi.fn(() => ({ single }));
  const insert = vi.fn(() => ({ select }));
  const from = vi.fn(() => ({ insert }));
  const getUser = vi.fn().mockResolvedValue({
    data: { user: options?.user === undefined ? { id: "user-1" } : options.user },
    error: options?.userError ?? null
  });

  const supabase = {
    auth: { getUser },
    from
  };

  createSupabaseRouteClientMock.mockReturnValue(supabase as never);
  return { from, getUser, insert };
}

describe("POST /api/club-announcements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a club announcement", async () => {
    const { insert, from } = mockSupabase();
    canCreateClubAnnouncementMock.mockResolvedValue(true);

    const response = await POST(request({ clubId: "club-1", title: "Meeting", body: "Room 204" }));

    await expect(response.json()).resolves.toEqual({ id: "announcement-1" });
    expect(response.status).toBe(201);
    expect(canCreateClubAnnouncementMock).toHaveBeenCalledWith(expect.anything(), { id: "user-1" }, "club-1");
    expect(from).toHaveBeenCalledWith("announcements");
    expect(insert).toHaveBeenCalledWith({
      scope: "club",
      club_id: "club-1",
      class_id: null,
      author_id: "user-1",
      title: "Meeting",
      body: "Room 204"
    });
  });

  it("returns 401 when unauthenticated", async () => {
    mockSupabase({ user: null });

    const response = await POST(request({ clubId: "club-1", title: "Meeting", body: "Room 204" }));

    expect(response.status).toBe(401);
    expect(canCreateClubAnnouncementMock).not.toHaveBeenCalled();
  });

  it("returns 401 when auth provider errors", async () => {
    mockSupabase({ userError: { message: "token expired" } });

    const response = await POST(request({ clubId: "club-1", title: "Meeting", body: "Room 204" }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Authentication required." });
  });

  it("returns 400 for invalid payload", async () => {
    mockSupabase();

    const response = await POST(request({ clubId: "club-1", title: "", body: "Room 204" }));

    expect(response.status).toBe(400);
  });

  it("returns 403 when permission helper denies access", async () => {
    mockSupabase();
    canCreateClubAnnouncementMock.mockResolvedValue(false);

    const response = await POST(request({ clubId: "club-2", title: "Meeting", body: "Room 204" }));

    expect(response.status).toBe(403);
  });

  it("returns 403 when Supabase RLS rejects insert", async () => {
    mockSupabase({ insertError: { code: "42501", message: "new row violates row-level security policy" } });
    canCreateClubAnnouncementMock.mockResolvedValue(true);

    const response = await POST(request({ clubId: "club-1", title: "Meeting", body: "Room 204" }));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "new row violates row-level security policy" });
  });

  it("returns 500 when insert fails for non-RLS reasons", async () => {
    mockSupabase({ insertError: { code: "23505", message: "duplicate key value violates unique constraint" } });
    canCreateClubAnnouncementMock.mockResolvedValue(true);

    const response = await POST(request({ clubId: "club-1", title: "Meeting", body: "Room 204" }));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "duplicate key value violates unique constraint" });
  });
});
