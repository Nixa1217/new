import { create } from 'zustand';
import { authService } from '../services/auth';

interface User {
  id: string;
  email: string;
  user_metadata?: any;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  signUp: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { user } = await authService.signUp(email, password);
      set({
        user: user
          ? {
              id: user.id,
              email: user.email || '',
              user_metadata: user.user_metadata,
            }
          : null,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { user } = await authService.signIn(email, password);
      set({
        user: user
          ? {
              id: user.id,
              email: user.email || '',
              user_metadata: user.user_metadata,
            }
          : null,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await authService.signOut();
      set({ user: null, loading: false, error: null });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  setUser: (user: User | null) => set({ user }),

  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),

  initializeAuth: async () => {
    set({ loading: true });
    try {
      const user = await authService.getCurrentUser();
      set({
        user: user
          ? {
              id: user.id,
              email: user.email || '',
              user_metadata: user.user_metadata,
            }
          : null,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
