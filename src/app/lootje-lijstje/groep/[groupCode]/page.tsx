import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { joinGiftGroupAction } from '@/app/lootje-lijstje/groep/actions'
import { getGiftGroupInvite, getParticipantGiftGroupContext } from '@/application/gifting/gift-groups'
import { GiftGroupJoinForm } from '@/components/gifting/gift-group-join-form'
import { GiftingInsightBeacon } from '@/components/gifting/gifting-insight-beacon'

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
    <div className="min-h-screen text-[var(--gift-ink)]">
      <GiftingInsightBeacon eventType="group_invite_viewed" sourceSurface="group_invite" />
      <main id="inhoud">
        <section className="gift-shell-container py-8 sm:py-12 lg:py-16">
          {error ? (
            <div role="alert" className="mb-4 rounded-[1.1rem] border border-[#d9a99f] bg-[#fff3ef] p-4 text-sm font-semibold leading-6 text-[#7f2d23]">
              {error}
            </div>
          ) : null}

          <div className="gift-invite-shell">
            <section className="gift-invite-card" aria-labelledby="invite-title">
              <p className="gift-kicker text-[#ffb889]">Je bent uitgenodigd</p>
              <h1 id="invite-title">{group.name}</h1>
              <p className="relative z-[1] mt-4 max-w-xl text-sm leading-7 text-white/70">
                Doe mee met de groep, maak daarna je eigen verlanglijstje en wacht tot de organisator de lootjes trekt.
              </p>

              <div className="gift-invite-meta">
                <span>{occasionLabels[group.occasion]}</span>
                <span>{participantCount === 1 ? '1 deelnemer' : `${participantCount} deelnemers`}</span>
                {group.budgetCents !== undefined ? <span>Budget {money(group.budgetCents)}</span> : null}
                {group.eventDate ? (
                  <span>{new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${group.eventDate}T00:00:00Z`))}</span>
                ) : null}
              </div>

              <div className="relative z-[1] mt-8 border-t border-white/10 pt-5 text-xs font-semibold leading-6 text-white/55">
                Alleen deelnemers met hun eigen persoonlijke toegang kunnen later hun getrokken persoon zien.
              </div>
            </section>

            <section aria-label="Deelnemen aan groep">
              {participantContext ? (
                <div className="gift-join-card text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--gift-petrol-soft)] text-lg font-black text-[var(--gift-petrol)]" aria-hidden="true">✓</span>
                  <p className="gift-kicker mt-5">Je bent al binnen</p>
                  <h2 className="mt-2 font-[var(--wn-font-display)] text-3xl font-semibold tracking-[-0.04em] text-[var(--gift-petrol-deep)]">Welkom terug.</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--gift-muted)]">Je bent in deze browser bekend als <strong className="text-[var(--gift-petrol-deep)]">{participantContext.participant.displayName}</strong>.</p>
                  <Link href={`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/mijn`} className="wn-button wn-button-primary mt-6 w-full">Naar mijn groep →</Link>
                </div>
              ) : joinable ? (
                <GiftGroupJoinForm action={joinGiftGroupAction} groupCode={groupCode} />
              ) : (
                <div className="gift-join-card text-center">
                  <p className="gift-kicker">Deelname gesloten</p>
                  <h2 className="mt-2 font-[var(--wn-font-display)] text-3xl font-semibold tracking-[-0.04em] text-[var(--gift-petrol-deep)]">Deze groep is niet meer open.</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--gift-muted)]">De organisator kan je vertellen of de trekking al is gestart of de groep vol is. Wil je zelf lootjes trekken? Start dan gratis een eigen groep.</p>
                  <div className="mt-6 flex flex-col gap-3">
                    <Link href="/lootje-lijstje/groep/nieuw" className="wn-button wn-button-primary w-full">Start mijn eigen groep</Link>
                    <Link href="/lootje-lijstje" className="wn-button wn-button-secondary w-full">Naar Lootje &amp; Lijstje</Link>
                  </div>
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    </div>
  )
}
