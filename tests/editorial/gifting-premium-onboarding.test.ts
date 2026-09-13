import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

describe('Lootje & Lijstje premium onboarding contract', () => {
  it('loads the onboarding design layer from the gifting route shell', () => {
    const layout = source('src/app/lootje-lijstje/layout.tsx')
    const styles = source('src/app/lootje-lijstje/premium-onboarding.css')

    expect(layout).toContain("import './premium-onboarding.css'")
    expect(styles).toContain('.gift-landing-grid')
    expect(styles).toContain('.gift-choice-card')
    expect(styles).toContain('.gift-onboarding-layout')
    expect(styles).toContain('.gift-invite-shell')
  })

  it('keeps the landing focused on the two primary user intents', () => {
    const landing = source('src/app/lootje-lijstje/page.tsx')

    expect(landing).toContain('Ik wil een verlanglijstje maken')
    expect(landing).toContain('Ik wil lootjes trekken met een groep')
    expect(landing).toContain('Geen account nodig')
    expect(landing).toContain('/lootje-lijstje/lijstje/nieuw')
    expect(landing).toContain('/lootje-lijstje/groep/nieuw')
  })

  it('shows clear progress and privacy cues in both creation flows', () => {
    const groupPage = source('src/app/lootje-lijstje/groep/nieuw/page.tsx')
    const listPage = source('src/app/lootje-lijstje/lijstje/nieuw/page.tsx')

    expect(groupPage).toContain('Voortgang lootjesgroep')
    expect(groupPage).toContain('Privé vanaf het begin')
    expect(listPage).toContain('Voortgang verlanglijstje')
    expect(listPage).toContain('Jij houdt het beheer')
  })

  it('keeps the invite private and lightweight without changing join semantics', () => {
    const invitePage = source('src/app/lootje-lijstje/groep/[groupCode]/page.tsx')
    const joinForm = source('src/components/gifting/gift-group-join-form.tsx')

    expect(invitePage).toContain('robots: { index: false, follow: false }')
    expect(invitePage).toContain('GiftGroupJoinForm')
    expect(joinForm).toContain('name="groupCode"')
    expect(joinForm).toContain('name="displayName"')
    expect(joinForm).toContain('Geen account, e-mail of telefoonnummer nodig.')
  })

  it('uses neutral copy in every public name field', () => {
    const groupForm = source('src/components/gifting/gift-group-form.tsx')
    const joinForm = source('src/components/gifting/gift-group-join-form.tsx')
    const listForm = source('src/components/gifting/gift-list-form.tsx')
    const publicNameForms = [groupForm, joinForm, listForm]

    for (const form of publicNameForms) {
      expect(form).toContain('placeholder="Vul je naam in"')
      expect(form).not.toContain('Dogan')
    }
  })
})
