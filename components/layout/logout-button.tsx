"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
    router.push("/");
  }

  return (
    <div>
      <Button onClick={handleLogout}>Log Out</Button>
    </div>
  );
}
