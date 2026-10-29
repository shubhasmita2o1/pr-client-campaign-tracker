import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Sparkles, BarChart3, Users, MessageSquareQuote, ShieldCheck } from 'lucide-react'

export const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground">
      {/* Left Branding / Value Hero Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F1412] text-white p-12 flex-col justify-between relative overflow-hidden border-r border-[#1C2622]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-subtle">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
              Prestige PR Operations
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-medium">CRM v2.4</span>
            </div>
            <p className="text-xs text-stone-400">Enterprise Agency Client, Briefings &amp; Retainer CRM</p>
          </div>
        </div>

        {/* Center Testimonial / Value proposition */}
        <div className="relative z-10 my-auto py-12 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            Executive Agency Infrastructure
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            The single source of truth for high-growth client retainers and media outreach.
          </h2>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-[#17201C] border border-[#23312B] backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                <BarChart3 className="h-4 w-4" />
                Gemini Vision OCR
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">Extract verified impressions and reply rates directly from campaign screenshots.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#17201C] border border-[#23312B] backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                <Users className="h-4 w-4" />
                Briefing Sync
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">Two-way synchronization with Cal.com, Google Calendar, and Read AI call transcripts.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#23312B] flex items-start gap-3">
            <MessageSquareQuote className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-400 italic leading-relaxed">
              &ldquo;We consolidated 4 disparate tools into this single dashboard. Our partners now review call transcripts and tier-1 media placements in under 60 seconds.&rdquo;
              <span className="block not-italic text-stone-200 font-semibold mt-1">— Elena Rostova, Senior PR Partner</span>
            </p>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 flex items-center justify-between text-xs text-stone-500 border-t border-[#23312B] pt-6">
          <span>Protected by Enterprise SSO &amp; Role-Based Access</span>
          <span>Cal.com &bull; Read AI &bull; Google Calendar</span>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
