# Performance + SEO changes (branch `perf-seo`)

## Before / after

Pixel 7 emulation, throttled ~4G, `perf.mjs`. "After" is `next start` on localhost, so it excludes CDN/edge latency (it does include the real Cloudinary image downloads). Expect production on Vercel to be similar or better.

| Page | Metric | Before (live) | After (local prod build) |
|---|---|---|---|
| Home | load event | 36.9 s | 2.7 s |
| Home | LCP | 5.9 s | 1.8 s |
| Home | transferred | ~4.76 MB | ~0.65 MB |
| Post (DsWJVnt1...) | load event | 33.0 s | 1.6 s |
| Post | LCP | 2.7 s | 0.5 s |
| Post | transferred | ~0.63 MB | ~0.19 MB |

Other:
- Home first-load JS: 109 kB (React + Next only; no Firebase SDK for anonymous visitors). `/create` and `/edit` carry the editor + Firebase (271 kB) but only load on those routes.
- Raw HTML of `/` now contains all 17 post links, titles, excerpts; post HTML contains the full cleaned body, comments, canonical, OG/Twitter tags and BlogPosting JSON-LD.

## What changed

**Rendering / caching**
- `/`, `/blog`, `/about`, `/post/[id]` are Server Components with ISR (`revalidate = 300`); `generateStaticParams` pre-builds all posts, new posts render on first request (`dynamicParams`).
- Data is read on the server via the Firestore REST API (`lib/firestore.js`) with `fetch` cache + tags (`posts`, `post-<id>`, `comments`). No Firebase SDK on the server or in public pages.
- Home/blog receive only `{id, title, date, image, excerpt}` (excerpt computed server-side). Comments slider gets the latest 5 comments (`limit 5` query) with titles resolved from the already-fetched post list.
- Post comments are server-rendered, then refreshed on mount with a tiny REST query (no SDK). The Firestore SDK is only downloaded when someone posts a comment.
- Auth: `AuthProvider` (hooks/useUser.js) loads `firebase/auth` lazily. Anonymous visitors with no saved session never download it; returning signed-in users (detected via the Firebase IndexedDB) and `/signin`, `/create`, `/edit` do. Client islands: Navigation, OwnerLink (Create/Edit links, allowed-emails list now in `lib/site.js`), ShareButton, Comments, CommentsSlider.
- On-demand revalidation: `app/actions.js` `revalidateSite(id)` (tags + `revalidatePath` for `/`, `/blog`, `/post/<id>`, `/sitemap.xml`) is called after create, edit and delete.
- `cleanMsoContent` moved to `lib/content.js` (shared), plus DOM-free `htmlToText`.

**Images**: Cloudinary URLs get `f_auto,q_auto,w_N` (srcset 480/800/1200 for cards, 640/1000/1600 for post hero, `c_fill,g_auto,w_1200,h_630` for OG); Unsplash gets `auto=format&q=70&w=`. Plain `<img>` with width/height, first card `fetchpriority=high`, cards 4+ `loading=lazy`, `decoding=async`. `images.unoptimized` kept. `/about` portrait resized (500 kB PNG -> 100 kB `amrita.jpg`). Static images get immutable cache headers. Post hero is 16:9 on mobile (was natural ratio) to prevent layout shift; desktop unchanged (h-96).

**Fonts**: `next/font/google` (self-hosted, swap) for Jost and Playwrite CU; Google Fonts links/@imports removed; unused Open Sans removed. Only Jost is preloaded.

**SEO**: `metadataBase`, title template `%s | Pin Drop Silence`, canonical on every page, `app/sitemap.js`, `app/robots.js`, BlogPosting JSON-LD (posts), WebSite + Person (home), ProfilePage (about), per-post description from the cleaned excerpt (the stored `metaDescription` is often Word CSS junk, so it is only a fallback), OG/Twitter images, `noindex` on `/create`, `/edit`, `/signin`, real 404 (with noindex) for unknown posts, descriptive alt text. `verification.google` is read from env `GOOGLE_SITE_VERIFICATION`.

**Deps removed**: `axios`, `@uiw/react-md-editor` (unused). `services/api.js`, `Home.jsx`, `BlogPreview.jsx`, `BlogList.jsx` removed (replaced by server pages).

## "Posts take a lot of time to upload"
Publishing itself is a single Firestore `addDoc`/`updateDoc` (no image upload; the cover is a pasted URL), so it is fast. The slowness was: (1) after saving, the redirect landed on a fully client-rendered page that loaded the whole SDK and all posts; (2) huge pasted MS Word HTML (with style blocks and `mso-*` junk) was stored as-is. Now content is cleaned with `cleanMsoContent` before saving (smaller docs; render output identical, since the same cleaner already ran at display time), `metaDescription` is generated DOM-free from cleaned text, and the new post page is pre-warmed by the revalidate call. First view of a brand-new post renders on demand (~hundreds of ms) then is cached.

## Owner action items
1. Vercel env var (optional, only if using URL-prefix verification): `GOOGLE_SITE_VERIFICATION` = the token from Search Console.
2. Merge/deploy `perf-seo` when happy (nothing pushed yet).
3. Cloudinary: keep delivering originals as-is; transforms happen in the URL.

## Google Search Console setup for www.pindropsilence.in
**Preferred: Domain property (DNS TXT)**
1. Go to https://search.google.com/search-console and sign in with the Google account that should own it.
2. Add property -> **Domain** -> enter `pindropsilence.in` -> Continue.
3. Copy the TXT record shown (`google-site-verification=...`).
4. At the domain registrar (or wherever DNS is hosted; if the domain uses Vercel nameservers, add it in Vercel -> Domains -> DNS Records): add a TXT record, host `@`, value = the copied string.
5. Wait a few minutes (up to a few hours), click **Verify**. This covers www and non-www, http and https.

**Alternative: URL-prefix property**
1. Add property -> **URL prefix** -> `https://www.pindropsilence.in/`.
2. Choose **HTML tag**; copy only the `content="..."` value.
3. In Vercel -> Project -> Settings -> Environment Variables add `GOOGLE_SITE_VERIFICATION` = that value (Production), redeploy.
4. Click **Verify** in Search Console.

**Submit the sitemap**
1. Search Console -> Sitemaps -> enter `sitemap.xml` (full URL `https://www.pindropsilence.in/sitemap.xml`) -> Submit.
2. Use URL Inspection on the home page and a couple of posts -> **Request indexing**.
3. Check the Pages report after a few days; the sitemap auto-updates (5 min cache plus instant refresh on publish).

## Risks / notes
- `revalidateSite` is a public server action; it only purges caches (no reads/writes), but anyone could call it to force regeneration. Low risk; add a rate limit or ID-token check if abused.
- Firestore REST relies on posts/comments being publicly readable (they are today). If rules are tightened, server fetches will fail.
- Pages are cached up to 5 minutes for visitor-created comments on the home slider; post pages refresh comments on load.
- A failed Firestore fetch during `next build` fails the build (intentional, avoids caching empty pages).
