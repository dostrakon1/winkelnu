import { NextResponse } from 'next/server'
import {
  buildSearchFeedbackRow,
  parseSearchFeedbackInput,
  SEARCH_FEEDBACK_RETENTION_DAYS,
} from '@/application/search/search-feedback'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MAX_BODY_LENGTH = 4096

export async function POST(request: Request) {
  const raw = await request.text()
  if (!raw || raw.length > MAX_BODY_LENGTH) {
    return NextResponse.json({ error: 'Invalid feedback payload.' }, { status: raw.length > MAX_BODY_LENGTH ? 413 : 400 })
  }

  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const input = parseSearchFeedbackInput(parsedJson)
  if (!input) return NextResponse.json({ error: 'Invalid feedback payload.' }, { status: 400 })

  const row = buildSearchFeedbackRow(input)
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.from('search_feedback_events').insert(row)

  if (error) {
    console.error('Failed to record search feedback event', { code: error.code })
    return new NextResponse(null, { status: 503, headers: { 'cache-control': 'no-store' } })
  }

  const cutoff = new Date(Date.now() - SEARCH_FEEDBACK_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const { error: cleanupError } = await supabase
    .from('search_feedback_events')
    .delete()
    .lt('created_at', cutoff)

  if (cleanupError) console.error('Failed to enforce search feedback retention', { code: cleanupError.code })

  return new NextResponse(null, { status: 204, headers: { 'cache-control': 'no-store' } })
}
