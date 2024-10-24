export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      actions: {
        Row: {
          available_level: number
          cooldown: number
          deleted_subversion: number | null
          deleted_version: number | null
          id: string
          is_gcd: boolean
          job: Database["public"]["Enums"]["job"]
          name: string
          priority: number
          semantic_key: string
          stacks: number
          superseding_level: number | null
          updated_subversion: number
          updated_version: number
        }
        Insert: {
          available_level: number
          cooldown: number
          deleted_subversion?: number | null
          deleted_version?: number | null
          id?: string
          is_gcd: boolean
          job?: Database["public"]["Enums"]["job"]
          name?: string
          priority: number
          semantic_key?: string
          stacks?: number
          superseding_level?: number | null
          updated_subversion: number
          updated_version: number
        }
        Update: {
          available_level?: number
          cooldown?: number
          deleted_subversion?: number | null
          deleted_version?: number | null
          id?: string
          is_gcd?: boolean
          job?: Database["public"]["Enums"]["job"]
          name?: string
          priority?: number
          semantic_key?: string
          stacks?: number
          superseding_level?: number | null
          updated_subversion?: number
          updated_version?: number
        }
        Relationships: []
      }
      anon_likes: {
        Row: {
          created_at: string
          ip_addr: string
          strategy: string
        }
        Insert: {
          created_at?: string
          ip_addr: string
          strategy?: string
        }
        Update: {
          created_at?: string
          ip_addr?: string
          strategy?: string
        }
        Relationships: [
          {
            foreignKeyName: "anon_likes_strategy_fkey"
            columns: ["strategy"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      damages: {
        Row: {
          combined_damage: number
          gimmick: string
          id: string
          max_shared: number
          num_targets: number
          target: Database["public"]["Enums"]["damage_target"]
          type: Database["public"]["Enums"]["damage_type"]
        }
        Insert: {
          combined_damage: number
          gimmick: string
          id?: string
          max_shared: number
          num_targets: number
          target?: Database["public"]["Enums"]["damage_target"]
          type?: Database["public"]["Enums"]["damage_type"]
        }
        Update: {
          combined_damage?: number
          gimmick?: string
          id?: string
          max_shared?: number
          num_targets?: number
          target?: Database["public"]["Enums"]["damage_target"]
          type?: Database["public"]["Enums"]["damage_type"]
        }
        Relationships: [
          {
            foreignKeyName: "public_damages_gimmick_fkey"
            columns: ["gimmick"]
            isOneToOne: false
            referencedRelation: "gimmicks"
            referencedColumns: ["id"]
          },
        ]
      }
      gimmicks: {
        Row: {
          cast_at: number | null
          id: string
          name: string
          prepare_at: number
          raid: string
          resolve_at: number | null
          semantic_key: string
          type: Database["public"]["Enums"]["gimmick_type"]
        }
        Insert: {
          cast_at?: number | null
          id?: string
          name?: string
          prepare_at: number
          raid: string
          resolve_at?: number | null
          semantic_key?: string
          type?: Database["public"]["Enums"]["gimmick_type"]
        }
        Update: {
          cast_at?: number | null
          id?: string
          name?: string
          prepare_at?: number
          raid?: string
          resolve_at?: number | null
          semantic_key?: string
          type?: Database["public"]["Enums"]["gimmick_type"]
        }
        Relationships: [
          {
            foreignKeyName: "public_mechanic_raid_fkey"
            columns: ["raid"]
            isOneToOne: false
            referencedRelation: "raids"
            referencedColumns: ["id"]
          },
        ]
      }
      like_counts: {
        Row: {
          anon_likes: number
          strategy: string
          total_likes: number
          user_likes: number
        }
        Insert: {
          anon_likes?: number
          strategy?: string
          total_likes?: number
          user_likes?: number
        }
        Update: {
          anon_likes?: number
          strategy?: string
          total_likes?: number
          user_likes?: number
        }
        Relationships: [
          {
            foreignKeyName: "like_counts_strategy_fkey"
            columns: ["strategy"]
            isOneToOne: true
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      mitigations: {
        Row: {
          _mitigation_id: number
          action: string
          duration: number
          is_raidwide: boolean
          potency: number | null
          rate: number | null
          type: Database["public"]["Enums"]["mitigation_type"]
        }
        Insert: {
          _mitigation_id?: number
          action: string
          duration: number
          is_raidwide?: boolean
          potency?: number | null
          rate?: number | null
          type?: Database["public"]["Enums"]["mitigation_type"]
        }
        Update: {
          _mitigation_id?: number
          action?: string
          duration?: number
          is_raidwide?: boolean
          potency?: number | null
          rate?: number | null
          type?: Database["public"]["Enums"]["mitigation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "public_mitigations_ability_fkey"
            columns: ["action"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          display_name: string | null
          id: string
        }
        Insert: {
          display_name?: string | null
          id: string
        }
        Update: {
          display_name?: string | null
          id?: string
        }
        Relationships: []
      }
      raids: {
        Row: {
          category: Database["public"]["Enums"]["raid_category"]
          duration: number
          headcount: number
          id: string
          item_level: number
          level: number
          name: string
          semantic_key: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["raid_category"]
          duration: number
          headcount: number
          id?: string
          item_level: number
          level: number
          name?: string
          semantic_key?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["raid_category"]
          duration?: number
          headcount?: number
          id?: string
          item_level?: number
          level?: number
          name?: string
          semantic_key?: string
        }
        Relationships: []
      }
      strategies: {
        Row: {
          author: string | null
          created_at: string
          id: string
          is_editable: boolean
          is_public: boolean
          modified_at: string
          name: string
          password: string | null
          raid: string
          subversion: number
          version: number
        }
        Insert: {
          author?: string | null
          created_at?: string
          id?: string
          is_editable?: boolean
          is_public?: boolean
          modified_at?: string
          name?: string
          password?: string | null
          raid: string
          subversion: number
          version: number
        }
        Update: {
          author?: string | null
          created_at?: string
          id?: string
          is_editable?: boolean
          is_public?: boolean
          modified_at?: string
          name?: string
          password?: string | null
          raid?: string
          subversion?: number
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_strategies_raid_fkey"
            columns: ["raid"]
            isOneToOne: false
            referencedRelation: "raids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategies_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_damage_options: {
        Row: {
          damage: string
          num_shared: number | null
          primary_target: string | null
          strategy: string
        }
        Insert: {
          damage: string
          num_shared?: number | null
          primary_target?: string | null
          strategy: string
        }
        Update: {
          damage?: string
          num_shared?: number | null
          primary_target?: string | null
          strategy?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_strategy_damage_options_damage_fkey"
            columns: ["damage"]
            isOneToOne: false
            referencedRelation: "damages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_strategy_damage_options_primary_target_fkey"
            columns: ["primary_target"]
            isOneToOne: false
            referencedRelation: "strategy_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_strategy_gimmick_shared_strategy_fkey"
            columns: ["strategy"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_player_entries: {
        Row: {
          action: string
          id: string
          player: string
          use_at: number
        }
        Insert: {
          action: string
          id?: string
          player: string
          use_at: number
        }
        Update: {
          action?: string
          id?: string
          player?: string
          use_at?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_strategy_entries_mitigation_fkey"
            columns: ["action"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_strategy_player_entries_player_fkey"
            columns: ["player"]
            isOneToOne: false
            referencedRelation: "strategy_players"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_players: {
        Row: {
          id: string
          job: Database["public"]["Enums"]["job"] | null
          order: number
          strategy: string
        }
        Insert: {
          id?: string
          job?: Database["public"]["Enums"]["job"] | null
          order: number
          strategy: string
        }
        Update: {
          id?: string
          job?: Database["public"]["Enums"]["job"] | null
          order?: number
          strategy?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_strategy_players_strategy_fkey"
            columns: ["strategy"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_likes: {
        Row: {
          liked_by: string
          strategy: string
        }
        Insert: {
          liked_by: string
          strategy: string
        }
        Update: {
          liked_by?: string
          strategy?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_strategy_fkey"
            columns: ["strategy"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_likes_liked_by_fkey"
            columns: ["liked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_strategies: {
        Args: {
          q?: string
          raid_skey?: string
          patch?: Json
          jobs?: Database["public"]["Enums"]["job"][]
        }
        Returns: number
      }
      get_strategy_players: {
        Args: {
          strategy_id: string
        }
        Returns: Json
      }
      select_strategies: {
        Args: {
          q?: string
          raid_skey?: string
          patch?: Json
          jobs?: Database["public"]["Enums"]["job"][]
          sort?: string
          page?: number
          lim?: number
        }
        Returns: {
          id: string
          name: string
          version: number
          subversion: number
          modified_at: string
          created_at: string
          raid_name: string
          raid_semantic_key: string
          total_likes: number
          strategy_players: Json
          author_display_name: string
        }[]
      }
      update_modified_at: {
        Args: {
          strategy_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      damage_target: "Raidwide" | "Tankbuster"
      damage_type: "Physical" | "Magical" | "Unique"
      gimmick_type:
        | "Raidwide"
        | "Tankbuster"
        | "AutoAttack"
        | "Avoidable"
        | "Hybrid"
        | "Enrage"
      job:
        | "PLD"
        | "WAR"
        | "DRK"
        | "GNB"
        | "WHM"
        | "AST"
        | "SCH"
        | "SGE"
        | "MNK"
        | "DRG"
        | "NIN"
        | "SAM"
        | "RPR"
        | "BRD"
        | "MCH"
        | "DNC"
        | "BLM"
        | "RDM"
        | "SMN"
        | "BLU"
        | "LB"
        | "PCT"
        | "VPR"
      mitigation_type:
        | "Physical"
        | "Magical"
        | "Barrier"
        | "Invuln"
        | "Support"
        | "ActiveAmp"
        | "PassiveAmp"
      raid_category: "Savage" | "Ultimate" | "Trial" | "Raid" | "Dungeon"
    }
    CompositeTypes: {
      selected_strategy_player: {
        id: string | null
        job: Database["public"]["Enums"]["job"] | null
        order: number | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
