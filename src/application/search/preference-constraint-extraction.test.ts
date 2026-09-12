import { describe, expect, it } from 'vitest'
import {
  evaluatePreferenceConstraintValue,
  extractPreferenceConstraints,
} from './preference-constraint-extraction'

describe('extractPreferenceConstraints', () => {
  it('extracts qualitative laptop preferences without turning them into a total score', () => {
    const signals = extractPreferenceConstraints('lichte laptop met lange accuduur voor studie')

    expect(signals.map((signal) => signal.id)).toEqual(['lightweight', 'long-battery'])
    expect(signals.map((signal) => signal.metricKey)).toEqual(['weight', 'battery-life'])
  })

  it('extracts explicit measurable limits for weight, memory and battery life', () => {
    const signals = extractPreferenceConstraints('laptop maximaal 1,5 kg met minimaal 16 GB RAM en minstens 10 uur accuduur')

    expect(signals).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'max-weight', kind: 'maximum', metricKey: 'weight', threshold: { value: 1.5, unit: 'kg' } }),
      expect.objectContaining({ id: 'min-memory', kind: 'minimum', metricKey: 'memory', threshold: { value: 16, unit: 'gb' } }),
      expect.objectContaining({ id: 'min-battery-life', kind: 'minimum', metricKey: 'battery-life', threshold: { value: 10, unit: 'hours' } }),
    ]))
  })

  it('understands an exact drawer request for airfryers', () => {
    const signals = extractPreferenceConstraints('grote airfryer met twee lades')

    expect(signals).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'large-capacity', metricKey: 'capacity', kind: 'preference' }),
      expect.objectContaining({ id: 'exact-zones', metricKey: 'zones', kind: 'exact', threshold: { value: 2, unit: 'count' } }),
    ]))
  })

  it('recognizes compact and noise-cancelling preferences independently', () => {
    expect(extractPreferenceConstraints('compact koffieapparaat voor klein aanrecht').map((signal) => signal.id)).toContain('compact')
    expect(extractPreferenceConstraints('koptelefoon met noise cancelling').map((signal) => signal.id)).toContain('noise-cancelling')
  })
})

describe('evaluatePreferenceConstraintValue', () => {
  it('compares compatible units for weight and duration', () => {
    const [weight] = extractPreferenceConstraints('laptop maximaal 1,5 kg')
    const [battery] = extractPreferenceConstraints('laptop met minstens 10 uur accuduur')

    expect(evaluatePreferenceConstraintValue(weight, '1.240 g')).toBe('match')
    expect(evaluatePreferenceConstraintValue(weight, '1,8 kg')).toBe('miss')
    expect(evaluatePreferenceConstraintValue(battery, '12 uur')).toBe('match')
    expect(evaluatePreferenceConstraintValue(battery, '540 minuten')).toBe('miss')
  })

  it('keeps missing or unparsable product data unknown instead of failing it', () => {
    const [weight] = extractPreferenceConstraints('laptop maximaal 1,5 kg')

    expect(evaluatePreferenceConstraintValue(weight, null)).toBe('unknown')
    expect(evaluatePreferenceConstraintValue(weight, 'Niet vermeld')).toBe('unknown')
  })

  it('evaluates required capability text conservatively', () => {
    const [anc] = extractPreferenceConstraints('koptelefoon met noise cancelling')

    expect(evaluatePreferenceConstraintValue(anc, 'Adaptieve ANC')).toBe('match')
    expect(evaluatePreferenceConstraintValue(anc, 'Geen ruisonderdrukking')).toBe('miss')
  })
})
