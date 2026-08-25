export const userRoleEnum = ['subscriber', 'super_admin'] as const
export type UserRole = (typeof userRoleEnum)[number]
