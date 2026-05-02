import Link from "next/link";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";

export default async function ProfilePage() {
  const supabase = createSupabaseRouteClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  const avatar = (user as any)?.user_metadata?.avatar_url || (user as any)?.user_metadata?.picture || null;
  const displayName = (user as any)?.user_metadata?.full_name || (user as any)?.user_metadata?.name || user?.email || "User";

  return (
    <div className="min-h-screen shell-container py-8">
      <div className="max-w-3xl mx-auto">
        <section className="glass-panel p-6">
          <div className="flex items-center gap-4">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-xl font-semibold text-slate-700">
                {String(displayName).slice(0, 2).toUpperCase()}
              </div>
            )}

            <div>
              <h1 className="text-2xl font-bold text-bay-navy">{displayName}</h1>
              {user?.email ? <p className="text-sm text-slate-600">{user.email}</p> : null}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-700">Account details</h2>
            <pre className="mt-2 rounded border bg-white p-3 text-xs text-slate-700 overflow-auto">{JSON.stringify(user ?? {}, null, 2)}</pre>
          </div>

          <div className="mt-4">
            <Link href="/hub/settings" className="rounded-md bg-bay-teal px-3 py-2 text-sm font-semibold text-white">
              Edit settings
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
