import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  addGiftGroupExclusionAction,
  drawGiftGroupAction,
  redrawGiftGroupAction,
  removeGiftGroupExclusionAction,
  removeGiftGroupParticipantAction,
} from '@/app/lootje-lijstje/groep/actions'
import { getGiftGroupDrawContext } from '@/application/gifting/gift-group-draw'
import {
  getGiftGroupInvite,
  getParticipantGiftGroupContext,
} from '@/application/gifting/gift-groups'
import { GiftDrawConfirmation } from '@/components/gifting/gift-draw-confirmation'
import { GiftGroupDeletePanel } from '@/components/gifting/gift-group-delete-panel'
import { GiftGroupExclusions } from '@/components/gifting/gift-group-exclusions'
import { GiftGroupRecoveryLink } from '@/components/gifting/gift-group-recovery-link'
import { GiftShareActions } from '@/components/gifting/gift-share-actions'

export const metadata: Metadata = {
  title: 'Lootjesgroep beheren',
  description: 'Privé beheerpagina voor een Lootje & Lijstje-groep.',
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

export default async function GiftGroupOrganizerPage({
  params,
  searchParams,
}: {
  params: Promise<{ groupCode: string }>
  searchParams: Promise<{
    gemaakt?: string | string[]
    verwijderd?: string | string[]
    uitsluiting?: string | string[]
    getrokken?: string | string[]
    opnieuw?: string | string[]
    toegang?: string | string[]
    fout?: string | string[]
  }>
}) {
  const { groupCode } = await params
  const query = await searchParams
  const [invite, drawContext, participantContext] = await Promise.all([
    getGiftGroupInvite(groupCode),
    getGiftGroupDrawContext(groupCode),
    getParticipantGiftGroupContext(groupCode),
  ])
  if (!invite) notFound()

  if (!drawContext) {
    return (
      <div className="min-h-screen text-[var(--gift-ink)]">
        <main id="inhoud" className="gift-shell-container py-14 sm:py-20">
          <section className="mx-auto max-w-2xl rounded-[1.6rem] border border-[var(--gift-line)] bg-white/90 p-7 text-center shadow-[var(--gift-shadow-sm)] sm:p-10">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--gift-petrol-soft)] text-xl text-[var(--gift-petrol)]" aria-hidden="true">◇</span>
            <p className="gift-kicker mt-5">Privé beheer</p>
            <h1 className="mt-2 font-[var(--wn-font-display)] text-3xl font-semibold tracking-[-0.04em] text-[var(--gift-petrol-deep)]">Beheer-toegang nodig.</h1>
            <p className="mt-4 text-sm leading-7 text-[var(--gift-muted)]">Deze browser heeft geen organisatorrechten voor deze groep. Open je bewaarde beheer-herstel-link om je toegang zonder account terug te zetten.</p>
            <Link href={`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}`} className="wn-button wn-button-primary mt-7">Naar de uitnodiging</Link>
          </section>
        </main>
      </div>
    )
  }

  const { group, participants, exclusionPairs } = drawContext
  const invitePath = `/lootje-lijstje/groep/${encodeURIComponent(groupCode)}`
  const participantPath = `/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/mijn`
  const notification = first(query.fout)
    ?? (first(query.toegang) === 'hersteld' ? 'Je beheer-toegang is hersteld op deze browser.' : undefined)
    ?? (first(query.gemaakt) ? 'Je groep is gemaakt. Deel nu de uitnodigingslink en laat iedereen zijn wensen invullen.' : undefined)
    ?? (first(query.verwijderd) ? 'Deelnemer verwijderd uit de groep.' : undefined)
    ?? (first(query.uitsluiting) ? 'Uitsluitingen bijgewerkt.' : undefined)
    ?? (first(query.getrokken) ? 'De lootjes zijn veilig getrokken. Iedere deelnemer kan nu alleen het eigen lootje openen.' : undefined)
    ?? (first(query.opnieuw) ? 'De volledige trekking is vervangen door een nieuwe geldige verdeling.' : undefined)
  const isError = Boolean(first(query.fout))
  const draft = group.status === 'draft'
  const ownParticipantId = participantContext?.participant.id
  const readyCount = participants.filter((participant) => participant.wishCount > 0).length
  const eventDateLabel = group.eventDate
    ? new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${group.eventDate}T00:00:00Z`))
    : undefined

  const inviteState = group.status === 'drawn' || participants.length >= 2 ? 'done' : 'current'
  const listsState = group.status === 'drawn'
    ? 'done'
    : participants.length < 2
      ? 'upcoming'
      : readyCount === participants.length
        ? 'done'
        : 'current'
  const drawState = group.status === 'drawn'
    ? 'done'
    : participants.length >= 2 && readyCount === participants.length
      ? 'current'
      : 'upcoming'

  return (
    <div className="min-h-screen text-[var(--gift-ink)]">
      <main id="inhoud">
        <section className="gift-dashboard-hero">
          <div className="gift-shell-container gift-dashboard-hero-inner">
            <div>
              <span className="gift-dashboard-role">Organisator</span>
              <h1 className="gift-dashboard-title">{group.name}</h1>
              <p className="gift-dashboard-lead">
                Hier regel je de groep, deelnemers, uitsluitingen en trekking. Je geheime verdeling blijft ook voor jou verborgen.
              </p>
              <div className="gift-dashboard-meta">
                <span>{occasionLabels[group.occasion]}</span>
                <span>{participants.length === 1 ? '1 deelnemer' : `${participants.length} deelnemers`}</span>
                {group.budgetCents !== undefined ? <span>Budget {money(group.budgetCents)}</span> : null}
                {eventDateLabel ? <span>{eventDateLabel}</span> : null}
                <span>{group.status === 'drawn' ? 'Lootjes getrokken ✓' : 'Groep wordt voorbereid'}</span>
              </div>
            </div>
            <div className="gift-dashboard-hero-actions">
              {draft ? <a href="#uitnodigen" className="wn-button wn-button-primary">Deel uitnodiging</a> : null}
              {participantContext ? <Link href={participantPath} className="wn-button wn-button-secondary">Mijn deelnemerspagina →</Link> : null}
            </div>
          </div>
        </section>

        <div className="gift-shell-container gift-dashboard-body">
          {notification ? (
            <div role={isError ? 'alert' : 'status'} className={`mb-5 rounded-[1.1rem] border p-4 text-sm font-semibold leading-6 ${isError ? 'border-[#d9a99f] bg-[#fff3ef] text-[#7f2d23]' : 'border-[rgba(18,59,58,0.16)] bg-[var(--gift-petrol-soft)] text-[var(--gift-petrol-deep)]'}`}>
              {notification}
            </div>
          ) : null}

          <nav className="gift-dashboard-journey" aria-label="Voortgang lootjesgroep">
            <ol>
              <li data-state="done">
                <span className="gift-dashboard-step-dot">✓</span>
                <span><strong>Groep gemaakt</strong><small>De basis staat klaar.</small></span>
              </li>
              <li data-state={inviteState}>
                <span className="gift-dashboard-step-dot">{inviteState === 'done' ? '✓' : '2'}</span>
                <span><strong>Uitnodigen</strong><small>{participants.length >= 2 ? 'De groep heeft deelnemers.' : 'Deel de link met anderen.'}</small></span>
              </li>
              <li data-state={listsState}>
                <span className="gift-dashboard-step-dot">{listsState === 'done' ? '✓' : '3'}</span>
                <span><strong>Lijstjes vullen</strong><small>{readyCount} van {participants.length} met minstens één wens.</small></span>
              </li>
              <li data-state={drawState}>
                <span className="gift-dashboard-step-dot">{drawState === 'done' ? '✓' : '4'}</span>
                <span><strong>Lootjes trekken</strong><small>{group.status === 'drawn' ? 'Iedereen kan het eigen lootje openen.' : 'Start wanneer jullie er klaar voor zijn.'}</small></span>
              </li>
            </ol>
          </nav>

          <div className="gift-dashboard-summary" aria-label="Groepsoverzicht">
            <div className="gift-dashboard-stat"><strong>{participants.length}</strong><span>deelnemers</span></div>
            <div className="gift-dashboard-stat"><strong>{readyCount}/{participants.length}</strong><span>lijstjes met wensen</span></div>
            <div className="gift-dashboard-stat"><strong>{exclusionPairs.length}</strong><span>uitsluitingen</span></div>
            <div className="gift-dashboard-stat"><strong>{group.status === 'drawn' ? 'Klaar' : 'Open'}</strong><span>{group.status === 'drawn' ? 'trekking voltooid' : 'voor deelnemers'}</span></div>
          </div>

          <nav className="gift-dashboard-nav" aria-label="Snel naar onderdeel">
            <a href="#uitnodigen">Uitnodigen</a>
            <a href="#deelnemers">Deelnemers</a>
            <a href="#uitsluitingen">Uitsluitingen</a>
            <a href="#lootjes">Lootjes</a>
          </nav>

          <div className="gift-dashboard-layout">
            <div className="gift-dashboard-main">
              <section id="uitnodigen" className="gift-dashboard-panel" data-tone="soft">
                <div className="gift-dashboard-panel-head">
                  <div>
                    <p className="gift-kicker">Uitnodigen</p>
                    <h2>{draft ? 'Stuur één link naar iedereen.' : 'De deelname is gesloten.'}</h2>
                  </div>
                  <span className="gift-dashboard-role">{draft ? 'Open' : 'Gesloten'}</span>
                </div>
                {draft ? (
                  <>
                    <p className="gift-dashboard-panel-copy">Deze link opent alleen de uitnodiging. Hij geeft geen beheerrechten en onthult geen lootjes. Ideaal om direct via WhatsApp te delen.</p>
                    <div className="mt-5">
                      <GiftShareActions
                        sharePath={invitePath}
                        title={`Je bent uitgenodigd voor ${group.name} via Winkelnu Lootje & Lijstje.`}
                        copyLabel="Kopieer uitnodigingslink"
                      />
                    </div>
                  </>
                ) : (
                  <p className="gift-dashboard-panel-copy">Na de trekking kunnen deelnemers en uitsluitingen niet stilletjes worden gewijzigd. Zo blijft de opgeslagen verdeling betrouwbaar.</p>
                )}
              </section>

              <section id="deelnemers" className="gift-dashboard-panel">
                <div className="gift-dashboard-panel-head">
                  <div>
                    <p className="gift-kicker">Deelnemers</p>
                    <h2>Wie doen er mee?</h2>
                    <p className="gift-dashboard-panel-copy">Je ziet alleen wie meedoet en hoeveel wensen iemand heeft. De latere lootjesverdeling blijft privé.</p>
                  </div>
                  <span className="gift-dashboard-role">{participants.length}/50</span>
                </div>

                {participants.length > 0 ? (
                  <div className="gift-dashboard-people">
                    {participants.map((participant) => {
                      const isSelf = participant.id === ownParticipantId
                      return (
                        <article key={participant.id} className="gift-dashboard-person" data-self={isSelf ? 'true' : 'false'}>
                          <div className="gift-dashboard-person-top">
                            <span className="gift-dashboard-avatar" aria-hidden="true">{initials(participant.displayName)}</span>
                            <div>
                              <strong>{participant.displayName}{isSelf ? ' · jij' : ''}</strong>
                              <span className="gift-dashboard-person-status">
                                {participant.wishCount > 0 ? `${participant.wishCount} ${participant.wishCount === 1 ? 'wens' : 'wensen'} toegevoegd` : 'Nog geen wensen'}
                              </span>
                            </div>
                          </div>
                          <div className="gift-dashboard-person-actions">
                            <span>{participant.wishCount > 0 ? 'Lijstje gestart ✓' : 'Wacht op lijstje'}</span>
                            {draft && !isSelf ? (
                              <form action={removeGiftGroupParticipantAction}>
                                <input type="hidden" name="groupCode" value={groupCode} />
                                <input type="hidden" name="participantId" value={participant.id} />
                                <button type="submit" className="inline-flex min-h-9 items-center text-xs font-bold text-[var(--gift-muted)] hover:text-[var(--gift-petrol-deep)]">Verwijder</button>
                              </form>
                            ) : null}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                ) : (
                  <div className="mt-5 rounded-[1.2rem] border border-dashed border-[rgba(18,59,58,0.22)] bg-white/70 p-6 text-center">
                    <strong className="text-[var(--gift-petrol-deep)]">Nog niemand in de groep.</strong>
                    <p className="mt-2 text-sm text-[var(--gift-muted)]">Deel de uitnodigingslink om deelnemers toe te voegen.</p>
                  </div>
                )}
              </section>

              <div id="uitsluitingen" className="scroll-mt-24">
                <GiftGroupExclusions
                  groupCode={groupCode}
                  status={group.status}
                  participants={participants}
                  pairs={exclusionPairs}
                  addAction={addGiftGroupExclusionAction}
                  removeAction={removeGiftGroupExclusionAction}
                />
              </div>
            </div>

            <aside className="gift-dashboard-rail">
              <div id="lootjes" className="scroll-mt-24">
                <GiftDrawConfirmation
                  groupCode={groupCode}
                  status={group.status}
                  participantCount={participants.length}
                  drawVersion={group.drawVersion}
                  drawAction={drawGiftGroupAction}
                  redrawAction={redrawGiftGroupAction}
                />
              </div>

              {participantContext ? (
                <section className="gift-dashboard-next">
                  <p className="gift-kicker">Ook jij doet mee</p>
                  <h2>Open je eigen deelnemerspagina.</h2>
                  <p>Daar beheer je jouw persoonlijke lijstje en zie je na de trekking uitsluitend jouw eigen lootje.</p>
                  <Link href={participantPath} className="wn-button wn-button-warm">Naar mijn groep →</Link>
                </section>
              ) : null}

              <GiftGroupRecoveryLink groupCode={groupCode} kind="organizer" />

              <section className="gift-dashboard-panel" data-tone="warm">
                <p className="gift-kicker">Privacy</p>
                <h2 className="!text-xl">De trekking blijft geheim.</h2>
                <p className="gift-dashboard-panel-copy">Ook als organisator zie je niet wie welk lootje heeft. Iedere deelnemer kan alleen de eigen ontvanger en diens wensen bekijken.</p>
              </section>

              <GiftGroupDeletePanel groupCode={groupCode} />
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
