import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Megaphone, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Realistic campaign comparison data
const data = [
  { campaign: 'NovaAI Series C', impressionsK: 820, coverage: 14 },
  { campaign: 'Helion Fusion', impressionsK: 1090, coverage: 13 },
  { campaign: 'CyberShield Q3', impressionsK: 910, coverage: 22 },
  { campaign: 'Astra Robotics', impressionsK: 1405, coverage: 12 },
  { campaign: 'Lumina Diagnostics', impressionsK: 1340, coverage: 23 },
  { campaign: 'Aetheria Luxury', impressionsK: 1920, coverage: 28 }
]

export const CampaignPerformanceChart: React.FC = () => {
  return (
    <Card className="border-border/80 shadow-subtle overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/60 bg-card/60">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
            <Megaphone className="h-4 w-4 text-primary" />
            Campaign Reach vs Verified Editorial Features
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Comparing verified reader reach (thousands) to verified tier-1 editorial placements
          </p>
        </div>
        <Badge variant="sand" className="text-[11px] font-semibold">
          112 Total Articles
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/60" />
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
                  backgroundColor: 'rgba(23, 27, 33, 0.95)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(8px)'
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
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 500 }}
              />
              <Bar
                yAxisId="left"
                dataKey="impressionsK"
                name="Impressions (K)"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="coverage"
                name="Secured Coverage"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
