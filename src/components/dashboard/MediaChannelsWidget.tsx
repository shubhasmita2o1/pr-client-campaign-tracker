import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  PieChart,
  Radio,
  Tv,
  Newspaper,
  Mic,
  TrendingUp,
  Award,
  Sparkles,
  ArrowUpRight
} from 'lucide-react'

interface MediaChannel {
  name: string
  share: number
  audienceReach: string
  hitsSecured: number
  growth: number
  color: string
  bgLight: string
  icon: React.ReactNode
}

const CHANNELS: MediaChannel[] = [
  {
    name: 'Tier-1 Business & Wire',
    share: 42,
    audienceReach: '8.4M readers',
    hitsSecured: 34,
    growth: 18.2,
    color: '#10B981', // Sage Emerald
    bgLight: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    icon: <Newspaper className="h-4 w-4" />
  },
  {
    name: 'Venture & Tech Daily',
    share: 28,
    audienceReach: '4.8M readers',
    hitsSecured: 24,
    growth: 14.5,
    color: '#0284C7', // Sky
    bgLight: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    icon: <Sparkles className="h-4 w-4" />
  },
  {
    name: 'Broadcast & Podcasts',
    share: 18,
    audienceReach: '2.6M listeners',
    hitsSecured: 14,
    growth: 24.0,
    color: '#8B5CF6', // Purple
    bgLight: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
    icon: <Mic className="h-4 w-4" />
  },
  {
    name: 'Industry & Deep Tech',
    share: 12,
    audienceReach: '1.4M readers',
    hitsSecured: 10,
    growth: 9.8,
    color: '#F59E0B', // Amber Sand
    bgLight: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    icon: <Radio className="h-4 w-4" />
  }
]

export const MediaChannelsWidget: React.FC = () => {
  return (
    <Card className="border-border/80 shadow-subtle overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60 bg-card/60">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <PieChart className="h-4 w-4 text-primary" />
            Media Channel &amp; Reach Distribution
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified reader reach and publication breakdown across all active client retainers
          </p>
        </div>
        <Badge variant="sage" className="text-[11px] font-semibold">
          17.2M Total Reach
        </Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Top 4 SaaS Executive CRM Metrics (AOV, Churn, Conversion, Retention) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-border/70 bg-secondary/30 p-3 text-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Average Retainer (AOV)
            </span>
            <p className="text-lg font-extrabold text-foreground mt-0.5 tabular-nums">
              $17,050
            </p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +12% YoY
            </span>
          </div>

          <div className="rounded-xl border border-border/70 bg-secondary/30 p-3 text-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Pitch Reply Rate
            </span>
            <p className="text-lg font-extrabold text-foreground mt-0.5 tabular-nums">
              28.4%
            </p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +4.2% MoM
            </span>
          </div>

          <div className="rounded-xl border border-border/70 bg-secondary/30 p-3 text-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Client Retention
            </span>
            <p className="text-lg font-extrabold text-foreground mt-0.5 tabular-nums">
              98.5%
            </p>
            <span className="text-[10px] text-muted-foreground font-medium">
              Industry Top 1%
            </span>
          </div>

          <div className="rounded-xl border border-border/70 bg-secondary/30 p-3 text-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Net Churn Rate
            </span>
            <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums">
              1.5%
            </p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Minimal churn
            </span>
          </div>
        </div>

        {/* Stacked Percentage Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-secondary">
            {CHANNELS.map((ch) => (
              <div
                key={ch.name}
                style={{ width: `${ch.share}%`, backgroundColor: ch.color }}
                title={`${ch.name}: ${ch.share}%`}
                className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
              />
            ))}
          </div>

          {/* Detailed Channels List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {CHANNELS.map((ch) => (
              <div
                key={ch.name}
                className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${ch.color}18`, color: ch.color }}
                  >
                    {ch.icon}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">
                      {ch.name}
                    </h5>
                    <p className="text-[11px] text-muted-foreground">
                      {ch.audienceReach} &bull; {ch.hitsSecured} features
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-foreground tabular-nums">
                    {ch.share}%
                  </span>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    +{ch.growth}%
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
