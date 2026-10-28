import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { importService } from '../services/importService'

export const useImports = () => {
  const queryClient = useQueryClient()

  const batchesQuery = useQuery({
    queryKey: ['import_batches'],
    queryFn: () => importService.getBatches()
  })

  const runImportMutation = useMutation({
    mutationFn: ({
      file,
      onProgress
    }: {
      file: { name: string; size: number; blob?: Blob } | File
      onProgress?: (progress: number, step: string) => void
    }) => importService.runImport(file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import_batches'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['quick_stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    }
  })

  return {
    batches: batchesQuery.data || [],
    isLoading: batchesQuery.isLoading,
    isError: batchesQuery.isError,
    refetch: batchesQuery.refetch,
    runImport: runImportMutation.mutateAsync,
    isImporting: runImportMutation.isPending,
    downloadTemplate: importService.downloadSampleTemplate
  }
}
