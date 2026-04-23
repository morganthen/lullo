import Link from "next/link";
import {
  BookStackSvg,
  CloudSvg,
  MoonSvg,
  StarSvg,
} from "@/components/ui/brand-svgs";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--cream)" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 max-w-6xl w-full mx-auto">
        <span
          className="font-heading text-2xl"
          style={{ color: "var(--terra)" }}
        >
          Lullo
          <span
            className="ml-2 text-[10px] font-sans font-semibold uppercase tracking-widest rounded-md px-1.5 py-0.5 align-middle"
            style={{
              color: "var(--terra)",
              background: "var(--terra-pale)",
              border: "1px solid rgba(196,102,58,0.3)",
            }}
          >
            Plus
          </span>
        </span>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ color: "var(--brown-mid)" }}
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--terra)" }}
          >
            Start a story
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-14 pb-20 w-full grid grid-cols-1 md:grid-cols-[1fr_380px] gap-10 items-center">
        <div className="relative z-10">
          <p
            className="font-heading text-sm mb-4 tracking-wide animate-fade-up"
            style={{ color: "var(--terra-light)", animationDelay: "0.05s" }}
          >
            ✦ A story made just for them
          </p>
          <h1
            className="font-heading leading-[1.12] mb-6 animate-fade-up"
            style={{
              fontSize: "clamp(42px, 5vw, 68px)",
              color: "var(--brown)",
              animationDelay: "0.15s",
            }}
          >
            Bedtime stories,
            <br />
            <span style={{ color: "var(--terra)" }}>written for tonight.</span>
          </h1>
          <p
            className="text-lg leading-relaxed mb-9 font-light animate-fade-up"
            style={{
              color: "var(--brown-mid)",
              maxWidth: 440,
              animationDelay: "0.28s",
            }}
          >
            Tell us their name, their age, and what&apos;s on their mind.
            We&apos;ll write a calming story and narrate it in under a minute.
          </p>
          <div
            className="flex gap-3 flex-wrap mb-5 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/login"
              className="font-heading text-sm text-white px-6 py-3 rounded-xl transition-opacity hover:opacity-90"
              style={{
                background: "var(--terra)",
                boxShadow: "0 2px 12px rgba(196,102,58,0.22)",
              }}
            >
              Write tonight&apos;s story →
            </Link>
            <Link
              href="/login"
              className="font-heading text-sm px-6 py-3 rounded-xl border bg-white transition-colors hover:bg-terra-pale"
              style={{
                color: "var(--terra)",
                borderColor: "rgba(196,102,58,0.35)",
              }}
            >
              See the library
            </Link>
          </div>
          <p
            className="text-xs animate-fade-up"
            style={{
              color: "var(--brown-mid)",
              opacity: 0.7,
              animationDelay: "0.52s",
            }}
          >
            3 free stories per month · No credit card needed
          </p>
        </div>

        {/* Illustration */}
        <div
          className="relative h-85 hidden md:flex items-center justify-center animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="absolute top-0 right-5 animate-float-slow">
            <MoonSvg size={100} />
          </div>
          <div
            className="absolute top-8 left-5 opacity-70 animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            <CloudSvg size={70} />
          </div>
          <div
            className="absolute bottom-5 right-0 opacity-60 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <CloudSvg size={90} opacity={0.25} />
          </div>
          <div
            className="absolute top-5 left-16 animate-twinkle"
            style={{ animationDelay: "0s" }}
          >
            <StarSvg size={14} opacity={0.5} />
          </div>
          <div
            className="absolute top-16 left-40 animate-twinkle"
            style={{ animationDelay: "0.6s" }}
          >
            <StarSvg size={10} opacity={0.5} />
          </div>
          <div
            className="absolute top-32 left-8 animate-twinkle"
            style={{ animationDelay: "1.1s" }}
          >
            <StarSvg size={8} opacity={0.5} />
          </div>
          <div
            className="absolute top-2 left-52 animate-twinkle"
            style={{ animationDelay: "1.8s" }}
          >
            <StarSvg size={6} opacity={0.5} />
          </div>
          <div
            className="absolute animate-float-slow"
            style={{
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              animationDelay: "0.3s",
            }}
          >
            <BookStackSvg size={120} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="py-16 px-8"
        style={{
          background: "var(--terra-pale)",
          borderTop: "0.5px solid rgba(196,102,58,0.15)",
          borderBottom: "0.5px solid rgba(196,102,58,0.15)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <p
            className="font-heading text-center text-sm tracking-widest uppercase mb-2 opacity-80"
            style={{ color: "var(--terra)" }}
          >
            How it works
          </p>
          <h2
            className="font-heading text-4xl text-center mb-14"
            style={{ color: "var(--brown)" }}
          >
            From bedtime question to bedtime story
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                n: "1",
                title: "Tell us about them",
                body: "Their name, age, what they love — and anything they're feeling today.",
              },
              {
                n: "2",
                title: "We write the story",
                body: "A warm, personal bedtime story crafted in seconds — just for them.",
              },
              {
                n: "3",
                title: "Listen together",
                body: "A gentle narrator reads it aloud. Soft, slow, made for drifting off.",
              },
            ].map((step, i) => (
              <div
                key={step.n}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${0.1 + i * 0.15}s` }}
              >
                <div
                  className="font-heading w-11 h-11 rounded-full mx-auto mb-4 flex items-center justify-center text-xl text-white"
                  style={{ background: "var(--terra)" }}
                >
                  {step.n}
                </div>
                <h3
                  className="font-heading text-xl mb-2"
                  style={{ color: "var(--brown)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed font-light"
                  style={{ color: "var(--brown-mid)" }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / feature strip + closing CTA */}
      <section className="py-16 px-8 max-w-6xl mx-auto w-full text-center">
        <p
          className="text-sm mb-8 italic opacity-70"
          style={{ color: "var(--brown-mid)", letterSpacing: "0.05em" }}
        >
          &ldquo;Lullo has become our favourite part of the night
          routine.&rdquo;
        </p>
        <div className="flex justify-center gap-10 flex-wrap mb-14">
          {[
            ["🌙", "Calm stories"],
            ["🎙️", "Narrated aloud"],
            ["📚", "Saved to library"],
            ["✨", "Fully personalised"],
          ].map(([icon, label]) => (
            <div
              key={label}
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--brown-mid)" }}
            >
              <span className="text-lg">{icon}</span> {label}
            </div>
          ))}
        </div>
        <h2
          className="font-heading text-[40px] mb-4"
          style={{ color: "var(--brown)" }}
        >
          Bedtime, a little softer.
        </h2>
        <p
          className="text-sm font-light mb-8"
          style={{ color: "var(--brown-mid)" }}
        >
          Join hundreds of parents making bedtime their favourite part of the
          day.
        </p>
        <Link
          href="/login"
          className="font-heading text-sm text-white px-6 py-3 rounded-xl inline-block transition-opacity hover:opacity-90"
          style={{
            background: "var(--terra)",
            boxShadow: "0 2px 12px rgba(196,102,58,0.22)",
          }}
        >
          Try Lullo free
        </Link>
      </section>

      <footer
        className="py-6 px-8 text-center"
        style={{ borderTop: "0.5px solid rgba(196,102,58,0.15)" }}
      >
        <p className="text-xs opacity-55" style={{ color: "var(--brown-mid)" }}>
          Lullo · Made with care for bedtime · hellolullo.com
        </p>
      </footer>
    </div>
  );
}
