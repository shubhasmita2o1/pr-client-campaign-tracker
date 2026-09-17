import { GlobalSearchResult } from '../types/common'
import { clientService } from './clientService'
import { meetingService } from './meetingService'
import { transcriptService } from './transcriptService'
import { campaignService } from './campaignService'

export const searchService = {
  async globalSearch(query: string): Promise<GlobalSearchResult> {
    if (!query || query.trim() === '') {
      return { clients: [], meetings: [], transcripts: [], campaigns: [] }
    }

    const q = query.toLowerCase().trim()

    // Query all entities concurrently
    const [allClients, allMeetings, allTranscripts, allCampaigns] = await Promise.all([
      clientService.getClients(),
      meetingService.getMeetings(),
      transcriptService.getTranscripts(),
      campaignService.getCampaigns()
    ])

    // Filter clients
    const matchedClients = allClients.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q)) ||
      c.owner.name.toLowerCase().includes(q)
    )

    // Filter meetings
    const matchedMeetings = allMeetings.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.clientName.toLowerCase().includes(q) ||
      m.notes?.toLowerCase().includes(q) ||
      m.attendees.some(a => a.name.toLowerCase().includes(q))
    )

    // Filter transcripts and extract matching snippet
    const matchedTranscripts: GlobalSearchResult['transcripts'] = []
    for (const tr of allTranscripts) {
      const inTitle = tr.title.toLowerCase().includes(q)
      const inClient = tr.clientName.toLowerCase().includes(q)
      let foundSnippet = ''
      let partNumber = 1

      for (const part of tr.parts) {
        for (const seg of part.segments) {
          if (seg.text.toLowerCase().includes(q)) {
            foundSnippet = seg.text
            partNumber = part.partNumber
            break
          }
        }
        if (foundSnippet) break
      }

      if (inTitle || inClient || foundSnippet) {
        matchedTranscripts.push({
          transcript: tr,
          matchingSegmentText: foundSnippet || tr.keyTakeaways[0] || '',
          matchingPartNumber: partNumber
        })
      }
    }

    // Filter campaigns
    const matchedCampaigns = allCampaigns.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.clientName?.toLowerCase().includes(q) ||
      c.copyText.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    )

    return {
      clients: matchedClients,
      meetings: matchedMeetings,
      transcripts: matchedTranscripts,
      campaigns: matchedCampaigns
    }
  }
}
