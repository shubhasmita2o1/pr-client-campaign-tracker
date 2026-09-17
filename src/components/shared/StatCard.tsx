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
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  trend,
  icon,
  className
}) => {
  return (
    <Card className={cn("relative overflow-hidden transition-all hover:border-primary/40", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <div className="rounded-md bg-muted/60 p-2 text-foreground/80">
            {icon}
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
          {trend && (
            <span
              className={cn(
                "inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded",
                trend.isPositive !== false
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
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

        {subtext && (
          <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
        )}
      </CardContent>
    </Card>
  )
}
