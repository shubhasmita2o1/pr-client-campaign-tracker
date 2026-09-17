export interface TranscriptSegment {
  id: string
  speaker: string
  speakerAvatar?: string
  speakerRole: string
  isClient: boolean
  timestamp: string // e.g. "04:12"
  text: string
  sentiment?: 'positive' | 'neutral' | 'urgent'
}

export interface TranscriptPart {
  id: string
  partNumber: number
  title: string
  duration: string // e.g. "18 mins"
  segments: TranscriptSegment[]
}

export interface Transcript {
  id: string
  meetingId: string
  clientId: string
  clientName: string
  title: string
  date: string // ISO date
  totalDuration: string // e.g. "45 mins"
  participants: string[]
  parts: TranscriptPart[]
  keyTakeaways: string[]
  actionItems: { id: string; task: string; assignee: string; completed: boolean }[]
  hasAttachment?: boolean
}

export interface TranscriptFilters {
  search?: string
  clientId?: string | 'all'
  startDate?: string
  endDate?: string
  hasAttachment?: boolean | 'all'
}
