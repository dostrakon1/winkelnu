import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { joinGiftGroupAction } from '@/app/lootje-lijstje/groep/actions'
import { getGiftGroupInvite, getParticipantGiftGroupContext } from '@/application/gifting/gift-groups'
import { GiftGroupJoinForm } from '@/components/gifting/gift-group-join-form'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export const metadata: Metadata = {
  title: 'Doe mee met Lootje & Lijstje',
  description: 'Open de uitnodiging en doe zonder account mee met een Lootje & Lijstje-groep.',
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

export default async function GiftGroupInvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ groupCode: string }>
  searchParams: Promise<{ fout?: string | string[] }>
}) {
  const { groupCode } = await params
  const query = await searchParams
  const [invite, participantContext] = await Promise.all([
    getGiftGroupInvite(groupCode),
    getParticipantGiftGroupContext(groupCode),
  ])
  if (!invite) notFound()

  const { group, participantCount, joinable } = invite
  const error = first(query.fout)

  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <section className="border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
          <div className="wn-container py-12 sm:py-16">
            <p className="wn-eyebrow">Je bent uitgenodigd</p>
            <h1 className="wn-heading mt-3 max-w-3xl text-4xl sm:text-5xl">{group.name}</h1>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-[var(--wn-text-muted)]">
              <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">{occasionLabels[group.occasion]}</span>
              <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">{participantCount === 1 ? '1 deelnemer' : `${participantCount} deelnemers`}</span>
              {group.budgetCents !== undefined ? <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">Budget {money(group.budgetCents)}</span> : null}
              {group.eventDate ? (
                <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">
                  {new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${group.eventDate}T00:00:00Z`))}
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <section className="wn-container py-10 sm:py-14">
          <div className="mx-auto max-w-3xl">
            {error ? (
              <div role="alert" className="mb-6 rounded-xl border border-[#d9a99f] bg-[#fff3ef] p-4 text-sm font-semibold leading-6 text-[#7f2d23]">{error}</div>
            ) : null}

            {participantContext ? (
              <div className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-7 text-center shadow-[var(--wn-shadow-sm)] sm:p-9">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xl text-[var(--wn-petrol)]" aria-hidden="true">✓</span>
                <h2 className="wn-heading mt-4 text-3xl">Je doet al mee.</h2>
                <p className="wn-body-muted mt-3">Je bent in deze browser bekend als <strong className="text-[var(--wn-petrol-deep)]">{participantContext.participant.displayName}</strong>.</p>
                <Link href={`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/mijn`} className="wn-button wn-button-primary mt-6">Naar mijn groep →</Link>
              </div>
            ) : joinable ? (
              <GiftGroupJoinForm action={joinGiftGroupAction} groupCode={groupCode} />
            ) : (
              <div className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-7 text-center shadow-[var(--wn-shadow-sm)] sm:p-9">
                <h2 className="wn-heading text-3xl">De groep is niet meer open voor nieuwe deelnemers.</h2>
                <p className="wn-body-muted mt-3">De organisator kan je vertellen of de trekking al is gestart of de groep vol is.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <WinkelnuFooter />
    </div>
  )
}
