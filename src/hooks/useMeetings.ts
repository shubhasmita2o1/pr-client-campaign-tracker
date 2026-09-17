import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { meetingService } from '../services/meetingService'
import { Meeting, MeetingFilters } from '../types/meeting'

export const MEETING_QUERY_KEY = 'meetings'

export function useMeetings(filters?: MeetingFilters) {
  return useQuery({
    queryKey: [MEETING_QUERY_KEY, filters],
    queryFn: () => meetingService.getMeetings(filters)
  })
}

export function useMeeting(id?: string) {
  return useQuery({
    queryKey: [MEETING_QUERY_KEY, id],
    queryFn: () => (id ? meetingService.getMeetingById(id) : undefined),
    enabled: Boolean(id)
  })
}

export function useClientMeetings(clientId?: string) {
  return useQuery({
    queryKey: [MEETING_QUERY_KEY, 'client', clientId],
    queryFn: () => (clientId ? meetingService.getMeetingsByClientId(clientId) : []),
    enabled: Boolean(clientId)
  })
}

export function useCreateMeeting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Meeting, 'id'>) => meetingService.createMeeting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEETING_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    }
  })
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Meeting> }) =>
      meetingService.updateMeeting(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [MEETING_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [MEETING_QUERY_KEY, variables.id] })
    }
  })
}
