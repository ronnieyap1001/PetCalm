import { Dimension } from "./quiz";

export interface BreedInfo {
  name: string;
  size: "small" | "medium" | "large" | "xlarge";
  predisposition: "low" | "moderate" | "high";
  commonTypes: Dimension[];
  notes: string;
}

export const DOG_BREEDS: BreedInfo[] = [
  {
    name: "Labrador Retriever",
    size: "large",
    predisposition: "moderate",
    commonTypes: ["separation", "generalised"],
    notes:
      "Highly social and people-bonded. Often shows separation-related distress when routines change or owners are gone for long periods.",
  },
  {
    name: "Golden Retriever",
    size: "large",
    predisposition: "moderate",
    commonTypes: ["separation", "noise"],
    notes:
      "Sensitive and emotionally attuned breed. Storms and household tension can amplify anxiety.",
  },
  {
    name: "German Shepherd",
    size: "large",
    predisposition: "moderate",
    commonTypes: ["social", "noise"],
    notes:
      "Strong guarding instincts make them prone to reactivity around strangers and unfamiliar environments.",
  },
  {
    name: "French Bulldog",
    size: "small",
    predisposition: "high",
    commonTypes: ["separation"],
    notes:
      "Velcro companions — Frenchies bond intensely and frequently develop separation distress.",
  },
  {
    name: "Bulldog",
    size: "medium",
    predisposition: "moderate",
    commonTypes: ["routine"],
    notes:
      "Routine-driven and comfort-loving; copes poorly with sudden change.",
  },
  {
    name: "Poodle (Standard / Mini / Toy)",
    size: "medium",
    predisposition: "moderate",
    commonTypes: ["separation", "generalised"],
    notes:
      "Highly intelligent and emotionally sensitive. Anxiety often surfaces as compulsive licking or pacing.",
  },
  {
    name: "Beagle",
    size: "medium",
    predisposition: "moderate",
    commonTypes: ["separation"],
    notes:
      "Pack-oriented breed; vocalises and seeks proximity when isolated.",
  },
  {
    name: "Rottweiler",
    size: "xlarge",
    predisposition: "moderate",
    commonTypes: ["social"],
    notes:
      "Confident but selectively social — early socialisation is critical.",
  },
  {
    name: "Yorkshire Terrier",
    size: "small",
    predisposition: "high",
    commonTypes: ["noise", "social"],
    notes:
      "Small, alert, and reactive. Often startles and barks at unfamiliar stimuli.",
  },
  {
    name: "Dachshund",
    size: "small",
    predisposition: "high",
    commonTypes: ["social", "noise"],
    notes:
      "Bold but easily startled. Resource guarding and reactivity are common.",
  },
  {
    name: "Boxer",
    size: "large",
    predisposition: "moderate",
    commonTypes: ["separation"],
    notes:
      "Highly bonded family dog; struggles when isolated for extended periods.",
  },
  {
    name: "Siberian Husky",
    size: "large",
    predisposition: "moderate",
    commonTypes: ["separation", "generalised"],
    notes:
      "Working breed needing mental and physical stimulation; under-stimulation drives anxiety behaviours.",
  },
  {
    name: "Shih Tzu",
    size: "small",
    predisposition: "moderate",
    commonTypes: ["separation"],
    notes:
      "Companion breed prone to attachment-based anxiety.",
  },
  {
    name: "Cavalier King Charles Spaniel",
    size: "small",
    predisposition: "high",
    commonTypes: ["separation"],
    notes:
      "Among the top breeds predisposed to separation anxiety; bred for human companionship.",
  },
  {
    name: "Border Collie",
    size: "medium",
    predisposition: "high",
    commonTypes: ["generalised", "noise"],
    notes:
      "Hyper-responsive working breed. Prone to compulsions and noise sensitivity.",
  },
  {
    name: "Australian Shepherd",
    size: "medium",
    predisposition: "high",
    commonTypes: ["generalised", "noise"],
    notes:
      "Highly driven; insufficient stimulation often presents as anxiety.",
  },
  {
    name: "Chihuahua",
    size: "small",
    predisposition: "high",
    commonTypes: ["social", "separation"],
    notes:
      "Tightly bonded and reactive to unfamiliar people and animals.",
  },
  {
    name: "Pomeranian",
    size: "small",
    predisposition: "high",
    commonTypes: ["noise", "social"],
    notes:
      "Alert, vocal, and easily startled by environmental change.",
  },
  {
    name: "Maltese",
    size: "small",
    predisposition: "high",
    commonTypes: ["separation"],
    notes:
      "Companion-bred; strong attachment-based anxiety risk.",
  },
  {
    name: "Doberman Pinscher",
    size: "large",
    predisposition: "moderate",
    commonTypes: ["separation", "social"],
    notes:
      "Owner-focused breed; high separation distress risk.",
  },
  {
    name: "Shetland Sheepdog",
    size: "small",
    predisposition: "high",
    commonTypes: ["noise", "generalised"],
    notes:
      "Highly sensitive herder. Sound and motion reactive.",
  },
  {
    name: "Cocker Spaniel",
    size: "medium",
    predisposition: "moderate",
    commonTypes: ["separation", "noise"],
    notes:
      "Sensitive breed; thrives on consistent routine.",
  },
  {
    name: "Pug",
    size: "small",
    predisposition: "moderate",
    commonTypes: ["separation"],
    notes:
      "Velcro companions; strong attachment behaviours.",
  },
  {
    name: "Great Dane",
    size: "xlarge",
    predisposition: "moderate",
    commonTypes: ["separation"],
    notes:
      "Gentle giants — highly bonded and prone to separation distress.",
  },
  {
    name: "Boston Terrier",
    size: "small",
    predisposition: "moderate",
    commonTypes: ["separation"],
    notes:
      "Companion breed; sensitive to isolation and change.",
  },
  {
    name: "Bernese Mountain Dog",
    size: "xlarge",
    predisposition: "moderate",
    commonTypes: ["separation"],
    notes:
      "Very bonded family dog; thrives in calm households.",
  },
  {
    name: "Mastiff",
    size: "xlarge",
    predisposition: "low",
    commonTypes: ["routine"],
    notes:
      "Routine-driven; generally calm but disrupted by major change.",
  },
  {
    name: "Vizsla",
    size: "medium",
    predisposition: "high",
    commonTypes: ["separation", "generalised"],
    notes:
      "Known as 'velcro dogs' — highly attached and prone to anxiety when isolated.",
  },
  {
    name: "Weimaraner",
    size: "large",
    predisposition: "high",
    commonTypes: ["separation"],
    notes:
      "Highly bonded breed prone to acute separation anxiety.",
  },
  {
    name: "Jack Russell Terrier",
    size: "small",
    predisposition: "moderate",
    commonTypes: ["generalised", "noise"],
    notes:
      "High-drive, high-arousal breed; under-stimulation manifests as anxiety.",
  },
  {
    name: "Mixed / Unknown",
    size: "medium",
    predisposition: "moderate",
    commonTypes: [],
    notes:
      "Mixed-breed pets show varied predispositions. Focus on the behavioural profile rather than breed-specific risk.",
  },
];

export const CAT_BREEDS: BreedInfo[] = [
  {
    name: "Domestic Shorthair / Mixed",
    size: "small",
    predisposition: "moderate",
    commonTypes: [],
    notes:
      "The most common feline 'breed'. Profile varies by individual temperament and history.",
  },
  {
    name: "Siamese",
    size: "small",
    predisposition: "high",
    commonTypes: ["separation", "social"],
    notes:
      "Highly bonded and vocal — often shows separation distress and over-attachment.",
  },
  {
    name: "Persian",
    size: "small",
    predisposition: "moderate",
    commonTypes: ["routine"],
    notes:
      "Calm but routine-dependent; struggles with environmental change.",
  },
  {
    name: "Maine Coon",
    size: "medium",
    predisposition: "low",
    commonTypes: [],
    notes:
      "Generally adaptable; anxiety often tied to noise or new environments.",
  },
  {
    name: "Ragdoll",
    size: "medium",
    predisposition: "moderate",
    commonTypes: ["separation"],
    notes:
      "Highly social and people-oriented; can become withdrawn when isolated.",
  },
  {
    name: "British Shorthair",
    size: "small",
    predisposition: "low",
    commonTypes: ["routine"],
    notes:
      "Calm and reserved; routine-sensitive but generally even-tempered.",
  },
  {
    name: "Bengal",
    size: "small",
    predisposition: "high",
    commonTypes: ["generalised", "noise"],
    notes:
      "Highly active and reactive; under-stimulation drives anxiety behaviours.",
  },
  {
    name: "Sphynx",
    size: "small",
    predisposition: "moderate",
    commonTypes: ["separation"],
    notes:
      "Highly social and people-oriented; struggles with isolation.",
  },
  {
    name: "Russian Blue",
    size: "small",
    predisposition: "moderate",
    commonTypes: ["social"],
    notes:
      "Reserved with strangers; sensitive to household tension.",
  },
  {
    name: "Scottish Fold",
    size: "small",
    predisposition: "moderate",
    commonTypes: ["routine"],
    notes:
      "Routine-dependent; quietly anxious during change.",
  },
  {
    name: "Abyssinian",
    size: "small",
    predisposition: "moderate",
    commonTypes: ["generalised"],
    notes:
      "Active and curious; needs enrichment to avoid restlessness.",
  },
  {
    name: "Burmese",
    size: "small",
    predisposition: "moderate",
    commonTypes: ["separation"],
    notes:
      "Highly bonded; separation-sensitive.",
  },
  {
    name: "Norwegian Forest Cat",
    size: "medium",
    predisposition: "low",
    commonTypes: [],
    notes:
      "Generally calm and adaptable.",
  },
  {
    name: "Devon Rex",
    size: "small",
    predisposition: "moderate",
    commonTypes: ["separation", "social"],
    notes:
      "Highly people-oriented and interactive.",
  },
  {
    name: "Oriental Shorthair",
    size: "small",
    predisposition: "high",
    commonTypes: ["separation", "generalised"],
    notes:
      "Highly vocal and bonded; prone to anxiety when alone.",
  },
  {
    name: "Mixed / Unknown",
    size: "small",
    predisposition: "moderate",
    commonTypes: [],
    notes:
      "Use general feline anxiety guidance — temperament varies widely.",
  },
];

export function findBreed(
  species: "dog" | "cat",
  name: string
): BreedInfo | undefined {
  const list = species === "dog" ? DOG_BREEDS : CAT_BREEDS;
  return list.find((b) => b.name === name);
}
