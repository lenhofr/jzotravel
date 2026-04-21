export default function Footer() {
  return (
    <footer className="bg-jzo-navy-dark py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src="/logo-white.png" alt="JZO Travel" className="h-7" />
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} JZO Travel. All rights reserved.</p>
        <p className="text-slate-600 text-xs">jzotravel.world</p>
      </div>
    </footer>
  )
}
