import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { pickPrice } from "@/lib/pricing";

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { assessmentId } = await req.json();
  if (!assessmentId)
    return NextResponse.json({ error: "Missing assessmentId" }, { status: 400 });

  const { data: assessment, error: assessErr } = await supabase
    .from("assessments")
    .select("id, pet_name, paid")
    .eq("id", assessmentId)
    .eq("user_id", user.id)
    .single();
  if (assessErr || !assessment)
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  if (assessment.paid)
    return NextResponse.json({
      url: `${getOrigin(req)}/report/${assessmentId}`,
    });

  const { priceCents, cohort } = pickPrice(user.id);

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey) {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey);
    const origin = getOrigin(req);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: priceCents,
            product_data: {
              name: `${assessment.pet_name}'s Anxiety Report`,
              description:
                "Personalised pet anxiety report including action plan and PDF export.",
            },
          },
        },
      ],
      success_url: `${origin}/report/${assessmentId}?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/results/${assessmentId}`,
      metadata: {
        assessment_id: assessmentId,
        user_id: user.id,
        ab_cohort: cohort,
        price_cents: String(priceCents),
      },
    });
    return NextResponse.json({ url: session.url });
  }

  // No Stripe configured — mock checkout for local development.
  await supabase
    .from("assessments")
    .update({
      paid: true,
      paid_amount_cents: priceCents,
      ab_cohort: cohort,
      paid_at: new Date().toISOString(),
      payment_provider: "mock",
    })
    .eq("id", assessmentId)
    .eq("user_id", user.id);

  return NextResponse.json({ mockSuccess: true });
}

function getOrigin(req: Request) {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env;
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}
