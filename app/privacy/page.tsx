export default function PrivacyPage() {
  return (
    <article className="prose mx-auto max-w-2xl py-10 text-charcoal">
      <h1 className="font-serif text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-charcoal/80">
        PetCalm respects your privacy. We collect only the information needed to
        deliver your assessment and report: your account email, the details you
        enter about your pet, your quiz answers, and payment confirmation data.
      </p>
      <h2 className="mt-6 font-semibold">What we collect</h2>
      <ul className="list-disc pl-5">
        <li>Account email and (optionally) first name.</li>
        <li>Pet attributes you provide (name, species, breed, age, etc.).</li>
        <li>Quiz answers and computed scores.</li>
        <li>Payment status (we never store card details — Stripe processes payments).</li>
      </ul>
      <h2 className="mt-6 font-semibold">How we use it</h2>
      <p>
        We use your data to generate your personalised assessment and report and
        to provide customer support. We do not sell your data.
      </p>
      <h2 className="mt-6 font-semibold">Your rights</h2>
      <p>
        You may request access, correction, or deletion of your data at any
        time by contacting <a href="mailto:hello@petcalm.example">hello@petcalm.example</a>.
      </p>
    </article>
  );
}
