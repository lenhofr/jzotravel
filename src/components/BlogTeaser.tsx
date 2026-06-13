import { Link } from 'react-router-dom'
import { posts } from '../data/posts'

export default function BlogTeaser() {
  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-jzo-gold text-xs font-medium tracking-[0.3em] uppercase mb-4">The Journal</p>
            <h2 className="font-serif text-4xl md:text-5xl text-slate-900">Stories from the Road</h2>
          </div>
          <p className="hidden md:block text-slate-300 text-sm">More coming soon</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map(post => {
            const hasPost = post.body.length > 0
            const Wrapper = ({ children }: { children: React.ReactNode }) =>
              hasPost
                ? <Link to={`/blog/${post.slug}`} onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="group cursor-pointer block">{children}</Link>
                : <article className="group">{children}</article>

            return (
              <Wrapper key={post.slug}>
                <div className="overflow-hidden mb-5">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-jzo-gold text-xs font-medium tracking-widest uppercase mb-2">{post.tag}</p>
                <h3 className="font-serif text-xl text-slate-900 mb-2 group-hover:text-jzo-gold-dark transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                {hasPost
                  ? <span className="text-jzo-gold text-xs tracking-widest uppercase">Read more →</span>
                  : <span className="text-xs text-slate-300 tracking-widest uppercase">Coming Soon</span>
                }
              </Wrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
