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
          console.log("✅ checkout.session.completed received");
          console.log("Metadata:", session.metadata);
          const supabaseUserId = session.metadata?.supabaseUserId;
          console.log("supabaseUserId:", supabaseUserId);

          if (supabaseUserId) {
            console.log("Updating plan for user:", supabaseUserId);
            const { error } = await supabaseAdmin
              .from("profiles")
              .update({ plan: "plus" })
              .eq("id", supabaseUserId);
            console.log("Update error:", error);
            console.log("Update complete");
          } else {
            console.log("❌ No supabaseUserId found in metadata");
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
