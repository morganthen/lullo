import { createClient } from "@/lib/supabase/client";

export type UserProfile = {
  plan: string;
  generations_used: number;
  subscription_ends_at: string | null;
};

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan, generations_used, subscription_ends_at")
    .eq("id", user.id)
    .single();

  if (profileError) return null;

  return profile;
}
