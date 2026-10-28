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
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Settings,
  UserCheck
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
    if (pathParts.length === 0) return [{ label: 'Dashboard', path: '/' }]
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
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 backdrop-blur-md">
      {/* Left: Mobile menu & Breadcrumb Navigation */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          onClick={onToggleSidebarMobile}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </Button>

        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1
            return (
              <React.Fragment key={crumb.path}>
                {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 shrink-0" />}
                {isLast ? (
                  <span className="font-semibold text-slate-900 dark:text-white truncate">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            )
          })}
        </nav>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex items-center max-w-sm w-full mx-4">
        <button
          onClick={onOpenSearch}
          className="flex w-full items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all justify-between group"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-500" />
            <span className="truncate">Search clients, transcripts, campaigns...</span>
          </div>
          <kbd className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions: Quick Actions, Notifications, Role Badge, Theme, User Avatar & Logout */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Quick Actions Dropdown Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium bg-sky-500 hover:bg-sky-600 text-white shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Quick Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Agency Quick Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onOpenNewClient}
              className="text-xs cursor-pointer flex items-center"
            >
              <UserPlus className="h-3.5 w-3.5 mr-2 text-sky-500" />
              Add New Client
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (onOpenNewMeeting) onOpenNewMeeting()
                else navigate('/meetings')
              }}
              className="text-xs cursor-pointer flex items-center"
            >
              <Calendar className="h-3.5 w-3.5 mr-2 text-indigo-500" />
              Schedule Meeting
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (onOpenScreenshotExtractor) onOpenScreenshotExtractor()
                else navigate('/campaigns')
              }}
              className="text-xs cursor-pointer flex items-center"
            >
              <Sparkles className="h-3.5 w-3.5 mr-2 text-amber-500" />
              Upload Campaign Screenshot (AI)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/imports')}
              className="text-xs cursor-pointer flex items-center"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 mr-2 text-emerald-500" />
              Import XLSX Data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Center Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 shadow-lg">
            <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Notifications
              </span>
              {unreadNotifications > 0 && (
                <button
                  onClick={() => setUnreadNotifications(0)}
                  className="text-[11px] text-sky-600 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
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
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-slate-900 dark:text-white truncate">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {act.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No new notifications
                </div>
              )}
            </div>
            <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={onOpenSearch}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
              >
                View all activity feed &rarr;
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Role Quick Toggle Badge */}
        <button
          onClick={() => switchRole(role === 'admin' ? 'member' : 'admin')}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-colors"
          title="Click to toggle between Admin and Member roles"
        >
          <ShieldCheck className="h-3 w-3 text-sky-500" />
          <span className="uppercase text-[10px] text-slate-500">Role:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
            {role}
          </span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Top Bar User Avatar + Logout Dropdown (Requirement 2) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              title="Account &amp; Session"
            >
              <Avatar className="h-7 w-7 ring-1 ring-slate-200 dark:ring-slate-700">
                <AvatarImage src={user?.avatarUrl} alt={user?.fullName || 'User'} />
                <AvatarFallback className="text-[11px] font-semibold bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  {user?.fullName?.slice(0, 2).toUpperCase() || 'PR'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                {user?.fullName || 'PR Team Member'}
              </div>
              <div className="text-[11px] font-normal text-slate-500 truncate">
                {user?.email || 'member@prestige-pr.com'}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => switchRole(role === 'admin' ? 'member' : 'admin')}
              className="text-xs cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5 mr-2 text-sky-500" />
              Switch to {role === 'admin' ? 'Member' : 'Admin'} Role
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/settings')}
              className="text-xs cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5 mr-2 text-slate-400" />
              Agency Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-xs text-red-600 dark:text-red-400 cursor-pointer"
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
