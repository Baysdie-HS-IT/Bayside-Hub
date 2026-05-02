import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseRouteClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await req.json();
  // ensure owner or admin
  const { data: event } = await supabase.from("events").select("id, created_by").eq("id", params.id).single();
  const evt: any = event as any;
  if (!evt) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (evt.created_by !== user.id && user.user_metadata?.role !== 'admin') return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { data, error } = await (supabase as any).from("events").update(body as any).eq("id", params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ event: data });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseRouteClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data: event } = await supabase.from("events").select("id, created_by").eq("id", params.id).single();
  const evt: any = event as any;
  if (!evt) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (evt.created_by !== user.id && user.user_metadata?.role !== 'admin') return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { error } = await supabase.from("events").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
