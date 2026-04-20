import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const { url } = await stripe.checkout.sessions.create({
      customer_email: user.email,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/generate`,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: { supabaseUserId: user.id },
    });

    return NextResponse.json(url);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
