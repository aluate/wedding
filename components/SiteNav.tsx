'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/details', label: 'Details' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/gifts', label: 'Gifts' },
  { href: '/travel', label: 'Travel & Stay' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/photos', label: 'Photo Wall' },
  { href: '/rsvp', label: 'RSVP' },
]

export default function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Hide nav on home page (hero handles navigation)
  if (pathname === '/') return null

  return (
    <nav className="border-b border-accent/10 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-heading text-xl text-accent hover:text-primary transition">
          Brit &amp; Karl
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition ${
                pathname === l.href
                  ? 'text-primary font-semibold'
                  : 'text-accent/70 hover:text-primary'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-accent/70 hover:text-primary transition"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-accent/10 bg-white px-4 py-3 space-y-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm transition ${
                pathname === l.href
                  ? 'text-primary font-semibold'
                  : 'text-accent/70 hover:text-primary'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
