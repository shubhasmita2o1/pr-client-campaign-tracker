import React, { useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  Menu,
  ChevronRight,
  FileSpreadsheet,
  Calendar,
  UserPlus,
  ShieldCheck,
  LogOut,
  Settings,
  UserCheck,
  TrendingUp
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { useDashboard } from '@/hooks/useDashboard'

interface HeaderProps {
  onOpenSearch: () => void
  onToggleSidebarMobile: () => void
  onOpenNewClient: () => void
  onOpenNewMeeting?: () => void
  onOpenScreenshotExtractor?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onToggleSidebarMobile,
  onOpenNewClient,
  onOpenNewMeeting,
  onOpenScreenshotExtractor
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, role, switchRole, logout } = useAuth()
  const { recentActivities } = useDashboard()
  const [unreadNotifications, setUnreadNotifications] = useState(2)

  // Derive breadcrumb path
  const pathParts = location.pathname.split('/').filter(Boolean)
  const getBreadcrumbs = () => {
    if (pathParts.length === 0) return [{ label: 'Executive Dashboard', path: '/' }]
    const crumbs = [{ label: 'Dashboard', path: '/' }]
    let curPath = ''
    for (const part of pathParts) {
      curPath += `/${part}`
      const capitalized = part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' ')
      crumbs.push({ label: capitalized, path: curPath })
    }
    return crumbs
  }

  const breadcrumbs = getBreadcrumbs()

  const handleSignOut = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border/75 bg-card/90 dark:bg-card/85 px-4 sm:px-6 backdrop-blur-md select-none">
      {/* Left: Mobile menu & Breadcrumb Navigation */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onToggleSidebarMobile}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </Button>

        {/* Breadcrumbs with subtle luxury typography */}
        <nav className="flex items-center space-x-1.5 text-xs text-muted-foreground font-medium truncate">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1
            return (
              <React.Fragment key={crumb.path}>
                {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />}
                {isLast ? (
                  <span className="font-semibold text-foreground truncate">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="hover:text-primary transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            )
          })}
        </nav>
      </div>

      {/* Center: Global Search Bar Pill */}
      <div className="hidden lg:flex items-center max-w-sm w-full mx-4">
        <button
          onClick={onOpenSearch}
          className="flex w-full items-center gap-2 rounded-xl border border-border/80 bg-secondary/50 px-3.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-all justify-between group cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="truncate">Search clients, press campaigns, transcripts...</span>
          </div>
          <kbd className="rounded-md border border-border/80 bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Retainer live metric pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>$170.5k MRR</span>
        </div>

        {/* Quick Actions Dropdown Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="h-8.5 gap-1.5 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-subtle cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Action</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-premium border-border/80">
            <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
              Agency Quick Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onOpenNewClient}
              className="text-xs cursor-pointer flex items-center"
            >
              <UserPlus className="h-3.5 w-3.5 mr-2 text-primary" />
              Add New Client Account
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (onOpenNewMeeting) onOpenNewMeeting()
                else navigate('/meetings')
              }}
              className="text-xs cursor-pointer flex items-center"
            >
              <Calendar className="h-3.5 w-3.5 mr-2 text-sky-500" />
              Schedule Media Briefing
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (onOpenScreenshotExtractor) onOpenScreenshotExtractor()
                else navigate('/campaigns')
              }}
              className="text-xs cursor-pointer flex items-center"
            >
              <Sparkles className="h-3.5 w-3.5 mr-2 text-amber-500" />
              Extract Metrics from Screenshot (AI)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/imports')}
              className="text-xs cursor-pointer flex items-center"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 mr-2 text-emerald-600" />
              Import XLSX Master Sheet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Center Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8.5 w-8.5 relative text-muted-foreground hover:text-foreground cursor-pointer rounded-xl"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-card" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 shadow-premium rounded-xl border-border/80">
            <div className="flex items-center justify-between p-3.5 border-b border-border/70">
              <span className="text-xs font-semibold text-foreground">
                Activity Alerts
              </span>
              {unreadNotifications > 0 && (
                <button
                  onClick={() => setUnreadNotifications(0)}
                  className="text-[11px] text-primary hover:underline cursor-pointer font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
              {recentActivities && recentActivities.length > 0 ? (
                recentActivities.slice(0, 4).map((act) => (
                  <div
                    key={act.id}
                    onClick={() => {
                      if (act.targetType === 'campaign') navigate(`/campaigns/${act.targetId}`)
                      else if (act.targetType === 'client') navigate(`/clients/${act.targetId}`)
                      else if (act.targetType === 'meeting') navigate('/meetings')
                      else if (act.targetType === 'transcript') navigate('/transcripts')
                    }}
                    className="p-3 hover:bg-secondary/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      {act.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No new notifications
                </div>
              )}
            </div>
            <div className="p-2.5 border-t border-border/70 text-center">
              <button
                onClick={onOpenSearch}
                className="text-xs text-muted-foreground hover:text-foreground font-medium cursor-pointer"
              >
                View all agency audit trail &rarr;
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Role Quick Toggle Badge */}
        <button
          onClick={() => switchRole(role === 'admin' ? 'member' : 'admin')}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-border/80 bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
          title="Click to toggle between Admin and Member roles"
        >
          <ShieldCheck className="h-3 w-3 text-primary" />
          <span className="uppercase text-[10px] text-muted-foreground">Role:</span>
          <span className="font-semibold text-foreground capitalize">
            {role}
          </span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Top Bar User Avatar + Logout Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              title="Account &amp; Session"
            >
              <Avatar className="h-8 w-8 ring-1 ring-border">
                <AvatarImage src={user?.avatarUrl} alt={user?.fullName || 'User'} />
                <AvatarFallback className="text-[11px] font-semibold bg-primary/10 text-primary">
                  {user?.fullName?.slice(0, 2).toUpperCase() || 'PR'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-premium border-border/80">
            <DropdownMenuLabel>
              <div className="font-semibold text-xs text-foreground truncate">
                {user?.fullName || 'Elena Rostova'}
              </div>
              <div className="text-[11px] font-normal text-muted-foreground truncate">
                {user?.email || 'elena@prestige-pr.com'}
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
            <DropdownMenuItem
              onClick={() => navigate('/settings')}
              className="text-xs cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              Agency Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-xs text-destructive cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
