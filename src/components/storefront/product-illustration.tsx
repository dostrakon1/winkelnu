import type { ProductVisualKind } from '@/domain/catalog/types'

type ProductIllustrationProps = {
  kind: ProductVisualKind
}

function ProductShape({ kind }: ProductIllustrationProps) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (kind) {
    case 'laptop':
      return <><rect x="72" y="52" width="176" height="116" rx="10" {...common} /><path d="M47 190h226l-18 20H65z" {...common} /></>
    case 'headphones':
      return <><path d="M82 137v-20a78 78 0 0 1 156 0v20" {...common} /><rect x="62" y="128" width="38" height="72" rx="18" {...common} /><rect x="220" y="128" width="38" height="72" rx="18" {...common} /></>
    case 'tablet':
      return <><rect x="92" y="34" width="136" height="186" rx="16" {...common} /><circle cx="160" cy="197" r="4" fill="currentColor" /></>
    case 'mouse':
      return <><path d="M110 196c-25-26-31-86-8-123 13-22 33-32 58-32s45 10 58 32c23 37 17 97-8 123-14 14-31 21-50 21s-36-7-50-21Z" {...common} /><path d="M160 42v54" {...common} /><rect x="149" y="63" width="22" height="34" rx="11" {...common} /></>
    case 'stick-vacuum':
      return <><rect x="139" y="35" width="42" height="74" rx="16" {...common} /><path d="M160 109v72" {...common} /><path d="M116 198h88l14 20H102z" {...common} /></>
    case 'canister-vacuum':
      return <><rect x="72" y="126" width="105" height="70" rx="30" {...common} /><circle cx="97" cy="199" r="10" {...common} /><circle cx="157" cy="199" r="10" {...common} /><path d="M164 139c17-58 83-55 82 5 0 27-18 41-39 41" {...common} /><path d="M205 185h54" {...common} /></>
    case 'smart-lighting':
      return <><path d="M92 90a37 37 0 1 1 48 36v27H116v-27A37 37 0 0 1 92 90Z" {...common} /><path d="M180 90a37 37 0 1 1 48 36v27h-24v-27a37 37 0 0 1-24-36Z" {...common} /><path d="M112 174h32M200 174h32" {...common} /></>
    case 'washing-machine':
      return <><rect x="86" y="35" width="148" height="184" rx="12" {...common} /><circle cx="160" cy="139" r="47" {...common} /><circle cx="160" cy="139" r="31" {...common} /><path d="M106 61h53M203 62h7" {...common} /></>
    case 'airfryer':
      return <><path d="M102 43h116l14 45-9 126H97L88 88z" {...common} /><rect x="111" y="110" width="98" height="72" rx="12" {...common} /><path d="M137 143h46M135 77h50" {...common} /></>
    case 'coffee-machine':
      return <><rect x="90" y="41" width="140" height="161" rx="14" {...common} /><rect x="110" y="63" width="100" height="34" rx="8" {...common} /><path d="M131 113h58M160 113v33" {...common} /><path d="M129 181h62" {...common} /><path d="M139 146h42v31h-42z" {...common} /></>
    case 'dual-airfryer':
      return <><rect x="62" y="56" width="196" height="151" rx="18" {...common} /><rect x="78" y="107" width="78" height="78" rx="10" {...common} /><rect x="164" y="107" width="78" height="78" rx="10" {...common} /><path d="M101 145h32M187 145h32M93 80h134" {...common} /></>
    case 'stand-mixer':
      return <><path d="M92 83c0-28 22-50 50-50h60v58h-83c-15 0-27 12-27 27v13" {...common} /><path d="M182 91v48" {...common} /><path d="M105 145h110c0 46-22 69-55 69s-55-23-55-69Z" {...common} /><path d="M76 218h168" {...common} /></>
    case 'toothbrush':
      return <><rect x="143" y="77" width="34" height="142" rx="17" {...common} /><path d="M160 77V43" {...common} /><path d="M145 42h30" {...common} /><path d="M148 31v20M156 29v22M164 29v22M172 31v20" {...common} /></>
    case 'shaver':
      return <><path d="M126 91h68l-8 126h-52z" {...common} /><circle cx="133" cy="65" r="24" {...common} /><circle cx="160" cy="54" r="24" {...common} /><circle cx="187" cy="65" r="24" {...common} /></>
    case 'epilator':
      return <><path d="M125 84h70l-12 134h-46z" {...common} /><rect x="120" y="42" width="80" height="47" rx="18" {...common} /><path d="M138 57v18M153 55v22M168 55v22M183 57v18" {...common} /></>
    case 'watch':
      return <><path d="M139 32h42l8 48h-58zM131 160h58l-8 55h-42z" {...common} /><rect x="111" y="72" width="98" height="98" rx="32" {...common} /><circle cx="160" cy="121" r="28" {...common} /><path d="M160 121v-18M160 121l17 10" {...common} /></>
    case 'fitness-band':
      return <><path d="M145 30h30l11 65h-52zM134 148h52l-11 68h-30z" {...common} /><rect x="122" y="84" width="76" height="76" rx="28" {...common} /><circle cx="160" cy="122" r="9" fill="currentColor" /></>
    case 'bottle':
      return <><path d="M137 38h46v32l14 20v117c0 9-8 17-17 17h-40c-9 0-17-8-17-17V90l14-20z" {...common} /><path d="M136 64h48M123 117h74" {...common} /></>
    case 'tent':
      return <><path d="M42 202 160 48l118 154Z" {...common} /><path d="m160 48 48 154M160 48l-48 154M127 202l33-72 33 72" {...common} /></>
    case 'mower':
      return <><path d="M111 166 76 81h58l37 85" {...common} /><path d="M75 81 52 56" {...common} /><rect x="109" y="156" width="121" height="43" rx="17" {...common} /><circle cx="132" cy="202" r="14" {...common} /><circle cx="207" cy="202" r="14" {...common} /></>
    case 'pressure-washer':
      return <><rect x="95" y="76" width="93" height="128" rx="18" {...common} /><circle cx="112" cy="206" r="14" {...common} /><circle cx="174" cy="206" r="14" {...common} /><path d="M132 76V42h45M188 106c46-38 72-4 47 27l-22 26" {...common} /><path d="m211 161 49-59" {...common} /></>
    case 'drill':
      return <><path d="M75 80h134c17 0 30 13 30 30s-13 30-30 30h-70l-22-18H75z" {...common} /><path d="M153 140v73h-49l14-73" {...common} /><path d="M239 98h39v24h-39M75 93H42v34h33" {...common} /></>
    case 'robot-mower':
      return <><path d="M80 151c0-54 35-93 80-93s80 39 80 93v34H80z" {...common} /><circle cx="107" cy="188" r="13" {...common} /><circle cx="213" cy="188" r="13" {...common} /><path d="M126 102h68M160 58V39" {...common} /></>
  }
}

export function ProductIllustration({ kind }: ProductIllustrationProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#fffaf1_0%,#e7f0eb_100%)] px-5 py-7 text-[var(--wn-petrol)]">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[color:rgba(233,120,61,0.10)]" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-[color:rgba(18,59,58,0.06)]" aria-hidden="true" />
      <span className="absolute left-3 top-3 rounded-full border border-[color:rgba(18,59,58,0.10)] bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--wn-text-muted)]">Illustratie</span>
      <svg viewBox="0 0 320 240" aria-hidden="true" className="relative h-full max-h-64 w-full max-w-sm drop-shadow-sm">
        <ProductShape kind={kind} />
      </svg>
    </div>
  )
}
