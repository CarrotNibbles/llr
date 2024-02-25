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
      mechanics: {
        Row: {
          damage: Json
          id: string
          name: string
          prepare_at: number
          raid: string
          resolve_at: number
        }
        Insert: {
          damage: Json
          id?: string
          name?: string
          prepare_at: number
          raid: string
          resolve_at: number
        }
        Update: {
          damage?: Json
          id?: string
          name?: string
          prepare_at?: number
          raid?: string
          resolve_at?: number
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
          id: string
          job: Database["public"]["Enums"]["job"]
          name: string
          reduction: Json
        }
        Insert: {
          id?: string
          job?: Database["public"]["Enums"]["job"]
          name?: string
          reduction: Json
        }
        Update: {
          id?: string
          job?: Database["public"]["Enums"]["job"]
          name?: string
          reduction?: Json
        }
        Relationships: []
      }
      raids: {
        Row: {
          duration: number
          headcount: number
          id: string
          name: string
        }
        Insert: {
          duration: number
          headcount: number
          id?: string
          name?: string
        }
        Update: {
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
          party: Database["public"]["Enums"]["job"][]
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
          party: Database["public"]["Enums"]["job"][]
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
          party?: Database["public"]["Enums"]["job"][]
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
      strategy_entries: {
        Row: {
          mitigation: string
          strategy: string
          use_at: number
        }
        Insert: {
          mitigation: string
          strategy: string
          use_at: number
        }
        Update: {
          mitigation?: string
          strategy?: string
          use_at?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_strategy_entries_mitigation_fkey"
            columns: ["mitigation"]
            isOneToOne: false
            referencedRelation: "mitigations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_strategy_entries_strategy_fkey"
            columns: ["strategy"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
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
