"use client";

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
    <main className="min-h-screen flex flex-col" style={{ background: "var(--cream)" }}>
      <header className="px-8 py-5 max-w-6xl w-full mx-auto">
        <Link href="/" className="font-heading text-2xl" style={{ color: "var(--terra)" }}>
          Lullo
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-sm text-center space-y-8">
          <div className="space-y-3">
            <h1 className="font-heading text-4xl" style={{ color: "var(--brown)" }}>
              Welcome to Lullo
            </h1>
            <p className="text-sm font-light leading-relaxed" style={{ color: "var(--brown-mid)" }}>
              Sign in to start creating bedtime stories for your little one.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={signInWithGoogle}
              className="w-full py-3 px-6 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--terra)", boxShadow: "0 2px 12px rgba(196,102,58,0.22)" }}
            >
              Continue with Google
            </button>
          </div>

          <p className="text-xs" style={{ color: "var(--brown-mid)", opacity: 0.7 }}>
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline">terms</Link>{" "}and{" "}
            <Link href="/privacy" className="underline">privacy policy</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
