import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuickAccessLinks } from "@/components/quick-access-links";
import type { Role } from "@/lib/auth/roles";

type ExpectedLink = Readonly<{
  label: string;
  href: string;
}>;

const expectedLinksByRole: Record<Role, readonly ExpectedLink[]> = {
  student: [
    { label: "Classes", href: "/hub/classes" },
    { label: "Assignments", href: "/hub/assignments" },
    { label: "Clubs", href: "/hub/clubs" },
    { label: "Events", href: "/hub/events" },
    { label: "Announcements", href: "/hub/announcements" }
  ],
  teacher: [
    { label: "Assignments", href: "/hub/assignments" },
    { label: "Events", href: "/hub/events" },
    { label: "Rosters", href: "/hub/rosters" },
    { label: "Announcements", href: "/hub/announcements" }
  ],
  staff: [
    { label: "Events", href: "/hub/events" },
    { label: "Announcements", href: "/hub/announcements" },
    { label: "Internal Tools", href: "/hub/tools" }
  ],
  admin: [
    { label: "Classes", href: "/hub/classes" },
    { label: "Assignments", href: "/hub/assignments" },
    { label: "Clubs", href: "/hub/clubs" },
    { label: "Events", href: "/hub/events" },
    { label: "Rosters", href: "/hub/rosters" },
    { label: "Announcements", href: "/hub/announcements" },
    { label: "Internal Tools", href: "/hub/tools" },
    { label: "Admin", href: "/hub/admin" }
  ]
};

function expectRenderedLinks(expectedLinks: readonly ExpectedLink[]) {
  const links = screen.getAllByRole("link");

  expect(links).toHaveLength(expectedLinks.length);
  expect(links.map((link) => link.getAttribute("href"))).toEqual(expectedLinks.map((expected) => expected.href));

  for (const expected of expectedLinks) {
    expect(screen.getByRole("link", { name: `Open ${expected.label}` })).toHaveAttribute("href", expected.href);
  }
}

describe("QuickAccessLinks", () => {
  it.each(Object.entries(expectedLinksByRole) as [Role, readonly ExpectedLink[]][])(
    "renders correct links for %s role",
    (role, expectedLinks) => {
      render(<QuickAccessLinks role={role} />);

      expectRenderedLinks(expectedLinks);
    }
  );

  it("falls back to student links when role is missing", () => {
    render(<QuickAccessLinks />);

    expectRenderedLinks(expectedLinksByRole.student);
  });

  it("uses accessible section and link markup", () => {
    render(<QuickAccessLinks role="student" />);

    const region = screen.getByRole("region", { name: /quick access/i });
    expect(within(region).getByRole("heading", { level: 2, name: /quick access/i })).toBeInTheDocument();

    const links = within(region).getAllByRole("link");
    expect(links).toHaveLength(expectedLinksByRole.student.length);

    for (const link of links) {
      expect(link).toHaveAccessibleName();
    }
  });
});
