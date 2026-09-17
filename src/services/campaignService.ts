import { Campaign, CampaignFilters, CampaignMetricRow, CampaignScreenshot } from '../types/campaign'
import { mockCampaigns } from '../data/mockCampaigns'

const STORAGE_KEY = 'pr_tracker_campaigns'

function getInitialCampaigns(): Campaign[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // fallback
    }
  }
  return mockCampaigns
}

let campaignsState: Campaign[] = getInitialCampaigns()

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaignsState))
}

export const campaignService = {
  async getCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
    await new Promise(resolve => setTimeout(resolve, 150))
    let result = [...campaignsState]

    if (!filters) return result

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase()
      result = result.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          c.clientName?.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter(c => c.status === filters.status)
    }

    if (filters.clientId && filters.clientId !== 'all') {
      result = result.filter(c => c.clientId === filters.clientId)
    }

    if (filters.type && filters.type !== 'all') {
      result = result.filter(c => c.type === filters.type)
    }

    result.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    return result
  },

  async getCampaignById(id: string): Promise<Campaign | undefined> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return campaignsState.find(c => c.id === id)
  },

  async getCampaignsByClientId(clientId: string): Promise<Campaign[]> {
    await new Promise(resolve => setTimeout(resolve, 120))
    return campaignsState.filter(c => c.clientId === clientId)
  },

  async createCampaign(data: Omit<Campaign, 'id' | 'metrics' | 'screenshots'>): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      ...data,
      metrics: [
        {
          id: `met-${Date.now()}-1`,
          channel: 'Tier-1 Target Media Pitching',
          pitched: 25,
          impressions: 120000,
          opens: 18,
          clicks: 12,
          replies: 6,
          coverageSecured: 2,
          responseRate: 0.24
        }
      ],
      screenshots: []
    }

    campaignsState = [newCampaign, ...campaignsState]
    persist()
    return newCampaign
  },

  async updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 150))
    const index = campaignsState.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Campaign not found')

    campaignsState[index] = { ...campaignsState[index], ...data }
    persist()
    return campaignsState[index]
  },

  async updateCampaignCopy(id: string, copyText: string): Promise<Campaign> {
    return this.updateCampaign(id, { copyText })
  },

  async addMetricRow(campaignId: string, row: Omit<CampaignMetricRow, 'id' | 'responseRate'>): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 150))
    const campaign = campaignsState.find(c => c.id === campaignId)
    if (!campaign) throw new Error('Campaign not found')

    const responseRate = row.pitched > 0 ? Number((row.replies / row.pitched).toFixed(3)) : 0
    const newRow: CampaignMetricRow = {
      id: `met-${Date.now()}`,
      ...row,
      responseRate
    }

    campaign.metrics = [...campaign.metrics, newRow]
    persist()
    return campaign
  },

  async deleteMetricRow(campaignId: string, rowId: string): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 150))
    const campaign = campaignsState.find(c => c.id === campaignId)
    if (!campaign) throw new Error('Campaign not found')

    campaign.metrics = campaign.metrics.filter(m => m.id !== rowId)
    persist()
    return campaign
  },

  async extractMetricsFromScreenshot(
    campaignId: string,
    fileName: string,
    thumbnailUrl: string,
    fileSize: string
  ): Promise<{ screenshot: CampaignScreenshot; campaign: Campaign }> {
    // Simulate AI parsing delay
    await new Promise(resolve => setTimeout(resolve, 1400))

    const campaign = campaignsState.find(c => c.id === campaignId)
    if (!campaign) throw new Error('Campaign not found')

    // Generate realistic simulated extraction numbers based on filename or randomized variance
    const impressions = Math.floor(Math.random() * 400000) + 250000
    const pitched = Math.floor(Math.random() * 30) + 40
    const opens = Math.floor(pitched * 0.8)
    const clicks = Math.floor(opens * 0.7)
    const replies = Math.floor(clicks * 0.5)
    const coverageSecured = Math.floor(replies * 0.4) + 2

    const screenshot: CampaignScreenshot = {
      id: `sc-${Date.now()}`,
      fileName,
      thumbnailUrl,
      uploadedAt: new Date().toISOString(),
      fileSize,
      extractedMetrics: {
        impressions,
        pitched,
        opens,
        clicks,
        replies,
        coverageSecured,
        confidenceScore: Math.floor(Math.random() * 7) + 93, // 93 - 99%
        notes: `AI vision model extracted tabular PR metrics from ${fileName} with high OCR fidelity.`,
        detectedChannel: fileName.toLowerCase().includes('cision')
          ? 'Cision Wire Analytics'
          : fileName.toLowerCase().includes('muckrack')
          ? 'Muck Rack Pitch Outreach'
          : 'Verified PR Outreach Dashboard'
      }
    }

    campaign.screenshots = [screenshot, ...campaign.screenshots]
    persist()
    return { screenshot, campaign }
  },

  async applyExtractedMetricsToTable(campaignId: string, screenshotId: string): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const campaign = campaignsState.find(c => c.id === campaignId)
    if (!campaign) throw new Error('Campaign not found')

    const screenshot = campaign.screenshots.find(s => s.id === screenshotId)
    if (!screenshot || !screenshot.extractedMetrics) {
      throw new Error('Screenshot metrics not found')
    }

    const ex = screenshot.extractedMetrics
    const channelName = ex.detectedChannel || `AI Extracted Channel (${screenshot.fileName})`
    const pitched = ex.pitched || 50
    const replies = ex.replies || 15

    const newMetricRow: CampaignMetricRow = {
      id: `met-${Date.now()}`,
      channel: channelName,
      pitched,
      impressions: ex.impressions || 300000,
      opens: ex.opens || 40,
      clicks: ex.clicks || 25,
      replies,
      coverageSecured: ex.coverageSecured || 5,
      responseRate: pitched > 0 ? Number((replies / pitched).toFixed(3)) : 0
    }

    campaign.metrics = [newMetricRow, ...campaign.metrics]
    persist()
    return campaign
  }
}
