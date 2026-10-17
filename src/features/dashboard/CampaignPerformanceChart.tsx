import React from 'react'
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Megaphone } from 'lucide-react'

// Realistic campaign comparison data
const data = [
  { campaign: 'NovaAI Series C', impressionsK: 820, coverage: 14 },
  { campaign: 'Helion Fusion', impressionsK: 1090, coverage: 13 },
  { campaign: 'CyberShield Q3', impressionsK: 910, coverage: 22 },
  { campaign: 'Astra Robotics', impressionsK: 1405, coverage: 12 },
  { campaign: 'Lumina EU Blitz', impressionsK: 1340, coverage: 23 },
  { campaign: 'Aetheria Vogue', impressionsK: 1920, coverage: 23 }
]

export const CampaignPerformanceChart: React.FC = () => {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <Megaphone className="h-4 w-4 text-sky-500" />
            Campaign Performance (Impressions vs Secured Coverage)
          </CardTitle>
          <p className="text-xs text-slate-500">
            Comparing verified reader reach (thousands) to verified tier-1 editorial placements
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="campaign"
                tick={{ fontSize: 10, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}K`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#10B981' }}
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
                formatter={(val, name) => {
                  if (name === 'Impressions') return [`${Number(val).toLocaleString()}K Views`, name]
                  return [`${val} Articles`, name]
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
              />
              <Bar
                yAxisId="left"
                dataKey="impressionsK"
                name="Impressions (Thousands)"
                fill="#0EA5E9"
                radius={[4, 4, 0, 0]}
                barSize={28}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="coverage"
                name="Coverage Secured (Articles)"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10B981' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
