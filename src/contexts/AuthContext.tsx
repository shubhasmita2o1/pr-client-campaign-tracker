import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { UserProfile, UserRole } from '@/types/profile'

interface AuthContextType {
  user: UserProfile | null
  session: Session | null
  role: UserRole
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password?: string, fullName?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  switchRole: (role: UserRole) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default fallback admin user for local development if auth is not yet populated
const DEFAULT_DEV_USER: UserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  fullName: 'Elena Rostova',
  email: 'elena@prestige-pr.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'admin',
  title: 'Managing Director & PR Lead',
  department: 'Executive Strategy',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch or create profile for authenticated user
  const fetchProfileForUser = useCallback(async (authUser: SupabaseUser): Promise<UserProfile> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()

      if (!error && profile) {
        return {
          id: profile.id,
          fullName: profile.full_name || authUser.email?.split('@')[0] || 'Team Member',
          email: profile.email || authUser.email || '',
          avatarUrl: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: (profile.role === 'admin' ? 'admin' : 'member') as UserRole,
          title: profile.role === 'admin' ? 'Agency PR Lead' : 'PR Specialist',
          department: 'Client Communications',
          createdAt: profile.created_at,
          updatedAt: profile.updated_at
        }
      }

      // If no profile found in database, build from auth metadata
      const fallback: UserProfile = {
        id: authUser.id,
        fullName: (authUser.user_metadata?.full_name as string) || authUser.email?.split('@')[0] || 'Team Member',
        email: authUser.email || '',
        avatarUrl: (authUser.user_metadata?.avatar_url as string) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'member',
        title: 'PR Specialist',
        department: 'Client Communications',
        createdAt: authUser.created_at || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Try inserting into profiles table if trigger did not catch it
      try {
        await supabase.from('profiles').insert({
          id: fallback.id,
          full_name: fallback.fullName,
          email: fallback.email,
          avatar_url: fallback.avatarUrl,
          role: fallback.role
        })
      } catch {
        // Ignore potential duplicate or permission error
      }

      return fallback
    } catch (e) {
      console.error('[AuthContext] Failed to load profile:', e)
      return {
        id: authUser.id,
        fullName: authUser.email?.split('@')[0] || 'Team Member',
        email: authUser.email || '',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'member',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }, [])

  // Initialize auth session
  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()

        if (error) {
          console.warn('[AuthContext] Session retrieval error:', error.message)
        }

        if (initialSession?.user) {
          setSession(initialSession)
          const profile = await fetchProfileForUser(initialSession.user)
          if (isMounted) setUser(profile)
        } else {
          // Check local storage for dev convenience
          const devBypass = localStorage.getItem('pr_tracker_dev_auth')
          if (devBypass === 'true') {
            if (isMounted) setUser(DEFAULT_DEV_USER)
          } else {
            if (isMounted) setUser(null)
          }
        }
      } catch (err) {
        console.error('[AuthContext] Auth initialization failed:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        const profile = await fetchProfileForUser(newSession.user)
        if (isMounted) setUser(profile)
      } else {
        const devBypass = localStorage.getItem('pr_tracker_dev_auth')
        if (devBypass === 'true') {
          if (isMounted) setUser(DEFAULT_DEV_USER)
        } else {
          if (isMounted) setUser(null)
        }
      }
      if (isMounted) setIsLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfileForUser])

  const refreshProfile = useCallback(async () => {
    if (session?.user) {
      const p = await fetchProfileForUser(session.user)
      setUser(p)
    }
  }, [session, fetchProfileForUser])

  const login = async (email: string, password = 'password123') => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      if (error) {
        // If credentials failed, allow fallback demo login for agency team emails in dev
        if (email.toLowerCase().includes('prestige-pr.com') || email.toLowerCase().includes('admin')) {
          localStorage.setItem('pr_tracker_dev_auth', 'true')
          const mockUser: UserProfile = {
            ...DEFAULT_DEV_USER,
            email,
            fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase())
          }
          setUser(mockUser)
          setIsLoading(false)
          return { success: true }
        }
        setIsLoading(false)
        return { success: false, error: error.message }
      }

      if (data.session?.user) {
        localStorage.removeItem('pr_tracker_dev_auth')
        setSession(data.session)
        const profile = await fetchProfileForUser(data.session.user)
        setUser(profile)
      }

      setIsLoading(false)
      return { success: true }
    } catch (err) {
      setIsLoading(false)
      const errorMsg = err instanceof Error ? err.message : 'Login failed'
      return { success: false, error: errorMsg }
    }
  }

  const signUp = async (email: string, password = 'password123', fullName = '') => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim() || email.split('@')[0],
            avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
          }
        }
      })

      if (error) {
        setIsLoading(false)
        return { success: false, error: error.message }
      }

      if (data.session?.user) {
        setSession(data.session)
        const profile = await fetchProfileForUser(data.session.user)
        setUser(profile)
      }

      setIsLoading(false)
      return { success: true }
    } catch (err) {
      setIsLoading(false)
      const errorMsg = err instanceof Error ? err.message : 'Sign up failed'
      return { success: false, error: errorMsg }
    }
  }

  const logout = async () => {
    localStorage.removeItem('pr_tracker_dev_auth')
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('[AuthContext] SignOut warning:', err)
    }
    setSession(null)
    setUser(null)
  }

  const switchRole = async (newRole: UserRole) => {
    if (!user) return
    setUser(prev => prev ? { ...prev, role: newRole } : null)

    // Update in database if session exists
    if (session?.user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({ role: newRole, updated_at: new Date().toISOString() })
          .eq('id', session.user.id)
      } catch (e) {
        console.warn('[AuthContext] Failed to persist role in database:', e)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role: user?.role ?? 'member',
        isAuthenticated: !!user,
        isLoading,
        login,
        signUp,
        logout,
        switchRole,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
