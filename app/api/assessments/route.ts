import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const {
    species,
    pet_name,
    breed,
    age_range,
    weight_range,
    living,
    household,
    owned_for,
    rescued,
  } = body || {};

  if (!species || !pet_name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("assessments")
    .insert({
      user_id: user.id,
      species,
      pet_name,
      breed,
      age_range,
      weight_range,
      living,
      household,
      owned_for,
      rescued,
      status: "in_progress",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
