import 'server-only'

import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

export class SupabaseGiftDeletionRepository {
  async deleteStandaloneList(listId: string): Promise<boolean> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_lists')
      .delete()
      .eq('id', listId)
      .is('owner_token_hash', null, { foreignTable: undefined })
      .select('id')
      .maybeSingle()

    if (error) throw new Error(`Unable to delete standalone gift list: ${error.message}`)
    return Boolean(data)
  }

  async deleteStandaloneListById(listId: string): Promise<boolean> {
    const db = createSupabaseServerClient()
    const { data, error } = await db
      .from('gift_lists')
      .delete()
      .eq('id', listId)
      .not('owner_token_hash', 'is', null)
      .select('id')
      .maybeSingle()

    if (error) throw new Error(`Unable to delete standalone gift list: ${error.message}`)
    return Boolean(data)
  }

  async deleteGroup(groupId: string): Promise<boolean> {
    const db = createSupabaseServerClient()
    const { data, error } = await db.rpc('delete_gift_group_with_lists', { p_group_id: groupId })
    if (error) throw new Error(`Unable to delete gift group: ${error.message}`)
    return data === true
  }
}
