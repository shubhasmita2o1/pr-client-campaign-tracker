import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { CmdKModal } from './CmdKModal'
import { ClientFormModal } from '@/components/clients/ClientFormModal'

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

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

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Cmd+K Search Modal */}
      <CmdKModal open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Quick New Client Modal */}
      <ClientFormModal open={newClientOpen} onOpenChange={setNewClientOpen} />
    </div>
  )
}
