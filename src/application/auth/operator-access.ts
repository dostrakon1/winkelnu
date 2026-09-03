export function parseOperatorEmails(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isOperatorEmailAllowed(email: string | undefined, allowlist: string[]): boolean {
  if (!email) return false
  return allowlist.includes(email.trim().toLowerCase())
}
