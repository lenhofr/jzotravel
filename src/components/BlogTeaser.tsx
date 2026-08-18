import { Link } from 'react-router-dom'
import { posts } from '../data/posts'
import PostCard from './PostCard'

/**
 * The home page shows only the newest few posts — the grid is one row, and
 * letting it grow unbounded would push Contact off the bottom of the page as
 * the blog fills up. Everything older is reachable at /blog.
 */
const HOME_POST_COUNT = 3

export default function BlogTeaser() {
  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-jzo-gold text-xs font-medium tracking-[0.3em] uppercase mb-4">The Journal</p>
            <h2 className="font-serif text-4xl md:text-5xl text-slate-900">Stories from the Road</h2>
          </div>
          <Link
            to="/blog"
            className="hidden md:block text-jzo-gold hover:text-jzo-gold-dark text-sm tracking-widest uppercase transition-colors whitespace-nowrap"
          >
            View all stories →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.slice(0, HOME_POST_COUNT).map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {/* The header link is hidden on mobile, where it would crowd the heading. */}
        <div className="mt-12 text-center md:hidden">
          <Link
            to="/blog"
            className="text-jzo-gold hover:text-jzo-gold-dark text-sm tracking-widest uppercase transition-colors"
          >
            View all stories →
          </Link>
        </div>
      </div>
    </section>
  )
}
