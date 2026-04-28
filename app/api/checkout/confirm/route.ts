import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { assessmentId, sessionId } = await req.json();
  if (!assessmentId || !sessionId)
    return NextResponse.json({ error: "Missing data" }, { status: 400 });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    // Without Stripe configured, the mock checkout has already marked it paid.
    return NextResponse.json({ ok: true });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(stripeKey);
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    return NextResponse.json(
      { error: "Payment not completed" },
      { status: 400 }
    );
  }

  const cohort = (session.metadata?.ab_cohort as string) || null;
  const priceCents = parseInt(
    (session.metadata?.price_cents as string) || "1990",
    10
  );

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
    .eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
