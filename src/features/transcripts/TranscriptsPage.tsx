import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useTranscripts } from '@/hooks/useTranscripts'
import { useClients } from '@/hooks/useClients'
import { TranscriptFilters } from '@/types/transcript'
import { TranscriptUploadModal } from './TranscriptUploadModal'
import {
  FileText,
  Search,
  Plus,
  Bot,
  Sparkles,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  ListTodo,
  ExternalLink,
  Users
} from 'lucide-react'
import { toast } from 'sonner'

export const TranscriptsPage: React.FC = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<TranscriptFilters>({
    search: '',
    clientId: 'all',
    source: 'all'
  })
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const { data: transcripts = [], isLoading } = useTranscripts(filters)
  const { data: clients = [] } = useClients()

  const handleExportCSV = () => {
    if (transcripts.length === 0) {
      toast.error('No transcripts to export.')
      return
    }

    const headers = [
      'Transcript ID',
      'Client',
      'Title',
      'Date',
      'Duration',
      'Source',
      'External ID',
      'Meeting Match',
      'Action Items Count',
      'Key Takeaways'
    ]

    const rows = transcripts.map((t) => [
      t.id,
      `"${t.clientName}"`,
      `"${t.title}"`,
      t.date,
      `"${t.totalDuration}"`,
      t.source || 'manual',
      t.externalId || '',
      `"${t.meetingTitle || 'Unmatched'}"`,
      t.actionItems.length,
      `"${t.keyTakeaways.join('; ')}"`
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `PR_Agency_Transcripts_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(`Exported ${transcripts.length} transcript summaries to CSV`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Call Transcripts & Meeting Intelligence"
        description="Multi-part spoken transcripts with automated speaker role identification, sentiment tagging, and Read AI webhook auto-matching."
        badge={
          <Badge variant="outline" className="text-xs font-mono bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            {transcripts.length} Ingested Transcripts
          </Badge>
        }
      >
        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800/60 mr-2">
          <Button
            size="xs"
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            onClick={() => setViewMode('cards')}
            className="h-7 text-xs"
          >
            Cards
          </Button>
          <Button
            size="xs"
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            onClick={() => setViewMode('table')}
            className="h-7 text-xs"
          >
            Table
          </Button>
        </div>

        <Button
          size="sm"
          onClick={() => setUploadModalOpen(true)}
          className="text-xs gap-1.5 h-8 bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
        >
          <Bot className="h-3.5 w-3.5" />
          <span>Ingest Transcript</span>
        </Button>
      </PageHeader>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search transcript speech text, takeaways..."
              value={filters.search || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="w-[160px]">
            <Select
              value={filters.clientId || 'all'}
              onValueChange={(val) => setFilters((prev) => ({ ...prev, clientId: val }))}
            >
              <SelectTrigger className="h-8 text-xs border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[160px]">
            <Select
              value={filters.source || 'all'}
              onValueChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  source: val as TranscriptFilters['source']
                }))
              }
            >
              <SelectTrigger className="h-8 text-xs border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Source / Ingestion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="read_ai">Read AI (Webhook)</SelectItem>
                <SelectItem value="manual">Manual Ingestion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <span className="text-xs text-slate-500 font-mono">
            Showing {transcripts.length} transcripts
          </span>

          <Button
            variant="outline"
            size="xs"
            onClick={handleExportCSV}
            className="h-8 text-xs gap-1 border-slate-200 dark:border-slate-700"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transcripts.map((t) => (
            <Card
              key={t.id}
              onClick={() => navigate(`/transcripts/${t.id}`)}
              className="border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer group shadow-2xs hover:shadow-sm"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                        {t.clientName}
                      </span>
                      <span className="text-xs text-slate-400">&bull;</span>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(t.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                      {t.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {t.source === 'read_ai' ? (
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-[10px] gap-1 font-mono">
                        <Bot className="h-3 w-3" /> Read AI
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        Manual
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Auto-match Indicator */}
                {t.meetingTitle && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 w-full truncate">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="text-slate-400">Matched to meeting:</span>
                    <span className="font-medium truncate">{t.meetingTitle}</span>
                  </div>
                )}

                {/* Key Takeaways Preview */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Key Takeaways ({t.keyTakeaways.length})
                  </span>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    {t.keyTakeaways.slice(0, 2).map((k, i) => (
                      <li key={i} className="line-clamp-1 flex items-start gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer metadata */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {t.totalDuration}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <ListTodo className="h-3.5 w-3.5 text-slate-400" />
                      {t.actionItems.length} action items
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      {t.parts.length} parts
                    </span>
                  </div>

                  <span className="text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Read transcript &rarr;
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px]">Date &amp; Time</TableHead>
                <TableHead className="w-[160px]">Client</TableHead>
                <TableHead>Transcript Title</TableHead>
                <TableHead>Source / Match</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Action Items</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transcripts.map((t) => (
                <TableRow
                  key={t.id}
                  onClick={() => navigate(`/transcripts/${t.id}`)}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <TableCell className="font-mono text-xs">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {new Date(t.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-semibold text-slate-900 dark:text-white">
                    {t.clientName}
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                        {t.title}
                      </span>
                      <p className="text-[11px] text-slate-500 truncate max-w-md">
                        {t.keyTakeaways[0] || 'Strategic discussion'}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    {t.source === 'read_ai' ? (
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-[10px] gap-1 font-mono">
                        <Bot className="h-3 w-3" /> Read AI
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        Manual
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="font-mono text-xs text-slate-500">
                    {t.totalDuration}
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                      {t.actionItems.filter((a) => a.completed).length} / {t.actionItems.length}
                    </span>
                  </TableCell>

                  <TableCell className="text-right text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium group-hover:underline">
                      Open &rarr;
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Upload / Ingest Modal */}
      <TranscriptUploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
    </div>
  )
}
