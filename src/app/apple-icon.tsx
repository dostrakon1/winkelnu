import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 42,
          background: '#123B3A',
          color: '#fff',
          position: 'relative',
        }}
      >
        <svg viewBox="0 0 40 40" width="128" height="128" fill="none">
          <path d="M7 12.5 13.2 28 20 17.3 26.8 28 33 12.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ position: 'absolute', right: 27, top: 27, width: 29, height: 29, borderRadius: 999, background: '#E9783D', border: '6px solid #123B3A' }} />
      </div>
    ),
    size,
  )
}
