"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, renderPrompt } from "@/lib/quiz";

export default function QuizRunner({
  assessmentId,
  petName,
}: {
  assessmentId: string;
  petName: string;
}) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const q = QUESTIONS[idx];
  const total = QUESTIONS.length;
  const pct = Math.round(((idx + (answers[q.id] !== undefined ? 1 : 0)) / total) * 100);
  const selected = answers[q.id];

  const choose = (v: number) => {
    setAnswers((a) => ({ ...a, [q.id]: v }));
  };

  const next = () => {
    if (selected === undefined) return;
    if (idx < total - 1) setIdx(idx + 1);
  };

  const prev = () => {
    if (idx > 0) setIdx(idx - 1);
  };

  const finish = async () => {
    setSubmitting(true);
    setErr(null);
    const res = await fetch(`/api/assessments/${assessmentId}/answers`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Could not submit.");
      return;
    }
    router.push(`/results/${assessmentId}`);
  };

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);
  const isLast = idx === total - 1;

  return (
    <div>
      <div className="mt-2 flex items-center justify-between text-sm text-charcoal/70">
        <span>
          Question {idx + 1} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-charcoal/10">
        <div
          className="h-full bg-coral transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct >= 80 && pct < 100 && (
        <p className="mt-3 text-sm font-semibold text-sage">
          Almost there! Keep going.
        </p>
      )}

      <div className="card mt-6">
        <p className="text-xs uppercase tracking-wide text-charcoal/60">
          {q.dimension.replace(/_/g, " ")}
        </p>
        <h2 className="mt-2 font-serif text-xl font-bold">
          {renderPrompt(q.prompt, petName)}
        </h2>

        <div className="mt-5 space-y-2">
          {q.options.map((label, i) => {
            const isSel = selected === i;
            return (
              <button
                key={label}
                type="button"
                onClick={() => choose(i)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  isSel
                    ? "border-coral bg-coral/10 font-semibold"
                    : "border-charcoal/10 bg-white hover:border-charcoal/30"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {err && <p className="mt-3 text-sm text-coral">{err}</p>}

        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={prev}
            className="btn-ghost"
            disabled={idx === 0}
          >
            ← Back
          </button>
          {!isLast && (
            <button
              onClick={next}
              className="btn-primary"
              disabled={selected === undefined}
            >
              Next →
            </button>
          )}
          {isLast && (
            <button
              onClick={finish}
              className="btn-primary"
              disabled={!allAnswered || submitting}
            >
              {submitting ? "Calculating…" : "See the result"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
