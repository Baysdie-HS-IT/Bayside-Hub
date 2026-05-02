import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const theme = body?.theme;
    if (!theme || !["dark", "light", "system"].includes(theme)) {
      return NextResponse.json({ error: "invalid_theme" }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });
    // set cookie for 1 year
    const maxAge = 60 * 60 * 24 * 365;
    res.cookies.set("bayside.theme", theme, { path: "/", maxAge });
    return res;
  } catch (err) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
}
