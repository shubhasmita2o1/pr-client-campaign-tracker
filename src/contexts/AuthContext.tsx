import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserProfile, UserRole } from '../types/profile'
import { mockProfiles } from '../mock/mockProfiles'

interface AuthContextType {
  user: UserProfile | null
  role: UserRole
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  switchRole: (role: UserRole) => void
  switchUser: (userId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'pr_tracker_auth_user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Error loading stored auth user', e)
    }
    // Default to Elena (Admin)
    return mockProfiles[0]
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  const login = async (email: string, _password?: string) => {
    setIsLoading(true)
    await new Promise((res) => setTimeout(res, 500))

    const found = mockProfiles.find(
      (p) => p.email.toLowerCase() === email.trim().toLowerCase()
    )

    if (found) {
      setUser(found)
      setIsLoading(false)
      return { success: true }
    }

    // Allow any agency email fallback
    if (email.includes('@')) {
      const fallbackUser: UserProfile = {
        id: `usr-${Date.now()}`,
        fullName: email.split('@')[0].replace('.', ' '),
        email,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'member',
        title: 'PR Account Specialist',
        department: 'Agency Communications',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setUser(fallbackUser)
      setIsLoading(false)
      return { success: true }
    }

    setIsLoading(false)
    return { success: false, error: 'Invalid credentials. Please enter a valid email.' }
  }

  const logout = () => {
    setUser(null)
  }

  const switchRole = (newRole: UserRole) => {
    if (!user) return
    setUser({ ...user, role: newRole })
  }

  const switchUser = (userId: string) => {
    const target = mockProfiles.find((p) => p.id === userId)
    if (target) {
      setUser(target)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? 'member',
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
        switchUser
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
