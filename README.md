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
