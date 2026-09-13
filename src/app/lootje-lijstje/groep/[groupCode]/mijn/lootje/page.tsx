import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setGiftItemReservationAction } from '@/app/lootje-lijstje/groep/actions'
import { resolveGiftCatalogProductViews } from '@/application/gifting/gift-catalog'
import { GiftGroupRevealError, getGiftGroupRevealContext } from '@/application/gifting/gift-group-reveal'
import { GiftRecipientList } from '@/components/gifting/gift-recipient-list'
import { GiftRevealCard } from '@/components/gifting/gift-reveal-card'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export const metadata: Metadata = {
  title: 'Mijn lootje',
  description: 'Privé onthulling van jouw Lootje & Lijstje-ontvanger.',
  robots: { index: false, follow: false },
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function money(cents: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

export default async function GiftGroupRevealPage({
  params,
  searchParams,
}: {
  params: Promise<{ groupCode: string }>
  searchParams: Promise<{
    geregeld?: string | string[]
    vrij?: string | string[]
    fout?: string | string[]
  }>
}) {
  const { groupCode } = await params
  const query = await searchParams

  let context
  try {
    context = await getGiftGroupRevealContext(groupCode)
  } catch (error) {
    if (error instanceof GiftGroupRevealError) {
      return (
        <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
          <WinkelnuHeader />
          <main id="inhoud" className="wn-container py-14 sm:py-20">
            <section className="mx-auto max-w-2xl rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-7 text-center shadow-[var(--wn-shadow-sm)] sm:p-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xl text-[var(--wn-petrol)]" aria-hidden="true">✦</div>
              <h1 className="wn-heading mt-5 text-3xl">Je lootje is nog niet beschikbaar.</h1>
              <p className="wn-body-muted mt-4">{error.message}</p>
              <Link href={`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/mijn`} className="wn-button wn-button-primary mt-7">Terug naar mijn groep</Link>
            </section>
          </main>
          <WinkelnuFooter />
        </div>
      )
    }
    throw error
  }

  if (!context) notFound()

  const productViews = await resolveGiftCatalogProductViews(context.recipientList.items)
  const error = first(query.fout)
  const notification = error
    ?? (first(query.geregeld) ? 'Wens gemarkeerd als geregeld. Alleen jij ziet dit.' : undefined)
    ?? (first(query.vrij) ? 'Wens is weer vrijgegeven.' : undefined)

  const budgetLabel = context.group.budgetCents !== undefined ? `Budget ${money(context.group.budgetCents)}` : undefined
  const dateLabel = context.group.eventDate
    ? new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${context.group.eventDate}T00:00:00Z`))
    : undefined

  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <section className="border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
          <div className="wn-container py-9 sm:py-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="wn-eyebrow">Mijn lootje</p>
                <h1 className="wn-heading mt-2 text-4xl sm:text-5xl">{context.group.name}</h1>
                <p className="wn-body-muted mt-3">Privé voor {context.participant.displayName}. Trekking #{context.drawVersion}.</p>
              </div>
              <Link href={`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/mijn`} className="wn-button wn-button-secondary">Mijn groep</Link>
            </div>
          </div>
        </section>

        <div className="wn-container space-y-8 py-8 sm:space-y-10 sm:py-12">
          {notification ? (
            <div role={error ? 'alert' : 'status'} className={`rounded-xl border p-4 text-sm font-semibold leading-6 ${error ? 'border-[#d9a99f] bg-[#fff3ef] text-[#7f2d23]' : 'border-[color:rgba(18,59,58,0.16)] bg-[var(--wn-petrol-soft)] text-[var(--wn-petrol-deep)]'}`}>
              {notification}
            </div>
          ) : null}

          <GiftRevealCard
            recipientName={context.recipient.displayName}
            budgetLabel={budgetLabel}
            dateLabel={dateLabel}
          >
            <GiftRecipientList
              groupCode={groupCode}
              recipientName={context.recipient.displayName}
              items={context.recipientList.items}
              productViews={productViews}
              reservedItemIds={context.reservedItemIds}
              reservationAction={setGiftItemReservationAction}
            />

            <section className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-6 shadow-[var(--wn-shadow-xs)] sm:p-7">
              <p className="text-sm font-bold text-[var(--wn-petrol-deep)]">Dit blijft geheim</p>
              <p className="wn-body-muted mt-2 text-sm leading-6">{context.recipient.displayName} kan niet zien dat jij deze persoon hebt getrokken en krijgt ook jouw “geregeld”-markeringen niet te zien. De organisator krijgt evenmin een overzicht van alle koppelingen.</p>
            </section>
          </GiftRevealCard>
        </div>
      </main>
      <WinkelnuFooter />
    </div>
  )
}
