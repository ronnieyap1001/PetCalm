import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

type CookiesToSet = { name: string; value: string; options: CookieOptions }[];

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore when middleware refreshes sessions.
        }
      },
    },
  });
}

export function createSupabaseServiceClient() {
  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
