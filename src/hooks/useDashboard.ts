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

export function useDashboard() {
  const statsQuery = useQuickStats()
  const activitiesQuery = useRecentActivities()

  return {
    stats: statsQuery.data,
    recentActivities: activitiesQuery.data || [],
    isLoading: statsQuery.isLoading || activitiesQuery.isLoading,
    refetch: () => {
      statsQuery.refetch()
      activitiesQuery.refetch()
    }
  }
}
