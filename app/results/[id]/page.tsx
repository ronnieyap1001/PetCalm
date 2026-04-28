import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PROFILE_TYPES, DIMENSION_LABELS } from "@/lib/quiz";
import { topInsights, severityOf } from "@/lib/scoring";
import RadarChart from "@/components/RadarChart";
import UnlockButton from "./UnlockButton";

export default async function ResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: a } = await supabase
    .from("assessments")
    .select(
      "id, pet_name, breed, profile_type, secondary_profile_type, is_storm, dimension_scores, overall_score, status, paid"
    )
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!a) notFound();
  if (a.status !== "completed") redirect(`/quiz/${a.id}`);
  if (a.paid) redirect(`/report/${a.id}`);

  const profile = PROFILE_TYPES[a.profile_type as keyof typeof PROFILE_TYPES];
  const dimensionScores = (a.dimension_scores || []) as {
    dimension: string;
    score: number;
  }[];
  const insights = topInsights(
    {
      dimensionScores: dimensionScores as any,
      overall: a.overall_score,
      overallSeverity: severityOf(a.overall_score),
      primary: a.profile_type,
      secondary: a.secondary_profile_type || undefined,
      storm: a.is_storm,
    },
    a.pet_name
  );

  return (
    <div className="mx-auto max-w-3xl py-6">
      <p className="text-sm font-semibold text-coral">
        Step 3 of 3 — Your pet's profile
      </p>
      <div
        className="mt-3 overflow-hidden rounded-3xl p-8 text-center"
        style={{ backgroundColor: profile.color, color: profile.textColor }}
      >
        <div className="text-4xl">{profile.icon}</div>
        <h1 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
          {a.pet_name} is {profile.name}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base opacity-95">
          {profile.description}
        </p>
        <p className="mt-4 text-sm opacity-90">
          <em>Signature behaviour:</em> {profile.signature}
        </p>
      </div>

      <div className="card mt-6">
        <h2 className="font-serif text-xl font-bold">Anxiety profile chart</h2>
        <p className="mt-1 text-sm text-charcoal/70">
          Your pet's score across the 5 dimensions of anxiety.
        </p>
        <RadarChart
          scores={dimensionScores as any}
          color={profile.color}
          size={340}
        />
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
          {dimensionScores.map((d) => (
            <div
              key={d.dimension}
              className="flex items-center justify-between rounded-xl border border-charcoal/10 px-4 py-2 text-sm"
            >
              <span className="font-medium">
                {DIMENSION_LABELS[d.dimension as keyof typeof DIMENSION_LABELS]}
              </span>
              <span className="font-semibold">{d.score}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="font-serif text-xl font-bold">Top insights</h2>
        <ul className="mt-3 space-y-2 text-charcoal/80">
          {insights.map((i, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-coral" />
              <span>{i}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-charcoal/60">
          Overall anxiety index: <strong>{a.overall_score}%</strong> (
          {severityOf(a.overall_score)})
        </p>
      </div>

      <div className="card mt-6 border-coral/40 bg-gradient-to-br from-coral/5 to-cream">
        <h2 className="font-serif text-2xl font-bold">
          Unlock {a.pet_name}'s full Anxiety Report
        </h2>
        <p className="mt-2 text-charcoal/80">
          15 pages of personalised analysis, root-cause insights, breed-specific
          guidance, and a step-by-step action plan built for {a.pet_name}.
        </p>
        <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            {
              t: "Root Cause Analysis",
              d: `Why ${a.pet_name} developed this pattern — breed predisposition, environment, and history.`,
            },
            {
              t: "Personalised Action Plan",
              d: `Week-by-week guidance tailored to ${profile.name} pets.`,
            },
            {
              t: "Breed-Specific Insights",
              d: `How ${a.breed} pets typically experience anxiety — and what works for them.`,
            },
          ].map((c) => (
            <li
              key={c.t}
              className="rounded-xl border border-charcoal/10 bg-white p-4 text-sm"
            >
              <div className="font-semibold">{c.t}</div>
              <p className="mt-1 text-charcoal/70">{c.d}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <UnlockButton assessmentId={a.id} petName={a.pet_name} />
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-charcoal/60">
        <Link href="/dashboard" className="underline">
          Back to my pets
        </Link>
      </div>
    </div>
  );
}
