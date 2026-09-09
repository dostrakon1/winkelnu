/** Decorative, product-neutral line artwork. No product photography or commercial claims. */
export function GuideArtwork({ slug }: { slug: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const drawing = (() => {
    switch (slug) {
      case 'laptop-kopen': return <><rect x="17" y="19" width="62" height="43" rx="3" /><path d="M12 69h72l-6-7H18zM42 65h12" /><path d="M23 25h50v31H23z" opacity=".35" /></>
      case 'hoofdtelefoon-kopen': return <><path d="M22 53V45a26 26 0 0 1 52 0v8" /><rect x="18" y="49" width="14" height="27" rx="6" /><rect x="64" y="49" width="14" height="27" rx="6" /><path d="M26 49V45a22 22 0 0 1 44 0v4" /></>
      case 'stofzuiger-kopen': return <><rect x="20" y="48" width="45" height="26" rx="12" /><circle cx="32" cy="76" r="4" /><circle cx="55" cy="76" r="4" /><path d="M49 48V35c0-8 6-14 14-14h9M72 21l8-5M72 21l8 6M65 61h9" /></>
      case 'wasmachine-kopen': return <><rect x="24" y="15" width="48" height="66" rx="5" /><path d="M24 31h48" /><circle cx="48" cy="55" r="17" /><path d="M35 55c7-7 18 7 26-1" /><circle cx="32" cy="23" r="2" /><path d="M42 23h12" /></>
      case 'koffiezetapparaat-kopen': return <><path d="M25 25h46v30H25zM30 17h36v8M48 55v9M30 72h36M30 64h36v8H30zM35 33h26M40 41h16M72 31h6v13h-6" /><path d="M40 81c-2-4-2-7 0-10M52 81c-2-4-2-7 0-10" opacity=".5" /></>
      case 'airfryer-kopen': return <><rect x="23" y="18" width="50" height="63" rx="9" /><path d="M23 52h50M36 61h24v9H36z" /><circle cx="48" cy="35" r="10" /><path d="M48 35v-6M48 35l5 3M31 76h34" /></>
      default: return <><rect x="25" y="19" width="46" height="59" rx="3" /><path d="M35 33h26M35 44h26M35 55h18M35 66h12" /></>
    }
  })()
  return <div aria-hidden="true" className="flex h-28 items-center justify-center rounded-[var(--wn-radius-lg)] bg-[var(--wn-petrol-soft)] text-[var(--wn-petrol)] sm:h-32"><svg viewBox="0 0 96 96" className="h-24 w-24 sm:h-28 sm:w-28" {...common}>{drawing}</svg></div>
}
