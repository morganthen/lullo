import LogoutButton from "@/components/layout/logout-button";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  return (
    <div>
      <p>Hello {data?.claims?.email ?? "stranger"}</p>
      <LogoutButton />
    </div>
  );
}
