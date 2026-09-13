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
import { canManageGiftGroup } from '@/application/gifting/access-grants'
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

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
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
      <div className="min-h-screen text-[var(--gift-ink)]">
        <main id="inhoud" className="gift-shell-container py-14 sm:py-20">
          <section className="mx-auto max-w-2xl rounded-[1.6rem] border border-[var(--gift-line)] bg-white/90 p-7 text-center shadow-[var(--gift-shadow-sm)] sm:p-10">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--gift-petrol-soft)] text-xl text-[var(--gift-petrol)]" aria-hidden="true">◇</span>
            <p className="gift-kicker mt-5">Persoonlijke toegang</p>
            <h1 className="mt-2 font-[var(--wn-font-display)] text-3xl font-semibold tracking-[-0.04em] text-[var(--gift-petrol-deep)]">Deelnemerstoegang nodig.</h1>
            <p className="mt-4 text-sm leading-7 text-[var(--gift-muted)]">Deze browser herkent jouw deelnemer niet. Open je bewaarde persoonlijke herstel-link om zonder account je eigen groepspagina en lijstje terug te zetten.</p>
            <Link href={`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}`} className="wn-button wn-button-primary mt-7">Naar de uitnodiging</Link>
          </section>
        </main>
      </div>
    )
  }

  const { group, participant, participants, list } = context
  const canManageGroup = await canManageGiftGroup(group.id)
  const productQuery = first(query.productZoek)?.trim().slice(0, 120)
  const [productViews, productResults] = await Promise.all([
    resolveGiftCatalogProductViews(list.items),
    productQuery && productQuery.length >= 2 ? searchGiftCatalogProducts(productQuery) : Promise.resolve([]),
  ])
  const notification = first(query.fout)
    ?? (first(query.toegang) === 'hersteld' ? 'Je deelnemers-toegang is hersteld op deze browser.' : undefined)
    ?? (first(query.deelname) ? `Je doet mee als ${participant.displayName}. Voeg nu je wensen toe en bewaar je persoonlijke herstel-link.` : undefined)
    ?? (first(query.toegevoegd) ? 'Wens toegevoegd.' : undefined)
    ?? (first(query.bijgewerkt) ? 'Wens bijgewerkt.' : undefined)
    ?? (first(query.verwijderd) ? 'Wens verwijderd.' : undefined)
  const isError = Boolean(first(query.fout))
  const editable = group.status === 'draft'
  const contextFields = { groupCode }
  const addedProductKeys = list.items.flatMap((item) => item.productExternalKey ? [item.productExternalKey] : [])
  const eventDateLabel = group.eventDate
    ? new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${group.eventDate}T00:00:00Z`))
    : undefined
  const wishesState = group.status === 'drawn' || list.items.length > 0 ? 'done' : 'current'
  const drawState = group.status === 'drawn' ? 'done' : list.items.length > 0 ? 'current' : 'upcoming'
  const giftState = group.status === 'drawn' ? 'current' : 'upcoming'
  const revealPath = `/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/mijn/lootje`
  const managePath = `/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/beheer`

  return (
    <div className="min-h-screen text-[var(--gift-ink)]">
      <main id="inhoud">
        <section className="gift-dashboard-hero">
          <div className="gift-shell-container gift-dashboard-hero-inner">
            <div>
              <span className="gift-dashboard-role">Mijn groep · {participant.displayName}</span>
              <h1 className="gift-dashboard-title">{group.name}</h1>
              <p className="gift-dashboard-lead">
                Dit is jouw persoonlijke plek. Beheer je wensen hier en open na de trekking alleen jouw eigen geheime lootje.
              </p>
              <div className="gift-dashboard-meta">
                <span>{occasionLabels[group.occasion]}</span>
                <span>{participants.length === 1 ? '1 deelnemer' : `${participants.length} deelnemers`}</span>
                {group.budgetCents !== undefined ? <span>Budget {money(group.budgetCents)}</span> : null}
                {eventDateLabel ? <span>{eventDateLabel}</span> : null}
                <span>{group.status === 'drawn' ? 'Lootjes getrokken ✓' : 'Wachten op trekking'}</span>
              </div>
            </div>
            <div className="gift-dashboard-hero-actions">
              {group.status === 'drawn' ? (
                <Link href={revealPath} className="wn-button wn-button-warm">Onthul mijn lootje ✦</Link>
              ) : (
                <a href="#mijn-lijstje" className="wn-button wn-button-primary">Mijn wensen beheren</a>
              )}
              {canManageGroup ? <Link href={managePath} className="wn-button wn-button-secondary">Groep beheren →</Link> : null}
            </div>
          </div>
        </section>

        <div className="gift-shell-container gift-dashboard-body">
          {notification ? (
            <div role={isError ? 'alert' : 'status'} className={`mb-5 rounded-[1.1rem] border p-4 text-sm font-semibold leading-6 ${isError ? 'border-[#d9a99f] bg-[#fff3ef] text-[#7f2d23]' : 'border-[rgba(18,59,58,0.16)] bg-[var(--gift-petrol-soft)] text-[var(--gift-petrol-deep)]'}`}>
              {notification}
            </div>
          ) : null}

          <nav className="gift-dashboard-journey" aria-label="Mijn voortgang in de groep">
            <ol>
              <li data-state="done">
                <span className="gift-dashboard-step-dot">✓</span>
                <span><strong>Meedoen</strong><small>Je persoonlijke toegang werkt.</small></span>
              </li>
              <li data-state={wishesState}>
                <span className="gift-dashboard-step-dot">{wishesState === 'done' ? '✓' : '2'}</span>
                <span><strong>Wensen</strong><small>{list.items.length === 0 ? 'Voeg je eerste wens toe.' : `${list.items.length} ${list.items.length === 1 ? 'wens' : 'wensen'} toegevoegd.`}</small></span>
              </li>
              <li data-state={drawState}>
                <span className="gift-dashboard-step-dot">{drawState === 'done' ? '✓' : '3'}</span>
                <span><strong>Trekking</strong><small>{group.status === 'drawn' ? 'De verdeling staat vast.' : 'Wacht op de organisator.'}</small></span>
              </li>
              <li data-state={giftState}>
                <span className="gift-dashboard-step-dot">4</span>
                <span><strong>Cadeau</strong><small>{group.status === 'drawn' ? 'Open je lootje en bekijk de wensen.' : 'Komt na de trekking.'}</small></span>
              </li>
            </ol>
          </nav>

          <div className="gift-dashboard-summary" aria-label="Mijn groepsoverzicht">
            <div className="gift-dashboard-stat"><strong>{list.items.length}</strong><span>{list.items.length === 1 ? 'wens op mijn lijstje' : 'wensen op mijn lijstje'}</span></div>
            <div className="gift-dashboard-stat"><strong>{participants.length}</strong><span>deelnemers</span></div>
            <div className="gift-dashboard-stat"><strong>{group.budgetCents !== undefined ? money(group.budgetCents) : 'Vrij'}</strong><span>cadeaubudget</span></div>
            <div className="gift-dashboard-stat"><strong>{group.status === 'drawn' ? 'Klaar' : 'Wachten'}</strong><span>{group.status === 'drawn' ? 'lootje beschikbaar' : 'op de trekking'}</span></div>
          </div>

          <nav className="gift-dashboard-nav" aria-label="Snel naar onderdeel">
            <a href="#mijn-lijstje">Mijn lijstje</a>
            <a href="#deelnemers">Deelnemers</a>
            <a href="#toegang">Mijn toegang</a>
            {group.status === 'drawn' ? <Link href={revealPath}>Mijn lootje</Link> : null}
          </nav>

          {group.status === 'drawn' ? (
            <section className="gift-dashboard-next mt-5">
              <p className="gift-kicker">Trekking voltooid</p>
              <h2>Jouw geheime lootje staat klaar.</h2>
              <p>Alleen jouw persoonlijke deelnemerstoegang kan jouw getrokken persoon en diens wensen openen.</p>
              <Link href={revealPath} className="wn-button wn-button-warm">Onthul mijn lootje ✦</Link>
            </section>
          ) : list.items.length === 0 ? (
            <section className="gift-dashboard-panel mt-5" data-tone="warm">
              <p className="gift-kicker">Volgende stap</p>
              <h2>Voeg je eerste wens toe.</h2>
              <p className="gift-dashboard-panel-copy">Een gevuld lijstje maakt het voor jouw toekomstige lootjestrekker veel makkelijker om iets passends te kiezen.</p>
              <a href="#mijn-lijstje" className="wn-button wn-button-primary mt-5">Naar mijn lijstje</a>
            </section>
          ) : null}

          <div className="gift-dashboard-layout">
            <div className="gift-dashboard-main">
              <section id="mijn-lijstje" className="gift-dashboard-panel">
                <div className="gift-dashboard-panel-head">
                  <div>
                    <p className="gift-kicker">Mijn lijstje</p>
                    <h2>Mijn wensen voor deze groep.</h2>
                    <p className="gift-dashboard-panel-copy">{editable ? 'Voeg Winkelnu-producten, eigen wensen of veilige externe links toe. Je kunt ze aanpassen zolang de trekking nog niet is gestart.' : 'Je lijstje is vergrendeld omdat de lootjes al zijn getrokken.'}</p>
                  </div>
                  <span className="gift-dashboard-role">{list.items.length} {list.items.length === 1 ? 'wens' : 'wensen'}</span>
                </div>

                {list.items.length > 0 ? (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
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
                  <div className="mt-5 rounded-[1.2rem] border border-dashed border-[rgba(18,59,58,0.22)] bg-white/70 p-6 text-center">
                    <strong className="text-[var(--gift-petrol-deep)]">Je lijstje is nog leeg.</strong>
                    <p className="mt-2 text-sm text-[var(--gift-muted)]">{editable ? 'Voeg hieronder je eerste wens toe.' : 'De lijstjes zijn vergrendeld nadat de lootjes zijn getrokken.'}</p>
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

            <aside className="gift-dashboard-rail">
              <section id="deelnemers" className="gift-dashboard-panel">
                <p className="gift-kicker">Deelnemers</p>
                <h2 className="!text-xl">{participants.length === 1 ? '1 persoon doet mee' : `${participants.length} mensen doen mee`}</h2>
                <div className="mt-4 grid gap-2">
                  {participants.map((item) => {
                    const isSelf = item.id === participant.id
                    return (
                      <div key={item.id} className="gift-dashboard-person !p-3" data-self={isSelf ? 'true' : 'false'}>
                        <div className="gift-dashboard-person-top">
                          <span className="gift-dashboard-avatar !h-10 !w-10 !rounded-xl" aria-hidden="true">{initials(item.displayName)}</span>
                          <div>
                            <strong>{item.displayName}{isSelf ? ' · jij' : ''}</strong>
                            <span className="gift-dashboard-person-status">{item.wishCount} {item.wishCount === 1 ? 'wens' : 'wensen'}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              <div id="toegang" className="scroll-mt-24">
                <GiftGroupRecoveryLink groupCode={groupCode} kind="participant" />
              </div>

              <section className="gift-dashboard-panel" data-tone="soft">
                <p className="gift-kicker">Privacy</p>
                <h2 className="!text-xl">Alleen jouw lootje is zichtbaar.</h2>
                <p className="gift-dashboard-panel-copy">Na de trekking zie jij alleen je eigen ontvanger. Andere deelnemers en de organisator krijgen jouw geheime koppeling niet te zien.</p>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
