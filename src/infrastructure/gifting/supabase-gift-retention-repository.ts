import 'server-only'

import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

export class SupabaseGiftRetentionRepository {
  async refreshGroup(groupId: string): Promise<string> {
    const db = createSupabaseServerClient()
    const { data, error } = await db.rpc('refresh_gift_group_retention', { p_group_id: groupId })
    if (error || typeof data !== 'string') {
      throw new Error(`Unable to refresh gift group retention: ${error?.message ?? 'missing expiry'}`)
    }
    return data
  }
}
