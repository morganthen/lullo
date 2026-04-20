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
    <div>
      <h1>This is the settings page</h1>
      <Label>Email:</Label>
      <Input disabled value={userEmail} />
      {plan === "plus" ? (
        <Button onClick={handleManageSubscription}>Manage Subscription</Button>
      ) : null}
      {error && <p>{error}</p>}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and all your saved stories.
              {plan === "plus" && " You must cancel your subscription first."}
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
  );
}

// Free users see:
// - Account info
// - Delete account

// Plus users see:
// - Account info
// - Manage subscription (cancel, billing history)
// - Delete account
