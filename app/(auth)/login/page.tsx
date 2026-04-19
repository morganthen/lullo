"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  async function signInWithGoogle() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Must point to your auth callback route
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.log(error);
      router.push("/auth/auth-code-error");
    }

    //manually redirect user to providers login page
    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to via Google</CardTitle>
      </CardHeader>
      <CardFooter className="grid">
        {/*only enable after securing Apple Developer account */}
        {/* <Button className="w-full">Continue with Apple</Button> */}
        <Button className="w-full" onClick={signInWithGoogle}>
          Continue with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
