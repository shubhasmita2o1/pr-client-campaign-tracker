import { Client, ClientFilters, ClientFormData, ProposalDocument } from '../types/client'
import { mockClients, agencyOwners } from '../data/mockClients'

const STORAGE_KEY = 'pr_tracker_clients'

function getInitialClients(): Client[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // fallback
    }
  }
  return mockClients
}

let clientsState: Client[] = getInitialClients()

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clientsState))
}

export const clientService = {
  async getClients(filters?: ClientFilters): Promise<Client[]> {
    await new Promise(resolve => setTimeout(resolve, 150)) // simulate network
    let result = [...clientsState]

    if (!filters) return result

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase()
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter(c => c.status === filters.status)
    }

    if (filters.ownerId && filters.ownerId !== 'all') {
      result = result.filter(c => c.owner.id === filters.ownerId)
    }

    if (filters.industry && filters.industry !== 'all') {
      result = result.filter(c => c.industry === filters.industry)
    }

    if (filters.month && filters.month !== 'all') {
      result = result.filter(c => c.joinedDate.startsWith(filters.month!))
    }

    return result
  },

  async getClientById(id: string): Promise<Client | undefined> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return clientsState.find(c => c.id === id)
  },

  async createClient(data: ClientFormData): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const owner = agencyOwners.find(o => o.id === data.ownerId) || agencyOwners[0]
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: data.name,
      company: data.company,
      status: data.status,
      industry: data.industry,
      tier: data.tier,
      owner,
      primaryContact: {
        name: data.primaryContactName,
        email: data.primaryContactEmail,
        title: data.primaryContactTitle
      },
      retainerMonthly: Number(data.retainerMonthly) || 15000,
      joinedDate: new Date().toISOString().split('T')[0],
      website: data.website || 'https://example.com',
      tags: data.tags || ['Growth'],
      notes: data.notes || '',
      proposalDocs: []
    }

    clientsState = [newClient, ...clientsState]
    persist()
    return newClient
  },

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, 150))
    const index = clientsState.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Client not found')

    clientsState[index] = { ...clientsState[index], ...data }
    persist()
    return clientsState[index]
  },

  async deleteClient(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 150))
    clientsState = clientsState.filter(c => c.id !== id)
    persist()
  },

  async uploadProposalDoc(clientId: string, doc: Omit<ProposalDocument, 'id' | 'uploadedAt'>): Promise<ProposalDocument> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const client = clientsState.find(c => c.id === clientId)
    if (!client) throw new Error('Client not found')

    const newDoc: ProposalDocument = {
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      ...doc
    }

    client.proposalDocs = [newDoc, ...(client.proposalDocs || [])]
    persist()
    return newDoc
  },

  async deleteProposalDoc(clientId: string, docId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 150))
    const client = clientsState.find(c => c.id === clientId)
    if (!client) throw new Error('Client not found')

    client.proposalDocs = (client.proposalDocs || []).filter(d => d.id !== docId)
    persist()
  }
}
