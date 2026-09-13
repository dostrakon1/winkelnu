import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setGiftItemReservationAction } from '@/app/lootje-lijstje/groep/actions'
import { resolveGiftCatalogProductViews } from '@/application/gifting/gift-catalog'
import { GiftGroupRevealError, getGiftGroupRevealContext } from '@/application/gifting/gift-group-reveal'
import { GiftRecipientList } from '@/components/gifting/gift-recipient-list'
import { GiftRevealCard } from '@/components/gifting/gift-reveal-card'

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
        <div className="min-h-screen text-[var(--gift-ink)]">
          <main id="inhoud" className="gift-shell-container py-14 sm:py-20">
            <section className="mx-auto max-w-2xl rounded-[1.6rem] border border-[var(--gift-line)] bg-white/90 p-7 text-center shadow-[var(--gift-shadow-sm)] sm:p-10">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--gift-petrol-soft)] text-xl text-[var(--gift-petrol)]" aria-hidden="true">✦</div>
              <p className="gift-kicker mt-5">Mijn lootje</p>
              <h1 className="mt-2 font-[var(--wn-font-display)] text-3xl font-semibold tracking-[-0.04em] text-[var(--gift-petrol-deep)]">Je lootje is nog niet beschikbaar.</h1>
              <p className="mt-4 text-sm leading-7 text-[var(--gift-muted)]">{error.message}</p>
              <Link href={`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/mijn`} className="wn-button wn-button-primary mt-7">Terug naar mijn groep</Link>
            </section>
          </main>
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
  const participantPath = `/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/mijn`

  return (
    <div className="min-h-screen text-[var(--gift-ink)]">
      <main id="inhoud">
        <section className="gift-dashboard-hero">
          <div className="gift-shell-container gift-dashboard-hero-inner">
            <div>
              <span className="gift-dashboard-role">Privé voor {context.participant.displayName}</span>
              <h1 className="gift-dashboard-title">Mijn lootje</h1>
              <p className="gift-dashboard-lead">De trekking van {context.group.name} staat vast. Alleen jij kunt hieronder jouw ontvanger en diens wensen zien.</p>
              <div className="gift-dashboard-meta">
                <span>Trekking #{context.drawVersion}</span>
                {budgetLabel ? <span>{budgetLabel}</span> : null}
                {dateLabel ? <span>{dateLabel}</span> : null}
                <span>{context.recipientList.items.length} {context.recipientList.items.length === 1 ? 'wens' : 'wensen'} beschikbaar</span>
              </div>
            </div>
            <div className="gift-dashboard-hero-actions">
              <Link href={participantPath} className="wn-button wn-button-secondary">← Mijn groep</Link>
            </div>
          </div>
        </section>

        <div className="gift-shell-container gift-dashboard-body">
          {notification ? (
            <div role={error ? 'alert' : 'status'} className={`mb-5 rounded-[1.1rem] border p-4 text-sm font-semibold leading-6 ${error ? 'border-[#d9a99f] bg-[#fff3ef] text-[#7f2d23]' : 'border-[rgba(18,59,58,0.16)] bg-[var(--gift-petrol-soft)] text-[var(--gift-petrol-deep)]'}`}>
              {notification}
            </div>
          ) : null}

          <nav className="gift-dashboard-journey" aria-label="Mijn voortgang in de groep">
            <ol>
              <li data-state="done"><span className="gift-dashboard-step-dot">✓</span><span><strong>Meedoen</strong><small>Je persoonlijke toegang werkt.</small></span></li>
              <li data-state="done"><span className="gift-dashboard-step-dot">✓</span><span><strong>Wensen</strong><small>Jouw lijstje is opgeslagen.</small></span></li>
              <li data-state="done"><span className="gift-dashboard-step-dot">✓</span><span><strong>Trekking</strong><small>De verdeling staat vast.</small></span></li>
              <li data-state="current"><span className="gift-dashboard-step-dot">4</span><span><strong>Cadeau</strong><small>Bekijk wensen en houd privé bij wat geregeld is.</small></span></li>
            </ol>
          </nav>

          <div className="mt-5 space-y-8 sm:space-y-10">
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

              <section className="gift-dashboard-panel" data-tone="soft">
                <p className="gift-kicker">Privé geregeld</p>
                <h2 className="!text-xl">Niemand ziet jouw markeringen.</h2>
                <p className="gift-dashboard-panel-copy">{context.recipient.displayName} kan niet zien dat jij deze persoon hebt getrokken en ziet ook jouw “geregeld”-markeringen niet. De organisator krijgt evenmin een overzicht van alle koppelingen.</p>
              </section>
            </GiftRevealCard>
          </div>
        </div>
      </main>
    </div>
  )
}
