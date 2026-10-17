import React, { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { ClientFiltersBar } from '@/components/clients/ClientFiltersBar'
import { ClientTable } from '@/components/clients/ClientTable'
import { ClientFormModal } from '@/components/clients/ClientFormModal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useClients, useUpdateClient } from '@/hooks/useClients'
import { Client, ClientFilters } from '@/types/client'
import { Plus, Users, Building2, Download } from 'lucide-react'
import { toast } from 'sonner'

export const ClientsPage: React.FC = () => {
  const [filters, setFilters] = useState<ClientFilters>({
    search: '',
    status: 'all',
    ownerId: 'all',
    month: 'all'
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: clients = [], isLoading } = useClients(filters)
  const { data: allClients = [] } = useClients()
  const updateClientMutation = useUpdateClient()

  const handleEdit = (client: Client) => {
    setClientToEdit(client)
    setModalOpen(true)
  }

  const handleDeleteRequest = (client: Client) => {
    setClientToDelete(client)
    setDeleteDialogOpen(true)
  }

  const handleConfirmArchive = async () => {
    if (!clientToDelete) return
    try {
      await updateClientMutation.mutateAsync({
        id: clientToDelete.id,
        data: { status: 'churned' }
      })
      toast.success(`Client "${clientToDelete.name}" marked as Churned/Archived.`)
    } catch {
      toast.error('Failed to update client status.')
    }
  }

  const handleExportCSV = () => {
    if (clients.length === 0) {
      toast.error('No client records to export.')
      return
    }

    const headers = [
      'Client Name',
      'Legal Company',
      'Status',
      'Tier',
      'Industry',
      'Monthly Retainer',
      'PR Lead',
      'Spokesperson Name',
      'Spokesperson Email',
      'Website',
      'Joined Date'
    ]

    const rows = clients.map((c) => [
      `"${c.name}"`,
      `"${c.company}"`,
      c.status,
      c.tier,
      `"${c.industry}"`,
      c.retainerMonthly,
      `"${c.owner.name}"`,
      `"${c.primaryContact.name}"`,
      `"${c.primaryContact.email}"`,
      `"${c.website}"`,
      c.joinedDate
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `PR_Agency_Clients_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(`Exported ${clients.length} client records to CSV`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Accounts & Retainers"
        description="Directory of active retained clients, pipeline prospects, and alumni accounts with contract terms and assigned PR leads."
        badge={
          <Badge variant="outline" className="text-xs font-mono bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800">
            {allClients.length} Total Accounts
          </Badge>
        }
      >
        <Button
          size="sm"
          onClick={() => {
            setClientToEdit(null)
            setModalOpen(true)
          }}
          className="text-xs gap-1.5 h-8 bg-sky-500 hover:bg-sky-600 text-white shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Client</span>
        </Button>
      </PageHeader>

      {/* Filter Bar with CSV Export */}
      <ClientFiltersBar
        filters={filters}
        setFilters={setFilters}
        totalCount={allClients.length}
        filteredCount={clients.length}
        onExportCSV={handleExportCSV}
      />

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : clients.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-6 w-6" />}
          title="No clients match your filter"
          description="Try clearing your search query, status selector, or PR lead filter to view more accounts."
          actionLabel="Clear Filters"
          onAction={() =>
            setFilters({ search: '', status: 'all', ownerId: 'all', month: 'all' })
          }
        />
      ) : (
        <ClientTable
          clients={clients}
          onEditClient={handleEdit}
          onDeleteClient={handleDeleteRequest}
        />
      )}

      {/* Create / Edit Client Modal */}
      <ClientFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        clientToEdit={clientToEdit}
      />

      {/* Confirm Archive Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Archive Client Retainer?"
        description={`Are you sure you want to mark ${clientToDelete?.name} as Churned? All historical meetings, proposals, and transcripts will remain archived.`}
        confirmLabel="Archive Retainer"
        onConfirm={handleConfirmArchive}
      />
    </div>
  )
}
