import { QuickStats } from '../types/common'
import { ActivityItem } from '../types/activity'
import { clientService } from './clientService'
import { meetingService } from './meetingService'
import { transcriptService } from './transcriptService'
import { campaignService } from './campaignService'
import { mockActivities } from '../data/mockActivities'

export const dashboardService = {
  async getQuickStats(): Promise<QuickStats> {
    const [clients, meetings, transcripts, campaigns] = await Promise.all([
      clientService.getClients(),
      meetingService.getMeetings(),
      transcriptService.getTranscripts(),
      campaignService.getCampaigns()
    ])

    const activeClients = clients.filter(c => c.status === 'active')
    const totalRetainerMRR = activeClients.reduce((sum, c) => sum + c.retainerMonthly, 0)

    // Upcoming meetings: date >= today
    const now = new Date().toISOString()
    const upcomingMeetings = meetings.filter(m => m.date >= now)

    // Pending transcripts: meetings where transcriptStatus === 'pending'
    const pendingTranscripts = meetings.filter(m => m.transcriptStatus === 'pending')

    // Campaigns this month (active or launched recently)
    const campaignsThisMonth = campaigns.filter(c => c.status === 'active' || c.status === 'draft')

    // Total coverage secured across all campaigns
    const totalCoverageSecured = campaigns.reduce(
      (sum, c) => sum + c.metrics.reduce((mSum, m) => mSum + m.coverageSecured, 0),
      0
    )

    return {
      activeClientsCount: activeClients.length,
      activeClientsGrowth: 12.5, // % MoM
      upcomingMeetingsCount: upcomingMeetings.length,
      campaignsThisMonthCount: campaignsThisMonth.length,
      pendingTranscriptsCount: pendingTranscripts.length,
      totalRetainerMRR,
      totalCoverageSecured
    }
  },

  async getRecentActivities(): Promise<ActivityItem[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockActivities
  }
}
