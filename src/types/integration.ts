export type IntegrationProvider = 'gemini' | 'cal_com' | 'read_ai' | 'google_calendar'

export interface IntegrationConfig {
  id: string
  provider: IntegrationProvider
  name: string
  description: string
  icon: string
  isActive: boolean
  lastSyncedAt?: string
  status: 'connected' | 'not_configured' | 'error' | 'syncing'
  webhookUrl?: string
  settings: Record<string, string | boolean | number>
}
