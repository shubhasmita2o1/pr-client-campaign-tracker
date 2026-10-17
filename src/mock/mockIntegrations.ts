import { IntegrationConfig } from '../types/integration'

export const mockIntegrations: IntegrationConfig[] = [
  {
    id: 'int-gemini',
    provider: 'gemini',
    name: 'Google Gemini Vision AI',
    description: 'Autonomous OCR and metrics extraction from campaign screenshots via gemini-3.6-flash Edge Function.',
    icon: 'Sparkles',
    isActive: true,
    status: 'connected',
    lastSyncedAt: '2026-09-17T09:45:00Z',
    settings: {
      model: 'gemini-3.6-flash',
      apiKeyMasked: 'AIzaSy************************8v31',
      autoSaveToCampaign: true,
      minConfidenceThreshold: 75
    }
  },
  {
    id: 'int-cal-com',
    provider: 'cal_com',
    name: 'Cal.com Webhook Sync',
    description: 'Instant meeting creation and attendee ingestion upon client scheduling via /functions/v1/cal-com-webhook.',
    icon: 'CalendarCheck',
    isActive: true,
    status: 'connected',
    lastSyncedAt: '2026-09-16T18:20:00Z',
    webhookUrl: 'https://vymhwbqvxuqwopzq.supabase.co/functions/v1/cal-com-webhook',
    settings: {
      secretConfigured: true,
      autoCreateClients: false,
      defaultMeetingDuration: 45
    }
  },
  {
    id: 'int-read-ai',
    provider: 'read_ai',
    name: 'Read AI Meeting Intelligence',
    description: 'Automated multi-part call transcript ingestion, sentiment detection, and meeting auto-matching.',
    icon: 'Bot',
    isActive: true,
    status: 'connected',
    lastSyncedAt: '2026-09-16T17:15:00Z',
    webhookUrl: 'https://vymhwbqvxuqwopzq.supabase.co/functions/v1/read-ai-webhook',
    settings: {
      autoMatchToMeetings: true,
      secretConfigured: true,
      generateActionItems: true,
      segmentSentimentAnalysis: true
    }
  },
  {
    id: 'int-google-calendar',
    provider: 'google_calendar',
    name: 'Google Calendar Two-Way Sync',
    description: 'Bi-directional calendar sync with agency team schedules via push notification channel token.',
    icon: 'Calendar',
    isActive: true,
    status: 'connected',
    lastSyncedAt: '2026-09-17T11:00:00Z',
    webhookUrl: 'https://vymhwbqvxuqwopzq.supabase.co/functions/v1/google-calendar-webhook',
    settings: {
      calendarId: 'primary (team-calendar@prestige-pr.com)',
      channelTokenActive: true,
      syncIntervalMinutes: 15
    }
  }
]
