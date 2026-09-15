import 'server-only'

import type { MeasurementRecorder } from '@/application/measurement/ports'
import type { MeasurementEventRecord } from '@/application/measurement/measurement-core'
import { createSupabaseServerClient } from '@/infrastructure/supabase/server-client'

export class SupabaseMeasurementRecorder implements MeasurementRecorder {
  private readonly db = createSupabaseServerClient()

  async record(event: MeasurementEventRecord): Promise<void> {
    const { error } = await this.db.from('measurement_events').upsert({
      external_key: event.eventId,
      event_name: event.eventName,
      event_version: event.eventVersion,
      event_group: event.eventGroup,
      source_path: event.sourcePath,
      target_type: event.targetType,
      target_key: event.targetKey,
      placement: event.placement,
      properties: event.properties,
      ingestion_source: event.ingestionSource,
      occurred_at: event.occurredAt,
    }, {
      onConflict: 'external_key',
      ignoreDuplicates: true,
    })

    if (error) throw new Error(`Record measurement event: ${error.message}`)
  }
}
