import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

function toCSV(rows:any[]) {
  const headers = ["id","attendee_name","attendee_email","registered_at"];
  const lines = [headers.join(',')];
  rows.forEach(r => {
    const vals = headers.map(h => {
      const v = r[h] ?? '';
      return `"${String(v).replace(/"/g, '""')}"`;
    });
    lines.push(vals.join(','));
  });
  return lines.join('\n');
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseRouteClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data: event } = await supabase.from("events").select("id, created_by").eq("id", params.id).single();
  const evt: any = event as any;
  if (!evt) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (evt.created_by !== user.id && user.user_metadata?.role !== 'admin') return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { data, error } = await supabase.from("event_registrations").select("id, attendee_name, attendee_email, registered_at").eq("event_id", params.id).order("registered_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const csv = toCSV(data ?? []);
  return new NextResponse(csv, { status: 200, headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="event-${params.id}-attendees.csv"` } });
}
