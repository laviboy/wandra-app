import { create } from "zustand";
import { supabase } from "../../../utils/supabase";
import type { User } from "../types/auth";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
  isInitialized: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setToken: (token) => set({ token }),

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  initialize: async () => {
    try {
      set({ isLoading: true });

      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // console.log("Initial session:", session);

      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name,
            createdAt: session.user.created_at,
          },
          token: session.access_token,
          isAuthenticated: true,
          isInitialized: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitialized: true,
          isLoading: false,
        });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.full_name,
              createdAt: session.user.created_at,
            },
            token: session.access_token,
            isAuthenticated: true,
          });
        } else {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      });
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false,
      });
    }
  },
}));
