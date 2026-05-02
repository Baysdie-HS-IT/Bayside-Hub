"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { quickAccessItems } from "@/lib/auth/roles";

const mainItem = { label: "Dashboard", href: "/hub" } as const;

function Icon({ name }: { name: string }) {
  switch (name) {
    case "home":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z" />
        </svg>
      );
    case "book":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2V5z" />
        </svg>
      );
    case "clipboard":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 2h6a2 2 0 0 1 2 2v1H7V4a2 2 0 0 1 2-2zM7 7h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7z" />
        </svg>
      );
    case "users":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-3-3.87M7 21v-2a4 4 0 0 1 3-3.87M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
        </svg>
      );
    case "calendar":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 11h18" />
        </svg>
      );
    case "list":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case "megaphone":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 11v2a2 2 0 0 0 2 2h3l7 4V7L8 11H5a2 2 0 0 0-2 2z" />
        </svg>
      );
    case "wrench":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14.7 6.3a6 6 0 1 1-1.4 1.4L4 17.9V21h3.1l9.6-9.6z" />
        </svg>
      );
    case "shield":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l7 3v5c0 5-3.6 9.7-7 11-3.4-1.3-7-6-7-11V5l7-3z" />
        </svg>
      );
    default:
      return null;
  }
}

type NavEntry = { label: string; href: string; icon?: string };

export function HubNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname() ?? "/";

  const quickItems: NavEntry[] = quickAccessItems.map((i) => ({ label: i.label, href: i.href }));

  const groups: { title?: string; items: NavEntry[] }[] = [
    { title: undefined, items: [mainItem] },
    { title: "Quick Access", items: quickItems }
  ];

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function iconFor(label: string) {
    const key = label.toLowerCase();
    if (key.includes("dash")) return "home";
    if (key.includes("class")) return "book";
    if (key.includes("assign")) return "clipboard";
    if (key.includes("club")) return "users";
    if (key.includes("event")) return "calendar";
    if (key.includes("roster")) return "list";
    if (key.includes("announce")) return "megaphone";
    if (key.includes("tool")) return "wrench";
    if (key.includes("admin")) return "shield";
    return "";
  }

  return (
    <nav aria-label="Hub navigation" className="py-4 px-2">
      {groups.map((group, idx) => (
        <div key={idx} className="mb-3">
          {group.title ? <div className="nav-section-title">{group.title}</div> : null}
          <ul className="space-y-1">
            {group.items.map((item) => (
              <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                      isActive(item.href)
                        ? "bg-bay-navy/5 text-bay-navy"
                        : "text-slate-700 hover:bg-bay-mist hover:text-bay-navy"
                    }`}
                  >
                    <span className="inline-flex w-4 text-slate-400">{<Icon name={iconFor(item.label)} />}</span>
                    <span className={`${collapsed ? "sr-only" : ""}`}>{item.label}</span>
                  </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
