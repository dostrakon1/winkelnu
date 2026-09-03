export type OperatorRole = 'owner' | 'operator' | 'read_only'

export type OperatorPermission =
  | 'read_operations'
  | 'retry_feed'
  | 'pause_feed'
  | 'resume_feed'
  | 'activate_partner'
  | 'manage_operators'

const permissions: Record<OperatorRole, readonly OperatorPermission[]> = {
  owner: ['read_operations', 'retry_feed', 'pause_feed', 'resume_feed', 'activate_partner', 'manage_operators'],
  operator: ['read_operations', 'retry_feed', 'pause_feed', 'resume_feed'],
  read_only: ['read_operations'],
}

export type OperatorRoleAssignment = {
  email: string
  role: OperatorRole
}

export function parseOperatorRoles(value: string | undefined): OperatorRoleAssignment[] {
  if (!value) return []
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const separator = entry.lastIndexOf(':')
      if (separator <= 0) throw new Error(`Invalid operator role assignment: ${entry}`)
      const email = entry.slice(0, separator).trim().toLowerCase()
      const role = entry.slice(separator + 1).trim() as OperatorRole
      if (!['owner', 'operator', 'read_only'].includes(role)) throw new Error(`Invalid operator role: ${role}`)
      return { email, role }
    })
}

export function resolveOperatorRole(email: string, assignments: OperatorRoleAssignment[]): OperatorRole | null {
  return assignments.find((assignment) => assignment.email === email.trim().toLowerCase())?.role ?? null
}

export function operatorCan(role: OperatorRole, permission: OperatorPermission): boolean {
  return permissions[role].includes(permission)
}
