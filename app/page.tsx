import Link from "next/link";
import { roles } from "@/lib/auth/roles";

const roleLabel: Record<(typeof roles)[number], string> = {
  student: "Student view",
  teacher: "Teacher view",
  staff: "Staff view",
  admin: "Admin view"
};

const highlights = [
  { title: "Unified dashboard", detail: "Access classes, clubs, events, and updates in one place." },
  { title: "Role-aware navigation", detail: "Review experiences tailored for students, faculty, staff, and admins." },
  {
    title: "Classroom booking floor plan",
    detail: "View classroom locations by floor and quickly distinguish booked rooms from available ones."
  }
] as const;

export default function HomePage() {
  return (
    <main className="shell-container py-12 sm:py-16">
      <section className="glass-panel overflow-hidden border-slate-200/80">
        <div className="grid gap-8 p-8 sm:grid-cols-[1.2fr_1fr] sm:p-10 lg:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bay-teal">Bayside Hub</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-bay-navy sm:text-5xl">
              Complete school operations with a refined, modern interface.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Bayside Hub is a role-aware school operations platform built with Next.js 14 (App Router) and Supabase.
              It centralizes classes, clubs, events, announcements, internal tools, and administrative workflows in a
              single interface.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-bay-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-bay-ink"
                href="/hub"
              >
                Open dashboard
              </Link>
              <Link
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-bay-navy transition hover:border-bay-teal hover:text-bay-teal"
                href="/hub/announcements"
              >
                View announcements
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {highlights.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                <h2 className="text-base font-semibold text-bay-navy">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-bay-navy">Explore by role</h2>
        <p className="mt-2 text-sm text-slate-600">Preview quick access links for each role directly from the dashboard.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {roles.map((role) => (
            <Link
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-bay-teal hover:text-bay-teal"
              href={`/hub?role=${role}`}
              key={role}
            >
              {roleLabel[role]}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
