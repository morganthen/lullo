"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  async function signInWithGoogle() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.log(error);
      router.push("/auth/auth-code-error");
    }

    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-6 py-5 max-w-6xl w-full mx-auto">
        <Link href="/" className="font-heading text-2xl font-bold">
          Lullo
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="space-y-3">
            <h1 className="font-heading text-4xl font-bold">
              Welcome to Lullo
            </h1>
            <p className="text-muted-foreground">
              Sign in to start creating bedtime stories for your little one.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={signInWithGoogle}
              size="lg"
              className="w-full rounded-full"
            >
              Continue with Google
            </Button>
            {/* <Button className="w-full rounded-full" size="lg" variant="outline">
              Continue with Apple
            </Button> */}
          </div>

          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline">
              terms{" "}
            </Link>
            and
            <Link href="/privacy" className="underline">
              {" "}
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
