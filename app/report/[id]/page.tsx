import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PROFILE_TYPES, DIMENSION_LABELS } from "@/lib/quiz";
import { findBreed } from "@/lib/breeds";
import {
  buildActionPlan,
  buildDimensionNarratives,
  recommendedProducts,
  ReportContext,
} from "@/lib/report";
import { severityOf } from "@/lib/scoring";
import RadarChart from "@/components/RadarChart";
import PrintButton from "./PrintButton";
import ConfirmPaid from "./ConfirmPaid";

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { paid?: string; mock?: string; session_id?: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: a } = await supabase
    .from("assessments")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();
  if (!a) notFound();

  if (!a.paid && !searchParams.paid && !searchParams.mock) {
    redirect(`/results/${params.id}`);
  }

  // First name lookup
  const { data: profile } = await supabase.auth.getUser();
  const ownerName =
    (profile.user?.user_metadata?.first_name as string) ||
    (profile.user?.email?.split("@")[0] ?? "Friend");

  const profileKey = a.profile_type as keyof typeof PROFILE_TYPES;
  const profileType = PROFILE_TYPES[profileKey];
  const breed = findBreed(a.species, a.breed);

  const ctx: ReportContext = {
    petName: a.pet_name,
    ownerName,
    species: a.species,
    breed,
    ageRange: a.age_range,
    weightRange: a.weight_range,
    living: a.living,
    household: a.household || [],
    ownedFor: a.owned_for,
    rescued: a.rescued,
    result: {
      dimensionScores: a.dimension_scores,
      overall: a.overall_score,
      overallSeverity: severityOf(a.overall_score),
      primary: a.profile_type,
      secondary: a.secondary_profile_type || undefined,
      storm: a.is_storm,
    },
  };

  const narratives = buildDimensionNarratives(ctx);
  const plan = buildActionPlan(ctx);
  const products = recommendedProducts(ctx);

  return (
    <div className="mx-auto max-w-3xl py-6">
      {searchParams.session_id && (
        <ConfirmPaid
          assessmentId={params.id}
          sessionId={searchParams.session_id}
        />
      )}
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard" className="btn-ghost text-sm">
          ← My pets
        </Link>
        <PrintButton />
      </div>

      {/* Cover */}
      <section
        className="overflow-hidden rounded-3xl p-8"
        style={{
          backgroundColor: profileType.color,
          color: profileType.textColor,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold opacity-90">PetCalm Report</span>
          <span className="text-sm opacity-90">
            {new Date(a.completed_at || Date.now()).toLocaleDateString()}
          </span>
        </div>
        <h1 className="mt-6 font-serif text-4xl font-bold">
          {a.pet_name}'s Anxiety Profile
        </h1>
        <p className="mt-2 text-lg opacity-95">
          {profileType.icon} {profileType.name} · {a.breed} · {a.age_range}
        </p>
        <p className="mt-6 text-sm opacity-85">Prepared for {ownerName}</p>
      </section>

      {/* Executive summary */}
      <section className="card mt-6">
        <h2 className="font-serif text-2xl font-bold">Executive summary</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm text-charcoal/70">
              Overall anxiety severity
            </div>
            <div className="text-3xl font-bold">
              {severityOf(a.overall_score)}
            </div>
            <div className="text-sm text-charcoal/70">
              Index: {a.overall_score}/100
            </div>
            <div className="mt-4 text-sm text-charcoal/70">Profile type</div>
            <div className="text-xl font-semibold">{profileType.name}</div>
            {a.secondary_profile_type && (
              <div className="text-sm text-charcoal/70">
                Secondary:{" "}
                {PROFILE_TYPES[a.secondary_profile_type as keyof typeof PROFILE_TYPES]?.name}
              </div>
            )}
          </div>
          <div>
            <RadarChart
              scores={a.dimension_scores as any}
              color={profileType.color}
              size={260}
            />
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-charcoal/80">
          {narratives
            .slice()
            .sort((x, y) => y.score - x.score)
            .slice(0, 3)
            .map((n) => (
              <li key={n.dimension} className="flex gap-2">
                <span
                  className="mt-1 inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: profileType.color }}
                />
                <span>
                  <strong>{n.label}:</strong> {n.score}% — {n.severity}.
                </span>
              </li>
            ))}
        </ul>
      </section>

      {/* Dimensions */}
      {narratives.map((n) => (
        <section key={n.dimension} className="card mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold">{n.label}</h2>
            <span
              className="rounded-full px-3 py-1 text-sm font-semibold"
              style={{
                backgroundColor: profileType.color + "22",
                color: profileType.color,
              }}
            >
              {n.score}% · {n.severity}
            </span>
          </div>
          <p className="mt-3 text-charcoal/80">
            <strong>What this measures.</strong> {n.measures}
          </p>
          <p className="mt-3 text-charcoal/80">
            <strong>What this means for {a.pet_name}.</strong> {n.meaning}
          </p>
          <p className="mt-3 text-charcoal/80">
            <strong>What's likely happening.</strong> {n.perspective}
          </p>
          {n.redFlags.length > 0 && (
            <div className="mt-4 rounded-xl border border-coral/30 bg-coral/5 p-4">
              <div className="text-sm font-semibold text-coral">
                Red flags to watch for
              </div>
              <ul className="mt-2 list-disc pl-5 text-sm text-charcoal/80">
                {n.redFlags.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}

      {/* Root cause */}
      <section className="card mt-6">
        <h2 className="font-serif text-2xl font-bold">Root cause analysis</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-cream p-4">
            <div className="text-sm font-semibold">Breed predisposition</div>
            <p className="mt-2 text-sm text-charcoal/80">
              {breed?.notes ||
                `Mixed-breed pets show varied predispositions — focus on the behavioural profile rather than breed-specific risk.`}
            </p>
            {breed && (
              <p className="mt-2 text-xs text-charcoal/60">
                Predisposition level: <strong>{breed.predisposition}</strong>
              </p>
            )}
          </div>
          <div className="rounded-xl bg-cream p-4">
            <div className="text-sm font-semibold">Age factor</div>
            <p className="mt-2 text-sm text-charcoal/80">
              At {a.age_range}, anxiety patterns can correlate with developmental
              stages — younger pets often show socialisation gaps; senior pets can
              develop new anxieties tied to cognitive change or sensory decline.
            </p>
          </div>
          <div className="rounded-xl bg-cream p-4">
            <div className="text-sm font-semibold">Environment</div>
            <p className="mt-2 text-sm text-charcoal/80">
              Living situation: {a.living}. Household: {(a.household || []).join(", ") || "Not specified"}.
              These factors shape both trigger exposure and recovery space.
            </p>
          </div>
          <div className="rounded-xl bg-cream p-4">
            <div className="text-sm font-semibold">History</div>
            <p className="mt-2 text-sm text-charcoal/80">
              Owned for {a.owned_for}. Adopted/rescued: {a.rescued}.{" "}
              {a.rescued === "Yes"
                ? "Rescued pets have higher rates of anxiety due to early life disruption — patience and consistency are central to recovery."
                : ""}
            </p>
          </div>
        </div>
      </section>

      {/* Action plan */}
      <section className="card mt-6">
        <h2 className="font-serif text-2xl font-bold">
          Personalised action plan
        </h2>
        {[
          { title: "This week — immediate changes", items: plan.thisWeek },
          { title: "Weeks 1–4 — short-term training", items: plan.weeks1to4 },
          { title: "Months 1–3 — long-term adjustments", items: plan.months1to3 },
          { title: "When to see a professional", items: plan.whenToSeePro },
        ].map((tier) => (
          <div key={tier.title} className="mt-5">
            <h3 className="font-semibold">{tier.title}</h3>
            <ul className="mt-3 space-y-3">
              {tier.items.map((it) => (
                <li
                  key={it.title}
                  className="rounded-xl border border-charcoal/10 bg-white p-4"
                >
                  <div className="font-semibold">{it.title}</div>
                  <p className="mt-1 text-sm text-charcoal/80">{it.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Breed insights */}
      {breed && (
        <section className="card mt-6">
          <h2 className="font-serif text-2xl font-bold">
            Breed-specific insights · {breed.name}
          </h2>
          <p className="mt-3 text-charcoal/80">{breed.notes}</p>
          {breed.commonTypes.length > 0 && (
            <p className="mt-3 text-sm text-charcoal/70">
              Most common anxiety dimensions in this breed:{" "}
              <strong>
                {breed.commonTypes
                  .map((t) => DIMENSION_LABELS[t])
                  .join(", ")}
              </strong>
              .
            </p>
          )}
        </section>
      )}

      {/* Products */}
      <section className="card mt-6">
        <h2 className="font-serif text-2xl font-bold">
          Recommended products & resources
        </h2>
        <p className="mt-2 text-sm text-charcoal/70">
          Curated for {a.pet_name}'s profile. PetCalm may earn a commission from
          qualifying purchases.
        </p>
        <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {products.map((p) => (
            <li
              key={p.name}
              className="rounded-xl border border-charcoal/10 bg-white p-4"
            >
              <div className="font-semibold">{p.name}</div>
              <p className="mt-1 text-sm text-charcoal/80">{p.why}</p>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="mt-2 inline-block text-sm font-semibold text-coral underline"
              >
                View product →
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Next steps */}
      <section className="card mt-6">
        <h2 className="font-serif text-2xl font-bold">Next steps</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-charcoal/80">
          <li>Reassess {a.pet_name} in 30 days to track progress.</li>
          <li>
            Share this report with your vet or trainer — it makes a great
            communication tool.
          </li>
          <li>
            Save or print this report (use the Export button) and keep it as a
            reference.
          </li>
        </ul>
      </section>

      <p className="mt-8 text-xs text-charcoal/60">
        This assessment is for informational purposes only and does not replace
        professional veterinary or behavioural consultation. If your pet is in
        distress, please consult a licensed veterinarian or certified animal
        behaviourist.
      </p>
    </div>
  );
}
