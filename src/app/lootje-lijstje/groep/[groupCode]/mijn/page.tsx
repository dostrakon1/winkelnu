import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  addParticipantGiftListItemAction,
  addParticipantWinkelnuProductAction,
  deleteParticipantGiftListItemAction,
  updateParticipantGiftListItemAction,
  updateParticipantWinkelnuProductNoteAction,
} from '@/app/lootje-lijstje/groep/actions'
import {
  getGiftGroupInvite,
  getParticipantGiftGroupContext,
} from '@/application/gifting/gift-groups'
import {
  resolveGiftCatalogProductViews,
  searchGiftCatalogProducts,
} from '@/application/gifting/gift-catalog'
import { GiftGroupRecoveryLink } from '@/components/gifting/gift-group-recovery-link'
import { GiftListItemCard } from '@/components/gifting/gift-list-item-card'
import { GiftListItemEditor } from '@/components/gifting/gift-list-item-editor'
import { GiftProductPicker } from '@/components/gifting/gift-product-picker'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export const metadata: Metadata = {
  title: 'Mijn Lootje & Lijstje-groep',
  description: 'Privé deelnemerspagina voor Lootje & Lijstje.',
  robots: { index: false, follow: false },
}

const occasionLabels = {
  sinterklaas: 'Sinterklaas',
  kerst: 'Kerst / Secret Santa',
  verjaardag: 'Verjaardag / feestje',
  anders: 'Cadeaumoment',
} as const

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function money(cents: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

export default async function GiftGroupParticipantPage({
  params,
  searchParams,
}: {
  params: Promise<{ groupCode: string }>
  searchParams: Promise<{
    productZoek?: string | string[]
    deelname?: string | string[]
    toegevoegd?: string | string[]
    bijgewerkt?: string | string[]
    verwijderd?: string | string[]
    toegang?: string | string[]
    fout?: string | string[]
  }>
}) {
  const { groupCode } = await params
  const query = await searchParams
  const [invite, context] = await Promise.all([
    getGiftGroupInvite(groupCode),
    getParticipantGiftGroupContext(groupCode),
  ])
  if (!invite) notFound()

  if (!context) {
    return (
      <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
        <WinkelnuHeader />
        <main id="inhoud" className="wn-container py-14 sm:py-20">
          <section className="mx-auto max-w-2xl rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-7 text-center shadow-[var(--wn-shadow-sm)] sm:p-10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xl text-[var(--wn-petrol)]" aria-hidden="true">◇</span>
            <h1 className="wn-heading mt-5 text-3xl">Deelnemerstoegang nodig.</h1>
            <p className="wn-body-muted mt-4">Deze browser herkent jouw deelnemer niet. Open je bewaarde persoonlijke herstel-link om zonder account je eigen groepspagina en lijstje terug te zetten.</p>
            <Link href={`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}`} className="wn-button wn-button-primary mt-7">Naar de uitnodiging</Link>
          </section>
        </main>
        <WinkelnuFooter />
      </div>
    )
  }

  const { group, participant, participants, list } = context
  const productQuery = first(query.productZoek)?.trim().slice(0, 120)
  const [productViews, productResults] = await Promise.all([
    resolveGiftCatalogProductViews(list.items),
    productQuery && productQuery.length >= 2 ? searchGiftCatalogProducts(productQuery) : Promise.resolve([]),
  ])
  const notification = first(query.fout)
    ?? (first(query.toegang) === 'hersteld' ? 'Je deelnemers-toegang is hersteld op deze browser.' : undefined)
    ?? (first(query.deelname) ? `Je doet mee als ${participant.displayName}. Maak nu je lijstje compleet en bewaar je persoonlijke herstel-link.` : undefined)
    ?? (first(query.toegevoegd) ? 'Wens toegevoegd.' : undefined)
    ?? (first(query.bijgewerkt) ? 'Wens bijgewerkt.' : undefined)
    ?? (first(query.verwijderd) ? 'Wens verwijderd.' : undefined)
  const isError = Boolean(first(query.fout))
  const editable = group.status === 'draft'
  const contextFields = { groupCode }
  const addedProductKeys = list.items.flatMap((item) => item.productExternalKey ? [item.productExternalKey] : [])

  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <section className="border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
          <div className="wn-container py-10 sm:py-14">
            <p className="wn-eyebrow">Mijn groep</p>
            <h1 className="wn-heading mt-3 text-4xl sm:text-5xl">{group.name}</h1>
            <p className="wn-body-muted mt-3 text-lg">Je doet mee als <strong className="text-[var(--wn-petrol-deep)]">{participant.displayName}</strong>.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-[var(--wn-text-muted)]">
              <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">{occasionLabels[group.occasion]}</span>
              <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">{participants.length === 1 ? '1 deelnemer' : `${participants.length} deelnemers`}</span>
              {group.budgetCents !== undefined ? <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">Budget {money(group.budgetCents)}</span> : null}
              {group.eventDate ? <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">{new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${group.eventDate}T00:00:00Z`))}</span> : null}
            </div>
          </div>
        </section>

        <div className="wn-container py-8 sm:py-12">
          {notification ? (
            <div role={isError ? 'alert' : 'status'} className={`mb-6 rounded-xl border p-4 text-sm font-semibold leading-6 ${isError ? 'border-[#d9a99f] bg-[#fff3ef] text-[#7f2d23]' : 'border-[color:rgba(18,59,58,0.16)] bg-[var(--wn-petrol-soft)] text-[var(--wn-petrol-deep)]'}`}>
              {notification}
            </div>
          ) : null}

          {group.status === 'drawn' ? (
            <section className="mb-8 rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-[var(--wn-petrol-deep)] p-6 text-white shadow-[var(--wn-shadow-sm)] sm:flex sm:items-center sm:justify-between sm:gap-7 sm:p-8">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/65">Lootjes getrokken ✓</p>
                <h2 className="wn-heading mt-2 text-3xl text-white">Jouw geheime lootje staat klaar.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">Alleen jouw persoonlijke deelnemerstoegang kan jouw getrokken persoon en diens wensen openen.</p>
              </div>
              <Link href={`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/mijn/lootje`} className="wn-button mt-5 shrink-0 bg-white text-[var(--wn-petrol-deep)] hover:bg-[var(--wn-cream)] sm:mt-0">Onthul mijn lootje ✦</Link>
            </section>
          ) : null}

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
            <div className="space-y-8">
              <section>
                <div className="mb-5">
                  <p className="wn-eyebrow">Mijn lijstje</p>
                  <h2 className="wn-heading mt-2 text-3xl">Mijn wensen voor deze groep.</h2>
                  <p className="wn-body-muted mt-3">{list.items.length === 1 ? '1 wens toegevoegd.' : `${list.items.length} wensen toegevoegd.`}</p>
                </div>

                {list.items.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {list.items.map((item) => (
                      <GiftListItemCard
                        key={item.id}
                        item={item}
                        productView={productViews[item.id]}
                        editable={editable}
                        updateAction={updateParticipantGiftListItemAction}
                        updateProductNoteAction={updateParticipantWinkelnuProductNoteAction}
                        deleteAction={deleteParticipantGiftListItemAction}
                        contextFields={contextFields}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[var(--wn-radius-xl)] border border-dashed border-[color:rgba(18,59,58,0.24)] bg-white/70 p-7 text-center">
                    <h3 className="wn-ui-heading text-lg">Je lijstje is nog leeg.</h3>
                    <p className="wn-body-muted mt-2 text-sm">{editable ? 'Voeg hieronder een Winkelnu-product, eigen wens of externe link toe.' : 'De lijstjes zijn vergrendeld nadat de lootjes zijn getrokken.'}</p>
                  </div>
                )}
              </section>

              {editable ? (
                <>
                  <GiftProductPicker
                    contextFields={contextFields}
                    query={productQuery}
                    products={productResults}
                    addedProductKeys={addedProductKeys}
                    addAction={addParticipantWinkelnuProductAction}
                  />
                  <GiftListItemEditor action={addParticipantGiftListItemAction} contextFields={contextFields} />
                </>
              ) : null}
            </div>

            <aside className="space-y-5 xl:sticky xl:top-28">
              <GiftGroupRecoveryLink groupCode={groupCode} kind="participant" />

              <section className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-5 shadow-[var(--wn-shadow-xs)] sm:p-6">
                <p className="wn-eyebrow">Deelnemers</p>
                <h2 className="wn-ui-heading mt-2 text-xl">{participants.length === 1 ? '1 persoon doet mee' : `${participants.length} mensen doen mee`}</h2>
                <div className="mt-4 space-y-2">
                  {participants.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--wn-cream)] px-3 py-2.5 text-sm">
                      <span className="font-bold text-[var(--wn-petrol-deep)]">{item.displayName}{item.id === participant.id ? ' (jij)' : ''}</span>
                      <span className="text-xs font-semibold text-[var(--wn-text-muted)]">{item.wishCount} {item.wishCount === 1 ? 'wens' : 'wensen'}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-[var(--wn-petrol-soft)] p-5 sm:p-6">
                <span className="inline-flex rounded-full border border-[color:rgba(18,59,58,0.14)] bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--wn-petrol)]">
                  {group.status === 'drawn' ? 'Lootjes getrokken ✓' : 'Nog niet getrokken'}
                </span>
                <h2 className="wn-ui-heading mt-4 text-xl">
                  {group.status === 'drawn' ? 'Je lootje kan nu worden onthuld.' : 'Je lootje blijft nog geheim.'}
                </h2>
                <p className="wn-body-muted mt-3 text-sm leading-6">
                  {group.status === 'drawn'
                    ? 'Open “Mijn lootje” om uitsluitend jouw getrokken persoon, diens wensen en jouw privé geregeld-markeringen te bekijken.'
                    : 'Je persoonlijke toegang blijft in deze browser beschikbaar. Zodra de organisator de lootjes trekt, kun je alleen jouw eigen lootje openen.'}
                </p>
              </section>
            </aside>
          </div>
        </div>
      </main>
      <WinkelnuFooter />
    </div>
  )
}
