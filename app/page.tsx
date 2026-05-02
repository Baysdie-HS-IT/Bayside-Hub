import Link from "next/link";
import { quickAccessItems, roles } from "@/lib/auth/roles";

const landingNavItems = [
  { label: "Overview", href: "#overview" },
  { label: "Roles", href: "#roles" },
  { label: "Resources", href: "#resources" }
] as const;

const roleLabel: Record<(typeof roles)[number], string> = {
  student: "Student view",
  teacher: "Teacher view",
  staff: "Staff view",
  admin: "Admin view"
};

const roleDescription: Record<(typeof roles)[number], string> = {
  student: "Daily classwork, events, and announcements in one place.",
  teacher: "Instructional planning, rosters, and assignment workflows.",
  staff: "Operational tools and school-wide communications.",
  admin: "Global visibility and full control across all modules."
};

const highlights = [
  {
    title: "Unified dashboard",
    detail: "Classes, clubs, events, and school updates stay connected in one shared workspace."
  },
  {
    title: "Role-aware navigation",
    detail: "Students, teachers, staff, and admins each get focused access to what matters."
  },
  {
    title: "Classroom booking floor plan",
    detail: "Check room locations by floor and instantly see booked versus available spaces."
  }
] as const;

const statCards = [
  { value: "8", label: "Core modules", detail: "Classes, clubs, events, announcements, and operations." },
  { value: "4", label: "Role profiles", detail: "Experiences tailored for each school role." },
  { value: "1", label: "Hub destination", detail: "A single entry point for daily workflows." },
  { value: "24/7", label: "Access window", detail: "Reliable visibility into school activity anytime." }
] as const;

const footerSections = [
  {
    title: "Navigate",
    links: [
      { label: "Dashboard", href: "/hub" },
      { label: "Announcements", href: "/hub/announcements" },
      { label: "Events", href: "/hub/events" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Classes", href: "/hub/classes" },
      { label: "Assignments", href: "/hub/assignments" },
      { label: "Clubs", href: "/hub/clubs" }
    ]
  }
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="shell-container flex flex-wrap items-center justify-between gap-3 py-4">
          <Link className="text-lg font-bold tracking-tight text-bay-navy" href="/">
            Bayside Hub
          </Link>
          <nav aria-label="Landing navigation" className="flex flex-wrap items-center gap-2">
            {landingNavItems.map((item) => (
              <Link
                className="rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-white hover:text-bay-navy"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-2">
            <Link
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-bay-teal hover:text-bay-teal"
              href="/hub/announcements"
            >
              Updates
            </Link>
            <Link
              className="rounded-full bg-bay-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-bay-ink"
              href="/hub"
            >
              Launch Hub
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="shell-container pt-10 sm:pt-14" id="overview">
          <div className="glass-panel relative overflow-hidden border-slate-200/80">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-60 w-60 rounded-full bg-bay-mist blur-2xl"
            />
            <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:p-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bay-teal">School Operations Portal</p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-bay-navy sm:text-5xl">
                  The redesigned digital front door for Bayside daily operations.
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-slate-600">
                  Coordinate classes, clubs, events, announcements, and internal operations through a cleaner interface
                  built for speed and clarity.
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
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {highlights.map((item) => (
                  <article className="rounded-xl border border-slate-200 bg-white/95 p-5 shadow-sm" key={item.title}>
                    <h2 className="text-base font-semibold text-bay-navy">{item.title}</h2>
                    <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Platform highlights" className="shell-container mt-8 sm:mt-10">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => (
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" key={stat.label}>
                <p className="text-2xl font-bold tracking-tight text-bay-navy">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">{stat.label}</p>
                <p className="mt-2 text-xs text-slate-500">{stat.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="shell-container mt-10 sm:mt-12" id="roles">
          <div className="section-surface border-slate-200/80">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-bay-navy">Explore by role</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Preview role-specific entry points and move directly into the hub with the right navigation context.
                </p>
              </div>
              <Link
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-bay-teal hover:text-bay-teal"
                href="/hub"
              >
                View all modules
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {roles.map((role) => (
                <Link
                  className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-bay-teal/60 hover:shadow"
                  href={`/hub?role=${role}`}
                  key={role}
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-bay-teal">{role}</p>
                  <p className="mt-2 text-lg font-semibold text-bay-navy">{roleLabel[role]}</p>
                  <p className="mt-2 text-sm text-slate-600">{roleDescription[role]}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="shell-container mt-10 pb-12 sm:pb-16" id="resources">
          <div className="section-surface border-slate-200/80">
            <h2 className="text-xl font-bold tracking-tight text-bay-navy">Popular destinations</h2>
            <p className="mt-2 text-sm text-slate-600">Jump into frequently used areas without leaving the landing page.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {quickAccessItems.map((item) => (
                <Link
                  className="rounded-full border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-bay-teal hover:text-bay-teal"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white/90">
        <div className="shell-container grid gap-8 py-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bay-teal">Bayside Hub</p>
            <p className="mt-3 max-w-md text-sm text-slate-600">
              A focused school platform for connected academic workflows, communications, and operations.
            </p>
          </div>
          {footerSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-sm font-semibold text-bay-navy">{section.title}</h2>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link className="text-sm text-slate-600 transition hover:text-bay-teal" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="border-t border-slate-200/80">
          <div className="shell-container flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-slate-500">
            <p>&copy; Bayside Hub. Built for clear, reliable school coordination.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link className="transition hover:text-bay-teal" href="/hub/announcements">
                Announcements
              </Link>
              <Link className="transition hover:text-bay-teal" href="/hub/tools">
                Internal tools
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
