export type CampaignStatus = 'draft' | 'active' | 'completed' | 'paused'

export interface CampaignMetricRow {
  id: string
  channel: string
  pitched: number
  impressions: number
  opens: number
  clicks: number
  replies: number
  coverageSecured: number
  responseRate: number // decimal e.g. 0.24 = 24%
}

export interface ExtractedMetricResult {
  impressions?: number
  pitched?: number
  opens?: number
  clicks?: number
  replies?: number
  coverageSecured?: number
  confidenceScore: number // 0 - 100
  notes: string
  detectedChannel?: string
}

export interface CampaignScreenshot {
  id: string
  fileName: string
  thumbnailUrl: string
  uploadedAt: string
  fileSize: string
  extractedMetrics?: ExtractedMetricResult
}

export interface Campaign {
  id: string
  title: string
  clientId?: string
  clientName?: string
  status: CampaignStatus
  type: string
  startDate: string
  endDate: string
  owner: string
  targetOutlets: string[]
  copyText: string
  metrics: CampaignMetricRow[]
  screenshots: CampaignScreenshot[]
  tags: string[]
}

export interface CampaignFilters {
  search?: string
  status?: CampaignStatus | 'all'
  clientId?: string | 'all'
  type?: string | 'all'
}
