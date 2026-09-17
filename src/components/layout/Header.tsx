import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  Menu
} from 'lucide-react'

interface HeaderProps {
  onOpenSearch: () => void
  onToggleSidebarMobile: () => void
  onOpenNewClient: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onToggleSidebarMobile,
  onOpenNewClient
}) => {
  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-border/70 bg-background/85 px-4 backdrop-blur-md">
      {/* Left: Mobile menu button & quick search trigger */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 text-muted-foreground"
          onClick={onToggleSidebarMobile}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Global search trigger bar */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 rounded-lg border border-border/80 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/60 transition-all w-64 md:w-80 group"
        >
          <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
          <span className="truncate">Search clients, transcripts, campaigns...</span>
          <kbd className="ml-auto rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Client Action */}
        <Button
          onClick={onOpenNewClient}
          size="sm"
          className="h-8 gap-1.5 text-xs font-medium bg-primary hover:bg-primary/90 shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">New Client</span>
        </Button>

        {/* System Activity Notification Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 relative text-muted-foreground hover:text-foreground"
          onClick={onOpenSearch}
          title="Search notifications & feed"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}
