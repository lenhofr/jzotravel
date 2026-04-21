const posts = [
  {
    seed: 'jzo-blog1',
    tag: 'Southeast Asia',
    title: 'Two Weeks in Vietnam: The Route Nobody Takes',
    excerpt: "Skip the tourist trail. Here's how to see Vietnam's quieter, more beautiful side.",
  },
  {
    seed: 'jzo-blog2',
    tag: 'Europe',
    title: 'Why the Azores Should Be Your Next European Escape',
    excerpt: "Dramatic cliffs, thermal pools, and not a tour bus in sight. Portugal's best-kept secret.",
  },
  {
    seed: 'jzo-blog3',
    tag: 'South America',
    title: "Patagonia in a Week: What's Worth It and What's Not",
    excerpt: "An honest guide to planning the end of the world without blowing your budget.",
  },
]

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
          {posts.map(post => (
            <article key={post.title} className="group cursor-pointer">
              <div className="overflow-hidden mb-5">
                <img
                  src={`https://picsum.photos/seed/${post.seed}/600/400`}
                  alt={post.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-jzo-gold text-xs font-medium tracking-widest uppercase mb-2">{post.tag}</p>
              <h3 className="font-serif text-xl text-slate-900 mb-2 group-hover:text-jzo-gold-dark transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
              <span className="text-xs text-slate-300 tracking-widest uppercase">Coming Soon</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
