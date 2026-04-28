import { BreedInfo } from "./breeds";
import {
  Dimension,
  DIMENSION_LABELS,
  PROFILE_TYPES,
  ProfileTypeKey,
} from "./quiz";
import { ScoringResult } from "./scoring";

export interface ReportContext {
  petName: string;
  ownerName: string;
  species: "dog" | "cat";
  breed: BreedInfo | undefined;
  ageRange: string;
  weightRange: string;
  living: string;
  household: string[];
  ownedFor: string;
  rescued: "Yes" | "No" | "Unknown";
  result: ScoringResult;
}

export interface DimensionNarrative {
  dimension: Dimension;
  label: string;
  score: number;
  severity: "Mild" | "Moderate" | "Severe";
  measures: string;
  meaning: string;
  redFlags: string[];
  perspective: string;
}

const dimensionMeasures: Record<Dimension, string> = {
  separation:
    "How distressing your pet finds being apart from their primary attachment figure — covering departures, time alone, return greetings, and proximity-seeking behaviours.",
  noise:
    "How your pet's nervous system responds to sound and unfamiliar environmental input — from sudden loud noises to ambient changes.",
  social:
    "How your pet copes with social pressure — unfamiliar people, other animals, handling, and shared resources.",
  generalised:
    "Baseline tension that's not tied to a specific trigger — restlessness, over-grooming, appetite, sleep, and overall demeanour.",
  routine:
    "How dependent your pet is on predictability — feeding times, walk schedules, environmental layout, and major life changes.",
};

const dimensionPerspective: Record<Dimension, string> = {
  separation:
    "From your pet's point of view, your departure breaks a fundamental safety rule. Their nervous system reads 'alone' as 'unsafe', and they cannot self-soothe back to baseline until you return.",
  noise:
    "Your pet experiences sound the way you might experience a sudden tap on the shoulder in a dark room. Their threat-detection system is sensitised — every new sound is treated as a potential predator until proven otherwise.",
  social:
    "Social anxiety is rarely about dislike — it's about uncertainty. Your pet hasn't built a reliable map of which strangers are safe, so every encounter is a fresh threat assessment.",
  generalised:
    "Generalised anxiety lives in the body, not the moment. Your pet's baseline arousal is elevated, so even neutral situations feel taxing. They can't 'switch off' because there's no off switch.",
  routine:
    "Predictability is your pet's safety blanket. When the routine breaks, the world becomes unmappable — and an unmappable world is a dangerous one.",
};

const dimensionRedFlags: Record<Dimension, string[]> = {
  separation: [
    "Self-injury when left alone (paw chewing, broken teeth from crate biting)",
    "Refusing food or water for extended periods when alone",
    "Escape attempts that risk physical harm",
  ],
  noise: [
    "Bolting in response to noise, especially outdoors",
    "Loss of bladder/bowel control during noise events",
    "Inability to recover for hours after a noise trigger",
  ],
  social: [
    "Bite history with humans or other animals",
    "Inability to be handled by veterinary professionals",
    "Hiding for days after social exposure",
  ],
  generalised: [
    "Persistent over-grooming causing skin damage",
    "Significant unexplained weight loss",
    "Ongoing sleep disruption affecting health",
  ],
  routine: [
    "Refusing to eat for over 24 hours after a routine change",
    "Severe behavioural regression after household changes",
    "Compulsive return to specific spots or rituals",
  ],
};

export function buildDimensionNarratives(
  ctx: ReportContext
): DimensionNarrative[] {
  return ctx.result.dimensionScores.map((d) => ({
    dimension: d.dimension,
    label: DIMENSION_LABELS[d.dimension],
    score: d.score,
    severity: d.severity,
    measures: dimensionMeasures[d.dimension],
    meaning: meaningFor(ctx.petName, d.dimension, d.severity),
    redFlags:
      d.severity === "Mild" ? [] : dimensionRedFlags[d.dimension],
    perspective: dimensionPerspective[d.dimension],
  }));
}

function meaningFor(
  pet: string,
  dim: Dimension,
  severity: "Mild" | "Moderate" | "Severe"
) {
  const sevPhrase =
    severity === "Mild"
      ? "is currently within a manageable range"
      : severity === "Moderate"
      ? "is interfering with day-to-day quality of life"
      : "is a significant welfare concern that needs structured intervention";
  const dimPhrase: Record<Dimension, string> = {
    separation: `${pet} likely struggles when separated from their attachment figure. This pattern ${sevPhrase}.`,
    noise: `${pet}'s sound and environmental sensitivity ${sevPhrase}.`,
    social: `${pet}'s social discomfort ${sevPhrase}.`,
    generalised: `${pet}'s baseline tension ${sevPhrase}.`,
    routine: `${pet}'s reliance on routine ${sevPhrase}.`,
  };
  return dimPhrase[dim];
}

export interface ActionItem {
  title: string;
  description: string;
}

export interface ActionPlan {
  thisWeek: ActionItem[];
  weeks1to4: ActionItem[];
  months1to3: ActionItem[];
  whenToSeePro: ActionItem[];
}

export function buildActionPlan(ctx: ReportContext): ActionPlan {
  const profile = PROFILE_TYPES[ctx.result.primary];
  const dim: Dimension =
    profile.dimension === "multi" ? "generalised" : profile.dimension;
  return {
    thisWeek: thisWeekFor(dim, ctx.petName),
    weeks1to4: weeksFor(dim, ctx.petName),
    months1to3: monthsFor(dim, ctx.petName),
    whenToSeePro: whenToSeePro(ctx.petName, ctx.result.primary),
  };
}

function thisWeekFor(dim: Dimension, pet: string): ActionItem[] {
  const map: Record<Dimension, ActionItem[]> = {
    separation: [
      {
        title: "Make departures boring",
        description: `Stop the cue chain (keys, shoes, jacket) that triggers ${pet}. Pick up and put down keys at random moments throughout the day so the cue loses meaning.`,
      },
      {
        title: "Introduce a 'safe absence' ritual",
        description: `Leave for 30 seconds, return calmly with no fuss. Repeat 5x daily, gradually increasing duration. ${pet} learns that you always come back.`,
      },
      {
        title: "Offer a long-lasting chew or lick mat at every departure",
        description:
          "A licking activity activates the parasympathetic nervous system — physiologically incompatible with anxiety.",
      },
    ],
    noise: [
      {
        title: "Build a quiet retreat space",
        description: `A covered crate, closet, or bathroom with bedding, low light, and a white-noise source so ${pet} can self-regulate.`,
      },
      {
        title: "Mask environmental sound",
        description:
          "Run a fan, classical music, or a sound machine continuously during peak trigger periods.",
      },
      {
        title: "Pair sound with food",
        description: `Play recorded thunder/firework sounds at very low volume while ${pet} eats high-value food. Stop the sound before they finish eating.`,
      },
    ],
    social: [
      {
        title: "Stop forcing greetings",
        description: `${pet} doesn't have to say hi. Let them observe new people and animals from a distance they choose.`,
      },
      {
        title: "Use distance, not exposure",
        description:
          "Find the threshold where they can notice but not react. That's where learning happens.",
      },
      {
        title: "Reward voluntary engagement",
        description: `Whenever ${pet} chooses to look at or move toward something social — mark and reward.`,
      },
    ],
    generalised: [
      {
        title: "Anchor predictable mealtimes",
        description: `Feed ${pet} at the same two times each day. Predictability lowers baseline arousal.`,
      },
      {
        title: "Add daily decompression",
        description:
          "20 minutes of sniff-walking (off-pavement, no destination) or food puzzles at home.",
      },
      {
        title: "Reduce environmental noise during the day",
        description:
          "Turn off TVs and radios when you're not actively engaged with them.",
      },
    ],
    routine: [
      {
        title: "Document the existing routine",
        description: "Write it down in detail — feeding, walks, sleep zones. This becomes your stability map.",
      },
      {
        title: "Introduce micro-changes",
        description: `Move ${pet}'s bowl 30cm. Walk the route in reverse. Tiny safe disruptions teach flexibility.`,
      },
      {
        title: "Reinforce calm during change",
        description: "When something shifts and they cope, acknowledge with quiet praise and a treat.",
      },
    ],
  };
  return map[dim];
}

function weeksFor(dim: Dimension, pet: string): ActionItem[] {
  const map: Record<Dimension, ActionItem[]> = {
    separation: [
      {
        title: "Graduated absence protocol",
        description:
          "Start at 1 minute alone. Add 30 seconds every successful session. Never push past the threshold of distress.",
      },
      {
        title: "Crate or safe-zone conditioning",
        description: `Pair ${pet}'s safe spot with high-value food daily, even when you're home.`,
      },
      {
        title: "Independence training",
        description: `Reward ${pet} for choosing to lie 2+ metres away from you. Build the muscle of being apart.`,
      },
    ],
    noise: [
      {
        title: "Sound desensitisation curriculum",
        description:
          "Progressively raise volume of recorded triggers over 4 weeks. Always pair with food. Never push past threshold.",
      },
      {
        title: "Counter-conditioning to startle triggers",
        description: "Vacuum, doorbell, doors slamming — pair each with food until the cue itself predicts good things.",
      },
      {
        title: "Add a body wrap or pressure garment",
        description: "Many noise-sensitive pets respond to gentle, constant pressure (Thundershirt, anxiety wrap).",
      },
    ],
    social: [
      {
        title: "Threshold-distance walks",
        description: "Walk at distances where they can see but not react. Build a positive emotional history with social stimuli.",
      },
      {
        title: "Set up controlled greetings",
        description:
          "One calm helper, leashed, neutral environment. Pair their appearance with food. End before saturation.",
      },
      {
        title: "Vet/groomer cooperative care",
        description: `Practise being touched in clinic-relevant ways at home. Reward stillness. Build consent into handling.`,
      },
    ],
    generalised: [
      {
        title: "Implement a daily calming protocol",
        description: "Karen Overall's Relaxation Protocol or equivalent — 15 minutes daily.",
      },
      {
        title: "Enrichment audit",
        description: "Replace one meal a day with a puzzle feeder, snuffle mat, or scatter feed.",
      },
      {
        title: "Sleep hygiene",
        description: `Audit ${pet}'s sleep environment — temperature, light, foot traffic. Aim for 14+ hours of undisturbed rest.`,
      },
    ],
    routine: [
      {
        title: "Plan transitions in advance",
        description:
          "Any household change — moving furniture, guests, schedule shifts — should be introduced gradually with extra reinforcement.",
      },
      {
        title: "Train a settle-on-mat behaviour",
        description: "A portable 'home base' that travels with you, providing stability anywhere.",
      },
      {
        title: "Predictable cue routines",
        description: "Same words, same order, same rhythm for daily activities. Build a reliable script.",
      },
    ],
  };
  return map[dim];
}

function monthsFor(dim: Dimension, pet: string): ActionItem[] {
  return [
    {
      title: "Track progress weekly",
      description: `Keep a simple journal: triggers, recovery time, calm baseline. Reassess ${pet} at 30 days.`,
    },
    {
      title: "Build environmental enrichment into the routine",
      description:
        "Rotate toys, change walk routes, introduce safe novelty in small doses.",
    },
    {
      title: "Schedule a wellness vet visit",
      description:
        "Rule out medical contributors (pain, thyroid, GI issues). Anxiety is sometimes downstream of physical discomfort.",
    },
    {
      title: "Consider consultation with a veterinary behaviourist",
      description:
        "If progress stalls or severity is moderate-to-severe, professional support is the most reliable next step.",
    },
  ];
}

function whenToSeePro(pet: string, profile: ProfileTypeKey): ActionItem[] {
  return [
    {
      title: "See your vet first",
      description: `If ${pet} shows new physical symptoms, sudden appetite change, or self-injury, the priority is a medical workup.`,
    },
    {
      title: "Veterinary behaviourist (DACVB or equivalent)",
      description:
        "For severe anxiety, multiple co-occurring profiles (Storm), or where medication may be appropriate.",
    },
    {
      title: "Certified animal behaviourist or trainer (CCPDT, IAABC)",
      description:
        "For protocol delivery and ongoing coaching once a behavioural plan is in place.",
    },
  ];
}

export interface ProductRec {
  name: string;
  why: string;
  link: string;
}

export function recommendedProducts(ctx: ReportContext): ProductRec[] {
  const profileDim = PROFILE_TYPES[ctx.result.primary].dimension;
  const dim: Dimension =
    profileDim === "multi" ? "generalised" : profileDim;

  const baseline: ProductRec[] = [
    {
      name: ctx.species === "dog" ? "Adaptil Calming Diffuser" : "Feliway Classic Diffuser",
      why: "Pheromone-based calming aid clinically associated with reduced anxiety markers in pets.",
      link: "https://example.com/affiliate/calming-diffuser?utm_source=petcalm",
    },
    {
      name: "Snuffle Mat / Lick Mat",
      why: "Activates parasympathetic 'rest and digest' state — physiologically incompatible with anxious arousal.",
      link: "https://example.com/affiliate/lick-mat?utm_source=petcalm",
    },
    {
      name: "Zylkene (alpha-casozepine)",
      why: "Milk-protein-derived supplement supporting baseline calmness; safe for long-term use.",
      link: "https://example.com/affiliate/zylkene?utm_source=petcalm",
    },
  ];

  const bySpecific: Record<Dimension, ProductRec[]> = {
    separation: [
      {
        name: "Treat-Dispensing Camera",
        why: "Lets you remotely engage during absences and verify how your pet is coping.",
        link: "https://example.com/affiliate/pet-cam?utm_source=petcalm",
      },
      {
        name: "Frozen Kong / Long-Lasting Chew",
        why: "Departure ritual that anchors absences to a positive activity.",
        link: "https://example.com/affiliate/kong?utm_source=petcalm",
      },
    ],
    noise: [
      {
        name: "Thundershirt / Anxiety Wrap",
        why: "Constant gentle pressure has been shown to reduce reactivity in noise-sensitive pets.",
        link: "https://example.com/affiliate/thundershirt?utm_source=petcalm",
      },
      {
        name: "White Noise Machine or Calming Music App",
        why: "Masks startle triggers and provides a consistent acoustic environment.",
        link: "https://example.com/affiliate/sound-machine?utm_source=petcalm",
      },
    ],
    social: [
      {
        name: "Front-Clip Harness or Calming Halter",
        why: "Reduces forward pressure that escalates reactivity on lead.",
        link: "https://example.com/affiliate/calming-harness?utm_source=petcalm",
      },
      {
        name: "High-Value Training Treats",
        why: "Essential for counter-conditioning around social triggers.",
        link: "https://example.com/affiliate/treats?utm_source=petcalm",
      },
    ],
    generalised: [
      {
        name: "Puzzle Feeder Set",
        why: "Replaces passive feeding with mental work — proven to reduce baseline arousal.",
        link: "https://example.com/affiliate/puzzle-feeder?utm_source=petcalm",
      },
      {
        name: "Orthopedic Calming Bed",
        why: "Donut-style beds support secure rest posture.",
        link: "https://example.com/affiliate/calming-bed?utm_source=petcalm",
      },
    ],
    routine: [
      {
        name: "Automatic Feeder",
        why: "Locks feeding times even when human schedules vary.",
        link: "https://example.com/affiliate/auto-feeder?utm_source=petcalm",
      },
      {
        name: "Travel Mat / Portable Bed",
        why: "Carries the routine with you — your pet's stability anchor in new spaces.",
        link: "https://example.com/affiliate/travel-mat?utm_source=petcalm",
      },
    ],
  };

  return [...baseline, ...bySpecific[dim]];
}
