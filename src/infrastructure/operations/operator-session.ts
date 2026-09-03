import 'server-only'

import { redirect } from 'next/navigation'

import { isOperatorEmailAllowed, parseOperatorEmails } from '@/application/auth/operator-access'
import { parseOperatorRoles, resolveOperatorRole, type OperatorRole } from '@/application/auth/operator-authorization'
import { createSupabaseAuthServerClient } from '@/infrastructure/supabase/auth-server-client'

export type OperatorIdentity = {
  id: string
  email: string
  role: OperatorRole
}

export async function requireOperatorSession(): Promise<OperatorIdentity> {
  const supabase = await createSupabaseAuthServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) redirect('/intern/login')

  const allowlist = parseOperatorEmails(process.env.WINKELNU_OPERATOR_EMAILS)
  if (!isOperatorEmailAllowed(data.user.email, allowlist)) redirect('/intern/login?error=not-authorized')

  const email = data.user.email!
  const role = resolveOperatorRole(email, parseOperatorRoles(process.env.WINKELNU_OPERATOR_ROLES)) ?? 'read_only'

  return {
    id: data.user.id,
    email,
    role,
  }
}
