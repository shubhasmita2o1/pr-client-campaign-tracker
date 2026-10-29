import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  Calendar,
  Megaphone,
  FileText,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  Clock,
  ArrowUpRight,
  Kanban,
  PieChart,
  Flame,
  LayoutDashboard
} from 'lucide-react'
import { useQuickStats, useRecentActivities } from '@/hooks/useDashboard'
import { useMeetings } from '@/hooks/useMeetings'
import { useCampaigns } from '@/hooks/useCampaigns'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { MeetingDetailModal } from '@/components/meetings/MeetingDetailModal'
import { MeetingFormModal } from '@/components/meetings/MeetingFormModal'
import { ClientFormModal } from '@/components/clients/ClientFormModal'
import { ScreenshotAiExtractorModal } from '@/components/campaigns/ScreenshotAiExtractorModal'
import { Meeting } from '@/types/meeting'
import { TranscriptStatusBadge } from '@/components/shared/StatusBadge'
import { MeetingsSixMonthChart } from '@/features/dashboard/MeetingsSixMonthChart'
import { CampaignPerformanceChart } from '@/features/dashboard/CampaignPerformanceChart'
import { LatestProposalsWidget } from '@/features/dashboard/LatestProposalsWidget'
import { DealPipelineBoard } from '@/components/dashboard/DealPipelineBoard'
import { MediaChannelsWidget } from '@/components/dashboard/MediaChannelsWidget'
import { TeamActivityHeatmap } from '@/components/dashboard/TeamActivityHeatmap'
import { Skeleton } from '@/components/ui/skeleton'

type DashboardViewTab = 'overview' | 'pipeline' | 'channels' | 'velocity'

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { data: stats, isLoading: statsLoading } = useQuickStats()
  const { data: activities = [] } = useRecentActivities()
  const { data: allMeetings = [] } = useMeetings()
  const { data: campaigns = [] } = useCampaigns()

  const [activeTab, setActiveTab] = useState<DashboardViewTab>('overview')
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [meetingModalOpen, setMeetingModalOpen] = useState(false)
  const [newMeetingOpen, setNewMeetingOpen] = useState(false)
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [screenshotModalOpen, setScreenshotModalOpen] = useState(false)

  // Filter upcoming meetings
  const now = new Date().toISOString()
  const upcomingMeetings = allMeetings
    .filter((m) => m.date >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  // Top active campaigns
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').slice(0, 4)

  const handleOpenMeeting = (m: Meeting) => {
    setSelectedMeeting(m)
    setMeetingModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Top Header with Ronas IT CRM styling */}
      <PageHeader
        title="Agency Operations &amp; Client CRM"
        description="Unified oversight of active enterprise retainers, inbound deal pipeline, media briefings, and transcript intelligence."
        badge={
          <Badge
            variant="sage"
            className="text-xs font-semibold px-2.5 py-0.5 border"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            Live CRM Active
          </Badge>
        }
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/imports')}
          className="text-xs gap-1.5 h-8.5 rounded-xl border-border/80 shadow-2xs hover:bg-secondary"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Import XLSX</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setScreenshotModalOpen(true)}
          className="text-xs gap-1.5 h-8.5 rounded-xl border-border/80 shadow-2xs hover:bg-secondary"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>AI Metric Scan</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setNewMeetingOpen(true)}
          className="text-xs gap-1.5 h-8.5 rounded-xl border-border/80 shadow-2xs hover:bg-secondary"
        >
          <Calendar className="h-3.5 w-3.5 text-sky-500" />
          <span>Schedule Briefing</span>
        </Button>
        <Button
          size="sm"
          onClick={() => setNewClientOpen(true)}
          className="text-xs gap-1.5 h-8.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-subtle font-semibold"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Client</span>
        </Button>
      </PageHeader>

      {/* Ronas IT Segmented Tab Switcher */}
      <div className="flex items-center justify-between border-b border-border/70 pb-1 overflow-x-auto">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/50 border border-border/70 shadow-2xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-card text-foreground shadow-subtle border border-border/60'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-card text-foreground shadow-subtle border border-border/60'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Kanban className="h-3.5 w-3.5 text-sky-500" />
            <span>Deal &amp; Retainer Pipeline</span>
            <Badge variant="sage" className="text-[10px] h-4 px-1 py-0 ml-1">
              8 Deals
            </Badge>
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'channels'
                ? 'bg-card text-foreground shadow-subtle border border-border/60'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <PieChart className="h-3.5 w-3.5 text-purple-500" />
            <span>Media Channels &amp; Reach</span>
          </button>

          <button
            onClick={() => setActiveTab('velocity')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'velocity'
                ? 'bg-card text-foreground shadow-subtle border border-border/60'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span>Outreach Velocity Heatmap</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Active Agency Target: <b>$200,000</b>
          </span>
        </div>
      </div>

      {/* KPI Stats Grid (Present in all views for instant situational awareness) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </>
        ) : (
          <>
            <StatCard
              title="Active Retainers"
              value={stats ? stats.activeClientsCount : '10'}
              subtext="7 Enterprise, 3 Growth Tier"
              trend={{ value: 14.2, isPositive: true }}
              icon={<Users className="h-4 w-4 text-primary" />}
              sparkData={[45, 60, 50, 75, 95]}
            />
            <StatCard
              title="Briefings in Queue"
              value={stats ? stats.upcomingMeetingsCount : '32'}
              subtext="Cal.com & Google Calendar synced"
              trend={{ value: 8.5, isPositive: true }}
              icon={<Calendar className="h-4 w-4 text-sky-500" />}
              sparkData={[30, 45, 65, 80, 88]}
            />
            <StatCard
              title="Live Outreach Campaigns"
              value={stats ? stats.campaignsThisMonthCount : '8'}
              subtext="74 Tier-1 Press Hits Secured"
              trend={{ value: 22.0, isPositive: true }}
              icon={<Megaphone className="h-4 w-4 text-amber-500" />}
              sparkData={[55, 65, 70, 85, 92]}
            />
            <StatCard
              title="Transcripts for Review"
              value={stats ? stats.pendingTranscriptsCount : '4'}
              subtext="Read AI sync complete"
              trend={{ value: 5.0, isPositive: false }}
              icon={<FileText className="h-4 w-4 text-purple-500" />}
              sparkData={[70, 60, 40, 50, 45]}
            />
          </>
        )}
      </div>

      {/* CONDITIONAL TAB CONTENT */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <DealPipelineBoard />
        </div>
      )}

      {activeTab === 'channels' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <MediaChannelsWidget />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CampaignPerformanceChart />
            <MeetingsSixMonthChart />
          </div>
        </div>
      )}

      {activeTab === 'velocity' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <TeamActivityHeatmap />
          <DealPipelineBoard />
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Financial & Coverage Highlight Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border/80 bg-gradient-to-br from-card via-card to-emerald-500/5 shadow-subtle">
              <CardContent className="p-5 sm:p-6 flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Monthly Retainer MRR Book
                  </span>
                  <h3 className="text-3xl font-extrabold text-foreground tracking-tight tabular-nums">
                    {stats ? formatCurrency(stats.totalRetainerMRR) : '$170,500'}
                    <span className="text-xs font-normal text-muted-foreground"> / month</span>
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1 font-semibold">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" /> +18.4% YoY Agency Retainer Expansion
                  </p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-primary border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <DollarSign className="h-7 w-7" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-gradient-to-br from-card via-card to-sky-500/5 shadow-subtle">
              <CardContent className="p-5 sm:p-6 flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Total Press Placements Secured
                  </span>
                  <h3 className="text-3xl font-extrabold text-foreground tracking-tight tabular-nums">
                    {stats ? formatNumber(stats.totalCoverageSecured) : '82'}
                    <span className="text-xs font-normal text-muted-foreground"> verified articles</span>
                  </h3>
                  <p className="text-xs text-sky-700 dark:text-sky-300 flex items-center gap-1 font-semibold">
                    <Sparkles className="h-3.5 w-3.5 text-sky-500" /> Bloomberg, WSJ, Wired, Forbes &amp; CNBC
                  </p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0">
                  <Megaphone className="h-7 w-7" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deal Board Live Feature (Directly from Ronas IT Shot) */}
          <DealPipelineBoard />

          {/* Two Enterprise Recharts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MeetingsSixMonthChart />
            <CampaignPerformanceChart />
          </div>

          {/* Channels & Team Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MediaChannelsWidget />
            <TeamActivityHeatmap />
          </div>

          {/* Middle Layout: Upcoming Meetings, Active Campaigns, Latest Proposals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Upcoming Meetings & Active Campaigns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Meetings Card */}
              <Card className="border-border/80 shadow-subtle">
                <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60 bg-card/60">
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">
                      Upcoming Client Media Briefings
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Scheduled reporter interviews, rehearsal syncs, and press debriefs
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => navigate('/meetings')}
                    className="text-xs gap-1 text-primary hover:text-primary/80 font-medium"
                  >
                    <span>View All ({allMeetings.length})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2.5 p-4 sm:p-5 pt-4">
                  {upcomingMeetings.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border/70 rounded-xl">
                      No upcoming briefings in the immediate queue.
                    </div>
                  ) : (
                    upcomingMeetings.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleOpenMeeting(m)}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 hover:border-primary/40 bg-card hover:bg-secondary/40 cursor-pointer transition-all duration-200 group shadow-2xs"
                      >
                        <div className="space-y-1 truncate pr-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                              {m.clientName}
                            </span>
                            <span className="text-xs text-muted-foreground">&bull;</span>
                            <Badge variant="outline" className="text-[10px] py-0 font-normal">
                              {m.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate font-medium">
                            {m.title}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 text-right">
                          <div className="text-xs">
                            <p className="font-mono font-semibold text-foreground">
                              {new Date(m.date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {new Date(m.date).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <TranscriptStatusBadge status={m.transcriptStatus} />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Active Campaigns Quick Table */}
              <Card className="border-border/80 shadow-subtle">
                <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60 bg-card/60">
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">
                      Active PR Outreach Campaigns
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Real-time open rates, reporter replies, and secured features
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => navigate('/campaigns')}
                    className="text-xs gap-1 text-primary hover:text-primary/80 font-medium"
                  >
                    <span>All Campaigns</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3 p-4 sm:p-5 pt-4">
                  {activeCampaigns.map((c) => {
                    const totalPitched = c.metrics.reduce((s, m) => s + m.pitched, 0)
                    const totalReplies = c.metrics.reduce((s, m) => s + m.replies, 0)
                    const totalCoverage = c.metrics.reduce((s, m) => s + m.coverageSecured, 0)
                    const rate = totalPitched > 0 ? (totalReplies / totalPitched) * 100 : 0

                    return (
                      <div
                        key={c.id}
                        onClick={() => navigate(`/campaigns/${c.id}`)}
                        className="p-3.5 rounded-xl border border-border/70 hover:border-primary/40 bg-card hover:bg-secondary/40 cursor-pointer transition-all duration-200 space-y-2 group shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                              {c.title}
                            </h4>
                            <p className="text-[11px] text-muted-foreground">
                              Client: {c.clientName || 'General Agency'} &bull; Lead: {c.owner}
                            </p>
                          </div>
                          <Badge variant="sage" className="text-[10px] font-semibold">
                            Live Outreach
                          </Badge>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center text-xs pt-2 border-t border-border/50">
                          <div>
                            <span className="text-[10px] text-muted-foreground">Pitched</span>
                            <p className="font-bold text-foreground tabular-nums">{totalPitched}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground">Replies</span>
                            <p className="font-bold text-foreground tabular-nums">{totalReplies}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground">Coverage</span>
                            <p className="font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                              {totalCoverage}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground">Reply Rate</span>
                            <p className="font-bold text-foreground tabular-nums">{rate.toFixed(0)}%</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Latest Proposals Widget */}
              <LatestProposalsWidget />
            </div>

            {/* Right 1 Col: Agency Activity Feed */}
            <div className="space-y-6">
              <Card className="border-border/80 shadow-subtle">
                <CardHeader className="pb-3 border-b border-border/60 bg-card/60">
                  <CardTitle className="text-base font-bold text-foreground">
                    Agency Activity Stream
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Audit trail of transcripts, proposals, and pipeline events
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-5 pt-4">
                  {activities.slice(0, 8).map((act) => (
                    <div key={act.id} className="flex items-start gap-3 text-xs">
                      <div className="h-7 w-7 rounded-full bg-secondary border border-border/60 flex items-center justify-center font-bold text-[10px] shrink-0 text-foreground">
                        {act.userName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-foreground truncate">
                            {act.title}
                          </span>
                          {act.badgeLabel && (
                            <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono shrink-0">
                              {act.badgeLabel}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed line-clamp-2">
                          {act.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground/80 font-mono pt-0.5">
                          {new Date(act.timestamp).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}{' '}
                          &bull; {act.userName}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <MeetingDetailModal
        meeting={selectedMeeting}
        open={meetingModalOpen}
        onOpenChange={setMeetingModalOpen}
      />
      <MeetingFormModal open={newMeetingOpen} onOpenChange={setNewMeetingOpen} />
      <ClientFormModal open={newClientOpen} onOpenChange={setNewClientOpen} />
      {campaigns[0] && (
        <ScreenshotAiExtractorModal
          campaign={campaigns[0]}
          open={screenshotModalOpen}
          onOpenChange={setScreenshotModalOpen}
        />
      )}
    </div>
  )
}
