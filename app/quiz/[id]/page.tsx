import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import QuizRunner from "./QuizRunner";

export default async function QuizPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: assessment, error } = await supabase
    .from("assessments")
    .select("id, pet_name, status")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !assessment) notFound();
  if (assessment.status === "completed") {
    redirect(`/results/${assessment.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl py-6">
      <p className="text-sm font-semibold text-coral">
        Step 2 of 3 — The assessment
      </p>
      <QuizRunner assessmentId={assessment.id} petName={assessment.pet_name} />
    </div>
  );
}
