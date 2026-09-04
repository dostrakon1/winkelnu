import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://winkelnu.nl'),
  title: {
    default: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.',
    template: '%s | Winkelnu.nl',
  },
  description: 'Ontdek en vergelijk producten en aanbiedingen van meerdere winkels op één plek.',
  applicationName: 'Winkelnu',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    siteName: 'Winkelnu.nl',
    title: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.',
    description: 'Producten en aanbiedingen van verschillende winkels overzichtelijk vergelijken op één plek.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.',
    description: 'Producten en aanbiedingen van verschillende winkels overzichtelijk vergelijken op één plek.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}
