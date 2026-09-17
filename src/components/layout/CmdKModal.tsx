import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useGlobalSearch } from '@/hooks/useGlobalSearch'
import { useDebounce } from '@/hooks/useDebounce'
import {
  Search,
  Building2,
  Calendar,
  FileText,
  Megaphone,
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react'

interface CmdKModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CmdKModal: React.FC<CmdKModalProps> = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 200)
  const navigate = useNavigate()

  const { data: searchResults, isLoading } = useGlobalSearch(debouncedSearch)

  // Listen to Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  const handleSelect = (url: string) => {
    onOpenChange(false)
    setSearchTerm('')
    navigate(url)
  }

  const hasResults =
    searchResults &&
    (searchResults.clients.length > 0 ||
      searchResults.transcripts.length > 0 ||
      searchResults.meetings.length > 0 ||
      searchResults.campaigns.length > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden shadow-2xl border-border/80">
        <DialogHeader className="sr-only">
          <DialogTitle>Search PR Records & Transcripts</DialogTitle>
        </DialogHeader>

        {/* Search input header */}
        <div className="flex items-center border-b px-4 py-3 bg-card">
          <Search className="h-4 w-4 mr-2.5 text-muted-foreground shrink-0" />
          <Input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search clients, transcript quotes, meetings, or campaigns..."
            className="border-0 shadow-none focus-visible:ring-0 p-0 text-sm bg-transparent placeholder:text-muted-foreground/70"
            autoFocus
          />
          <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0.5 ml-2 shrink-0">
            ESC
          </Badge>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {isLoading && (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Searching agency index...
            </div>
          )}

          {!isLoading && searchTerm.trim().length > 0 && !hasResults && (
            <div className="py-10 text-center space-y-1">
              <p className="text-sm font-medium">No results found for &ldquo;{searchTerm}&rdquo;</p>
              <p className="text-xs text-muted-foreground">
                Try searching for client names, &quot;embargo&quot;, &quot;Bloomberg&quot;, or campaign titles.
              </p>
            </div>
          )}

          {!isLoading && searchTerm.trim().length === 0 && (
            <div className="space-y-4 py-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                Suggested Searches
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setSearchTerm('Series C')}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-left border border-border/40"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Series C Funding Launches</span>
                </button>
                <button
                  onClick={() => setSearchTerm('Bloomberg')}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-left border border-border/40"
                >
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span>Bloomberg Exclusive Transcripts</span>
                </button>
                <button
                  onClick={() => setSearchTerm('CleanTech')}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-left border border-border/40"
                >
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>CleanTech & Fusion Clients</span>
                </button>
                <button
                  onClick={() => setSearchTerm('Crisis')}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-left border border-border/40"
                >
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Crisis PR Meetings & Prep</span>
                </button>
              </div>
            </div>
          )}

          {/* Group 1: Clients */}
          {searchResults && searchResults.clients.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" /> Clients ({searchResults.clients.length})
                </span>
              </div>
              <div className="space-y-1">
                {searchResults.clients.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(`/clients/${c.id}`)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/80 cursor-pointer transition-colors group border border-transparent hover:border-border/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-muted flex items-center justify-center font-bold text-xs">
                        {c.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                          {c.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {c.industry} &bull; Owner: {c.owner.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {c.status}
                      </Badge>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 2: Transcripts */}
          {searchResults && searchResults.transcripts.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-purple-500" /> Transcripts & Quotes ({searchResults.transcripts.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {searchResults.transcripts.map(({ transcript, matchingSegmentText }) => (
                  <div
                    key={transcript.id}
                    onClick={() => handleSelect(`/clients/${transcript.clientId}?tab=transcripts&trId=${transcript.id}`)}
                    className="p-2.5 rounded-lg hover:bg-muted/80 cursor-pointer transition-colors group border border-transparent hover:border-border/60"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {transcript.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground">{transcript.totalDuration}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 italic bg-muted/40 p-1 rounded">
                      &ldquo;{matchingSegmentText}&rdquo;
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                      <span>Client: {transcript.clientName}</span>
                      <span className="text-primary font-medium">Open transcript &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 3: Meetings */}
          {searchResults && searchResults.meetings.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-sky-500" /> Meetings ({searchResults.meetings.length})
                </span>
              </div>
              <div className="space-y-1">
                {searchResults.meetings.map(m => (
                  <div
                    key={m.id}
                    onClick={() => handleSelect(`/meetings?meetingId=${m.id}`)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/80 cursor-pointer transition-colors group border border-transparent hover:border-border/60"
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-medium leading-none group-hover:text-primary transition-colors">
                        {m.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {m.clientName} &bull; {new Date(m.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {m.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 4: Campaigns */}
          {searchResults && searchResults.campaigns.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                <span className="flex items-center gap-1.5">
                  <Megaphone className="h-3.5 w-3.5 text-amber-500" /> Campaigns ({searchResults.campaigns.length})
                </span>
              </div>
              <div className="space-y-1">
                {searchResults.campaigns.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(`/campaigns/${c.id}`)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/80 cursor-pointer transition-colors group border border-transparent hover:border-border/60"
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-medium leading-none group-hover:text-primary transition-colors">
                        {c.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {c.clientName || 'General'} &bull; {c.type}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {c.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t px-4 py-2 text-[11px] text-muted-foreground bg-muted/30">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">ESC</kbd> to close
          </div>
          <div className="flex items-center gap-1">
            <Command className="h-3 w-3" />
            <span>K opens this menu anywhere</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
