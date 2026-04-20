export default function Footer() {
  return (
    <footer className="bg-slate-950 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-serif text-white text-lg tracking-wide">JZO Travel</span>
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} JZO Travel. All rights reserved.</p>
        <p className="text-slate-600 text-xs">jzotravel.world</p>
      </div>
    </footer>
  )
}
