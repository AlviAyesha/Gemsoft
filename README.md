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

## Deploy

1. Create a Postgres database (Neon, Supabase, Railway or your own) and set `DATABASE_URL`.
2. Set `PAYLOAD_SECRET` (`openssl rand -hex 32`) and `NEXT_PUBLIC_SERVER_URL` (the real domain, no trailing slash).
3. Run `npm run migrate` against the production database, then `npm run build && npm start` (or deploy to Vercel).
4. Optional: set the `SMTP_*` values so contact messages and job applications are emailed. Without them they are still saved in the CMS (Forms > Inquiries, Careers > Applications).
5. Uploads (`/media`, `/resumes`) are stored on disk. On Vercel or any host without a persistent disk, add a Payload storage adapter (S3, R2 or Vercel Blob).

After changing collections, run `npm run migrate:create <name>` and commit the new file in `src/migrations`.

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
- Contact details in the CMS under Settings > Site settings.
