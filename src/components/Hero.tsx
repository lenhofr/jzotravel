export default function Hero() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      <img
        src="https://picsum.photos/seed/jzo-hero/1920/1080"
        alt="Scenic travel destination"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-slate-900/55" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <p className="text-jzo-gold text-xs font-medium tracking-[0.3em] uppercase mb-5">
          Boutique Travel Planning
        </p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          The World,<br />Curated for You
        </h1>
        <p className="text-white/75 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          White-glove travel experiences crafted around your story. Every detail, handled with care.
        </p>
        <a
          href="#contact"
          className="inline-block bg-jzo-gold hover:bg-jzo-gold-dark text-white font-semibold px-8 py-4 rounded transition-colors text-sm tracking-widest uppercase"
        >
          Start Your Journey
        </a>
      </div>
    </section>
  )
}
