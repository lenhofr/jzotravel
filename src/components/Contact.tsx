export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-slate-900">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-amber-400 text-xs font-medium tracking-[0.3em] uppercase mb-4">Get in Touch</p>
        <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-6">
          Ready to Start<br />Your Next Chapter?
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Every great journey starts with a conversation. Tell us where you've always wanted to go —
          we'll handle everything else.
        </p>
        <a
          href="mailto:hello@jzotravel.world"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold px-10 py-4 transition-colors text-sm tracking-widest uppercase"
        >
          hello@jzotravel.world
        </a>
        <p className="text-slate-600 text-sm mt-6">We respond within 24 hours.</p>
      </div>
    </section>
  )
}
