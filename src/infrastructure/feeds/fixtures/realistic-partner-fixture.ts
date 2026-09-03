export type RealisticPartnerRawItem = {
  offer_id: string
  product_name?: string
  product_description?: string
  brand_name?: string
  ean?: string
  manufacturer_part_number?: string
  merchant_sku?: string
  category_path?: string
  image_url?: string
  sale_price: string
  old_price?: string
  delivery_cost?: string
  stock_state?: 'available' | 'limited' | 'unavailable'
  landing_url: string
  tracking_url: string
  changed_at?: string
}

export type RealisticPartnerRawPage = {
  records: RealisticPartnerRawItem[]
  next_cursor?: string
}

export const realisticPartnerFixturePages: Record<string, RealisticPartnerRawPage> = {
  first: {
    records: [
      {
        offer_id: 'FX-1001',
        product_name: 'Noise cancelling koptelefoon X2',
        product_description: 'Draadloze over-ear koptelefoon met actieve ruisonderdrukking.',
        brand_name: 'Northstar',
        ean: '8712345678911',
        manufacturer_part_number: 'NS-X2',
        merchant_sku: 'NS-X2-BLK',
        category_path: 'Elektronica > Audio > Hoofdtelefoons',
        image_url: 'https://cdn.example.invalid/products/fx-1001.jpg',
        sale_price: '119.95',
        old_price: '139.95',
        delivery_cost: '0.00',
        stock_state: 'available',
        landing_url: 'https://merchant.example.invalid/products/fx-1001',
        tracking_url: 'https://tracking.example.invalid/click/fx-1001',
        changed_at: '2026-09-03T04:30:00.000Z',
      },
      {
        offer_id: 'FX-1002',
        product_name: 'Slimme stekker Energy Mini',
        brand_name: 'Lumen',
        ean: '8712345678912',
        merchant_sku: 'LU-ENERGY-MINI',
        category_path: 'Wonen > Smart home',
        sale_price: '21.50',
        delivery_cost: '3.95',
        stock_state: 'limited',
        landing_url: 'https://merchant.example.invalid/products/fx-1002',
        tracking_url: 'https://tracking.example.invalid/click/fx-1002',
        changed_at: '2026-09-03T04:31:00.000Z',
      },
    ],
    next_cursor: 'page-2',
  },
  'page-2': {
    records: [
      {
        offer_id: 'FX-1003',
        product_name: 'USB-C GaN oplader 65W',
        brand_name: 'Voltcraft',
        ean: '8712345678913',
        manufacturer_part_number: 'VC-GAN65',
        category_path: 'Elektronica > Opladers',
        sale_price: '34.95',
        delivery_cost: '0.00',
        stock_state: 'available',
        landing_url: 'https://merchant.example.invalid/products/fx-1003',
        tracking_url: 'https://tracking.example.invalid/click/fx-1003',
        changed_at: '2026-09-03T04:32:00.000Z',
      },
      {
        offer_id: 'FX-BROKEN',
        sale_price: '-4.00',
        stock_state: 'available',
        landing_url: 'http://merchant.example.invalid/products/broken',
        tracking_url: 'http://tracking.example.invalid/click/broken',
      },
    ],
  },
}
