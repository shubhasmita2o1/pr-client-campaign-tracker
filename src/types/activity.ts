export type ActivityType = 
  | 'client_added' 
  | 'status_changed' 
  | 'meeting_scheduled' 
  | 'transcript_uploaded' 
  | 'campaign_launched' 
  | 'metrics_extracted' 
  | 'proposal_signed'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string // ISO string
  userId: string
  userName: string
  userAvatar?: string
  targetId?: string
  targetType?: 'client' | 'meeting' | 'transcript' | 'campaign'
  badgeLabel?: string
}
