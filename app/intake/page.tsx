import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import IntakeForm from "./IntakeForm";

export default async function IntakePage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return (
    <div className="mx-auto max-w-2xl py-6">
      <p className="text-sm font-semibold text-coral">
        Step 1 of 3 — About your pet
      </p>
      <h1 className="font-serif text-3xl font-bold">Tell us about your pet</h1>
      <p className="mt-2 text-charcoal/70">
        These details help us personalise the assessment and report.
      </p>
      <IntakeForm />
    </div>
  );
}
