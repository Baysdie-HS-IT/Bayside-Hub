import { HubPageShell, SurfaceCard, Badge } from "@/components/hub/page-shell";

const tools = [
  {
    name: "Facility Request Queue",
    owner: "Operations",
    detail: "Track room setup and maintenance requests across campus.",
    status: "Healthy"
  },
  {
    name: "Transportation Planner",
    owner: "Student Services",
    detail: "Coordinate event buses and supervision coverage.",
    status: "Monitoring"
  },
  {
    name: "Volunteer Coordinator",
    owner: "Community Office",
    detail: "Manage family signups and shift confirmations.",
    status: "Healthy"
  }
] as const;

const runbook = [
  "Review unresolved requests by 9:00 AM daily.",
  "Escalate blocked tasks older than 48 hours.",
  "Close completed tickets with owner notes for audit traceability."
] as const;

export default function InternalToolsPage() {
  return (
    <HubPageShell
      eyebrow="Operations"
      title="Internal Tools"
      description="Operational systems for support teams, scheduling workflows, and service coordination."
      stats={[
        { label: "Active requests", value: "27", detail: "9 high-priority this morning" },
        { label: "Resolved today", value: "14", detail: "Average turnaround 3.1 hours" },
        { label: "Service uptime", value: "99.8%", detail: "Across internal utility surfaces" },
        { label: "Escalations", value: "2", detail: "Awaiting facilities review" }
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SurfaceCard title="Tool catalog" description="Core operational tools and current status.">
          <ul className="space-y-3">
            {tools.map((tool) => (
              <li className="rounded-xl border border-slate-200 p-4" key={tool.name}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-bay-navy">{tool.name}</h2>
                  <Badge tone={tool.status === "Healthy" ? "success" : "warning"}>{tool.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{tool.owner}</p>
                <p className="mt-2 text-sm text-slate-700">{tool.detail}</p>
              </li>
            ))}
          </ul>
        </SurfaceCard>

        <SurfaceCard title="Daily runbook" description="Expected operational rhythm for support teams.">
          <ul className="space-y-3 text-sm text-slate-700">
            {runbook.map((step) => (
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" key={step}>
                {step}
              </li>
            ))}
          </ul>
        </SurfaceCard>
      </div>
    </HubPageShell>
  );
}
