Territory Command Center for Hitachi Solutions Azure SSP.

Stack: Next.js App Router + TypeScript + TailwindCSS, Firebase Auth (email link) and Firestore (optional), Netlify Functions/Scheduled Functions, Azure OpenAI (pluggable), Teams webhook.

Quick start

1) Install dependencies

```bash
npm install
```

2) Create `.env.local`

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
AI_PROVIDER=azure
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_KEY=
AZURE_OPENAI_DEPLOYMENT=
TEAMS_WEBHOOK_URL=
```

3) Run locally

```bash
npm run dev
```

Deploy to Netlify

- Add environment variables above
- `netlify.toml` schedules:
  - fetchNews, fetchRFPs, fetchJobs: every 120 minutes
  - recomputeScores: nightly 2:00
  - sendDigest: 8:15 daily

Project Structure

- `app/` routes: `/`, `/opportunities`, `/opportunities/[id]`, `/signals`, `/cosell`, `/simulator`, `/signin`
- `lib/` db, scoring, ai, teams
- `config/` territories and scoring weights; prompts for AI
- `netlify/functions/` signal fetchers, score recompute, daily digest
- `types/` shared types
