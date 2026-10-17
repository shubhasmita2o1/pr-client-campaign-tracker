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
      label: 'Transcripts',
      to: '/transcripts',
      icon: FileText,
      badge: '11'
    },
    {
      label: 'Campaigns',
      to: '/campaigns',
      icon: Megaphone,
      badge: '8'
    },
    {
      label: 'Imports',
      to: '/imports',
      icon: FileSpreadsheet,
      badge: 'XLSX'
    },
    {
      label: 'Settings',
      to: '/settings',
      icon: Settings,
      badge: undefined
    }
  ]

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30 shrink-0 select-none",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand header */}
      <div className="flex h-14 items-center justify-between px-3.5 border-b border-slate-200 dark:border-slate-800">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white font-bold shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm leading-tight truncate text-slate-900 dark:text-white">
                PR Tracker
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-sky-500" /> Agency Operations
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white font-bold shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors",
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
            "flex w-full items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group",
            collapsed ? "justify-center px-0" : "justify-between"
          )}
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
            {!collapsed && <span>Global search...</span>}
          </div>
          {!collapsed && (
            <kbd className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Main Nav Items - In exact requested order */}
      <nav className="flex-1 space-y-1 px-2 py-2 overflow-y-auto">
        {navItems.map((item) => {
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
                    ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-sky-600 dark:text-sky-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
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
                              ? "bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                  {collapsed && isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-sky-500" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Agency Performance Quick Widget */}
      {!collapsed && (
        <div className="mx-3 my-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-900 dark:text-white">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-sky-500" />
              Retainer MRR
            </span>
            <span className="font-semibold text-xs text-sky-600 dark:text-sky-400">$170,500</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            10 Active Retainers &bull; 98.5% Target
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-full bg-sky-500 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
      )}

      {/* User Profile Footer with Role Indicator and Actions */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-2.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left",
                collapsed && "justify-center"
              )}
            >
              <Avatar className="h-8 w-8 shrink-0 ring-1 ring-slate-200 dark:ring-slate-700">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback>{user?.fullName?.slice(0, 2).toUpperCase() || 'PR'}</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col truncate min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold truncate text-slate-900 dark:text-white">
                      {user?.fullName || 'Elena Rostova'}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0 rounded font-normal uppercase ${
                      role === 'admin'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {role}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.email || 'elena@prestige-pr.com'}
                  </span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56 mb-2">
            <DropdownMenuLabel>
              <div className="font-semibold text-xs text-slate-900 dark:text-white">
                {user?.fullName}
              </div>
              <div className="text-[11px] font-normal text-slate-500">
                {user?.title || 'PR Specialist'}
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
            <DropdownMenuItem asChild>
              <NavLink to="/settings" className="text-xs cursor-pointer flex items-center">
                <Settings className="h-3.5 w-3.5 mr-2 text-slate-400" />
                Team &amp; Settings
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-xs text-red-600 dark:text-red-400 cursor-pointer"
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
