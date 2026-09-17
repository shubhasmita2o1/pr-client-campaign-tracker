import React, { useState } from 'react'
import { Transcript, TranscriptPart, TranscriptSegment } from '@/types/transcript'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Search,
  Copy,
  CheckCircle2,
  Sparkles,
  Clock,
  ListTodo,
  Columns3,
  Rows3
} from 'lucide-react'
import { toast } from 'sonner'

interface MultiPartViewerProps {
  transcript: Transcript
}

export const MultiPartViewer: React.FC<MultiPartViewerProps> = ({ transcript }) => {
  const [internalSearch, setInternalSearch] = useState('')
  const [displayMode, setDisplayMode] = useState<'tabs' | 'accordion'>('tabs')
  const [actionItems, setActionItems] = useState(transcript.actionItems)

  const toggleActionItem = (id: string) => {
    setActionItems(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    )
  }

  const handleCopyTranscript = () => {
    const textContent = transcript.parts
      .map(
        p =>
          `=== Part ${p.partNumber}: ${p.title} (${p.duration}) ===\n` +
          p.segments.map(s => `[${s.timestamp}] ${s.speaker} (${s.speakerRole}): ${s.text}`).join('\n')
      )
      .join('\n\n')

    navigator.clipboard.writeText(textContent)
    toast.success('Transcript copied to clipboard!')
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query || query.trim() === '') return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 dark:bg-amber-500/40 text-inherit rounded px-0.5 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  const renderSegment = (seg: TranscriptSegment) => {
    return (
      <div
        key={seg.id}
        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50"
      >
        <Avatar className="h-8 w-8 mt-0.5 shrink-0">
          <AvatarFallback className="text-[11px] font-semibold bg-primary/10 text-primary">
            {seg.speaker
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">{seg.speaker}</span>
              <Badge variant="outline" className="text-[10px] py-0 font-normal">
                {seg.speakerRole}
              </Badge>
              {seg.isClient && (
                <Badge variant="secondary" className="text-[9px] py-0">
                  Client
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {seg.sentiment === 'urgent' && (
                <Badge variant="destructive" className="text-[9px] py-0">
                  Priority / Sensitive
                </Badge>
              )}
              {seg.sentiment === 'positive' && (
                <Badge variant="success" className="text-[9px] py-0">
                  Aligned
                </Badge>
              )}
              <span className="text-[11px] font-mono text-muted-foreground">
                {seg.timestamp}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            {highlightMatch(seg.text, internalSearch)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="purple" className="text-xs">
                {transcript.parts.length} Multi-Part Sessions
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Total Duration: {transcript.totalDuration}
              </span>
            </div>
            <h3 className="text-base font-semibold text-foreground mt-1">
              {transcript.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyTranscript}
              className="h-8 text-xs gap-1.5"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Full Transcript</span>
            </Button>

            {/* Display mode switcher */}
            <div className="flex items-center border rounded-lg p-0.5 bg-muted/30">
              <Button
                variant={displayMode === 'tabs' ? 'default' : 'ghost'}
                size="xs"
                onClick={() => setDisplayMode('tabs')}
                className="h-7 px-2"
                title="Tabs View"
              >
                <Columns3 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={displayMode === 'accordion' ? 'default' : 'ghost'}
                size="xs"
                onClick={() => setDisplayMode('accordion')}
                className="h-7 px-2"
                title="Accordion View"
              >
                <Rows3 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* In-transcript keyword filter */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={internalSearch}
            onChange={e => setInternalSearch(e.target.value)}
            placeholder="Search within this transcript (e.g. 'embargo', 'exclusive', 'pricing', 'board')..."
            className="pl-8 h-8 text-xs bg-background"
          />
          {internalSearch && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono">
              Filter Active
            </span>
          )}
        </div>
      </div>

      {/* Key Takeaways & Action Items Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Takeaways */}
        <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Key PR Takeaways &amp; Decisions
          </h4>
          <ul className="space-y-2 text-xs">
            {transcript.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="text-foreground leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Items Checklist */}
        <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ListTodo className="h-3.5 w-3.5 text-primary" /> Agreed Action Items ({actionItems.filter(a => a.completed).length}/{actionItems.length})
          </h4>
          <div className="space-y-2">
            {actionItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleActionItem(item.id)}
                className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      item.completed ? 'text-emerald-500' : 'text-muted-foreground/40'
                    }`}
                  />
                  <span
                    className={`leading-tight ${
                      item.completed ? 'line-through text-muted-foreground' : 'text-foreground font-medium'
                    }`}
                  >
                    {item.task}
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0 font-normal">
                  {item.assignee}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-Part Speech Segments */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
          Call Recordings &amp; Segments
        </h4>

        {displayMode === 'tabs' ? (
          <Tabs defaultValue={transcript.parts[0]?.id || 'part-1'} className="w-full">
            <TabsList className="w-full justify-start h-10 p-1 bg-muted/50 overflow-x-auto">
              {transcript.parts.map(part => (
                <TabsTrigger
                  key={part.id}
                  value={part.id}
                  className="text-xs gap-1.5 px-3 py-1.5"
                >
                  <span className="font-semibold">Part {part.partNumber}:</span>
                  <span className="truncate max-w-[180px]">{part.title}</span>
                  <span className="text-[10px] text-muted-foreground">({part.duration})</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {transcript.parts.map(part => {
              const filteredSegments = internalSearch
                ? part.segments.filter(
                    s =>
                      s.text.toLowerCase().includes(internalSearch.toLowerCase()) ||
                      s.speaker.toLowerCase().includes(internalSearch.toLowerCase())
                  )
                : part.segments

              return (
                <TabsContent
                  key={part.id}
                  value={part.id}
                  className="rounded-xl border border-border/80 bg-card p-4 space-y-3 mt-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        Part {part.partNumber}: {part.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Segment Length: {part.duration} &bull; {part.segments.length} dialogue turns
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 divide-y divide-border/40">
                    {filteredSegments.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-6 text-center">
                        No dialogue matched &ldquo;{internalSearch}&rdquo; in Part {part.partNumber}.
                      </p>
                    ) : (
                      filteredSegments.map(seg => renderSegment(seg))
                    )}
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
        ) : (
          /* Accordion View */
          <Accordion type="multiple" defaultValue={[transcript.parts[0]?.id]} className="space-y-3">
            {transcript.parts.map(part => {
              const filteredSegments = internalSearch
                ? part.segments.filter(
                    s =>
                      s.text.toLowerCase().includes(internalSearch.toLowerCase()) ||
                      s.speaker.toLowerCase().includes(internalSearch.toLowerCase())
                  )
                : part.segments

              return (
                <AccordionItem
                  key={part.id}
                  value={part.id}
                  className="rounded-xl border border-border/80 bg-card px-4 shadow-2xs"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-2 text-left">
                      <Badge variant="outline" className="text-xs">
                        Part {part.partNumber}
                      </Badge>
                      <span className="font-semibold text-sm">{part.title}</span>
                      <span className="text-xs text-muted-foreground">({part.duration})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 space-y-1 divide-y divide-border/40 border-t border-border/40">
                    {filteredSegments.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-4 text-center">
                        No dialogue matched &ldquo;{internalSearch}&rdquo; in this part.
                      </p>
                    ) : (
                      filteredSegments.map(seg => renderSegment(seg))
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        )}
      </div>
    </div>
  )
}
