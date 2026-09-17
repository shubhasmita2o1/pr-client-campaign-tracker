import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bold,
  Italic,
  List,
  Copy,
  Save,
  Check,
  Sparkles,
  RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'
import { useUpdateCampaignCopy } from '@/hooks/useCampaigns'

interface CampaignCopyEditorProps {
  campaignId: string
  initialCopy: string
}

export const CampaignCopyEditor: React.FC<CampaignCopyEditorProps> = ({
  campaignId,
  initialCopy
}) => {
  const [copyText, setCopyText] = useState(initialCopy)
  const [copied, setCopied] = useState(false)
  const updateCopyMutation = useUpdateCampaignCopy()

  const isDirty = copyText !== initialCopy

  const handleSave = async () => {
    try {
      await updateCopyMutation.mutateAsync({ id: campaignId, copyText })
      toast.success('Campaign pitch copy updated successfully!')
    } catch {
      toast.error('Failed to save changes.')
    }
  }

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(copyText)
    setCopied(true)
    toast.success('Pitch copy copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const insertPlaceholder = (token: string) => {
    setCopyText(prev => prev + ` ${token} `)
  }

  const wordCount = copyText.trim() ? copyText.trim().split(/\s+/).length : 0
  const charCount = copyText.length

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs space-y-0">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-muted/40 px-3 py-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            Personalization Tags:
          </span>
          <Button
            size="xs"
            variant="outline"
            onClick={() => insertPlaceholder('[First Name]')}
            className="h-6 text-[11px] bg-background"
          >
            [First Name]
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => insertPlaceholder('[Publication]')}
            className="h-6 text-[11px] bg-background"
          >
            [Publication]
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => insertPlaceholder('[Embargo Date]')}
            className="h-6 text-[11px] bg-background"
          >
            [Embargo Date]
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => insertPlaceholder('[Media Kit Link]')}
            className="h-6 text-[11px] bg-background"
          >
            [Media Kit Link]
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <Badge variant="warning" className="text-[10px] py-0">
              Unsaved Edits
            </Badge>
          )}
          <Button
            variant="ghost"
            size="xs"
            onClick={handleCopyClipboard}
            className="h-7 text-xs gap-1"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
          <Button
            size="xs"
            onClick={handleSave}
            disabled={!isDirty || updateCopyMutation.isPending}
            className="h-7 text-xs gap-1"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{updateCopyMutation.isPending ? 'Saving...' : 'Save Pitch'}</span>
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="p-4">
        <Textarea
          value={copyText}
          onChange={e => setCopyText(e.target.value)}
          rows={14}
          className="font-mono text-xs sm:text-sm leading-relaxed resize-y border-0 shadow-none focus-visible:ring-0 p-0 bg-transparent"
          placeholder="Write your email pitch, journalist briefing angles, or press release copy..."
        />
      </div>

      {/* Stats footer */}
      <div className="flex items-center justify-between border-t border-border/60 px-4 py-2 text-[11px] text-muted-foreground bg-muted/20">
        <div className="flex items-center gap-3">
          <span>Words: {wordCount}</span>
          <span>&bull;</span>
          <span>Characters: {charCount}</span>
          <span>&bull;</span>
          <span>Reading time: ~{Math.ceil(wordCount / 200)} min</span>
        </div>
        {isDirty && (
          <button
            onClick={() => setCopyText(initialCopy)}
            className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" /> Discard changes
          </button>
        )}
      </div>
    </div>
  )
}
