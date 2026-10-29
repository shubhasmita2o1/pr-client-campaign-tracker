import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Flame,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
  Sparkles
} from 'lucide-react'

interface TimeSlotData {
  time: string
  days: {
    mon: number // 0 to 4 intensity
    tue: number
    wed: number
    thu: number
    fri: number
  }
}

const HEATMAP_DATA: TimeSlotData[] = [
  {
    time: '08:00 - 11:00 AM',
    days: { mon: 2, tue: 4, wed: 3, thu: 4, fri: 2 }
  },
  {
    time: '11:00 - 02:00 PM',
    days: { mon: 3, tue: 3, wed: 4, thu: 3, fri: 1 }
  },
  {
    time: '02:00 - 05:00 PM',
    days: { mon: 2, tue: 4, wed: 2, thu: 3, fri: 2 }
  },
  {
    time: '05:00 - 07:00 PM',
    days: { mon: 1, tue: 2, wed: 1, thu: 2, fri: 0 }
  }
]

const INTENSITY_COLORS: Record<number, string> = {
  0: 'bg-secondary/40 border-border/40',
  1: 'bg-emerald-500/15 border-emerald-500/25',
  2: 'bg-emerald-500/35 border-emerald-500/40 text-emerald-950 dark:text-emerald-50',
  3: 'bg-emerald-500/60 border-emerald-500/70 text-white',
  4: 'bg-emerald-600 border-emerald-700 text-white font-bold shadow-2xs'
}

const TEAM_LEADERS = [
  {
    name: 'Elena Rostova',
    role: 'Agency Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    pitchesSent: 42,
    replies: 16,
    rate: '38%'
  },
  {
    name: 'Marcus Vance',
    role: 'Senior PR Strategist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    pitchesSent: 38,
    replies: 11,
    rate: '29%'
  },
  {
    name: 'Sophia Lin',
    role: 'Media Relations Lead',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    pitchesSent: 35,
    replies: 12,
    rate: '34%'
  }
]

export const TeamActivityHeatmap: React.FC = () => {
  return (
    <Card className="border-border/80 shadow-subtle overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60 bg-card/60">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <Flame className="h-4 w-4 text-primary" />
            Outreach Velocity &amp; Team Heatmap
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hourly journalist responsiveness and team execution rhythm
          </p>
        </div>
        <Badge variant="sage" className="text-[10px] font-semibold">
          Peak: Tue &amp; Thu Mornings
        </Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Heatmap Grid */}
        <div className="space-y-2">
          {/* Day Headers */}
          <div className="grid grid-cols-6 gap-2 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <div className="text-left font-medium">Time Block</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
          </div>

          {/* Rows */}
          {HEATMAP_DATA.map((row) => (
            <div key={row.time} className="grid grid-cols-6 gap-2 items-center">
              <span className="text-[10px] font-medium text-muted-foreground truncate">
                {row.time}
              </span>
              {(['mon', 'tue', 'wed', 'thu', 'fri'] as const).map((day) => {
                const val = row.days[day]
                return (
                  <div
                    key={day}
                    className={`h-8 rounded-lg border flex items-center justify-center text-[10px] font-semibold transition-transform hover:scale-105 cursor-pointer ${INTENSITY_COLORS[val]}`}
                    title={`${day.toUpperCase()} ${row.time}: Level ${val}/4 velocity`}
                  >
                    {val > 2 ? `${val * 8}%` : ''}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <span>Low reporter replies</span>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((lvl) => (
                <span
                  key={lvl}
                  className={`w-3.5 h-3.5 rounded border ${INTENSITY_COLORS[lvl]}`}
                />
              ))}
            </div>
            <span>Highest conversion</span>
          </div>
        </div>

        {/* Team Leaderboard row */}
        <div className="pt-2 border-t border-border/60">
          <h4 className="text-xs font-bold text-foreground mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              Active PR Strategists This Week
            </span>
            <span className="text-[11px] text-muted-foreground font-normal">
              115 Total Pitches Sent
            </span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {TEAM_LEADERS.map((member) => (
              <div
                key={member.name}
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-card hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-7 w-7 ring-1 ring-border shrink-0">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="truncate">
                    <p className="text-xs font-bold text-foreground truncate">
                      {member.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="text-xs font-extrabold text-primary tabular-nums">
                    {member.rate}
                  </span>
                  <p className="text-[10px] text-muted-foreground">
                    {member.replies}/{member.pitchesSent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
