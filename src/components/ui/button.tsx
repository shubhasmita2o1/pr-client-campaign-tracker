import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "subtle" | "sage" | "sand"
  size?: "default" | "sm" | "lg" | "icon" | "xs"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer"
    
    const variants = {
      default: "bg-primary text-primary-foreground shadow-subtle hover:bg-primary/92 hover:shadow-premium",
      destructive: "bg-destructive text-destructive-foreground shadow-subtle hover:bg-destructive/90",
      outline: "border border-border/80 bg-card text-foreground shadow-subtle hover:bg-accent/40 hover:text-accent-foreground hover:border-border",
      secondary: "bg-secondary text-secondary-foreground shadow-2xs hover:bg-secondary/80",
      ghost: "hover:bg-accent/50 hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      subtle: "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground",
      sage: "bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 shadow-2xs",
      sand: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/20 shadow-2xs",
    }

    const sizes = {
      default: "h-9 px-4 py-2 text-xs sm:text-sm",
      sm: "h-8 rounded-lg px-3 text-xs",
      xs: "h-7 rounded-md px-2.5 text-xs font-normal",
      lg: "h-11 rounded-xl px-8 text-sm",
      icon: "h-9 w-9 rounded-xl"
    }

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
