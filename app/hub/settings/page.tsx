import { createSupabaseRouteClient } from "@/lib/supabase/auth";
import SettingsForm from "@/components/hub/settings-form";
import { HubPageShell, SurfaceCard } from "@/components/hub/page-shell";

export default async function SettingsPage() {
  const supabase = createSupabaseRouteClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  const settings = (user as any)?.user_metadata?.settings ?? { receive_newsletter: true, theme: "system" };

  return (
    <HubPageShell eyebrow="Account" title="Settings" description="Manage account preferences for notifications and visual theme.">
      <SurfaceCard title="Preferences">
        <SettingsForm initialSettings={settings} />
      </SurfaceCard>
    </HubPageShell>
  );
}
