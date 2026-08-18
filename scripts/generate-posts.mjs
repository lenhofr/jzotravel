/**
 * Reads the markdown blog posts in content/blog/ and writes
 * src/data/posts.generated.json for the React pages to import.
 *
 * Runs automatically via npm's prebuild/predev hooks, so `npm run build`
 * (which is what CI calls) regenerates the JSON without any workflow change.
 *
 * This is the ONLY schema validation blog content gets. Anything invalid is
 * collected and reported here, and the process exits non-zero — a bad post must
 * break the build, never render as a blank or half-broken page. Every problem
 * across every file is reported in one pass, so a content editor fixing a batch
 * of posts sees the whole list rather than discovering them one build at a time.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const contentDir = path.join(repoRoot, "content/blog");
const outPath = path.join(repoRoot, "src/data/posts.generated.json");

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Longer than this and it will wrap the eyebrow line above the post title. */
const TAG_MAX_LENGTH = 40;

/** Prefix every failure so the reason is obvious in CI log noise. */
const fail = (message) => {
  console.error(`\n✖ generate-posts: ${message}\n`);
  process.exit(1);
};

/**
 * YAML parses an unquoted `date: 2026-03-12` into a Date, and Decap writes dates
 * unquoted. Normalise both spellings to a plain ISO day string, in UTC — using
 * local time would shift a first-of-the-month date into the previous month.
 */
function normaliseDate(value) {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return value.toISOString().slice(0, 10);
  }
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  // Tolerate a full ISO timestamp; the site only ever displays month + year.
  const dayPart = trimmed.includes("T") ? trimmed.slice(0, trimmed.indexOf("T")) : trimmed;
  if (!ISO_DATE_RE.test(dayPart)) return null;

  const [year, month, day] = dayPart.split("-").map(Number);
  const asDate = new Date(Date.UTC(year, month - 1, day));
  const roundTrips =
    asDate.getUTCFullYear() === year &&
    asDate.getUTCMonth() === month - 1 &&
    asDate.getUTCDate() === day;
  return roundTrips ? dayPart : null;
}

/**
 * react-markdown escapes raw HTML rather than dropping it, so an editorial
 * <!-- comment --> would render as literal text on the page. Drop them, then
 * collapse the blank lines they leave behind.
 */
function stripHtmlComments(body) {
  return body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function requireString(data, field, errors, file) {
  const value = data[field];
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${file}: '${field}' is required and must be a non-empty string.`);
    return null;
  }
  return value.trim();
}

/**
 * Tags are free text — this is a travel blog and the set of regions is open
 * ended, so a fixed list would make every new destination a code change. The
 * cost of that freedom is drift: "michigan" and "Michigan" are different
 * strings and would render as two different regions. Collapsing case and
 * whitespace gives the key that catches it (see assertNoTagDrift).
 */
function tagKey(tag) {
  return tag.toLowerCase().replace(/\s+/g, " ").trim();
}

function readPost(file, errors) {
  const raw = fs.readFileSync(path.join(contentDir, file), "utf8");

  let parsed;
  try {
    parsed = matter(raw);
  } catch (err) {
    errors.push(`${file}: frontmatter is not valid YAML — ${err.message}`);
    return null;
  }

  const { data, content } = parsed;
  if (!data || Object.keys(data).length === 0) {
    errors.push(`${file}: no frontmatter block found (expected a '---' fenced YAML header).`);
    return null;
  }

  const title = requireString(data, "title", errors, file);
  const slug = requireString(data, "slug", errors, file);
  const excerpt = requireString(data, "excerpt", errors, file);
  const tag = requireString(data, "tag", errors, file);

  if (slug && !SLUG_RE.test(slug)) {
    errors.push(
      `${file}: 'slug' must be lowercase letters, digits and single hyphens (got "${slug}").`,
    );
  }

  if (tag && tag.length > TAG_MAX_LENGTH) {
    errors.push(
      `${file}: 'tag' is ${tag.length} characters (max ${TAG_MAX_LENGTH}). It is displayed as a ` +
        `short eyebrow label above the title — use a region, not a sentence.`,
    );
  }

  // Both templates render <img src={post.image}> unconditionally, so a post
  // without one ships a broken image rather than degrading to a text card.
  const image = requireString(data, "image", errors, file);
  const imageAlt = requireString(data, "imageAlt", errors, file);

  if (image && !image.startsWith("/")) {
    errors.push(
      `${file}: 'image' must be a site-absolute path starting with "/" ` +
        `(got "${image}"). Decap writes these using public_folder, so /images/blog/... is correct.`,
    );
  }

  if (image && image.startsWith("/") && !fs.existsSync(path.join(repoRoot, "public", image))) {
    errors.push(
      `${file}: 'image' points at "${image}", which does not exist in public/. ` +
        `Check the filename, or upload the photo through the CMS.`,
    );
  }

  const date = normaliseDate(data.date);
  if (!date) {
    errors.push(
      `${file}: 'date' must be an ISO calendar date, e.g. "2026-03-12" (got ${JSON.stringify(
        data.date,
      )}). Human strings like "July 2026" are formatted at render time, not stored.`,
    );
  }

  // Optional: falls back to a generic line in BlogPost.tsx when absent.
  let cta;
  if (data.cta !== undefined && data.cta !== null && String(data.cta).trim() !== "") {
    if (typeof data.cta !== "string") {
      errors.push(`${file}: 'cta' must be a string (got ${JSON.stringify(data.cta)}).`);
    } else {
      cta = data.cta.trim();
    }
  }

  if (data.draft !== undefined && typeof data.draft !== "boolean") {
    errors.push(`${file}: 'draft' must be true or false (got ${JSON.stringify(data.draft)}).`);
  }

  const body = stripHtmlComments(content.trim());
  if (body === "") {
    errors.push(
      `${file}: post body is empty. Every post needs a body — the home page links every ` +
        `card it renders, so a bodiless post would link to a blank page.`,
    );
  }

  const expectedFile = slug ? `${slug}.md` : null;
  if (expectedFile && expectedFile !== file) {
    console.warn(
      `⚠ generate-posts: ${file} declares slug "${slug}" — the URL will be /blog/${slug}, ` +
        `not /blog/${file.replace(/\.md$/, "")}.`,
    );
  }

  if (!title || !slug || !excerpt || !tag || !image || !imageAlt || !date || body === "") {
    return null;
  }

  return {
    title,
    slug,
    date,
    tag,
    excerpt,
    image,
    imageAlt,
    body,
    ...(cta ? { cta } : {}),
    draft: data.draft === true,
    file,
  };
}

function assertNoDuplicateSlugs(posts, errors) {
  const seen = new Map();
  for (const post of posts) {
    if (seen.has(post.slug)) {
      errors.push(
        `${post.file}: duplicate slug "${post.slug}", already used by ${seen.get(post.slug)}. ` +
          `Both would answer at /blog/${post.slug}.`,
      );
    } else {
      seen.set(post.slug, post.file);
    }
  }
}

/**
 * The site groups posts by tag visually, so two spellings of one region read as
 * two regions. Nothing downstream can detect that — both are valid strings — so
 * it has to fail here, naming every file involved rather than just the second
 * one, since either spelling might be the one worth keeping.
 */
function assertNoTagDrift(posts, errors) {
  const byKey = new Map();
  for (const post of posts) {
    const key = tagKey(post.tag);
    if (!byKey.has(key)) byKey.set(key, new Map());
    const spellings = byKey.get(key);
    if (!spellings.has(post.tag)) spellings.set(post.tag, []);
    spellings.get(post.tag).push(post.file);
  }

  for (const spellings of byKey.values()) {
    if (spellings.size < 2) continue;
    const detail = [...spellings.entries()]
      .map(([spelling, files]) => `      "${spelling}" in ${files.join(", ")}`)
      .join("\n");
    errors.push(
      `these posts use the same region spelled inconsistently, so it would render as two ` +
        `separate regions:\n${detail}\n      Pick one spelling and use it everywhere.`,
    );
  }
}

function main() {
  if (!fs.existsSync(contentDir)) {
    fail(`content directory ${path.relative(repoRoot, contentDir)} does not exist.`);
  }

  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  if (files.length === 0) {
    fail(`no .md files found in ${path.relative(repoRoot, contentDir)}.`);
  }

  const errors = [];
  const posts = files.map((file) => readPost(file, errors)).filter(Boolean);

  assertNoDuplicateSlugs(posts, errors);
  assertNoTagDrift(posts, errors);

  if (errors.length > 0) {
    fail(
      `${errors.length} content error(s) in content/blog:\n\n` +
        errors.map((e) => `  • ${e}`).join("\n"),
    );
  }

  const published = posts
    .filter((post) => !post.draft)
    // Newest first. Slug breaks ties so the output is stable across machines
    // and across filesystems that enumerate directories in different orders.
    .sort((a, b) =>
      a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date),
    );

  if (published.length === 0) {
    console.warn("⚠ generate-posts: every post is marked draft — the blog will render empty.");
  }

  // Only the fields the site renders reach the bundle; draft and file are
  // build-time bookkeeping.
  const output = published.map(({ title, slug, date, tag, excerpt, image, imageAlt, body, cta }) => ({
    title,
    slug,
    date,
    tag,
    excerpt,
    image,
    imageAlt,
    ...(cta ? { cta } : {}),
    body,
  }));

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);

  const skipped = posts.length - published.length;
  console.log(
    `generate-posts: wrote ${published.length} post(s) to ` +
      `${path.relative(repoRoot, outPath)}${skipped > 0 ? ` (${skipped} draft skipped)` : ""}.`,
  );
}

main();
