"use client";

import { getUserProfile } from "@/lib/supabase/getUserProfile";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import LogoutButton from "./logout-button";

export default function Header() {
  const [plan, setPlan] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadProfile() {
      const profile = await getUserProfile();
      if (profile) {
        setPlan(profile.plan);
      }
    }
    loadProfile();
  }, []);

  async function handleUpgrade() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to upgrade plan");
      }
      const url = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error("Error upgrading:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <header className="bg-background flex items-center justify-between px-6 py-4 border-b">
      <div>
        <Link href="/generate" className="font-bold text-lg">
          {plan === "plus" ? (
            <span>
              Lullo{" "}
              <span className="text-sm font-normal text-accent">plus</span>
            </span>
          ) : (
            "Lullo"
          )}
        </Link>
      </div>
      <nav>
        <ul className="flex gap-6 list-none">
          <li>
            <Link href="/generate">Generate</Link>
          </li>
          {plan === "plus" && (
            <li>
              <Link href="/library">Library</Link>
            </li>
          )}
          <li>
            <Link href="/settings">Settings</Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center gap-3">
        {plan === "free" && (
          <Button disabled={isLoading} onClick={handleUpgrade}>
            {isLoading ? "Redirecting..." : "Upgrade to Lullo Plus"}
          </Button>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}
