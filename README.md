# jzotravel

Marketing and blog site for **JZO Travel**, a boutique travel advisor (Fora).
Static React SPA — Vite + React 18 + TypeScript + Tailwind, hosted on S3 behind
CloudFront. No backend and no database.

Live at **https://jzotravel.world**.

---

## Editing content (no code required)

Blog posts are edited through **Decap CMS at https://jzotravel.world/admin/**.

1. Sign in with GitHub. You need `Write` access to this repository — access is
   the collaborator list here, there is no separate account system.
2. Write the post, upload a photo, save.
3. Saving **opens a pull request**; it does not publish. Nothing reaches the
   live site until that pull request is reviewed and merged.
4. Merging deploys automatically, usually within a couple of minutes.

A few things the editor will hold you to, because the build enforces them:

- **Image description** is required on every photo. It is read aloud by screen
  readers — describe what is in the shot, not the filename.
- **Region** must match existing posts exactly. `spain` and `Spain` would show
  up as two different regions, so the build rejects the mismatch.
- **Slug** becomes the URL. Changing it on a published post breaks every
  existing link to that post.
- **Raw HTML does not render** in the body — it appears as literal text.
  Headings, bold, links and bullet lists all work.

If a pull request shows a failed check, open it and read the log: the build
lists every problem it found, in plain language, with the file name.

---

## Running it locally

```bash
npm install
npm run generate:posts   # once after cloning — see note below
npm run dev
```

| Command | Does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build → `dist/`. **This is the verification step** — there is no lint or test setup |
| `npm run generate:posts` | Compiles `content/blog/*.md` → `src/data/posts.generated.json` |
| `npm run preview` | Serves the production build |
| `npm run tf:fmt` | `terraform fmt -recursive` |

`src/data/posts.generated.json` is a **gitignored build artifact**. `predev` and
`prebuild` regenerate it automatically, but a fresh clone has no copy, so run
`npm run generate:posts` once or the import in `src/data/posts.ts` will not
resolve in your editor.

Markdown edits do not hot-reload — the generator runs once at startup. Re-run
`npm run generate:posts`, or restart the dev server.

---

## How content flows

```
content/blog/*.md                <- source of truth, what Decap commits
    │  scripts/generate-posts.mjs    (npm prebuild / predev hook)
    ▼
src/data/posts.generated.json    <- build artifact, gitignored
    │
    ▼
src/data/posts.ts                <- exports `posts` and `getPost(slug)`
    │
    ▼
BlogTeaser (3 newest) · /blog (all) · /blog/<slug>
```

`scripts/generate-posts.mjs` is the only content validation this site has. It
reports **every** problem across **all** files at once and exits non-zero
*before* Vite runs, so bad content fails the build instead of rendering
half-broken.

Photos live in `public/images/blog/` (the CMS media folder). Site chrome images
— the hero and About photos — stay in `public/images/` deliberately, out of the
media library, since that pane can delete files.

---

## Deploying

Pushing to `main` deploys. GitHub Actions runs `terraform apply`, builds, syncs
`dist/` to S3, and invalidates CloudFront. Work on a branch and merge via PR.

`/admin/` resolves only because of the directory-index rewrite in the CloudFront
viewer-request function — `default_root_object` applies only to the distribution
root. CloudFront allows **one** viewer-request function per cache behavior, so
that rewrite is merged into the existing `www`→apex function rather than added
alongside it.

Because the SPA fallback serves `/index.html` at 200 for any unknown path, **every
URL returns HTTP 200** — a status code proves nothing about routing. Check the
response body.

---

## More detail

- **`CLAUDE.md`** — architecture, the CMS setup and its traps, the image
  conversion workflow, logo assets, and the brand color tokens.
- **`INFRA.md`** — S3 + CloudFront + Route53, OIDC roles, remote state,
  bootstrapping.
- **`lenhofr/cms-oauth`** — the shared GitHub OAuth broker the CMS logs in
  through. This site's origin must be in its `allowed_origins`.
