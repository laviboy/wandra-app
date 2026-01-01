import { createClient } from "@supabase/supabase-js";
import "expo-sqlite/localStorage/install";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  "https://tomxahjmbfkcrfszuhpo.supabase.co";
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbXhhaGptYmZrY3Jmc3p1aHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDA1ODMsImV4cCI6MjA3ODA3NjU4M30.X6ewYi23Fhs4wkNLbL11crU4aIDXd5T5HjPMpMBopwA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
