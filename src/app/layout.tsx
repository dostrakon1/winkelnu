import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://winkelnu.nl'),
  title: {
    default: 'Winkelnu.nl',
    template: '%s | Winkelnu.nl',
  },
  description: 'Ontdek en vergelijk producten en aanbiedingen van meerdere winkels op één plek.',
  applicationName: 'Winkelnu',
  alternates: {
    canonical: '/',
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
