import { createClient } from "@supabase/supabase-js";
import "expo-sqlite/localStorage/install";

const supabaseUrl = "https://tomxahjmbfkcrfszuhpo.supabase.co";
const supabasePublishableKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbXhhaGptYmZrY3Jmc3p1aHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDA1ODMsImV4cCI6MjA3ODA3NjU4M30.X6ewYi23Fhs4wkNLbL11crU4aIDXd5T5HjPMpMBopwA";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// PUBLIC_SUPABASE_URL=https://tomxahjmbfkcrfszuhpo.supabase.co
// PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbXhhaGptYmZrY3Jmc3p1aHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDA1ODMsImV4cCI6MjA3ODA3NjU4M30.X6ewYi23Fhs4wkNLbL11crU4aIDXd5T5HjPMpMBopwA
// SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvbXhhaGptYmZrY3Jmc3p1aHBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjUwMDU4MywiZXhwIjoyMDc4MDc2NTgzfQ.-LuYolzbyzD_MU3M9IvMiGpgehafjt9dlvezzVX1rc8
