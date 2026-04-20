import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl w-full mx-auto">
        <span className="font-heading text-2xl font-bold">Lullo</span>
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="max-w-2xl space-y-8">
          <h1 className="font-heading text-5xl md:text-6xl font-bold leading-tight">
            A bedtime story made just for your little one.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Tell us their name, their age, and what&apos;s on their mind.
            We&apos;ll write a calming story and narrate it in under a minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/login">
              <Button size="lg" className="rounded-full px-8">
                Start a story
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Sign in
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            3 free stories per month. No credit card needed.
          </p>
        </div>
      </main>

      {/* How it works */}
      <section className="px-6 py-20 bg-card border-y">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground mx-auto flex items-center justify-center font-heading text-xl font-bold">
                1
              </div>
              <h3 className="font-heading text-xl font-semibold">
                Tell us about your child
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Their name, age, what they love, and anything they&apos;re
                feeling today.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground mx-auto flex items-center justify-center font-heading text-xl font-bold">
                2
              </div>
              <h3 className="font-heading text-xl font-semibold">
                We write the story
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A warm, personal bedtime story crafted in seconds.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground mx-auto flex items-center justify-center font-heading text-xl font-bold">
                3
              </div>
              <h3 className="font-heading text-xl font-semibold">
                Listen together
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A gentle narrator reads it aloud. Soft, slow, made for drifting
                off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="font-heading text-4xl font-bold">
            Bedtime, a little softer.
          </h2>
          <p className="text-muted-foreground">
            Join hundreds of parents making bedtime their favourite part of the
            day.
          </p>
          <Link href="/login">
            <Button size="lg" className="rounded-full px-8">
              Try Lullo free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t text-center">
        <p className="text-xs text-muted-foreground">
          Lullo · Made with care for bedtime
        </p>
      </footer>
    </div>
  );
}
