import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Megaphone,
  FileSpreadsheet,
  Settings,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  LogOut,
  UserCheck
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

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
  const { user, role, switchRole, logout } = useAuth()

  // Exact order specified in requirements:
  // 1. Dashboard, 2. Clients, 3. Meetings, 4. Transcripts, 5. Campaigns, 6. Imports, 7. Settings
  const navItems = [
    {
      label: 'Dashboard',
      to: '/',
      icon: LayoutDashboard,
      badge: undefined
    },
    {
      label: 'Clients & Accounts',
      to: '/clients',
      icon: Users,
      badge: '12'
    },
    {
      label: 'Media Briefings',
      to: '/meetings',
      icon: Calendar,
      badge: '32'
    },
    {
      label: 'Transcripts & AI',
      to: '/transcripts',
      icon: FileText,
      badge: '11'
    },
    {
      label: 'PR Campaigns',
      to: '/campaigns',
      icon: Megaphone,
      badge: '8'
    },
    {
      label: 'Imports & Data',
      to: '/imports',
      icon: FileSpreadsheet,
      badge: 'XLSX'
    },
    {
      label: 'Agency Settings',
      to: '/settings',
      icon: Settings,
      badge: undefined
    }
  ]

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border/80 bg-card/95 dark:bg-card/90 backdrop-blur-md transition-all duration-300 z-30 shrink-0 select-none",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand header */}
      <div className="flex h-16 items-center justify-between px-3.5 border-b border-border/70">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-subtle">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm tracking-tight leading-tight truncate text-foreground">
                Prestige PR
              </span>
              <span className="text-[11px] text-muted-foreground truncate flex items-center gap-1 font-medium">
                <ShieldCheck className="h-3 w-3 text-primary" /> Operations CRM
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-subtle">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer",
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
      <div className="p-3">
        <button
          onClick={onOpenSearch}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl border border-border/70 bg-secondary/50 px-3 py-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-all group cursor-pointer shadow-2xs",
            collapsed ? "justify-center px-0" : "justify-between"
          )}
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            {!collapsed && <span className="font-medium">Quick search...</span>}
          </div>
          {!collapsed && (
            <kbd className="rounded-md border border-border/80 bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 space-y-1 px-2.5 py-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-primary/12 text-primary font-semibold shadow-2xs"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
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
                        : "text-muted-foreground/80 group-hover:text-foreground"
                    )}
                  />
                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "ml-auto text-[10px] px-1.5 py-0 h-4 font-normal",
                            isActive
                              ? "bg-primary/20 text-primary border-primary/30"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                  {collapsed && isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Agency Performance Quick Widget (Ronas IT CRM style) */}
      {!collapsed && (
        <div className="mx-3 my-2.5 rounded-2xl border border-border/80 bg-secondary/40 p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Retainer MRR
            </span>
            <span className="font-bold text-xs text-primary">$170,500</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            10 Active Retainers &bull; 85% of $200k
          </p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '85%' }} />
          </div>
        </div>
      )}

      {/* User Profile Footer with Role Indicator and Actions */}
      <div className="border-t border-border/70 p-2.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl p-1.5 hover:bg-secondary/70 transition-colors text-left cursor-pointer",
                collapsed && "justify-center"
              )}
            >
              <div className="relative">
                <Avatar className="h-8.5 w-8.5 shrink-0 ring-1 ring-border">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback>{user?.fullName?.slice(0, 2).toUpperCase() || 'PR'}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
              </div>

              {!collapsed && (
                <div className="flex flex-col truncate min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold truncate text-foreground">
                      {user?.fullName || 'Elena Rostova'}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0 rounded-full font-medium uppercase border ${
                      role === 'admin'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                        : 'bg-secondary text-muted-foreground border-border'
                    }`}>
                      {role}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate">
                    {user?.email || 'elena@prestige-pr.com'}
                  </span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56 mb-2 rounded-xl shadow-premium border-border/80">
            <DropdownMenuLabel>
              <div className="font-semibold text-xs text-foreground">
                {user?.fullName}
              </div>
              <div className="text-[11px] font-normal text-muted-foreground">
                {user?.title || 'PR Specialist'}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => switchRole(role === 'admin' ? 'member' : 'admin')}
              className="text-xs cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5 mr-2 text-primary" />
              Switch to {role === 'admin' ? 'Member' : 'Admin'} Role
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/settings" className="text-xs cursor-pointer flex items-center">
                <Settings className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                Team &amp; Settings
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-xs text-destructive cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
