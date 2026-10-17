export type ImportBatchStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'partial'

export interface ImportErrorLog {
  sheet?: string
  row: number
  message: string
}

export interface ImportBatch {
  id: string
  source: 'xlsx' | 'csv' | 'manual' | 'other'
  fileName: string
  filePath: string
  status: ImportBatchStatus
  totalRows: number
  successRows: number
  errorRows: number
  errorLog: ImportErrorLog[]
  startedAt?: string
  completedAt?: string
  createdBy?: string
  createdAt: string
  // Extra client-side metadata for rich presentation
  fileSize?: string
  sheetsSummary?: {
    clients?: number
    meetings?: number
    campaigns?: number
  }
}
