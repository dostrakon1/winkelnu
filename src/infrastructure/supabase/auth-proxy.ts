import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function requireAuthEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required Supabase Auth environment variable: ${name}`)
  return value
}

export async function updateSupabaseAuthSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    requireAuthEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireAuthEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  await supabase.auth.getClaims()
  return response
}
