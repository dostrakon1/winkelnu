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
      className={`flex gap-3 rounded-[var(--wn-radius-xl)] border border-[color:rgba(18,59,58,0.14)] bg-white p-2 shadow-[var(--wn-shadow-lg)] ${className}`.trim()}
    >
      <input
        type="search"
        name={name}
        defaultValue={defaultValue}
        aria-label={label}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-[var(--wn-radius-md)] bg-transparent px-4 py-3.5 text-sm text-[var(--wn-ink)] outline-none placeholder:text-[color:rgba(30,36,35,0.45)]"
      />
      <WinkelnuButton type="submit" className="rounded-[var(--wn-radius-md)] px-7">
        {buttonLabel}
      </WinkelnuButton>
    </form>
  )
}
