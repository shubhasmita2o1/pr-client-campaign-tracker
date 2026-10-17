import React, { useState } from 'react'
import { Meeting } from '@/types/meeting'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TranscriptStatusBadge } from '@/components/shared/StatusBadge'
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Users,
  CheckSquare,
  Square,
  ExternalLink,
  Sparkles,
  CalendarCheck,
  Video
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface MeetingDetailModalProps {
  meeting: Meeting | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({
  meeting,
  open,
  onOpenChange
}) => {
  const navigate = useNavigate()
  const [completedAgenda, setCompletedAgenda] = useState<Record<number, boolean>>({})

  if (!meeting) return null

  const handleToggleAgenda = (index: number) => {
    setCompletedAgenda((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleOpenTranscript = () => {
    onOpenChange(false)
    if (meeting.transcriptId) {
      navigate(`/transcripts/${meeting.transcriptId}`)
    } else {
      navigate('/transcripts')
    }
  }

  const agencyAttendees = meeting.attendees.filter((a) => !a.isClient)
  const clientAttendees = meeting.attendees.filter((a) => a.isClient)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {meeting.type}
            </Badge>
            <TranscriptStatusBadge status={meeting.transcriptStatus} />

            {meeting.calComBookingUid && (
              <Badge className="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 text-[10px] gap-1 font-mono">
                <CalendarCheck className="h-3 w-3" />
                Cal.com: {meeting.calComBookingUid}
              </Badge>
            )}

            {meeting.gcalEventId && (
              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] gap-1 font-mono">
                <Calendar className="h-3 w-3" />
                GCal Synced
              </Badge>
            )}
          </div>

          <DialogTitle className="text-lg sm:text-xl text-slate-900 dark:text-white">
            {meeting.title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Client: <span className="font-semibold text-slate-900 dark:text-white">{meeting.clientName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-sky-500" />
              <div>
                <p className="text-slate-500 font-mono">Date</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {new Date(meeting.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-500" />
              <div>
                <p className="text-slate-500 font-mono">Duration</p>
                <p className="font-medium text-slate-900 dark:text-white">{meeting.durationMinutes} minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <MapPin className="h-4 w-4 text-sky-500" />
              <div>
                <p className="text-slate-500 font-mono">Platform / Location</p>
                <p className="font-medium text-slate-900 dark:text-white">{meeting.location}</p>
              </div>
            </div>
          </div>

          {/* Agenda items with checkable state */}
          {meeting.agenda && meeting.agenda.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CheckSquare className="h-3.5 w-3.5 text-sky-500" /> Planned Agenda Topics
              </h4>
              <div className="space-y-1.5 pl-1 text-xs">
                {meeting.agenda.map((item, i) => {
                  const isDone = completedAgenda[i]
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleToggleAgenda(i)}
                      className="flex items-start gap-2 w-full text-left p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {isDone ? (
                        <CheckSquare className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                      )}
                      <span className={`text-xs ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white font-medium'}`}>
                        {item}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Meeting Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-sky-500" /> Executive Notes &amp; Decisions
            </h4>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
              {meeting.notes || 'No detailed meeting notes recorded.'}
            </div>
          </div>

          {/* Attendees Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-sky-500" /> Attendees ({meeting.attendees.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Client Representatives */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Client Team ({clientAttendees.length})
                </span>
                <div className="space-y-1.5">
                  {clientAttendees.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs"
                    >
                      <Avatar className="h-7 w-7 ring-1 ring-sky-200 dark:ring-sky-900">
                        <AvatarFallback className="text-[10px]">
                          {att.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="truncate">
                        <p className="font-semibold truncate text-slate-900 dark:text-white">{att.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{att.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agency PR Team */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Agency PR Lead ({agencyAttendees.length})
                </span>
                <div className="space-y-1.5">
                  {agencyAttendees.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs"
                    >
                      <Avatar className="h-7 w-7 ring-1 ring-indigo-200 dark:ring-indigo-900">
                        <AvatarFallback className="text-[10px]">
                          {att.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="truncate">
                        <p className="font-semibold truncate text-slate-900 dark:text-white">{att.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{att.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Transcript Ready Notification */}
          {meeting.transcriptStatus === 'has_transcript' && (
            <div className="flex items-center justify-between rounded-xl border border-sky-500/30 bg-sky-50 dark:bg-sky-950/40 p-3.5 text-sky-900 dark:text-sky-200">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold">Multi-Part Call Transcript Available</p>
                  <p className="text-[11px] text-sky-700 dark:text-sky-300">
                    Read AI call transcript ingested. Searchable speech segments, action items, and sentiment analysis.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={handleOpenTranscript}
                className="bg-sky-500 hover:bg-sky-600 text-white text-xs shrink-0 gap-1.5 shadow-xs"
              >
                <span>Open Transcript</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
          {meeting.location.toLowerCase().includes('http') || meeting.location.toLowerCase().includes('meet') || meeting.location.toLowerCase().includes('zoom') ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(meeting.location.startsWith('http') ? meeting.location : `https://${meeting.location}`, '_blank')}
              className="text-xs gap-1.5 border-slate-200 dark:border-slate-800"
            >
              <Video className="h-3.5 w-3.5 text-emerald-500" />
              <span>Launch Video Call</span>
            </Button>
          ) : <div />}

          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close Briefing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
