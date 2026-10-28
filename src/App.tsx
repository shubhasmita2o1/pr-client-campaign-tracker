import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

// Pages
import { LoginPage } from '@/features/auth/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ClientsPage } from '@/pages/ClientsPage'
import { ClientDetailPage } from '@/pages/ClientDetailPage'
import { MeetingsPage } from '@/pages/MeetingsPage'
import { TranscriptsPage } from '@/features/transcripts/TranscriptsPage'
import { TranscriptDetailPage } from '@/features/transcripts/TranscriptDetailPage'
import { CampaignsPage } from '@/pages/CampaignsPage'
import { CampaignDetailPage } from '@/pages/CampaignDetailPage'
import { ImportsPage } from '@/features/imports/ImportsPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { SearchPage } from '@/pages/SearchPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
})

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="pr-tracker-theme">
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Auth Flow */}
                <Route path="/login" element={<AuthLayout />}>
                  <Route index element={<LoginPage />} />
                </Route>

                {/* Protected App Layout */}
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="clients" element={<ClientsPage />} />
                  <Route path="clients/:id" element={<ClientDetailPage />} />
                  <Route path="meetings" element={<MeetingsPage />} />
                  <Route path="transcripts" element={<TranscriptsPage />} />
                  <Route path="transcripts/:id" element={<TranscriptDetailPage />} />
                  <Route path="campaigns" element={<CampaignsPage />} />
                  <Route path="campaigns/:id" element={<CampaignDetailPage />} />
                  <Route path="imports" element={<ImportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
