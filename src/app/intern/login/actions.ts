'use server'

import { redirect } from 'next/navigation'

import { isOperatorEmailAllowed, parseOperatorEmails } from '@/application/auth/operator-access'
import { createSupabaseAuthServerClient } from '@/infrastructure/supabase/auth-server-client'

export async function signInOperator(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) redirect('/intern/login?error=missing-fields')

  const allowlist = parseOperatorEmails(process.env.WINKELNU_OPERATOR_EMAILS)
  const allowed = isOperatorEmailAllowed(email, allowlist)

  if (!allowed) {
    console.warn('[operator-login] denied-before-auth', {
      reason: 'email-not-allowlisted',
      allowlistCount: allowlist.length,
    })
    redirect('/intern/login?error=invalid-credentials')
  }

  const supabase = await createSupabaseAuthServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.warn('[operator-login] supabase-auth-failed', {
      name: error.name,
      status: error.status,
      code: 'code' in error ? error.code : undefined,
    })
  }

  if (error || !data.user || !isOperatorEmailAllowed(data.user.email, allowlist)) {
    await supabase.auth.signOut()
    redirect('/intern/login?error=invalid-credentials')
  }

  console.info('[operator-login] success', {
    allowlistCount: allowlist.length,
  })

  redirect('/intern/operations')
}

export async function signOutOperator() {
  const supabase = await createSupabaseAuthServerClient()
  await supabase.auth.signOut()
  redirect('/intern/login')
}
