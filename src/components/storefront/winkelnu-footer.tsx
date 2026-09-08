import Link from 'next/link'
import { isPublicCatalogEnabled } from '@/application/catalog/public-catalog-release'
import { WinkelnuBrand } from './winkelnu-brand'

export function WinkelnuFooter() {
  const year = new Date().getFullYear()
  const catalogEnabled = isPublicCatalogEnabled()
  return (
    <footer className="bg-[image:var(--wn-gradient-evening)] text-white">
      <div className="wn-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_0.8fr_0.9fr]">
          <div className="max-w-xl"><WinkelnuBrand inverse /><p className="mt-5 text-xl font-semibold tracking-tight">Ontdek. Vergelijk. Kies je winkel.</p><p className="mt-4 max-w-lg text-sm leading-6 text-white/75">Winkelnu helpt je met praktische keuzehulpen en ontwikkelt een platform om producten en aanbiedingen van verschillende webwinkels te vergelijken. Je koopt altijd bij de gekozen webwinkel.</p></div>
          <nav aria-label="Footer ontdekken"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Ontdekken</p><div className="mt-4 flex flex-col items-start gap-3 text-sm text-white/80"><Link href="/koopgidsen" className="hover:text-white">Alle koopgidsen</Link><Link href="/koopgidsen/categorie/elektronica" className="hover:text-white">Elektronica</Link><Link href="/koopgidsen/categorie/wonen-huishouden" className="hover:text-white">Wonen & huishouden</Link><Link href="/koopgidsen/categorie/keuken-koffie" className="hover:text-white">Keuken & koffie</Link>{catalogEnabled ? <Link href="/zoeken" className="hover:text-white">Producten vergelijken</Link> : null}</div></nav>
          <nav aria-label="Footer informatie"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Informatie</p><div className="mt-4 flex flex-col items-start gap-3 text-sm text-white/80"><Link href="/over-winkelnu" className="hover:text-white">Over Winkelnu</Link><Link href="/affiliate-en-vergelijking" className="hover:text-white">Affiliate & vergelijking</Link><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link><a href="mailto:info@akflow.nl?subject=Winkelnu.nl" className="hover:text-white">Contact opnemen</a></div></nav>
          <nav aria-label="Footer privacy en juridisch"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--wn-warm)]">Privacy & juridisch</p><div className="mt-4 flex flex-col items-start gap-3 text-sm text-white/80"><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/cookies" className="hover:text-white">Cookies</Link></div><p className="mt-5 text-sm leading-6 text-white/70">Winkelnu is geen verkoper. Aankoop, betaling, levering, retour en garantie verlopen via de betreffende webwinkel.</p></nav>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-white/12 pt-6 text-xs leading-5 text-white/65 sm:flex-row sm:items-end sm:justify-between"><p>© {year} Winkelnu.nl · Exploitant: Akflow · KVK 42111391</p><p className="max-w-2xl sm:text-right">Sommige links kunnen affiliate-links zijn. Winkelnu kan een vergoeding ontvangen als je via zo’n link iets koopt, zonder dat dit jouw prijs verhoogt.</p></div>
      </div>
    </footer>
  )
}
