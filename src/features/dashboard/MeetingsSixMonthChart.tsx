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
import { Calendar } from 'lucide-react'

// Realistic 6-month historical meeting volume data
const data = [
  { month: 'Apr 2026', completed: 18, scheduled: 2 },
  { month: 'May 2026', completed: 24, scheduled: 3 },
  { month: 'Jun 2026', completed: 29, scheduled: 4 },
  { month: 'Jul 2026', completed: 34, scheduled: 5 },
  { month: 'Aug 2026', completed: 38, scheduled: 6 },
  { month: 'Sep 2026', completed: 26, scheduled: 14 }
]

export const MeetingsSixMonthChart: React.FC = () => {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <Calendar className="h-4 w-4 text-sky-500" />
            Client Meetings Volume (Last 6 Months)
          </CardTitle>
          <p className="text-xs text-slate-500">
            Completed briefings vs upcoming scheduled meetings across all active accounts
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818CF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
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
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                name="Completed Briefings"
                stroke="#0EA5E9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCompleted)"
              />
              <Area
                type="monotone"
                dataKey="scheduled"
                name="Upcoming Standing Syncs"
                stroke="#818CF8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorScheduled)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
