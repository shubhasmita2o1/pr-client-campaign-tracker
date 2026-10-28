import { supabase, uploadToStorage, getStorageFileUrl, deleteFromStorage } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { Client, ClientFilters, ClientFormData, ProposalDocument, ClientStatus } from '@/types/client'

// Map database row + joined relations to frontend Client domain model
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapClientRow(row: any): Client {
  const ownerProfile = row.owner || {}
  const proposals = Array.isArray(row.proposals) ? row.proposals : []

  return {
    id: row.id,
    name: row.name,
    company: row.company,
    logo: row.logo || undefined,
    status: (row.status as ClientStatus) || 'prospect',
    industry: row.industry || 'Technology',
    tier: (row.tier as 'Enterprise' | 'Growth' | 'Boutique') || 'Growth',
    owner: {
      id: ownerProfile.id || row.owner_id || '00000000-0000-0000-0000-000000000001',
      name: ownerProfile.full_name || 'Elena Rostova',
      email: ownerProfile.email || 'elena@prestige-pr.com',
      avatar: ownerProfile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: ownerProfile.role === 'admin' ? 'Agency Lead' : 'PR Specialist'
    },
    primaryContact: {
      name: row.primary_contact_name || 'Primary Contact',
      email: row.primary_contact_email || '',
      phone: row.primary_contact_phone || undefined,
      title: row.primary_contact_title || 'Lead'
    },
    retainerMonthly: Number(row.retainer_monthly) || 0,
    joinedDate: row.joined_date || (row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
    website: row.website || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    notes: row.notes || '',
    proposalDocs: proposals.map((p: {
      id: string
      name: string
      file_path: string
      file_size?: string | null
      uploaded_at: string
      type?: string | null
      status?: string | null
    }) => ({
      id: p.id,
      name: p.name,
      fileSize: p.file_size || 'PDF Document',
      uploadedAt: p.uploaded_at,
      url: p.file_path,
      filePath: p.file_path,
      type: (p.type as ProposalDocument['type']) || 'proposal',
      status: (p.status as ProposalDocument['status']) || 'draft'
    }))
  }
}

export const clientService = {
  // Fetch clients with filters & search
  async getClients(filters?: ClientFilters): Promise<Client[]> {
    let query = supabase
      .from('clients')
      .select('*, owner:profiles(*), proposals(*)')
      .order('created_at', { ascending: false })

    if (filters) {
      if (filters.search && filters.search.trim()) {
        const q = filters.search.trim()
        query = query.or(`name.ilike.%${q}%,company.ilike.%${q}%,industry.ilike.%${q}%`)
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters.ownerId && filters.ownerId !== 'all') {
        query = query.eq('owner_id', filters.ownerId)
      }

      if (filters.industry && filters.industry !== 'all') {
        query = query.eq('industry', filters.industry)
      }

      if (filters.tier && filters.tier !== 'all') {
        query = query.eq('tier', filters.tier)
      }

      if (filters.month && filters.month !== 'all') {
        // e.g. "2026-09"
        query = query
          .gte('joined_date', `${filters.month}-01`)
          .lte('joined_date', `${filters.month}-31`)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('[clientService.getClients] Supabase query failed:', error)
      throw new Error(`Failed to load clients: ${error.message}`)
    }

    return (data || []).map(mapClientRow)
  },

  // Fetch single client by ID
  async getClientById(id: string): Promise<Client | undefined> {
    const { data, error } = await supabase
      .from('clients')
      .select('*, owner:profiles(*), proposals(*)')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('[clientService.getClientById] Error:', error)
      throw new Error(`Failed to load client: ${error.message}`)
    }

    if (!data) return undefined
    return mapClientRow(data)
  },

  // Create a new client
  async createClient(formData: ClientFormData): Promise<Client> {
    const insertPayload = {
      name: formData.name,
      company: formData.company,
      status: formData.status,
      industry: formData.industry,
      tier: formData.tier,
      owner_id: formData.ownerId && formData.ownerId !== 'all' ? formData.ownerId : null,
      primary_contact_name: formData.primaryContactName,
      primary_contact_email: formData.primaryContactEmail,
      primary_contact_phone: formData.primaryContactPhone || null,
      primary_contact_title: formData.primaryContactTitle,
      retainer_monthly: Number(formData.retainerMonthly) || 0,
      joined_date: formData.joinedDate || new Date().toISOString().split('T')[0],
      website: formData.website || null,
      tags: formData.tags || [],
      notes: formData.notes || null
    }

    const { data, error } = await supabase
      .from('clients')
      .insert(insertPayload)
      .select('*, owner:profiles(*), proposals(*)')
      .single()

    if (error) {
      console.error('[clientService.createClient] Error:', error)
      throw new Error(`Failed to create client: ${error.message}`)
    }

    return mapClientRow(data)
  },

  // Update existing client
  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    // Map domain fields to DB column names if updating DB columns
    const dbUpdates: Database['public']['Tables']['clients']['Update'] = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.company !== undefined) dbUpdates.company = updates.company
    if (updates.status !== undefined) dbUpdates.status = updates.status
    if (updates.industry !== undefined) dbUpdates.industry = updates.industry
    if (updates.tier !== undefined) dbUpdates.tier = updates.tier
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes
    if (updates.website !== undefined) dbUpdates.website = updates.website
    if (updates.retainerMonthly !== undefined) dbUpdates.retainer_monthly = updates.retainerMonthly
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags
    if (updates.joinedDate !== undefined) dbUpdates.joined_date = updates.joinedDate

    if (updates.primaryContact) {
      if (updates.primaryContact.name !== undefined) dbUpdates.primary_contact_name = updates.primaryContact.name
      if (updates.primaryContact.email !== undefined) dbUpdates.primary_contact_email = updates.primaryContact.email
      if (updates.primaryContact.title !== undefined) dbUpdates.primary_contact_title = updates.primaryContact.title
      if (updates.primaryContact.phone !== undefined) dbUpdates.primary_contact_phone = updates.primaryContact.phone
    }

    if (updates.owner?.id) {
      dbUpdates.owner_id = updates.owner.id
    }

    const { data, error } = await supabase
      .from('clients')
      .update(dbUpdates)
      .eq('id', id)
      .select('*, owner:profiles(*), proposals(*)')
      .single()

    if (error) {
      console.error('[clientService.updateClient] Error:', error)
      throw new Error(`Failed to update client: ${error.message}`)
    }

    return mapClientRow(data)
  },

  // Delete client
  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) {
      console.error('[clientService.deleteClient] Error:', error)
      throw new Error(`Failed to delete client: ${error.message}`)
    }
  },

  // Upload a proposal PDF to the 'proposals' bucket and insert into proposals table
  async uploadProposal(
    clientId: string,
    file: File,
    type: 'proposal' | 'contract' | 'brief' | 'report' = 'proposal',
    status: 'draft' | 'review' | 'signed' = 'draft'
  ): Promise<ProposalDocument> {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `${clientId}/${Date.now()}_${safeName}`

    // 1. Upload to Supabase Storage
    const { path, error: uploadErr } = await uploadToStorage('proposals', storagePath, file, {
      contentType: file.type || 'application/pdf'
    })

    if (uploadErr) {
      throw new Error(`Storage upload failed: ${uploadErr.message}`)
    }

    // Format human-readable file size
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1)
    const formattedSize = `${sizeInMb} MB`

    // 2. Insert into proposals table
    const { data, error: dbErr } = await supabase
      .from('proposals')
      .insert({
        client_id: clientId,
        name: file.name,
        file_path: path || storagePath,
        file_size: formattedSize,
        type,
        status
      })
      .select('*')
      .single()

    if (dbErr) {
      console.error('[clientService.uploadProposal] Database insert error:', dbErr)
      throw new Error(`Failed to save proposal record: ${dbErr.message}`)
    }

    // 3. Obtain signed or public URL for immediate view
    const url = await getStorageFileUrl('proposals', data.file_path)

    return {
      id: data.id,
      name: data.name,
      fileSize: data.file_size || formattedSize,
      uploadedAt: data.uploaded_at,
      url,
      filePath: data.file_path,
      type: (data.type as ProposalDocument['type']) || type,
      status: (data.status as ProposalDocument['status']) || status
    }
  },

  // Delete a proposal document
  async deleteProposal(id: string, filePath?: string): Promise<void> {
    if (filePath) {
      await deleteFromStorage('proposals', [filePath])
    }
    const { error } = await supabase.from('proposals').delete().eq('id', id)
    if (error) {
      throw new Error(`Failed to delete proposal: ${error.message}`)
    }
  },

  // Retrieve signed URL for proposal file
  async getProposalSignedUrl(filePath: string): Promise<string> {
    return getStorageFileUrl('proposals', filePath)
  },

  // Backward compatibility alias for uploadProposalDoc
  async uploadProposalDoc(
    clientId: string,
    doc: { name: string; fileSize?: string; url?: string; type?: ProposalDocument['type']; status?: ProposalDocument['status']; file?: File }
  ): Promise<ProposalDocument> {
    if (doc.file) {
      return this.uploadProposal(clientId, doc.file, doc.type || 'proposal', doc.status || 'draft')
    }
    const safeName = doc.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `${clientId}/${Date.now()}_${safeName}`
    const { data, error } = await supabase
      .from('proposals')
      .insert({
        client_id: clientId,
        name: doc.name,
        file_path: storagePath,
        file_size: doc.fileSize || '1.0 MB',
        type: doc.type || 'proposal',
        status: doc.status || 'draft'
      })
      .select('*')
      .single()

    if (error) throw new Error(error.message)
    const url = await getStorageFileUrl('proposals', data.file_path)
    return {
      id: data.id,
      name: data.name,
      fileSize: data.file_size || '1.0 MB',
      uploadedAt: data.uploaded_at,
      url,
      filePath: data.file_path,
      type: (data.type as ProposalDocument['type']) || 'proposal',
      status: (data.status as ProposalDocument['status']) || 'draft'
    }
  },

  // Backward compatibility alias for deleteProposalDoc
  async deleteProposalDoc(clientId: string, docId: string): Promise<void> {
    return this.deleteProposal(docId)
  }
}
