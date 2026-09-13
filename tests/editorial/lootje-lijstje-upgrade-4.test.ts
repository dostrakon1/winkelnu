import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

describe('Lootje & Lijstje Upgrade 4 wishlist UX', () => {
  it('uses the premium gifting shell for editable and shared wishlists', () => {
    const editor = source('src/app/lootje-lijstje/lijstje/[shareCode]/bewerken/page.tsx')
    const shared = source('src/app/lootje-lijstje/lijstje/[shareCode]/page.tsx')

    expect(editor).toContain('gift-wishlist-hero')
    expect(editor).toContain('gift-wishlist-nav')
    expect(editor).not.toContain("@/components/storefront/winkelnu-header")
    expect(editor).not.toContain("@/components/storefront/winkelnu-footer")

    expect(shared).toContain('gift-shared-list-hero')
    expect(shared).toContain('gift-wish-grid-viewer')
    expect(shared).not.toContain("@/components/storefront/winkelnu-header")
    expect(shared).not.toContain("@/components/storefront/winkelnu-footer")
  })

  it('keeps Winkelnu products and free wishes as two clear add paths', () => {
    const picker = source('src/components/gifting/gift-product-picker.tsx')
    const editor = source('src/components/gifting/gift-list-item-editor.tsx')

    expect(picker).toContain('id="zoeken"')
    expect(picker).toContain('+ Zet op mijn lijstje')
    expect(editor).toContain('id="eigen-wens"')
    expect(editor).toContain('+ Voeg wens toe')
  })

  it('presents wishes as reusable premium cards without changing item actions', () => {
    const card = source('src/components/gifting/gift-list-item-card.tsx')

    expect(card).toContain('gift-wish-card')
    expect(card).toContain('updateProductNoteAction')
    expect(card).toContain('deleteAction')
    expect(card).toContain('Bekijk op Winkelnu')
  })

  it('keeps recipient reservation state private and integrated with gift selection', () => {
    const recipient = source('src/components/gifting/gift-recipient-list.tsx')

    expect(recipient).toContain('gift-recipient-wish')
    expect(recipient).toContain('Alleen jij ziet deze markering.')
    expect(recipient).toContain("name=\"reserved\"")
    expect(recipient).toContain('Ik regel deze')
  })

  it('loads the dedicated wishlist stylesheet from the gifting layout', () => {
    const layout = source('src/app/lootje-lijstje/layout.tsx')
    expect(layout).toContain("import './premium-wishlist.css'")
  })
})
