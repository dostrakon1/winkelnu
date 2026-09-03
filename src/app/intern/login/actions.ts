'use server'

import { redirect } from 'next/navigation'

import { isOperatorEmailAllowed, parseOperatorEmails } from '@/application/auth/operator-access'
import { createSupabaseAuthServerClient } from '@/infrastructure/supabase/auth-server-client'

export async function signInOperator(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) redirect('/intern/login?error=missing-fields')

  const allowlist = parseOperatorEmails(process.env.WINKELNU_OPERATOR_EMAILS)
  if (!isOperatorEmailAllowed(email, allowlist)) redirect('/intern/login?error=invalid-credentials')

  const supabase = await createSupabaseAuthServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user || !isOperatorEmailAllowed(data.user.email, allowlist)) {
    await supabase.auth.signOut()
    redirect('/intern/login?error=invalid-credentials')
  }

  redirect('/intern/operations')
}

export async function signOutOperator() {
  const supabase = await createSupabaseAuthServerClient()
  await supabase.auth.signOut()
  redirect('/intern/login')
}
