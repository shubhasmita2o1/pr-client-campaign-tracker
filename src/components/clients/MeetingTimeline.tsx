import React, { useState } from 'react'
import { Meeting } from '@/types/meeting'
import { TranscriptStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Users,
  List,
  GitCommit
} from 'lucide-react'

interface MeetingTimelineProps {
  meetings: Meeting[]
  onOpenMeeting: (meeting: Meeting) => void
}

export const MeetingTimeline: React.FC<MeetingTimelineProps> = ({
  meetings,
  onOpenMeeting
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline')

  if (meetings.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
        No meetings scheduled or recorded for this client yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* View Switcher */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-mono">
          {meetings.length} meeting{meetings.length > 1 ? 's' : ''} recorded
        </span>

        <div className="flex items-center gap-1 border border-border/80 rounded-lg p-0.5 bg-muted/30">
          <Button
            size="xs"
            variant={viewMode === 'timeline' ? 'default' : 'ghost'}
            onClick={() => setViewMode('timeline')}
            className="h-7 text-xs gap-1.5"
          >
            <GitCommit className="h-3.5 w-3.5" /> Timeline
          </Button>
          <Button
            size="xs"
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            onClick={() => setViewMode('table')}
            className="h-7 text-xs gap-1.5"
          >
            <List className="h-3.5 w-3.5" /> Table
          </Button>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' ? (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
          {meetings.map((m, idx) => {
            const isUpcoming = new Date(m.date) > new Date()
            return (
              <div key={m.id} className="relative group">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-6 top-1.5 h-5 w-5 rounded-full border-2 bg-background flex items-center justify-center transition-all ${
                    isUpcoming
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground/50 text-muted-foreground'
                  } group-hover:scale-110`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isUpcoming ? 'bg-primary animate-ping' : 'bg-muted-foreground/60'
                    }`}
                  />
                </div>

                {/* Meeting Card */}
                <div
                  onClick={() => onOpenMeeting(m)}
                  className="rounded-xl border border-border/80 bg-card p-4 hover:border-primary/50 transition-all cursor-pointer shadow-2xs group-hover:shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {new Date(m.date).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-xs text-muted-foreground">&bull;</span>
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {m.durationMinutes} mins
                        </span>
                        {isUpcoming && (
                          <Badge variant="default" className="text-[10px] py-0">
                            Upcoming
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mt-0.5">
                        {m.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <TranscriptStatusBadge status={m.transcriptStatus} />
                      <Badge variant="outline" className="text-xs">
                        {m.type}
                      </Badge>
                    </div>
                  </div>

                  {m.notes && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 bg-muted/20 p-2 rounded">
                      {m.notes}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      <span>{m.attendees.length} Attendees</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{m.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Meeting Topic</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Transcript</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map(m => (
                <TableRow
                  key={m.id}
                  onClick={() => onOpenMeeting(m)}
                  className="cursor-pointer hover:bg-muted/40"
                >
                  <TableCell className="text-xs font-mono">
                    {new Date(m.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    {m.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {m.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {m.durationMinutes} mins
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {m.location}
                  </TableCell>
                  <TableCell>
                    <TranscriptStatusBadge status={m.transcriptStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
