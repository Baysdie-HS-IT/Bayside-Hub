export type PermissionClient = {
  from(table: "club_board_members"): {
    select(
      columns: string,
      options: { count: "exact"; head: true }
    ): {
      eq(column: "club_id", value: string): {
        eq(
          column: "user_id",
          value: string
        ): PromiseLike<{ count: number | null; error: { message: string } | null }>;
      };
    };
  };
};

export type PermissionUser = Readonly<{
  id: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}>;

export async function canCreateClubAnnouncement(
  supabase: PermissionClient,
  user: PermissionUser,
  clubId: string
): Promise<boolean> {
  const role = user.app_metadata?.role ?? user.user_metadata?.role;

  if (role === "admin") {
    return true;
  }

  const { count, error } = await supabase
    .from("club_board_members")
    .select("id", { count: "exact", head: true })
    .eq("club_id", clubId)
    .eq("user_id", user.id);

  return !error && (count ?? 0) > 0;
}
