import Link from 'next/link'
import { operator } from '@/content/operator'

export function OperatorDetails() {
  return (
    <div className="mt-3 max-w-2xl space-y-3 text-sm leading-6">
      <p className="text-[var(--wn-text-muted)]">
        Winkelnu is een initiatief van{' '}
        <Link href="https://www.akflow.nl/" className="font-medium text-[var(--wn-petrol)] underline underline-offset-4 hover:text-[var(--wn-petrol-deep)]">Akflow</Link>.
      </p>
      <p>
        Heb je een vraag? We helpen je graag via{' '}
        <a className="font-medium text-[var(--wn-petrol)] underline underline-offset-4 hover:text-[var(--wn-petrol-deep)]" href={`mailto:${operator.email}`}>{operator.email}</a>.
      </p>
      <details className="group pt-1">
        <summary className="w-fit cursor-pointer rounded-sm py-1 font-medium text-[var(--wn-petrol)] underline underline-offset-4 hover:text-[var(--wn-petrol-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-petrol)]">Meer bedrijfsgegevens</summary>
        <div className="mt-3 space-y-2 border-l-2 border-[var(--wn-border)] pl-4 text-sm leading-6 text-[var(--wn-text-muted)]">
          <p><span className="font-medium text-[var(--wn-ink)]">Handelsnaam:</span> {operator.tradeName}</p>
          <p><span className="font-medium text-[var(--wn-ink)]">Juridische naam:</span> {operator.legalName}</p>
          <p><span className="font-medium text-[var(--wn-ink)]">Rechtsvorm:</span> {operator.legalForm}</p>
          <p><span className="font-medium text-[var(--wn-ink)]">KVK:</span> {operator.chamberOfCommerce}</p>
          <p><span className="font-medium text-[var(--wn-ink)]">Btw-id:</span> {operator.vatId}</p>
          <p><span className="font-medium text-[var(--wn-ink)]">Correspondentieadres:</span> {operator.correspondenceAddress}</p>
          <p>Dit is een correspondentieadres en geen bezoekadres.</p>
        </div>
      </details>
    </div>
  )
}
