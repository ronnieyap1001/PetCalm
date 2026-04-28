import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-20">
      <section className="grid grid-cols-1 gap-10 py-10 md:grid-cols-2 md:py-16">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-coral">
            6 anxiety types · which one is yours?
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
            Your pet has an anxiety profile.
            <br />
            <span className="text-sage">You've just never seen it.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-charcoal/75">
            A 3-minute science-informed assessment that reveals your pet's
            unique anxiety profile — and what to do about it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary">
              Discover Their Profile — Free Assessment
            </Link>
            <Link href="/login" className="btn-ghost">
              I already have an account
            </Link>
          </div>
          <p className="mt-6 text-sm text-charcoal/60">
            Joined by <strong>12,847</strong> pet owners and counting.
          </p>
        </div>
        <div className="relative">
          <div className="card flex h-full flex-col justify-between bg-gradient-to-br from-sage/30 to-cream">
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "The Shadow", color: "#3B3F7A" },
                { name: "The Sentinel", color: "#E0A95C" },
                { name: "The Wallflower", color: "#C9B8DE" },
                { name: "The Pacer", color: "#E8785C" },
                { name: "Creature of Habit", color: "#3F6E4A" },
                { name: "The Storm", color: "#3A3A3A" },
              ].map((t) => (
                <div
                  key={t.name}
                  className="rounded-xl border border-white/40 bg-white/70 p-4 text-center text-xs font-semibold"
                  style={{ borderTop: `4px solid ${t.color}` }}
                >
                  {t.name}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-charcoal/70">
              Every behaviour is a signal. Most owners miss them.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-3xl font-bold">How it works</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Take the quiz",
              body: "30 quick questions about your pet's behaviour, environment, and history.",
            },
            {
              step: "2",
              title: "Get your profile",
              body: "Discover which of the 6 anxiety profiles matches your pet's pattern.",
            },
            {
              step: "3",
              title: "Unlock your report",
              body: "Pay once for the personalised report, recommendations, and PDF export.",
            },
          ].map((s) => (
            <div key={s.step} className="card">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-sage font-bold text-white">
                {s.step}
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-2 text-charcoal/70">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-3xl font-bold">FAQ</h2>
        <div className="mt-8 space-y-4">
          {[
            {
              q: "Is this a real diagnostic?",
              a: "No — PetCalm is a structured behavioural screen built on published veterinary behavioural science. It is not a clinical diagnosis. We always recommend partnering with your vet or a veterinary behaviourist for severe symptoms.",
            },
            {
              q: "How long does it take?",
              a: "About 3 minutes. 30 questions across 5 dimensions of anxiety.",
            },
            {
              q: "What's in the paid report?",
              a: "A 15-page personalised report: dimension breakdown, root-cause analysis, breed-specific insights, a week-by-week action plan, recommended products, and a downloadable PDF you can share with your vet.",
            },
            {
              q: "What if I don't pay?",
              a: "You'll see your pet's profile type, severity, and a high-level radar chart for free. Full guidance and PDF export are unlocked after payment.",
            },
          ].map((f) => (
            <details key={f.q} className="card cursor-pointer">
              <summary className="font-semibold">{f.q}</summary>
              <p className="mt-3 text-charcoal/75">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
