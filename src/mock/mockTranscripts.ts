import { Transcript } from '../types/transcript'
import { mockTranscripts as originalTranscripts } from '../data/mockTranscripts'

export const mockTranscripts: Transcript[] = originalTranscripts.map((t, idx) => ({
  ...t,
  source: (idx % 2 === 0 ? 'read_ai' : 'manual') as 'read_ai' | 'manual',
  externalId: idx % 2 === 0 ? `read_ai_rec_${80429 + idx * 311}` : undefined,
  meetingTitle: t.title
}))
