import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PROFILE_TYPES } from "@/lib/quiz";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: assessments } = await supabase
    .from("assessments")
    .select(
      "id, pet_name, breed, species, profile_type, status, paid, overall_score, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-bold">My pets</h1>
        <Link href="/intake" className="btn-primary">
          + Assess another pet
        </Link>
      </div>

      {(!assessments || assessments.length === 0) && (
        <div className="card mt-6">
          <p>You haven't started an assessment yet.</p>
          <Link href="/intake" className="btn-primary mt-4 inline-block">
            Start the assessment
          </Link>
        </div>
      )}

      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {assessments?.map((a) => {
          const profile =
            a.profile_type && PROFILE_TYPES[a.profile_type as keyof typeof PROFILE_TYPES];
          const target =
            a.status !== "completed"
              ? `/quiz/${a.id}`
              : a.paid
              ? `/report/${a.id}`
              : `/results/${a.id}`;
          return (
            <li
              key={a.id}
              className="card flex flex-col"
              style={{
                borderTop: profile
                  ? `4px solid ${profile.color}`
                  : `4px solid #A8C5A0`,
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-lg">{a.pet_name}</div>
                  <div className="text-sm text-charcoal/70">
                    {a.breed} · {a.species}
                  </div>
                </div>
                {profile && (
                  <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold">
                    {profile.icon} {profile.name}
                  </span>
                )}
              </div>
              <div className="mt-3 text-sm text-charcoal/70">
                Status:{" "}
                {a.status === "completed" ? (
                  a.paid ? (
                    "Full report unlocked"
                  ) : (
                    "Free result available"
                  )
                ) : (
                  "Assessment in progress"
                )}
              </div>
              <div className="mt-auto pt-4">
                <Link href={target} className="btn-primary text-sm">
                  {a.status === "completed"
                    ? a.paid
                      ? "View full report"
                      : "View free result"
                    : "Continue assessment"}
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
