import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { operator } from '@/content/operator'
import { WinkelnuBrand } from './winkelnu-brand'

const footerLink = 'inline-flex min-h-10 items-center text-sm text-white/80 hover:text-white'

export function WinkelnuFooter() {
  const year = new Date().getFullYear()
  const catalogEnabled = isPublicCatalogEnabled()
  return <footer className="bg-[image:var(--wn-gradient-evening)] text-white">
    <div className="wn-container py-9 sm:py-12 lg:py-16">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:gap-10">
        <div className="max-w-xl sm:col-span-2 lg:col-span-1"><WinkelnuBrand inverse /><p className="mt-4 text-lg font-semibold tracking-tight">Ontdek. Vergelijk. Kies je winkel.</p><p className="mt-3 max-w-lg text-sm leading-6 text-white/75">Praktische keuzehulpen voor producten die bij jou passen. We werken aan een platform om aanbiedingen van verschillende webwinkels te vergelijken.</p></div>
        <nav aria-label="Footer ontdekken"><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Ontdekken</h2><div className="mt-2 grid grid-cols-2 gap-x-3 sm:flex sm:flex-col sm:items-start"><Link href="/koopgidsen" className={footerLink}>Alle koopgidsen</Link><Link href="/koopgidsen/categorie/elektronica" className={footerLink}>Elektronica</Link><Link href="/koopgidsen/categorie/wonen-huishouden" className={footerLink}>Wonen &amp; huishouden</Link><Link href="/koopgidsen/categorie/keuken-koffie" className={footerLink}>Keuken &amp; koffie</Link>{catalogEnabled ? <Link href="/zoeken" className={footerLink}>Producten vergelijken</Link> : null}</div></nav>
        <nav aria-label="Footer informatie"><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Informatie</h2><div className="mt-2 flex flex-col items-start"><Link href="/over-winkelnu" className={footerLink}>Over Winkelnu</Link><Link href="/affiliate-en-vergelijking" className={footerLink}>Hoe Winkelnu werkt</Link><Link href="/disclaimer" className={footerLink}>Disclaimer</Link><a href={`mailto:${operator.email}?subject=Winkelnu.nl`} className={footerLink}>Contact opnemen</a></div></nav>
        <nav aria-label="Footer privacy en juridisch"><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Privacy &amp; juridisch</h2><div className="mt-2 flex flex-col items-start"><Link href="/privacy" className={footerLink}>Privacy</Link><Link href="/cookies" className={footerLink}>Cookies</Link><Link href="/over-winkelnu#exploitant" className={footerLink}>Bedrijfsgegevens</Link></div></nav>
      </div>
      <div className="mt-8 flex flex-col gap-2 border-t border-white/12 pt-5 text-xs leading-5 text-white/70 sm:flex-row sm:items-end sm:justify-between"><p>© {year} Winkelnu.nl · Akflow · KVK {operator.chamberOfCommerce}</p><p className="max-w-xl sm:text-right">Winkelnu kan een vergoeding ontvangen via uitgaande links. <Link href="/affiliate-en-vergelijking" className="underline underline-offset-4 hover:text-white">Hoe werkt dat?</Link></p></div>
    </div>
  </footer>
}
