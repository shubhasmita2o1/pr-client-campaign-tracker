import React, { useState } from 'react'
import { Campaign, CampaignMetricRow } from '@/types/campaign'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { formatNumber, formatPercent } from '@/lib/utils'
import { Plus, Trash2, TrendingUp, BarChart3 } from 'lucide-react'
import { useAddMetricRow, useDeleteMetricRow } from '@/hooks/useCampaigns'
import { toast } from 'sonner'

interface CampaignMetricsTableProps {
  campaign: Campaign
}

export const CampaignMetricsTable: React.FC<CampaignMetricsTableProps> = ({ campaign }) => {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [channel, setChannel] = useState('')
  const [pitched, setPitched] = useState(25)
  const [impressions, setImpressions] = useState(150000)
  const [opens, setOpens] = useState(20)
  const [clicks, setClicks] = useState(15)
  const [replies, setReplies] = useState(8)
  const [coverageSecured, setCoverageSecured] = useState(3)

  const addMetricMutation = useAddMetricRow()
  const deleteMetricMutation = useDeleteMetricRow()

  const handleAddMetric = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!channel.trim()) {
      toast.error('Channel name is required')
      return
    }

    try {
      await addMetricMutation.mutateAsync({
        campaignId: campaign.id,
        row: {
          channel: channel.trim(),
          pitched: Number(pitched),
          impressions: Number(impressions),
          opens: Number(opens),
          clicks: Number(clicks),
          replies: Number(replies),
          coverageSecured: Number(coverageSecured)
        }
      })
      toast.success(`Metric channel "${channel}" added!`)
      setChannel('')
      setAddModalOpen(false)
    } catch {
      toast.error('Failed to add metric row.')
    }
  }

  const handleDeleteRow = async (rowId: string, channelName: string) => {
    try {
      await deleteMetricMutation.mutateAsync({ campaignId: campaign.id, rowId })
      toast.success(`Removed "${channelName}"`)
    } catch {
      toast.error('Failed to delete metric row.')
    }
  }

  // Calculate totals
  const totalPitched = campaign.metrics.reduce((s, m) => s + m.pitched, 0)
  const totalImpressions = campaign.metrics.reduce((s, m) => s + m.impressions, 0)
  const totalOpens = campaign.metrics.reduce((s, m) => s + m.opens, 0)
  const totalClicks = campaign.metrics.reduce((s, m) => s + m.clicks, 0)
  const totalReplies = campaign.metrics.reduce((s, m) => s + m.replies, 0)
  const totalCoverage = campaign.metrics.reduce((s, m) => s + m.coverageSecured, 0)
  const overallResponseRate = totalPitched > 0 ? totalReplies / totalPitched : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Distribution Channels &amp; Performance Metrics
          </h3>
        </div>

        <Button
          size="xs"
          variant="outline"
          onClick={() => setAddModalOpen(true)}
          className="h-7 text-xs gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Channel Row</span>
        </Button>
      </div>

      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px]">Target Channel / Desk</TableHead>
              <TableHead className="text-right">Pitched</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">Opens</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Replies</TableHead>
              <TableHead className="text-right">Coverage</TableHead>
              <TableHead className="text-right">Response Rate</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaign.metrics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-xs text-muted-foreground">
                  No metrics added yet. Click &quot;Extract metrics with AI&quot; or &quot;Add Channel Row&quot;.
                </TableCell>
              </TableRow>
            ) : (
              campaign.metrics.map(metric => (
                <TableRow key={metric.id}>
                  <TableCell className="font-medium text-xs text-foreground">
                    {metric.channel}
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    {formatNumber(metric.pitched)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono font-medium">
                    {formatNumber(metric.impressions)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    {formatNumber(metric.opens)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    {formatNumber(metric.clicks)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono font-semibold text-foreground">
                    {formatNumber(metric.replies)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatNumber(metric.coverageSecured)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        metric.responseRate >= 0.4
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : metric.responseRate >= 0.25
                          ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {formatPercent(metric.responseRate)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteRow(metric.id, metric.channel)}
                      title="Delete row"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {campaign.metrics.length > 0 && (
            <TableFooter>
              <TableRow className="font-bold text-xs bg-muted/40">
                <TableCell>Total Campaign Aggregate</TableCell>
                <TableCell className="text-right font-mono">{formatNumber(totalPitched)}</TableCell>
                <TableCell className="text-right font-mono">{formatNumber(totalImpressions)}</TableCell>
                <TableCell className="text-right font-mono">{formatNumber(totalOpens)}</TableCell>
                <TableCell className="text-right font-mono">{formatNumber(totalClicks)}</TableCell>
                <TableCell className="text-right font-mono">{formatNumber(totalReplies)}</TableCell>
                <TableCell className="text-right font-mono text-emerald-600 dark:text-emerald-400">
                  {formatNumber(totalCoverage)}
                </TableCell>
                <TableCell className="text-right font-mono text-emerald-600 dark:text-emerald-400">
                  {formatPercent(overallResponseRate)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {/* Add Metric Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Channel Metric Row</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMetric} className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-foreground">Channel / Media Tier Name *</label>
              <Input
                placeholder="e.g. Substack Tech Columnists"
                value={channel}
                onChange={e => setChannel(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Reporters Pitched</label>
                <Input
                  type="number"
                  value={pitched}
                  onChange={e => setPitched(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-foreground">Total Impressions</label>
                <Input
                  type="number"
                  value={impressions}
                  onChange={e => setImpressions(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Email Opens</label>
                <Input
                  type="number"
                  value={opens}
                  onChange={e => setOpens(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-foreground">Link Clicks</label>
                <Input
                  type="number"
                  value={clicks}
                  onChange={e => setClicks(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Replies Received</label>
                <Input
                  type="number"
                  value={replies}
                  onChange={e => setReplies(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-foreground">Coverage Articles Secured</label>
                <Input
                  type="number"
                  value={coverageSecured}
                  onChange={e => setCoverageSecured(Number(e.target.value))}
                />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add Channel Row
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
