# BB20 Insider

A personal, mobile-friendly Bigg Boss Hindi Season 20 dashboard, powered by live Google News RSS headlines and TVmaze episode metadata.

## Features
- Auto-refresh every 15 minutes **while the site is open** (also refreshes when the browser tab becomes visible).
- Server-side Google News RSS aggregation, with a 10-minute cache, deduplication, newest-first ordering and keyword-based categories.
- Episode listings from TVmaze, cached for one hour.
- Search, category chips, major news filter, local browser bookmarks, and spoiler shield.
- Responsive dark UI, publisher links and official JioHotstar watching link.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Put the `bb20-insider` folder into a GitHub repository.
2. Sign in to Vercel and select **Add New → Project**.
3. Import that repository, select the Next.js framework, then deploy.
4. Open the provided `*.vercel.app` URL. It will update on visits and while the tab is open.

No API keys or scheduled jobs are required.

## Technical and editorial limitations

- Google News RSS is an unofficial/undocumented feed. Availability, links and coverage may change. Some links route through Google News. No fallback publisher scraping is performed.
- Category labels and "major" badges are keyword heuristics, **not editorial verification**. Some articles may be rumors, clickbait, or not yet confirmed. Always check the source.
- Headlines are not full episode summaries or AI-generated recaps. The dashboard does **not** invent episode outcomes or contestant details.
- The spoiler shield hides the headline for keyword-matched eviction/nomination stories. It is not a comprehensive spoiler detector.
- TVmaze entries may have TBD names and scheduling inaccuracies. Video is not embedded.
- Browser bookmarks remain on one device/browser, and saved articles may disappear from the Saved tab once they fall outside the current feed (IDs remain in localStorage).
- Auto-refresh is not background push notification delivery. For alerts when the app is closed you would need notification subscriptions, durable storage, and a server-side scheduled feed checker.
- This fan tool is not affiliated with JioStar, COLORS, JioHotstar or Bigg Boss.

## Vercel news language controls

The Next.js deployment fetches both English and Hindi Google News RSS searches through `/api/news`, with a 10-minute server-side revalidation window. The Language menu filters based on the script of each headline (Devanagari = Hindi, otherwise English); bilingual/transliterated text can be imperfectly categorized. News sorts newest/major and can be filtered by category. Episode info uses `/api/episodes`. No scheduled GitHub Actions deployment is needed for this version.
