import React from 'react'
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
  ExternalLink,
  Sparkles
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

  if (!meeting) return null

  const handleOpenTranscript = () => {
    onOpenChange(false)
    navigate(`/clients/${meeting.clientId}?tab=transcripts&trId=${meeting.transcriptId}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs">
              {meeting.type}
            </Badge>
            <TranscriptStatusBadge status={meeting.transcriptStatus} />
          </div>
          <DialogTitle className="text-lg sm:text-xl">{meeting.title}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Client: <span className="font-semibold text-foreground">{meeting.clientName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-muted/40 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground font-mono">Date</p>
                <p className="font-medium text-foreground">
                  {new Date(meeting.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground font-mono">Duration</p>
                <p className="font-medium text-foreground">{meeting.durationMinutes} minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground font-mono">Platform</p>
                <p className="font-medium text-foreground">{meeting.location}</p>
              </div>
            </div>
          </div>

          {/* Agenda items */}
          {meeting.agenda && meeting.agenda.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CheckSquare className="h-3.5 w-3.5 text-primary" /> Planned Agenda Topics
              </h4>
              <ul className="space-y-1.5 pl-2 text-xs">
                {meeting.agenda.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meeting Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" /> Executive Notes &amp; Decisions
            </h4>
            <div className="rounded-lg border border-border/80 bg-background p-3 text-xs leading-relaxed text-foreground">
              {meeting.notes || 'No detailed meeting notes recorded.'}
            </div>
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" /> Attendees ({meeting.attendees.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {meeting.attendees.map(att => (
                <div
                  key={att.id}
                  className="flex items-center gap-2.5 p-2 rounded-md border border-border/60 bg-card text-xs"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px]">
                      {att.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="truncate">
                    <p className="font-medium truncate text-foreground">{att.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {att.role} {att.isClient ? '(Client)' : '(Agency)'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transcript Banner */}
          {meeting.transcriptStatus === 'has_transcript' && (
            <div className="flex items-center justify-between rounded-xl border border-purple-500/30 bg-purple-500/10 p-3.5 text-purple-900 dark:text-purple-200">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold">Multi-Part Call Transcript Available</p>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300">
                    Searchable speech segments, speaker tags, and key takeaways generated.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={handleOpenTranscript}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs shrink-0 gap-1.5"
              >
                <span>View Transcript</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
