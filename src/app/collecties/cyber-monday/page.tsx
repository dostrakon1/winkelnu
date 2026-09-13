import type { Metadata } from 'next'
import { CyberMondayPage } from '@/components/storefront/cyber-monday-page'
import { getCommerceEventCampaignByKind } from '@/content/commerce-event-campaigns'
import { getAmsterdamDateKey } from '@/content/seasonal-campaigns'
import styles from './cyber-monday-theme.module.css'

export const metadata: Metadata = {
  title: 'Cyber Monday 2026 — slim online vergelijken | Winkelnu',
  description: 'Cyber Monday bij Winkelnu: vergelijk elektronica, kantoor, wonen en andere online deals met praktische keuzehulp en zonder nepdeals.',
  alternates: { canonical: '/collecties/cyber-monday' },
  openGraph: {
    title: 'Cyber Monday 2026 — digitale finale | Winkelnu.nl',
    description: 'De digitale finale van het dealweekend — met rustige vergelijking, dealchecks en keuzehulp van Winkelnu.',
    url: '/collecties/cyber-monday',
  },
}

export default function CyberMondayCollectionPage() {
  const year = Number(getAmsterdamDateKey().slice(0, 4))
  const campaign = getCommerceEventCampaignByKind('cyber-monday', year)
  if (!campaign) return null

  return (
    <div className={styles.theme}>
      <CyberMondayPage campaign={campaign} />
    </div>
  )
}
