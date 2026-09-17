import React from 'react'
import { Badge } from '@/components/ui/badge'
import { ClientStatus } from '@/types/client'
import { TranscriptStatus } from '@/types/meeting'
import { CampaignStatus } from '@/types/campaign'

interface ClientStatusBadgeProps {
  status: ClientStatus
}

export const ClientStatusBadge: React.FC<ClientStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'active':
      return (
        <Badge variant="success" className="capitalize">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
          Active
        </Badge>
      )
    case 'prospect':
      return (
        <Badge variant="warning" className="capitalize">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
          Prospect
        </Badge>
      )
    case 'churned':
      return (
        <Badge variant="secondary" className="capitalize text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mr-1.5" />
          Churned
        </Badge>
      )
  }
}

interface TranscriptStatusBadgeProps {
  status: TranscriptStatus
}

export const TranscriptStatusBadge: React.FC<TranscriptStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'has_transcript':
      return (
        <Badge variant="purple" className="text-[11px] font-normal">
          Transcript Ready
        </Badge>
      )
    case 'pending':
      return (
        <Badge variant="warning" className="text-[11px] font-normal">
          Processing
        </Badge>
      )
    case 'none':
      return (
        <Badge variant="secondary" className="text-[11px] font-normal opacity-70">
          No Transcript
        </Badge>
      )
  }
}

interface CampaignStatusBadgeProps {
  status: CampaignStatus
}

export const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'active':
      return (
        <Badge variant="success" className="capitalize">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          Live Outreach
        </Badge>
      )
    case 'draft':
      return (
        <Badge variant="info" className="capitalize">
          Drafting Pitch
        </Badge>
      )
    case 'completed':
      return (
        <Badge variant="secondary" className="capitalize">
          Completed
        </Badge>
      )
    case 'paused':
      return (
        <Badge variant="warning" className="capitalize">
          Paused
        </Badge>
      )
  }
}
