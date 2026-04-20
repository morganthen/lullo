import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) throw new Error("No signature found");

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    try {
      const event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          const supabaseUserId = session.metadata?.supabaseUserId;

          if (supabaseUserId) {
            await supabaseAdmin
              .from("profiles")
              .update({
                plan: "plus",
                stripe_customer_id: session.customer as string,
              })
              .eq("id", supabaseUserId);
          }
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (stripeError) {
      return NextResponse.json(
        { msg: `⚠️ Webhook signature verification failed. ${stripeError}` },
        { status: 500 },
      );
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { msg: `Something went wrong: ${err}` },
      { status: 500 },
    );
  }
}
