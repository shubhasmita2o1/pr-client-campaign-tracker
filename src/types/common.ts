import { Client } from './client'
import { Meeting } from './meeting'
import { Transcript } from './transcript'
import { Campaign } from './campaign'

export interface GlobalSearchResult {
  clients: Client[]
  meetings: Meeting[]
  transcripts: {
    transcript: Transcript
    matchingSegmentText?: string
    matchingPartNumber?: number
  }[]
  campaigns: Campaign[]
}

export interface QuickStats {
  activeClientsCount: number
  activeClientsGrowth: number
  upcomingMeetingsCount: number
  campaignsThisMonthCount: number
  pendingTranscriptsCount: number
  totalRetainerMRR: number
  totalCoverageSecured: number
}
