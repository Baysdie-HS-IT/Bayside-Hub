import { HubPageShell } from "@/components/hub/page-shell";
import EventCard from "@/components/events/event-card";
import Calendar from "@/components/events/calendar";
import EventsView from "@/components/events/events-view";
import { createSupabaseRouteClient } from "@/lib/supabase/auth";
import Link from "next/link";

export default async function EventsPage() {
  const supabase = createSupabaseRouteClient();
  const { data } = await supabase
    .from("events")
    .select("id, title, description, location, starts_at, ends_at, capacity, club_id")
    .eq("status", "published")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(50);

  const events = data ?? [];

  return (
    <HubPageShell eyebrow="Calendar" title="Events" description="A centralized list of upcoming events across campus.">
      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-bay-navy">Upcoming events</h2>
            <div className="flex items-center gap-2">
              <Link href="/hub/events/new" className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700">New event</Link>
            </div>
          </div>

          <EventsView />
        </div>

        <aside>
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-bay-navy">Filters</h3>
            <p className="mt-2 text-sm text-slate-600">Search and filters will be added soon.</p>
          </div>
        </aside>
      </div>
    </HubPageShell>
  );
}
