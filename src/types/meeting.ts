export type TranscriptStatus = 'has_transcript' | 'pending' | 'none'

export interface MeetingAttendee {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  isClient?: boolean
}

export type MeetingType = 
  | 'Weekly Sync' 
  | 'Strategy & Launch' 
  | 'Media Training' 
  | 'Crisis Advisory' 
  | 'Executive Onboarding' 
  | 'Quarterly Review'

export interface Meeting {
  id: string
  clientId: string
  clientName: string
  title: string
  date: string // ISO string
  durationMinutes: number
  type: MeetingType
  attendees: MeetingAttendee[]
  transcriptStatus: TranscriptStatus
  transcriptId?: string
  notes?: string
  location: string
  agenda?: string[]
  // Integration IDs matching backend
  calComBookingUid?: string
  calendlyEventId?: string
  gcalEventId?: string
}

export interface MeetingFilters {
  search?: string
  clientId?: string | 'all'
  transcriptStatus?: TranscriptStatus | 'all'
  type?: string | 'all'
  source?: 'all' | 'cal_com' | 'google_calendar' | 'manual'
  startDate?: string
  endDate?: string
}

export interface MeetingFormData {
  clientId: string
  title: string
  date: string
  durationMinutes: number
  type: MeetingType
  location: string
  agenda: string[]
  notes?: string
  attendees: Array<{
    name: string
    email: string
    role: string
    isClient: boolean
  }>
}
