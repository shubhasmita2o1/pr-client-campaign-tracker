import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCampaign, useUpdateCampaign } from '@/hooks/useCampaigns'
import { PageHeader } from '@/components/shared/PageHeader'
import { CampaignStatusBadge } from '@/components/shared/StatusBadge'
import { CampaignCopyEditor } from '@/components/campaigns/CampaignCopyEditor'
import { CampaignMetricsTable } from '@/components/campaigns/CampaignMetricsTable'
import { ScreenshotAiExtractorModal } from '@/components/campaigns/ScreenshotAiExtractorModal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber, formatPercent } from '@/lib/utils'
import { CampaignStatus } from '@/types/campaign'
import {
  ArrowLeft,
  Sparkles,
  Upload,
  Calendar,
  Layers,
  Send,
  Eye,
  MessageSquare,
  Award,
  CheckCircle2,
  FileImage,
  ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'

export const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: campaign, isLoading } = useCampaign(id)
  const updateCampaignMutation = useUpdateCampaign()

  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [selectedScreenshotPreview, setSelectedScreenshotPreview] = useState<string | null>(null)

  const handleStatusChange = async (newStatus: CampaignStatus) => {
    if (!campaign) return
    try {
      await updateCampaignMutation.mutateAsync({
        id: campaign.id,
        data: { status: newStatus }
      })
      toast.success(`Campaign status changed to ${newStatus.toUpperCase()}`)
    } catch {
      toast.error('Failed to change status.')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="py-16 text-center space-y-3">
        <h3 className="text-lg font-semibold">Campaign Not Found</h3>
        <p className="text-xs text-muted-foreground">
          The requested PR campaign record does not exist or has been removed.
        </p>
        <Button size="sm" onClick={() => navigate('/campaigns')}>
          Return to Campaigns
        </Button>
      </div>
    )
  }

  // Aggregate calculations
  const totalPitched = campaign.metrics.reduce((s, m) => s + m.pitched, 0)
  const totalImpressions = campaign.metrics.reduce((s, m) => s + m.impressions, 0)
  const totalOpens = campaign.metrics.reduce((s, m) => s + m.opens, 0)
  const totalClicks = campaign.metrics.reduce((s, m) => s + m.clicks, 0)
  const totalReplies = campaign.metrics.reduce((s, m) => s + m.replies, 0)
  const totalCoverage = campaign.metrics.reduce((s, m) => s + m.coverageSecured, 0)
  const responseRate = totalPitched > 0 ? (totalReplies / totalPitched) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/campaigns')}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Campaigns</span>
        </button>

        <div className="flex items-center gap-2">
          {/* AI Screenshot Extractor Trigger Button */}
          <Button
            size="sm"
            onClick={() => setAiModalOpen(true)}
            className="gap-1.5 text-xs bg-primary hover:bg-primary/90 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Extract Metrics with AI</span>
          </Button>
        </div>
      </div>

      {/* Campaign Summary Card */}
      <Card className="border-border/80 overflow-hidden shadow-2xs">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {campaign.title}
                </h2>
                <CampaignStatusBadge status={campaign.status} />
                <Badge variant="outline" className="text-xs">
                  {campaign.type}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span>
                  Client:{' '}
                  {campaign.clientId ? (
                    <button
                      onClick={() => navigate(`/clients/${campaign.clientId}`)}
                      className="font-semibold text-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
                    >
                      {campaign.clientName}
                    </button>
                  ) : (
                    <span className="font-semibold text-foreground">Multi-Client Initiative</span>
                  )}
                </span>
                <span>&bull;</span>
                <span>Lead: {campaign.owner}</span>
                <span>&bull;</span>
                <span className="font-mono">
                  {campaign.startDate} &rarr; {campaign.endDate}
                </span>
              </div>
            </div>

            {/* Quick Status Toggles */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground self-start md:self-auto border border-border/80 rounded-lg p-1 bg-muted/30">
              <span>Status:</span>
              <button
                onClick={() => handleStatusChange('active')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  campaign.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                Live
              </button>
              <button
                onClick={() => handleStatusChange('draft')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  campaign.status === 'draft'
                    ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                Draft
              </button>
              <button
                onClick={() => handleStatusChange('completed')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  campaign.status === 'completed'
                    ? 'bg-muted text-foreground font-bold'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => handleStatusChange('paused')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  campaign.status === 'paused'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                Paused
              </button>
            </div>
          </div>

          {/* Quick Aggregate Stat Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-4 border-t border-border/40">
            <div className="rounded-lg bg-muted/20 p-2.5 border border-border/60">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                <Send className="h-3 w-3" /> Pitched
              </span>
              <p className="text-lg font-bold text-foreground mt-0.5 font-mono">
                {formatNumber(totalPitched)}
              </p>
            </div>

            <div className="rounded-lg bg-muted/20 p-2.5 border border-border/60">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                <Eye className="h-3 w-3" /> Impressions
              </span>
              <p className="text-lg font-bold text-foreground mt-0.5 font-mono">
                {formatNumber(totalImpressions)}
              </p>
            </div>

            <div className="rounded-lg bg-muted/20 p-2.5 border border-border/60">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Opens / Clicks
              </span>
              <p className="text-lg font-bold text-foreground mt-0.5 font-mono">
                {formatNumber(totalOpens)} / {formatNumber(totalClicks)}
              </p>
            </div>

            <div className="rounded-lg bg-muted/20 p-2.5 border border-border/60">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                <MessageSquare className="h-3 w-3" /> Replies
              </span>
              <p className="text-lg font-bold text-foreground mt-0.5 font-mono">
                {formatNumber(totalReplies)}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-500/10 p-2.5 border border-emerald-500/20">
              <span className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Award className="h-3 w-3" /> Coverage
              </span>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                {formatNumber(totalCoverage)} Hits
              </p>
            </div>

            <div className="rounded-lg bg-muted/20 p-2.5 border border-border/60">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Response Rate
              </span>
              <p className="text-lg font-bold text-foreground mt-0.5 font-mono">
                {responseRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Sections: Left is Pitch Copy Editor, Right is Extracted Screenshots Vault */}
      <div className="space-y-6">
        {/* Section 1: Campaign Pitch Copy */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span>Journalist Pitch Angle &amp; Email Copy</span>
            </h3>
            <span className="text-xs text-muted-foreground">Editable Rich Text with Merge Tags</span>
          </div>

          <CampaignCopyEditor campaignId={campaign.id} initialCopy={campaign.copyText} />
        </div>

        {/* Section 2: Performance Metrics Table */}
        <div className="space-y-2 pt-2">
          <CampaignMetricsTable campaign={campaign} />
        </div>

        {/* Section 3: Extracted Screenshots Source Gallery */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileImage className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Verified Dashboard Screenshots &amp; AI Extraction Vault ({campaign.screenshots.length})
              </h3>
            </div>

            <Button
              size="xs"
              variant="outline"
              onClick={() => setAiModalOpen(true)}
              className="h-7 text-xs gap-1.5"
            >
              <Upload className="h-3 w-3" />
              <span>Upload New Screenshot</span>
            </Button>
          </div>

          {campaign.screenshots.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-xl space-y-2 bg-muted/10">
              <FileImage className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-xs text-muted-foreground">
                No analytics screenshots uploaded yet. Click &quot;Extract Metrics with AI&quot; to upload a dashboard snapshot.
              </p>
              <Button size="xs" onClick={() => setAiModalOpen(true)}>
                Upload &amp; Extract
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaign.screenshots.map(sc => (
                <Card key={sc.id} className="border-border/80 overflow-hidden bg-card">
                  <div className="flex flex-col sm:flex-row">
                    {/* Thumbnail */}
                    <div className="sm:w-44 h-36 bg-black/90 overflow-hidden relative shrink-0">
                      <img
                        src={sc.thumbnailUrl}
                        alt={sc.fileName}
                        className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/75 text-[9px] font-mono text-white">
                        {sc.fileSize}
                      </span>
                    </div>

                    {/* Extracted Details */}
                    <div className="p-3.5 flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold truncate text-foreground">
                          {sc.fileName}
                        </p>
                        {sc.extractedMetrics && (
                          <Badge variant="success" className="text-[9px] py-0 font-mono">
                            {sc.extractedMetrics.confidenceScore}% OCR
                          </Badge>
                        )}
                      </div>

                      {sc.extractedMetrics && (
                        <div className="space-y-1 text-xs">
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {sc.extractedMetrics.notes}
                          </p>
                          <div className="flex items-center gap-3 pt-1 text-[11px] text-foreground font-mono">
                            <span>Imp: {formatNumber(sc.extractedMetrics.impressions || 0)}</span>
                            <span>&bull;</span>
                            <span>Replies: {sc.extractedMetrics.replies}</span>
                            <span>&bull;</span>
                            <span className="text-emerald-600 font-bold">
                              Cov: {sc.extractedMetrics.coverageSecured}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="pt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Extracted {new Date(sc.uploadedAt).toLocaleDateString()}</span>
                        <span className="text-primary font-medium flex items-center gap-0.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Synced
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Extraction Modal */}
      <ScreenshotAiExtractorModal
        campaign={campaign}
        open={aiModalOpen}
        onOpenChange={setAiModalOpen}
      />
    </div>
  )
}
