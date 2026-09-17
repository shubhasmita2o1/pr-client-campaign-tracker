import React, { useState } from 'react'
import { Campaign, CampaignScreenshot, ExtractedMetricResult } from '@/types/campaign'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileImage,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Eye
} from 'lucide-react'
import { useExtractMetricsFromScreenshot, useApplyExtractedMetrics } from '@/hooks/useCampaigns'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { formatNumber } from '@/lib/utils'

interface ScreenshotAiExtractorModalProps {
  campaign: Campaign
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SAMPLE_SCREENSHOTS = [
  {
    name: 'MuckRack_Analytics_TechCrunch_Pitch.png',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    size: '1.4 MB',
    source: 'Muck Rack PR Platform'
  },
  {
    name: 'Cision_Newswire_Distribution_Wire.png',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    size: '2.2 MB',
    source: 'Cision Media Monitoring'
  },
  {
    name: 'BuzzSumo_Viral_Pickup_Metrics.png',
    url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=80',
    size: '1.7 MB',
    source: 'BuzzSumo Social Signals'
  }
]

export const ScreenshotAiExtractorModal: React.FC<ScreenshotAiExtractorModalProps> = ({
  campaign,
  open,
  onOpenChange
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string
    url: string
    size: string
  } | null>(null)

  const [isScanning, setIsScanning] = useState(false)
  const [extractedResult, setExtractedResult] = useState<{
    screenshot: CampaignScreenshot
    campaign: Campaign
  } | null>(null)

  const extractMutation = useExtractMetricsFromScreenshot()
  const applyMutation = useApplyExtractedMetrics()

  const handleSelectSample = (sample: (typeof SAMPLE_SCREENSHOTS)[0]) => {
    setSelectedFile({
      name: sample.name,
      url: sample.url,
      size: sample.size
    })
    setExtractedResult(null)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedFile({
        name: file.name,
        url: reader.result as string,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      })
      setExtractedResult(null)
    }
    reader.readAsDataURL(file)
  }

  const handleRunExtraction = async () => {
    if (!selectedFile) {
      toast.error('Please upload or select a screenshot first')
      return
    }

    setIsScanning(true)
    try {
      const result = await extractMutation.mutateAsync({
        campaignId: campaign.id,
        fileName: selectedFile.name,
        thumbnailUrl: selectedFile.url,
        fileSize: selectedFile.size
      })
      setExtractedResult(result)
      toast.success('AI OCR Vision parsed analytics successfully!')
    } catch {
      toast.error('Failed to extract metrics.')
    } finally {
      setIsScanning(false)
    }
  }

  const handleApplyToTable = async () => {
    if (!extractedResult) return
    try {
      await applyMutation.mutateAsync({
        campaignId: campaign.id,
        screenshotId: extractedResult.screenshot.id
      })
      toast.success('Extracted metrics added to campaign table!')
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      })
      onOpenChange(false)
    } catch {
      toast.error('Failed to apply metrics to table.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <DialogTitle>Extract Campaign Metrics with AI Vision</DialogTitle>
          </div>
          <DialogDescription>
            Upload a dashboard screenshot from Muck Rack, Cision, Meltwater, or Google Analytics to automatically parse numbers into your campaign performance table.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Step 1: Upload or Choose Sample */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step 1: Upload or Select Analytics Screenshot
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Dropzone */}
              <div className="rounded-xl border border-dashed border-border p-4 text-center bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center">
                <input
                  type="file"
                  id="screenshot-file-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="screenshot-file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    Upload Custom Screenshot
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    PNG, JPG, WebP up to 10MB
                  </span>
                </label>
              </div>

              {/* Sample Screenshots picker */}
              <div className="space-y-1.5">
                <p className="text-[11px] text-muted-foreground font-medium">
                  Or test with sample PR reports:
                </p>
                <div className="space-y-1.5">
                  {SAMPLE_SCREENSHOTS.map(sample => (
                    <div
                      key={sample.name}
                      onClick={() => handleSelectSample(sample)}
                      className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                        selectedFile?.name === sample.name
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border/60 bg-card hover:bg-muted/50 text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileImage className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate font-medium">{sample.source}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
                        {sample.size}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Selected Preview & Trigger Action */}
          {selectedFile && (
            <div className="rounded-xl border border-border/80 bg-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileImage className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{selectedFile.name}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{selectedFile.size}</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={handleRunExtraction}
                  disabled={isScanning}
                  className="gap-1.5 bg-primary hover:bg-primary/90 text-xs shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isScanning ? 'Analyzing with AI Vision...' : 'Extract Metrics with AI'}</span>
                </Button>
              </div>

              {/* Visual Preview Container */}
              <div className="relative rounded-lg overflow-hidden border border-border/80 max-h-[220px] bg-black/90 flex items-center justify-center">
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="w-full h-full object-cover opacity-90"
                />

                {/* Simulated scanning radar beam */}
                {isScanning && (
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-2xs flex flex-col items-center justify-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center animate-spin">
                      <BrainCircuit className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-semibold text-white tracking-wide animate-pulse">
                      Parsing OCR tabular structure &amp; PR impressions...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Extracted Results Preview */}
          {extractedResult && extractedResult.screenshot.extractedMetrics && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-4 animate-in fade-in-50">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Metrics Successfully Extracted
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {extractedResult.screenshot.extractedMetrics.notes}
                    </p>
                  </div>
                </div>

                <Badge variant="success" className="gap-1 font-mono text-xs">
                  <Sparkles className="h-3 w-3" />
                  {extractedResult.screenshot.extractedMetrics.confidenceScore}% Confidence
                </Badge>
              </div>

              {/* Extracted numbers grid */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 pt-1">
                <div className="rounded-lg bg-background p-2.5 border text-center">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Pitched</p>
                  <p className="text-base font-bold text-foreground">
                    {extractedResult.screenshot.extractedMetrics.pitched}
                  </p>
                </div>
                <div className="rounded-lg bg-background p-2.5 border text-center">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Impressions</p>
                  <p className="text-base font-bold text-foreground">
                    {formatNumber(extractedResult.screenshot.extractedMetrics.impressions || 0)}
                  </p>
                </div>
                <div className="rounded-lg bg-background p-2.5 border text-center">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Opens</p>
                  <p className="text-base font-bold text-foreground">
                    {extractedResult.screenshot.extractedMetrics.opens}
                  </p>
                </div>
                <div className="rounded-lg bg-background p-2.5 border text-center">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Clicks</p>
                  <p className="text-base font-bold text-foreground">
                    {extractedResult.screenshot.extractedMetrics.clicks}
                  </p>
                </div>
                <div className="rounded-lg bg-background p-2.5 border text-center">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Replies</p>
                  <p className="text-base font-bold text-foreground">
                    {extractedResult.screenshot.extractedMetrics.replies}
                  </p>
                </div>
                <div className="rounded-lg bg-background p-2.5 border text-center border-emerald-500/40">
                  <p className="text-[10px] uppercase text-emerald-600 dark:text-emerald-400 font-semibold">Coverage</p>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {extractedResult.screenshot.extractedMetrics.coverageSecured}
                  </p>
                </div>
              </div>

              {/* Commit button */}
              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button
                  size="sm"
                  onClick={handleApplyToTable}
                  disabled={applyMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs shadow-sm"
                >
                  <span>{applyMutation.isPending ? 'Adding to table...' : 'Insert into Metrics Table'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
