import { Meeting, MeetingFilters } from '../types/meeting'
import { mockMeetings } from '../data/mockMeetings'

const STORAGE_KEY = 'pr_tracker_meetings'

function getInitialMeetings(): Meeting[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // fallback
    }
  }
  return mockMeetings
}

let meetingsState: Meeting[] = getInitialMeetings()

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meetingsState))
}

export const meetingService = {
  async getMeetings(filters?: MeetingFilters): Promise<Meeting[]> {
    await new Promise(resolve => setTimeout(resolve, 150))
    let result = [...meetingsState]

    if (!filters) return result

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase()
      result = result.filter(
        m =>
          m.title.toLowerCase().includes(q) ||
          m.clientName.toLowerCase().includes(q) ||
          m.notes?.toLowerCase().includes(q) ||
          m.attendees.some(a => a.name.toLowerCase().includes(q))
      )
    }

    if (filters.clientId && filters.clientId !== 'all') {
      result = result.filter(m => m.clientId === filters.clientId)
    }

    if (filters.transcriptStatus && filters.transcriptStatus !== 'all') {
      result = result.filter(m => m.transcriptStatus === filters.transcriptStatus)
    }

    if (filters.type && filters.type !== 'all') {
      result = result.filter(m => m.type === filters.type)
    }

    // Sort by date descending by default
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return result
  },

  async getMeetingById(id: string): Promise<Meeting | undefined> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return meetingsState.find(m => m.id === id)
  },

  async getMeetingsByClientId(clientId: string): Promise<Meeting[]> {
    await new Promise(resolve => setTimeout(resolve, 120))
    return meetingsState
      .filter(m => m.clientId === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },

  async createMeeting(data: Omit<Meeting, 'id'>): Promise<Meeting> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const newMeeting: Meeting = {
      id: `meet-${Date.now()}`,
      ...data
    }
    meetingsState = [newMeeting, ...meetingsState]
    persist()
    return newMeeting
  },

  async updateMeeting(id: string, data: Partial<Meeting>): Promise<Meeting> {
    await new Promise(resolve => setTimeout(resolve, 150))
    const index = meetingsState.findIndex(m => m.id === id)
    if (index === -1) throw new Error('Meeting not found')

    meetingsState[index] = { ...meetingsState[index], ...data }
    persist()
    return meetingsState[index]
  },

  async deleteMeeting(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 150))
    meetingsState = meetingsState.filter(m => m.id !== id)
    persist()
  }
}
