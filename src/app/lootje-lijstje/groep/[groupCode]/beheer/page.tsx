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
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

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
      <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
        <WinkelnuHeader />
        <main id="inhoud" className="wn-container py-14 sm:py-20">
          <section className="mx-auto max-w-2xl rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-7 text-center shadow-[var(--wn-shadow-sm)] sm:p-10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xl text-[var(--wn-petrol)]" aria-hidden="true">◇</span>
            <h1 className="wn-heading mt-5 text-3xl">Beheer-toegang nodig.</h1>
            <p className="wn-body-muted mt-4">Deze browser heeft geen organisatorrechten voor deze groep. Open je bewaarde beheer-herstel-link om je toegang zonder account terug te zetten.</p>
            <Link href={`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}`} className="wn-button wn-button-primary mt-7">Naar de uitnodiging</Link>
          </section>
        </main>
        <WinkelnuFooter />
      </div>
    )
  }

  const { group, participants, exclusionPairs } = drawContext
  const invitePath = `/lootje-lijstje/groep/${encodeURIComponent(groupCode)}`
  const notification = first(query.fout)
    ?? (first(query.toegang) === 'hersteld' ? 'Je beheer-toegang is hersteld op deze browser.' : undefined)
    ?? (first(query.gemaakt) ? 'Je groep is gemaakt. Deel nu de uitnodigingslink met de andere deelnemers en bewaar je beheer-herstel-link.' : undefined)
    ?? (first(query.verwijderd) ? 'Deelnemer verwijderd uit de groep.' : undefined)
    ?? (first(query.uitsluiting) ? 'Uitsluitingen bijgewerkt.' : undefined)
    ?? (first(query.getrokken) ? 'De lootjes zijn veilig getrokken. De geheime verdeling staat vast.' : undefined)
    ?? (first(query.opnieuw) ? 'De volledige trekking is vervangen door een nieuwe geldige verdeling.' : undefined)
  const isError = Boolean(first(query.fout))
  const draft = group.status === 'draft'

  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <section className="border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
          <div className="wn-container py-10 sm:py-14">
            <p className="wn-eyebrow">Groep beheren</p>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-5">
              <div>
                <h1 className="wn-heading text-4xl sm:text-5xl">{group.name}</h1>
                <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-[var(--wn-text-muted)]">
                  <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">{occasionLabels[group.occasion]}</span>
                  <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">{participants.length === 1 ? '1 deelnemer' : `${participants.length} deelnemers`}</span>
                  {group.budgetCents !== undefined ? <span className="rounded-full border border-[var(--wn-border)] bg-white/70 px-3 py-1.5">Budget {money(group.budgetCents)}</span> : null}
                  {group.status === 'drawn' ? <span className="rounded-full border border-[color:rgba(18,59,58,0.18)] bg-[var(--wn-petrol-soft)] px-3 py-1.5 text-[var(--wn-petrol-deep)]">Lootjes getrokken</span> : null}
                </div>
              </div>
              {participantContext ? <Link href={`/lootje-lijstje/groep/${encodeURIComponent(groupCode)}/mijn`} className="wn-button wn-button-secondary">Mijn deelnemerspagina →</Link> : null}
            </div>
          </div>
        </section>

        <div className="wn-container py-8 sm:py-12">
          {notification ? (
            <div role={isError ? 'alert' : 'status'} className={`mb-6 rounded-xl border p-4 text-sm font-semibold leading-6 ${isError ? 'border-[#d9a99f] bg-[#fff3ef] text-[#7f2d23]' : 'border-[color:rgba(18,59,58,0.16)] bg-[var(--wn-petrol-soft)] text-[var(--wn-petrol-deep)]'}`}>
              {notification}
            </div>
          ) : null}

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_23rem] xl:items-start">
            <div className="space-y-8">
              <section className="rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white p-6 shadow-[var(--wn-shadow-xs)] sm:p-8">
                <p className="wn-eyebrow">Uitnodigen</p>
                <h2 className="wn-heading mt-2 text-3xl">{draft ? 'Stuur één link naar iedereen.' : 'De deelname is gesloten.'}</h2>
                {draft ? (
                  <>
                    <p className="wn-body-muted mt-3 leading-7">De uitnodigingslink geeft alleen toegang tot de join-pagina. Hij geeft geen organisatorrechten en onthult geen lootjes.</p>
                    <div className="mt-6">
                      <GiftShareActions
                        sharePath={invitePath}
                        title={`Je bent uitgenodigd voor ${group.name} via Winkelnu Lootje & Lijstje.`}
                        copyLabel="Kopieer uitnodigingslink"
                      />
                    </div>
                  </>
                ) : (
                  <p className="wn-body-muted mt-3 leading-7">Na de trekking kunnen deelnemers en uitsluitingen niet stilletjes worden gewijzigd. Zo blijft de opgeslagen verdeling betrouwbaar.</p>
                )}
              </section>

              <section>
                <div className="mb-5">
                  <p className="wn-eyebrow">Deelnemers</p>
                  <h2 className="wn-heading mt-2 text-3xl">Wie doen er mee?</h2>
                </div>

                {participants.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {participants.map((participant) => (
                      <article key={participant.id} className="rounded-[var(--wn-radius-lg)] border border-[var(--wn-border)] bg-white p-5 shadow-[var(--wn-shadow-xs)]">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="wn-ui-heading text-lg">{participant.displayName}</h3>
                            <p className="mt-2 text-sm text-[var(--wn-text-muted)]">{participant.wishCount === 1 ? '1 wens op het lijstje' : `${participant.wishCount} wensen op het lijstje`}</p>
                          </div>
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-sm font-black text-[var(--wn-petrol)]" aria-hidden="true">{participant.wishCount}</span>
                        </div>
                        {draft ? (
                          <form action={removeGiftGroupParticipantAction} className="mt-4 border-t border-[var(--wn-border)] pt-3">
                            <input type="hidden" name="groupCode" value={groupCode} />
                            <input type="hidden" name="participantId" value={participant.id} />
                            <button type="submit" className="inline-flex min-h-10 items-center text-sm font-semibold text-[var(--wn-text-muted)] hover:text-[var(--wn-petrol-deep)]">Verwijder deelnemer</button>
                          </form>
                        ) : null}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[var(--wn-radius-xl)] border border-dashed border-[color:rgba(18,59,58,0.24)] bg-white/70 p-7 text-center">
                    <h3 className="wn-ui-heading text-lg">Nog niemand in de groep.</h3>
                    <p className="wn-body-muted mt-2 text-sm">Deel de uitnodigingslink om deelnemers toe te voegen.</p>
                  </div>
                )}
              </section>

              <GiftGroupExclusions
                groupCode={groupCode}
                status={group.status}
                participants={participants}
                pairs={exclusionPairs}
                addAction={addGiftGroupExclusionAction}
                removeAction={removeGiftGroupExclusionAction}
              />
            </div>

            <aside className="space-y-5 xl:sticky xl:top-28">
              <GiftDrawConfirmation
                groupCode={groupCode}
                status={group.status}
                participantCount={participants.length}
                drawVersion={group.drawVersion}
                drawAction={drawGiftGroupAction}
                redrawAction={redrawGiftGroupAction}
              />

              <GiftGroupRecoveryLink groupCode={groupCode} kind="organizer" />

              <section className="rounded-[var(--wn-radius-lg)] border border-[var(--wn-border)] bg-white p-5">
                <p className="text-sm font-bold text-[var(--wn-petrol-deep)]">De trekking blijft geheim</p>
                <p className="mt-2 text-sm leading-6 text-[var(--wn-text-muted)]">Ook als organisator zie je niet wie welk lootje heeft. Iedere deelnemer kan alleen de eigen ontvanger en diens wensen bekijken. Ook de persoonlijke “geregeld”-markeringen blijven privé.</p>
              </section>

              <GiftGroupDeletePanel groupCode={groupCode} />
            </aside>
          </div>
        </div>
      </main>
      <WinkelnuFooter />
    </div>
  )
}
