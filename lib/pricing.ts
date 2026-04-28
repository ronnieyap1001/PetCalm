export interface PricingChoice {
  cohort: "A" | "B";
  priceCents: number;
}

export function pickPrice(seed?: string): PricingChoice {
  const a = parseInt(process.env.PETCALM_PRICE_A_CENTS || "1990", 10);
  const b = parseInt(process.env.PETCALM_PRICE_B_CENTS || "990", 10);
  const split = parseFloat(process.env.PETCALM_AB_SPLIT || "0.5");

  let r: number;
  if (seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    }
    r = (h % 1000) / 1000;
  } else {
    r = Math.random();
  }

  return r < split ? { cohort: "A", priceCents: a } : { cohort: "B", priceCents: b };
}
