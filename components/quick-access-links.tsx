import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { getQuickAccessItems, type Role } from "@/lib/auth/roles";

type IconProps = SVGProps<SVGSVGElement>;

type QuickAccessLinksProps = Readonly<{
  role?: Role | null;
}>;

const iconNames: Record<string, ComponentType<IconProps>> = {
  Classes: BookIcon,
  Assignments: ClipboardIcon,
  Clubs: SparkIcon,
  Events: CalendarIcon,
  Rosters: BookIcon,
  Announcements: MegaphoneIcon,
  "Internal Tools": ShieldIcon,
  Admin: ShieldIcon
};

export function QuickAccessLinks({ role }: QuickAccessLinksProps) {
  const links = getQuickAccessItems(role);

  return (
    <section aria-labelledby="quick-access-heading">
      <h2 id="quick-access-heading" className="text-2xl font-bold text-bay-ink">
        Quick access
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {links.map((link) => {
          const Icon = iconNames[link.label] ?? SparkIcon;

          return (
            <Link
              aria-label={`Open ${link.label}`}
              className="group flex min-h-28 items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-bay-teal"
              href={link.href}
              key={link.href}
            >
              <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-md bg-bay-mist text-bay-navy">
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block text-base font-bold text-bay-navy">{link.label}</span>
                <span className="mt-1 block text-sm text-slate-600">{getDescription(link.label)}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function getDescription(label: string): string {
  switch (label) {
    case "Classes":
      return "View schedules and class resources.";
    case "Assignments":
      return "Open current work and due dates.";
    case "Clubs":
      return "Find club pages and activities.";
    case "Events":
      return "Review upcoming school dates.";
    case "Rosters":
      return "Access student groups and class lists.";
    case "Announcements":
      return "Read and manage updates.";
    case "Internal Tools":
      return "Open staff operational tools.";
    case "Admin":
      return "Manage system settings and access.";
    default:
      return "Open this Bayside Hub section.";
  }
}

function BookIcon(props: IconProps) {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" /></svg>;
}

function ClipboardIcon(props: IconProps) {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M9 5h6" /><path d="M9 12h6" /><path d="M9 16h4" /><path d="M8 3h8l1 3h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2z" /></svg>;
}

function CalendarIcon(props: IconProps) {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M8 2v4" /><path d="M16 2v4" /><path d="M3 10h18" /><rect height="18" rx="2" width="18" x="3" y="4" /></svg>;
}

function MegaphoneIcon(props: IconProps) {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="m3 11 18-5v12L3 14z" /><path d="M11.6 16.8 13 22H8l-1.2-6" /></svg>;
}

function ShieldIcon(props: IconProps) {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-5" /></svg>;
}

function SparkIcon(props: IconProps) {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z" /></svg>;
}
