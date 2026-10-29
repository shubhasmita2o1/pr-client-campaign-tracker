import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "purple" | "sage" | "sand"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90",
    secondary: "border-border/60 bg-muted/70 text-foreground hover:bg-muted",
    destructive: "border-destructive/25 bg-destructive/12 text-destructive",
    outline: "text-foreground border-border/80 bg-background/50",
    success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    warning: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    info: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    purple: "border-purple-500/25 bg-purple-500/10 text-purple-700 dark:text-purple-300",
    sage: "border-emerald-600/25 bg-emerald-600/12 text-emerald-800 dark:text-emerald-200",
    sand: "border-amber-600/25 bg-amber-600/12 text-amber-800 dark:text-amber-200",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors focus:outline-none select-none",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
