// Public Supabase config. The anon key is safe to ship in client code —
// data access is protected by Row Level Security in the database.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ymsenxnnxkkotsxyujmv.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltc2VueG5ueGtrb3RzeHl1am12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzkyNjQsImV4cCI6MjA5Mjk1NTI2NH0.0f81pCm9TKUFVapIxLsXThSoOlWMoD0VPaGAvTWQ8Qg";
