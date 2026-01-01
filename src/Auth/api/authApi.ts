import { supabase } from "../../../utils/supabase";
import type {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
} from "../types/auth";

export const authApi = {
  /**
   * Login with Supabase Auth
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error("Invalid email or password");
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email!.split("@")[0],
        createdAt: data.user.created_at,
      },
      token: data.session.access_token,
    };
  },

  /**
   * Signup with Supabase Auth
   */
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error(
        "Signup failed. Please check your email to confirm your account."
      );
    }

    // Add user to users table (only happens on signup, not login)
    const { error: upsertError } = await supabase.from("users").upsert(
      {
        id: data.user.id,
        email: data.user.email!,
        name: credentials.name,
        role: "traveler", // Default role for new signups
        email_verified: data.user.email_confirmed_at || null,
        created_at: data.user.created_at,
      },
      {
        onConflict: "id",
      }
    );

    if (upsertError) {
      throw new Error(`Failed to create user profile: ${upsertError.message}`);
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: credentials.name,
        createdAt: data.user.created_at,
      },
      token: data.session.access_token,
    };
  },

  /**
   * Logout with Supabase Auth
   */
  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Get current session
   */
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(error.message);
    }
    return data.session;
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }
    return user;
  },
};
