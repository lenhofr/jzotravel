import { Link } from 'react-router-dom'
import { posts } from '../data/posts'
import PostCard from '../components/PostCard'
import Footer from '../components/Footer'

/**
 * Every post, newest first. Deliberately minimal chrome, matching BlogPost —
 * the site Nav is a single-page anchor bar (#about, #services, …) and those
 * links are dead anywhere other than /, so neither blog route renders it.
 */
export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto px-6 py-20 w-full">
        <Link to="/" className="text-jzo-gold hover:text-jzo-gold-dark text-sm transition-colors inline-block mb-12">
          ← Back to home
        </Link>

        <div className="mb-14">
          <p className="text-jzo-gold text-xs font-medium tracking-[0.3em] uppercase mb-4">The Journal</p>
          <h1 className="font-serif text-4xl md:text-5xl text-slate-900">Stories from the Road</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
