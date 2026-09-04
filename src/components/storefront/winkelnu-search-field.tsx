import { WinkelnuButton } from './winkelnu-button'

type WinkelnuSearchFieldProps = {
  action?: string
  name?: string
  defaultValue?: string
  placeholder?: string
  label?: string
  buttonLabel?: string
  className?: string
}

export function WinkelnuSearchField({
  action = '/zoeken',
  name = 'q',
  defaultValue,
  placeholder = 'Waar ben je naar op zoek?',
  label = 'Zoek producten',
  buttonLabel = 'Zoeken',
  className = '',
}: WinkelnuSearchFieldProps) {
  return (
    <form
      action={action}
      method="get"
      className={`flex flex-col gap-2 rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.14)] bg-white p-2 shadow-[var(--wn-shadow-lg)] sm:flex-row sm:gap-3 ${className}`.trim()}
    >
      <input
        type="search"
        name={name}
        defaultValue={defaultValue}
        aria-label={label}
        placeholder={placeholder}
        className="min-h-12 min-w-0 flex-1 rounded-[var(--wn-radius-md)] bg-transparent px-4 py-3 text-base text-[var(--wn-ink)] outline-none placeholder:text-[color:rgba(30,36,35,0.45)] sm:text-sm"
      />
      <WinkelnuButton type="submit" className="w-full rounded-[var(--wn-radius-md)] px-7 sm:w-auto">
        {buttonLabel}
      </WinkelnuButton>
    </form>
  )
}
