import type { FeedAdapter, FeedPage } from '@/infrastructure/feeds/adapter'

const importedAt = '2026-09-03T04:00:00.000Z'

export class SyntheticFeedAdapter implements FeedAdapter {
  readonly sourceKey = 'synthetic-demo-store'

  async fetchPage(): Promise<FeedPage> {
    return {
      items: [
        {
          sourceKey: this.sourceKey,
          merchantProductId: 'DEMO-001',
          title: 'Draadloze hoofdtelefoon Pro 45',
          description: 'Draadloze over-ear hoofdtelefoon met actieve ruisonderdrukking.',
          brand: 'DemoSound',
          gtin: '8712345678901',
          merchantSku: 'DS-PRO45-BLK',
          sourceCategory: 'Elektronica > Audio > Hoofdtelefoons',
          imageUrls: [],
          price: { amount: '129.00', currency: 'EUR' },
          previousPrice: { amount: '149.00', currency: 'EUR' },
          shippingCost: { amount: '0.00', currency: 'EUR' },
          availability: 'in_stock',
          productUrl: 'https://example.invalid/products/demo-001',
          affiliateUrl: 'https://example.invalid/affiliate/demo-001',
          sourceUpdatedAt: importedAt,
          importedAt,
        },
        {
          sourceKey: this.sourceKey,
          merchantProductId: 'DEMO-002',
          title: 'Slimme stekker Mini 2-pack',
          description: 'Compacte slimme stekkers voor eenvoudige automatisering in huis.',
          brand: 'DemoHome',
          gtin: '8712345678902',
          merchantSku: 'DH-MINI-2P',
          sourceCategory: 'Wonen > Smart home',
          imageUrls: [],
          price: { amount: '24.95', currency: 'EUR' },
          shippingCost: { amount: '3.95', currency: 'EUR' },
          availability: 'in_stock',
          productUrl: 'https://example.invalid/products/demo-002',
          affiliateUrl: 'https://example.invalid/affiliate/demo-002',
          sourceUpdatedAt: importedAt,
          importedAt,
        },
        {
          sourceKey: this.sourceKey,
          merchantProductId: 'DEMO-003',
          title: 'RVS drinkfles 750 ml',
          description: 'Herbruikbare dubbelwandige drinkfles voor onderweg.',
          brand: 'DemoLife',
          gtin: '8712345678903',
          merchantSku: 'DL-BOTTLE-750',
          sourceCategory: 'Sport & Outdoor > Drinkflessen',
          imageUrls: [],
          price: { amount: '19.95', currency: 'EUR' },
          shippingCost: { amount: '3.95', currency: 'EUR' },
          availability: 'in_stock',
          productUrl: 'https://example.invalid/products/demo-003',
          affiliateUrl: 'https://example.invalid/affiliate/demo-003',
          sourceUpdatedAt: importedAt,
          importedAt,
        },
      ],
    }
  }
}
