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
      abilities: {
        Row: {
          cooldown: number
          id: string
          job: Database["public"]["Enums"]["job"]
          name: string
          stacks: number
        }
        Insert: {
          cooldown: number
          id?: string
          job?: Database["public"]["Enums"]["job"]
          name?: string
          stacks?: number
        }
        Update: {
          cooldown?: number
          id?: string
          job?: Database["public"]["Enums"]["job"]
          name?: string
          stacks?: number
        }
        Relationships: []
      }
      damages: {
        Row: {
          combined_damage: number
          gimmick: string
          id: string
          max_shared: number
          target: Database["public"]["Enums"]["damage_target"]
          type: Database["public"]["Enums"]["damage_type"]
        }
        Insert: {
          combined_damage: number
          gimmick: string
          id?: string
          max_shared?: number
          target?: Database["public"]["Enums"]["damage_target"]
          type?: Database["public"]["Enums"]["damage_type"]
        }
        Update: {
          combined_damage?: number
          gimmick?: string
          id?: string
          max_shared?: number
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
          }
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
        }
        Insert: {
          cast_at?: number | null
          id?: string
          name?: string
          prepare_at: number
          raid: string
          resolve_at?: number | null
        }
        Update: {
          cast_at?: number | null
          id?: string
          name?: string
          prepare_at?: number
          raid?: string
          resolve_at?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_mechanic_raid_fkey"
            columns: ["raid"]
            isOneToOne: false
            referencedRelation: "raids"
            referencedColumns: ["id"]
          }
        ]
      }
      mitigations: {
        Row: {
          _mitigation_id: number
          ability: string
          duration: number
          is_raidwide: boolean
          potency: number | null
          rate: number | null
          type: Database["public"]["Enums"]["mitigation_type"]
        }
        Insert: {
          _mitigation_id?: number
          ability: string
          duration: number
          is_raidwide?: boolean
          potency?: number | null
          rate?: number | null
          type?: Database["public"]["Enums"]["mitigation_type"]
        }
        Update: {
          _mitigation_id?: number
          ability?: string
          duration?: number
          is_raidwide?: boolean
          potency?: number | null
          rate?: number | null
          type?: Database["public"]["Enums"]["mitigation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "public_mitigations_ability_fkey"
            columns: ["ability"]
            isOneToOne: false
            referencedRelation: "abilities"
            referencedColumns: ["id"]
          }
        ]
      }
      raids: {
        Row: {
          category: Database["public"]["Enums"]["raid_category"]
          duration: number
          headcount: number
          id: string
          name: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["raid_category"]
          duration: number
          headcount: number
          id?: string
          name?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["raid_category"]
          duration?: number
          headcount?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      strategies: {
        Row: {
          author: string
          created_at: string
          id: string
          is_public: boolean
          likes: number
          modified_at: string
          name: string
          raid: string
        }
        Insert: {
          author?: string
          created_at?: string
          id?: string
          is_public?: boolean
          likes?: number
          modified_at?: string
          name?: string
          raid: string
        }
        Update: {
          author?: string
          created_at?: string
          id?: string
          is_public?: boolean
          likes?: number
          modified_at?: string
          name?: string
          raid?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_strategies_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_strategies_raid_fkey"
            columns: ["raid"]
            isOneToOne: false
            referencedRelation: "raids"
            referencedColumns: ["id"]
          }
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
          }
        ]
      }
      strategy_player_entries: {
        Row: {
          ability: string
          player: string
          use_at: number
        }
        Insert: {
          ability: string
          player: string
          use_at: number
        }
        Update: {
          ability?: string
          player?: string
          use_at?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_strategy_entries_mitigation_fkey"
            columns: ["ability"]
            isOneToOne: false
            referencedRelation: "abilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_strategy_player_entries_player_fkey"
            columns: ["player"]
            isOneToOne: false
            referencedRelation: "strategy_players"
            referencedColumns: ["id"]
          }
        ]
      }
      strategy_players: {
        Row: {
          id: string
          job: Database["public"]["Enums"]["job"]
          strategy: string
        }
        Insert: {
          id?: string
          job?: Database["public"]["Enums"]["job"]
          strategy: string
        }
        Update: {
          id?: string
          job?: Database["public"]["Enums"]["job"]
          strategy?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      damage_target: "Raidwide" | "Tankbuster"
      damage_type: "Physical" | "Magical" | "Unique"
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
      mitigation_type: "Physical" | "Magical" | "Barrier" | "Invuln"
      raid_category: "Savage" | "Ultimate" | "Trial" | "Raid" | "Dungeon"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
