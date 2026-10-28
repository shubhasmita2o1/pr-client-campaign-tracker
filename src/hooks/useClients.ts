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
      file,
      type,
      status,
      doc
    }: {
      clientId: string
      file?: File
      type?: 'proposal' | 'contract' | 'brief' | 'report'
      status?: 'signed' | 'review' | 'draft'
      doc?: { name: string; fileSize?: string; url?: string; type?: ProposalDocument['type']; status?: ProposalDocument['status'] }
    }) => {
      if (file) {
        return clientService.uploadProposal(clientId, file, type, status)
      }
      if (doc) {
        return clientService.uploadProposalDoc(clientId, doc)
      }
      throw new Error('No file provided for upload')
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CLIENT_QUERY_KEY, variables.clientId] })
      queryClient.invalidateQueries({ queryKey: [CLIENT_QUERY_KEY] })
    }
  })
}

export function useDeleteProposal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clientId, docId, filePath }: { clientId: string; docId: string; filePath?: string }) =>
      clientService.deleteProposal(docId, filePath),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CLIENT_QUERY_KEY, variables.clientId] })
      queryClient.invalidateQueries({ queryKey: [CLIENT_QUERY_KEY] })
    }
  })
}
