import { ImportBatch, ImportErrorLog } from '../types/import'
import { mockImportBatches } from '../mock/mockBatches'

const STORAGE_KEY = 'pr_tracker_import_batches'

function getInitialBatches(): ImportBatch[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // fallback
    }
  }
  return mockImportBatches
}

let batchesState: ImportBatch[] = getInitialBatches()

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(batchesState))
}

export const importService = {
  async getBatches(): Promise<ImportBatch[]> {
    await new Promise((res) => setTimeout(res, 150))
    return [...batchesState].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  async getBatchById(id: string): Promise<ImportBatch | undefined> {
    await new Promise((res) => setTimeout(res, 100))
    return batchesState.find((b) => b.id === id)
  },

  async runMockImport(
    file: { name: string; size: number },
    onProgress?: (progress: number, step: string) => void
  ): Promise<ImportBatch> {
    const batchId = `batch-${Date.now().toString().slice(-4)}`
    const isErrorSimulation = file.name.toLowerCase().includes('corrupt') || file.name.toLowerCase().includes('error')
    const isPartialSimulation = file.name.toLowerCase().includes('partial')

    onProgress?.(15, 'Uploading to "imports" storage bucket...')
    await new Promise((res) => setTimeout(res, 400))

    onProgress?.(40, 'Invoking Edge Function xlsx-import...')
    await new Promise((res) => setTimeout(res, 600))

    onProgress?.(70, 'Parsing sheets: Clients, Meetings, Campaigns...')
    await new Promise((res) => setTimeout(res, 600))

    onProgress?.(90, 'Upserting database records & running idempotency checks...')
    await new Promise((res) => setTimeout(res, 400))

    const totalRows = Math.floor(Math.random() * 60) + 30
    let status: ImportBatch['status'] = 'completed'
    let errorRows = 0
    let successRows = totalRows
    let errorLog: ImportErrorLog[] = []

    if (isErrorSimulation) {
      status = 'failed'
      errorRows = totalRows
      successRows = 0
      errorLog = [
        { sheet: 'Sheet1', row: 1, message: 'Header validation failed: unrecognized column structure' },
        { sheet: 'Sheet1', row: 2, message: 'Corrupted binary stream inside Excel workbook' }
      ]
    } else if (isPartialSimulation) {
      status = 'partial'
      errorRows = 3
      successRows = totalRows - 3
      errorLog = [
        { sheet: 'Clients', row: 8, message: 'Missing primary contact email' },
        { sheet: 'Meetings', row: 17, message: 'Invalid date format: "Next Friday"' },
        { sheet: 'Campaigns', row: 24, message: 'Unmatched client name' }
      ]
    }

    const newBatch: ImportBatch = {
      id: batchId,
      source: file.name.endsWith('.csv') ? 'csv' : 'xlsx',
      fileName: file.name,
      filePath: `imports/${file.name}`,
      status,
      totalRows,
      successRows,
      errorRows,
      errorLog,
      startedAt: new Date(Date.now() - 2000).toISOString(),
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      sheetsSummary: {
        clients: Math.round(successRows * 0.2),
        meetings: Math.round(successRows * 0.5),
        campaigns: Math.round(successRows * 0.3)
      }
    }

    batchesState = [newBatch, ...batchesState]
    persist()
    onProgress?.(100, 'Import completed successfully!')
    return newBatch
  },

  downloadSampleTemplate(type: 'clients' | 'meetings' | 'campaigns' | 'all' = 'all') {
    // Generate valid CSV text for download
    let content = ''
    let filename = 'PR_Agency_Import_Template.csv'

    if (type === 'clients' || type === 'all') {
      content = `Client Name,Company,Status,Industry,Tier,Primary Contact,Contact Email,Website,Monthly Retainer,Notes\n` +
        `Apex Robotics,Apex Robotics Inc,active,Robotics,Enterprise,Kenji Sato,kenji@apexrobotics.ai,https://apexrobotics.ai,25000,Series B startup\n` +
        `BioVital Therapeutics,BioVital Health,prospect,Healthtech,Growth,Dr. Sarah Chen,schen@biovital.com,https://biovital.com,18000,FDA Phase 2 launch`
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
