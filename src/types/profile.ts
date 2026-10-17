export type UserRole = 'admin' | 'member'

export interface UserProfile {
  id: string
  fullName: string
  email: string
  avatarUrl: string
  role: UserRole
  title?: string
  department?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface TeamMemberInvite {
  fullName: string
  email: string
  role: UserRole
  title?: string
}
