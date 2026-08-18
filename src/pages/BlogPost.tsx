import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { getPost, formatPostDate } from '../data/posts'

/**
 * Typography for the markdown body. The @tailwindcss/typography defaults are
 * overridden to match what the hand-rolled <p> stack used to render, so posts
 * migrated from the old string[] bodies look unchanged — while lists, headings
 * and links, which previously had no way to exist, now render properly.
 */
const PROSE = [
  'prose max-w-none',
  'prose-headings:font-serif prose-headings:text-slate-900 prose-headings:font-normal',
  'prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4',
  'prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3',
  'prose-p:text-slate-700 prose-p:text-lg prose-p:leading-relaxed',
  'prose-li:text-slate-700 prose-li:text-lg prose-li:leading-relaxed',
  'prose-strong:text-slate-900 prose-strong:font-semibold',
  'prose-a:text-jzo-gold prose-a:no-underline hover:prose-a:text-jzo-gold-dark',
  'prose-blockquote:border-l-2 prose-blockquote:border-jzo-gold',
  'prose-blockquote:font-serif prose-blockquote:not-italic prose-blockquote:text-slate-600',
  'prose-img:w-full',
].join(' ')

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Post not found.</p>
          <Link to="/" className="text-jzo-gold hover:text-jzo-gold-dark text-sm transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={post.image}
          alt={post.imageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-6 pb-12 w-full">
            <p className="text-jzo-gold text-xs font-medium tracking-[0.3em] uppercase mb-3">{post.tag}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight max-w-2xl">{post.title}</h1>
            <p className="text-white/60 text-sm mt-3">{formatPostDate(post.date)}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link to="/" className="text-jzo-gold hover:text-jzo-gold-dark text-sm transition-colors inline-block mb-12">
          ← Back to home
        </Link>

        <div className={PROSE}>
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>

        {/* CTA */}
        <div className="mt-16 pt-12 border-t border-stone-100 text-center">
          <p className="font-serif text-2xl text-slate-900 mb-3">Ready to see it for yourself?</p>
          <p className="text-slate-500 mb-8">{post.cta ?? 'Let us plan your next itinerary — every detail handled.'}</p>
          <a
            href="https://secure.foratravel.com/intake/dzqwAD2mHi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-jzo-gold hover:bg-jzo-gold-dark text-white font-semibold px-8 py-4 transition-colors text-sm tracking-widest uppercase"
          >
            Start Planning
          </a>
        </div>
      </div>
    </article>
  )
}
