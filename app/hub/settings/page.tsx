import { createSupabaseRouteClient } from "@/lib/supabase/auth";
import SettingsForm from "@/components/hub/settings-form";

export default async function SettingsPage() {
  const supabase = createSupabaseRouteClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  const settings = (user as any)?.user_metadata?.settings ?? { receive_newsletter: true, theme: "system" };

  return (
    <div className="min-h-screen shell-container py-8">
      <div className="max-w-3xl mx-auto">
        <section className="glass-panel p-6">
          <h1 className="text-2xl font-bold text-bay-navy">Settings</h1>
          <p className="mt-2 text-sm text-slate-600">Manage account preferences.</p>

          <div className="mt-6">
            <SettingsForm initialSettings={settings} />
          </div>
        </section>
      </div>
    </div>
  );
}
