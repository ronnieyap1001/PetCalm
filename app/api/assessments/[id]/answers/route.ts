import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { computeScores } from "@/lib/scoring";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const answers = body?.answers as Record<string, number> | undefined;
  if (!answers)
    return NextResponse.json({ error: "Missing answers" }, { status: 400 });

  const result = computeScores(answers);

  const { error } = await supabase
    .from("assessments")
    .update({
      answers,
      dimension_scores: result.dimensionScores,
      overall_score: result.overall,
      profile_type: result.primary,
      secondary_profile_type: result.secondary || null,
      is_storm: result.storm,
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, result });
}
