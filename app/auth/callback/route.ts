import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

export async function GET(req: Request) {
  try {
    const supabase = createSupabaseRouteClient();
    const { data } = await supabase.auth.getUser();
    const user = data?.user ?? null;
    const theme = (user as any)?.user_metadata?.settings?.theme ?? (user as any)?.user_metadata?.theme ?? "system";

    const res = NextResponse.redirect(new URL("/hub", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
    // set cookie for 1 year
    const maxAge = 60 * 60 * 24 * 365;
    res.cookies.set("bayside.theme", theme, { path: "/", maxAge });
    return res;
  } catch (err) {
    return NextResponse.redirect(new URL("/hub", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
  }
}
