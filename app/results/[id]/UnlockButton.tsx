"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UnlockButton({
  assessmentId,
  petName,
}: {
  assessmentId: string;
  petName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d) => setPrice(d.priceCents))
      .catch(() => setPrice(1990));
  }, []);

  const onClick = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ assessmentId }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not start checkout.");
      return;
    }
    if (data.url) {
      window.location.href = data.url;
    } else if (data.mockSuccess) {
      router.push(`/report/${assessmentId}?mock=1`);
      router.refresh();
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={onClick}
        disabled={loading}
        className="btn-primary w-full md:w-auto"
      >
        {loading
          ? "Redirecting…"
          : `Unlock ${petName}'s Full Report — $${
              price ? (price / 100).toFixed(2) : "19.90"
            }`}
      </button>
      {error && <p className="text-sm text-coral">{error}</p>}
      <p className="text-xs text-charcoal/60">
        Secure payment · One-time purchase · Instant access
      </p>
    </div>
  );
}
