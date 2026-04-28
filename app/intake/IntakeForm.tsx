"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CAT_BREEDS, DOG_BREEDS } from "@/lib/breeds";

const AGE_RANGES = [
  "Under 6 months",
  "6–12 months",
  "1–3 years",
  "4–7 years",
  "8–12 years",
  "13+ years",
];

const WEIGHT_RANGES = [
  "Small (<5kg)",
  "Medium (5–15kg)",
  "Large (15–30kg)",
  "Extra Large (30kg+)",
];

const LIVING_OPTIONS = [
  "Apartment",
  "House without yard",
  "House with yard",
];

const HOUSEHOLD_OPTIONS = [
  "Lives with 1 adult",
  "Lives with multiple adults",
  "Children under 12 in home",
  "Other dogs in home",
  "Other cats in home",
  "Other animals in home",
];

const OWNED_FOR = [
  "Less than 1 month",
  "1–6 months",
  "6–12 months",
  "1–3 years",
  "3+ years",
];

export default function IntakeForm() {
  const router = useRouter();
  const [species, setSpecies] = useState<"dog" | "cat">("dog");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState(AGE_RANGES[2]);
  const [weight, setWeight] = useState(WEIGHT_RANGES[1]);
  const [living, setLiving] = useState(LIVING_OPTIONS[0]);
  const [household, setHousehold] = useState<string[]>([]);
  const [ownedFor, setOwnedFor] = useState(OWNED_FOR[2]);
  const [rescued, setRescued] = useState<"Yes" | "No" | "Unknown">("No");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const breedOptions = useMemo(
    () => (species === "dog" ? DOG_BREEDS : CAT_BREEDS).map((b) => b.name),
    [species]
  );

  const toggleHousehold = (v: string) => {
    setHousehold((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    const res = await fetch("/api/assessments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        species,
        pet_name: name,
        breed: breed || (species === "dog" ? "Mixed / Unknown" : "Mixed / Unknown"),
        age_range: age,
        weight_range: weight,
        living,
        household,
        owned_for: ownedFor,
        rescued,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Could not start assessment.");
      return;
    }
    const data = await res.json();
    router.push(`/quiz/${data.id}`);
  };

  return (
    <form onSubmit={submit} className="card mt-6 space-y-5">
      <div>
        <label className="label">Species</label>
        <div className="inline-flex rounded-full border border-charcoal/15 bg-white p-1">
          {(["dog", "cat"] as const).map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => {
                setSpecies(s);
                setBreed("");
              }}
              className={`rounded-full px-5 py-2 text-sm font-semibold capitalize ${
                species === s ? "bg-sage text-white" : "text-charcoal/70"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Pet's name</label>
        <input
          required
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Bailey"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="label">Breed</label>
          <select
            className="input"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          >
            <option value="">Select…</option>
            {breedOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Age</label>
          <select
            className="input"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            {AGE_RANGES.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Weight</label>
          <select
            className="input"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          >
            {WEIGHT_RANGES.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Living situation</label>
          <select
            className="input"
            value={living}
            onChange={(e) => setLiving(e.target.value)}
          >
            {LIVING_OPTIONS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Household</label>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {HOUSEHOLD_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-charcoal/10 bg-white px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={household.includes(opt)}
                onChange={() => toggleHousehold(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="label">How long have you had this pet?</label>
          <select
            className="input"
            value={ownedFor}
            onChange={(e) => setOwnedFor(e.target.value)}
          >
            {OWNED_FOR.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Was this pet adopted/rescued?</label>
          <select
            className="input"
            value={rescued}
            onChange={(e) => setRescued(e.target.value as any)}
          >
            <option>No</option>
            <option>Yes</option>
            <option>Unknown</option>
          </select>
        </div>
      </div>

      {err && <p className="text-sm text-coral">{err}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? "Starting…" : "Start the assessment"}
      </button>
    </form>
  );
}
