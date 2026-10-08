# GEMSOFT Technologies website

Next.js 16 (App Router) with Payload CMS 3 and Postgres, in one app.

- **Designed pages** (home, about, services, work, contact) come from the approved HTML design in `src/design/`. Re-import them with `python3 scripts/import-design.py` after design changes.
- **Insights** (blog) and **Careers** are CMS pages in `src/app/(frontend)/(cms)/`.
- **CMS** lives at `/admin`.

## Run locally

```bash
cp .env.example .env        # fill in DATABASE_URL and PAYLOAD_SECRET
npm install
npm run dev                 # http://localhost:3000, CMS at /admin (create the first user there)
npm run seed                # optional: sample insights, topics, authors and jobs
```

In development, Payload updates the database tables automatically.

## Deploy (staging or production)

Every option needs a Postgres database and these settings (see `.env.example`): `DATABASE_URL`, `PAYLOAD_SECRET` (`openssl rand -hex 32`), `NEXT_PUBLIC_SERVER_URL` (the site address, no trailing slash).
For staging also set `STAGING_PASSWORD`: the whole site then asks for a password and search engines are told not to index it.
The deploy build (`npm run build:deploy`) runs the database migrations first, then builds.

### Option A: Vercel + Neon (simplest)

1. Create a free Postgres database on [Neon](https://neon.tech) and copy its connection string.
2. Create a bucket on Cloudflare R2 (or S3) for uploads and an access key for it. Vercel has no disk for uploads.
3. Import the GitHub repo in Vercel. The build command comes from `vercel.json`.
4. Add the environment variables: `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `STAGING_PASSWORD`, the `S3_*` values, and optionally `SMTP_*` and `NEXT_PUBLIC_GA_ID`.
5. Deploy, open `/admin`, create the first admin user, then fill in Settings > Site settings.
6. Optional sample content: run `DATABASE_URL=... npm run seed` once from your computer.

### Option B: your own server with Docker

1. Install Docker on the server and copy the project there (or `git clone` it).
2. Create `.env` from `.env.example`. Set `POSTGRES_PASSWORD`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL` and `STAGING_PASSWORD`. `DATABASE_URL` is set by docker-compose.
3. Start the database, then build and start the site:
   ```bash
   docker compose up -d db
   docker compose build web     # runs migrations and pre-renders pages against the database
   docker compose up -d
   ```
4. Put a reverse proxy with HTTPS (Caddy is the simplest) in front of port 3000 and point your staging domain at the server.
5. Open `/admin`, create the first admin user, then fill in Settings > Site settings.

Uploads are kept in Docker volumes unless the `S3_*` values are set.

### After changing collections

Run `npm run migrate:create <name>` and commit the new file in `src/migrations`.

### Checks

GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, migrations and a full build on a fresh database for every push and pull request.

## SEO built in

- Canonical URLs, Open Graph and Twitter tags on every page, with a branded share image drawn from the title when an entry has no image (`/next/og`).
- Structured data: Organization, WebSite with search, BreadcrumbList, Service, Blog, BlogPosting, FAQPage, ProfilePage, JobPosting (Google for Jobs) and ItemList.
- `sitemap.xml` (with images), `robots.txt` (blocks everything outside production), RSS at `/insights/rss.xml`.
- Per-entry SEO tab in the CMS: title, description, image, focus keyword, canonical override and noindex.
- Numbered, crawlable pages (`/insights/page/2`), topic and author archives, noindexed search.
- Redirects managed in the CMS (Settings > Redirects); any unknown URL checks them before showing the 404.
- Pages are static and refresh within seconds of publishing in the CMS. Drafts can be previewed from the editor.

## Content to replace before launch

- Sample insights, authors and jobs from `npm run seed`.
- Careers page copy (perks, hiring steps, FAQ) in `src/content/careers.ts`.
- Contact details, phone, address and social links in the CMS under Settings > Site settings. The footer and contact page use them.
- Privacy, terms and cookie pages under Settings > Text pages. They are general templates; have them checked before launch.
