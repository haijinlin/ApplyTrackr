# ApplyTrackr

A full-stack job application tracker built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. Quick Add uses only local TypeScript regex and keyword matching. It does not call an AI service.

## Features

- Full job application CRUD with detail and edit views
- Quick Add from pasted job descriptions
- Rule-based extraction for title, company, salary, location, employment type, source, skills, closing date, and work arrangement
- Dashboard metrics and upcoming follow-ups
- Filtering and sorting across the application pipeline
- Resume version management and per-application cover letter snapshots
- Performance reporting by resume and career category
- Responsive desktop and mobile UI

## Local setup

1. Create a Neon PostgreSQL project and copy its pooled connection string.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`.
3. Install dependencies and prepare the database:

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
```

4. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the project into Vercel.
3. Add the Neon `DATABASE_URL` in Vercel project environment variables.
4. Run `npx prisma db push` against the production database before the first deployment.
5. Deploy. The `postinstall` script generates Prisma Client during dependency installation.

For production schema changes, prefer committed Prisma migrations and run `prisma migrate deploy` in your deployment workflow.

## Parser

The parser lives in `src/lib/parser.ts`. It intentionally leaves low-confidence fields blank. Extend `src/lib/constants.ts` to add more skill keywords, categories, or supported values.
