export const roles = ["student", "teacher", "staff", "admin"] as const;

export type Role = (typeof roles)[number];

export type NavItem = Readonly<{
  label: string;
  href: string;
  roles: readonly Role[];
}>;

export const defaultRole: Role = "student";

export const quickAccessItems: readonly NavItem[] = [
  { label: "Classes", href: "/hub/classes", roles: ["student", "admin"] },
  { label: "Assignments", href: "/hub/assignments", roles: ["student", "teacher", "admin"] },
  { label: "Clubs", href: "/hub/clubs", roles: ["student", "admin"] },
  { label: "Events", href: "/hub/events", roles: ["student", "teacher", "staff", "admin"] },
  { label: "Rosters", href: "/hub/rosters", roles: ["teacher", "admin"] },
  { label: "Announcements", href: "/hub/announcements", roles: ["student", "teacher", "staff", "admin"] },
  { label: "Internal Tools", href: "/hub/tools", roles: ["staff", "admin"] },
  { label: "Admin", href: "/hub/admin", roles: ["admin"] }
];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && roles.includes(value as Role);
}

export function normalizeRole(value: Role | null | undefined): Role {
  return isRole(value) ? value : defaultRole;
}

export function getQuickAccessItems(role: Role | null | undefined): readonly NavItem[] {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") {
    return quickAccessItems;
  }

  return quickAccessItems.filter((item) => item.roles.includes(normalizedRole));
}
