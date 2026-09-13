import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  addGiftListItemAction,
  deleteGiftListItemAction,
  updateGiftListAction,
  updateGiftListItemAction,
} from '@/app/lootje-lijstje/actions'
import { getEditableGiftList, getSharedGiftList } from '@/application/gifting/standalone-gift-lists'
import { GiftListForm } from '@/components/gifting/gift-list-form'
import { GiftListItemCard } from '@/components/gifting/gift-list-item-card'
import { GiftListItemEditor } from '@/components/gifting/gift-list-item-editor'
import { GiftRecoveryLink } from '@/components/gifting/gift-recovery-link'
import { GiftShareActions } from '@/components/gifting/gift-share-actions'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

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
  }>
}) {
  const { shareCode } = await params
  const query = await searchParams
  const list = await getEditableGiftList(shareCode)

  if (!list) {
    const sharedList = await getSharedGiftList(shareCode)
    if (!sharedList) notFound()

    return (
      <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
        <WinkelnuHeader />
        <main id="inhoud" className="wn-container py-14 sm:py-20">
          <section className="mx-auto max-w-2xl rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-7 text-center shadow-[var(--wn-shadow-sm)] sm:p-10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xl text-[var(--wn-petrol)]" aria-hidden="true">↗</span>
            <h1 className="wn-heading mt-5 text-3xl">Beheer-toegang nodig.</h1>
            <p className="wn-body-muted mt-4">Deze deel-link laat het lijstje zien, maar geeft geen bewerkrechten. Open je bewaarde herstel-link op dit apparaat om de beheer-toegang terug te zetten.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href={`/lootje-lijstje/lijstje/${encodeURIComponent(shareCode)}`} className="wn-button wn-button-primary">Bekijk gedeeld lijstje</Link>
              <Link href="/lootje-lijstje" className="wn-button wn-button-secondary">Naar Lootje &amp; Lijstje</Link>
            </div>
          </section>
        </main>
        <WinkelnuFooter />
      </div>
    )
  }

  const notification = first(query.fout)
    ?? (first(query.gemaakt) ? 'Je lijstje is gemaakt. Voeg nu je eerste wens toe en bewaar je herstel-link.' : undefined)
    ?? (first(query.opgeslagen) ? 'Je lijstje is bijgewerkt.' : undefined)
    ?? (first(query.toegevoegd) ? 'Wens toegevoegd.' : undefined)
    ?? (first(query.bijgewerkt) ? 'Wens bijgewerkt.' : undefined)
    ?? (first(query.verwijderd) ? 'Wens verwijderd.' : undefined)
  const isError = Boolean(first(query.fout))
  const sharePath = `/lootje-lijstje/lijstje/${encodeURIComponent(shareCode)}`

  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <section className="border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
          <div className="wn-container py-10 sm:py-14">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="wn-eyebrow">Mijn lijstje</p>
                <h1 className="wn-heading mt-3 text-3xl sm:text-5xl">{list.title ?? `${list.displayName}’s lijstje`}</h1>
                <p className="wn-body-muted mt-3">{list.items.length === 1 ? '1 wens toegevoegd' : `${list.items.length} wensen toegevoegd`}.</p>
              </div>
              <Link href={sharePath} className="wn-button wn-button-secondary">Bekijk zoals anderen het zien →</Link>
            </div>
          </div>
        </section>

        <div className="wn-container py-8 sm:py-12">
          {notification ? (
            <div
              role={isError ? 'alert' : 'status'}
              className={`mb-6 rounded-xl border p-4 text-sm font-semibold leading-6 ${isError ? 'border-[#d9a99f] bg-[#fff3ef] text-[#7f2d23]' : 'border-[color:rgba(18,59,58,0.16)] bg-[var(--wn-petrol-soft)] text-[var(--wn-petrol-deep)]'}`}
            >
              {notification}
            </div>
          ) : null}

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_23rem] xl:items-start">
            <div className="space-y-8">
              <section>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="wn-eyebrow">Wensen</p>
                    <h2 className="wn-heading mt-2 text-3xl">Wat staat er op je lijst?</h2>
                  </div>
                </div>

                {list.items.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {list.items.map((item) => (
                      <GiftListItemCard
                        key={item.id}
                        item={item}
                        editable
                        updateAction={updateGiftListItemAction}
                        deleteAction={deleteGiftListItemAction}
                        shareCode={shareCode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[var(--wn-radius-xl)] border border-dashed border-[color:rgba(18,59,58,0.24)] bg-white/70 p-7 text-center">
                    <h3 className="wn-ui-heading text-lg">Je lijstje is nog leeg.</h3>
                    <p className="wn-body-muted mt-2 text-sm">Voeg hieronder je eerste wens toe.</p>
                  </div>
                )}
              </section>

              <GiftListItemEditor action={addGiftListItemAction} shareCode={shareCode} />

              <section className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-6 shadow-[var(--wn-shadow-xs)] sm:p-8">
                <p className="wn-eyebrow">Lijstje-instellingen</p>
                <h2 className="wn-heading mt-2 text-2xl">Naam, gelegenheid en budget.</h2>
                <div className="mt-6">
                  <GiftListForm action={updateGiftListAction} submitLabel="Wijzigingen opslaan" shareCode={shareCode} list={list} />
                </div>
              </section>
            </div>

            <aside className="space-y-5 xl:sticky xl:top-28">
              <section className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-5 shadow-[var(--wn-shadow-xs)] sm:p-6">
                <p className="wn-eyebrow">Delen</p>
                <h2 className="wn-ui-heading mt-2 text-xl">Stuur je wensen door.</h2>
                <p className="wn-body-muted mt-2 text-sm">Deze link is alleen-lezen. Mensen met de link kunnen je lijstje bekijken, maar niets aanpassen.</p>
                <div className="mt-5">
                  <GiftShareActions sharePath={sharePath} title={`${list.displayName} heeft een lijstje met je gedeeld via Winkelnu.`} />
                </div>
              </section>

              <GiftRecoveryLink shareCode={shareCode} />

              <section className="rounded-[var(--wn-radius-lg)] border border-[var(--wn-border)] bg-[var(--wn-petrol-soft)] p-5">
                <p className="text-sm font-bold text-[var(--wn-petrol-deep)]">Winkelnu-producten volgen in L2</p>
                <p className="mt-2 text-sm leading-6 text-[var(--wn-text-muted)]">Dan kun je producten uit de bestaande Winkelnu-catalogus rechtstreeks op je lijstje zetten. Er komt geen tweede productdatabase.</p>
              </section>
            </aside>
          </div>
        </div>
      </main>
      <WinkelnuFooter />
    </div>
  )
}
