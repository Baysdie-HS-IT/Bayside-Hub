export type HubSectionKey =
  | "dashboard"
  | "classes"
  | "assignments"
  | "clubs"
  | "events"
  | "rosters"
  | "announcements"
  | "tools"
  | "admin"
  | "profile"
  | "settings";

export type HubSectionTheme = Readonly<{
  key: HubSectionKey;
  label: string;
  shellClassName: string;
  eyebrowClassName: string;
  titleClassName: string;
  statValueClassName: string;
  headerChipClassName: string;
  navActiveClassName: string;
  navHoverClassName: string;
  sidebarBadgeClassName: string;
  sectionLinks: readonly { label: string; href: string }[];
}>;

const themes: Record<HubSectionKey, HubSectionTheme> = {
  dashboard: {
    key: "dashboard",
    label: "Dashboard",
    shellClassName: "border-bay-teal/20 bg-gradient-to-br from-bay-mist via-white to-white",
    eyebrowClassName: "text-bay-teal",
    titleClassName: "text-bay-navy",
    statValueClassName: "text-bay-navy",
    headerChipClassName: "border-bay-teal/30 bg-bay-mist text-bay-teal",
    navActiveClassName: "border-bay-teal/30 bg-bay-mist text-bay-navy",
    navHoverClassName: "hover:border-bay-teal/30 hover:bg-bay-mist hover:text-bay-navy",
    sidebarBadgeClassName: "bg-bay-mist text-bay-navy",
    sectionLinks: [{ label: "Overview", href: "/hub" }]
  },
  classes: {
    key: "classes",
    label: "Classes",
    shellClassName: "border-bay-navy/20 bg-gradient-to-br from-slate-50 via-white to-white",
    eyebrowClassName: "text-bay-navy",
    titleClassName: "text-bay-ink",
    statValueClassName: "text-bay-ink",
    headerChipClassName: "border-bay-navy/25 bg-bay-navy/5 text-bay-navy",
    navActiveClassName: "border-bay-navy/25 bg-bay-navy/5 text-bay-navy",
    navHoverClassName: "hover:border-bay-navy/25 hover:bg-bay-navy/5 hover:text-bay-navy",
    sidebarBadgeClassName: "bg-bay-navy/10 text-bay-navy",
    sectionLinks: [{ label: "Class center", href: "/hub/classes" }]
  },
  assignments: {
    key: "assignments",
    label: "Assignments",
    shellClassName: "border-bay-gold/35 bg-gradient-to-br from-amber-50/70 via-white to-white",
    eyebrowClassName: "text-amber-700",
    titleClassName: "text-bay-ink",
    statValueClassName: "text-bay-ink",
    headerChipClassName: "border-bay-gold/40 bg-amber-50 text-amber-700",
    navActiveClassName: "border-bay-gold/40 bg-amber-50 text-amber-800",
    navHoverClassName: "hover:border-bay-gold/40 hover:bg-amber-50 hover:text-amber-800",
    sidebarBadgeClassName: "bg-amber-100 text-amber-800",
    sectionLinks: [{ label: "Assignment board", href: "/hub/assignments" }]
  },
  clubs: {
    key: "clubs",
    label: "Clubs",
    shellClassName: "border-bay-teal/25 bg-gradient-to-br from-teal-50/70 via-white to-white",
    eyebrowClassName: "text-teal-700",
    titleClassName: "text-bay-navy",
    statValueClassName: "text-bay-navy",
    headerChipClassName: "border-bay-teal/35 bg-teal-50 text-teal-700",
    navActiveClassName: "border-bay-teal/35 bg-teal-50 text-teal-800",
    navHoverClassName: "hover:border-bay-teal/35 hover:bg-teal-50 hover:text-teal-800",
    sidebarBadgeClassName: "bg-teal-100 text-teal-800",
    sectionLinks: [{ label: "Club directory", href: "/hub/clubs" }]
  },
  events: {
    key: "events",
    label: "Events",
    shellClassName: "border-emerald-200/70 bg-gradient-to-br from-emerald-50/70 via-white to-white",
    eyebrowClassName: "text-emerald-700",
    titleClassName: "text-bay-navy",
    statValueClassName: "text-bay-navy",
    headerChipClassName: "border-emerald-300 bg-emerald-50 text-emerald-700",
    navActiveClassName: "border-emerald-300 bg-emerald-50 text-emerald-800",
    navHoverClassName: "hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800",
    sidebarBadgeClassName: "bg-emerald-100 text-emerald-800",
    sectionLinks: [
      { label: "All events", href: "/hub/events" },
      { label: "Create event", href: "/hub/events/new" }
    ]
  },
  rosters: {
    key: "rosters",
    label: "Rosters",
    shellClassName: "border-bay-ink/20 bg-gradient-to-br from-slate-100/80 via-white to-white",
    eyebrowClassName: "text-slate-600",
    titleClassName: "text-bay-ink",
    statValueClassName: "text-bay-ink",
    headerChipClassName: "border-slate-300 bg-slate-100 text-slate-700",
    navActiveClassName: "border-slate-300 bg-slate-100 text-slate-800",
    navHoverClassName: "hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800",
    sidebarBadgeClassName: "bg-slate-200 text-slate-800",
    sectionLinks: [{ label: "Roster manager", href: "/hub/rosters" }]
  },
  announcements: {
    key: "announcements",
    label: "Announcements",
    shellClassName: "border-bay-gold/35 bg-gradient-to-br from-amber-50/70 via-white to-white",
    eyebrowClassName: "text-amber-700",
    titleClassName: "text-bay-navy",
    statValueClassName: "text-bay-navy",
    headerChipClassName: "border-bay-gold/40 bg-amber-50 text-amber-700",
    navActiveClassName: "border-bay-gold/40 bg-amber-50 text-amber-800",
    navHoverClassName: "hover:border-bay-gold/40 hover:bg-amber-50 hover:text-amber-800",
    sidebarBadgeClassName: "bg-amber-100 text-amber-800",
    sectionLinks: [{ label: "Announcement feed", href: "/hub/announcements" }]
  },
  tools: {
    key: "tools",
    label: "Tools",
    shellClassName: "border-bay-teal/25 bg-gradient-to-br from-bay-mist/80 via-white to-white",
    eyebrowClassName: "text-bay-teal",
    titleClassName: "text-bay-ink",
    statValueClassName: "text-bay-ink",
    headerChipClassName: "border-bay-teal/30 bg-bay-mist text-bay-teal",
    navActiveClassName: "border-bay-teal/30 bg-bay-mist text-bay-navy",
    navHoverClassName: "hover:border-bay-teal/30 hover:bg-bay-mist hover:text-bay-navy",
    sidebarBadgeClassName: "bg-bay-mist text-bay-navy",
    sectionLinks: [{ label: "Internal tools", href: "/hub/tools" }]
  },
  admin: {
    key: "admin",
    label: "Admin",
    shellClassName: "border-bay-ink/25 bg-gradient-to-br from-slate-100/80 via-white to-white",
    eyebrowClassName: "text-bay-ink",
    titleClassName: "text-bay-ink",
    statValueClassName: "text-bay-ink",
    headerChipClassName: "border-bay-ink/25 bg-bay-ink/5 text-bay-ink",
    navActiveClassName: "border-bay-ink/25 bg-bay-ink/5 text-bay-ink",
    navHoverClassName: "hover:border-bay-ink/25 hover:bg-bay-ink/5 hover:text-bay-ink",
    sidebarBadgeClassName: "bg-bay-ink/10 text-bay-ink",
    sectionLinks: [{ label: "Admin controls", href: "/hub/admin" }]
  },
  profile: {
    key: "profile",
    label: "Profile",
    shellClassName: "border-bay-navy/20 bg-gradient-to-br from-slate-50 via-white to-white",
    eyebrowClassName: "text-bay-navy",
    titleClassName: "text-bay-navy",
    statValueClassName: "text-bay-navy",
    headerChipClassName: "border-bay-navy/25 bg-bay-navy/5 text-bay-navy",
    navActiveClassName: "border-bay-navy/25 bg-bay-navy/5 text-bay-navy",
    navHoverClassName: "hover:border-bay-navy/25 hover:bg-bay-navy/5 hover:text-bay-navy",
    sidebarBadgeClassName: "bg-bay-navy/10 text-bay-navy",
    sectionLinks: [{ label: "Profile", href: "/hub/profile" }]
  },
  settings: {
    key: "settings",
    label: "Settings",
    shellClassName: "border-bay-teal/20 bg-gradient-to-br from-bay-mist/80 via-white to-white",
    eyebrowClassName: "text-bay-teal",
    titleClassName: "text-bay-navy",
    statValueClassName: "text-bay-navy",
    headerChipClassName: "border-bay-teal/30 bg-bay-mist text-bay-teal",
    navActiveClassName: "border-bay-teal/30 bg-bay-mist text-bay-navy",
    navHoverClassName: "hover:border-bay-teal/30 hover:bg-bay-mist hover:text-bay-navy",
    sidebarBadgeClassName: "bg-bay-mist text-bay-navy",
    sectionLinks: [{ label: "Settings", href: "/hub/settings" }]
  }
};

export function getHubSection(pathname: string): HubSectionKey {
  if (pathname === "/hub") return "dashboard";
  if (pathname.startsWith("/hub/classes")) return "classes";
  if (pathname.startsWith("/hub/assignments")) return "assignments";
  if (pathname.startsWith("/hub/clubs")) return "clubs";
  if (pathname.startsWith("/hub/events")) return "events";
  if (pathname.startsWith("/hub/rosters")) return "rosters";
  if (pathname.startsWith("/hub/announcements")) return "announcements";
  if (pathname.startsWith("/hub/tools")) return "tools";
  if (pathname.startsWith("/hub/admin")) return "admin";
  if (pathname.startsWith("/hub/profile")) return "profile";
  if (pathname.startsWith("/hub/settings")) return "settings";
  return "dashboard";
}

export function getHubSectionTheme(pathname: string): HubSectionTheme {
  return themes[getHubSection(pathname)];
}
