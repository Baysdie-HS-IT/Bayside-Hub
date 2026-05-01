import { HubPageShell, SurfaceCard, Badge } from "@/components/hub/page-shell";

const accessReviews = [
  { area: "Admin console", owner: "Platform Team", nextReview: "May 8", state: "Scheduled" },
  { area: "Finance approvals", owner: "Business Office", nextReview: "May 12", state: "In progress" },
  { area: "Club governance", owner: "Student Life", nextReview: "May 15", state: "Scheduled" }
] as const;

const securityFeed = [
  { event: "MFA adoption reached 98.6%", tone: "success" as const },
  { event: "2 suspicious login attempts blocked", tone: "warning" as const },
  { event: "Quarterly policy attestation opened", tone: "info" as const }
] as const;

export default function AdminPage() {
  return (
    <HubPageShell
      eyebrow="Governance"
      title="Admin"
      description="Centralized oversight for permissions, security posture, and high-impact operational controls."
      stats={[
        { label: "Privileged users", value: "41", detail: "Across admin and staff roles" },
        { label: "Pending approvals", value: "6", detail: "Access and workflow requests" },
        { label: "Security score", value: "94", detail: "Up 3 points this quarter" },
        { label: "Audit events today", value: "153", detail: "No unresolved critical events" }
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SurfaceCard title="Access governance" description="Current review windows for sensitive permission groups.">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-600">Area</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Owner</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Next review</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">State</th>
                </tr>
              </thead>
              <tbody>
                {accessReviews.map((item) => (
                  <tr className="border-t border-slate-200" key={item.area}>
                    <td className="px-4 py-3 font-medium text-bay-navy">{item.area}</td>
                    <td className="px-4 py-3 text-slate-600">{item.owner}</td>
                    <td className="px-4 py-3 text-slate-700">{item.nextReview}</td>
                    <td className="px-4 py-3 text-slate-700">{item.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Security feed" description="Live highlights from the security and compliance stream.">
          <ul className="space-y-3">
            {securityFeed.map((item) => (
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3" key={item.event}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-700">{item.event}</p>
                  <Badge tone={item.tone}>{item.tone}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </SurfaceCard>
      </div>
    </HubPageShell>
  );
}
