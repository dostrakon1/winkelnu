import { operator } from '@/content/operator'

export function OperatorDetails() {
  const rows = [
    ['Handelsnaam', operator.tradeName],
    ['Juridische naam', operator.legalName],
    ['Rechtsvorm', operator.legalForm],
    ['KVK-nummer', operator.chamberOfCommerce],
    ['Btw-identificatienummer', operator.vatId],
    ['Correspondentieadres', operator.correspondenceAddress],
  ]

  return (
    <dl className="mt-5 divide-y divide-[var(--wn-border)] rounded-[var(--wn-radius-xl)] border border-[var(--wn-border)] bg-white px-5 sm:px-6">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
          <dt className="font-semibold">{label}</dt>
          <dd className="min-w-0 break-words">{value}</dd>
        </div>
      ))}
      <div className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
        <dt className="font-semibold">E-mailadres</dt>
        <dd className="min-w-0 break-words"><a className="font-semibold text-[var(--wn-petrol)] underline underline-offset-4" href={`mailto:${operator.email}`}>{operator.email}</a></dd>
      </div>
    </dl>
  )
}
