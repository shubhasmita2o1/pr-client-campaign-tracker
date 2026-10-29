import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtext?: string
  trend?: {
    value: number
    isPositive?: boolean
    label?: string
  }
  icon: React.ReactNode
  className?: string
  progress?: number
  sparkData?: number[]
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  trend,
  icon,
  className,
  progress,
  sparkData
}) => {
  // Generate a mini spark bar series if none provided
  const bars = sparkData || [40, 65, 55, 80, 95]

  return (
    <Card className={cn("relative overflow-hidden group hover:border-primary/40 transition-all duration-300", className)}>
      <CardContent className="p-5 flex flex-col justify-between h-full">
        {/* Top: Title & Icon in sleek pastel container */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
            {title}
          </span>
          <div className="h-8 w-8 rounded-xl bg-secondary/80 text-foreground/80 flex items-center justify-center shrink-0 border border-border/50 group-hover:scale-105 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200">
            {icon}
          </div>
        </div>

        {/* Middle: Big Stat & Trend Pill */}
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-foreground">
            {value}
          </div>

          {trend && (
            <span
              className={cn(
                "inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 transition-colors",
                trend.isPositive !== false
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
              )}
            >
              {trend.isPositive !== false ? (
                <ArrowUpRight className="mr-0.5 h-3 w-3" />
              ) : (
                <ArrowDownRight className="mr-0.5 h-3 w-3" />
              )}
              {trend.value}%
            </span>
          )}
        </div>

        {/* Bottom: Subtext & Mini spark / velocity bars */}
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs gap-2">
          <span className="text-muted-foreground text-[11px] truncate font-medium">
            {subtext}
          </span>

          {/* Mini velocity spark bars */}
          <div className="flex items-end gap-1 shrink-0 h-4" title="Recent activity velocity">
            {bars.map((val, idx) => (
              <span
                key={idx}
                className={cn(
                  "w-1 rounded-full transition-all duration-300",
                  idx === bars.length - 1
                    ? "bg-primary group-hover:h-4"
                    : "bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
                )}
                style={{ height: `${Math.max(20, Math.min(100, val))}%` }}
              />
            ))}
          </div>
        </div>

        {typeof progress === 'number' && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
