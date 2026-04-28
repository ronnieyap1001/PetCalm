import {
  Dimension,
  ProfileTypeKey,
  PROFILE_TYPES,
  QUESTIONS,
} from "./quiz";

export type Answers = Record<string, number>; // questionId -> 0..4

export interface DimensionScore {
  dimension: Dimension;
  score: number; // 0..100
  severity: "Mild" | "Moderate" | "Severe";
}

export interface ScoringResult {
  dimensionScores: DimensionScore[];
  overall: number;
  overallSeverity: "Mild" | "Moderate" | "Severe";
  primary: ProfileTypeKey;
  secondary?: ProfileTypeKey;
  storm: boolean;
}

const TIE_PRIORITY: Dimension[] = [
  "separation",
  "generalised",
  "social",
  "noise",
  "routine",
];

const dimensionToProfile: Record<Dimension, ProfileTypeKey> = {
  separation: "shadow",
  noise: "sentinel",
  social: "wallflower",
  generalised: "pacer",
  routine: "creature_of_habit",
};

export function severityOf(score: number): "Mild" | "Moderate" | "Severe" {
  if (score <= 30) return "Mild";
  if (score <= 60) return "Moderate";
  return "Severe";
}

export function computeScores(answers: Answers): ScoringResult {
  const byDim: Record<Dimension, number[]> = {
    separation: [],
    noise: [],
    social: [],
    generalised: [],
    routine: [],
  };

  for (const q of QUESTIONS) {
    const v = answers[q.id];
    if (typeof v === "number") byDim[q.dimension].push(v);
  }

  const dimensionScores: DimensionScore[] = (
    Object.keys(byDim) as Dimension[]
  ).map((dim) => {
    const arr = byDim[dim];
    const sum = arr.reduce((a, b) => a + b, 0);
    const max = arr.length * 4 || 24;
    const score = Math.round((sum / max) * 100);
    return { dimension: dim, score, severity: severityOf(score) };
  });

  const sorted = [...dimensionScores].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return TIE_PRIORITY.indexOf(a.dimension) - TIE_PRIORITY.indexOf(b.dimension);
  });

  const top = sorted[0];
  const second = sorted[1];

  let storm = false;
  if (top.score > 50 && second.score > 50 && top.score - second.score <= 10) {
    storm = true;
  }

  const primary: ProfileTypeKey = storm
    ? "storm"
    : dimensionToProfile[top.dimension];

  const secondary: ProfileTypeKey | undefined =
    !storm && second.score > 40 ? dimensionToProfile[second.dimension] : undefined;

  const overall = Math.round(
    dimensionScores.reduce((a, b) => a + b.score, 0) / dimensionScores.length
  );

  return {
    dimensionScores,
    overall,
    overallSeverity: severityOf(overall),
    primary,
    secondary,
    storm,
  };
}

export function topInsights(
  result: ScoringResult,
  petName: string
): string[] {
  const sorted = [...result.dimensionScores].sort((a, b) => b.score - a.score);
  return sorted.slice(0, 3).map((d) => {
    const label =
      d.dimension === "separation"
        ? "Separation Anxiety"
        : d.dimension === "noise"
        ? "Noise & Environmental Sensitivity"
        : d.dimension === "social"
        ? "Social Anxiety"
        : d.dimension === "generalised"
        ? "Generalised Anxiety"
        : "Change & Routine Sensitivity";
    return `${petName} scored ${d.score}% on ${label} (${d.severity}).`;
  });
}

export { PROFILE_TYPES };
