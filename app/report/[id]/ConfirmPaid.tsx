"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmPaid({
  assessmentId,
  sessionId,
}: {
  assessmentId: string;
  sessionId: string;
}) {
  const router = useRouter();
  useEffect(() => {
    fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ assessmentId, sessionId }),
    }).then(() => router.refresh());
  }, [assessmentId, sessionId, router]);
  return null;
}
