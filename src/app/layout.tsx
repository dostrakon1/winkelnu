import type { Metadata } from 'next'
import { WinkelnuWebAnalytics } from '@/components/analytics/winkelnu-web-analytics'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://winkelnu.nl'),
  title: {
    default: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.',
    template: '%s | Winkelnu.nl',
  },
  description: 'Ontdek producten, lees praktische keuzehulpen en vergelijk gecontroleerde winkelprijzen zodra die beschikbaar zijn.',
  applicationName: 'Winkelnu',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    siteName: 'Winkelnu.nl',
    title: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.',
    description: 'Ontdek producten en praktische koopgidsen. Gecontroleerde winkelprijzen worden toegevoegd zodra ze beschikbaar zijn.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.',
    description: 'Ontdek producten en praktische koopgidsen. Gecontroleerde winkelprijzen worden toegevoegd zodra ze beschikbaar zijn.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>
        {children}
        <WinkelnuWebAnalytics />
      </body>
    </html>
  )
}
