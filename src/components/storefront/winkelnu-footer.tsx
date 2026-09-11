import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { editorialCategories } from '@/content/editorial-catalog'
import { operator } from '@/content/operator'
import { WinkelnuBrand } from './winkelnu-brand'

export function WinkelnuFooter() {
  const year = new Date().getFullYear()
  const catalogEnabled = isPublicCatalogEnabled()
  return (
    <footer className="bg-[image:var(--wn-gradient-evening)] text-white">
      <div className="wn-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_0.8fr_0.9fr]">
          <div className="max-w-xl"><WinkelnuBrand inverse /><p className="mt-5 text-xl font-semibold tracking-tight">Ontdek. Vergelijk. Kies je winkel.</p><p className="mt-4 max-w-lg text-sm leading-6 text-white/75">Praktische keuzehulpen voor producten die bij jou passen. We werken aan een platform om aanbiedingen van verschillende webwinkels te vergelijken.</p></div>
          <nav aria-label="Footer ontdekken"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Ontdekken</p><div className="mt-4 flex flex-col items-start gap-3 text-sm text-white/80"><Link href="/koopgidsen" className="hover:text-white">Alle koopgidsen</Link>{editorialCategories.map((category) => <Link key={category.slug} href={`/koopgidsen/categorie/${category.slug}`} className="hover:text-white">{category.title}</Link>)}{catalogEnabled ? <Link href="/zoeken" className="hover:text-white">Producten vergelijken</Link> : null}</div></nav>
          <nav aria-label="Footer informatie"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Informatie</p><div className="mt-4 flex flex-col items-start gap-3 text-sm text-white/80"><Link href="/over-winkelnu" className="hover:text-white">Over Winkelnu</Link><Link href="/affiliate-en-vergelijking" className="hover:text-white">Hoe Winkelnu werkt</Link><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link><a href={`mailto:${operator.email}?subject=Winkelnu.nl`} className="hover:text-white">Contact opnemen</a></div></nav>
          <nav aria-label="Footer privacy en juridisch"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Privacy & juridisch</p><div className="mt-4 flex flex-col items-start gap-3 text-sm text-white/80"><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/cookies" className="hover:text-white">Cookies</Link><Link href="/over-winkelnu#exploitant" className="hover:text-white">Bedrijfsgegevens</Link></div></nav>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/12 pt-6 text-xs leading-5 text-white/65 sm:flex-row sm:items-end sm:justify-between"><p>© {year} Winkelnu.nl · Akflow · KVK {operator.chamberOfCommerce}</p><p className="max-w-xl sm:text-right">Winkelnu kan een vergoeding ontvangen via uitgaande links. <Link href="/affiliate-en-vergelijking" className="underline underline-offset-4 hover:text-white">Hoe werkt dat?</Link></p></div>
      </div>
    </footer>
  )
}
