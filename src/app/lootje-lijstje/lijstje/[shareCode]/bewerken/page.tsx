import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  addGiftListItemAction,
  addWinkelnuProductGiftListItemAction,
  deleteGiftListItemAction,
  updateGiftListAction,
  updateGiftListItemAction,
  updateWinkelnuProductGiftNoteAction,
} from '@/app/lootje-lijstje/actions'
import {
  resolveGiftCatalogProductViews,
  searchGiftCatalogProducts,
} from '@/application/gifting/gift-catalog'
import { getEditableGiftList, getSharedGiftList } from '@/application/gifting/standalone-gift-lists'
import { GiftListDeletePanel } from '@/components/gifting/gift-list-delete-panel'
import { GiftListForm } from '@/components/gifting/gift-list-form'
import { GiftListItemCard } from '@/components/gifting/gift-list-item-card'
import { GiftListItemEditor } from '@/components/gifting/gift-list-item-editor'
import { GiftProductPicker } from '@/components/gifting/gift-product-picker'
import { GiftRecoveryLink } from '@/components/gifting/gift-recovery-link'
import { GiftShareActions } from '@/components/gifting/gift-share-actions'

export const metadata: Metadata = {
  title: 'Verlanglijstje beheren',
  description: 'Beheer je privé verlanglijstje op Winkelnu.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Verlanglijstje beheren | Winkelnu.nl',
    description: 'Privé beheerpagina voor Lootje & Lijstje.',
  },
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function EditGiftListPage({
  params,
  searchParams,
}: {
  params: Promise<{ shareCode: string }>
  searchParams: Promise<{
    gemaakt?: string | string[]
    opgeslagen?: string | string[]
    toegevoegd?: string | string[]
    bijgewerkt?: string | string[]
    verwijderd?: string | string[]
    fout?: string | string[]
    productZoek?: string | string[]
  }>
}) {
  const { shareCode } = await params
  const query = await searchParams
  const list = await getEditableGiftList(shareCode)

  if (!list) {
    const sharedList = await getSharedGiftList(shareCode)
    if (!sharedList) notFound()

    return (
      <div className="min-h-screen text-[var(--gift-ink)]">
        <main id="inhoud" className="gift-shell-container py-14 sm:py-20">
          <section className="gift-wishlist-access-card">
            <span className="gift-wishlist-access-icon" aria-hidden="true">↗</span>
            <p className="gift-kicker mt-5">Privé beheer</p>
            <h1>Beheer-toegang nodig.</h1>
            <p>Deze deel-link laat het lijstje zien, maar geeft geen bewerkrechten. Open je bewaarde herstel-link op dit apparaat om de beheer-toegang terug te zetten.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href={`/lootje-lijstje/lijstje/${encodeURIComponent(shareCode)}`} className="wn-button wn-button-primary">Bekijk gedeeld lijstje</Link>
              <Link href="/lootje-lijstje" className="wn-button wn-button-secondary">Naar Lootje &amp; Lijstje</Link>
            </div>
          </section>
        </main>
      </div>
    )
  }

  const productSearchTerm = first(query.productZoek)?.trim().slice(0, 120)
  const [productResults, productViews] = await Promise.all([
    productSearchTerm ? searchGiftCatalogProducts(productSearchTerm) : Promise.resolve([]),
    resolveGiftCatalogProductViews(list.items),
  ])
  const addedProductKeys = list.items.flatMap((item) => item.productExternalKey ? [item.productExternalKey] : [])

  const notification = first(query.fout)
    ?? (first(query.gemaakt) ? 'Je lijstje is gemaakt. Voeg nu je eerste wens toe en bewaar je herstel-link.' : undefined)
    ?? (first(query.opgeslagen) ? 'Je lijstje is bijgewerkt.' : undefined)
    ?? (first(query.toegevoegd) ? 'Wens toegevoegd.' : undefined)
    ?? (first(query.bijgewerkt) ? 'Wens bijgewerkt.' : undefined)
    ?? (first(query.verwijderd) ? 'Wens verwijderd.' : undefined)
  const isError = Boolean(first(query.fout))
  const sharePath = `/lootje-lijstje/lijstje/${encodeURIComponent(shareCode)}`
  const wishCountLabel = list.items.length === 1 ? '1 wens' : `${list.items.length} wensen`

  return (
    <div className="min-h-screen text-[var(--gift-ink)]">
      <main id="inhoud">
        <section className="gift-wishlist-hero">
          <div className="gift-shell-container gift-wishlist-hero-inner">
            <div>
              <span className="gift-wishlist-role">Mijn verlanglijstje</span>
              <h1 className="gift-wishlist-title">{list.title ?? `${list.displayName}’s lijstje`}</h1>
              <p className="gift-wishlist-lead">Verzamel hier alles wat je graag wilt krijgen. Kies producten op Winkelnu of voeg zelf een wens toe.</p>
              <div className="gift-wishlist-meta">
                <span>{wishCountLabel}</span>
                <span>Privé te beheren</span>
                <span>Deelbaar zonder account</span>
              </div>
            </div>
            <div className="gift-wishlist-hero-actions">
              <a href="#zoeken" className="wn-button wn-button-primary">+ Wens toevoegen</a>
              <Link href={sharePath} className="wn-button wn-button-secondary">Bekijk zoals anderen het zien →</Link>
            </div>
          </div>
        </section>

        <div className="gift-shell-container gift-wishlist-body">
          {notification ? (
            <div
              role={isError ? 'alert' : 'status'}
              className={`gift-wishlist-notice ${isError ? 'is-error' : ''}`}
            >
              {notification}
            </div>
          ) : null}

          <nav className="gift-wishlist-nav" aria-label="Snel naar onderdeel">
            <a href="#wensen">Mijn wensen <span>{list.items.length}</span></a>
            <a href="#zoeken">Zoek op Winkelnu</a>
            <a href="#eigen-wens">Eigen wens</a>
            <a href="#instellingen">Instellingen</a>
          </nav>

          <div className="gift-wishlist-layout">
            <div className="gift-wishlist-main">
              <section id="wensen" className="gift-wishlist-panel">
                <div className="gift-wishlist-panel-head">
                  <div>
                    <p className="gift-kicker">Mijn wensen</p>
                    <h2>Wat staat er op je lijst?</h2>
                    <p>Je kunt elke wens later nog aanpassen of verwijderen.</p>
                  </div>
                  <span className="gift-wishlist-count">{wishCountLabel}</span>
                </div>

                {list.items.length > 0 ? (
                  <div className="gift-wish-grid">
                    {list.items.map((item) => (
                      <GiftListItemCard
                        key={item.id}
                        item={item}
                        productView={productViews[item.id]}
                        editable
                        updateAction={updateGiftListItemAction}
                        updateProductNoteAction={updateWinkelnuProductGiftNoteAction}
                        deleteAction={deleteGiftListItemAction}
                        shareCode={shareCode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="gift-wishlist-empty">
                    <span aria-hidden="true">♡</span>
                    <h3>Je lijstje is nog leeg.</h3>
                    <p>Zoek hieronder een Winkelnu-product of schrijf zelf je eerste wens op.</p>
                    <a href="#zoeken" className="wn-button wn-button-primary mt-5">Voeg je eerste wens toe</a>
                  </div>
                )}
              </section>

              <GiftProductPicker
                shareCode={shareCode}
                query={productSearchTerm}
                products={productResults}
                addedProductKeys={addedProductKeys}
                addAction={addWinkelnuProductGiftListItemAction}
              />

              <GiftListItemEditor action={addGiftListItemAction} shareCode={shareCode} />

              <section id="instellingen" className="gift-wishlist-panel">
                <div className="gift-wishlist-panel-head">
                  <div>
                    <p className="gift-kicker">Lijstje-instellingen</p>
                    <h2>Pas de details van je lijstje aan.</h2>
                    <p>Naam, gelegenheid, budget en datum helpen anderen sneller kiezen.</p>
                  </div>
                </div>
                <div className="gift-wishlist-form-wrap">
                  <GiftListForm action={updateGiftListAction} submitLabel="Wijzigingen opslaan" shareCode={shareCode} list={list} />
                </div>
              </section>
            </div>

            <aside className="gift-wishlist-rail">
              <section className="gift-wishlist-side-card" data-tone="share">
                <p className="gift-kicker">Klaar om te delen?</p>
                <h2>Stuur je lijstje door.</h2>
                <p>De deel-link is alleen-lezen. Iedereen met de link kan je wensen bekijken, maar niets aanpassen.</p>
                <div className="mt-5">
                  <GiftShareActions sharePath={sharePath} title={`${list.displayName} heeft een lijstje met je gedeeld via Winkelnu.`} />
                </div>
              </section>

              <GiftRecoveryLink shareCode={shareCode} />

              <section className="gift-wishlist-side-card" data-tone="soft">
                <span className="gift-wishlist-side-icon" aria-hidden="true">✦</span>
                <h2>Winkelnu-wensen blijven herkenbaar.</h2>
                <p>Als een product later verandert, blijft je opgeslagen wens zoveel mogelijk herkenbaar voor degene die je lijstje bekijkt.</p>
              </section>

              <GiftListDeletePanel shareCode={shareCode} />
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
