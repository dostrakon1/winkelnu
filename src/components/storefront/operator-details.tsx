import Link from 'next/link'
import { operator } from '@/content/operator'

export function OperatorDetails() {
  return (
    <div className="mt-4 space-y-3 text-sm leading-7">
      <p>
        <span className="font-semibold">Akflow</span> · Eenmanszaak · KVK {operator.chamberOfCommerce}
      </p>
      <p>
        Voor vragen over Winkelnu kun je mailen naar{' '}
        <a className="font-semibold text-[var(--wn-petrol)] underline underline-offset-4" href={`mailto:${operator.email}`}>{operator.email}</a>.
      </p>
      <details className="rounded-[var(--wn-radius-lg)] border border-[var(--wn-border)] bg-white px-4 py-3">
        <summary className="cursor-pointer font-semibold text-[var(--wn-petrol)]">Juridische en contactgegevens</summary>
        <dl className="mt-4 space-y-3 border-t border-[var(--wn-border)] pt-4">
          <div><dt className="font-semibold">Juridische naam</dt><dd>{operator.legalName}</dd></div>
          <div><dt className="font-semibold">Btw-identificatienummer</dt><dd>{operator.vatId}</dd></div>
          <div><dt className="font-semibold">Correspondentieadres</dt><dd>{operator.correspondenceAddress}</dd></div>
        </dl>
        <p className="wn-body-muted mt-4 text-sm">Dit is een correspondentieadres, geen bezoekadres.</p>
      </details>
      <p className="wn-body-muted text-sm">Meer informatie over de onderneming vind je bij <Link href="https://www.akflow.nl/" className="font-semibold text-[var(--wn-petrol)] underline underline-offset-4">Akflow</Link>.</p>
    </div>
  )
}
