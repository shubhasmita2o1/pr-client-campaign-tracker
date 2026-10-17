import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsService } from '../services/settingsService'
import { TeamMemberInvite } from '../types/profile'
import { IntegrationConfig } from '../types/integration'

export const useSettings = () => {
  const queryClient = useQueryClient()

  const teamQuery = useQuery({
    queryKey: ['team_members'],
    queryFn: () => settingsService.getTeamMembers()
  })

  const integrationsQuery = useQuery({
    queryKey: ['integrations'],
    queryFn: () => settingsService.getIntegrations()
  })

  const inviteMemberMutation = useMutation({
    mutationFn: (invite: TeamMemberInvite) => settingsService.inviteTeamMember(invite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] })
    }
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'admin' | 'member' }) =>
      settingsService.updateMemberRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] })
    }
  })

  const deleteMemberMutation = useMutation({
    mutationFn: (id: string) => settingsService.deleteTeamMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_members'] })
    }
  })

  const updateIntegrationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IntegrationConfig> }) =>
      settingsService.updateIntegration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
    }
  })

  const testIntegrationMutation = useMutation({
    mutationFn: (id: string) => settingsService.testIntegration(id)
  })

  return {
    teamMembers: teamQuery.data || [],
    isLoadingTeam: teamQuery.isLoading,
    integrations: integrationsQuery.data || [],
    isLoadingIntegrations: integrationsQuery.isLoading,
    inviteMember: inviteMemberMutation.mutateAsync,
    isInviting: inviteMemberMutation.isPending,
    updateRole: updateRoleMutation.mutateAsync,
    deleteMember: deleteMemberMutation.mutateAsync,
    updateIntegration: updateIntegrationMutation.mutateAsync,
    testIntegration: testIntegrationMutation.mutateAsync,
    isTesting: testIntegrationMutation.isPending
  }
}
