"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl py-16">
      <h1 className="font-serif text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-charcoal/75">
        We hit an unexpected error loading this page. Most often this means
        the Supabase <code>assessments</code> table hasn't been created yet —
        apply <code>supabase/schema.sql</code> in the Supabase SQL editor.
      </p>
      {error.digest && (
        <p className="mt-3 text-xs text-charcoal/60">
          Error id: {error.digest}
        </p>
      )}
      <button onClick={() => reset()} className="btn-primary mt-6">
        Try again
      </button>
    </div>
  );
}
