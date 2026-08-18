# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/blog site for JZO Travel, a boutique travel advisor (Fora). Static React SPA — no backend, no database, no tests. Content changes (new blog posts, photos) are the most common task.

## Commands

```bash
npm run dev            # Vite dev server (regenerates posts first)
npm run build          # vite build → dist/ (use this to verify changes)
npm run generate:posts # compile content/blog/*.md → src/data/posts.generated.json
npm run preview        # serve the production build locally
npm run tf:fmt         # terraform fmt -recursive
```

There is no lint or test setup; `npm run build` is the verification step.

`src/data/posts.generated.json` is a gitignored build artifact. `predev`/`prebuild`
rebuild it automatically, but **after a fresh clone run `npm run generate:posts` once**
or the import in `src/data/posts.ts` will not resolve in your editor.

## Deployment

Pushing to `main` deploys to production. GitHub Actions (`.github/workflows/deploy.yml`) runs `terraform apply`, builds, syncs `dist/` to S3 (`--delete`), and invalidates CloudFront (`/*`, which covers `/admin/*`). Work on a feature branch and merge via PR — `terraform-plan.yml` posts a plan comment on PRs touching terraform. Infra details (S3 + CloudFront + Route53, OIDC roles, remote state) are in `INFRA.md`.

### The CloudFront viewer-request function

`aws_cloudfront_function.redirect_www` in `terraform/acm.tf` does three things, and
CloudFront allows **only one viewer-request function per cache behavior** — so new
request-time logic must be merged into it, never attached as a second
`function_association`:

1. 301s `www.` to the apex.
2. 301s `/admin` to `/admin/`, which otherwise renders a blank page (no SPA route matches).
3. Rewrites any URI ending in `/` to `<uri>index.html`.

Rule 3 is what makes `/admin/` work. `default_root_object` applies *only* to the
distribution root, so `/admin/` asks S3 for the key `admin/`, 404s, and
`custom_error_response` serves `/index.html` at 200 — the SPA, not the CMS. Paths
without a trailing slash are untouched so `/blog/<slug>` still falls through to the SPA.

Because of that 404→200 fallback **every path returns HTTP 200**, so a status code proves
nothing about routing — check the response *body*. The function stays on
`cloudfront-js-1.0`, so avoid `String.prototype.endsWith` there; use `uri.slice(-1) === '/'`.

## Architecture

Vite + React 18 + TypeScript + Tailwind. Three routes in `src/App.tsx`: `/` (`src/pages/Home.tsx`, a stack of section components from `src/components/`), `/blog` (`src/pages/BlogIndex.tsx`, every post) and `/blog/:slug` (`src/pages/BlogPost.tsx`).

**Blog content lives in `content/blog/*.md`** — markdown with YAML frontmatter, edited through Decap CMS (see below) or by hand. `scripts/generate-posts.mjs` validates it and compiles it to `src/data/posts.generated.json`; `src/data/posts.ts` wraps that JSON and still exports `posts` and `getPost(slug)`, so the components are unchanged from the hardcoded-array days.

Frontmatter fields: `slug`, `tag` (region, e.g. "Michigan" — free text), `title`, `excerpt`, `image`, `imageAlt`, `date` (**ISO**, e.g. `2026-07-01`), optional `cta` (the line above the "Start Planning" button), and `draft`. The body is the markdown after the frontmatter, rendered by `react-markdown` with `@tailwindcss/typography` — so headings, bold, links and lists work.

`date` is stored ISO and displayed via `formatPostDate()` as "July 2026". Only month and year show, but the **day still decides ordering within a month** — the two June 2026 Seville posts carry `2026-06-02` and `2026-06-01` purely to hold their original relative order.

`BlogTeaser.tsx` shows the 3 newest posts on the home page plus a "View all stories" link; `/blog` lists them all. Both render the shared `PostCard.tsx`, so the two grids cannot drift apart. Every card links — the old "Coming Soon" state for bodiless posts is gone, and the generator now rejects an empty body.

The Fora travel intake form URL (`https://secure.foratravel.com/intake/dzqwAD2mHi`) is the CTA target, hardcoded in `Hero.tsx`, `Nav.tsx`, `Contact.tsx`, and `BlogPost.tsx`.

Brand theme is in `tailwind.config.js`: `jzo-navy`/`jzo-gold` colors, `font-serif` = Playfair Display, `font-sans` = Inter.

## Decap CMS

The admin UI is a static bundle at `public/admin/` (`index.html` + `config.yml`), served at
**https://jzotravel.world/admin/**. It rides the normal deploy — Vite copies `public/`
verbatim — so there is no extra bucket, distribution or workflow step.

- **Auth** goes through the shared broker at `https://cms-auth.lenhof.dev`, deployed from
  `lenhofr/cms-oauth`. That stack's `allowed_origins` must contain `https://jzotravel.world`
  or the login popup refuses to hand back a token. Check the live value with:
  `curl -s https://cms-auth.lenhof.dev/callback | grep -o 'var allowed = .*;'`
- **Access control is GitHub collaborators** on `lenhofr/jzotravel`, needing `Write`.
  There is no user database.
- **`publish_mode: editorial_workflow`** makes Decap open a PR on a `cms/<slug>` branch
  instead of committing to `main`. That PR review *is* the approval gate.
- **Never commit `local_backend: true`** — it bypasses both OAuth and the approval gate.
  Add it locally to test with `npx decap-server`, then take it out.
- The Decap script tag is pinned by version **and** SRI hash. Bumping the version without
  recomputing the hash makes `/admin/` render blank:
  `curl -sL https://unpkg.com/decap-cms@<v>/dist/decap-cms.js | openssl dgst -sha384 -binary | openssl base64 -A`
- `window.CMS_MANUAL_INIT = true` must stay in a script tag **before** the Decap bundle.
  After it, Decap has already auto-initialised and it does nothing.
- `/admin/` only resolves because of the directory-index rewrite in the CloudFront
  function (see below). `vite preview` serves directory indexes natively and will **not**
  reproduce a failure there.

## Adding a blog post

Through the CMS at `/admin/`, or by hand:

1. Convert/resize the photo (see image workflow below). CMS uploads land in
   `public/images/blog/` and are referenced as `/images/blog/<name>.webp`; the older
   posts reference `/images/<name>.webp` and are left where they are.
2. Add `content/blog/<slug>.md`. Filename must match the `slug` field — the generator
   warns when they diverge. Use today's date in ISO form and the article's closing
   pitch as `cta`.
3. `npm run build` validates it. The generator reports **every** problem across all
   files at once and exits non-zero before Vite runs, so a bad post breaks the build
   rather than rendering half-broken: missing/empty fields, non-ISO dates, bad slug
   characters, duplicate slugs, a non-absolute or nonexistent `image`, a missing
   `imageAlt`, and two spellings of one region (`spain` vs `Spain`).
4. The intake-form link at the end is automatic via the `BlogPost.tsx` CTA button.

## Image workflow (HEIC/JPEG → webp)

Source photos arrive as iPhone HEIC or JPEG. Targets: hero/full-bleed images 1920px wide, blog card/hero images ~800px wide, quality ~82–85. Name files descriptively (`waikiki-hero.webp`, `pictured-rocks.webp`), not `IMG_XXXX`.

```bash
# 1. HEIC first needs converting — cwebp cannot read HEIC; use macOS sips:
sips -s format jpeg -s formatOptions 95 photo.HEIC --out /tmp/photo.jpg

# 2. Bake in EXIF rotation — iPhone portrait photos store pixels landscape
#    with an orientation flag, and cwebp IGNORES it (the webp comes out
#    sideways). Always run exif_transpose; optionally crop in the same step:
python3 -c "
from PIL import Image, ImageOps
img = ImageOps.exif_transpose(Image.open('/tmp/photo.jpg'))
# optional crop, e.g. to remove an artifact along an edge:
# img = img.crop((0, 90, img.width, img.height))
img.save('/tmp/photo.jpg', quality=95)"

# 3. Resize + encode to webp (cwebp is installed via homebrew):
cwebp -q 82 -resize 1920 0 /tmp/photo.jpg -o public/images/<name>.webp
```

For a JPEG source, skip step 1 and run `cwebp` directly. `-resize <width> 0` preserves aspect ratio. Sanity-check the result visually and keep hero files ≲300KB. Source photos smaller than ~800px wide will look soft in the full-bleed hero — ask for the full-resolution original.

Don't commit source HEIC/JPEG files; only the final `.webp` belongs in `public/images/`
(or `public/images/blog/` for CMS uploads). Some untracked leftovers (e.g. `IMG_5810.webp`, source HEICs) may sit in `public/images/` — leave them alone and don't add them to commits.

## Logo assets

The wordmark is **SVG**, traced from a high-res master with `potrace` — it's flat-color line art, so it vectorizes cleanly and stays crisp at every DPI. Don't replace the SVGs with PNGs; a raster wordmark looks soft in the nav.

- `public/logo.svg` — gold `#AD772D`, used by `Nav.tsx` on white/hero
- `public/logo-white.svg` — same paths filled white, used by `Footer.tsx` on navy
- `public/favicon.svg` + `favicon-32/180.png`, `icon-192/512.png` — the **airplane glyph only**, on a navy plate. The full wordmark is unreadable in a 32px square, so never squeeze it into the icons.
- `public/og-image.png` — 1200×630, wordmark centered on navy

To regenerate from a new master: crop to the alpha bounding box first (Canva exports carry huge transparent padding and EXIF/XMP with the designer's name and Canva/Facebook IDs — both should be stripped), then `potrace` the alpha silhouette at ~4000px wide. Strip the XML prolog and DTD from potrace's output and keep `viewBox` only, so CSS controls the size.

### Gold tokens

Three golds in `tailwind.config.js`, and they are not interchangeable:

- `jzo-gold` `#AD772D` — the logo color; gold on white and gold button fills
- `jzo-gold-dark` `#8F6224` — hover states
- `jzo-gold-light` `#C98C36` — **gold text on navy only** (the Contact section)

No single gold clears WCAG AA on both white and navy: gold-on-navy needs relative luminance ≥0.238, white-on-gold needs ≤0.183. Hence the split. If you change one, recheck the others rather than propagating a single value.
