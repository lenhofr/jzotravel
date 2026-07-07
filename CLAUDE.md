# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/blog site for JZO Travel, a boutique travel advisor (Fora). Static React SPA — no backend, no database, no tests. Content changes (new blog posts, photos) are the most common task.

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # tsc + vite build → dist/ (use this to verify changes)
npm run preview      # serve the production build locally
npm run tf:fmt       # terraform fmt -recursive
```

There is no lint or test setup; `npm run build` is the verification step.

## Deployment

Pushing to `main` deploys to production. GitHub Actions (`.github/workflows/deploy.yml`) runs `terraform apply`, builds, syncs `dist/` to S3 (`--delete`), and invalidates CloudFront. Work on a feature branch and merge via PR — `terraform-plan.yml` posts a plan comment on PRs touching terraform. Infra details (S3 + CloudFront + Route53, OIDC roles, remote state) are in `INFRA.md`.

## Architecture

Vite + React 18 + TypeScript + Tailwind. Two routes in `src/App.tsx`: `/` (`src/pages/Home.tsx`, a stack of section components from `src/components/`) and `/blog/:slug` (`src/pages/BlogPost.tsx`).

**All blog content lives in `src/data/posts.ts`** — there is no CMS or markdown. Each `Post` has a `slug`, `tag` (region, e.g. "Michigan"), `title`, `excerpt`, `image`, `date` (display string like "July 2026"), `body` (array of plain-text paragraphs — no HTML/markdown rendering, so lists become one paragraph per item), and optional `cta` (the line above the "Start Planning" button at the end of the post). `BlogTeaser.tsx` renders every post on the home page in a 3-column grid; a post with an empty `body` renders as "Coming Soon" without a link.

The Fora travel intake form URL (`https://secure.foratravel.com/intake/dzqwAD2mHi`) is the CTA target, hardcoded in `Hero.tsx`, `Nav.tsx`, `Contact.tsx`, and `BlogPost.tsx`.

Brand theme is in `tailwind.config.js`: `jzo-navy`/`jzo-gold` colors, `font-serif` = Playfair Display, `font-sans` = Inter.

## Adding a blog post

1. Convert/resize the photo (see image workflow below) into `public/images/`, referenced as `/images/<name>.webp`.
2. Add the post as the **first** entry in `src/data/posts.ts` (newest first), with the current month as `date` and the article's closing pitch as `cta`.
3. The intake-form link at the end is automatic via the `BlogPost.tsx` CTA button.

## Image workflow (HEIC/JPEG → webp)

Source photos arrive as iPhone HEIC or JPEG. Targets: hero/full-bleed images 1920px wide, blog card/hero images ~800px wide, quality ~82–85. Name files descriptively (`waikiki-hero.webp`, `pictured-rocks.webp`), not `IMG_XXXX`.

```bash
# 1. HEIC first needs converting — cwebp cannot read HEIC; use macOS sips:
sips -s format jpeg -s formatOptions 95 photo.HEIC --out /tmp/photo.jpg

# 2. (Optional) crop, e.g. to remove an artifact along an edge — Pillow:
python3 -c "
from PIL import Image
img = Image.open('/tmp/photo.jpg')
img.crop((0, 90, img.width, img.height)).save('/tmp/photo.jpg', quality=95)"

# 3. Resize + encode to webp (cwebp is installed via homebrew):
cwebp -q 82 -resize 1920 0 /tmp/photo.jpg -o public/images/<name>.webp
```

For a JPEG source, skip step 1 and run `cwebp` directly. `-resize <width> 0` preserves aspect ratio. Sanity-check the result visually and keep hero files ≲300KB. Source photos smaller than ~800px wide will look soft in the full-bleed hero — ask for the full-resolution original.

Don't commit source HEIC/JPEG files; only the final `.webp` belongs in `public/images/`. Some untracked leftovers (e.g. `IMG_5810.webp`, source HEICs) may sit in `public/images/` — leave them alone and don't add them to commits.
