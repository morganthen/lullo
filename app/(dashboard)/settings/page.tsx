"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { getUserProfile } from "@/lib/supabase/getUserProfile";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [plan, setPlan] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const [
        profile,
        {
          data: { user },
        },
      ] = await Promise.all([getUserProfile(), supabase.auth.getUser()]);
      if (profile) setPlan(profile.plan);
      if (user?.email) setUserEmail(user.email);
    }
    loadData();
  }, []);

  async function handleDeleteAccount() {
    //plus users need to cancel their subscription first
    if (plan === "plus") {
      setError(
        "Please cancel your Lullo Plus subscription before deleting your account.",
      );
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
      });

      if (!response.ok) throw Error("Something went wrong deleting account");

      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleManageSubscription() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });

      if (!response.ok) {
        throw Error("Something went wrong");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      console.error("Something went wrong", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-1">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your account.</p>
        </div>

        <div className="bg-card border rounded-2xl p-5 space-y-4">
          <h2 className="font-heading text-lg font-semibold">Account</h2>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input disabled value={userEmail} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Plan</p>
              <p className="text-xs text-muted-foreground">
                {plan === "plus"
                  ? "Lullo Plus - unlimited stories"
                  : "Free - 3 stories per month"}
              </p>
            </div>
            {plan === "plus" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageSubscription}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Manage"}
              </Button>
            )}
          </div>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="bg-card border rounded-2xl p-5 space-y-4">
          <h2 className="font-heading text-lg font-semibold">Danger zone</h2>
          <p className="text-sm text-muted-foreground">
            Deleting your account is permanent and cannot be undone.
            {plan === "plus" && " Cancel your subscription first."}
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and all your saved
                  stories.
                  {plan === "plus" &&
                    "You must cancel your subscription first."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isLoading}
                  variant="destructive"
                  onClick={handleDeleteAccount}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </main>
  );
}

// Free users see:
// - Account info
// - Delete account

// Plus users see:
// - Account info
// - Manage subscription (cancel, billing history)
// - Delete account
