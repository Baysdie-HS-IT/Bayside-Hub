import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const eventId = params.id;
  const supabase = createSupabaseRouteClient();

  // ensure user is authenticated
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await req.json();
  const attendeeName = body.name ?? user.email ?? "";
  const attendeeEmail = body.email ?? user.email ?? "";

  // check for existing registration
  const { data: existing } = await supabase.from("event_registrations").select("id").eq("event_id", eventId).eq("user_id", user.id).single();
  if (existing) return NextResponse.json({ registration: existing });

  // check event capacity
  const { data: ev } = await supabase.from("events").select("id, capacity").eq("id", eventId).single();
  const evt: any = ev as any;
  if (evt && typeof evt.capacity === "number") {
    const { count, error: countErr } = await supabase.from("event_registrations").select("id", { count: "exact", head: true }).eq("event_id", eventId);
    if (countErr) return NextResponse.json({ error: countErr.message }, { status: 500 });
    if ((count ?? 0) >= evt.capacity) return NextResponse.json({ error: "full" }, { status: 409 });
  }

  const { data, error } = await supabase.from("event_registrations").insert([{ event_id: eventId, user_id: user.id, attendee_name: attendeeName, attendee_email: attendeeEmail }] as any).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ registration: data });
}
