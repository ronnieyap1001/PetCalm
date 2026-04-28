"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push("/intake");
      router.refresh();
    } else {
      setInfo(
        "Check your inbox to confirm your email, then come back and log in."
      );
    }
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="font-serif text-3xl font-bold">Create your account</h1>
      <p className="mt-2 text-charcoal/70">
        Free assessment. Pay only to unlock the full report.
      </p>
      <form onSubmit={onSubmit} className="card mt-6 space-y-4">
        <div>
          <label className="label">Your first name</label>
          <input
            type="text"
            required
            className="input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            required
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            required
            minLength={6}
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-1 text-xs text-charcoal/60">At least 6 characters.</p>
        </div>
        {error && <p className="text-sm text-coral">{error}</p>}
        {info && <p className="text-sm text-sage">{info}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account…" : "Create account"}
        </button>
        <p className="text-center text-sm text-charcoal/70">
          Already have an account?{" "}
          <Link className="font-semibold text-coral" href="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
