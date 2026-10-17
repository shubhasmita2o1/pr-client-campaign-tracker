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
  ArrowUpRight
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
import { Skeleton } from '@/components/ui/skeleton'

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { data: stats, isLoading: statsLoading } = useQuickStats()
  const { data: activities = [] } = useRecentActivities()
  const { data: allMeetings = [] } = useMeetings()
  const { data: campaigns = [] } = useCampaigns()

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
      {/* Top Header */}
      <PageHeader
        title="PR Agency Operations Dashboard"
        description="Comprehensive real-time overview of active retainers, upcoming media briefings, multi-part transcripts, and outbound PR campaigns."
        badge={
          <Badge
            variant="outline"
            className="text-xs bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-1.5 animate-pulse" />
            Live Agency Operations
          </Badge>
        }
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/imports')}
          className="text-xs gap-1.5 h-8 border-slate-200 dark:border-slate-800"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
          <span>Import XLSX</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setScreenshotModalOpen(true)}
          className="text-xs gap-1.5 h-8 border-slate-200 dark:border-slate-800"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Extract Metrics (AI)</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setNewMeetingOpen(true)}
          className="text-xs gap-1.5 h-8 border-slate-200 dark:border-slate-800"
        >
          <Calendar className="h-3.5 w-3.5 text-sky-500" />
          <span>Schedule Meeting</span>
        </Button>
        <Button
          size="sm"
          onClick={() => setNewClientOpen(true)}
          className="text-xs gap-1.5 h-8 bg-sky-500 hover:bg-sky-600 text-white shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Client</span>
        </Button>
      </PageHeader>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              title="Active Retainers"
              value={stats ? stats.activeClientsCount : '10'}
              subtext="7 Enterprise, 3 Growth Tier"
              trend={{ value: 14.2, isPositive: true }}
              icon={<Users className="h-4 w-4 text-sky-500" />}
            />
            <StatCard
              title="Meetings This Month"
              value={stats ? stats.upcomingMeetingsCount : '32'}
              subtext="Cal.com & Google Calendar synced"
              trend={{ value: 8.5, isPositive: true }}
              icon={<Calendar className="h-4 w-4 text-indigo-500" />}
            />
            <StatCard
              title="Open Campaigns"
              value={stats ? stats.campaignsThisMonthCount : '8'}
              subtext="74 Tier-1 Press Hits Secured"
              trend={{ value: 22.0, isPositive: true }}
              icon={<Megaphone className="h-4 w-4 text-amber-500" />}
            />
            <StatCard
              title="Transcripts Pending Review"
              value={stats ? stats.pendingTranscriptsCount : '4'}
              subtext="Awaiting Read AI sync review"
              trend={{ value: 5.0, isPositive: false }}
              icon={<FileText className="h-4 w-4 text-purple-500" />}
            />
          </>
        )}
      </div>

      {/* Financial & Coverage Highlight Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/40">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Monthly Retainer MRR Book
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats ? formatCurrency(stats.totalRetainerMRR) : '$170,500'}
                <span className="text-xs font-normal text-slate-400"> / month</span>
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="h-3.5 w-3.5" /> +18.4% YoY Agency Retainer Expansion
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/40">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Press Placements Secured
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats ? formatNumber(stats.totalCoverageSecured) : '82'}
                <span className="text-xs font-normal text-slate-400"> verified articles</span>
              </h3>
              <p className="text-xs text-sky-600 dark:text-sky-400 flex items-center gap-1 font-medium">
                <Sparkles className="h-3.5 w-3.5" /> Bloomberg, WSJ, Wired, Forbes &amp; CNBC
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Megaphone className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Enterprise Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MeetingsSixMonthChart />
        <CampaignPerformanceChart />
      </div>

      {/* Middle Layout: Upcoming Meetings, Active Campaigns, Latest Proposals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Meetings & Active Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Meetings Card */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Upcoming Client Meetings
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scheduled briefings, media rehearsals, and strategy syncs
                </p>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => navigate('/meetings')}
                className="text-xs gap-1 text-sky-600 hover:text-sky-700 dark:text-sky-400"
              >
                <span>View All ({allMeetings.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0">
              {upcomingMeetings.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No upcoming meetings in the immediate queue.
                </div>
              ) : (
                upcomingMeetings.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleOpenMeeting(m)}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 cursor-pointer transition-all group"
                  >
                    <div className="space-y-1 truncate pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {m.clientName}
                        </span>
                        <span className="text-xs text-slate-400">&bull;</span>
                        <Badge variant="outline" className="text-[10px] py-0 font-normal">
                          {m.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 truncate font-medium">
                        {m.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-right">
                      <div className="text-xs">
                        <p className="font-mono font-medium text-slate-900 dark:text-white">
                          {new Date(m.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-[11px] text-slate-500">
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
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                  Active PR Outreach Campaigns
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time open rates, reporter replies, and secured features
                </p>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => navigate('/campaigns')}
                className="text-xs gap-1 text-sky-600 hover:text-sky-700 dark:text-sky-400"
              >
                <span>All Campaigns</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {activeCampaigns.map((c) => {
                const totalPitched = c.metrics.reduce((s, m) => s + m.pitched, 0)
                const totalReplies = c.metrics.reduce((s, m) => s + m.replies, 0)
                const totalCoverage = c.metrics.reduce((s, m) => s + m.coverageSecured, 0)
                const rate = totalPitched > 0 ? (totalReplies / totalPitched) * 100 : 0

                return (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/campaigns/${c.id}`)}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {c.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Client: {c.clientName || 'General Agency'} &bull; Lead: {c.owner}
                        </p>
                      </div>
                      <Badge variant="success" className="text-[10px]">
                        Live
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1 border-t border-slate-200 dark:border-slate-700/60">
                      <div>
                        <span className="text-[10px] text-slate-500">Pitched</span>
                        <p className="font-semibold text-slate-900 dark:text-white">{totalPitched}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Replies</span>
                        <p className="font-semibold text-slate-900 dark:text-white">{totalReplies}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Coverage</span>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {totalCoverage}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Reply Rate</span>
                        <p className="font-semibold text-slate-900 dark:text-white">{rate.toFixed(0)}%</p>
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
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                Agency Activity Feed
              </CardTitle>
              <p className="text-xs text-slate-500">
                Audit trail of transcripts, proposals, and campaign events
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {activities.slice(0, 8).map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0 text-slate-700 dark:text-slate-300">
                    {act.userName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white truncate">
                        {act.title}
                      </span>
                      {act.badgeLabel && (
                        <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono shrink-0">
                          {act.badgeLabel}
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                      {act.description}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono pt-0.5">
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
