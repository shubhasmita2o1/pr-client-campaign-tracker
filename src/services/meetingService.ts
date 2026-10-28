import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { Meeting, MeetingFilters, MeetingFormData, MeetingAttendee, MeetingType, TranscriptStatus } from '@/types/meeting'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMeetingRow(row: any): Meeting {
  const clientObj = row.client || {}
  const attendeesList = Array.isArray(row.attendees) ? row.attendees : []
  const linkedTranscriptId = Array.isArray(row.transcripts) && row.transcripts.length > 0
    ? row.transcripts[0].id
    : undefined

  const attendees: MeetingAttendee[] = attendeesList.map((a: {
    id: string
    name: string
    email?: string | null
    avatar_url?: string | null
    role?: string | null
    is_client?: boolean | null
  }) => ({
    id: a.id,
    name: a.name,
    email: a.email || '',
    avatar: a.avatar_url || undefined,
    role: a.role || 'Attendee',
    isClient: Boolean(a.is_client)
  }))

  return {
    id: row.id,
    clientId: row.client_id,
    clientName: clientObj.name || clientObj.company || 'Agency Client',
    title: row.title,
    date: row.scheduled_at,
    durationMinutes: Number(row.duration_minutes) || 30,
    type: (row.type as MeetingType) || 'Weekly Sync',
    attendees,
    transcriptStatus: (row.transcript_status as TranscriptStatus) || 'none',
    transcriptId: linkedTranscriptId,
    notes: row.notes || '',
    location: row.location || 'Video Call',
    agenda: Array.isArray(row.agenda) ? row.agenda : [],
    calendlyEventId: row.calendly_event_id || undefined,
    gcalEventId: row.gcal_event_id || undefined
  }
}

export const meetingService = {
  // Get all meetings with optional filters
  async getMeetings(filters?: MeetingFilters): Promise<Meeting[]> {
    let query = supabase
      .from('meetings')
      .select('*, client:clients(id, name, company), attendees:meeting_attendees(*), transcripts:transcripts(id)')
      .order('scheduled_at', { ascending: false })

    if (filters) {
      if (filters.search && filters.search.trim()) {
        const q = filters.search.trim()
        query = query.or(`title.ilike.%${q}%,notes.ilike.%${q}%`)
      }

      if (filters.clientId && filters.clientId !== 'all') {
        query = query.eq('client_id', filters.clientId)
      }

      if (filters.transcriptStatus && filters.transcriptStatus !== 'all') {
        query = query.eq('transcript_status', filters.transcriptStatus)
      }

      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type)
      }

      if (filters.month && filters.month !== 'all') {
        query = query
          .gte('scheduled_at', `${filters.month}-01T00:00:00Z`)
          .lte('scheduled_at', `${filters.month}-31T23:59:59Z`)
      }

      if (filters.startDate) {
        query = query.gte('scheduled_at', filters.startDate)
      }

      if (filters.endDate) {
        query = query.lte('scheduled_at', filters.endDate)
      }

      if (filters.month && filters.month !== 'all') {
        query = query
          .gte('scheduled_at', `${filters.month}-01T00:00:00Z`)
          .lte('scheduled_at', `${filters.month}-31T23:59:59Z`)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('[meetingService.getMeetings] Query failed:', error)
      throw new Error(`Failed to load meetings: ${error.message}`)
    }

    return (data || []).map(mapMeetingRow)
  },

  // Get single meeting by ID
  async getMeetingById(id: string): Promise<Meeting | undefined> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*, client:clients(id, name, company), attendees:meeting_attendees(*), transcripts:transcripts(id)')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('[meetingService.getMeetingById] Error:', error)
      throw new Error(`Failed to load meeting: ${error.message}`)
    }

    if (!data) return undefined
    return mapMeetingRow(data)
  },

  // Get meetings by Client ID
  async getMeetingsByClientId(clientId: string): Promise<Meeting[]> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*, client:clients(id, name, company), attendees:meeting_attendees(*), transcripts:transcripts(id)')
      .eq('client_id', clientId)
      .order('scheduled_at', { ascending: false })

    if (error) {
      console.error('[meetingService.getMeetingsByClientId] Error:', error)
      throw new Error(`Failed to load meetings for client: ${error.message}`)
    }

    return (data || []).map(mapMeetingRow)
  },

  // Create new meeting + attendees
  async createMeeting(formData: MeetingFormData | Omit<Meeting, 'id'>): Promise<Meeting> {
    const insertPayload = {
      client_id: formData.clientId,
      title: formData.title,
      scheduled_at: 'date' in formData ? formData.date : new Date().toISOString(),
      duration_minutes: formData.durationMinutes || 30,
      type: formData.type || 'Weekly Sync',
      location: formData.location || 'Zoom',
      agenda: formData.agenda || [],
      notes: formData.notes || null,
      transcript_status: ('transcriptStatus' in formData ? formData.transcriptStatus : 'none') as TranscriptStatus
    }

    const { data: meetingRow, error: meetingErr } = await supabase
      .from('meetings')
      .insert(insertPayload)
      .select('id')
      .single()

    if (meetingErr) {
      console.error('[meetingService.createMeeting] Insert meeting failed:', meetingErr)
      throw new Error(`Failed to schedule meeting: ${meetingErr.message}`)
    }

    // Insert attendees if present
    if (formData.attendees && formData.attendees.length > 0) {
      const attendeesToInsert = formData.attendees.map(a => ({
        meeting_id: meetingRow.id,
        name: a.name,
        email: a.email || null,
        avatar_url: 'avatar' in a ? (a.avatar as string) : null,
        role: a.role || 'Participant',
        is_client: 'isClient' in a ? Boolean(a.isClient) : false
      }))

      await supabase.from('meeting_attendees').insert(attendeesToInsert)
    }

    const created = await this.getMeetingById(meetingRow.id)
    if (!created) {
      throw new Error('Created meeting could not be retrieved.')
    }
    return created
  },

  // Update existing meeting
  async updateMeeting(id: string, updates: Partial<Meeting>): Promise<Meeting> {
    const dbUpdates: Database['public']['Tables']['meetings']['Update'] = {}
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.date !== undefined) dbUpdates.scheduled_at = updates.date
    if (updates.durationMinutes !== undefined) dbUpdates.duration_minutes = updates.durationMinutes
    if (updates.type !== undefined) dbUpdates.type = updates.type
    if (updates.location !== undefined) dbUpdates.location = updates.location
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes
    if (updates.agenda !== undefined) dbUpdates.agenda = updates.agenda
    if (updates.transcriptStatus !== undefined) dbUpdates.transcript_status = updates.transcriptStatus
    if (updates.clientId !== undefined) dbUpdates.client_id = updates.clientId

    const { error } = await supabase
      .from('meetings')
      .update(dbUpdates)
      .eq('id', id)

    if (error) {
      console.error('[meetingService.updateMeeting] Error:', error)
      throw new Error(`Failed to update meeting: ${error.message}`)
    }

    const updated = await this.getMeetingById(id)
    if (!updated) throw new Error('Meeting not found after update')
    return updated
  },

  // Delete meeting
  async deleteMeeting(id: string): Promise<void> {
    const { error } = await supabase.from('meetings').delete().eq('id', id)
    if (error) {
      console.error('[meetingService.deleteMeeting] Error:', error)
      throw new Error(`Failed to delete meeting: ${error.message}`)
    }
  }
}
