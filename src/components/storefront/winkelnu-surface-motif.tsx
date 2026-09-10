type WinkelnuSurfaceMotifProps = {
  className?: string
}

export function WinkelnuSurfaceMotif({ className = '' }: WinkelnuSurfaceMotifProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-[#f7f2e8] ${className}`}
    >
      <span className="absolute -bottom-[28%] -left-[14%] h-[72%] w-[72%] rounded-full bg-[#dcebe3]" />
      <span className="absolute -right-[12%] -top-[24%] h-[62%] w-[62%] rounded-full bg-[#f0d8c8]" />
      <span className="absolute left-[15%] top-[18%] h-16 w-16 rounded-full border border-[color:rgba(18,59,58,0.14)] bg-white/45" />
      <span className="absolute bottom-[18%] right-[18%] h-20 w-20 rounded-full border border-[color:rgba(18,59,58,0.12)] bg-white/35" />
      <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[color:rgba(18,59,58,0.62)]" />
      <span className="absolute left-1/2 top-1/2 h-px w-28 -translate-x-1/2 -translate-y-1/2 rotate-[-32deg] bg-[color:rgba(18,59,58,0.52)]" />
      <span className="absolute left-1/2 top-1/2 h-28 w-px -translate-x-1/2 -translate-y-1/2 rotate-[32deg] bg-[color:rgba(18,59,58,0.34)]" />
    </div>
  )
}
