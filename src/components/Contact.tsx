export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-jzo-navy relative">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-jzo-gold-light text-xs font-medium tracking-[0.3em] uppercase mb-4">Get in Touch</p>
        <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-6">
          Ready to Start<br />Your Next Chapter?
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Every great journey starts with a conversation. Tell us where you've always wanted to go —
          we'll handle everything else.
        </p>
        <a
          href="https://secure.foratravel.com/intake/dzqwAD2mHi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-jzo-gold hover:bg-jzo-gold-dark text-white font-semibold px-10 py-4 transition-colors text-sm tracking-widest uppercase"
        >
          Start Planning Your Trip
        </a>
        <p className="text-slate-600 text-sm mt-6">
          Or email us at{' '}
          <a href="mailto:Matthew.cuntz@fora.travel" className="text-jzo-gold-light hover:text-jzo-gold transition-colors">
            Matthew.cuntz@fora.travel
          </a>
        </p>
      </div>
    </section>
  )
}
