import { clientService } from './clientService'
import { meetingService } from './meetingService'
import { transcriptService } from './transcriptService'
import { campaignService } from './campaignService'
import type { GlobalSearchResult } from '@/types/common'

export const searchService = {
  // Global search across clients, meetings, transcripts (including speech text), and campaigns
  async globalSearch(query: string): Promise<GlobalSearchResult> {
    if (!query || query.trim() === '') {
      return { clients: [], meetings: [], transcripts: [], campaigns: [] }
    }

    const q = query.toLowerCase().trim()

    // Query all entities concurrently through service layer
    const [allClients, allMeetings, allTranscripts, allCampaigns] = await Promise.all([
      clientService.getClients({ search: q }),
      meetingService.getMeetings({ search: q }),
      transcriptService.getTranscripts({ search: q }),
      campaignService.getCampaigns({ search: q })
    ])

    // Find snippet matches within transcript parts and segments
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
          matchingSegmentText: foundSnippet || tr.keyTakeaways[0] || tr.title,
          matchingPartNumber: partNumber
        })
      }
    }

    return {
      clients: allClients,
      meetings: allMeetings,
      transcripts: matchedTranscripts,
      campaigns: allCampaigns
    }
  }
}
