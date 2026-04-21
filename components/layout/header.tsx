"use client";

import { getUserProfile } from "@/lib/supabase/getUserProfile";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./logout-button";

export default function Header() {
  const [plan, setPlan] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();

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

  const navLinks = [
    { href: "/generate", label: "Create" },
    ...(plan === "plus" ? [{ href: "/library", label: "Library" }] : []),
    { href: "/settings", label: "Settings" },
  ];

  return (
    <header className="flex items-center justify-between px-8 py-4 max-w-6xl mx-auto w-full">
      <Link
        href="/generate"
        className="font-heading text-2xl flex items-center gap-1.5"
        style={{ color: "var(--terra)" }}
      >
        Lullo
        {plan === "plus" && (
          <span
            className="text-[10px] font-sans font-semibold uppercase tracking-widest rounded-md px-1.5 py-0.5 mt-1"
            style={{
              color: "var(--terra)",
              background: "var(--terra-pale)",
              border: "1px solid rgba(196,102,58,0.3)",
            }}
          >
            Plus
          </span>
        )}
      </Link>

      <nav className="flex items-center gap-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg transition-all"
              style={{
                color: isActive ? "var(--terra)" : "var(--brown-mid)",
                background: isActive ? "var(--terra-pale)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          );
        })}

        {plan === "free" && (
          <button
            disabled={isLoading}
            onClick={handleUpgrade}
            className="text-[13px] font-semibold text-white px-4 py-1.5 rounded-lg transition-opacity hover:opacity-90 ml-1"
            style={{ background: "var(--terra)" }}
          >
            {isLoading ? "Redirecting..." : "Upgrade"}
          </button>
        )}

        <div className="ml-1">
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}
