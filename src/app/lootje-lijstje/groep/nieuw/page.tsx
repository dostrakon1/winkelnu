import type { Metadata } from 'next'
import Link from 'next/link'
import { createGiftGroupAction } from '@/app/lootje-lijstje/groep/actions'
import { GiftGroupForm } from '@/components/gifting/gift-group-form'
import { WinkelnuFooter } from '@/components/storefront/winkelnu-footer'
import { WinkelnuHeader } from '@/components/storefront/winkelnu-header'

export const metadata: Metadata = {
  title: 'Lootjesgroep maken',
  description: 'Maak zonder account een groep voor Lootje & Lijstje.',
  robots: { index: false, follow: false },
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function NewGiftGroupPage({
  searchParams,
}: {
  searchParams: Promise<{ fout?: string | string[] }>
}) {
  const query = await searchParams
  const error = first(query.fout)

  return (
    <div className="min-h-screen bg-[var(--wn-cream)] text-[var(--wn-ink)]">
      <WinkelnuHeader />
      <main id="inhoud">
        <section className="border-b border-[var(--wn-border)] bg-[image:var(--wn-gradient-welcome)]">
          <div className="wn-container py-12 sm:py-16">
            <Link href="/lootje-lijstje" className="text-sm font-bold text-[var(--wn-petrol)] hover:underline">← Lootje &amp; Lijstje</Link>
            <p className="wn-eyebrow mt-8">Lootje</p>
            <h1 className="wn-heading mt-3 max-w-3xl text-4xl sm:text-5xl">Maak je groep klaar.</h1>
            <p className="wn-body-muted mt-5 max-w-2xl text-lg leading-8">Eén uitnodigingslink, maximaal 50 deelnemers en geen accounts. Iedereen krijgt straks zijn eigen lijstje binnen dezelfde groep.</p>
          </div>
        </section>

        <section className="wn-container py-10 sm:py-14">
          {error ? (
            <div role="alert" className="mx-auto mb-6 max-w-3xl rounded-xl border border-[#d9a99f] bg-[#fff3ef] p-4 text-sm font-semibold leading-6 text-[#7f2d23]">
              {error}
            </div>
          ) : null}
          <div className="mx-auto max-w-3xl">
            <GiftGroupForm action={createGiftGroupAction} />
          </div>
        </section>
      </main>
      <WinkelnuFooter />
    </div>
  )
}
