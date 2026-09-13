import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8')
}

describe('Lootje & Lijstje GI4 product and commercial insights', () => {
  it('reuses the canonical affiliate redirect with a privacy-safe gifting source', () => {
    const card = source('src/components/gifting/gift-list-item-card.tsx')
    const redirect = source('src/app/uit/[offerId]/route.ts')

    expect(card).toContain("encodeURIComponent('/lootje-lijstje')")
    expect(card).toContain('rel="nofollow sponsored"')
    expect(card).not.toContain('from=${encodeURIComponent(shareCode')
    expect(card).not.toContain('from=${encodeURIComponent(groupCode')
    expect(redirect).toContain("request.nextUrl.searchParams.get('from')")
  })

  it('keeps GI4 product insights behind the existing gifting insight permission', () => {
    const page = source('src/app/intern/operations/gifting/products/page.tsx')

    expect(page).toContain("requireOperatorPermission('read_gifting_insights')")
    expect(page).toContain("title: 'Lootje & Lijstje Product Insights'")
    expect(page).toContain('index: false')
    expect(page).toContain('follow: false')
  })

  it('does not introduce a second affiliate click store or person-level conversion claim', () => {
    const migration = source('supabase/migrations/0033_gifting_insights_product_commercial.sql')
    const page = source('src/app/intern/operations/gifting/products/page.tsx')

    expect(migration).toContain('from affiliate_click_events')
    expect(migration).toContain("source_path = '/lootje-lijstje'")
    expect(migration).not.toMatch(/create\s+table[\s\S]*affiliate/i)
    expect(page).toContain('geen persoonsgebonden saved→clicked-conversie')
  })

  it('rolls up anonymous product, item-type, occasion and known-price signals', () => {
    const migration = source('supabase/migrations/0033_gifting_insights_product_commercial.sql')

    expect(migration).toContain("'product_external_key'")
    expect(migration).toContain("'item_type'")
    expect(migration).toContain("'occasion'")
    expect(migration).toContain('new.price_cents_snapshot')
    expect(migration).toContain('gifting_insights_product_rankings')
    expect(migration).toContain('gifting_insights_products_by_occasion')
  })
})
