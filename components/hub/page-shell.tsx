"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getHubSectionTheme } from "@/components/hub/section-theme";

type PageStat = Readonly<{
  label: string;
  value: string;
  detail: string;
}>;

type HubPageShellProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  stats?: readonly PageStat[];
  actions?: ReactNode;
  children: ReactNode;
}>;

export function HubPageShell({ eyebrow, title, description, stats = [], actions, children }: HubPageShellProps) {
  const pathname = usePathname() ?? "/hub";
  const theme = getHubSectionTheme(pathname);

  return (
    <main className="space-y-6">
      <section className={`glass-panel p-7 sm:p-8 ${theme.shellClassName}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${theme.eyebrowClassName}`}>{eyebrow}</p>
            <h1 className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${theme.titleClassName}`}>{title}</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">{description}</p>
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
        {stats.length > 0 ? (
          <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div className="rounded-xl border border-slate-200/90 bg-white/90 p-4" key={stat.label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</dt>
                <dd className={`mt-2 text-2xl font-semibold ${theme.statValueClassName}`}>{stat.value}</dd>
                <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
              </div>
            ))}
          </dl>
        ) : null}
      </section>

      {children}
    </main>
  );
}

type SurfaceCardProps = Readonly<{
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}>;

export function SurfaceCard({ title, description, children, className }: SurfaceCardProps) {
  const pathname = usePathname() ?? "/hub";
  const theme = getHubSectionTheme(pathname);

  return (
    <section className={`section-surface ${className ?? ""}`.trim()}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className={`text-lg font-semibold ${theme.titleClassName}`}>{title}</h2>
      </div>
      {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

type BadgeTone = "neutral" | "success" | "warning" | "info";

const badgeToneClasses: Record<BadgeTone, string> = {
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  info: "border-bay-teal/20 bg-bay-mist text-bay-teal"
};

type BadgeProps = Readonly<{
  tone?: BadgeTone;
  children: ReactNode;
}>;

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${badgeToneClasses[tone]}`}>
      {children}
    </span>
  );
}
