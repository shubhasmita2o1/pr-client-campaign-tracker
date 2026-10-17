import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useClients } from '@/hooks/useClients'
import { useMeetings } from '@/hooks/useMeetings'
import { useCreateTranscript } from '@/hooks/useTranscripts'
import { Bot, Sparkles, Upload, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface TranscriptUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const TranscriptUploadModal: React.FC<TranscriptUploadModalProps> = ({
  open,
  onOpenChange
}) => {
  const { data: clients = [] } = useClients()
  const { data: meetings = [] } = useMeetings()
  const createTranscriptMutation = useCreateTranscript()

  const [mode, setMode] = useState<'read_ai' | 'manual'>('read_ai')
  const [clientId, setClientId] = useState('')
  const [meetingId, setMeetingId] = useState('')
  const [title, setTitle] = useState('')
  const [takeaways, setTakeaways] = useState('')
  const [rawText, setRawText] = useState('')
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSimulateReadAi = async () => {
    if (!clientId) {
      toast.error('Please select a client for this transcript.')
      return
    }

    const client = clients.find((c) => c.id === clientId)
    const selectedMeeting = meetings.find((m) => m.id === meetingId)

    setIsSimulating(true)
    await new Promise((res) => setTimeout(res, 1200))

    try {
      await createTranscriptMutation.mutateAsync({
        clientId,
        clientName: client?.name || 'Selected Client',
        meetingId: selectedMeeting?.id,
        meetingTitle: selectedMeeting?.title,
        title: title || `${client?.name} Strategic Advisory Session`,
        date: new Date().toISOString(),
        totalDuration: '45 mins',
        source: 'read_ai',
        externalId: `read_ai_rec_${Date.now().toString().slice(-6)}`,
        participants: [
          'Elena Rostova (Agency)',
          'Marcus Vance (Agency)',
          client?.primaryContact.name || 'Client Lead'
        ],
        keyTakeaways: takeaways
          ? takeaways.split('\n').filter(Boolean)
          : [
              'Executive alignment confirmed on Q4 media messaging.',
              'Reporter embargo timeline agreed for Bloomberg and Forbes.',
              'Customer testimonial quotes to be approved by compliance.'
            ],
        actionItems: [
          {
            id: `act-${Date.now()}-1`,
            task: 'Send revised embargo pitch draft to client team',
            assignee: 'Marcus Vance',
            completed: false
          },
          {
            id: `act-${Date.now()}-2`,
            task: 'Confirm CEO availability for CNBC Squawk Box segment',
            assignee: 'Elena Rostova',
            completed: false
          }
        ],
        parts: [
          {
            id: `part-${Date.now()}-1`,
            partNumber: 1,
            title: 'Strategy & Media Angles',
            duration: '22 mins',
            segments: [
              {
                id: `seg-${Date.now()}-1`,
                speaker: 'Marcus Vance',
                speakerRole: 'Agency Tech Lead',
                isClient: false,
                timestamp: '00:30',
                text: 'Welcome everyone. Today we are aligning on the final pitch angle for the October announcement.',
                sentiment: 'positive'
              },
              {
                id: `seg-${Date.now()}-2`,
                speaker: client?.primaryContact.name || 'Client Lead',
                speakerRole: client?.primaryContact.title || 'Client Executive',
                isClient: true,
                timestamp: '02:15',
                text: 'We are excited. Our board reviewed the preliminary reporter list and approved the Bloomberg exclusive approach.',
                sentiment: 'positive'
              }
            ]
          },
          {
            id: `part-${Date.now()}-2`,
            partNumber: 2,
            title: 'Action Items & Next Steps',
            duration: '23 mins',
            segments: [
              {
                id: `seg-${Date.now()}-3`,
                speaker: 'Elena Rostova',
                speakerRole: 'Agency Partner',
                isClient: false,
                timestamp: '23:40',
                text: 'We will coordinate the press wire release to lift exactly 24 hours after Bloomberg goes live.',
                sentiment: 'neutral'
              }
            ]
          }
        ]
      })

      setIsSimulating(false)
      toast.success('Read AI transcript ingested and auto-matched to meeting!')
      onOpenChange(false)
    } catch {
      setIsSimulating(false)
      toast.error('Failed to create transcript.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center gap-1">
              <Bot className="h-3 w-3" />
              Read AI Webhook Simulation
            </span>
          </div>
          <DialogTitle className="text-lg">Ingest Call Transcript</DialogTitle>
          <DialogDescription className="text-xs">
            Simulate an incoming webhook from Read AI or manually paste a multi-part call transcript.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('read_ai')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                mode === 'read_ai'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              Read AI Webhook (Auto-Parse)
            </button>
            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                mode === 'manual'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Upload className="h-3.5 w-3.5 text-slate-400" />
              Manual Upload
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Client Account *
              </label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select client..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.company})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Associated Meeting (Optional - for auto-matching)
              </label>
              <Select value={meetingId} onValueChange={setMeetingId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Auto-match to scheduled meeting..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Standalone Transcript)</SelectItem>
                  {meetings
                    .filter((m) => !clientId || m.clientId === clientId)
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.title} ({new Date(m.date).toLocaleDateString()})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Transcript Title
              </label>
              <Input
                placeholder="e.g. Series C Embargo Strategy & Tier-1 Media Exclusive Planning"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Key Takeaways (One per line)
              </label>
              <Textarea
                placeholder="Agreed to pitch Bloomberg exclusively&#10;CEO to rehearse for broadcast TV segment&#10;Valuation floor strictly confidential"
                value={takeaways}
                onChange={(e) => setTakeaways(e.target.value)}
                rows={3}
                className="text-xs"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSimulateReadAi}
            disabled={isSimulating || !clientId}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5"
          >
            {isSimulating ? (
              <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Simulate Ingestion</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
