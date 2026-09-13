import type { Metadata } from 'next'
import { createPageSocialMetadata } from '@/lib/seo/page-social-metadata'

const description = 'Ontdek waarom Winkelnu bestaat, hoe we je helpen kiezen en hoe we bouwen aan betrouwbare productvergelijking.'

export const metadata: Metadata = {
  alternates: { canonical: '/over-winkelnu' },
  ...createPageSocialMetadata({
    title: 'Over Winkelnu',
    description,
    url: '/over-winkelnu',
  }),
}

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
