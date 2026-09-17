import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Command,
  Clock
} from 'lucide-react'

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 250)
  const navigate = useNavigate()

  const { data: results, isLoading } = useGlobalSearch(debouncedQuery)

  const handleQueryChange = (val: string) => {
    setQuery(val)
    if (val.trim()) {
      setSearchParams({ q: val })
    } else {
      setSearchParams({})
    }
  }

  const clientCount = results?.clients.length || 0
  const transcriptCount = results?.transcripts.length || 0
  const meetingCount = results?.meetings.length || 0
  const campaignCount = results?.campaigns.length || 0
  const totalCount = clientCount + transcriptCount + meetingCount + campaignCount

  const highlightMatch = (text: string, q: string) => {
    if (!q || q.trim() === '') return text
    const parts = text.split(new RegExp(`(${q})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 dark:bg-amber-500/40 text-inherit rounded px-0.5 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Search & Intelligence"
        description="Full-text query across all PR client files, multi-part call transcript quotes, scheduled meetings, and outbound campaigns."
        badge={
          <Badge variant="outline" className="text-xs font-mono">
            {totalCount} Total Matches
          </Badge>
        }
      />

      {/* Main Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={e => handleQueryChange(e.target.value)}
          placeholder="Search by client, speech transcript quotes, embargo terms, or campaign topics..."
          className="pl-10 h-11 text-sm bg-card border-border/80 shadow-xs"
          autoFocus
        />
        {query && (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleQueryChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-7 text-xs text-muted-foreground"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Categories Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="h-9 p-1 bg-muted/50 border border-border/70 rounded-lg">
          <TabsTrigger value="all" className="text-xs px-3">
            All ({totalCount})
          </TabsTrigger>
          <TabsTrigger value="clients" className="text-xs px-3">
            Clients ({clientCount})
          </TabsTrigger>
          <TabsTrigger value="transcripts" className="text-xs px-3">
            Transcripts ({transcriptCount})
          </TabsTrigger>
          <TabsTrigger value="meetings" className="text-xs px-3">
            Meetings ({meetingCount})
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs px-3">
            Campaigns ({campaignCount})
          </TabsTrigger>
        </TabsList>

        {isLoading && (
          <div className="py-12 text-center text-xs text-muted-foreground">
            Searching across PR agency knowledge base...
          </div>
        )}

        {!isLoading && query.trim().length === 0 && (
          <div className="py-16 text-center space-y-2 border border-dashed rounded-xl p-8 bg-card">
            <Search className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="text-sm font-semibold">Type a search query above</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Search for client names like &quot;NovaAI&quot;, keywords like &quot;embargo&quot; or &quot;Bloomberg exclusive&quot;, or campaign metrics.
            </p>
          </div>
        )}

        {!isLoading && query.trim().length > 0 && totalCount === 0 && (
          <div className="py-16 text-center space-y-2 border border-dashed rounded-xl p-8 bg-card">
            <h3 className="text-sm font-semibold">No results found for &ldquo;{query}&rdquo;</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try searching with broader terms or check your spelling.
            </p>
          </div>
        )}

        {/* Tab Content: ALL */}
        <TabsContent value="all" className="space-y-6 mt-4">
          {/* Section: Clients */}
          {clientCount > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span>Clients ({clientCount})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results?.clients.map(c => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/clients/${c.id}`)}
                    className="p-3 rounded-lg border border-border/80 bg-card hover:border-primary/50 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center font-bold text-xs">
                        {c.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {highlightMatch(c.name, query)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {highlightMatch(c.industry, query)} &bull; Lead: {c.owner.name}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {c.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Transcripts */}
          {transcriptCount > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <FileText className="h-3.5 w-3.5 text-purple-500" />
                <span>Transcripts &amp; Speech Quotes ({transcriptCount})</span>
              </div>
              <div className="space-y-2">
                {results?.transcripts.map(({ transcript, matchingSegmentText }) => (
                  <div
                    key={transcript.id}
                    onClick={() =>
                      navigate(
                        `/clients/${transcript.clientId}?tab=transcripts&trId=${transcript.id}`
                      )
                    }
                    className="p-3.5 rounded-lg border border-border/80 bg-card hover:border-primary/50 cursor-pointer transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {highlightMatch(transcript.title, query)}
                      </h4>
                      <Badge variant="purple" className="text-[10px]">
                        {transcript.totalDuration}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded leading-relaxed italic">
                      &ldquo;{highlightMatch(matchingSegmentText || '', query)}&rdquo;
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>Client: {transcript.clientName}</span>
                      <span className="text-primary font-medium flex items-center gap-1">
                        View Multi-Part Transcript &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Meetings */}
          {meetingCount > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 text-sky-500" />
                <span>Meetings ({meetingCount})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results?.meetings.map(m => (
                  <div
                    key={m.id}
                    onClick={() => navigate(`/meetings?meetingId=${m.id}`)}
                    className="p-3 rounded-lg border border-border/80 bg-card hover:border-primary/50 cursor-pointer transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {highlightMatch(m.title, query)}
                      </h4>
                      <Badge variant="outline" className="text-[10px]">
                        {m.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Client: {m.clientName} &bull; {new Date(m.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Campaigns */}
          {campaignCount > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Megaphone className="h-3.5 w-3.5 text-amber-500" />
                <span>Campaigns ({campaignCount})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results?.campaigns.map(camp => (
                  <div
                    key={camp.id}
                    onClick={() => navigate(`/campaigns/${camp.id}`)}
                    className="p-3 rounded-lg border border-border/80 bg-card hover:border-primary/50 cursor-pointer transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {highlightMatch(camp.title, query)}
                      </h4>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {camp.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {camp.clientName || 'General Agency'} &bull; {camp.type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Tab Content: Clients */}
        <TabsContent value="clients" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results?.clients.map(c => (
              <div
                key={c.id}
                onClick={() => navigate(`/clients/${c.id}`)}
                className="p-3 rounded-lg border border-border/80 bg-card hover:border-primary/50 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary">
                    {c.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{c.industry}</p>
                </div>
                <Badge variant="outline" className="text-[10px] capitalize">
                  {c.status}
                </Badge>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab Content: Transcripts */}
        <TabsContent value="transcripts" className="mt-4 space-y-2">
          {results?.transcripts.map(({ transcript, matchingSegmentText }) => (
            <div
              key={transcript.id}
              onClick={() =>
                navigate(`/clients/${transcript.clientId}?tab=transcripts&trId=${transcript.id}`)
              }
              className="p-3 rounded-lg border border-border/80 bg-card hover:border-primary/50 cursor-pointer transition-all space-y-1"
            >
              <h4 className="text-sm font-semibold text-foreground">{transcript.title}</h4>
              <p className="text-xs text-muted-foreground italic bg-muted/30 p-2 rounded">
                &ldquo;{matchingSegmentText}&rdquo;
              </p>
            </div>
          ))}
        </TabsContent>

        {/* Tab Content: Meetings */}
        <TabsContent value="meetings" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {results?.meetings.map(m => (
            <div
              key={m.id}
              onClick={() => navigate(`/meetings?meetingId=${m.id}`)}
              className="p-3 rounded-lg border border-border/80 bg-card hover:border-primary/50 cursor-pointer transition-all"
            >
              <h4 className="text-sm font-semibold">{m.title}</h4>
              <p className="text-xs text-muted-foreground">{m.clientName}</p>
            </div>
          ))}
        </TabsContent>

        {/* Tab Content: Campaigns */}
        <TabsContent value="campaigns" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {results?.campaigns.map(camp => (
            <div
              key={camp.id}
              onClick={() => navigate(`/campaigns/${camp.id}`)}
              className="p-3 rounded-lg border border-border/80 bg-card hover:border-primary/50 cursor-pointer transition-all"
            >
              <h4 className="text-sm font-semibold">{camp.title}</h4>
              <p className="text-xs text-muted-foreground">{camp.clientName || 'General'}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
