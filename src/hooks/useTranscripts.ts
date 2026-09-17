import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transcriptService } from '../services/transcriptService'
import { Transcript, TranscriptFilters } from '../types/transcript'

export const TRANSCRIPT_QUERY_KEY = 'transcripts'

export function useTranscripts(filters?: TranscriptFilters) {
  return useQuery({
    queryKey: [TRANSCRIPT_QUERY_KEY, filters],
    queryFn: () => transcriptService.getTranscripts(filters)
  })
}

export function useTranscript(id?: string) {
  return useQuery({
    queryKey: [TRANSCRIPT_QUERY_KEY, id],
    queryFn: () => (id ? transcriptService.getTranscriptById(id) : undefined),
    enabled: Boolean(id)
  })
}

export function useClientTranscripts(clientId?: string) {
  return useQuery({
    queryKey: [TRANSCRIPT_QUERY_KEY, 'client', clientId],
    queryFn: () => (clientId ? transcriptService.getTranscriptsByClientId(clientId) : []),
    enabled: Boolean(clientId)
  })
}

export function useCreateTranscript() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Transcript, 'id'>) => transcriptService.createTranscript(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSCRIPT_QUERY_KEY] })
    }
  })
}
