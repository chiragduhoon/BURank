# Contributing to BURank

Thanks for helping make BURank better! Bug reports, feature ideas, docs
improvements, and code are all welcome.

## Getting set up

Follow the [Getting Started section of the README](README.md#getting-started).
Everything runs locally with zero external services: the database is SQLite
and sign-in runs in dev mode (the magic link is shown on-page), so you don't
need email credentials or API keys to develop.

```bash
git clone https://github.com/chiragduhoon/BURank.git
cd BURank
npm install
cp .env.local.example .env.local
npx prisma db push
node prisma/seed.mjs      # optional: demo members
npm run dev
```

## What to work on

- Check the [open issues](https://github.com/chiragduhoon/BURank/issues) —
  anything labeled `good first issue` is a great entry point.
- Making BURank easier to adapt for **other universities** (configurable
  branding, enrollment-number formats, batch naming) is an especially welcome
  area of contribution.
- For larger features, open an issue first so we can align on the approach.

## Pull requests

- Branch from `main` and keep each PR focused on one change.
- Run `npm run lint` before submitting.
- Include screenshots for any UI change.
- Never commit `.env.local` or any credentials.

## Code notes

- Next.js 14 (App Router) + TypeScript + Tailwind; database access goes
  through Prisma.
- LeetCode data comes from LeetCode's public GraphQL API — be mindful of rate
  limits when touching the fetching code.
- Auth is NextAuth email magic links; enrollment-number validation
  (format + batch-year consistency + uniqueness) gates who can join.
