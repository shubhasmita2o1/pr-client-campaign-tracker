import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientService } from '../services/clientService'
import { ClientFilters, ClientFormData, Client, ProposalDocument } from '../types/client'

export const CLIENT_QUERY_KEY = 'clients'

export function useClients(filters?: ClientFilters) {
  return useQuery({
    queryKey: [CLIENT_QUERY_KEY, filters],
    queryFn: () => clientService.getClients(filters)
  })
}

export function useClient(id?: string) {
  return useQuery({
    queryKey: [CLIENT_QUERY_KEY, id],
    queryFn: () => (id ? clientService.getClientById(id) : undefined),
    enabled: Boolean(id)
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ClientFormData) => clientService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENT_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    }
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      clientService.updateClient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CLIENT_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [CLIENT_QUERY_KEY, variables.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    }
  })
}

export function useUploadProposal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      clientId,
      doc
    }: {
      clientId: string
      doc: Omit<ProposalDocument, 'id' | 'uploadedAt'>
    }) => clientService.uploadProposalDoc(clientId, doc),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CLIENT_QUERY_KEY, variables.clientId] })
    }
  })
}

export function useDeleteProposal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clientId, docId }: { clientId: string; docId: string }) =>
      clientService.deleteProposalDoc(clientId, docId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CLIENT_QUERY_KEY, variables.clientId] })
    }
  })
}
