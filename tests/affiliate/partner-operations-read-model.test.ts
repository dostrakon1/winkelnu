import { describe, expect, it } from 'vitest'

import {
  PartnerOperationsReadService,
  type PartnerOperationsReadRepository,
} from '@/application/affiliate/partner-operations-read-model'

describe('PartnerOperationsReadService', () => {
  it('uses the injected clock and repository', async () => {
    let receivedNow = ''
    const repository: PartnerOperationsReadRepository = {
      async readPartnerOperations(now) {
        receivedNow = now
        return {
          generatedAt: now,
          integrations: [{
            integrationId: 'integration:daisycon',
            merchantId: 'merchant:example',
            merchantName: 'Example',
            integrationKind: 'network',
            integrationStatus: 'active',
            networkName: 'Daisycon',
            hasSecretReference: true,
            feeds: [],
          }],
        }
      },
    }

    const service = new PartnerOperationsReadService(repository, () => '2026-09-03T10:00:00.000Z')
    const result = await service.read()

    expect(receivedNow).toBe('2026-09-03T10:00:00.000Z')
    expect(result.integrations).toHaveLength(1)
    expect(result.integrations[0].networkName).toBe('Daisycon')
  })
})
