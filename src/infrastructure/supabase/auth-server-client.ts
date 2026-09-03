import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function requireAuthEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required Supabase Auth environment variable: ${name}`)
  return value
}

export async function createSupabaseAuthServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    requireAuthEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireAuthEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Server Components cannot always write cookies; proxy.ts owns refresh persistence.
          }
        },
      },
    },
  )
}
