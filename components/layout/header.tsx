"use client";

import { getUserProfile } from "@/lib/supabase/getUserProfile";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
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

  const upgradeButton = plan === "free" && (
    <button
      disabled={isLoading}
      onClick={handleUpgrade}
      className="text-[13px] font-semibold text-white px-4 py-1.5 rounded-lg transition-opacity hover:opacity-90"
      style={{ background: "var(--terra)" }}
    >
      {isLoading ? "Redirecting..." : "Upgrade"}
    </button>
  );

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

      <nav className="hidden md:flex items-center gap-2">
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

        {upgradeButton && <div className="ml-1">{upgradeButton}</div>}

        <div className="ml-1">
          <LogoutButton />
        </div>
      </nav>

      <div className="md:hidden">
        <Menubar className="border-none bg-transparent p-0 h-auto">
          <MenubarMenu>
            <MenubarTrigger
              aria-label="Open menu"
              className="p-2 rounded-lg data-[state=open]:bg-[var(--terra-pale)] focus:bg-[var(--terra-pale)]"
              style={{ color: "var(--brown-mid)" }}
            >
              <Menu size={22} />
            </MenubarTrigger>
            <MenubarContent align="end" sideOffset={8} className="min-w-48">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <MenubarItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="w-full cursor-pointer"
                      style={{
                        color: isActive
                          ? "var(--terra)"
                          : "var(--brown-mid)",
                        background: isActive
                          ? "var(--terra-pale)"
                          : "transparent",
                      }}
                    >
                      {link.label}
                    </Link>
                  </MenubarItem>
                );
              })}

              <MenubarSeparator />

              {plan === "free" && (
                <MenubarItem
                  onSelect={(e) => {
                    e.preventDefault();
                    handleUpgrade();
                  }}
                  disabled={isLoading}
                  className="font-semibold"
                  style={{ color: "var(--terra)" }}
                >
                  {isLoading ? "Redirecting..." : "Upgrade"}
                </MenubarItem>
              )}

              <MenubarItem asChild>
                <div className="w-full">
                  <LogoutButton />
                </div>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </header>
  );
}
