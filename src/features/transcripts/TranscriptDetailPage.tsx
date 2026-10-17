import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranscript, useToggleActionItem, useAddActionItem } from '@/hooks/useTranscripts'
import { MultiPartViewer } from '@/components/transcripts/MultiPartViewer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  Bot,
  Calendar,
  Clock,
  Sparkles,
  Download,
  CheckCircle2,
  ListTodo,
  ExternalLink,
  Users,
  Building2,
  Copy
} from 'lucide-react'
import { toast } from 'sonner'

export const TranscriptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: transcript, isLoading } = useTranscript(id)

  const handleCopyMarkdown = () => {
    if (!transcript) return
    const md = [
      `# ${transcript.title}`,
      `**Client:** ${transcript.clientName}`,
      `**Date:** ${new Date(transcript.date).toLocaleDateString()}`,
      `**Duration:** ${transcript.totalDuration}`,
      `**Source:** ${transcript.source || 'manual'} (${transcript.externalId || 'N/A'})`,
      '',
      '## Key Takeaways',
      ...transcript.keyTakeaways.map((k) => `- ${k}`),
      '',
      '## Action Items',
      ...transcript.actionItems.map((a) => `- [${a.completed ? 'x' : ' '}] ${a.task} (@${a.assignee})`),
      '',
      '## Dialogue Transcript',
      ...transcript.parts.flatMap((p) => [
        `### Part ${p.partNumber}: ${p.title} (${p.duration})`,
        ...p.segments.map((s) => `**[${s.timestamp}] ${s.speaker} (${s.speakerRole}):** ${s.text}`),
        ''
      ])
    ].join('\n')

    navigator.clipboard.writeText(md)
    toast.success('Complete Markdown transcript copied to clipboard!')
  }

  const handleDownloadSummary = () => {
    if (!transcript) return
    const summary = [
      `=====================================================`,
      `EXECUTIVE CALL BRIEFING: ${transcript.title}`,
      `=====================================================`,
      `Client: ${transcript.clientName}`,
      `Date: ${new Date(transcript.date).toLocaleDateString()}`,
      `Duration: ${transcript.totalDuration}`,
      `Participants: ${transcript.participants.join(', ')}`,
      '',
      `KEY STRATEGIC TAKEAWAYS:`,
      ...transcript.keyTakeaways.map((t, idx) => `  ${idx + 1}. ${t}`),
      '',
      `ACTION ITEMS:`,
      ...transcript.actionItems.map((a) => `  [${a.completed ? 'X' : ' '}] ${a.task} -> Assigned to: ${a.assignee}`)
    ].join('\n')

    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${transcript.clientName}_Call_Summary_${transcript.id}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Call executive summary downloaded.')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!transcript) {
    return (
      <div className="py-16 text-center space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Transcript Not Found
        </h3>
        <p className="text-xs text-slate-500">
          The requested call transcript may have been removed or does not exist.
        </p>
        <Button size="sm" onClick={() => navigate('/transcripts')}>
          Back to Transcripts
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button & Action buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/transcripts')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Transcripts</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            onClick={handleCopyMarkdown}
            className="h-8 text-xs gap-1.5 border-slate-200 dark:border-slate-800"
          >
            <Copy className="h-3.5 w-3.5 text-slate-500" />
            <span>Copy Markdown</span>
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={handleDownloadSummary}
            className="h-8 text-xs gap-1.5 border-slate-200 dark:border-slate-800"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Download Summary</span>
          </Button>
        </div>
      </div>

      {/* Transcript Header Master Card */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/clients/${transcript.clientId}`}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  {transcript.clientName}
                </Link>
                <span className="text-xs text-slate-300 dark:text-slate-700">&bull;</span>
                <span className="text-xs text-slate-500 font-mono">
                  {new Date(transcript.date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span className="text-xs text-slate-300 dark:text-slate-700">&bull;</span>
                <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {transcript.totalDuration}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {transcript.title}
              </h1>

              {transcript.meetingTitle && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Auto-matched to calendar meeting:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {transcript.meetingTitle}
                  </span>
                </p>
              )}
            </div>

            <div className="flex flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
              {transcript.source === 'read_ai' ? (
                <div className="text-left md:text-right">
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-xs gap-1 font-mono">
                    <Bot className="h-3.5 w-3.5" /> Read AI Webhook
                  </Badge>
                  {transcript.externalId && (
                    <p className="text-[10px] text-slate-400 font-mono mt-1">
                      Event ID: {transcript.externalId}
                    </p>
                  )}
                </div>
              ) : (
                <Badge variant="outline" className="text-xs">
                  Manual Ingestion
                </Badge>
              )}
            </div>
          </div>

          {/* Participants bar */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap text-xs text-slate-500">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Participants:
            </span>
            {transcript.participants.map((p, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
              >
                {p}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Multi-Part Viewer with Search, Action Items, Key Takeaways, and Audio/Turn Segments */}
      <MultiPartViewer transcript={transcript} />
    </div>
  )
}
