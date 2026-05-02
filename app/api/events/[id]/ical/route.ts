import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

function toICS(event: any) {
  const uid = `event-${event.id}@bayside.local`;
  const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dtstart = new Date(event.starts_at).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dtend = event.ends_at ? new Date(event.ends_at).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z" : dtstart;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bayside Hub//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${(event.title || "").replace(/\n/g, " ")}`,
    `DESCRIPTION:${(event.description || "").replace(/\n/g, " ")}`,
    event.location ? `LOCATION:${event.location}` : "",
    "END:VEVENT",
    "END:VCALENDAR"
  ].filter(Boolean).join("\r\n");
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseRouteClient();
  const { data: event, error } = await supabase.from("events").select("id, title, description, location, starts_at, ends_at").eq("id", params.id).single();
  if (error || !event) return NextResponse.json({ error: error?.message ?? "not_found" }, { status: 404 });

  const ics = toICS(event);
  const evt: any = event as any;
  return new NextResponse(ics, { status: 200, headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="event-${evt.id}.ics"` } });
}
