import React, { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { useImports } from '@/hooks/useImports'
import { ImportBatch, ImportErrorLog } from '@/types/import'
import { formatNumber } from '@/lib/utils'
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  FileText,
  Database,
  Sparkles,
  Layers,
  Info,
  Calendar,
  Users,
  Megaphone,
  ArrowRight,
  Eye,
  Check,
  FileCode2
} from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

export const ImportsPage: React.FC = () => {
  const {
    batches,
    isLoading,
    runImport,
    isImporting,
    downloadTemplate
  } = useImports()

  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState<{ percent: number; step: string } | null>(null)
  const [selectedBatchForErrors, setSelectedBatchForErrors] = useState<ImportBatch | null>(null)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [inspectBatchModalOpen, setInspectBatchModalOpen] = useState(false)
  const [selectedBatchDetails, setSelectedBatchDetails] = useState<ImportBatch | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.csv') || file.name.endsWith('.xls')) {
        setSelectedFile(file)
      } else {
        toast.error('Please upload a valid .xlsx or .csv workbook')
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleExecuteImport = async (fileToUse?: { name: string; size: number }) => {
    const file = fileToUse || selectedFile
    if (!file) {
      toast.error('Please select an Excel (.xlsx) or CSV file first')
      return
    }

    setImportProgress({ percent: 10, step: 'Connecting to storage bucket "imports"...' })
    try {
      const result = await runImport({
        file: { name: file.name, size: file.size },
        onProgress: (percent, step) => {
          setImportProgress({ percent, step })
        }
      })

      if (result.status === 'completed') {
        toast.success(`Import completed successfully! Parsed ${result.successRows} rows.`)
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        })
      } else if (result.status === 'partial') {
        toast.warning(`Import completed with warnings: ${result.errorRows} errors detected in workbook.`)
      } else {
        toast.error('Import failed during Edge Function schema validation.')
      }

      setSelectedFile(null)
    } catch {
      toast.error('An unexpected error occurred during import execution.')
    } finally {
      setTimeout(() => {
        setImportProgress(null)
      }, 1200)
    }
  }

  const getStatusBadge = (status: ImportBatch['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success" className="gap-1 font-mono text-[11px]">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        )
      case 'partial':
        return (
          <Badge variant="warning" className="gap-1 font-mono text-[11px]">
            <AlertTriangle className="h-3 w-3" />
            Partial (Errors)
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="destructive" className="gap-1 font-mono text-[11px]">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        )
      case 'processing':
        return (
          <Badge variant="default" className="gap-1 font-mono text-[11px] bg-sky-500">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Processing
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="gap-1 font-mono text-[11px]">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Imports & Workbooks"
        description="Bulk import agency clients, meeting rosters, and outbound PR campaign logs via multi-sheet Excel (.xlsx) workbooks or CSV files with Supabase Edge Functions validation."
        badge={
          <Badge variant="outline" className="text-xs font-mono">
            {batches.length} Historical Batches
          </Badge>
        }
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadTemplate()}
            className="text-xs gap-1.5 h-8 bg-card shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Download CSV Template</span>
          </Button>
        </div>
      </PageHeader>

      {/* Top Banner / Upload Zone + Quick Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Dropzone */}
        <div className="lg:col-span-2">
          <Card className="border-border/80 shadow-2xs h-full flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <UploadCloud className="h-5 w-5 text-sky-500" />
                    <span>Upload Workbook to &quot;imports&quot; Storage Bucket</span>
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Supabase Storage bucket triggers Edge Function <code className="text-primary font-mono font-semibold">xlsx-import</code> for idempotent upserting.
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  Max 25 MB
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                  dragActive
                    ? 'border-sky-500 bg-sky-500/5'
                    : 'border-border/80 hover:border-slate-300 dark:hover:border-slate-700 bg-muted/20'
                }`}
              >
                <input
                  type="file"
                  id="excel-file-upload"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleFileInput}
                  disabled={isImporting}
                />
                <label
                  htmlFor="excel-file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2.5"
                >
                  <div className="h-12 w-12 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {selectedFile ? selectedFile.name : 'Click to select or drag & drop workbook'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports multi-sheet <span className="font-mono font-medium">.xlsx</span>, <span className="font-mono font-medium">.xls</span>, and flat <span className="font-mono font-medium">.csv</span>
                    </p>
                  </div>
                </label>

                {selectedFile && (
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="font-mono text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB &bull; Ready to process
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedFile(null)
                        }}
                        disabled={isImporting}
                      >
                        Remove
                      </Button>
                      <Button
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleExecuteImport()
                        }}
                        disabled={isImporting}
                        className="bg-sky-500 hover:bg-sky-600 text-white gap-1"
                      >
                        <UploadCloud className="h-3 w-3" />
                        Execute Import
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar Animation */}
              {importProgress && (
                <div className="rounded-lg bg-sky-500/10 border border-sky-500/20 p-3.5 space-y-2 animate-in fade-in-50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-sky-700 dark:text-sky-300 flex items-center gap-2">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      {importProgress.step}
                    </span>
                    <span className="font-mono font-bold text-sky-700 dark:text-sky-300">
                      {importProgress.percent}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-sky-200 dark:bg-sky-950">
                    <div
                      className="h-full bg-sky-500 transition-all duration-300 rounded-full"
                      style={{ width: `${importProgress.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Demo Test Simulations & Presets */}
        <div>
          <Card className="border-border/80 shadow-2xs h-full flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Simulate Edge Import Scenarios</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Run immediate simulated test files to test database upsert and validation error handling.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <button
                onClick={() =>
                  handleExecuteImport({
                    name: 'Q3_Agency_Master_Roster_Full.xlsx',
                    size: 2450000
                  })
                }
                disabled={isImporting}
                className="w-full text-left p-2.5 rounded-lg border border-border/80 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Clean Full Import (Success)
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    ~50 rows
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Clients, Meetings &amp; Campaigns with valid schema fields.
                </p>
              </button>

              <button
                onClick={() =>
                  handleExecuteImport({
                    name: 'Client_Campaign_Partial_Data.xlsx',
                    size: 1840000
                  })
                }
                disabled={isImporting}
                className="w-full text-left p-2.5 rounded-lg border border-border/80 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    Partial Import with Warnings
                  </span>
                  <Badge variant="warning" className="text-[10px] font-mono">
                    3 errors
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Validates non-blocking row errors logged to batch inspect table.
                </p>
              </button>

              <button
                onClick={() =>
                  handleExecuteImport({
                    name: 'Corrupted_Workbook_Structure.xlsx',
                    size: 940000
                  })
                }
                disabled={isImporting}
                className="w-full text-left p-2.5 rounded-lg border border-border/80 hover:border-red-500/50 hover:bg-red-500/5 transition-all text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-red-500" />
                    Corrupt Binary / Bad Schema
                  </span>
                  <Badge variant="destructive" className="text-[10px] font-mono">
                    Fatal
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Tests rollback mechanism and Edge Function error capturing.
                </p>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Supported Sheet Formats Guide Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-500" />
            <span>Supported Excel Sheet Schema Specifications</span>
          </h3>
          <span className="text-xs text-muted-foreground">
            Edge Function automatically detects sheet names
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sheet 1: Clients */}
          <Card className="border-border/80 bg-card/60 shadow-2xs">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-sky-500" />
                  Sheet: &quot;Clients&quot;
                </span>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  Primary
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Required Columns:
              </p>
              <div className="rounded-md bg-muted/40 p-2 font-mono text-[10px] text-slate-700 dark:text-slate-300 space-y-0.5">
                <div>Client Name, Company, Status</div>
                <div>Tier, Monthly Retainer, Industry</div>
                <div>Primary Contact, Contact Email</div>
              </div>
            </CardContent>
          </Card>

          {/* Sheet 2: Meetings */}
          <Card className="border-border/80 bg-card/60 shadow-2xs">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                  Sheet: &quot;Meetings&quot;
                </span>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  Calendar Sync
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Required Columns:
              </p>
              <div className="rounded-md bg-muted/40 p-2 font-mono text-[10px] text-slate-700 dark:text-slate-300 space-y-0.5">
                <div>Client Name, Meeting Title, Date</div>
                <div>Time, Duration (min), Meeting Type</div>
                <div>Cal.com UID / GCal Event ID</div>
              </div>
            </CardContent>
          </Card>

          {/* Sheet 3: Campaigns */}
          <Card className="border-border/80 bg-card/60 shadow-2xs">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Megaphone className="h-3.5 w-3.5 text-amber-500" />
                  Sheet: &quot;Campaigns&quot;
                </span>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  PR Blasts
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Required Columns:
              </p>
              <div className="rounded-md bg-muted/40 p-2 font-mono text-[10px] text-slate-700 dark:text-slate-300 space-y-0.5">
                <div>Campaign Title, Client Name, Status</div>
                <div>Start Date, End Date, Type</div>
                <div>Pitched, Impressions, Secured Hits</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Historical Batches Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Database className="h-4 w-4 text-sky-500" />
            <span>Import Batch History (import_batches table)</span>
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            Audit trail preserved in Supabase
          </span>
        </div>

        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[280px]">File &amp; Storage Path</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Total Rows</TableHead>
                <TableHead className="text-center">Successful</TableHead>
                <TableHead className="text-center">Errors</TableHead>
                <TableHead>Sheets Parsed</TableHead>
                <TableHead>Executed At</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-xs text-muted-foreground">
                    Loading historical import batches...
                  </TableCell>
                </TableRow>
              ) : batches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-xs text-muted-foreground">
                    No import batches found. Upload your first Excel workbook above.
                  </TableCell>
                </TableRow>
              ) : (
                batches.map((batch) => (
                  <TableRow key={batch.id} className="hover:bg-muted/40 transition-colors">
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <FileSpreadsheet className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                          {batch.fileName}
                        </span>
                        <div className="text-[11px] font-mono text-muted-foreground">
                          {batch.filePath} &bull; {batch.fileSize || '1.8 MB'}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">
                        {batch.source}
                      </Badge>
                    </TableCell>

                    <TableCell>{getStatusBadge(batch.status)}</TableCell>

                    <TableCell className="text-center text-xs font-mono font-medium">
                      {formatNumber(batch.totalRows)}
                    </TableCell>

                    <TableCell className="text-center text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatNumber(batch.successRows)}
                    </TableCell>

                    <TableCell className="text-center text-xs font-mono">
                      {batch.errorRows > 0 ? (
                        <span className="font-bold text-red-600 dark:text-red-400">
                          {batch.errorRows}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {batch.sheetsSummary?.clients !== undefined && (
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 font-normal">
                            Clients ({batch.sheetsSummary.clients})
                          </Badge>
                        )}
                        {batch.sheetsSummary?.meetings !== undefined && (
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 font-normal">
                            Meetings ({batch.sheetsSummary.meetings})
                          </Badge>
                        )}
                        {batch.sheetsSummary?.campaigns !== undefined && (
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 font-normal">
                            Campaigns ({batch.sheetsSummary.campaigns})
                          </Badge>
                        )}
                        {!batch.sheetsSummary && (
                          <span className="text-[10px] text-muted-foreground">Standard</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {new Date(batch.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {batch.errorRows > 0 ? (
                          <Button
                            size="xs"
                            variant="destructive"
                            onClick={() => {
                              setSelectedBatchForErrors(batch)
                              setErrorModalOpen(true)
                            }}
                            className="h-7 text-[11px] gap-1"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            <span>Errors ({batch.errorRows})</span>
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => {
                              setSelectedBatchDetails(batch)
                              setInspectBatchModalOpen(true)
                            }}
                            className="h-7 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Inspect</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Error Log Inspector Modal */}
      <Dialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <DialogTitle>Import Error Log Inspector</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Batch <span className="font-mono font-semibold">{selectedBatchForErrors?.id}</span> &bull; File: {selectedBatchForErrors?.fileName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">
                Edge Function Schema Validation Report:
              </p>
              <p>
                Rows below failed data normalization checks. Other valid rows were successfully upserted into the database without rollback.
              </p>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[120px]">Sheet</TableHead>
                    <TableHead className="w-[80px]">Row #</TableHead>
                    <TableHead>Validation Error Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedBatchForErrors?.errorLog && selectedBatchForErrors.errorLog.length > 0 ? (
                    selectedBatchForErrors.errorLog.map((err, i) => (
                      <TableRow key={i} className="hover:bg-muted/20">
                        <TableCell className="font-semibold text-xs text-foreground">
                          {err.sheet || 'Workbook'}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                          Row {err.row}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {err.message}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-xs text-muted-foreground">
                        No error logs recorded for this batch.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setErrorModalOpen(false)}>
              Close Inspector
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clean Batch Details Modal */}
      <Dialog open={inspectBatchModalOpen} onOpenChange={setInspectBatchModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <DialogTitle>Batch Execution Summary</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Batch ID: {selectedBatchDetails?.id} &bull; Executed via Supabase Edge Function
            </DialogDescription>
          </DialogHeader>

          {selectedBatchDetails && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/30 border">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Total Rows</span>
                  <span className="text-base font-bold font-mono">{selectedBatchDetails.totalRows}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Status</span>
                  {getStatusBadge(selectedBatchDetails.status)}
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Started</span>
                  <span className="font-mono text-muted-foreground">
                    {selectedBatchDetails.startedAt ? new Date(selectedBatchDetails.startedAt).toLocaleTimeString() : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Completed</span>
                  <span className="font-mono text-muted-foreground">
                    {selectedBatchDetails.completedAt ? new Date(selectedBatchDetails.completedAt).toLocaleTimeString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-foreground">Storage Asset</span>
                <p className="font-mono text-[11px] text-muted-foreground bg-muted p-2 rounded">
                  storage://{selectedBatchDetails.filePath}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button size="sm" onClick={() => setInspectBatchModalOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default ImportsPage
