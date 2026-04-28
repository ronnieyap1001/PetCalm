"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html>
      <body
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          background: "#FDF8F0",
          color: "#2D2D2D",
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 640, margin: "80px auto", padding: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ marginTop: 12, color: "#2D2D2DAA" }}>
            PetCalm hit an unexpected error. Most often this means:
          </p>
          <ul style={{ marginTop: 12, paddingLeft: 20 }}>
            <li>The Supabase <code>assessments</code> table hasn't been created yet — apply <code>supabase/schema.sql</code> in the Supabase SQL editor.</li>
            <li>An environment variable on the host is overriding the bundled Supabase URL or anon key with a bad value.</li>
          </ul>
          {error.digest && (
            <p style={{ marginTop: 16, fontSize: 12, color: "#2D2D2D88" }}>
              Error id: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              marginTop: 20,
              background: "#E8785C",
              color: "white",
              border: 0,
              borderRadius: 999,
              padding: "10px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
