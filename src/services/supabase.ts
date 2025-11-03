import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profile: {
        Row: {
          id: string;
          user_id: string;
          preferred_name: string | null;
          identity_summary: string | null;
          life_purpose_summary: string | null;
          subscription_tier: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          preferred_name?: string | null;
          identity_summary?: string | null;
          life_purpose_summary?: string | null;
          subscription_tier?: string;
        };
        Update: {
          preferred_name?: string | null;
          identity_summary?: string | null;
          life_purpose_summary?: string | null;
          subscription_tier?: string;
          updated_at?: string;
        };
      };
      daily_reflection: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          content: string | null;
          mood: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          date: string;
          content?: string | null;
          mood?: string | null;
        };
        Update: {
          content?: string | null;
          mood?: string | null;
          updated_at?: string;
        };
      };
      journal_entry: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          title: string | null;
          content: string;
          prompt: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          date: string;
          title?: string | null;
          content: string;
          prompt?: string | null;
        };
        Update: {
          title?: string | null;
          content?: string;
          prompt?: string | null;
          updated_at?: string;
        };
      };
      vision_board: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string | null;
          image_url: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description?: string | null;
          category?: string | null;
          image_url?: string | null;
          status?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          category?: string | null;
          image_url?: string | null;
          status?: string;
          updated_at?: string;
        };
      };
      goal_action_session: {
        Row: {
          id: string;
          user_id: string;
          goal: string;
          actions: any;
          core_identity: string | null;
          emotional_state: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          goal: string;
          actions?: any;
          core_identity?: string | null;
          emotional_state?: string | null;
        };
        Update: {
          goal?: string;
          actions?: any;
          core_identity?: string | null;
          emotional_state?: string | null;
          updated_at?: string;
        };
      };
      weekly_reflection: {
        Row: {
          id: string;
          user_id: string;
          week_start_date: string;
          reflection_content: string | null;
          key_learnings: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          week_start_date: string;
          reflection_content?: string | null;
          key_learnings?: any;
        };
        Update: {
          reflection_content?: string | null;
          key_learnings?: any;
          updated_at?: string;
        };
      };
      morning_reflection: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          intention: string | null;
          frequency_setting: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          date: string;
          intention?: string | null;
          frequency_setting?: string | null;
        };
        Update: {
          intention?: string | null;
          frequency_setting?: string | null;
          updated_at?: string;
        };
      };
      identity_rep: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          identity_level: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description?: string | null;
          identity_level?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          identity_level?: string | null;
          updated_at?: string;
        };
      };
      embodiment_mirror: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          reflection_content: string | null;
          physical_state: string | null;
          emotional_state: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          date: string;
          reflection_content?: string | null;
          physical_state?: string | null;
          emotional_state?: string | null;
        };
        Update: {
          reflection_content?: string | null;
          physical_state?: string | null;
          emotional_state?: string | null;
          updated_at?: string;
        };
      };
      seven_layers_session: {
        Row: {
          id: string;
          user_id: string;
          topic: string;
          layers: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          topic: string;
          layers?: any;
        };
        Update: {
          topic?: string;
          layers?: any;
          updated_at?: string;
        };
      };
      alchemist_forge_session: {
        Row: {
          id: string;
          user_id: string;
          challenge: string;
          transmutation: any;
          wisdom: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          challenge: string;
          transmutation?: any;
          wisdom?: string | null;
        };
        Update: {
          challenge?: string;
          transmutation?: any;
          wisdom?: string | null;
          updated_at?: string;
        };
      };
      flow_command_session: {
        Row: {
          id: string;
          user_id: string;
          command: string;
          response: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          command: string;
          response?: string | null;
        };
        Update: {
          command?: string;
          response?: string | null;
          updated_at?: string;
        };
      };
    };
  };
};
