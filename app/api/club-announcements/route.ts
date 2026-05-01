import { NextResponse } from "next/server";
import { canCreateClubAnnouncement, type PermissionClient } from "@/lib/auth/announcement-permissions";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

type ClubAnnouncementPayload = Readonly<{
  clubId?: unknown;
  title?: unknown;
  body?: unknown;
}>;

type ClubAnnouncementWriteClient = Readonly<{
  auth: {
    getUser(): PromiseLike<{
      data: {
        user: {
          id: string;
          email?: string;
          app_metadata?: Record<string, unknown>;
          user_metadata?: Record<string, unknown>;
        } | null;
      };
      error: { message: string } | null;
    }>;
  };
  from(table: "announcements"): {
    insert(values: {
      scope: "club";
      club_id: string;
      class_id: null;
      author_id: string;
      title: string;
      body: string;
    }): {
      select(columns: "id"): {
        single(): PromiseLike<{
          data: { id: string };
          error: { code?: string; message: string } | null;
        }>;
      };
    };
  };
}>;

type ClubAnnouncementClient = PermissionClient & ClubAnnouncementWriteClient;

function readPayload(value: unknown): { clubId: string; title: string; body: string } | null {
  const payload = value as ClubAnnouncementPayload;

  if (
    typeof payload.clubId !== "string" ||
    typeof payload.title !== "string" ||
    typeof payload.body !== "string"
  ) {
    return null;
  }

  const clubId = payload.clubId.trim();
  const title = payload.title.trim();
  const body = payload.body.trim();

  if (!clubId || !title || !body) {
    return null;
  }

  return { clubId, title, body };
}

function isRlsError(code: string | undefined, message: string | undefined): boolean {
  return code === "42501" || /row-level security|permission denied/i.test(message ?? "");
}

export async function POST(request: Request) {
  const supabase = createSupabaseRouteClient() as unknown as ClubAnnouncementClient;
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const payload = readPayload(await request.json().catch(() => null));

  if (!payload) {
    return NextResponse.json({ error: "clubId, title, and body are required." }, { status: 400 });
  }

  const allowed = await canCreateClubAnnouncement(supabase, user, payload.clubId);

  if (!allowed) {
    return NextResponse.json({ error: "You cannot create announcements for this club." }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      scope: "club",
      club_id: payload.clubId,
      class_id: null,
      author_id: user.id,
      title: payload.title,
      body: payload.body
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: isRlsError(error.code, error.message) ? 403 : 500 }
    );
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
