import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

describe('Lootje & Lijstje post-acceptance hardening', () => {
  it('keeps submitted gift item values in inline form state after an error', () => {
    const editor = source('src/components/gifting/gift-list-item-editor.tsx')
    const standaloneActions = source('src/app/lootje-lijstje/actions.ts')
    const groupActions = source('src/app/lootje-lijstje/groep/actions.ts')

    expect(editor).toContain('useActionState')
    expect(editor).toContain('defaultValue={state.values.externalUrl}')
    expect(standaloneActions).toContain('return giftItemFormError(previousState, formData, error)')
    expect(groupActions).toContain('return giftItemFormError(previousState, formData, error)')
  })

  it('uses a real browser reload for the global retry action', () => {
    const errorPage = source('src/app/error.tsx')

    expect(errorPage).toContain('window.location.reload()')
    expect(errorPage).toContain("'/lootje-lijstje'")
  })

  it('removes implementation jargon from the standalone and participant screens', () => {
    const standalonePage = source('src/app/lootje-lijstje/lijstje/[shareCode]/bewerken/page.tsx')
    const participantPage = source('src/app/lootje-lijstje/groep/[groupCode]/mijn/page.tsx')

    expect(standalonePage).not.toContain('productidentiteit')
    expect(standalonePage).not.toContain('veilige fallback')
    expect(participantPage).not.toContain('no-login hersteltoegang')
    expect(participantPage).not.toContain('geldige geheime verdeling opgeslagen')
  })
})
