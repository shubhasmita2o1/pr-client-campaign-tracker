export type ClientStatus = 'active' | 'prospect' | 'churned'

export interface ClientOwner {
  id: string
  name: string
  email: string
  avatar: string
  role: string
}

export interface ClientContact {
  name: string
  email: string
  phone?: string
  title: string
}

export interface ProposalDocument {
  id: string
  name: string
  fileSize: string
  uploadedAt: string
  url: string
  type: 'proposal' | 'contract' | 'brief' | 'report'
  status: 'signed' | 'review' | 'draft'
}

export interface Client {
  id: string
  name: string
  company: string
  logo?: string
  status: ClientStatus
  industry: string
  tier: 'Enterprise' | 'Growth' | 'Boutique'
  owner: ClientOwner
  primaryContact: ClientContact
  retainerMonthly: number
  joinedDate: string // YYYY-MM-DD
  website: string
  tags: string[]
  notes: string
  proposalDocs: ProposalDocument[]
}

export interface ClientFilters {
  search?: string
  status?: ClientStatus | 'all'
  ownerId?: string | 'all'
  month?: string | 'all' // e.g., '2026-01'
  industry?: string | 'all'
}

export interface ClientFormData {
  name: string
  company: string
  status: ClientStatus
  industry: string
  tier: 'Enterprise' | 'Growth' | 'Boutique'
  ownerId: string
  primaryContactName: string
  primaryContactEmail: string
  primaryContactTitle: string
  retainerMonthly: number
  website: string
  tags: string[]
  notes?: string
}
