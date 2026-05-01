export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          id: string;
          scope: "global" | "club" | "class";
          club_id: string | null;
          class_id: string | null;
          author_id: string | null;
          title: string;
          body: string;
          published_at: string;
        };
        Insert: {
          scope: "global" | "club" | "class";
          club_id?: string | null;
          class_id?: string | null;
          author_id?: string | null;
          title: string;
          body: string;
        };
        Update: {
          title?: string;
          body?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          }
        ];
      };
      club_board_members: {
        Row: {
          id: string;
          club_id: string;
          user_id: string;
        };
        Insert: {
          club_id: string;
          user_id: string;
        };
        Update: {
          club_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      announcement_scope: "global" | "club" | "class";
    };
    CompositeTypes: Record<string, never>;
  };
};
