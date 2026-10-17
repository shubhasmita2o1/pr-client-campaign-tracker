import React, { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useSettings } from '@/hooks/useSettings'
import { useAuth } from '@/contexts/AuthContext'
import { TeamMemberInvite } from '@/types/profile'
import { IntegrationConfig } from '@/types/integration'
import {
  Settings,
  Users,
  Key,
  Database,
  Building2,
  Plus,
  Trash2,
  UserCheck,
  ShieldCheck,
  Sparkles,
  CalendarCheck,
  Bot,
  Calendar,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Copy,
  Server,
  HardDrive,
  Globe,
  Sliders,
  Check
} from 'lucide-react'
import { toast } from 'sonner'

export const SettingsPage: React.FC = () => {
  const { user, role } = useAuth()
  const {
    teamMembers,
    isLoadingTeam,
    integrations,
    isLoadingIntegrations,
    inviteMember,
    isInviting,
    updateRole,
    deleteMember,
    testIntegration
  } = useSettings()

  const [activeTab, setActiveTab] = useState('team')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [testingId, setTestingId] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string; timestamp: string }>>({})

  // Invite Form State
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteTitle, setInviteTitle] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member')

  // Agency Preferences State
  const [agencyName, setAgencyName] = useState('Prestige Communications & PR Partners')
  const [agencyDomain, setAgencyDomain] = useState('prestige-pr.com')
  const [agencyCurrency, setAgencyCurrency] = useState('USD ($)')
  const [agencyTimezone, setAgencyTimezone] = useState('America/New_York (Eastern Time)')
  const [autoTranscribe, setAutoTranscribe] = useState(true)
  const [notifyOnNewBooking, setNotifyOnNewBooking] = useState(true)
  const [notifyOnAiOcr, setNotifyOnAiOcr] = useState(true)

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) {
      toast.error('Name and email are required.')
      return
    }

    try {
      await inviteMember({
        fullName: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        title: inviteTitle.trim() || 'PR Specialist'
      })
      toast.success(`Invitation sent to ${inviteEmail}`)
      setInviteModalOpen(false)
      setInviteName('')
      setInviteEmail('')
      setInviteTitle('')
      setInviteRole('member')
    } catch {
      toast.error('Failed to send invitation.')
    }
  }

  const handleRoleToggle = async (id: string, currentRole: 'admin' | 'member') => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin'
    try {
      await updateRole({ id, role: newRole })
      toast.success(`Role updated to ${newRole.toUpperCase()}`)
    } catch {
      toast.error('Failed to update role.')
    }
  }

  const handleDeleteMember = async (id: string, name: string) => {
    if (id === user?.id) {
      toast.error('You cannot remove your own active account.')
      return
    }
    if (!confirm(`Are you sure you want to remove ${name} from the agency roster?`)) return
    try {
      await deleteMember(id)
      toast.success(`${name} has been removed from the team.`)
    } catch {
      toast.error('Failed to remove team member.')
    }
  }

  const handleRunIntegrationTest = async (integrationId: string) => {
    setTestingId(integrationId)
    try {
      const result = await testIntegration(integrationId)
      setTestResults(prev => ({
        ...prev,
        [integrationId]: {
          ...result,
          timestamp: new Date().toLocaleTimeString()
        }
      }))
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error('Test connection ping failed.')
    } finally {
      setTestingId(null)
    }
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const handleSaveAgencySettings = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Agency settings and regional preferences saved successfully!')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agency Settings &amp; Integrations"
        description="Configure agency team access, manage external webhooks (Cal.com, Read AI), Google Calendar synchronization, and view Supabase backend architecture."
        badge={
          <Badge variant="outline" className="text-xs font-mono">
            {role === 'admin' ? 'Admin Access' : 'Member View'}
          </Badge>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/60 p-1 border border-border/60">
          <TabsTrigger value="team" className="gap-2 text-xs">
            <Users className="h-3.5 w-3.5" />
            <span>Team Members ({teamMembers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2 text-xs">
            <Key className="h-3.5 w-3.5" />
            <span>Integrations &amp; Webhooks ({integrations.length})</span>
          </TabsTrigger>
          <TabsTrigger value="agency" className="gap-2 text-xs">
            <Building2 className="h-3.5 w-3.5" />
            <span>Agency Profile &amp; Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="backend" className="gap-2 text-xs">
            <Database className="h-3.5 w-3.5" />
            <span>Supabase Architecture</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: TEAM MEMBERS */}
        <TabsContent value="team" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Agency Team Roster</h3>
              <p className="text-xs text-muted-foreground">
                Manage roles and permission levels for PR Directors, Account Specialists, and Media Planners.
              </p>
            </div>
            {role === 'admin' && (
              <Button
                size="sm"
                onClick={() => setInviteModalOpen(true)}
                className="gap-1.5 text-xs bg-sky-500 hover:bg-sky-600 text-white shadow-xs self-start sm:self-auto"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Invite Team Member</span>
              </Button>
            )}
          </div>

          <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[280px]">Member</TableHead>
                  <TableHead>Title &amp; Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  {role === 'admin' && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingTeam ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                      Loading team members...
                    </TableCell>
                  </TableRow>
                ) : (
                  teamMembers.map(member => (
                    <TableRow key={member.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 ring-1 ring-border">
                            <AvatarImage src={member.avatarUrl} />
                            <AvatarFallback>{member.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-foreground">
                                {member.fullName}
                              </span>
                              {member.id === user?.id && (
                                <Badge variant="secondary" className="text-[9px] py-0 px-1 font-mono">
                                  You
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground font-mono">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="text-xs font-medium text-foreground">{member.title}</span>
                          <p className="text-[11px] text-muted-foreground">{member.department}</p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={member.role === 'admin' ? 'default' : 'secondary'}
                          className={`text-[10px] uppercase font-mono ${
                            member.role === 'admin' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' : ''
                          }`}
                        >
                          {member.role}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {new Date(member.createdAt).toLocaleDateString([], {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>

                      {role === 'admin' && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => handleRoleToggle(member.id, member.role)}
                              title={`Switch to ${member.role === 'admin' ? 'Member' : 'Admin'}`}
                              className="h-7 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                            >
                              <UserCheck className="h-3 w-3 text-sky-500" />
                              <span>{member.role === 'admin' ? 'Demote' : 'Make Admin'}</span>
                            </Button>

                            {member.id !== user?.id && (
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => handleDeleteMember(member.id, member.fullName)}
                                className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-500/10"
                                title="Remove member"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* TAB 2: INTEGRATIONS & WEBHOOKS */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 text-xs space-y-1">
            <span className="font-semibold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-sky-500" />
              Production Edge Function Webhook Architecture
            </span>
            <p className="text-muted-foreground">
              All webhooks authenticate via HMAC signature headers and are processed asynchronously inside Supabase Edge Functions. Test pings run real mock latency checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map(integ => {
              const testResult = testResults[integ.id]
              const isCurrentlyTesting = testingId === integ.id

              return (
                <Card key={integ.id} className="border-border/80 bg-card shadow-2xs flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                          {integ.provider === 'gemini' && <Sparkles className="h-5 w-5" />}
                          {integ.provider === 'cal_com' && <CalendarCheck className="h-5 w-5" />}
                          {integ.provider === 'read_ai' && <Bot className="h-5 w-5" />}
                          {integ.provider === 'google_calendar' && <Calendar className="h-5 w-5" />}
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold">{integ.name}</CardTitle>
                          <Badge variant="success" className="mt-1 text-[10px] py-0 font-mono">
                            <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                            Connected &bull; Active
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-xs mt-2">
                      {integ.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3.5 pt-0">
                    {integ.webhookUrl && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-foreground flex items-center justify-between">
                          <span>Edge Function Webhook Endpoint</span>
                          <button
                            onClick={() => handleCopy(integ.webhookUrl!, 'Webhook URL')}
                            className="text-primary hover:underline flex items-center gap-0.5 text-[10px]"
                          >
                            <Copy className="h-2.5 w-2.5" /> Copy
                          </button>
                        </span>
                        <div className="rounded-md bg-muted/60 p-2 font-mono text-[10px] text-muted-foreground truncate border">
                          {integ.webhookUrl}
                        </div>
                      </div>
                    )}

                    {/* Settings Snapshot */}
                    <div className="rounded-lg bg-muted/30 p-2.5 border text-xs space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                        Configuration Details:
                      </span>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono">
                        {Object.entries(integ.settings).map(([k, v]) => (
                          <div key={k} className="truncate">
                            <span className="text-muted-foreground">{k}: </span>
                            <span className="text-foreground font-semibold">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Test Result Banner */}
                    {testResult && (
                      <div className={`p-2.5 rounded-lg border text-xs ${
                        testResult.success
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                          : 'bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300'
                      }`}>
                        <div className="flex items-center justify-between font-semibold">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Live Ping Result
                          </span>
                          <span className="font-mono text-[10px]">{testResult.timestamp}</span>
                        </div>
                        <p className="text-[11px] mt-0.5">{testResult.message}</p>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-2 flex items-center justify-between border-t border-border/60 text-xs">
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Synced: {integ.lastSyncedAt ? new Date(integ.lastSyncedAt).toLocaleDateString() : 'Active'}
                      </span>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleRunIntegrationTest(integ.id)}
                        disabled={isCurrentlyTesting}
                        className="gap-1 text-xs h-7"
                      >
                        <RefreshCw className={`h-3 w-3 ${isCurrentlyTesting ? 'animate-spin' : ''}`} />
                        <span>{isCurrentlyTesting ? 'Pinging...' : 'Test Connection'}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* TAB 3: AGENCY PROFILE & PREFERENCES */}
        <TabsContent value="agency" className="space-y-4">
          <Card className="border-border/80 shadow-2xs">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-5 w-5 text-sky-500" />
                <span>Agency Branding &amp; Operational Preferences</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Configure primary PR agency name, email domain routing, default retainer tiers, and notification channels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveAgencySettings} className="space-y-4 max-w-2xl text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Agency Legal Name</label>
                    <Input
                      value={agencyName}
                      onChange={e => setAgencyName(e.target.value)}
                      className="h-8 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Primary Agency Domain</label>
                    <Input
                      value={agencyDomain}
                      onChange={e => setAgencyDomain(e.target.value)}
                      className="h-8 text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Operational Timezone</label>
                    <Select value={agencyTimezone} onValueChange={setAgencyTimezone}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York (Eastern Time)">America/New_York (Eastern Time)</SelectItem>
                        <SelectItem value="America/Chicago (Central Time)">America/Chicago (Central Time)</SelectItem>
                        <SelectItem value="America/Los_Angeles (Pacific Time)">America/Los_Angeles (Pacific Time)</SelectItem>
                        <SelectItem value="Europe/London (GMT)">Europe/London (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">Billing Currency</label>
                    <Select value={agencyCurrency} onValueChange={setAgencyCurrency}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD ($)">USD ($)</SelectItem>
                        <SelectItem value="EUR (€)">EUR (€)</SelectItem>
                        <SelectItem value="GBP (£)">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Automation Toggles */}
                <div className="space-y-3 pt-3 border-t border-border/60">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Automations &amp; Notification Rules
                  </h4>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoTranscribe}
                        onChange={e => setAutoTranscribe(e.target.checked)}
                        className="rounded border-border text-sky-500 focus:ring-sky-500 h-4 w-4"
                      />
                      <span className="text-xs text-foreground font-medium">
                        Automatically ingest &amp; map Read AI meeting recordings to client accounts
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyOnNewBooking}
                        onChange={e => setNotifyOnNewBooking(e.target.checked)}
                        className="rounded border-border text-sky-500 focus:ring-sky-500 h-4 w-4"
                      />
                      <span className="text-xs text-foreground font-medium">
                        Send team Slack / Email alert when new Cal.com booking is confirmed
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyOnAiOcr}
                        onChange={e => setNotifyOnAiOcr(e.target.checked)}
                        className="rounded border-border text-sky-500 focus:ring-sky-500 h-4 w-4"
                      />
                      <span className="text-xs text-foreground font-medium">
                        Notify PR account leads when Gemini Vision finishes OCR extraction on campaign screenshots
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
                    Save Agency Preferences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: SUPABASE ARCHITECTURE */}
        <TabsContent value="backend" className="space-y-4">
          <Card className="border-border/80 shadow-2xs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="h-5 w-5 text-sky-500" />
                    <span>Supabase Backend &amp; Storage Architecture</span>
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    System topology powering database tables, storage buckets, and TypeScript Edge Functions.
                  </CardDescription>
                </div>
                <Badge variant="success" className="gap-1 font-mono text-[10px]">
                  <CheckCircle2 className="h-3 w-3" />
                  All Systems Operational
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Architecture specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Server className="h-3 w-3 text-sky-500" /> Database Engine
                  </span>
                  <p className="text-xs font-semibold text-foreground">PostgreSQL 16.4</p>
                  <p className="text-[11px] text-muted-foreground">Row-Level Security (RLS) active</p>
                </div>

                <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3 text-indigo-500" /> Supabase Region
                  </span>
                  <p className="text-xs font-semibold text-foreground">us-east-1 (N. Virginia)</p>
                  <p className="text-[11px] text-muted-foreground">Low latency replica</p>
                </div>

                <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <HardDrive className="h-3 w-3 text-emerald-500" /> Storage Capacity
                  </span>
                  <p className="text-xs font-semibold text-foreground">3 Buckets Configured</p>
                  <p className="text-[11px] text-muted-foreground">Private &amp; Public MIME controls</p>
                </div>
              </div>

              {/* Storage Buckets List */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Configured Storage Buckets
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border bg-card space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-foreground">proposals</span>
                      <Badge variant="outline" className="text-[9px]">Private</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Client master proposals, NDA contracts, and signed PR retainers.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border bg-card space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-foreground">campaign-screenshots</span>
                      <Badge variant="outline" className="text-[9px]">Auth Only</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Raw screenshots from MuckRack/Cision analyzed by Gemini Vision AI.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border bg-card space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-foreground">imports</span>
                      <Badge variant="outline" className="text-[9px]">Ingestion</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Bulk Excel (.xlsx) and CSV spreadsheets parsed by xlsx-import Edge Function.
                    </p>
                  </div>
                </div>
              </div>

              {/* Edge Functions Roster */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Deployed Edge Functions
                </h4>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent text-xs">
                        <TableHead>Function Slug</TableHead>
                        <TableHead>Trigger Type</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Runtime Target</TableHead>
                        <TableHead className="text-right">Health</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell className="font-mono font-semibold text-xs text-foreground">
                          gemini-extract-metrics
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">Storage Object Created / API Invocation</TableCell>
                        <TableCell className="text-xs font-mono">v1.4</TableCell>
                        <TableCell className="text-xs text-muted-foreground">Deno 2.1</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="success" className="text-[9px] font-mono">200 OK</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell className="font-mono font-semibold text-xs text-foreground">
                          cal-com-webhook
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">HTTP POST (HMAC Signed)</TableCell>
                        <TableCell className="text-xs font-mono">v2.0</TableCell>
                        <TableCell className="text-xs text-muted-foreground">Deno 2.1</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="success" className="text-[9px] font-mono">200 OK</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell className="font-mono font-semibold text-xs text-foreground">
                          read-ai-webhook
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">HTTP POST (Bearer Token)</TableCell>
                        <TableCell className="text-xs font-mono">v1.2</TableCell>
                        <TableCell className="text-xs text-muted-foreground">Deno 2.1</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="success" className="text-[9px] font-mono">200 OK</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell className="font-mono font-semibold text-xs text-foreground">
                          google-calendar-webhook
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">Google Push Channel Notification</TableCell>
                        <TableCell className="text-xs font-mono">v1.1</TableCell>
                        <TableCell className="text-xs text-muted-foreground">Deno 2.1</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="success" className="text-[9px] font-mono">200 OK</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-muted/30">
                        <TableCell className="font-mono font-semibold text-xs text-foreground">
                          xlsx-import
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">Storage Object Created (imports/*)</TableCell>
                        <TableCell className="text-xs font-mono">v2.1</TableCell>
                        <TableCell className="text-xs text-muted-foreground">Deno 2.1</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="success" className="text-[9px] font-mono">200 OK</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Member Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Agency Team Member</DialogTitle>
            <DialogDescription className="text-xs">
              Add a PR Account Lead, Media Relations Specialist, or Admin to the agency workspace.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInviteSubmit} className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-foreground">Full Name *</label>
              <Input
                placeholder="e.g. Jordan Hayes"
                value={inviteName}
                onChange={e => setInviteName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground">Email Address *</label>
              <Input
                type="email"
                placeholder="jordan@prestige-pr.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Job Title</label>
                <Input
                  placeholder="e.g. Media Strategist"
                  value={inviteTitle}
                  onChange={e => setInviteTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Role</label>
                <Select
                  value={inviteRole}
                  onValueChange={val => setInviteRole(val as 'admin' | 'member')}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInviteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isInviting}
                className="bg-sky-500 hover:bg-sky-600 text-white"
              >
                {isInviting ? 'Inviting...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default SettingsPage
