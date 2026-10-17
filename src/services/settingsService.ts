import { UserProfile, TeamMemberInvite } from '../types/profile'
import { IntegrationConfig } from '../types/integration'
import { mockProfiles } from '../mock/mockProfiles'
import { mockIntegrations } from '../mock/mockIntegrations'

const PROFILES_STORAGE_KEY = 'pr_tracker_team_profiles'
const INTEGRATIONS_STORAGE_KEY = 'pr_tracker_integrations'

function getInitialProfiles(): UserProfile[] {
  const stored = localStorage.getItem(PROFILES_STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // fallback
    }
  }
  return mockProfiles
}

function getInitialIntegrations(): IntegrationConfig[] {
  const stored = localStorage.getItem(INTEGRATIONS_STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // fallback
    }
  }
  return mockIntegrations
}

let profilesState: UserProfile[] = getInitialProfiles()
let integrationsState: IntegrationConfig[] = getInitialIntegrations()

function persistProfiles() {
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profilesState))
}

function persistIntegrations() {
  localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(integrationsState))
}

export const settingsService = {
  async getTeamMembers(): Promise<UserProfile[]> {
    await new Promise((res) => setTimeout(res, 120))
    return [...profilesState]
  },

  async inviteTeamMember(invite: TeamMemberInvite): Promise<UserProfile> {
    await new Promise((res) => setTimeout(res, 200))
    const newMember: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: invite.fullName,
      email: invite.email,
      role: invite.role,
      title: invite.title || 'PR Specialist',
      department: 'Client Accounts',
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    profilesState = [...profilesState, newMember]
    persistProfiles()
    return newMember
  },

  async updateMemberRole(id: string, role: 'admin' | 'member'): Promise<UserProfile> {
    await new Promise((res) => setTimeout(res, 150))
    const index = profilesState.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Member not found')
    profilesState[index] = { ...profilesState[index], role, updatedAt: new Date().toISOString() }
    persistProfiles()
    return profilesState[index]
  },

  async deleteTeamMember(id: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 150))
    profilesState = profilesState.filter((p) => p.id !== id)
    persistProfiles()
  },

  async getIntegrations(): Promise<IntegrationConfig[]> {
    await new Promise((res) => setTimeout(res, 100))
    return [...integrationsState]
  },

  async updateIntegration(id: string, data: Partial<IntegrationConfig>): Promise<IntegrationConfig> {
    await new Promise((res) => setTimeout(res, 150))
    const index = integrationsState.findIndex((i) => i.id === id)
    if (index === -1) throw new Error('Integration not found')
    integrationsState[index] = { ...integrationsState[index], ...data }
    persistIntegrations()
    return integrationsState[index]
  },

  async testIntegration(id: string): Promise<{ success: boolean; message: string }> {
    await new Promise((res) => setTimeout(res, 800))
    const target = integrationsState.find((i) => i.id === id)
    if (!target) throw new Error('Integration not found')

    if (id === 'int-gemini') {
      return { success: true, message: 'Gemini 3.6 Flash endpoint verified. Model latency: 412ms.' }
    }
    if (id === 'int-cal-com') {
      return { success: true, message: 'Cal.com webhook ping received. HMAC secret verified.' }
    }
    if (id === 'int-read-ai') {
      return { success: true, message: 'Read AI webhook active. Auto-match trigger operational.' }
    }
    if (id === 'int-google-calendar') {
      return { success: true, message: 'Google Calendar API token valid. Channel status: Syncing.' }
    }
    return { success: true, message: 'Connection verified successfully.' }
  }
}
