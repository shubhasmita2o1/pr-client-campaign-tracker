import React, { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { MeetingDetailModal } from '@/components/meetings/MeetingDetailModal'
import { MeetingFormModal } from '@/components/meetings/MeetingFormModal'
import { TranscriptStatusBadge } from '@/components/shared/StatusBadge'
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
import { useMeetings } from '@/hooks/useMeetings'
import { useClients } from '@/hooks/useClients'
import { Meeting, MeetingFilters } from '@/types/meeting'
import {
  Calendar as CalendarIcon,
  List,
  Search,
  Plus,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  CalendarCheck,
  FileText
} from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const MeetingsPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialMeetingId = searchParams.get('meetingId')

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list')
  const [filters, setFilters] = useState<MeetingFilters>({
    search: '',
    clientId: 'all',
    transcriptStatus: 'all',
    type: 'all',
    source: 'all'
  })

  // Simulated calendar month: September 2026
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 8, 1))

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)

  const { data: meetings = [], isLoading } = useMeetings(filters)
  const { data: clients = [] } = useClients()

  // Filter meetings by source if selected
  const filteredMeetings = meetings.filter((m) => {
    if (filters.source === 'cal_com') return Boolean(m.calComBookingUid)
    if (filters.source === 'google_calendar') return Boolean(m.gcalEventId)
    if (filters.source === 'manual') return !m.calComBookingUid && !m.gcalEventId
    return true
  })

  // Auto-open meeting if meetingId query param exists
  React.useEffect(() => {
    if (initialMeetingId && meetings.length > 0) {
      const match = meetings.find((m) => m.id === initialMeetingId)
      if (match) {
        setSelectedMeeting(match)
        setDetailModalOpen(true)
      }
    }
  }, [initialMeetingId, meetings])

  const handleOpenMeeting = (m: Meeting) => {
    setSelectedMeeting(m)
    setDetailModalOpen(true)
  }

  const handleExportCSV = () => {
    if (filteredMeetings.length === 0) {
      toast.error('No meetings to export.')
      return
    }

    const headers = [
      'Date & Time',
      'Client',
      'Meeting Title',
      'Type',
      'Duration (Mins)',
      'Location',
      'Transcript Status',
      'Cal.com Booking UID',
      'Google Calendar Event ID',
      'Attendees Count'
    ]

    const rows = filteredMeetings.map((m) => [
      `"${new Date(m.date).toLocaleString()}"`,
      `"${m.clientName}"`,
      `"${m.title}"`,
      `"${m.type}"`,
      m.durationMinutes,
      `"${m.location}"`,
      m.transcriptStatus,
      `"${m.calComBookingUid || ''}"`,
      `"${m.gcalEventId || ''}"`,
      m.attendees.length
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `PR_Agency_Meetings_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(`Exported ${filteredMeetings.length} meetings to CSV`)
  }

  // Generate calendar days for current month
  const year = calendarMonth.getFullYear()
  const month = calendarMonth.getMonth()
  const firstDayIndex = new Date(year, month, 1).getDay() // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const calendarDays = []
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d)
  }

  const getMeetingsForDay = (day: number) => {
    return filteredMeetings.filter((m) => {
      const d = new Date(m.date)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meetings & Editorial Sessions"
        description="Calendar schedule and historical archive of client strategy calls, press rehearsals, and post-launch reviews with linked transcripts."
        badge={
          <Badge variant="outline" className="text-xs font-mono bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800">
            {filteredMeetings.length} Scheduled
          </Badge>
        }
      >
        {/* Toggle List vs Calendar */}
        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800/60 mr-2">
          <Button
            size="xs"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => setViewMode('list')}
            className="h-7 text-xs gap-1"
          >
            <List className="h-3.5 w-3.5" />
            <span>List</span>
          </Button>
          <Button
            size="xs"
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            onClick={() => setViewMode('calendar')}
            className="h-7 text-xs gap-1"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Calendar</span>
          </Button>
        </div>

        <Button
          size="sm"
          onClick={() => setFormModalOpen(true)}
          className="text-xs gap-1.5 h-8 bg-sky-500 hover:bg-sky-600 text-white shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Schedule Meeting</span>
        </Button>
      </PageHeader>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search meetings, attendees, agendas..."
              value={filters.search || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>

          {/* Client Filter */}
          <div className="w-[160px]">
            <Select
              value={filters.clientId || 'all'}
              onValueChange={(val) => setFilters((prev) => ({ ...prev, clientId: val }))}
            >
              <SelectTrigger className="h-8 text-xs border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transcript Status Filter */}
          <div className="w-[160px]">
            <Select
              value={filters.transcriptStatus || 'all'}
              onValueChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  transcriptStatus: val as MeetingFilters['transcriptStatus']
                }))
              }
            >
              <SelectTrigger className="h-8 text-xs border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Transcript Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transcript Status</SelectItem>
                <SelectItem value="has_transcript">Transcript Ready</SelectItem>
                <SelectItem value="pending">Processing</SelectItem>
                <SelectItem value="none">No Transcript</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Integration Source Filter */}
          <div className="w-[160px]">
            <Select
              value={filters.source || 'all'}
              onValueChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  source: val as MeetingFilters['source']
                }))
              }
            >
              <SelectTrigger className="h-8 text-xs border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Calendar Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="cal_com">Cal.com Bookings</SelectItem>
                <SelectItem value="google_calendar">Google Calendar Synced</SelectItem>
                <SelectItem value="manual">Manual Entry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Month Filter */}
          <div className="w-[130px]">
            <Select
              value={filters.month || 'all'}
              onValueChange={(val) => setFilters((prev) => ({ ...prev, month: val }))}
            >
              <SelectTrigger className="h-8 text-xs border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                <SelectItem value="2026-09">Sep 2026</SelectItem>
                <SelectItem value="2026-08">Aug 2026</SelectItem>
                <SelectItem value="2026-07">Jul 2026</SelectItem>
                <SelectItem value="2026-06">Jun 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <span className="text-xs text-slate-500 font-mono">
            Showing {filteredMeetings.length} meetings
          </span>

          <Button
            variant="outline"
            size="xs"
            onClick={handleExportCSV}
            className="h-8 text-xs gap-1 border-slate-200 dark:border-slate-700"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px]">Date &amp; Time</TableHead>
                <TableHead className="w-[160px]">Client</TableHead>
                <TableHead>Meeting Topic / Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source / Sync</TableHead>
                <TableHead>Transcript Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Attendees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-xs text-slate-500">
                    No meetings found matching your filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMeetings.map((m) => (
                  <TableRow
                    key={m.id}
                    onClick={() => handleOpenMeeting(m)}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <TableCell className="font-mono text-xs">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {new Date(m.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(m.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {' '}&bull; {m.durationMinutes}m
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        {m.clientName}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {m.title}
                        </span>
                        {m.notes && (
                          <p className="text-[11px] text-slate-500 truncate max-w-md">
                            {m.notes}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {m.type}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {m.calComBookingUid ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-600 dark:text-sky-400">
                          <CalendarCheck className="h-3 w-3" /> Cal.com
                        </span>
                      ) : m.gcalEventId ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                          <CalendarIcon className="h-3 w-3" /> GCal
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Manual</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <TranscriptStatusBadge status={m.transcriptStatus} />
                    </TableCell>

                    <TableCell className="text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {m.location}
                      </span>
                    </TableCell>

                    <TableCell className="text-right text-xs text-slate-500">
                      <span className="font-medium text-slate-900 dark:text-white">{m.attendees.length}</span> people
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* Calendar View */
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 shadow-2xs">
          {/* Calendar Header Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {calendarMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </h3>
              <Badge variant="secondary" className="text-xs font-normal">
                {filteredMeetings.length} Events
              </Badge>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setCalendarMonth(new Date(2026, 8, 1))}
              >
                Today (Sep 2026)
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 min-h-[500px]">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-28 rounded-lg bg-slate-50/50 dark:bg-slate-800/10 border border-transparent p-1"
                  />
                )
              }

              const dayMeetings = getMeetingsForDay(day)
              const isToday = day === 17 && month === 8 && year === 2026

              return (
                <div
                  key={`day-${day}`}
                  className={`h-28 rounded-lg border p-1.5 flex flex-col transition-colors overflow-hidden ${
                    isToday
                      ? 'border-sky-500/60 bg-sky-50/20 dark:bg-sky-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center font-mono text-[11px] ${
                        isToday
                          ? 'bg-sky-500 text-white font-bold'
                          : 'text-slate-500'
                      }`}
                    >
                      {day}
                    </span>
                    {dayMeetings.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {dayMeetings.length}
                      </span>
                    )}
                  </div>

                  {/* Meetings Pills inside calendar tile */}
                  <div className="flex-1 overflow-y-auto space-y-1">
                    {dayMeetings.slice(0, 2).map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleOpenMeeting(m)}
                        className="rounded px-1.5 py-0.5 text-[10px] truncate bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-slate-800 dark:text-slate-200 cursor-pointer font-medium border border-sky-200 dark:border-sky-800"
                        title={`${m.clientName}: ${m.title}`}
                      >
                        <span className="text-sky-600 dark:text-sky-400 font-bold mr-1">
                          {new Date(m.date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </span>
                        <span>{m.clientName}</span>
                      </div>
                    ))}
                    {dayMeetings.length > 2 && (
                      <p className="text-[9px] text-slate-400 font-mono pl-1">
                        +{dayMeetings.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Meeting Detail Modal */}
      <MeetingDetailModal
        meeting={selectedMeeting}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />

      {/* Schedule Meeting Modal */}
      <MeetingFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
      />
    </div>
  )
}
