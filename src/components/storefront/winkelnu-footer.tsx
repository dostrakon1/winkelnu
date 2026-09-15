import type { ReactNode } from 'react'
import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { editorialCategories } from '@/content/editorial-catalog'
import { operator } from '@/content/operator'
import { GiftCollectionDiscoveryBridge } from './gift-collection-discovery-bridge'
import { WinkelnuBrand } from './winkelnu-brand'

function getFooterBrowseHref(category: (typeof editorialCategories)[number]) {
  return 'sections' in category ? `/collecties/${category.slug}` : `/koopgidsen/categorie/${category.slug}`
}

type FooterLink = {
  href: string
  label: string
}

function FooterLinkItem({ href, label }: FooterLink) {
  const className =
    'text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent'

  if (href.startsWith('mailto:')) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

function FooterLinkList({ links }: { links: FooterLink[] }) {
  return (
    <div className="mt-4 flex flex-col items-start gap-3 text-sm leading-6">
      {links.map((link) => (
        <FooterLinkItem key={`${link.href}-${link.label}`} {...link} />
      ))}
    </div>
  )
}

function DiscoverFooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <div className="mt-4 flex flex-col items-start gap-3 text-sm leading-6">
      <Link
        href="/lootje-lijstje"
        className="font-semibold text-[#ffb889] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
      >
        ✦ Lootje &amp; Lijstje
      </Link>
      {links.map((link) => (
        <FooterLinkItem key={`${link.href}-${link.label}`} {...link} />
      ))}
    </div>
  )
}

function MobileFooterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group border-t border-white/12 last:border-b">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-bold uppercase tracking-[0.14em] text-[var(--wn-warm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span aria-hidden="true" className="text-xl font-normal leading-none text-white/70 transition-transform duration-200 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  )
}

export function WinkelnuFooter() {
  const year = new Date().getFullYear()
  const catalogEnabled = isPublicCatalogEnabled()
  const popularCategories = editorialCategories.slice(0, 5)

  const discoverLinks: FooterLink[] = [
    { href: '/koopgidsen', label: 'Alle koopgidsen' },
    ...(catalogEnabled ? [{ href: '/zoeken', label: 'Producten vergelijken' }] : []),
  ]

  const winkelnuLinks: FooterLink[] = [
    { href: '/over-winkelnu', label: 'Over Winkelnu' },
    { href: '/affiliate-en-vergelijking', label: 'Hoe Winkelnu werkt' },
  ]

  const serviceLinks: FooterLink[] = [
    { href: `mailto:${operator.email}?subject=Winkelnu.nl`, label: 'Contact opnemen' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/cookies', label: 'Cookies' },
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/bedrijfsgegevens', label: 'Bedrijfsgegevens' },
  ]

  return (
    <>
      <GiftCollectionDiscoveryBridge />
      <footer className="bg-[image:var(--wn-gradient-evening)] text-white">
        <div className="wn-container py-12 sm:py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_2.15fr] lg:gap-16 xl:gap-20">
            <div className="max-w-xl">
              <WinkelnuBrand inverse />
              <p className="wn-display mt-5 text-2xl font-semibold tracking-[-0.025em] sm:text-[1.7rem]">
                Ontdek. Vergelijk. Kies je winkel.
              </p>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/75">
                Praktische keuzehulpen, koopgidsen en vergelijkingen voor producten die bij je passen.
              </p>
              <Link
                href="/affiliate-en-vergelijking"
                className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Zo werkt Winkelnu →
              </Link>
            </div>

            <div className="hidden gap-x-8 gap-y-10 md:grid md:grid-cols-2 lg:grid-cols-4">
              <nav aria-label="Footer ontdekken">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Ontdekken</p>
                <DiscoverFooterLinks links={discoverLinks} />
              </nav>

              <nav aria-label="Footer populaire categorieën">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Populaire categorieën</p>
                <div className="mt-4 flex flex-col items-start gap-3 text-sm leading-6">
                  {popularCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={getFooterBrowseHref(category)}
                      className="text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
                    >
                      {category.title}
                    </Link>
                  ))}
                  <Link
                    href="/koopgidsen"
                    className="font-semibold text-white transition-colors hover:text-[var(--wn-warm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
                  >
                    Alle categorieën →
                  </Link>
                </div>
              </nav>

              <nav aria-label="Footer Winkelnu">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Winkelnu</p>
                <FooterLinkList links={winkelnuLinks} />
              </nav>

              <nav aria-label="Footer service en juridisch">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Service &amp; juridisch</p>
                <FooterLinkList links={serviceLinks} />
              </nav>
            </div>
          </div>

          <div className="mt-9 md:hidden">
            <MobileFooterGroup title="Ontdekken">
              <DiscoverFooterLinks links={discoverLinks} />
            </MobileFooterGroup>

            <MobileFooterGroup title="Populaire categorieën">
              <div className="mt-4 flex flex-col items-start gap-3 text-sm leading-6">
                {popularCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={getFooterBrowseHref(category)}
                    className="text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    {category.title}
                  </Link>
                ))}
                <Link
                  href="/koopgidsen"
                  className="font-semibold text-white transition-colors hover:text-[var(--wn-warm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  Alle categorieën →
                </Link>
              </div>
            </MobileFooterGroup>

            <MobileFooterGroup title="Winkelnu">
              <FooterLinkList links={winkelnuLinks} />
            </MobileFooterGroup>

            <MobileFooterGroup title="Service & juridisch">
              <FooterLinkList links={serviceLinks} />
            </MobileFooterGroup>
          </div>

          <div className="mt-10 border-t border-white/12 pt-6 text-xs leading-5 text-white/65 sm:mt-12">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <p>© {year} Winkelnu.nl · Een initiatief van Akflow · KvK {operator.chamberOfCommerce}</p>
              <p className="max-w-2xl lg:text-right">
                Winkelnu kan een vergoeding ontvangen via uitgaande links.{' '}
                <Link href="/affiliate-en-vergelijking" className="underline underline-offset-4 transition-colors hover:text-white">
                  Meer over affiliate links →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
