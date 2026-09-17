import { ActivityItem } from '../types/activity'

export const mockActivities: ActivityItem[] = [
  {
    id: 'act-feed-1',
    type: 'metrics_extracted',
    title: 'AI Metrics Extracted',
    description: 'Extracted 14 verified media placements from MuckRack screenshot for NovaAI Series C launch.',
    timestamp: '2026-09-17T09:45:00Z',
    userId: 'owner-2',
    userName: 'Marcus Vance',
    targetId: 'camp-1',
    targetType: 'campaign',
    badgeLabel: 'AI Vision'
  },
  {
    id: 'act-feed-2',
    type: 'transcript_uploaded',
    title: 'Call Transcript Processed',
    description: 'Uploaded 3-part call transcript for NovaAI Series C Embargo Strategy (52 mins).',
    timestamp: '2026-09-16T17:15:00Z',
    userId: 'owner-2',
    userName: 'Marcus Vance',
    targetId: 'tr-1',
    targetType: 'transcript',
    badgeLabel: 'Multi-Part'
  },
  {
    id: 'act-feed-3',
    type: 'meeting_scheduled',
    title: 'Meeting Scheduled',
    description: 'Scheduled CBS Sunday Morning Pre-Interview Briefing with Kenji Sato (Astra Robotics).',
    timestamp: '2026-09-16T14:20:00Z',
    userId: 'owner-2',
    userName: 'Marcus Vance',
    targetId: 'meet-19',
    targetType: 'meeting',
    badgeLabel: 'Media Prep'
  },
  {
    id: 'act-feed-4',
    type: 'status_changed',
    title: 'Client Status Updated',
    description: 'Updated Veritas Health Analytics status from Prospect to Active ($25k/mo retainer).',
    timestamp: '2026-09-15T11:30:00Z',
    userId: 'owner-1',
    userName: 'Elena Rostova',
    targetId: 'client-8',
    targetType: 'client',
    badgeLabel: 'Status'
  },
  {
    id: 'act-feed-5',
    type: 'proposal_signed',
    title: 'Proposal Signed',
    description: 'Dr. Sarah Lin countersigned NovaAI Q3/Q4 PR Master Strategy Agreement.',
    timestamp: '2026-09-14T16:00:00Z',
    userId: 'owner-1',
    userName: 'Elena Rostova',
    targetId: 'client-1',
    targetType: 'client',
    badgeLabel: '$24k/mo'
  },
  {
    id: 'act-feed-6',
    type: 'campaign_launched',
    title: 'Campaign Launched',
    description: 'Launched outbound press pitch for Helion Commercial Fusion Whitepaper to DC policy desks.',
    timestamp: '2026-09-12T10:00:00Z',
    userId: 'owner-1',
    userName: 'Elena Rostova',
    targetId: 'camp-2',
    targetType: 'campaign',
    badgeLabel: 'Outreach'
  },
  {
    id: 'act-feed-7',
    type: 'transcript_uploaded',
    title: 'Call Transcript Processed',
    description: 'Analyzed 2-part transcript for Helion Whitepaper Rollout with Chief Scientist Dr. Sterling.',
    timestamp: '2026-09-12T12:30:00Z',
    userId: 'owner-1',
    userName: 'Elena Rostova',
    targetId: 'tr-2',
    targetType: 'transcript',
    badgeLabel: 'Analysis'
  },
  {
    id: 'act-feed-8',
    type: 'client_added',
    title: 'New Client Prospect Added',
    description: 'QuantumScale Chips added to pipeline following inbound RFP defense request.',
    timestamp: '2026-09-01T09:00:00Z',
    userId: 'owner-2',
    userName: 'Marcus Vance',
    targetId: 'client-9',
    targetType: 'client',
    badgeLabel: 'Prospect'
  }
]
