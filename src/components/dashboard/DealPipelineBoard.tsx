import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Client } from '@/types/client'
import { formatCurrency } from '@/lib/utils'
import {
  Kanban,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Building2,
  CheckCircle2,
  ExternalLink,
  Flame,
  Plus
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export type PipelineStageId = 'inbound' | 'pitching' | 'negotiation' | 'secured'

export interface DealItem {
  id: string
  clientName: string
  company: string
  stage: PipelineStageId
  priority: 'urgent' | 'high' | 'normal' | 'returning'
  retainerMonthly: number
  tier: 'Enterprise' | 'Growth' | 'Boutique'
  ownerName: string
  ownerAvatar: string
  daysInStage: number
  targetPublication: string
  notes?: string
}

const INITIAL_DEALS: DealItem[] = [
  {
    id: 'deal-1',
    clientName: 'NovaAI Systems',
    company: 'NovaAI Inc.',
    stage: 'negotiation',
    priority: 'urgent',
    retainerMonthly: 25000,
    tier: 'Enterprise',
    ownerName: 'Elena Rostova',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    daysInStage: 2,
    targetPublication: 'Bloomberg Tech Exclusive',
    notes: 'Embargoed preview draft shared with Bloomberg bureau chief.'
  },
  {
    id: 'deal-2',
    clientName: 'Helion Energy',
    company: 'Helion Fusion Corp',
    stage: 'pitching',
    priority: 'high',
    retainerMonthly: 20000,
    tier: 'Enterprise',
    ownerName: 'Marcus Vance',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    daysInStage: 4,
    targetPublication: 'WSJ Clean Energy & Wired',
    notes: 'Outreach to 18 tier-1 energy correspondents.'
  },
  {
    id: 'deal-3',
    clientName: 'CyberShield Quantum',
    company: 'CyberShield Security Ltd',
    stage: 'secured',
    priority: 'normal',
    retainerMonthly: 18500,
    tier: 'Enterprise',
    ownerName: 'Elena Rostova',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    daysInStage: 1,
    targetPublication: 'Forbes & Reuters Feature',
    notes: 'Dual feature published. Retainer locked for Q4 renewal.'
  },
  {
    id: 'deal-4',
    clientName: 'Astra Robotics',
    company: 'Astra Dynamics Inc',
    stage: 'inbound',
    priority: 'urgent',
    retainerMonthly: 22000,
    tier: 'Enterprise',
    ownerName: 'Sophia Lin',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    daysInStage: 1,
    targetPublication: 'TechCrunch Series B Exclusive',
    notes: 'Inbound referral from Founders Fund partner.'
  },
  {
    id: 'deal-5',
    clientName: 'Lumina Biotech',
    company: 'Lumina Diagnostics AG',
    stage: 'negotiation',
    priority: 'returning',
    retainerMonthly: 16000,
    tier: 'Growth',
    ownerName: 'Marcus Vance',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    daysInStage: 3,
    targetPublication: 'Nature Biotech & FT Health',
    notes: 'Reviewing embargoed clinical results briefing.'
  },
  {
    id: 'deal-6',
    clientName: 'Aetheria Luxury Tech',
    company: 'Aetheria Maison SAS',
    stage: 'pitching',
    priority: 'high',
    retainerMonthly: 19000,
    tier: 'Growth',
    ownerName: 'Sophia Lin',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    daysInStage: 5,
    targetPublication: 'Vogue Business & CNBC',
    notes: 'Pitching Milan Fashion Week technology debut.'
  },
  {
    id: 'deal-7',
    clientName: 'Krona FinTech',
    company: 'Krona Financial Inc',
    stage: 'secured',
    priority: 'returning',
    retainerMonthly: 15000,
    tier: 'Growth',
    ownerName: 'Elena Rostova',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    daysInStage: 6,
    targetPublication: 'American Banker & Yahoo Finance',
    notes: 'Q3 Earnings PR live. Syndicated across 14 networks.'
  },
  {
    id: 'deal-8',
    clientName: 'BioVanguard Genomics',
    company: 'BioVanguard Therapeutics',
    stage: 'inbound',
    priority: 'normal',
    retainerMonthly: 17500,
    tier: 'Growth',
    ownerName: 'Marcus Vance',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    daysInStage: 2,
    targetPublication: 'Stat News & BioPharma Dive',
    notes: 'Initial PR strategy consultation requested.'
  }
]

interface StageConfig {
  id: PipelineStageId
  title: string
  subtitle: string
  accentColor: string
  badgeVariant: 'sage' | 'sand' | 'info' | 'purple'
}

const STAGES: StageConfig[] = [
  {
    id: 'inbound',
    title: 'Inbound & Discovery',
    subtitle: 'New briefs & lead qualification',
    accentColor: 'border-amber-500/30 bg-amber-500/5',
    badgeVariant: 'sand'
  },
  {
    id: 'pitching',
    title: 'Pitching & Outbound',
    subtitle: 'Active reporter outreach',
    accentColor: 'border-sky-500/30 bg-sky-500/5',
    badgeVariant: 'info'
  },
  {
    id: 'negotiation',
    title: 'Interview & Negotiation',
    subtitle: 'Embargoes & scheduled syncs',
    accentColor: 'border-purple-500/30 bg-purple-500/5',
    badgeVariant: 'purple'
  },
  {
    id: 'secured',
    title: 'Secured & Live Coverage',
    subtitle: 'Published hits & retainers',
    accentColor: 'border-emerald-500/30 bg-emerald-500/5',
    badgeVariant: 'sage'
  }
]

export const DealPipelineBoard: React.FC = () => {
  const navigate = useNavigate()
  const [deals, setDeals] = useState<DealItem[]>(INITIAL_DEALS)
  const [filterPriority, setFilterPriority] = useState<string>('all')

  const moveDealStage = (dealId: string, nextStage: PipelineStageId) => {
    setDeals(prev =>
      prev.map(d => (d.id === dealId ? { ...d, stage: nextStage, daysInStage: 0 } : d))
    )
    toast.success('Deal stage updated successfully')
  }

  const filteredDeals = filterPriority === 'all'
    ? deals
    : deals.filter(d => d.priority === filterPriority)

  const getPriorityBadge = (p: DealItem['priority']) => {
    switch (p) {
      case 'urgent':
        return (
          <Badge variant="destructive" className="text-[10px] py-0 px-2 font-semibold">
            <Flame className="h-3 w-3 mr-1" />
            Urgent
          </Badge>
        )
      case 'high':
        return (
          <Badge variant="sand" className="text-[10px] py-0 px-2 font-semibold">
            High Priority
          </Badge>
        )
      case 'returning':
        return (
          <Badge variant="purple" className="text-[10px] py-0 px-2 font-semibold">
            Returning
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-[10px] py-0 px-2 font-normal">
            Standard
          </Badge>
        )
    }
  }

  return (
    <Card className="border-border/80 shadow-subtle overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/60 bg-card/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Kanban className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold text-foreground">
              Deal Pipeline &amp; Inbound Media Queue
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time stage-organized CRM deal board tracking active agency outreach and retainer expansions
          </p>
        </div>

        {/* Priority Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/60 border border-border/70 self-start sm:self-auto">
          {['all', 'urgent', 'high', 'returning'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize cursor-pointer ${
                filterPriority === p
                  ? 'bg-card text-foreground font-semibold shadow-2xs border border-border/60'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p === 'all' ? 'All Deals' : p}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4">
        {/* Kanban 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAGES.map((stage, stageIdx) => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage.id)
            const stageTotalValue = stageDeals.reduce((sum, d) => sum + d.retainerMonthly, 0)
            const nextStage = STAGES[stageIdx + 1]?.id

            return (
              <div
                key={stage.id}
                className="flex flex-col rounded-2xl border border-border/70 bg-secondary/30 p-3"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">
                      {stage.title}
                    </span>
                    <Badge variant={stage.badgeVariant} className="text-[10px] h-4.5 px-1.5 font-semibold">
                      {stageDeals.length}
                    </Badge>
                  </div>
                  <span className="text-[11px] font-bold text-primary tabular-nums">
                    {formatCurrency(stageTotalValue)}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground mb-3 px-0.5">
                  {stage.subtitle}
                </span>

                {/* Stage Deals Cards */}
                <div className="space-y-3 flex-1 min-h-[220px]">
                  {stageDeals.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border border-dashed border-border/70 rounded-xl text-center p-3 text-[11px] text-muted-foreground">
                      No deals currently in this stage
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="group relative rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs hover:shadow-subtle hover:border-primary/40 transition-all duration-200 space-y-2.5"
                      >
                        {/* Card Header: Priority Pill & Days in stage */}
                        <div className="flex items-center justify-between gap-1">
                          {getPriorityBadge(deal.priority)}
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                            <Clock className="h-3 w-3" />
                            {deal.daysInStage === 0 ? 'Today' : `${deal.daysInStage}d in stage`}
                          </span>
                        </div>

                        {/* Client / Deal Details */}
                        <div>
                          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                            <span className="truncate">{deal.clientName}</span>
                            <span className="text-xs font-extrabold text-foreground tabular-nums">
                              {formatCurrency(deal.retainerMonthly)}
                              <span className="text-[10px] text-muted-foreground font-normal">/mo</span>
                            </span>
                          </h4>
                          <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3 shrink-0" />
                            {deal.targetPublication}
                          </p>
                        </div>

                        {deal.notes && (
                          <p className="text-[10px] text-muted-foreground/90 bg-secondary/50 rounded-lg p-2 leading-relaxed border border-border/40 line-clamp-2">
                            {deal.notes}
                          </p>
                        )}

                        {/* Card Footer: PR Lead Owner & Advance Stage Trigger */}
                        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5" title={`PR Lead: ${deal.ownerName}`}>
                            <Avatar className="h-5.5 w-5.5 ring-1 ring-border">
                              <AvatarImage src={deal.ownerAvatar} />
                              <AvatarFallback className="text-[9px]">{deal.ownerName.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-[11px] text-muted-foreground truncate max-w-[80px]">
                              {deal.ownerName.split(' ')[0]}
                            </span>
                          </div>

                          {nextStage && (
                            <button
                              onClick={() => moveDealStage(deal.id, nextStage)}
                              className="text-[11px] font-medium text-primary hover:text-primary/80 flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-primary/10 transition-colors cursor-pointer"
                              title={`Advance to ${STAGES[stageIdx + 1]?.title}`}
                            >
                              <span>Advance</span>
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          )}
                          {!nextStage && (
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
