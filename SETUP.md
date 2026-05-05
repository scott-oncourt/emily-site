# Emily — Setup Guide

## 0. Standalone Sanity Studio — already done ✓

A standalone Sanity Studio has been created at `C:\Users\scott\emily` using `npm create sanity@latest` connected to project `7s19r2sb` (dataset: `production`). To launch it independently, run `npm run dev` inside that folder — it serves the Studio at `http://localhost:3333`. This Studio and the embedded Studio at `/studio` in the Next.js site both write to the same Sanity backend.

## 1. Get your Sanity credentials

1. Go to https://sanity.io/manage
2. Select your project (or create one — free tier is fine)
3. Note your **Project ID** (shown on the project overview page)
4. Go to **API → Tokens → Add API token**
   - Name it "Emily site read"
   - Role: **Editor**
   - Copy the token

## 2. Create your environment file

In the `site/` folder, copy the example file:

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and fill in:

```
NEXT_PUBLIC_SANITY_PROJECT_ID="paste-your-project-id-here"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_READ_TOKEN="paste-your-token-here"
```

## 3. Install dependencies & run locally

```bash
cd site
npm install
npm run dev
```

Open http://localhost:3000 — the site is live.
Open http://localhost:3000/studio — the Sanity Studio is live.

## 4. Upload your photos

1. Go to http://localhost:3000/studio
2. Click **Site Settings** — add Emily's bio and set her portrait photo
3. Click **Gallery Photos** → **New Photo**
   - Upload the image
   - Set `Hero image = true` on the best hero shot (only one)
   - Set `Featured in gallery = true` for gallery shots
   - Set `Gallery order` numbers (1, 2, 3...) to control sequence
4. The site at localhost:3000 updates every 60 seconds automatically

## 5. Deploy to Vercel (free)

1. Push the `site/` folder to a GitHub repo
2. Go to https://vercel.com → New Project → import the repo
3. Add your environment variables in Vercel's dashboard (same as .env.local)
4. Deploy — Vercel gives you a free URL immediately (e.g. emily-cambodia.vercel.app)
5. When Emily has a domain name, connect it in Vercel → Settings → Domains

## 6. Add Vercel URL to Sanity CORS

1. Go to https://sanity.io/manage → your project → API → CORS Origins
2. Add your Vercel URL (e.g. https://emily-cambodia.vercel.app)
3. Also add http://localhost:3000 for local development

## Content Emily can manage herself (future)

Once the Studio is deployed separately or on Vercel, Emily can:
- Upload new gallery photos without any coding
- Update her bio
- Add products when the shop is ready

The Studio URL would be: https://emily-cambodia.vercel.app/studio
