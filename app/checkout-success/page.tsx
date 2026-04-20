"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  //delay 3 seconds then reroute to /generate
  useEffect(() => {
    setTimeout(() => {
      router.push("/generate");
    }, 3000);
  }, []);
  return (
    <div>
      <h1>Welcome to Lullo Plus!</h1>
      <p>Redirecting you back...</p>
    </div>
  );
}
