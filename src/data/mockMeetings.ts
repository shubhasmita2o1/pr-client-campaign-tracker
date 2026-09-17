import { Meeting } from '../types/meeting'

export const mockMeetings: Meeting[] = [
  {
    id: 'meet-1',
    clientId: 'client-1',
    clientName: 'NovaAI Systems',
    title: 'Series C Embargo Strategy & Tier-1 Media Exclusive Planning',
    date: '2026-09-15T14:00:00Z',
    durationMinutes: 50,
    type: 'Strategy & Launch',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-1',
    location: 'Google Meet',
    attendees: [
      { id: 'att-1', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-2', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-3', name: 'Dr. Sarah Lin', email: 'slin@novaai.tech', role: 'CMO', isClient: true },
      { id: 'att-4', name: 'Alex Rivera', email: 'arivera@novaai.tech', role: 'Comms Lead', isClient: true }
    ],
    notes: 'Agreed on Bloomberg exclusive offer with 24-hr window. Rehearsal scheduled for CEO next week.',
    agenda: ['Exclusive vs wire decision', 'Sensitive GPU burn questions', 'Media kit asset distribution']
  },
  {
    id: 'meet-2',
    clientId: 'client-2',
    clientName: 'Helion Energy Grid',
    title: 'Clean Energy Fusion Whitepaper Rollout & Policy Desk Pitching',
    date: '2026-09-12T11:00:00Z',
    durationMinutes: 45,
    type: 'Strategy & Launch',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-2',
    location: 'Zoom',
    attendees: [
      { id: 'att-5', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-6', name: 'Julian Montgomery', email: 'j.montgomery@heliongrid.io', role: 'VP Comms', isClient: true },
      { id: 'att-7', name: 'Dr. Arthur Sterling', email: 'sterling@heliongrid.io', role: 'Chief Scientist', isClient: true }
    ],
    notes: 'Hay-Adams DC media breakfast approved. Axios Generate and Politico Pro embargo pitches out.',
    agenda: ['Translating fusion physics to grid reliability', 'DC breakfast invite list', 'FT US energy reporter hook']
  },
  {
    id: 'meet-3',
    clientId: 'client-3',
    clientName: 'Nimbus BioHealth',
    title: 'FDA Phase II Clinical Trial Results & Embargo Protocol',
    date: '2026-09-08T15:30:00Z',
    durationMinutes: 40,
    type: 'Crisis Advisory',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-3',
    location: 'Google Meet',
    attendees: [
      { id: 'att-8', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-9', name: 'Claire Beauchamp', email: 'claire@nimbusbio.com', role: 'Comms Director', isClient: true },
      { id: 'att-10', name: 'Dr. Alan Ross', email: 'aross@nimbusbio.com', role: 'CMO', isClient: true }
    ],
    notes: 'Coordination between 8-K SEC release and 7:00 AM ET wire blast. CNBC Squawk Box confirmed.',
    agenda: ['SEC compliance and statistical phrasing', 'CNBC satellite truck setup', 'Stat News embargo review']
  },
  {
    id: 'meet-4',
    clientId: 'client-4',
    clientName: 'CyberShield Zero',
    title: 'Q3 Ransomware Threat Intelligence Report Media Launch',
    date: '2026-09-04T10:00:00Z',
    durationMinutes: 40,
    type: 'Strategy & Launch',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-4',
    location: 'Zoom',
    attendees: [
      { id: 'att-11', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-12', name: 'Alex Vance', email: 'alex@cybershieldzero.com', role: 'Brand Lead', isClient: true },
      { id: 'att-13', name: 'Sarah Jenkins', email: 'sjenkins@cybershieldzero.com', role: 'Threat Intel Dir', isClient: true }
    ],
    notes: 'Lead angle on 4,000 AI spear-phishing attacks per minute. High interest from Dark Reading and Wired.',
    agenda: ['Key report statistics', 'Visual asset distribution', 'Target media list approval']
  },
  {
    id: 'meet-5',
    clientId: 'client-5',
    clientName: 'Astra Robotics',
    title: 'Warehouse Humanoid Commercial Pilot Press Strategy',
    date: '2026-08-27T16:00:00Z',
    durationMinutes: 45,
    type: 'Media Training',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-5',
    location: 'Google Meet',
    attendees: [
      { id: 'att-14', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-15', name: 'Kenji Sato', email: 'k.sato@astrarobotics.ai', role: 'CSO', isClient: true },
      { id: 'att-16', name: 'Maya Thorne', email: 'maya@astrarobotics.ai', role: 'Head of PR', isClient: true }
    ],
    notes: 'Worker ergonomics angle prioritized over automation replacement narrative.',
    agenda: ['Automation vs worker safety narrative', 'CBS Sunday Morning b-roll permissions', 'Factory filming security rules']
  },
  {
    id: 'meet-6',
    clientId: 'client-6',
    clientName: 'Lumina FinTech',
    title: 'Cross-Border B2B Settlement Engine UK & US Media Push',
    date: '2026-08-20T13:00:00Z',
    durationMinutes: 35,
    type: 'Strategy & Launch',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-6',
    location: 'Google Meet',
    attendees: [
      { id: 'att-17', name: 'David Kalu', email: 'david@prestige-pr.com', role: 'Agency Corporate Lead' },
      { id: 'att-18', name: 'Priya Sharma', email: 'priya.s@lumina.financial', role: 'VP Comms', isClient: true },
      { id: 'att-19', name: 'Sean O’Connor', email: 'sean@lumina.financial', role: 'Head of Treasury', isClient: true }
    ],
    notes: 'FT op-ed submission planned for next Thursday. City A.M. exclusive arranged.',
    agenda: ['FT opinion desk submission', 'Treasury fee data verification', 'Transatlantic narrative arc']
  },
  {
    id: 'meet-7',
    clientId: 'client-7',
    clientName: 'Aetheria Luxury Goods',
    title: 'Paris Fashion Week Sustainable Runway Preview & Vogue Pitch',
    date: '2026-08-14T15:00:00Z',
    durationMinutes: 40,
    type: 'Strategy & Launch',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-7',
    location: 'In-Person Paris Office',
    attendees: [
      { id: 'att-20', name: 'Sophia Chen', email: 'sophia@prestige-pr.com', role: 'Agency Lifestyle Lead' },
      { id: 'att-21', name: 'Camille Laurent', email: 'camille@aetheria.luxury', role: 'Brand Director', isClient: true },
      { id: 'att-22', name: 'Hélène Dupuis', email: 'helene@aetheria.luxury', role: 'Lead Designer', isClient: true }
    ],
    notes: 'Front row seats allocated to Vogue, Elle, and BoF. Material swatch press kits shipping Monday.',
    agenda: ['VIP seating allocations', 'Tactile fabric gift boxes', 'Behind-the-scenes fitting exclusivity']
  },
  {
    id: 'meet-8',
    clientId: 'client-8',
    clientName: 'Veritas Health Analytics',
    title: 'New Client Pitch: Strategic Vision & Multi-Tier Agency Scope',
    date: '2026-08-25T14:30:00Z',
    durationMinutes: 50,
    type: 'Executive Onboarding',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-8',
    location: 'Zoom',
    attendees: [
      { id: 'att-23', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-24', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-25', name: 'Dr. Robert Zimmerman', email: 'rzimmerman@veritasdata.health', role: 'CEO', isClient: true },
      { id: 'att-26', name: 'Rachel Cole', email: 'rcole@veritasdata.health', role: 'VP Growth', isClient: true }
    ],
    notes: 'Client reviewed $25k/mo proposal. Requested references in life sciences.',
    agenda: ['Agency capabilities overview', 'Healthcare credibility & case studies', 'Commercial terms review']
  },
  {
    id: 'meet-9',
    clientId: 'client-9',
    clientName: 'QuantumScale Chips',
    title: 'RFP Pitch: Semiconductor Foundry Partnerships & US CHIPS Act Narrative',
    date: '2026-09-03T11:00:00Z',
    durationMinutes: 55,
    type: 'Executive Onboarding',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-9',
    location: 'Google Meet',
    attendees: [
      { id: 'att-27', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-28', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-29', name: 'Tanya Morales', email: 't.morales@quantumscale.io', role: 'VP Strategy', isClient: true },
      { id: 'att-30', name: 'Dr. Victor Chen', email: 'vchen@quantumscale.io', role: 'CTO', isClient: true }
    ],
    notes: 'High synergy on national security semiconductor narrative. Final proposal submitted.',
    agenda: ['CHIPS Act messaging', 'Sunday political talk shows positioning', 'Agency budget review']
  },
  {
    id: 'meet-10',
    clientId: 'client-1',
    clientName: 'NovaAI Systems',
    title: 'Emergency Crisis PR: Hallucination Bug in Enterprise Customer Pilot',
    date: '2026-07-19T08:30:00Z',
    durationMinutes: 45,
    type: 'Crisis Advisory',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-10',
    location: 'Urgent Video Bridge',
    attendees: [
      { id: 'att-31', name: 'David Kalu', email: 'david@prestige-pr.com', role: 'Crisis Lead' },
      { id: 'att-32', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-33', name: 'Dr. Sarah Lin', email: 'slin@novaai.tech', role: 'CMO', isClient: true },
      { id: 'att-34', name: 'Jonathan Hayes', email: 'jhayes@novaai.tech', role: 'CEO', isClient: true }
    ],
    notes: 'Crisis contained. Transparent blog post diffused Hacker News thread. Verge reported positive resolution.',
    agenda: ['Reddit / HN leak assessment', 'Engineering post-mortem transparency', 'Rapid journalist outreach']
  },
  {
    id: 'meet-11',
    clientId: 'client-10',
    clientName: 'GreenWave Marine',
    title: 'Nordic Clean Maritime Transition Pitch & US Debut Scoping',
    date: '2026-09-02T13:00:00Z',
    durationMinutes: 35,
    type: 'Executive Onboarding',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-11',
    location: 'Google Meet',
    attendees: [
      { id: 'att-35', name: 'David Kalu', email: 'david@prestige-pr.com', role: 'Agency Corporate Lead' },
      { id: 'att-36', name: 'Goran Lindqvist', email: 'goran@greenwaveferries.se', role: 'MD', isClient: true }
    ],
    notes: 'Draft proposal submitted for US debut tour and Puget Sound pilot coverage.',
    agenda: ['US maritime electrification market', 'Target publications', 'Scope and budget']
  },
  {
    id: 'meet-12',
    clientId: 'client-2',
    clientName: 'Helion Energy Grid',
    title: 'Series D Milestone Retrospective & Investor Comms Review',
    date: '2026-07-28T14:00:00Z',
    durationMinutes: 40,
    type: 'Quarterly Review',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-12',
    location: 'Zoom',
    attendees: [
      { id: 'att-37', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-38', name: 'Julian Montgomery', email: 'j.montgomery@heliongrid.io', role: 'VP Comms', isClient: true }
    ],
    notes: 'Celebrated front-page WSJ coverage. Outlined Q4 executive spotlight campaign.',
    agenda: ['Review of WSJ coverage impact', 'Sovereign wealth fund inbound analysis', 'Q4 staffing plan']
  },
  {
    id: 'meet-13',
    clientId: 'client-4',
    clientName: 'CyberShield Zero',
    title: 'Executive Podcast Tour: Prep for Lex Fridman & Risky Business',
    date: '2026-06-15T11:00:00Z',
    durationMinutes: 45,
    type: 'Media Training',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-13',
    location: 'Google Meet',
    attendees: [
      { id: 'att-39', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-40', name: 'Alex Vance', email: 'alex@cybershieldzero.com', role: 'Brand Lead', isClient: true },
      { id: 'att-41', name: 'Dmitri Volkov', email: 'dmitri@cybershieldzero.com', role: 'Founder', isClient: true }
    ],
    notes: 'Dmitri coached on storytelling without jargon. Risky Business recording locked.',
    agenda: ['Podcast narrative arc', 'Vulnerability and personal origin story', 'Avoiding classified client details']
  },
  {
    id: 'meet-14',
    clientId: 'client-6',
    clientName: 'Lumina FinTech',
    title: 'European Banking License Acquisition & Brussels Policy Briefing',
    date: '2026-07-09T16:00:00Z',
    durationMinutes: 40,
    type: 'Strategy & Launch',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-14',
    location: 'Google Meet',
    attendees: [
      { id: 'att-42', name: 'David Kalu', email: 'david@prestige-pr.com', role: 'Agency Corporate Lead' },
      { id: 'att-43', name: 'Priya Sharma', email: 'priya.s@lumina.financial', role: 'VP Comms', isClient: true }
    ],
    notes: 'Handelsblatt, Les Echos, and Reuters coordinated coverage planned.',
    agenda: ['DNB license regulatory impact', 'Multilingual press releases', 'Frankfurt media desk reach']
  },
  {
    id: 'meet-15',
    clientId: 'client-3',
    clientName: 'Nimbus BioHealth',
    title: 'Advisory Board Announcement & Scientific Media Briefing',
    date: '2026-06-03T10:00:00Z',
    durationMinutes: 35,
    type: 'Strategy & Launch',
    transcriptStatus: 'has_transcript',
    transcriptId: 'tr-15',
    location: 'Google Meet',
    attendees: [
      { id: 'att-44', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-45', name: 'Claire Beauchamp', email: 'claire@nimbusbio.com', role: 'Comms Director', isClient: true }
    ],
    notes: 'BioCentury and Nature Biotech features published.',
    agenda: ['Nobel laureate profiles', 'Scientific credibility messaging', 'Trade media pitches']
  },

  // TODAY & UPCOMING MEETINGS (Current simulated date: Mid-September 2026)
  {
    id: 'meet-16',
    clientId: 'client-1',
    clientName: 'NovaAI Systems',
    title: 'Weekly PR Standing Sync: Bloomberg Interview Prep & Quotes',
    date: '2026-09-17T14:30:00Z',
    durationMinutes: 30,
    type: 'Weekly Sync',
    transcriptStatus: 'pending',
    location: 'Google Meet',
    attendees: [
      { id: 'att-46', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-47', name: 'Dr. Sarah Lin', email: 'slin@novaai.tech', role: 'CMO', isClient: true }
    ],
    notes: 'Call occurring today. Reviewing Bloomberg reporter background dossier and final CEO quotes.',
    agenda: ['Bloomberg reporter dossier', 'Sign-off on valuation quote', 'Slide deck review']
  },
  {
    id: 'meet-17',
    clientId: 'client-4',
    clientName: 'CyberShield Zero',
    title: 'Weekly Sync: Dark Reading Article Review & Threat Report Follow-up',
    date: '2026-09-17T16:00:00Z',
    durationMinutes: 30,
    type: 'Weekly Sync',
    transcriptStatus: 'pending',
    location: 'Zoom',
    attendees: [
      { id: 'att-48', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-49', name: 'Alex Vance', email: 'alex@cybershieldzero.com', role: 'Brand Lead', isClient: true }
    ],
    notes: 'Review inbound inquiries from Dark Reading and Wall Street Journal Pro Cyber.',
    agenda: ['Inbound journalist triage', 'Follow-up pitches for second-wave blogs', 'Social media amplification']
  },
  {
    id: 'meet-18',
    clientId: 'client-2',
    clientName: 'Helion Energy Grid',
    title: 'Bi-Weekly Executive Comms: DC Breakfast RSVPs & Briefing Books',
    date: '2026-09-18T10:00:00Z',
    durationMinutes: 45,
    type: 'Weekly Sync',
    transcriptStatus: 'none',
    location: 'Google Meet',
    attendees: [
      { id: 'att-50', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-51', name: 'Julian Montgomery', email: 'j.montgomery@heliongrid.io', role: 'VP Comms', isClient: true }
    ],
    notes: 'Upcoming meeting to review confirmed RSVPs from Politico and Axios for the Hay-Adams breakfast.',
    agenda: ['RSVP review (7 confirmed of 8 slots)', 'Printed briefing books formatting', 'Off-the-record ground rules']
  },
  {
    id: 'meet-19',
    clientId: 'client-5',
    clientName: 'Astra Robotics',
    title: 'CBS Sunday Morning Pre-Interview Briefing with CEO',
    date: '2026-09-19T13:00:00Z',
    durationMinutes: 60,
    type: 'Media Training',
    transcriptStatus: 'none',
    location: 'In-Person Boston HQ',
    attendees: [
      { id: 'att-52', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-53', name: 'Kenji Sato', email: 'k.sato@astrarobotics.ai', role: 'CSO', isClient: true }
    ],
    notes: 'Dry-run camera rehearsal before national television crew arrives on Monday.',
    agenda: ['CBS camera setup test', 'Rehearsal of humanoid safety demonstration', 'Rapid-fire Q&A prep']
  },
  {
    id: 'meet-20',
    clientId: 'client-3',
    clientName: 'Nimbus BioHealth',
    title: 'Post-Trial Release Debrief & Q4 Medical Congress Outreach',
    date: '2026-09-21T15:00:00Z',
    durationMinutes: 45,
    type: 'Quarterly Review',
    transcriptStatus: 'none',
    location: 'Google Meet',
    attendees: [
      { id: 'att-54', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-55', name: 'Claire Beauchamp', email: 'claire@nimbusbio.com', role: 'Comms Director', isClient: true }
    ],
    notes: 'Upcoming session to map out media pitches for European Society of Gene Therapy meeting in Barcelona.',
    agenda: ['ESGT Congress abstracts embargo lift', 'On-site media interviews in Barcelona', 'KOL thought leadership articles']
  },
  {
    id: 'meet-21',
    clientId: 'client-6',
    clientName: 'Lumina FinTech',
    title: 'Weekly Standup: UK FinTech Week Panel Placement',
    date: '2026-09-22T11:30:00Z',
    durationMinutes: 30,
    type: 'Weekly Sync',
    transcriptStatus: 'none',
    location: 'Google Meet',
    attendees: [
      { id: 'att-56', name: 'David Kalu', email: 'david@prestige-pr.com', role: 'Agency Corporate Lead' },
      { id: 'att-57', name: 'Priya Sharma', email: 'priya.s@lumina.financial', role: 'VP Comms', isClient: true }
    ],
    notes: 'Confirming Lumina CEO keynote slot on Future of Wholesale Cross-Border Settlements.',
    agenda: ['Panel moderation details', 'Speech draft review', 'Press release on UK FinTech Week participation']
  },
  {
    id: 'meet-22',
    clientId: 'client-7',
    clientName: 'Aetheria Luxury Goods',
    title: 'Post-Show Vogue Review Debrief & Boutique Pop-up Campaign',
    date: '2026-09-23T14:00:00Z',
    durationMinutes: 45,
    type: 'Strategy & Launch',
    transcriptStatus: 'none',
    location: 'Zoom',
    attendees: [
      { id: 'att-58', name: 'Sophia Chen', email: 'sophia@prestige-pr.com', role: 'Agency Lifestyle Lead' },
      { id: 'att-59', name: 'Camille Laurent', email: 'camille@aetheria.luxury', role: 'Brand Director', isClient: true }
    ],
    notes: 'Review rave review in British Vogue and plan Soho New York pop-up media preview.',
    agenda: ['Vogue feature amplification', 'Soho pop-up private press preview list', 'Micro-influencer seedings']
  },
  {
    id: 'meet-23',
    clientId: 'client-8',
    clientName: 'Veritas Health Analytics',
    title: 'Scope Alignment & Formal Retainer Kickoff Call',
    date: '2026-09-24T16:00:00Z',
    durationMinutes: 45,
    type: 'Executive Onboarding',
    transcriptStatus: 'none',
    location: 'Google Meet',
    attendees: [
      { id: 'att-60', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-61', name: 'Dr. Robert Zimmerman', email: 'rzimmerman@veritasdata.health', role: 'CEO', isClient: true }
    ],
    notes: 'Formal kickoff following agreement on $25,000/mo retainer contract.',
    agenda: ['Review master services agreement', 'Assign dedicated PR pod members', 'Schedule first narrative immersion session']
  },
  {
    id: 'meet-24',
    clientId: 'client-9',
    clientName: 'QuantumScale Chips',
    title: 'Final RFP Defense Presentation with Board of Directors',
    date: '2026-09-25T13:00:00Z',
    durationMinutes: 60,
    type: 'Executive Onboarding',
    transcriptStatus: 'none',
    location: 'Zoom',
    attendees: [
      { id: 'att-62', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-63', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-64', name: 'Tanya Morales', email: 't.morales@quantumscale.io', role: 'VP Strategy', isClient: true }
    ],
    notes: 'Pitch defense before full board. Key focus on political media contacts in DC.',
    agenda: ['30-min slide presentation', '20-min board Q&A', 'Retainer fee discussion']
  },
  {
    id: 'meet-25',
    clientId: 'client-1',
    clientName: 'NovaAI Systems',
    title: 'NovaAI Series C Lift-Day Media War Room',
    date: '2026-09-28T09:30:00Z',
    durationMinutes: 90,
    type: 'Strategy & Launch',
    transcriptStatus: 'none',
    location: 'Virtual War Room Bridge',
    attendees: [
      { id: 'att-65', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-66', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-67', name: 'Dr. Sarah Lin', email: 'slin@novaai.tech', role: 'CMO', isClient: true }
    ],
    notes: 'Live tracking of Bloomberg embargo lift, TechCrunch article publish, and social amplification.',
    agenda: ['Bloomberg story release verification', 'Wire blast distribution check', 'Social reposts & investor quote coordination']
  },
  {
    id: 'meet-26',
    clientId: 'client-5',
    clientName: 'Astra Robotics',
    title: 'Monthly PR Metrics Review & Trade Media Placements',
    date: '2026-09-29T15:00:00Z',
    durationMinutes: 45,
    type: 'Quarterly Review',
    transcriptStatus: 'none',
    location: 'Google Meet',
    attendees: [
      { id: 'att-68', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-69', name: 'Kenji Sato', email: 'k.sato@astrarobotics.ai', role: 'CSO', isClient: true }
    ],
    notes: 'Review results from Robotics Trends and Modern Materials Handling placements.',
    agenda: ['Monthly clipping report', 'Impressions and website referral spikes', 'Planning for next month pilot announcement']
  },
  {
    id: 'meet-27',
    clientId: 'client-4',
    clientName: 'CyberShield Zero',
    title: 'Q4 Defense Sector Media Strategy Alignment',
    date: '2026-09-30T11:00:00Z',
    durationMinutes: 45,
    type: 'Strategy & Launch',
    transcriptStatus: 'none',
    location: 'Zoom',
    attendees: [
      { id: 'att-70', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-71', name: 'Alex Vance', email: 'alex@cybershieldzero.com', role: 'Brand Lead', isClient: true }
    ],
    notes: 'Mapping out federal cybersecurity trade publications and Defense News op-ed.',
    agenda: ['Federal market PR opportunities', 'CISA alert alignment', 'Pitch calendar for October']
  },
  {
    id: 'meet-28',
    clientId: 'client-2',
    clientName: 'Helion Energy Grid',
    title: 'Washington Post Climate Desk Exclusive Briefing',
    date: '2026-10-02T14:00:00Z',
    durationMinutes: 45,
    type: 'Media Training',
    transcriptStatus: 'none',
    location: 'Zoom',
    attendees: [
      { id: 'att-72', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-73', name: 'Julian Montgomery', email: 'j.montgomery@heliongrid.io', role: 'VP Comms', isClient: true }
    ],
    notes: 'Off-the-record backgrounder with lead climate reporter.',
    agenda: ['Grid decarb timeline', 'Briefing deck review', 'Anticipated technical questions']
  },
  {
    id: 'meet-29',
    clientId: 'client-3',
    clientName: 'Nimbus BioHealth',
    title: 'Investor Day Media Preparation Session',
    date: '2026-10-05T10:30:00Z',
    durationMinutes: 60,
    type: 'Media Training',
    transcriptStatus: 'none',
    location: 'Google Meet',
    attendees: [
      { id: 'att-74', name: 'Elena Rostova', email: 'elena@prestige-pr.com', role: 'Agency Partner' },
      { id: 'att-75', name: 'Claire Beauchamp', email: 'claire@nimbusbio.com', role: 'Comms Director', isClient: true }
    ],
    notes: 'Media training for CEO presentation at upcoming NASDAQ investor day.',
    agenda: ['Keynote speech coaching', 'Q&A tough question handling', 'Broadcast visual presentation review']
  },
  {
    id: 'meet-30',
    clientId: 'client-6',
    clientName: 'Lumina FinTech',
    title: 'Quarterly Executive Review & 2027 PR Strategy Roadmap',
    date: '2026-10-08T15:00:00Z',
    durationMinutes: 60,
    type: 'Quarterly Review',
    transcriptStatus: 'none',
    location: 'Zoom',
    attendees: [
      { id: 'att-76', name: 'David Kalu', email: 'david@prestige-pr.com', role: 'Agency Corporate Lead' },
      { id: 'att-77', name: 'Priya Sharma', email: 'priya.s@lumina.financial', role: 'VP Comms', isClient: true }
    ],
    notes: 'Annual contract renewal discussion and review of tier-1 media placements over past 12 months.',
    agenda: ['Media ROI review', 'Coverage benchmark vs competitors (Stripe, Adyen)', 'Retainer scope expansion for 2027']
  },
  {
    id: 'meet-31',
    clientId: 'client-7',
    clientName: 'Aetheria Luxury Goods',
    title: 'Holiday Editorial Gift Guide Outreach Strategy',
    date: '2026-10-12T11:00:00Z',
    durationMinutes: 45,
    type: 'Strategy & Launch',
    transcriptStatus: 'none',
    location: 'Google Meet',
    attendees: [
      { id: 'att-78', name: 'Sophia Chen', email: 'sophia@prestige-pr.com', role: 'Agency Lifestyle Lead' },
      { id: 'att-79', name: 'Camille Laurent', email: 'camille@aetheria.luxury', role: 'Brand Director', isClient: true }
    ],
    notes: 'Targeting November/December print deadlines for luxury sustainable gift features.',
    agenda: ['High-end editorial gift guide list', 'Sample product loan requests', 'Pitch copy approval']
  },
  {
    id: 'meet-32',
    clientId: 'client-1',
    clientName: 'NovaAI Systems',
    title: 'Post-Launch Momentum Planning & Podcast Tour Kickoff',
    date: '2026-10-15T14:00:00Z',
    durationMinutes: 45,
    type: 'Strategy & Launch',
    transcriptStatus: 'none',
    location: 'Google Meet',
    attendees: [
      { id: 'att-80', name: 'Marcus Vance', email: 'marcus@prestige-pr.com', role: 'Agency Tech Lead' },
      { id: 'att-81', name: 'Dr. Sarah Lin', email: 'slin@novaai.tech', role: 'CMO', isClient: true }
    ],
    notes: 'Follow-up podcast appearances on All-In, 20VC, and Dwarkesh Patel podcast.',
    agenda: ['Podcast target shortlist', 'Pitch angles tailored per host', 'Scheduling logistics']
  }
]
