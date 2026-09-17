import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { CampaignStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { useCampaigns, useCreateCampaign } from '@/hooks/useCampaigns'
import { useClients } from '@/hooks/useClients'
import { Campaign, CampaignStatus, CampaignFilters } from '@/types/campaign'
import { formatNumber, formatPercent } from '@/lib/utils'
import {
  Megaphone,
  Plus,
  Search,
  ExternalLink,
  Sparkles,
  BarChart2,
  Calendar,
  Layers
} from 'lucide-react'
import { toast } from 'sonner'

export const CampaignsPage: React.FC = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<CampaignFilters>({
    search: '',
    status: 'all',
    clientId: 'all'
  })

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [clientId, setClientId] = useState('all')
  const [type, setType] = useState('Tech Launch & Funding')
  const [status, setStatus] = useState<CampaignStatus>('active')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
  )
  const [copyText, setCopyText] = useState('')

  const { data: campaigns = [], isLoading } = useCampaigns(filters)
  const { data: clients = [] } = useClients()
  const createCampaignMutation = useCreateCampaign()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Campaign title is required')
      return
    }

    try {
      const selectedClient = clients.find(c => c.id === clientId)
      await createCampaignMutation.mutateAsync({
        title: title.trim(),
        clientId: selectedClient?.id,
        clientName: selectedClient?.name,
        type,
        status,
        startDate,
        endDate,
        owner: 'Elena Rostova',
        targetOutlets: ['TechCrunch', 'Forbes', 'VentureBeat'],
        copyText: copyText || `SUBJECT: Pitch: ${title}\n\nHi [First Name],\n\nSharing news regarding...`,
        tags: ['PR Outreach', 'Pitch Blitz']
      })
      toast.success(`Campaign "${title}" created successfully!`)
      setCreateModalOpen(false)
      setTitle('')
      setCopyText('')
    } catch {
      toast.error('Failed to create campaign.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outbound PR Campaigns"
        description="Manage media pitches, journalist embargo blasts, and measure verified publication placements across all agency client accounts."
        badge={
          <Badge variant="outline" className="text-xs font-mono">
            {campaigns.length} Active &amp; Archived
          </Badge>
        }
      >
        <Button
          size="sm"
          onClick={() => setCreateModalOpen(true)}
          className="text-xs gap-1.5 h-8 bg-primary shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Campaign</span>
        </Button>
      </PageHeader>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card p-3 rounded-xl border border-border/80 shadow-2xs">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search campaigns, angles, tags..."
              value={filters.search || ''}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-8 h-8 text-xs bg-background"
            />
          </div>

          {/* Status Filter */}
          <div className="w-[140px]">
            <Select
              value={filters.status || 'all'}
              onValueChange={val =>
                setFilters(prev => ({ ...prev, status: val as CampaignFilters['status'] }))
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Live Outreach</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Client Filter */}
          <div className="w-[160px]">
            <Select
              value={filters.clientId || 'all'}
              onValueChange={val => setFilters(prev => ({ ...prev, clientId: val }))}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-mono self-end sm:self-auto shrink-0">
          Showing {campaigns.length} campaigns
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[320px]">Campaign Initiative</TableHead>
              <TableHead>Client Account</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead className="text-right">Pitched</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">Replies</TableHead>
              <TableHead className="text-right">Coverage Secured</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-xs text-muted-foreground">
                  No PR campaigns found matching your query.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map(camp => {
                const totalPitched = camp.metrics.reduce((s, m) => s + m.pitched, 0)
                const totalImpressions = camp.metrics.reduce((s, m) => s + m.impressions, 0)
                const totalReplies = camp.metrics.reduce((s, m) => s + m.replies, 0)
                const totalCoverage = camp.metrics.reduce((s, m) => s + m.coverageSecured, 0)

                return (
                  <TableRow
                    key={camp.id}
                    onClick={() => navigate(`/campaigns/${camp.id}`)}
                    className="cursor-pointer hover:bg-muted/40 transition-colors group"
                  >
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {camp.title}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{camp.type}</span>
                          <span>&bull;</span>
                          <span>Lead: {camp.owner}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-medium text-foreground">
                        {camp.clientName || 'General / Multi-Client'}
                      </span>
                    </TableCell>

                    <TableCell>
                      <CampaignStatusBadge status={camp.status} />
                    </TableCell>

                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {camp.startDate} &rarr; {camp.endDate}
                    </TableCell>

                    <TableCell className="text-right text-xs font-mono">
                      {formatNumber(totalPitched)}
                    </TableCell>

                    <TableCell className="text-right text-xs font-mono font-medium">
                      {formatNumber(totalImpressions)}
                    </TableCell>

                    <TableCell className="text-right text-xs font-mono font-semibold">
                      {formatNumber(totalReplies)}
                    </TableCell>

                    <TableCell className="text-right text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatNumber(totalCoverage)}
                    </TableCell>

                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => navigate(`/campaigns/${camp.id}`)}
                        className="text-xs gap-1 text-primary hover:text-primary"
                      >
                        <span>Manage</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Campaign Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Outbound PR Campaign</DialogTitle>
            <DialogDescription>
              Set up a targeted press release pitch, tech launch embargo blitz, or executive interview circuit.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-foreground">Campaign Title *</label>
              <Input
                placeholder="e.g. Series C Funding Embargo Pitch"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Client Account</label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Agency Multi-Client Initiative</SelectItem>
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Campaign Type</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tech Launch & Funding">Tech Launch &amp; Funding</SelectItem>
                    <SelectItem value="CleanTech & Policy PR">CleanTech &amp; Policy PR</SelectItem>
                    <SelectItem value="Threat Report & Thought Leadership">Threat Report</SelectItem>
                    <SelectItem value="Product Review Tour">Product Review Tour</SelectItem>
                    <SelectItem value="Clinical Biotech Data">Clinical Biotech Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-foreground">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Launch Campaign
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
