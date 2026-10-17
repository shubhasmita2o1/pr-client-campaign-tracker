export type TranscriptSource = 'read_ai' | 'manual'
export type SegmentSentiment = 'positive' | 'neutral' | 'urgent'

export interface TranscriptSegment {
  id: string
  speaker: string
  speakerAvatar?: string
  speakerRole: string
  isClient: boolean
  timestamp: string // e.g. "04:12"
  text: string
  sentiment?: SegmentSentiment
}

export interface TranscriptPart {
  id: string
  partNumber: number
  title: string
  duration: string // e.g. "18 mins"
  segments: TranscriptSegment[]
}

export interface TranscriptActionItem {
  id: string
  task: string
  assignee: string
  completed: boolean
}

export interface Transcript {
  id: string
  meetingId?: string
  meetingTitle?: string
  clientId: string
  clientName: string
  title: string
  date: string // ISO date
  totalDuration: string // e.g. "45 mins"
  participants: string[]
  parts: TranscriptPart[]
  keyTakeaways: string[]
  actionItems: TranscriptActionItem[]
  hasAttachment?: boolean
  source?: TranscriptSource
  externalId?: string
}

export interface TranscriptFilters {
  search?: string
  clientId?: string | 'all'
  source?: TranscriptSource | 'all'
  startDate?: string
  endDate?: string
  hasAttachment?: boolean | 'all'
}
