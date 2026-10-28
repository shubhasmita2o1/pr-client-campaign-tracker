import React, { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { CmdKModal } from './CmdKModal'
import { ClientFormModal } from '@/components/clients/ClientFormModal'
import { useAuth } from '@/contexts/AuthContext'
import { Sparkles } from 'lucide-react'

export const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Show a clean loading screen while verifying Supabase session
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 animate-pulse">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Connecting to Supabase...
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans">
      {/* Desktop & Tablet Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onOpenSearch={() => setSearchOpen(true)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-64 h-full bg-sidebar animate-in slide-in-from-left duration-200"
            onClick={e => e.stopPropagation()}
          >
            <Sidebar
              collapsed={false}
              setCollapsed={() => setMobileSidebarOpen(false)}
              onOpenSearch={() => {
                setMobileSidebarOpen(false)
                setSearchOpen(true)
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header
          onOpenSearch={() => setSearchOpen(true)}
          onToggleSidebarMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenNewClient={() => setNewClientOpen(true)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette / Search Dialog */}
      <CmdKModal open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Quick Create Client Modal */}
      <ClientFormModal
        open={newClientOpen}
        onOpenChange={setNewClientOpen}
      />
    </div>
  )
}
