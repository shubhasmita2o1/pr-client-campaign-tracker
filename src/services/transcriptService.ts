import { Transcript, TranscriptFilters } from '../types/transcript'
import { mockTranscripts } from '../data/mockTranscripts'

const STORAGE_KEY = 'pr_tracker_transcripts'

function getInitialTranscripts(): Transcript[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // fallback
    }
  }
  return mockTranscripts
}

let transcriptsState: Transcript[] = getInitialTranscripts()

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transcriptsState))
}

export const transcriptService = {
  async getTranscripts(filters?: TranscriptFilters): Promise<Transcript[]> {
    await new Promise(resolve => setTimeout(resolve, 150))
    let result = [...transcriptsState]

    if (!filters) return result

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase()
      result = result.filter(tr => {
        const inTitle = tr.title.toLowerCase().includes(q)
        const inClient = tr.clientName.toLowerCase().includes(q)
        const inTakeaways = tr.keyTakeaways.some(k => k.toLowerCase().includes(q))
        const inSegments = tr.parts.some(p =>
          p.segments.some(s => s.text.toLowerCase().includes(q) || s.speaker.toLowerCase().includes(q))
        )
        return inTitle || inClient || inTakeaways || inSegments
      })
    }

    if (filters.clientId && filters.clientId !== 'all') {
      result = result.filter(tr => tr.clientId === filters.clientId)
    }

    if (filters.hasAttachment !== undefined && filters.hasAttachment !== 'all') {
      result = result.filter(tr => Boolean(tr.hasAttachment) === Boolean(filters.hasAttachment))
    }

    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return result
  },

  async getTranscriptById(id: string): Promise<Transcript | undefined> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return transcriptsState.find(tr => tr.id === id)
  },

  async getTranscriptsByClientId(clientId: string): Promise<Transcript[]> {
    await new Promise(resolve => setTimeout(resolve, 120))
    return transcriptsState
      .filter(tr => tr.clientId === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },

  async createTranscript(data: Omit<Transcript, 'id'>): Promise<Transcript> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const newTranscript: Transcript = {
      id: `tr-${Date.now()}`,
      ...data
    }
    transcriptsState = [newTranscript, ...transcriptsState]
    persist()
    return newTranscript
  }
}
