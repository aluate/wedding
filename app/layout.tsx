import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import SiteNav from '@/components/SiteNav'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-heading',
})

export const metadata: Metadata = {
  title: "Brit & Karl — Solstice of '26",
  description: "A Solstice Weekend at Coeur d'Alene Casino",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-body`}>
        <SiteNav />
        {children}
      </body>
    </html>
  )
}

