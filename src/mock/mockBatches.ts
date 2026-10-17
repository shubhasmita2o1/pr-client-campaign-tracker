import { ImportBatch } from '../types/import'

export const mockImportBatches: ImportBatch[] = [
  {
    id: 'batch-001',
    source: 'xlsx',
    fileName: 'Q3_Agency_Historical_Clients_Meetings.xlsx',
    filePath: 'imports/batch-001-Q3_Agency_Historical.xlsx',
    status: 'completed',
    totalRows: 148,
    successRows: 148,
    errorRows: 0,
    errorLog: [],
    startedAt: '2026-09-10T14:30:00Z',
    completedAt: '2026-09-10T14:31:12Z',
    createdBy: 'usr-1',
    createdAt: '2026-09-10T14:30:00Z',
    fileSize: '1.4 MB',
    sheetsSummary: {
      clients: 12,
      meetings: 86,
      campaigns: 50
    }
  },
  {
    id: 'batch-002',
    source: 'xlsx',
    fileName: 'Tech_Sector_Outreach_Campaigns_2026.xlsx',
    filePath: 'imports/batch-002-Tech_Sector_Outreach.xlsx',
    status: 'completed',
    totalRows: 74,
    successRows: 74,
    errorRows: 0,
    errorLog: [],
    startedAt: '2026-09-02T11:15:00Z',
    completedAt: '2026-09-02T11:15:45Z',
    createdBy: 'usr-2',
    createdAt: '2026-09-02T11:15:00Z',
    fileSize: '820 KB',
    sheetsSummary: {
      campaigns: 74
    }
  },
  {
    id: 'batch-003',
    source: 'xlsx',
    fileName: 'European_Media_Contacts_Meetings_August.xlsx',
    filePath: 'imports/batch-003-European_Media_Contacts.xlsx',
    status: 'partial',
    totalRows: 92,
    successRows: 88,
    errorRows: 4,
    errorLog: [
      { sheet: 'Meetings', row: 14, message: 'Invalid datetime format for scheduled_at: "TBD Next Week"' },
      { sheet: 'Meetings', row: 29, message: 'No client found matching hint "Veloce Subsid"' },
      { sheet: 'Campaigns', row: 52, message: 'Missing campaign title in column B' },
      { sheet: 'Campaigns', row: 63, message: 'Invalid numeric value for impressions: "Approx 10k"' }
    ],
    startedAt: '2026-08-28T09:20:00Z',
    completedAt: '2026-08-28T09:21:05Z',
    createdBy: 'usr-4',
    createdAt: '2026-08-28T09:20:00Z',
    fileSize: '1.1 MB',
    sheetsSummary: {
      meetings: 52,
      campaigns: 40
    }
  },
  {
    id: 'batch-004',
    source: 'csv',
    fileName: 'Legacy_Client_Roster_2024_2025.csv',
    filePath: 'imports/batch-004-Legacy_Client_Roster.csv',
    status: 'completed',
    totalRows: 24,
    successRows: 24,
    errorRows: 0,
    errorLog: [],
    startedAt: '2026-08-15T16:00:00Z',
    completedAt: '2026-08-15T16:00:22Z',
    createdBy: 'usr-1',
    createdAt: '2026-08-15T16:00:00Z',
    fileSize: '340 KB',
    sheetsSummary: {
      clients: 24
    }
  },
  {
    id: 'batch-005',
    source: 'xlsx',
    fileName: 'Corrupted_Header_Export_Raw.xlsx',
    filePath: 'imports/batch-005-Corrupted_Header.xlsx',
    status: 'failed',
    totalRows: 30,
    successRows: 0,
    errorRows: 30,
    errorLog: [
      { sheet: 'Sheet1', row: 1, message: 'Required headers (Client, Title, Scheduled Date) not recognized' },
      { sheet: 'Sheet1', row: 2, message: 'File format unparseable: unexpected binary tokens at offset 0x24' }
    ],
    startedAt: '2026-08-10T10:00:00Z',
    completedAt: '2026-08-10T10:00:15Z',
    createdBy: 'usr-3',
    createdAt: '2026-08-10T10:00:00Z',
    fileSize: '95 KB'
  }
]
