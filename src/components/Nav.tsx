import { useState, useEffect } from 'react'

const links = ['About', 'Services', 'Blog', 'Contact']

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="#">
          <img src="/logo.png" alt="JZO Travel" className="h-8" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className={`text-sm font-medium tracking-wide transition-colors ${scrolled ? 'text-slate-600 hover:text-jzo-gold' : 'text-white/90 hover:text-white'}`}
            >
              {link}
            </a>
          ))}
          <a
            href="#contact"
            className={`text-sm font-medium px-4 py-2 border rounded transition-colors ${scrolled ? 'border-jzo-navy text-jzo-navy hover:bg-jzo-navy hover:text-white' : 'border-white text-white hover:bg-white hover:text-jzo-navy'}`}
          >
            Plan a Trip
          </a>
        </div>

        <button
          className={`md:hidden transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-6 py-4 flex flex-col gap-4">
          {links.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-slate-700 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
