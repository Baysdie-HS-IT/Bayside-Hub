import Link from "next/link";
import type { ReactNode } from "react";
import Sidebar from "@/components/hub/sidebar";
import UserMenu from "@/components/hub/user-menu";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

type HubLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function HubLayout({ children }: HubLayoutProps) {
  const supabase = createSupabaseRouteClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  const avatar =
    // common metadata keys
    (user as any)?.user_metadata?.avatar_url || (user as any)?.user_metadata?.picture || null;

  return (
    <div className="min-h-screen bg-transparent">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="shell-container py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bay-teal">Bayside Hub</p>
              <p className="mt-1 text-lg font-bold tracking-tight text-bay-navy">School Operations Portal</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                className="hidden rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-bay-teal hover:text-bay-teal sm:block"
                href="/"
              >
                Back to landing
              </Link>
              {user ? <UserMenu user={user} /> : <Link
                href="/login"
                className="rounded-md bg-bay-teal px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-bay-teal/90"
              >
                Log in
              </Link>}
            </div>
          </div>
        </div>
      </header>

      <div className="shell-container grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 py-8 sm:py-10">
        <aside className="left-sidebar hidden rounded-2xl border border-slate-100 bg-white/70 p-4 lg:block">
          <Sidebar />
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
