import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Megaphone,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  onOpenSearch: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  onOpenSearch
}) => {
  const navItems = [
    {
      label: 'Dashboard',
      to: '/',
      icon: LayoutDashboard,
      badge: undefined
    },
    {
      label: 'Clients',
      to: '/clients',
      icon: Users,
      badge: '12'
    },
    {
      label: 'Meetings',
      to: '/meetings',
      icon: Calendar,
      badge: '32'
    },
    {
      label: 'Campaigns',
      to: '/campaigns',
      icon: Megaphone,
      badge: '8'
    },
    {
      label: 'Global Search',
      to: '/search',
      icon: Search,
      badge: undefined
    }
  ]

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border/80 bg-sidebar transition-all duration-300 z-30 shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand header */}
      <div className="flex h-14 items-center justify-between px-3.5 border-b border-border/70">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm leading-tight truncate text-foreground">
                Client &amp; Campaign
              </span>
              <span className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" /> Prestige PR
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
            collapsed && "mx-auto mt-1"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Search Bar Quick Launcher */}
      <div className="p-2.5">
        <button
          onClick={onOpenSearch}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border border-border/70 bg-background/50 px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted/80 transition-all group",
            collapsed ? "justify-center px-0" : "justify-between"
          )}
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
            {!collapsed && <span>Search agency...</span>}
          </div>
          {!collapsed && (
            <kbd className="rounded border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 space-y-1 px-2 py-2">
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-auto text-[10px] px-1.5 py-0 h-4 font-normal"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                  {collapsed && isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Agency Performance Quick Widget */}
      {!collapsed && (
        <div className="mx-3 my-3 rounded-xl border border-border/80 bg-background/50 p-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-medium text-foreground">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              Retainer MRR
            </span>
            <span className="font-semibold text-xs">$170,500</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            10 Active Retainers &bull; 98.5% Target
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
      )}

      {/* User profile footer */}
      <div className="border-t border-border/70 p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-1.5",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-medium truncate text-foreground">
                Elena Rostova
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                Senior PR Partner
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
