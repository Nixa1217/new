import { create } from 'zustand';
import { supabase } from '../services/supabase';

interface UserProfile {
  id: string;
  user_id: string;
  preferred_name: string | null;
  identity_summary: string | null;
  life_purpose_summary: string | null;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
}

interface ProfileStore {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      set({ profile: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .update(updates)
        .eq('id', updates.id)
        .select()
        .single();

      if (error) throw error;
      set({ profile: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  setProfile: (profile: UserProfile | null) => set({ profile }),

  clearProfile: () => set({ profile: null }),
}));
