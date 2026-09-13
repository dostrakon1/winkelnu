import { createPageSocialMetadata } from '@/lib/seo/page-social-metadata'

const description = 'Zoek op product, merk of categorie en ontdek via Winkelnu sneller wat bij je past.'

export const metadata = createPageSocialMetadata({
  title: 'Producten ontdekken & vergelijken | Winkelnu.nl',
  description,
  url: '/zoeken',
})

export default function SearchLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
