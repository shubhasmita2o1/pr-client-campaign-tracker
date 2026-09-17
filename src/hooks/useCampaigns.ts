import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { campaignService } from '../services/campaignService'
import { Campaign, CampaignFilters, CampaignMetricRow } from '../types/campaign'

export const CAMPAIGN_QUERY_KEY = 'campaigns'

export function useCampaigns(filters?: CampaignFilters) {
  return useQuery({
    queryKey: [CAMPAIGN_QUERY_KEY, filters],
    queryFn: () => campaignService.getCampaigns(filters)
  })
}

export function useCampaign(id?: string) {
  return useQuery({
    queryKey: [CAMPAIGN_QUERY_KEY, id],
    queryFn: () => (id ? campaignService.getCampaignById(id) : undefined),
    enabled: Boolean(id)
  })
}

export function useClientCampaigns(clientId?: string) {
  return useQuery({
    queryKey: [CAMPAIGN_QUERY_KEY, 'client', clientId],
    queryFn: () => (clientId ? campaignService.getCampaignsByClientId(clientId) : []),
    enabled: Boolean(clientId)
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Campaign, 'id' | 'metrics' | 'screenshots'>) =>
      campaignService.createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGN_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    }
  })
}
export function useUpdateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Campaign> }) =>
      campaignService.updateCampaign(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGN_QUERY_KEY, variables.id] })
      queryClient.invalidateQueries({ queryKey: [CAMPAIGN_QUERY_KEY] })
    }
  })
}

export function useUpdateCampaignCopy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, copyText }: { id: string; copyText: string }) =>
      campaignService.updateCampaignCopy(id, copyText),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGN_QUERY_KEY, variables.id] })
    }
  })
}

export function useAddMetricRow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      campaignId,
      row
    }: {
      campaignId: string
      row: Omit<CampaignMetricRow, 'id' | 'responseRate'>
    }) => campaignService.addMetricRow(campaignId, row),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGN_QUERY_KEY, variables.campaignId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    }
  })
}

export function useDeleteMetricRow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ campaignId, rowId }: { campaignId: string; rowId: string }) =>
      campaignService.deleteMetricRow(campaignId, rowId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGN_QUERY_KEY, variables.campaignId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    }
  })
}

export function useExtractMetricsFromScreenshot() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      campaignId,
      fileName,
      thumbnailUrl,
      fileSize
    }: {
      campaignId: string
      fileName: string
      thumbnailUrl: string
      fileSize: string
    }) =>
      campaignService.extractMetricsFromScreenshot(campaignId, fileName, thumbnailUrl, fileSize),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGN_QUERY_KEY, variables.campaignId] })
    }
  })
}

export function useApplyExtractedMetrics() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ campaignId, screenshotId }: { campaignId: string; screenshotId: string }) =>
      campaignService.applyExtractedMetricsToTable(campaignId, screenshotId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGN_QUERY_KEY, variables.campaignId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    }
  })
}
