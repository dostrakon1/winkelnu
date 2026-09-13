import { afterEach, describe, expect, it } from 'vitest'
import sitemap from '../../src/app/sitemap'

const originalPersistence = process.env.CATALOG_PERSISTENCE
const originalGiftingEnabled = process.env.WINKELNU_GIFTING_ENABLED
const originalGiftSecret = process.env.WINKELNU_GIFT_SESSION_SECRET

afterEach(() => {
  if (originalPersistence === undefined) delete process.env.CATALOG_PERSISTENCE
  else process.env.CATALOG_PERSISTENCE = originalPersistence

  if (originalGiftingEnabled === undefined) delete process.env.WINKELNU_GIFTING_ENABLED
  else process.env.WINKELNU_GIFTING_ENABLED = originalGiftingEnabled

  if (originalGiftSecret === undefined) delete process.env.WINKELNU_GIFT_SESSION_SECRET
  else process.env.WINKELNU_GIFT_SESSION_SECRET = originalGiftSecret
})

describe('public sitemap', () => {
  it('keeps the public Lootje & Lijstje landing page discoverable when gifting mutations are release-gated', async () => {
    process.env.CATALOG_PERSISTENCE = 'memory'
    delete process.env.WINKELNU_GIFTING_ENABLED
    delete process.env.WINKELNU_GIFT_SESSION_SECRET

    const entries = await sitemap()

    expect(entries).toContainEqual(
      expect.objectContaining({
        url: expect.stringMatching(/\/lootje-lijstje$/),
        priority: 0.8,
      }),
    )
  })
})
