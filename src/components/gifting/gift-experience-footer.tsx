import Link from 'next/link'

export function GiftExperienceFooter() {
  return (
    <footer className="gift-shell-footer">
      <div className="gift-shell-container gift-shell-footer-inner">
        <div>
          <Link href="/lootje-lijstje" className="gift-shell-footer-brand">Lootje &amp; Lijstje</Link>
          <p>Verlanglijstjes, geheime lootjes en cadeaus op één rustige plek.</p>
        </div>
        <nav aria-label="Lootje & Lijstje voettekst">
          <Link href="/privacy">Privacy</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/">Winkelnu.nl</Link>
        </nav>
      </div>
    </footer>
  )
}
