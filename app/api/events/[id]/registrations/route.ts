import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const eventId = params.id;
  const supabase = createSupabaseRouteClient();

  // fetch event
  const { data: event } = await supabase.from("events").select("id, created_by").eq("id", eventId).single();

  // get user (may be null)
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;

  const evt: any = event as any;
  const isOwner = user && event && evt.created_by === user.id;

  // if owner or admin (user metadata), return full list; otherwise only return count
  if (isOwner) {
    const { data, error, count } = await supabase.from("event_registrations").select("id, attendee_name, attendee_email, registered_at", { count: "exact" }).eq("event_id", eventId).order("registered_at", { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ registrations: data ?? [], count: count ?? 0 });
  }

  const { count, error } = await supabase.from("event_registrations").select("id", { count: "exact", head: true }).eq("event_id", eventId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ count: count ?? 0 });
}
