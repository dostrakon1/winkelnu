import 'server-only'

import { redirect } from 'next/navigation'

import { isOperatorEmailAllowed, parseOperatorEmails } from '@/application/auth/operator-access'
import { createSupabaseAuthServerClient } from '@/infrastructure/supabase/auth-server-client'

export type OperatorIdentity = {
  id: string
  email: string
}

export async function requireOperatorSession(): Promise<OperatorIdentity> {
  const supabase = await createSupabaseAuthServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) redirect('/intern/login')

  const allowlist = parseOperatorEmails(process.env.WINKELNU_OPERATOR_EMAILS)
  if (!isOperatorEmailAllowed(data.user.email, allowlist)) redirect('/intern/login?error=not-authorized')

  return {
    id: data.user.id,
    email: data.user.email!,
  }
}
