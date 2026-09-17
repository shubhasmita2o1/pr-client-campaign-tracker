import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useQuickStats, useRecentActivities } from '@/hooks/useDashboard'
import { useMeetings } from '@/hooks/useMeetings'
import { useCampaigns } from '@/hooks/useCampaigns'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { MeetingDetailModal } from '@/components/meetings/MeetingDetailModal'
import { MeetingFormModal } from '@/components/meetings/MeetingFormModal'
import { ClientFormModal } from '@/components/clients/ClientFormModal'
import { Meeting } from '@/types/meeting'
import { TranscriptStatusBadge } from '@/components/shared/StatusBadge'

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

  // Filter upcoming meetings
  const now = new Date().toISOString()
  const upcomingMeetings = allMeetings
    .filter(m => m.date >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  // Top active campaigns
  const activeCampaigns = campaigns.filter(c => c.status === 'active').slice(0, 4)

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
          <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            Live Q3/Q4 Cycle
          </Badge>
        }
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setNewMeetingOpen(true)}
          className="text-xs gap-1.5 h-8"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Schedule Meeting</span>
        </Button>
        <Button
          size="sm"
          onClick={() => setNewClientOpen(true)}
          className="text-xs gap-1.5 h-8 bg-primary shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Client</span>
        </Button>
      </PageHeader>

      {/* Core Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Retainers"
          value={stats ? stats.activeClientsCount : '--'}
          subtext="7 Enterprise, 3 Growth Tier"
          trend={{ value: 14.2, isPositive: true }}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Upcoming Meetings"
          value={stats ? stats.upcomingMeetingsCount : '--'}
          subtext="Next 14 business days"
          trend={{ value: 8.5, isPositive: true }}
          icon={<Calendar className="h-4 w-4 text-sky-500" />}
        />
        <StatCard
          title="Active Campaigns"
          value={stats ? stats.campaignsThisMonthCount : '--'}
          subtext="74 Tier-1 Press Hits Secured"
          trend={{ value: 22.0, isPositive: true }}
          icon={<Megaphone className="h-4 w-4 text-amber-500" />}
        />
        <StatCard
          title="Transcripts Pending"
          value={stats ? stats.pendingTranscriptsCount : '--'}
          subtext="Awaiting AI extraction review"
          trend={{ value: 5.0, isPositive: false }}
          icon={<FileText className="h-4 w-4 text-purple-500" />}
        />
      </div>

      {/* Financial & Coverage Highlight Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/80 bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Agency Retainer Book (MRR)
              </span>
              <h3 className="text-2xl font-bold text-foreground">
                {stats ? formatCurrency(stats.totalRetainerMRR) : '$170,500'}
                <span className="text-xs font-normal text-muted-foreground"> / month</span>
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="h-3.5 w-3.5" /> +18.4% YoY Agency Retainer Expansion
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Coverage Articles Secured
              </span>
              <h3 className="text-2xl font-bold text-foreground">
                {stats ? formatNumber(stats.totalCoverageSecured) : '82'}
                <span className="text-xs font-normal text-muted-foreground"> tier-1 articles</span>
              </h3>
              <p className="text-xs text-sky-600 dark:text-sky-400 flex items-center gap-1 font-medium">
                <Sparkles className="h-3.5 w-3.5" /> Bloomberg, WSJ, Wired, Forbes &amp; CNBC
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Megaphone className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Layout: Upcoming Meetings & Live Outreach Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Meetings & Active Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Meetings Card */}
          <Card className="border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Upcoming Client Meetings</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Scheduled briefings, media rehearsals, and strategy syncs
                </p>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => navigate('/meetings')}
                className="text-xs gap-1 text-primary hover:text-primary"
              >
                <span>View All (32)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0">
              {upcomingMeetings.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No upcoming meetings in the immediate queue.
                </div>
              ) : (
                upcomingMeetings.map(m => (
                  <div
                    key={m.id}
                    onClick={() => handleOpenMeeting(m)}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:border-primary/40 bg-background/50 hover:bg-muted/30 cursor-pointer transition-all group"
                  >
                    <div className="space-y-1 truncate pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
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
                        <p className="font-mono font-medium text-foreground">
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
          <Card className="border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Active PR Outreach Campaigns</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time open rates, reporter replies, and secured features
                </p>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => navigate('/campaigns')}
                className="text-xs gap-1 text-primary hover:text-primary"
              >
                <span>All Campaigns</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {activeCampaigns.map(c => {
                const totalPitched = c.metrics.reduce((s, m) => s + m.pitched, 0)
                const totalReplies = c.metrics.reduce((s, m) => s + m.replies, 0)
                const totalCoverage = c.metrics.reduce((s, m) => s + m.coverageSecured, 0)
                const rate = totalPitched > 0 ? (totalReplies / totalPitched) * 100 : 0

                return (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/campaigns/${c.id}`)}
                    className="p-3 rounded-lg border border-border/60 hover:border-primary/40 bg-background/50 hover:bg-muted/30 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                          {c.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          Client: {c.clientName || 'General Agency'} &bull; Lead: {c.owner}
                        </p>
                      </div>
                      <Badge variant="success" className="text-[10px]">
                        Live
                      </Badge>
                    </div>

                    {/* Mini metrics pill bar */}
                    <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1 border-t border-border/40">
                      <div>
                        <span className="text-[10px] text-muted-foreground">Pitched</span>
                        <p className="font-semibold">{totalPitched}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground">Replies</span>
                        <p className="font-semibold">{totalReplies}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground">Coverage</span>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {totalCoverage}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground">Reply Rate</span>
                        <p className="font-semibold">{rate.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Recent Activity Feed */}
        <div className="space-y-6">
          <Card className="border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Agency Activity Feed</CardTitle>
              <p className="text-xs text-muted-foreground">
                Audit trail of transcripts, proposals, and campaign events
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {activities.slice(0, 8).map(act => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center font-bold text-[10px] shrink-0 text-foreground">
                    {act.userName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground truncate">{act.title}</span>
                      {act.badgeLabel && (
                        <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono shrink-0">
                          {act.badgeLabel}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed line-clamp-2">
                      {act.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono pt-0.5">
                      {new Date(act.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })} &bull; {act.userName}
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
      <MeetingFormModal
        open={newMeetingOpen}
        onOpenChange={setNewMeetingOpen}
      />
      <ClientFormModal
        open={newClientOpen}
        onOpenChange={setNewClientOpen}
      />
    </div>
  )
}
