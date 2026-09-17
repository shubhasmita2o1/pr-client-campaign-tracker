import { useQuery } from '@tanstack/react-query'
import { searchService } from '../services/searchService'

export function useGlobalSearch(query: string) {
  return useQuery({
    queryKey: ['global-search', query],
    queryFn: () => searchService.globalSearch(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 30
  })
}
