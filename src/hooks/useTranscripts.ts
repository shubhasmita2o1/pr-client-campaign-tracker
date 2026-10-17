import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transcriptService } from '../services/transcriptService'
import { Transcript, TranscriptFilters, TranscriptActionItem } from '../types/transcript'

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

export function useToggleActionItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ transcriptId, actionItemId }: { transcriptId: string; actionItemId: string }) =>
      transcriptService.toggleActionItem(transcriptId, actionItemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [TRANSCRIPT_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [TRANSCRIPT_QUERY_KEY, variables.transcriptId] })
    }
  })
}

export function useAddActionItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      transcriptId,
      item
    }: {
      transcriptId: string
      item: Omit<TranscriptActionItem, 'id' | 'completed'>
    }) => transcriptService.addActionItem(transcriptId, item),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [TRANSCRIPT_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [TRANSCRIPT_QUERY_KEY, variables.transcriptId] })
    }
  })
}

export function useDeleteTranscript() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transcriptService.deleteTranscript(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSCRIPT_QUERY_KEY] })
    }
  })
}
