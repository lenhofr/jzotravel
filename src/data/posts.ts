import generated from './posts.generated.json'

/**
 * Blog content lives in content/blog/*.md. scripts/generate-posts.mjs validates
 * that markdown and compiles it into posts.generated.json, which is a build
 * artifact — gitignored, and rebuilt by the prebuild/predev npm hooks. On a
 * fresh clone it does not exist yet, so run `npm run generate:posts` once
 * before the TypeScript import below will resolve in an editor.
 */
export interface Post {
  slug: string
  /** Region shown as the eyebrow label above the title, e.g. "Michigan" */
  tag: string
  title: string
  excerpt: string
  image: string
  /** Alt text for `image`; the generator requires it whenever an image is set */
  imageAlt: string
  /** ISO calendar date, e.g. "2026-07-01". Use formatPostDate() to display it. */
  date: string
  /** Markdown, rendered by react-markdown */
  body: string
  /** Line shown above the Start Planning button at the end of the post */
  cta?: string
}

/** Already sorted newest first by the generator. */
export const posts: Post[] = generated as Post[]

export function getPost(slug: string): Post | undefined {
  return posts.find(p => p.slug === slug)
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/**
 * Renders an ISO date as the "July 2026" string the site has always shown.
 *
 * Parsed by regex rather than with `new Date()` on purpose: `new Date('2026-07-01')`
 * is UTC midnight, and formatted anywhere behind UTC it lands on June 30 — so a
 * first-of-the-month post would silently display the previous month.
 */
export function formatPostDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return iso
  return `${MONTHS[Number(m[2]) - 1]} ${m[1]}`
}
