import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

export async function POST() {
  try {
    const supabase = createSupabaseRouteClient();
    await supabase.auth.signOut();
  } catch (err) {
    // ignore errors during sign out
  }

  // Redirect to homepage after logout
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
}
