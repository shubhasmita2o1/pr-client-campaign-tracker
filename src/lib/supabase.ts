import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByLWNsaWVudC1jYW1wYWlnbi10cmFja2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.placeholder'

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Please configure your environment variables in .env (see .env.example).'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'pr_tracker_supabase_auth'
  }
})

// Storage Bucket Constants
export const STORAGE_BUCKETS = {
  PROPOSALS: 'proposals',
  CAMPAIGN_SCREENSHOTS: 'campaign-screenshots',
  IMPORTS: 'imports'
} as const

// Storage Helper: Upload a file to a specified bucket
export async function uploadToStorage(
  bucket: 'proposals' | 'campaign-screenshots' | 'imports',
  path: string,
  file: File | Blob,
  options?: { upsert?: boolean; contentType?: string }
): Promise<{ path: string; error: Error | null }> {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: options?.upsert ?? true,
      contentType: options?.contentType ?? (file instanceof File ? file.type : undefined)
    })

    if (error) {
      console.error(`[Storage Upload Error - ${bucket}]:`, error)
      return { path: '', error: new Error(error.message) }
    }

    return { path: data.path, error: null }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return { path: '', error }
  }
}

// Storage Helper: Get public or signed URL for a file
export async function getStorageFileUrl(
  bucket: 'proposals' | 'campaign-screenshots' | 'imports',
  path: string,
  expiresInSeconds = 3600
): Promise<string> {
  if (!path) return ''
  
  // Try to create a signed URL since buckets are private in migrations
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds)

    if (!error && data?.signedUrl) {
      return data.signedUrl
    }
  } catch (e) {
    console.warn(`[Storage SignedUrl Warning - ${bucket}]:`, e)
  }

  // Fallback to public URL format if signed URL fails or for display
  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path)
  return publicData.publicUrl
}

// Storage Helper: Delete file from bucket
export async function deleteFromStorage(
  bucket: 'proposals' | 'campaign-screenshots' | 'imports',
  paths: string[]
): Promise<{ error: Error | null }> {
  const { error } = await supabase.storage.from(bucket).remove(paths)
  if (error) {
    return { error: new Error(error.message) }
  }
  return { error: null }
}

// Edge Function Invocation Helper
export async function callEdgeFunction<T = unknown>(
  functionName: string,
  body: Record<string, unknown>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.functions.invoke<T>(functionName, {
      body
    })

    if (error) {
      console.error(`[Edge Function Error - ${functionName}]:`, error)
      return { data: null, error: new Error(error.message) }
    }

    return { data, error: null }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return { data: null, error }
  }
}
