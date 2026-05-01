import Link from "next/link";
import { HubPageShell, SurfaceCard, Badge } from "@/components/hub/page-shell";
import { QuickAccessLinks } from "@/components/quick-access-links";
import { defaultRole, isRole, roles } from "@/lib/auth/roles";

type HubDashboardPageProps = Readonly<{
  searchParams?: Record<string, string | string[] | undefined>;
}>;

const roleLabel = {
  student: "Student experience",
  teacher: "Teacher experience",
  staff: "Staff experience",
  admin: "Admin experience"
} as const;

const todayHighlights = [
  { title: "Attendance closes at 2:00 PM", note: "3 classes still need roll confirmation.", tone: "warning" as const },
  { title: "Spring showcase rehearsal", note: "Auditorium setup begins at 4:30 PM.", tone: "info" as const },
  { title: "Network maintenance complete", note: "All internal tools are running normally.", tone: "success" as const }
] as const;

const upcoming = [
  { label: "Faculty collaboration block", time: "Tomorrow · 8:00 AM" },
  { label: "STEM Expo registration closes", time: "Tomorrow · 5:00 PM" },
  { label: "Family newsletter publication", time: "Friday · 9:00 AM" }
] as const;

function readRole(searchParams: HubDashboardPageProps["searchParams"]) {
  const candidate = searchParams?.role;
  const role = Array.isArray(candidate) ? candidate[0] : candidate;

  return isRole(role) ? role : defaultRole;
}

export default function HubDashboardPage({ searchParams }: HubDashboardPageProps) {
  const selectedRole = readRole(searchParams);

  return (
    <HubPageShell
      eyebrow="Overview"
      title="Dashboard"
      description="A complete operational view of academics, activities, and administration. Use role previews to check each audience's navigation and priorities."
      stats={[
        { label: "Active classes", value: "24", detail: "6 periods across four grade bands" },
        { label: "Open assignments", value: "38", detail: "12 due in the next 48 hours" },
        { label: "Upcoming events", value: "9", detail: "3 schoolwide, 6 organization-led" },
        { label: "Unread announcements", value: "7", detail: "2 marked high priority" }
      ]}
    >
      <SurfaceCard
        title="Role preview"
        description="Switch role context to confirm navigation and quick actions for each audience."
      >
        <div className="flex flex-wrap items-center gap-2">
          {roles.map((role) => {
            const selected = role === selectedRole;

            return (
              <Link
                aria-current={selected ? "page" : undefined}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  selected
                    ? "border-bay-teal bg-bay-mist text-bay-teal"
                    : "border-slate-300 bg-white text-slate-700 hover:border-bay-teal hover:text-bay-teal"
                }`}
                href={`/hub?role=${role}`}
                key={role}
              >
                {roleLabel[role]}
              </Link>
            );
          })}
        </div>
      </SurfaceCard>

      <QuickAccessLinks role={selectedRole} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SurfaceCard title="Today at a glance" description="Priority operational notes for the current day.">
          <ul className="space-y-3">
            {todayHighlights.map((item) => (
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" key={item.title}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-bay-navy">{item.title}</p>
                  <Badge tone={item.tone}>{item.tone}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.note}</p>
              </li>
            ))}
          </ul>
        </SurfaceCard>

        <SurfaceCard title="Upcoming milestones" description="Near-term events and deadline checkpoints.">
          <ul className="space-y-3">
            {upcoming.map((item) => (
              <li className="rounded-xl border border-slate-200 px-4 py-3" key={item.label}>
                <p className="text-sm font-semibold text-bay-navy">{item.label}</p>
                <p className="mt-1 text-sm text-slate-600">{item.time}</p>
              </li>
            ))}
          </ul>
        </SurfaceCard>
      </div>
    </HubPageShell>
  );
}
