import { Transcript, TranscriptFilters, TranscriptActionItem } from '../types/transcript'
import { mockTranscripts } from '../mock/mockTranscripts'

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

    if (filters.source && filters.source !== 'all') {
      result = result.filter(tr => tr.source === filters.source)
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
  },

  async toggleActionItem(transcriptId: string, actionItemId: string): Promise<Transcript> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const transcript = transcriptsState.find(tr => tr.id === transcriptId)
    if (!transcript) throw new Error('Transcript not found')

    transcript.actionItems = transcript.actionItems.map(item =>
      item.id === actionItemId ? { ...item, completed: !item.completed } : item
    )
    persist()
    return transcript
  },

  async addActionItem(transcriptId: string, item: Omit<TranscriptActionItem, 'id' | 'completed'>): Promise<Transcript> {
    await new Promise(resolve => setTimeout(resolve, 120))
    const transcript = transcriptsState.find(tr => tr.id === transcriptId)
    if (!transcript) throw new Error('Transcript not found')

    const newItem: TranscriptActionItem = {
      id: `act-${Date.now()}`,
      ...item,
      completed: false
    }
    transcript.actionItems = [...transcript.actionItems, newItem]
    persist()
    return transcript
  },

  async deleteTranscript(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 150))
    transcriptsState = transcriptsState.filter(tr => tr.id !== id)
    persist()
  }
}
