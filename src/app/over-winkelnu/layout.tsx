import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/over-winkelnu' },
}

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
