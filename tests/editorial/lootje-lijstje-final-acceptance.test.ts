import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

describe('Lootje & Lijstje final acceptance hardening', () => {
  it('retries transient group reads while leaving mutation methods outside the retry wrapper', () => {
    const repository = source('src/infrastructure/gifting/supabase-gift-group-repository.ts')

    expect(repository).toContain("import { retryTransientGiftingRead } from '@/infrastructure/gifting/transient-read'")
    expect(repository).toMatch(/async getGroupByCodeHash[\s\S]*?return retryTransientGiftingRead/)
    expect(repository).toMatch(/async listParticipantSummaries[\s\S]*?return retryTransientGiftingRead/)
    expect(repository).toMatch(/async getParticipantForGroupByIds[\s\S]*?return retryTransientGiftingRead/)
    expect(repository).toMatch(/async getParticipantList[\s\S]*?return retryTransientGiftingRead/)

    const joinMethod = repository.slice(repository.indexOf('async joinGroup'), repository.indexOf('async listParticipantSummaries'))
    expect(joinMethod).not.toContain('retryTransientGiftingRead')
  })

  it('gives organizers a direct route back to group management', () => {
    const participantPage = source('src/app/lootje-lijstje/groep/[groupCode]/mijn/page.tsx')

    expect(participantPage).toContain('canManageGiftGroup(group.id)')
    expect(participantPage).toContain('Groep beheren →')
    expect(participantPage).toContain('/beheer`')
  })

  it('keeps the recipient and wishlist hidden until the participant explicitly reveals the lootje', () => {
    const revealPage = source('src/app/lootje-lijstje/groep/[groupCode]/mijn/lootje/page.tsx')
    const revealCard = source('src/components/gifting/gift-reveal-card.tsx')

    const cardStart = revealPage.indexOf('<GiftRevealCard')
    const recipientList = revealPage.indexOf('<GiftRecipientList')
    const cardEnd = revealPage.indexOf('</GiftRevealCard>')

    expect(cardStart).toBeGreaterThanOrEqual(0)
    expect(recipientList).toBeGreaterThan(cardStart)
    expect(cardEnd).toBeGreaterThan(recipientList)
    expect(revealCard).toContain('{revealed ? children : null}')
  })

  it('uses explicit high-contrast styling for the dark reveal surfaces', () => {
    const participantPage = source('src/app/lootje-lijstje/groep/[groupCode]/mijn/page.tsx')
    const dashboardStyles = source('src/app/lootje-lijstje/premium-group-dashboard.css')
    const revealCard = source('src/components/gifting/gift-reveal-card.tsx')

    expect(participantPage).toContain('gift-dashboard-next')
    expect(participantPage).toContain('wn-button wn-button-warm')
    expect(dashboardStyles).toContain('.gift-dashboard-next {')
    expect(dashboardStyles).toContain('background: var(--gift-petrol-deep);')
    expect(dashboardStyles).toMatch(/\.gift-dashboard-next \.gift-kicker,[\s\S]*?\.gift-dashboard-next h2,[\s\S]*?\.gift-dashboard-next p \{[\s\S]*?color: white;/)
    expect(revealCard).toContain('wn-button wn-button-warm')
    expect(revealCard).toContain('wn-display mt-3 break-words text-5xl')
  })
})
