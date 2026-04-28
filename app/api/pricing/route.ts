import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { pickPrice } from "@/lib/pricing";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const choice = pickPrice(user?.id);
  return NextResponse.json(choice);
}
