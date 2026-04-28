import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !whSecret) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(stripeKey);

  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig!, whSecret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const assessmentId = session.metadata?.assessment_id;
    const userId = session.metadata?.user_id;
    const priceCents = parseInt(session.metadata?.price_cents || "1990", 10);
    const cohort = session.metadata?.ab_cohort || null;

    if (assessmentId && userId) {
      const supabase = createSupabaseServiceClient();
      await supabase
        .from("assessments")
        .update({
          paid: true,
          paid_amount_cents: priceCents,
          ab_cohort: cohort,
          paid_at: new Date().toISOString(),
          payment_provider: "stripe",
          stripe_session_id: session.id,
        })
        .eq("id", assessmentId)
        .eq("user_id", userId);
    }
  }

  return NextResponse.json({ received: true });
}
