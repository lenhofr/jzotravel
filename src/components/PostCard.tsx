import { Link } from 'react-router-dom'
import type { Post } from '../data/posts'

/**
 * One card in the post grid. Shared by the home page teaser and /blog so the
 * two cannot drift apart — they render the same card, only the set differs.
 */
export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
      className="group cursor-pointer block"
    >
      <div className="overflow-hidden mb-5">
        <img
          src={post.image}
          alt={post.imageAlt}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <p className="text-jzo-gold text-xs font-medium tracking-widest uppercase mb-2">{post.tag}</p>
      <h3 className="font-serif text-xl text-slate-900 mb-2 group-hover:text-jzo-gold-dark transition-colors leading-snug">
        {post.title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
      <span className="text-jzo-gold text-xs tracking-widest uppercase">Read more →</span>
    </Link>
  )
}
