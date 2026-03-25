import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-accent/10 py-8 px-4 mt-12">
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <p className="font-heading text-lg text-accent/80">
          Brit &amp; Karl &middot; June 20, 2026
        </p>
        <p className="text-sm text-accent/50">#SolsticeOf26</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-accent/40">
          <Link href="/rsvp" className="hover:text-primary transition">RSVP</Link>
          <Link href="/details" className="hover:text-primary transition">Details</Link>
          <Link href="/travel" className="hover:text-primary transition">Travel</Link>
          <Link href="/photos" className="hover:text-primary transition">Photos</Link>
        </div>
      </div>
    </footer>
  )
}
