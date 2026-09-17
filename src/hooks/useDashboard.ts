import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'

export function useQuickStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getQuickStats(),
    refetchInterval: 1000 * 60 // 1 min
  })
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ['recent-activities'],
    queryFn: () => dashboardService.getRecentActivities()
  })
}
