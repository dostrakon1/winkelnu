import { ImageResponse } from 'next/og'

export const alt = 'Winkelnu.nl — Ontdek. Vergelijk. Kies je winkel.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg,#F7F2E8 0%,#EEF2EC 62%,#DDE9E3 100%)',
          color: '#1E2423',
          padding: '72px 84px',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: 999, right: -80, top: -90, background: 'rgba(233,120,61,.14)' }} />
        <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: 999, left: -170, bottom: -220, background: 'rgba(18,59,58,.08)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ width: 78, height: 78, borderRadius: 24, background: '#123B3A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg viewBox="0 0 40 40" width="56" height="56" fill="none">
                <path d="M7 12.5 13.2 28 20 17.3 26.8 28 33 12.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ position: 'absolute', right: 10, top: 10, width: 14, height: 14, borderRadius: 999, background: '#E9783D', border: '3px solid #123B3A' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px', color: '#0D2E2D' }}>winkelnu</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#E9783D' }}>.nl</span>
            </div>
          </div>

          <div style={{ maxWidth: 850, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 72, lineHeight: 1.02, fontWeight: 800, letterSpacing: '-3px', color: '#123B3A' }}>
              Slimmer ontdekken en vergelijken.
            </div>
            <div style={{ marginTop: 26, fontSize: 29, lineHeight: 1.35, color: 'rgba(30,36,35,.68)' }}>
              Producten en aanbiedingen van verschillende winkels overzichtelijk op één plek.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 20, fontWeight: 700, color: '#123B3A' }}>
            <span>Ontdek</span><span style={{ color: '#E9783D' }}>•</span><span>Vergelijk</span><span style={{ color: '#E9783D' }}>•</span><span>Kies je winkel</span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
