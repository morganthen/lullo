import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/" className="font-heading text-2xl font-bold">
          Lullo
        </Link>

        <div>
          <h1 className="font-heading text-3xl font-bold mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-foreground">
            Last updated: April 2026
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-heading text-xl font-semibold">
            What we collect
          </h2>
          <p className="text-sm leading-relaxed">
            When you sign up, we collect your email address and name from
            Google. When you generate a story, we store the child&apos;s name
            you enter, the story text, the generated audio file, and metadata
            like theme and date. For Plus subscribers, Stripe processes payments
            on our behalf and we store a Stripe customer ID.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl font-semibold">How we use it</h2>
          <p className="text-sm leading-relaxed">
            We use your data to generate and save your stories, manage your
            subscription, and improve the service. We do not sell your data. We
            do not use your stories to train AI models.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl font-semibold">Third parties</h2>
          <p className="text-sm leading-relaxed">
            We use Supabase to store your data, Anthropic Claude to generate
            story text, ElevenLabs to generate audio, and Stripe to process
            payments. These services receive only the data needed to do their
            job.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl font-semibold">Your rights</h2>
          <p className="text-sm leading-relaxed">
            You can delete your account at any time from the settings page,
            which removes all your stories and profile data. You can request a
            copy of your data by emailing us.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl font-semibold">Children</h2>
          <p className="text-sm leading-relaxed">
            Lullo is designed to be used by parents and guardians, not children
            directly. You should not let children sign in or use the service
            unsupervised. We do not knowingly collect data from children under
            13.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-xl font-semibold">Contact</h2>
          <p className="text-sm leading-relaxed">
            Questions? Email us at hello@hellolullo.com.
          </p>
        </section>
      </div>
    </main>
  );
}
