import { Meeting } from '../types/meeting'
import { mockMeetings as originalMeetings } from '../data/mockMeetings'

export const mockMeetings: Meeting[] = originalMeetings.map((m, idx) => ({
  ...m,
  calComBookingUid: idx % 3 === 0 ? `cal_booking_99482${idx}` : undefined,
  gcalEventId: idx % 2 === 0 ? `gcal_evt_77103${idx}` : undefined
}))
