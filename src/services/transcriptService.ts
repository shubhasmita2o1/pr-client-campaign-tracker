import { supabase } from '@/lib/supabase'
import type {
  Transcript,
  TranscriptFilters,
  TranscriptActionItem,
  TranscriptPart,
  TranscriptSegment,
  TranscriptSource,
  SegmentSentiment
} from '@/types/transcript'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTranscriptRow(row: any): Transcript {
  const clientObj = row.client || {}
  const meetingObj = row.meeting || {}
  const partsList = Array.isArray(row.parts) ? row.parts : []
  const actionItemsList = Array.isArray(row.action_items) ? row.action_items : []

  // Sort parts by part_number
  const sortedParts = [...partsList].sort(
    (a, b) => (Number(a.part_number) || 0) - (Number(b.part_number) || 0)
  )

  const parts: TranscriptPart[] = sortedParts.map((p: {
    id: string
    part_number: number
    title?: string | null
    duration?: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    segments?: any[]
  }) => {
    const rawSegments = Array.isArray(p.segments) ? p.segments : []
    const segments: TranscriptSegment[] = rawSegments.map((s: {
      id: string
      speaker: string
      speaker_avatar?: string | null
      speaker_role?: string | null
      is_client?: boolean | null
      timestamp?: string | null
      text: string
      sentiment?: string | null
    }) => ({
      id: s.id,
      speaker: s.speaker,
      speakerAvatar: s.speaker_avatar || undefined,
      speakerRole: s.speaker_role || 'Participant',
      isClient: Boolean(s.is_client),
      timestamp: s.timestamp || '00:00',
      text: s.text,
      sentiment: (s.sentiment as SegmentSentiment) || 'neutral'
    }))

    return {
      id: p.id,
      partNumber: p.part_number || 1,
      title: p.title || `Part ${p.part_number}`,
      duration: p.duration || '15 mins',
      segments
    }
  })

  const actionItems: TranscriptActionItem[] = actionItemsList.map((ai: {
    id: string
    task: string
    assignee?: string | null
    completed?: boolean | null
  }) => ({
    id: ai.id,
    task: ai.task,
    assignee: ai.assignee || 'Unassigned',
    completed: Boolean(ai.completed)
  }))

  return {
    id: row.id,
    meetingId: row.meeting_id || undefined,
    meetingTitle: meetingObj.title || undefined,
    clientId: row.client_id,
    clientName: clientObj.name || clientObj.company || 'Agency Client',
    title: row.title,
    date: row.date,
    totalDuration: row.total_duration || '30 mins',
    participants: Array.isArray(row.participants) ? row.participants : [],
    parts,
    keyTakeaways: Array.isArray(row.key_takeaways) ? row.key_takeaways : [],
    actionItems,
    hasAttachment: false,
    source: (row.source as TranscriptSource) || 'manual',
    externalId: row.external_id || undefined
  }
}

export const transcriptService = {
  // Fetch transcripts with optional filters
  async getTranscripts(filters?: TranscriptFilters): Promise<Transcript[]> {
    let query = supabase
      .from('transcripts')
      .select('*, client:clients(id, name, company), meeting:meetings(id, title, scheduled_at), parts:transcript_parts(*, segments:transcript_segments(*)), action_items:transcript_action_items(*)')
      .order('date', { ascending: false })

    if (filters) {
      if (filters.search && filters.search.trim()) {
        const q = filters.search.trim()
        // Find transcript IDs that match spoken segment text in Postgres
        try {
          const { data: matchedSegs } = await supabase
            .from('transcript_segments')
            .select('part_id')
            .ilike('text', `%${q}%`)
            .limit(100)

          let matchingTranscriptIds: string[] = []
          if (matchedSegs && matchedSegs.length > 0) {
            const partIds = [...new Set(matchedSegs.map(s => s.part_id))]
            const { data: matchedParts } = await supabase
              .from('transcript_parts')
              .select('transcript_id')
              .in('id', partIds)
            if (matchedParts) {
              matchingTranscriptIds = [...new Set(matchedParts.map(p => p.transcript_id))]
            }
          }

          if (matchingTranscriptIds.length > 0) {
            query = query.or(`title.ilike.%${q}%,id.in.(${matchingTranscriptIds.join(',')})`)
          } else {
            query = query.or(`title.ilike.%${q}%`)
          }
        } catch {
          query = query.or(`title.ilike.%${q}%`)
        }
      }

      if (filters.clientId && filters.clientId !== 'all') {
        query = query.eq('client_id', filters.clientId)
      }

      if (filters.source && filters.source !== 'all') {
        query = query.eq('source', filters.source)
      }

      if (filters.startDate) {
        query = query.gte('date', filters.startDate)
      }

      if (filters.endDate) {
        query = query.lte('date', filters.endDate)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('[transcriptService.getTranscripts] Query failed:', error)
      throw new Error(`Failed to load transcripts: ${error.message}`)
    }

    let transcripts = (data || []).map(mapTranscriptRow)

    // Deep search in keyTakeaways or transcript segment text if search term is provided
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim()
      transcripts = transcripts.filter(tr => {
        const inTitle = tr.title.toLowerCase().includes(q)
        const inClient = tr.clientName.toLowerCase().includes(q)
        const inTakeaways = tr.keyTakeaways.some(k => k.toLowerCase().includes(q))
        const inSegments = tr.parts.some(p =>
          p.segments.some(s => s.text.toLowerCase().includes(q) || s.speaker.toLowerCase().includes(q))
        )
        return inTitle || inClient || inTakeaways || inSegments
      })
    }

    return transcripts
  },

  // Fetch single transcript by ID
  async getTranscriptById(id: string): Promise<Transcript | undefined> {
    const { data, error } = await supabase
      .from('transcripts')
      .select('*, client:clients(id, name, company), meeting:meetings(id, title, scheduled_at), parts:transcript_parts(*, segments:transcript_segments(*)), action_items:transcript_action_items(*)')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('[transcriptService.getTranscriptById] Error:', error)
      throw new Error(`Failed to load transcript: ${error.message}`)
    }

    if (!data) return undefined
    return mapTranscriptRow(data)
  },

  // Get transcripts by Client ID
  async getTranscriptsByClientId(clientId: string): Promise<Transcript[]> {
    const { data, error } = await supabase
      .from('transcripts')
      .select('*, client:clients(id, name, company), meeting:meetings(id, title, scheduled_at), parts:transcript_parts(*, segments:transcript_segments(*)), action_items:transcript_action_items(*)')
      .eq('client_id', clientId)
      .order('date', { ascending: false })

    if (error) {
      console.error('[transcriptService.getTranscriptsByClientId] Error:', error)
      throw new Error(`Failed to load transcripts for client: ${error.message}`)
    }

    return (data || []).map(mapTranscriptRow)
  },

  // Toggle action item completed status
  async toggleActionItem(transcriptId: string, actionItemId: string): Promise<Transcript> {
    // 1. Get current status
    const { data: itemData, error: fetchErr } = await supabase
      .from('transcript_action_items')
      .select('completed')
      .eq('id', actionItemId)
      .single()

    if (fetchErr) {
      throw new Error(`Failed to fetch action item: ${fetchErr.message}`)
    }

    // 2. Toggle status
    const { error: updateErr } = await supabase
      .from('transcript_action_items')
      .update({ completed: !itemData.completed })
      .eq('id', actionItemId)

    if (updateErr) {
      throw new Error(`Failed to update action item: ${updateErr.message}`)
    }

    const updated = await this.getTranscriptById(transcriptId)
    if (!updated) throw new Error('Transcript not found after updating action item')
    return updated
  },

  // Add action item to transcript
  async addActionItem(
    transcriptId: string,
    item: Omit<TranscriptActionItem, 'id' | 'completed'>
  ): Promise<Transcript> {
    const { error } = await supabase
      .from('transcript_action_items')
      .insert({
        transcript_id: transcriptId,
        task: item.task,
        assignee: item.assignee,
        completed: false
      })

    if (error) {
      throw new Error(`Failed to add action item: ${error.message}`)
    }

    const updated = await this.getTranscriptById(transcriptId)
    if (!updated) throw new Error('Transcript not found after adding action item')
    return updated
  },

  // Create new transcript with parts and segments
  async createTranscript(data: Omit<Transcript, 'id'>): Promise<Transcript> {
    const { data: transcriptRow, error: trErr } = await supabase
      .from('transcripts')
      .insert({
        client_id: data.clientId,
        meeting_id: data.meetingId || null,
        title: data.title,
        date: data.date,
        total_duration: data.totalDuration,
        participants: data.participants,
        key_takeaways: data.keyTakeaways,
        source: data.source || 'manual'
      })
      .select('id')
      .single()

    if (trErr) {
      throw new Error(`Failed to create transcript: ${trErr.message}`)
    }

    // Insert parts and segments
    for (const part of data.parts) {
      const { data: partRow, error: pErr } = await supabase
        .from('transcript_parts')
        .insert({
          transcript_id: transcriptRow.id,
          part_number: part.partNumber,
          title: part.title,
          duration: part.duration
        })
        .select('id')
        .single()

      if (!pErr && partRow && part.segments.length > 0) {
        const segs = part.segments.map(s => ({
          part_id: partRow.id,
          speaker: s.speaker,
          speaker_avatar: s.speakerAvatar || null,
          speaker_role: s.speakerRole,
          is_client: s.isClient,
          timestamp: s.timestamp,
          text: s.text,
          sentiment: s.sentiment || 'neutral'
        }))
        await supabase.from('transcript_segments').insert(segs)
      }
    }

    // Insert action items
    if (data.actionItems.length > 0) {
      const items = data.actionItems.map(ai => ({
        transcript_id: transcriptRow.id,
        task: ai.task,
        assignee: ai.assignee,
        completed: ai.completed
      }))
      await supabase.from('transcript_action_items').insert(items)
    }

    const created = await this.getTranscriptById(transcriptRow.id)
    if (!created) throw new Error('Created transcript not found')
    return created
  },

  // Delete transcript
  async deleteTranscript(id: string): Promise<void> {
    const { error } = await supabase.from('transcripts').delete().eq('id', id)
    if (error) {
      throw new Error(`Failed to delete transcript: ${error.message}`)
    }
  }
}
