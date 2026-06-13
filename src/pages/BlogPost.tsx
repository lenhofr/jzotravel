import { useParams, Link } from 'react-router-dom'
import { getPost } from '../data/posts'

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
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-6 pb-12 w-full">
            <p className="text-jzo-gold text-xs font-medium tracking-[0.3em] uppercase mb-3">{post.tag}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight max-w-2xl">{post.title}</h1>
            <p className="text-white/60 text-sm mt-3">{post.date}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link to="/" className="text-jzo-gold hover:text-jzo-gold-dark text-sm transition-colors inline-block mb-12">
          ← Back to home
        </Link>

        <div className="space-y-6">
          {post.body.map((paragraph, i) => (
            <p key={i} className="text-slate-700 text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 pt-12 border-t border-stone-100 text-center">
          <p className="font-serif text-2xl text-slate-900 mb-3">Ready to see it for yourself?</p>
          <p className="text-slate-500 mb-8">Let us plan your Seville itinerary — every detail handled.</p>
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
