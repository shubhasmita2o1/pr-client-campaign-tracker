export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          avatar_url: string | null
          role: 'admin' | 'member'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'member'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'member'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          name: string
          company: string
          logo: string | null
          status: 'active' | 'prospect' | 'churned'
          industry: string | null
          tier: 'Enterprise' | 'Growth' | 'Boutique' | null
          owner_id: string | null
          primary_contact_name: string | null
          primary_contact_email: string | null
          primary_contact_phone: string | null
          primary_contact_title: string | null
          retainer_monthly: number
          joined_date: string | null
          website: string | null
          tags: string[]
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          company: string
          logo?: string | null
          status?: 'active' | 'prospect' | 'churned'
          industry?: string | null
          tier?: 'Enterprise' | 'Growth' | 'Boutique' | null
          owner_id?: string | null
          primary_contact_name?: string | null
          primary_contact_email?: string | null
          primary_contact_phone?: string | null
          primary_contact_title?: string | null
          retainer_monthly?: number
          joined_date?: string | null
          website?: string | null
          tags?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          company?: string
          logo?: string | null
          status?: 'active' | 'prospect' | 'churned'
          industry?: string | null
          tier?: 'Enterprise' | 'Growth' | 'Boutique' | null
          owner_id?: string | null
          primary_contact_name?: string | null
          primary_contact_email?: string | null
          primary_contact_phone?: string | null
          primary_contact_title?: string | null
          retainer_monthly?: number
          joined_date?: string | null
          website?: string | null
          tags?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          id: string
          client_id: string
          name: string
          file_path: string
          file_size: string | null
          type: 'proposal' | 'contract' | 'brief' | 'report' | null
          status: 'signed' | 'review' | 'draft' | null
          uploaded_by: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          file_path: string
          file_size?: string | null
          type?: 'proposal' | 'contract' | 'brief' | 'report' | null
          status?: 'signed' | 'review' | 'draft' | null
          uploaded_by?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          file_path?: string
          file_size?: string | null
          type?: 'proposal' | 'contract' | 'brief' | 'report' | null
          status?: 'signed' | 'review' | 'draft' | null
          uploaded_by?: string | null
          uploaded_at?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          id: string
          client_id: string
          title: string
          scheduled_at: string
          duration_minutes: number
          type: string | null
          location: string | null
          agenda: string[] | null
          notes: string | null
          transcript_status: 'has_transcript' | 'pending' | 'none'
          calendly_event_id: string | null
          gcal_event_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          scheduled_at: string
          duration_minutes?: number
          type?: string | null
          location?: string | null
          agenda?: string[] | null
          notes?: string | null
          transcript_status?: 'has_transcript' | 'pending' | 'none'
          calendly_event_id?: string | null
          gcal_event_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          scheduled_at?: string
          duration_minutes?: number
          type?: string | null
          location?: string | null
          agenda?: string[] | null
          notes?: string | null
          transcript_status?: 'has_transcript' | 'pending' | 'none'
          calendly_event_id?: string | null
          gcal_event_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      meeting_attendees: {
        Row: {
          id: string
          meeting_id: string
          name: string
          email: string | null
          avatar_url: string | null
          role: string | null
          is_client: boolean
        }
        Insert: {
          id?: string
          meeting_id: string
          name: string
          email?: string | null
          avatar_url?: string | null
          role?: string | null
          is_client?: boolean
        }
        Update: {
          id?: string
          meeting_id?: string
          name?: string
          email?: string | null
          avatar_url?: string | null
          role?: string | null
          is_client?: boolean
        }
        Relationships: []
      }
      transcripts: {
        Row: {
          id: string
          meeting_id: string | null
          client_id: string
          title: string
          date: string
          total_duration: string | null
          participants: string[]
          key_takeaways: string[]
          source: 'read_ai' | 'manual'
          external_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meeting_id?: string | null
          client_id: string
          title: string
          date: string
          total_duration?: string | null
          participants?: string[]
          key_takeaways?: string[]
          source?: 'read_ai' | 'manual'
          external_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string | null
          client_id?: string
          title?: string
          date?: string
          total_duration?: string | null
          participants?: string[]
          key_takeaways?: string[]
          source?: 'read_ai' | 'manual'
          external_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      transcript_parts: {
        Row: {
          id: string
          transcript_id: string
          part_number: number
          title: string | null
          duration: string | null
          created_at: string
        }
        Insert: {
          id?: string
          transcript_id: string
          part_number: number
          title?: string | null
          duration?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          transcript_id?: string
          part_number?: number
          title?: string | null
          duration?: string | null
          created_at?: string
        }
        Relationships: []
      }
      transcript_segments: {
        Row: {
          id: string
          part_id: string
          speaker: string
          speaker_avatar: string | null
          speaker_role: string | null
          is_client: boolean
          timestamp: string | null
          text: string
          sentiment: 'positive' | 'neutral' | 'urgent' | null
        }
        Insert: {
          id?: string
          part_id: string
          speaker: string
          speaker_avatar?: string | null
          speaker_role?: string | null
          is_client?: boolean
          timestamp?: string | null
          text: string
          sentiment?: 'positive' | 'neutral' | 'urgent' | null
        }
        Update: {
          id?: string
          part_id?: string
          speaker?: string
          speaker_avatar?: string | null
          speaker_role?: string | null
          is_client?: boolean
          timestamp?: string | null
          text?: string
          sentiment?: 'positive' | 'neutral' | 'urgent' | null
        }
        Relationships: []
      }
      transcript_action_items: {
        Row: {
          id: string
          transcript_id: string
          task: string
          assignee: string | null
          completed: boolean
        }
        Insert: {
          id?: string
          transcript_id: string
          task: string
          assignee?: string | null
          completed?: boolean
        }
        Update: {
          id?: string
          transcript_id?: string
          task?: string
          assignee?: string | null
          completed?: boolean
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          id: string
          title: string
          client_id: string | null
          status: 'draft' | 'active' | 'completed' | 'paused'
          type: string | null
          start_date: string | null
          end_date: string | null
          owner_id: string | null
          target_outlets: string[]
          copy_text: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          client_id?: string | null
          status?: 'draft' | 'active' | 'completed' | 'paused'
          type?: string | null
          start_date?: string | null
          end_date?: string | null
          owner_id?: string | null
          target_outlets?: string[]
          copy_text?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          client_id?: string | null
          status?: 'draft' | 'active' | 'completed' | 'paused'
          type?: string | null
          start_date?: string | null
          end_date?: string | null
          owner_id?: string | null
          target_outlets?: string[]
          copy_text?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaign_metrics: {
        Row: {
          id: string
          campaign_id: string
          channel: string | null
          pitched: number
          impressions: number
          opens: number
          clicks: number
          replies: number
          coverage_secured: number
          response_rate: number
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          channel?: string | null
          pitched?: number
          impressions?: number
          opens?: number
          clicks?: number
          replies?: number
          coverage_secured?: number
          response_rate?: number
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          channel?: string | null
          pitched?: number
          impressions?: number
          opens?: number
          clicks?: number
          replies?: number
          coverage_secured?: number
          response_rate?: number
          created_at?: string
        }
        Relationships: []
      }
      campaign_screenshots: {
        Row: {
          id: string
          campaign_id: string
          file_name: string
          file_path: string
          thumbnail_url: string | null
          file_size: string | null
          extracted_metrics: Json | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          file_name: string
          file_path: string
          thumbnail_url?: string | null
          file_size?: string | null
          extracted_metrics?: Json | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          file_name?: string
          file_path?: string
          thumbnail_url?: string | null
          file_size?: string | null
          extracted_metrics?: Json | null
          uploaded_at?: string
        }
        Relationships: []
      }
      integration_accounts: {
        Row: {
          id: string
          provider: 'read_ai' | 'calendly' | 'google_calendar' | 'other'
          account_name: string | null
          external_account_id: string | null
          access_token: string | null
          refresh_token: string | null
          token_expires_at: string | null
          scopes: string[]
          is_active: boolean
          metadata: Json
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider: 'read_ai' | 'calendly' | 'google_calendar' | 'other'
          account_name?: string | null
          external_account_id?: string | null
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          scopes?: string[]
          is_active?: boolean
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider?: 'read_ai' | 'calendly' | 'google_calendar' | 'other'
          account_name?: string | null
          external_account_id?: string | null
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          scopes?: string[]
          is_active?: boolean
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          id: string
          source: 'read_ai' | 'calendly' | 'google_calendar' | 'manual' | 'other'
          external_event_id: string
          event_type: string | null
          payload: Json
          status: 'received' | 'processing' | 'processed' | 'failed' | 'ignored'
          error_message: string | null
          related_meeting_id: string | null
          related_transcript_id: string | null
          related_client_id: string | null
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source: 'read_ai' | 'calendly' | 'google_calendar' | 'manual' | 'other'
          external_event_id: string
          event_type?: string | null
          payload?: Json
          status?: 'received' | 'processing' | 'processed' | 'failed' | 'ignored'
          error_message?: string | null
          related_meeting_id?: string | null
          related_transcript_id?: string | null
          related_client_id?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          source?: 'read_ai' | 'calendly' | 'google_calendar' | 'manual' | 'other'
          external_event_id?: string
          event_type?: string | null
          payload?: Json
          status?: 'received' | 'processing' | 'processed' | 'failed' | 'ignored'
          error_message?: string | null
          related_meeting_id?: string | null
          related_transcript_id?: string | null
          related_client_id?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      sync_state: {
        Row: {
          id: string
          provider: 'read_ai' | 'calendly' | 'google_calendar' | 'other'
          integration_account_id: string | null
          resource: string
          cursor: string | null
          last_synced_at: string | null
          last_success_at: string | null
          last_error: string | null
          metadata: Json
          updated_at: string
        }
        Insert: {
          id?: string
          provider: 'read_ai' | 'calendly' | 'google_calendar' | 'other'
          integration_account_id?: string | null
          resource: string
          cursor?: string | null
          last_synced_at?: string | null
          last_success_at?: string | null
          last_error?: string | null
          metadata?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          provider?: 'read_ai' | 'calendly' | 'google_calendar' | 'other'
          integration_account_id?: string | null
          resource?: string
          cursor?: string | null
          last_synced_at?: string | null
          last_success_at?: string | null
          last_error?: string | null
          metadata?: Json
          updated_at?: string
        }
        Relationships: []
      }
      import_batches: {
        Row: {
          id: string
          source: 'xlsx' | 'csv' | 'manual' | 'other'
          file_name: string | null
          file_path: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'partial'
          total_rows: number
          success_rows: number
          error_rows: number
          error_log: Json | null
          started_at: string | null
          completed_at: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source?: 'xlsx' | 'csv' | 'manual' | 'other'
          file_name?: string | null
          file_path?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'partial'
          total_rows?: number
          success_rows?: number
          error_rows?: number
          error_log?: Json | null
          started_at?: string | null
          completed_at?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          source?: 'xlsx' | 'csv' | 'manual' | 'other'
          file_name?: string | null
          file_path?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'partial'
          total_rows?: number
          success_rows?: number
          error_rows?: number
          error_log?: Json | null
          started_at?: string | null
          completed_at?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']> = unknown
export type InsertDto<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type UpdateDto<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
