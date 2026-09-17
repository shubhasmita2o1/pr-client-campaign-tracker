import React, { useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useClient, useUpdateClient } from '@/hooks/useClients'
import { useClientMeetings } from '@/hooks/useMeetings'
import { useClientTranscripts } from '@/hooks/useTranscripts'
import { useClientCampaigns } from '@/hooks/useCampaigns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ClientStatusBadge } from '@/components/shared/StatusBadge'
import { MeetingTimeline } from '@/components/clients/MeetingTimeline'
import { ProposalAttachmentList } from '@/components/clients/ProposalAttachmentList'
import { MultiPartViewer } from '@/components/transcripts/MultiPartViewer'
import { MeetingDetailModal } from '@/components/meetings/MeetingDetailModal'
import { MeetingFormModal } from '@/components/meetings/MeetingFormModal'
import { ClientFormModal } from '@/components/clients/ClientFormModal'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import {
  ArrowLeft,
  Calendar,
  FileText,
  FileDown,
  Megaphone,
  Globe,
  Mail,
  User,
  Edit3,
  ExternalLink,
  Building2,
  Phone,
  Plus,
  Clock,
  Sparkles
} from 'lucide-react'
import { Meeting } from '@/types/meeting'
import { ClientStatus } from '@/types/client'
import { toast } from 'sonner'

export const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentTab = searchParams.get('tab') || 'overview'
  const activeTranscriptId = searchParams.get('trId')

  const { data: client, isLoading: clientLoading } = useClient(id)
  const { data: meetings = [] } = useClientMeetings(id)
  const { data: transcripts = [] } = useClientTranscripts(id)
  const { data: clientCampaigns = [] } = useClientCampaigns(id)
  const updateClientMutation = useUpdateClient()

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [meetingModalOpen, setMeetingModalOpen] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [editClientOpen, setEditClientOpen] = useState(false)

  // Selected transcript inside the transcript tab
  const [selectedTranscriptIndex, setSelectedTranscriptIndex] = useState(0)

  // If a trId query param was supplied, point to that transcript
  React.useEffect(() => {
    if (activeTranscriptId && transcripts.length > 0) {
      const idx = transcripts.findIndex(t => t.id === activeTranscriptId)
      if (idx !== -1) setSelectedTranscriptIndex(idx)
    }
  }, [activeTranscriptId, transcripts])

  const handleTabChange = (val: string) => {
    setSearchParams({ tab: val })
  }

  const handleOpenMeeting = (m: Meeting) => {
    setSelectedMeeting(m)
    setMeetingModalOpen(true)
  }

  const handleStatusChange = async (newStatus: ClientStatus) => {
    if (!client) return
    try {
      await updateClientMutation.mutateAsync({
        id: client.id,
        data: { status: newStatus }
      })
      toast.success(`Client status updated to ${newStatus.toUpperCase()}`)
    } catch {
      toast.error('Failed to change status.')
    }
  }

  if (clientLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="py-16 text-center space-y-3">
        <h3 className="text-lg font-semibold">Client Dossier Not Found</h3>
        <p className="text-xs text-muted-foreground">
          The requested client record may have been removed or does not exist.
        </p>
        <Button size="sm" onClick={() => navigate('/clients')}>
          Back to Client Directory
        </Button>
      </div>
    )
  }

  const activeTranscript = transcripts[selectedTranscriptIndex] || transcripts[0]

  return (
    <div className="space-y-6">
      {/* Top back navigation and quick action buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Clients Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            onClick={() => setScheduleModalOpen(true)}
            className="h-7 text-xs gap-1"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Schedule Briefing</span>
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => setEditClientOpen(true)}
            className="h-7 text-xs gap-1"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* Client Master Card */}
      <Card className="border-border/80 overflow-hidden shadow-2xs">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Left Brand Identity */}
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-border/70 bg-muted/60 flex items-center justify-center shadow-xs">
                {client.logo ? (
                  <img src={client.logo} alt={client.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-bold text-lg text-primary">
                    {client.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {client.name}
                  </h2>
                  <ClientStatusBadge status={client.status} />
                  <Badge variant="outline" className="text-xs">
                    {client.tier} Retainer
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground">
                  {client.company} &bull; Joined {new Date(client.joinedDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </p>

                <div className="flex items-center gap-3 pt-1 flex-wrap text-xs">
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>{client.website.replace('https://', '')}</span>
                  </a>
                  <span className="text-muted-foreground">&bull;</span>
                  <span className="text-muted-foreground">{client.industry}</span>
                </div>
              </div>
            </div>

            {/* Right: Retainer MRR and PR Lead */}
            <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-border/60 gap-4">
              <div className="text-left md:text-right">
                <p className="text-xs text-muted-foreground font-mono">Retainer Value</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(client.retainerMonthly)}
                  <span className="text-xs font-normal text-muted-foreground">/mo</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={client.owner.avatar} />
                  <AvatarFallback className="text-[10px]">
                    {client.owner.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left md:text-right">
                  <p className="text-xs font-semibold leading-tight text-foreground">{client.owner.name}</p>
                  <p className="text-[10px] text-muted-foreground">{client.owner.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags bar */}
          <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {client.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-[10px] font-normal py-0">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Inline Quick Status Switcher */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Change Status:</span>
              <button
                onClick={() => handleStatusChange('active')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  client.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleStatusChange('prospect')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  client.status === 'prospect'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                Prospect
              </button>
              <button
                onClick={() => handleStatusChange('churned')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  client.status === 'churned'
                    ? 'bg-muted text-foreground font-bold'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                Churned
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs Navigation */}
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full justify-start h-11 p-1 bg-muted/50 border border-border/80 rounded-xl overflow-x-auto">
          <TabsTrigger value="overview" className="text-xs gap-1.5 px-4 py-2">
            <Building2 className="h-3.5 w-3.5" />
            <span>Overview &amp; Contacts</span>
          </TabsTrigger>
          <TabsTrigger value="meetings" className="text-xs gap-1.5 px-4 py-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Meeting History ({meetings.length})</span>
          </TabsTrigger>
          <TabsTrigger value="transcripts" className="text-xs gap-1.5 px-4 py-2">
            <FileText className="h-3.5 w-3.5" />
            <span>Call Transcripts ({transcripts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="proposals" className="text-xs gap-1.5 px-4 py-2">
            <FileDown className="h-3.5 w-3.5" />
            <span>Proposals &amp; Attachments ({client.proposalDocs.length})</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs gap-1.5 px-4 py-2">
            <Megaphone className="h-3.5 w-3.5" />
            <span>Outreach Campaigns ({clientCampaigns.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview & Contacts */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Spokesperson Info */}
            <Card className="border-border/80">
              <CardContent className="p-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Authorized Spokesperson / Media Contact
                </h4>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2 text-xs">
                    <User className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">{client.primaryContact.name}</p>
                      <p className="text-muted-foreground text-[11px]">{client.primaryContact.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <a
                      href={`mailto:${client.primaryContact.email}`}
                      className="text-foreground hover:text-primary transition-colors truncate"
                    >
                      {client.primaryContact.email}
                    </a>
                  </div>

                  {client.primaryContact.phone && (
                    <div className="flex items-center gap-2 text-xs">
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{client.primaryContact.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Strategic Notes */}
            <Card className="md:col-span-2 border-border/80">
              <CardContent className="p-5 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Strategic PR Goals &amp; Embargo Protocol
                </h4>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/60">
                  {client.notes || 'No internal strategic notes recorded yet.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Meetings (Timeline + Table) */}
        <TabsContent value="meetings" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Meetings &amp; Editorial Sessions
            </h3>
            <Button
              size="xs"
              onClick={() => setScheduleModalOpen(true)}
              className="h-7 text-xs gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>Schedule New Meeting</span>
            </Button>
          </div>

          <MeetingTimeline meetings={meetings} onOpenMeeting={handleOpenMeeting} />
        </TabsContent>

        {/* Tab 3: Transcripts (Multi-Part Viewer) */}
        <TabsContent value="transcripts" className="space-y-4 mt-4">
          {transcripts.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
              No recorded transcripts for this client yet. Transcripts are auto-generated from recorded meetings.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Transcript selector pills if multiple exist */}
              {transcripts.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs text-muted-foreground shrink-0 font-medium">
                    Select Transcript:
                  </span>
                  {transcripts.map((tr, idx) => (
                    <Button
                      key={tr.id}
                      size="xs"
                      variant={selectedTranscriptIndex === idx ? 'default' : 'outline'}
                      onClick={() => setSelectedTranscriptIndex(idx)}
                      className="h-7 text-xs shrink-0 gap-1.5"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span className="truncate max-w-[200px]">{tr.title}</span>
                      <span className="text-[10px] opacity-75 font-mono">
                        ({new Date(tr.date).toLocaleDateString()})
                      </span>
                    </Button>
                  ))}
                </div>
              )}

              {activeTranscript && <MultiPartViewer transcript={activeTranscript} />}
            </div>
          )}
        </TabsContent>

        {/* Tab 4: Proposals & Attachments */}
        <TabsContent value="proposals" className="mt-4">
          <ProposalAttachmentList
            clientId={client.id}
            clientName={client.name}
            documents={client.proposalDocs}
          />
        </TabsContent>

        {/* Tab 5: Campaigns */}
        <TabsContent value="campaigns" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Client Outreach Campaigns ({clientCampaigns.length})
            </h3>
            <Button
              size="xs"
              onClick={() => navigate('/campaigns')}
              className="h-7 text-xs gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>Launch Campaign</span>
            </Button>
          </div>

          {clientCampaigns.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
              No dedicated campaigns launched for this client yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientCampaigns.map(camp => (
                <Card
                  key={camp.id}
                  onClick={() => navigate(`/campaigns/${camp.id}`)}
                  className="hover:border-primary/50 cursor-pointer transition-all border-border/80"
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">
                        {camp.type}
                      </Badge>
                      <Badge variant="success" className="text-[10px] capitalize">
                        {camp.status}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                      {camp.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Timeline: {camp.startDate} &rarr; {camp.endDate}
                    </p>
                    <div className="pt-2 border-t flex items-center justify-between text-xs">
                      <span>{camp.metrics.length} Target Channels</span>
                      <span className="text-primary font-medium flex items-center gap-1">
                        View Metrics &rarr;
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Meeting Detail Modal */}
      <MeetingDetailModal
        meeting={selectedMeeting}
        open={meetingModalOpen}
        onOpenChange={setMeetingModalOpen}
      />

      {/* Schedule Meeting Modal */}
      <MeetingFormModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        defaultClientId={client.id}
      />

      {/* Edit Client Modal */}
      <ClientFormModal
        open={editClientOpen}
        onOpenChange={setEditClientOpen}
        clientToEdit={client}
      />
    </div>
  )
}
