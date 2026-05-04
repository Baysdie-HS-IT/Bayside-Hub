import type { ReactNode } from "react";
import { HubHeader } from "@/components/hub/hub-header";
import Sidebar from "@/components/hub/sidebar";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

type HubLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function HubLayout({ children }: HubLayoutProps) {
  const supabase = createSupabaseRouteClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  return (
    <div className="min-h-screen bg-transparent">
      <HubHeader user={user} />

      <div className="shell-container grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 py-8 sm:py-10">
        <aside className="left-sidebar hidden rounded-2xl border border-slate-100 bg-white/70 p-4 lg:block">
          <Sidebar />
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
