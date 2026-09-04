type ComparisonSignalsProps = {
  className?: string
  compact?: boolean
}

const signals = [
  {
    title: 'Prijs met context',
    description: 'Winkelnu telt bekende verzendkosten mee. Zijn ze niet bekend, dan zeggen we dat erbij.',
  },
  {
    title: 'Actuele winkelstatus',
    description: 'Beschikbaarheid en aanbiedingen komen uit aangesloten productfeeds en kunnen tussentijds wijzigen.',
  },
  {
    title: 'Je koopt bij de winkel',
    description: 'Winkelnu vergelijkt. Betaling, levering, retour en garantie lopen via de gekozen webwinkel.',
  },
]

export function ComparisonSignals({ className = '', compact = false }: ComparisonSignalsProps) {
  return (
    <div className={`grid gap-3 ${compact ? '' : 'sm:grid-cols-3'} ${className}`.trim()}>
      {signals.map((signal, index) => (
        <div
          key={signal.title}
          className="rounded-[var(--wn-radius-lg)] border border-[color:rgba(18,59,58,0.10)] bg-white/72 p-4"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--wn-petrol-soft)] text-xs font-bold text-[var(--wn-petrol)]"
            >
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--wn-ink)]">{signal.title}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--wn-text-muted)]">{signal.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
