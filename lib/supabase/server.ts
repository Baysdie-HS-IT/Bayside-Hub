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
      events: {
        Row: {
          id: string;
          club_id: string | null;
          title: string;
          description: string;
          location: string | null;
          starts_at: string;
          ends_at: string | null;
          capacity: number | null;
          tags: string[] | null;
          status: "draft" | "published" | "cancelled";
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          club_id?: string | null;
          title: string;
          description?: string;
          location?: string | null;
          starts_at: string;
          ends_at?: string | null;
          capacity?: number | null;
          tags?: string[] | null;
          status?: "draft" | "published" | "cancelled";
          created_by?: string | null;
        };
        Update: {
          title?: string;
          description?: string;
          location?: string | null;
          starts_at?: string;
          ends_at?: string | null;
          capacity?: number | null;
          status?: "draft" | "published" | "cancelled";
        };
        Relationships: [];
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          attendee_name: string;
          attendee_email: string;
          registered_at: string;
        };
        Insert: {
          event_id: string;
          user_id: string;
          attendee_name: string;
          attendee_email: string;
        };
        Update: {
          attendee_name?: string;
          attendee_email?: string;
        };
        Relationships: [];
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
