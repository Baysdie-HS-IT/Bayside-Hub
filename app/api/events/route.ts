import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

export async function GET(req: Request) {
  const supabase = createSupabaseRouteClient();
  const url = new URL(req.url);
  const search = url.searchParams.get("search") ?? undefined;
  const start = url.searchParams.get("start") ?? undefined;
  const end = url.searchParams.get("end") ?? undefined;
  const tag = url.searchParams.get("tag") ?? undefined;

  let query = supabase.from("events").select("id, title, description, location, starts_at, ends_at, capacity, club_id, tags").eq("status", "published");
  if (start) query = query.gte("starts_at", start);
  else query = query.gte("starts_at", new Date().toISOString());
  if (end) query = query.lte("starts_at", end);
  if (search) query = query.ilike("title", `%${search}%`);
  if (tag) query = query.contains("tags", [tag]);

  const { data, error } = await query.order("starts_at", { ascending: true }).limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ events: data ?? [] });
}

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = createSupabaseRouteClient();

  const insert = {
    club_id: body.club_id ?? null,
    title: body.title,
    description: body.description ?? "",
    location: body.location ?? null,
    starts_at: body.starts_at,
    ends_at: body.ends_at ?? null,
    capacity: body.capacity ?? null,
    status: body.status ?? "published"
  };

  const { data, error } = await supabase.from("events").insert([insert] as any).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ event: data });
}
