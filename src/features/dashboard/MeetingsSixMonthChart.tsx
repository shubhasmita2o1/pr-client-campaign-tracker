import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Realistic 6-month historical meeting volume data
const data = [
  { month: 'May 2026', completed: 18, scheduled: 2 },
  { month: 'Jun 2026', completed: 24, scheduled: 3 },
  { month: 'Jul 2026', completed: 29, scheduled: 4 },
  { month: 'Aug 2026', completed: 34, scheduled: 5 },
  { month: 'Sep 2026', completed: 38, scheduled: 6 },
  { month: 'Oct 2026', completed: 32, scheduled: 14 }
]

export const MeetingsSixMonthChart: React.FC = () => {
  return (
    <Card className="border-border/80 shadow-subtle overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/60 bg-card/60">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            Media Briefings &amp; Meeting Volume
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Completed reporter briefings vs upcoming scheduled meetings
          </p>
        </div>
        <Badge variant="sage" className="text-[11px] font-semibold">
          <ArrowUpRight className="h-3 w-3 mr-0.5" /> +24% YoY
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompletedSage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorScheduledSand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/60" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(23, 27, 33, 0.95)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(8px)'
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 500 }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                name="Completed Briefings"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCompletedSage)"
              />
              <Area
                type="monotone"
                dataKey="scheduled"
                name="Scheduled In Queue"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorScheduledSand)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
