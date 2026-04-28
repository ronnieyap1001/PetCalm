export type Dimension =
  | "separation"
  | "noise"
  | "social"
  | "generalised"
  | "routine";

export type ProfileTypeKey =
  | "shadow"
  | "sentinel"
  | "wallflower"
  | "pacer"
  | "creature_of_habit"
  | "storm";

export interface ProfileType {
  key: ProfileTypeKey;
  name: string;
  color: string;
  textColor: string;
  icon: string;
  description: string;
  signature: string;
  dimension: Dimension | "multi";
}

export const PROFILE_TYPES: Record<ProfileTypeKey, ProfileType> = {
  shadow: {
    key: "shadow",
    name: "The Shadow",
    color: "#3B3F7A",
    textColor: "#FFFFFF",
    icon: "🐾",
    dimension: "separation",
    description:
      "Shadows can't bear the gap. When you leave, their world doesn't just get quieter — it collapses. They need to know you're coming back, and they need proof.",
    signature: "Follows you to the bathroom.",
  },
  sentinel: {
    key: "sentinel",
    name: "The Sentinel",
    color: "#E0A95C",
    textColor: "#2D2D2D",
    icon: "📡",
    dimension: "noise",
    description:
      "Sentinels hear everything — and everything is a threat. Their nervous system is on permanent patrol, scanning for the next bang, buzz, or rumble.",
    signature: "Freezes or bolts at unexpected sounds.",
  },
  wallflower: {
    key: "wallflower",
    name: "The Wallflower",
    color: "#C9B8DE",
    textColor: "#2D2D2D",
    icon: "🌸",
    dimension: "social",
    description:
      "Wallflowers want connection but don't know how to trust it. New faces, new animals, new hands — they're all overwhelming until proven safe.",
    signature: "Hides when guests arrive.",
  },
  pacer: {
    key: "pacer",
    name: "The Pacer",
    color: "#E8785C",
    textColor: "#FFFFFF",
    icon: "🔄",
    dimension: "generalised",
    description:
      "Pacers carry their anxiety in their body. They can't settle, can't switch off, can't stop. The restlessness isn't excess energy — it's unresolved tension.",
    signature: "Circles, licks, or pants with no apparent cause.",
  },
  creature_of_habit: {
    key: "creature_of_habit",
    name: "The Creature of Habit",
    color: "#3F6E4A",
    textColor: "#FFFFFF",
    icon: "🕰️",
    dimension: "routine",
    description:
      "Creatures of Habit have built a fragile equilibrium. Every detail — the feeding time, the walk route, the sleeping spot — is load-bearing. Move one brick, and the wall shakes.",
    signature: "Refuses to eat if the bowl is in a different spot.",
  },
  storm: {
    key: "storm",
    name: "The Storm",
    color: "#3A3A3A",
    textColor: "#FFFFFF",
    icon: "🌩️",
    dimension: "multi",
    description:
      "Storms don't have a single trigger — they have many. Anxiety doesn't come from one direction; it comes from everywhere. This is the profile that benefits most from structured intervention.",
    signature: "Multiple anxiety behaviours co-occurring.",
  },
};

export const DIMENSION_LABELS: Record<Dimension, string> = {
  separation: "Separation Anxiety",
  noise: "Noise & Environmental Sensitivity",
  social: "Social Anxiety",
  generalised: "Generalised Anxiety",
  routine: "Change & Routine Sensitivity",
};

export interface QuizQuestion {
  id: string;
  dimension: Dimension;
  prompt: string;
  options: string[];
}

const opts = (...o: string[]) => o;

export const QUESTIONS: QuizQuestion[] = [
  // Separation
  {
    id: "sep_1",
    dimension: "separation",
    prompt: "How does {pet} react when you prepare to leave the house?",
    options: opts(
      "Calm",
      "Slightly restless",
      "Follows me anxiously",
      "Whines or barks",
      "Becomes destructive or panics"
    ),
  },
  {
    id: "sep_2",
    dimension: "separation",
    prompt: "How does {pet} behave when left alone for more than 2 hours?",
    options: opts(
      "Relaxed",
      "Mildly restless",
      "Vocalises intermittently",
      "Vocalises constantly",
      "Destructive behaviour or self-harm"
    ),
  },
  {
    id: "sep_3",
    dimension: "separation",
    prompt: "Does {pet} follow you from room to room?",
    options: opts(
      "Never",
      "Occasionally",
      "Often",
      "Almost always",
      "Cannot be in a different room"
    ),
  },
  {
    id: "sep_4",
    dimension: "separation",
    prompt: "How does {pet} react when you return home?",
    options: opts(
      "Calm greeting",
      "Excited but settles quickly",
      "Extremely excited for several minutes",
      "Frantic, jumping, whining",
      "Signs of distress — urination, trembling"
    ),
  },
  {
    id: "sep_5",
    dimension: "separation",
    prompt:
      "Has {pet} ever damaged doors, windows, or crates when left alone?",
    options: opts(
      "Never",
      "Once or twice",
      "Occasionally",
      "Frequently",
      "Every time left alone"
    ),
  },
  {
    id: "sep_6",
    dimension: "separation",
    prompt: "Does {pet} refuse to eat or drink when you are away?",
    options: opts("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  // Noise
  {
    id: "noi_1",
    dimension: "noise",
    prompt: "How does {pet} react to thunder or fireworks?",
    options: opts(
      "Unbothered",
      "Mildly alert",
      "Hides or seeks comfort",
      "Trembles, pants, paces",
      "Panics — tries to escape, injures self"
    ),
  },
  {
    id: "noi_2",
    dimension: "noise",
    prompt:
      "How does {pet} react to loud household sounds (vacuum, blender, doorbell)?",
    options: opts(
      "Ignores them",
      "Notices but stays calm",
      "Moves away",
      "Barks, hisses, or hides",
      "Extreme fear response"
    ),
  },
  {
    id: "noi_3",
    dimension: "noise",
    prompt:
      "Does {pet} react to sounds outside the home (sirens, construction, other animals)?",
    options: opts(
      "Never",
      "Occasionally alerts",
      "Often reacts",
      "Reacts to most external sounds",
      "Hyper-vigilant — constantly scanning"
    ),
  },
  {
    id: "noi_4",
    dimension: "noise",
    prompt:
      "How does {pet} behave in new environments (new house, hotel, outdoor venue)?",
    options: opts(
      "Explores confidently",
      "Cautious but adapts within minutes",
      "Takes 30+ minutes to settle",
      "Remains anxious the entire time",
      "Refuses to move, eat, or engage"
    ),
  },
  {
    id: "noi_5",
    dimension: "noise",
    prompt: "Does {pet} startle easily?",
    options: opts(
      "Almost never",
      "Occasionally",
      "Often",
      "Very easily",
      "Startles at almost anything"
    ),
  },
  {
    id: "noi_6",
    dimension: "noise",
    prompt:
      "How does {pet} react to unfamiliar objects in the home (new furniture, packages, decorations)?",
    options: opts(
      "Investigates calmly",
      "Cautious approach",
      "Avoids the object",
      "Barks/hisses at it",
      "Refuses to enter the room"
    ),
  },
  // Social
  {
    id: "soc_1",
    dimension: "social",
    prompt: "How does {pet} react to unfamiliar people visiting your home?",
    options: opts(
      "Friendly and relaxed",
      "Cautious but warms up",
      "Hides or avoids",
      "Barks, growls, or hisses",
      "Aggressive or extremely fearful"
    ),
  },
  {
    id: "soc_2",
    dimension: "social",
    prompt: "How does {pet} behave around unfamiliar dogs/cats?",
    options: opts(
      "Playful and social",
      "Cautious but tolerant",
      "Avoids interaction",
      "Reactive — barks, lunges, or hisses",
      "Aggressive or shuts down completely"
    ),
  },
  {
    id: "soc_3",
    dimension: "social",
    prompt:
      "Does {pet} show discomfort when being handled by strangers (vet, groomer)?",
    options: opts(
      "Calm and cooperative",
      "Slightly tense",
      "Needs significant calming",
      "Struggles, vocalises, or freezes",
      "Cannot be handled without extreme stress"
    ),
  },
  {
    id: "soc_4",
    dimension: "social",
    prompt: "How does {pet} react to children?",
    options: opts(
      "Comfortable",
      "Cautious but tolerant",
      "Avoids them",
      "Fearful",
      "Reactive or aggressive"
    ),
  },
  {
    id: "soc_5",
    dimension: "social",
    prompt:
      "Does {pet} resource-guard (food, toys, sleeping spots) from people or other animals?",
    options: opts(
      "Never",
      "Rarely, only high-value items",
      "Sometimes",
      "Often",
      "Aggressively guards most resources"
    ),
  },
  {
    id: "soc_6",
    dimension: "social",
    prompt: "How does {pet} behave at the vet or groomer?",
    options: opts(
      "Relaxed",
      "Mildly anxious",
      "Needs restraint",
      "Extremely stressed",
      "Cannot complete visits without sedation or muzzling"
    ),
  },
  // Generalised
  {
    id: "gen_1",
    dimension: "generalised",
    prompt: "How often does {pet} pace, circle, or seem unable to settle?",
    options: opts(
      "Never",
      "Rarely",
      "A few times a week",
      "Daily",
      "Multiple times daily"
    ),
  },
  {
    id: "gen_2",
    dimension: "generalised",
    prompt: "Does {pet} excessively lick, chew, or groom themselves?",
    options: opts(
      "No",
      "Occasionally",
      "Regularly — noticeable pattern",
      "Frequently — causing hair loss or skin damage",
      "Compulsively — cannot stop without intervention"
    ),
  },
  {
    id: "gen_3",
    dimension: "generalised",
    prompt: "How is {pet}'s appetite?",
    options: opts(
      "Consistent and healthy",
      "Occasionally skips meals",
      "Frequently eats less than expected",
      "Significant appetite loss",
      "Refuses food regularly"
    ),
  },
  {
    id: "gen_4",
    dimension: "generalised",
    prompt:
      "Does {pet} pant, tremble, or drool in situations that are not physically demanding?",
    options: opts(
      "Never",
      "Rarely",
      "Sometimes",
      "Often",
      "Almost constantly"
    ),
  },
  {
    id: "gen_5",
    dimension: "generalised",
    prompt: "How would you describe {pet}'s overall energy and demeanour?",
    options: opts(
      "Happy and engaged",
      "Generally content",
      "Often seems flat or withdrawn",
      "Frequently tense or on edge",
      "Seems persistently distressed"
    ),
  },
  {
    id: "gen_6",
    dimension: "generalised",
    prompt: "Does {pet} have difficulty sleeping or wake frequently?",
    options: opts(
      "Sleeps well",
      "Occasional restlessness",
      "Regularly restless",
      "Frequently wakes and paces",
      "Severe sleep disruption"
    ),
  },
  // Routine
  {
    id: "rou_1",
    dimension: "routine",
    prompt:
      "How does {pet} react to changes in daily routine (feeding time, walk schedule)?",
    options: opts(
      "Unfazed",
      "Slightly confused but adapts",
      "Noticeably unsettled",
      "Anxious or refuses to cooperate",
      "Major behavioural disruption"
    ),
  },
  {
    id: "rou_2",
    dimension: "routine",
    prompt: "How does {pet} handle travel (car rides, carriers)?",
    options: opts(
      "Enjoys it",
      "Tolerates it",
      "Mildly anxious",
      "Very anxious — panting, drooling, vocalising",
      "Cannot travel without extreme distress"
    ),
  },
  {
    id: "rou_3",
    dimension: "routine",
    prompt:
      "How did {pet} react to the last major change in your household (move, new family member, new pet)?",
    options: opts(
      "Adapted quickly",
      "Took a few days",
      "Took weeks",
      "Still hasn't fully adjusted",
      "Severe behavioural regression"
    ),
  },
  {
    id: "rou_4",
    dimension: "routine",
    prompt:
      "Does {pet} become anxious when their preferred person is home but unavailable (working, on phone)?",
    options: opts(
      "No",
      "Occasionally seeks attention",
      "Frequently interrupts",
      "Becomes visibly distressed",
      "Cannot cope — vocalises, destructive"
    ),
  },
  {
    id: "rou_5",
    dimension: "routine",
    prompt:
      "How does {pet} react to changes in their physical environment (rearranged furniture, construction nearby)?",
    options: opts(
      "Unaffected",
      "Briefly curious",
      "Cautious for hours",
      "Anxious for days",
      "Long-term behavioural change"
    ),
  },
  {
    id: "rou_6",
    dimension: "routine",
    prompt:
      "Does {pet} have rigid preferences about where they eat, sleep, or eliminate?",
    options: opts(
      "Flexible",
      "Mild preferences",
      "Strong preferences",
      "Very rigid — refuses alternatives",
      "Extreme rigidity — distress if disrupted"
    ),
  },
];

export const renderPrompt = (prompt: string, petName: string) =>
  prompt.replaceAll("{pet}", petName);
