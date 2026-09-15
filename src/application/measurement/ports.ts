import type { MeasurementEventRecord } from './measurement-core'

export interface MeasurementRecorder {
  record(event: MeasurementEventRecord): Promise<void>
}
