# Lullo – AI Bedtime Story Generator

Lullo generates personalised, AI-voiced bedtime stories for children. A parent fills in a short form and gets back a fully narrated story in under a minute.

## How it works

1. Parent fills in child's name, age, theme, and an optional feeling to explore
2. Claude generates a custom bedtime story
3. ElevenLabs voices it with a curated narrator
4. Story plays automatically with a built-in audio player
5. Plus users can save stories to their personal library

## Tech Stack

- **Frontend** – Next.js 16, TypeScript, Tailwind CSS, Shadcn
- **Backend** – Next.js API Routes
- **Database & Auth** – Supabase (Postgres, Storage, OAuth)
- **AI** – Claude Haiku (Anthropic)
- **Text-to-Speech** – ElevenLabs
- **Payments** – Stripe (coming soon)

## Features

- Google OAuth authentication
- AI story generation via Claude API
- Text-to-speech narration via ElevenLabs
- Free tier: 3 stories per month
- Plus tier: unlimited stories + save to library
- Story library with playback and delete

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in your keys
4. Run the dev server: `npm run dev`

## Environment Variables

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=
NEXT_PUBLIC_SITE_URL=

## Status

Active development. Core generation flow complete. Stripe integration and UI polish in progress.

## Lessons Learnt

### Suspense without a fallback flash on empty data

The library page uses `<Suspense>` to show a skeleton while stories load — but only when stories actually exist. On empty accounts the empty state renders immediately, with no skeleton flash.

The problem: Suspense has to commit a fallback *before* the promise resolves, so it can't know whether the final list will be empty. A naive `<Suspense>` around the fetch shows the skeleton to every user, including first-timers with nothing to load.

Fix — split into two queries:

1. Cheap count query first (`.select("id", { count: "exact", head: true })`) — no row payload, just a number.
2. If `count === 0`, render the empty state directly (no Suspense boundary mounted).
3. If `count > 0`, kick off the full fetch in parallel and mount `<Suspense fallback={<Skeleton count={count} />}>`. Sizing the skeleton from the count avoids a second layout jump when the real rows arrive.

The child reads the promise via `use(promise)`, then seeds local state (`useState(initial)`) so delete/optimistic updates still work after Suspense resumes.
