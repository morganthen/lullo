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
        case "checkout.session.completed": {
          const session = event.data.object;
          const supabaseUserId = session.metadata?.supabaseUserId;

          if (supabaseUserId) {
            const { data, error, count } = await supabaseAdmin
              .from("profiles")
              .update(
                {
                  plan: "plus",
                  stripe_customer_id: session.customer as string,
                },
                { count: "exact" },
              )
              .eq("id", supabaseUserId);

            console.log("[webhook] checkout.session.completed", {
              data,
              supabaseUserId,
              count,
              error,
            });
          }
          break;
        }
        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          const customerId = subscription.customer;
          if (customerId) {
            const { data, error, count } = await supabaseAdmin
              .from("profiles")
              .update(
                {
                  plan: "free",
                  subscription_ends_at: null,
                },
                { count: "exact" },
              )
              .eq("stripe_customer_id", customerId);

            console.log("[webhook] checkout.session.deleted", {
              data,
              error,
              count,
              customerId,
            });
          }
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object;
          const customerId = subscription.customer;

          if (!customerId) break;

          const endsAt = subscription.cancel_at
            ? new Date(subscription.cancel_at * 1000).toISOString()
            : null;

          const { data, error, count } = await supabaseAdmin
            .from("profiles")
            .update(
              {
                subscription_ends_at: endsAt,
              },
              { count: "exact" },
            )
            .eq("stripe_customer_id", customerId);

          console.log("[webhook] checkout.session.updated", {
            data,
            error,
            count,
            customerId,
          });

          break;
        }
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
