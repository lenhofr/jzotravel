export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-jzo-gold text-xs font-medium tracking-[0.3em] uppercase mb-4">Our Story</p>
          <h2 className="font-serif text-4xl md:text-5xl text-slate-900 leading-tight mb-6">
            Travel Is Personal.<br />We Treat It That Way.
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-5">
            JZO Travel was built by two people who've spent years exploring the world together —
            and fell in love with helping others do the same. After filling journals with hidden gems,
            favorite tables, and roads less traveled, we decided to share that passion with people who
            deserve more than a cookie-cutter itinerary.
          </p>
          <p className="text-slate-600 leading-relaxed mb-5">
            We're boutique by design — intentionally small, intentionally personal. You'll work directly
            with us, not a call center. We take the time to understand what you love, what you need,
            and what you've always dreamed of, and then we make it real.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed italic">
            When we're not planning your next adventure, you'll find us somewhere in the world —
            notebook in hand, pug in tow, always scouting the next perfect spot.
          </p>
        </div>

        <div className="relative">
          <img
            src="https://picsum.photos/seed/jzo-about/800/600"
            alt="Traveler exploring the world"
            className="w-full h-[480px] object-cover shadow-xl"
          />
          <div className="absolute -bottom-5 -left-5 w-48 h-32 bg-jzo-gold -z-10" />
        </div>
      </div>
    </section>
  )
}
