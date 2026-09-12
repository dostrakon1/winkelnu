import type { Metadata } from 'next'
import { Manrope, Newsreader } from 'next/font/google'
import { WinkelnuWebAnalytics } from '@/components/analytics/winkelnu-web-analytics'
import { activeSite, resolveSiteOrigin } from '@/config/sites'
import './globals.css'

const winkelnuSans = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-winkelnu-sans',
})

const winkelnuDisplay = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-winkelnu-display',
})

export const metadata: Metadata = {
  metadataBase: new URL(resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL)),
  title: {
    default: activeSite.seo.defaultTitle,
    template: activeSite.seo.titleTemplate,
  },
  description: activeSite.seo.description,
  applicationName: activeSite.brandName,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: activeSite.openGraphLocale,
    siteName: activeSite.siteName,
    title: activeSite.seo.defaultTitle,
    description: activeSite.seo.socialDescription,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: activeSite.seo.defaultTitle,
    description: activeSite.seo.socialDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={activeSite.htmlLang}>
      <body className={`${winkelnuSans.variable} ${winkelnuDisplay.variable}`}>
        {children}
        <WinkelnuWebAnalytics />
      </body>
    </html>
  )
}
