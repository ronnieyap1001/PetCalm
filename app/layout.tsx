import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export const metadata: Metadata = {
  title: "PetCalm — Pet Anxiety Assessment",
  description:
    "A 3-minute science-informed assessment that reveals your pet's unique anxiety profile — and what to do about it.",
  openGraph: {
    title: "PetCalm — Pet Anxiety Assessment",
    description:
      "Your pet has an anxiety profile. You've just never seen it.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <header className="no-print border-b border-charcoal/10 bg-cream/80 backdrop-blur sticky top-0 z-40">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="inline-block h-7 w-7 rounded-full bg-sage" />
              PetCalm
            </Link>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link href="/dashboard" className="btn-ghost text-sm">
                    My pets
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost text-sm">
                    Log in
                  </Link>
                  <Link href="/signup" className="btn-primary text-sm">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
        <main className="mx-auto min-h-[calc(100vh-160px)] max-w-6xl px-5 py-8">
          {children}
        </main>
        <footer className="no-print border-t border-charcoal/10 bg-cream">
          <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-charcoal/70">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>© {new Date().getFullYear()} PetCalm. All rights reserved.</div>
              <div className="flex gap-4">
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/disclaimer">Disclaimer</Link>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-xs">
              This assessment is for informational purposes only and does not
              replace professional veterinary or behavioural consultation. If your
              pet is in distress, please consult a licensed veterinarian or
              certified animal behaviourist.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
