import { Client, ClientOwner } from '../types/client'

export const agencyOwners: ClientOwner[] = [
  {
    id: 'owner-1',
    name: 'Elena Rostova',
    email: 'elena@prestige-pr.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Senior PR Partner'
  },
  {
    id: 'owner-2',
    name: 'Marcus Vance',
    email: 'marcus@prestige-pr.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Tech & B2B Practice Lead'
  },
  {
    id: 'owner-3',
    name: 'Sophia Chen',
    email: 'sophia@prestige-pr.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Consumer & Lifestyle Director'
  },
  {
    id: 'owner-4',
    name: 'David Kalu',
    email: 'david@prestige-pr.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Crisis & Corporate Strategy Lead'
  }
]

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'NovaAI Systems',
    company: 'NovaAI Systems Inc.',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    status: 'active',
    industry: 'Enterprise AI & LLMs',
    tier: 'Enterprise',
    owner: agencyOwners[1],
    primaryContact: {
      name: 'Dr. Sarah Lin',
      email: 'slin@novaai.tech',
      phone: '+1 (415) 890-2341',
      title: 'Chief Marketing Officer'
    },
    retainerMonthly: 24000,
    joinedDate: '2025-04-12',
    website: 'https://novaai.tech',
    tags: ['GenAI', 'Series B', 'Silicon Valley', 'Tier-1 Media'],
    notes: 'Preparing for Series C announcement in Q4 2026. Prioritizing Bloomberg, Forbes, and TechCrunch exclusives.',
    proposalDocs: [
      {
        id: 'doc-1',
        name: 'NovaAI_Q3_Q4_PR_Master_Strategy_2026.pdf',
        fileSize: '4.2 MB',
        uploadedAt: '2026-06-15T10:30:00Z',
        url: '#',
        type: 'proposal',
        status: 'signed'
      },
      {
        id: 'doc-2',
        name: 'Series_C_Embargo_Media_Kit_Brief.pdf',
        fileSize: '2.8 MB',
        uploadedAt: '2026-08-10T14:15:00Z',
        url: '#',
        type: 'brief',
        status: 'signed'
      }
    ]
  },
  {
    id: 'client-2',
    name: 'Helion Energy Grid',
    company: 'Helion Energy Grid Corp',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&auto=format&fit=crop&q=80',
    status: 'active',
    industry: 'CleanTech & Fusion',
    tier: 'Enterprise',
    owner: agencyOwners[0],
    primaryContact: {
      name: 'Julian Montgomery',
      email: 'j.montgomery@heliongrid.io',
      phone: '+1 (206) 431-7729',
      title: 'VP of Global Communications'
    },
    retainerMonthly: 30000,
    joinedDate: '2024-11-01',
    website: 'https://heliongrid.io',
    tags: ['CleanTech', 'Fusion', 'Washington DC', 'Policy PR'],
    notes: 'Regulatory policy announcements scheduled for next month. Need heavy emphasis on WSJ and Reuters Energy desk.',
    proposalDocs: [
      {
        id: 'doc-3',
        name: 'Helion_Annual_PR_Retainer_Scope_2026.pdf',
        fileSize: '5.1 MB',
        uploadedAt: '2025-10-20T09:00:00Z',
        url: '#',
        type: 'contract',
        status: 'signed'
      }
    ]
  },
  {
    id: 'client-3',
    name: 'Nimbus BioHealth',
    company: 'Nimbus BioHealth Therapeutics',
    logo: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=100&auto=format&fit=crop&q=80',
    status: 'active',
    industry: 'BioTech & Longevity',
    tier: 'Enterprise',
    owner: agencyOwners[0],
    primaryContact: {
      name: 'Claire Beauchamp',
      email: 'claire@nimbusbio.com',
      phone: '+1 (617) 229-8831',
      title: 'Director of Corporate Affairs'
    },
    retainerMonthly: 28000,
    joinedDate: '2025-01-15',
    website: 'https://nimbusbio.com',
    tags: ['BioTech', 'FDA Phase II', 'Boston Bio', 'Stat News'],
    notes: 'Phase II trial data expected in late September. Readying embargoed briefings with health reporters.',
    proposalDocs: [
      {
        id: 'doc-4',
        name: 'Nimbus_Clinical_Data_Rollout_Plan.pdf',
        fileSize: '3.6 MB',
        uploadedAt: '2026-07-02T16:00:00Z',
        url: '#',
        type: 'proposal',
        status: 'signed'
      }
    ]
  },
  {
    id: 'client-4',
    name: 'CyberShield Zero',
    company: 'CyberShield Zero Security Inc.',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    status: 'active',
    industry: 'Cybersecurity & Defense',
    tier: 'Growth',
    owner: agencyOwners[1],
    primaryContact: {
      name: 'Alex Vance',
      email: 'alex@cybershieldzero.com',
      phone: '+1 (512) 674-1290',
      title: 'Head of Brand & PR'
    },
    retainerMonthly: 18000,
    joinedDate: '2025-08-20',
    website: 'https://cybershieldzero.com',
    tags: ['Cybersecurity', 'Zero Trust', 'Threat Report', 'Austin'],
    notes: 'Quarterly Ransomware Intelligence Report launch scheduled for next week.',
    proposalDocs: [
      {
        id: 'doc-5',
        name: 'Q3_Threat_Report_Media_Distribution.pdf',
        fileSize: '1.9 MB',
        uploadedAt: '2026-08-25T11:20:00Z',
        url: '#',
        type: 'brief',
        status: 'signed'
      }
    ]
  },
  {
    id: 'client-5',
    name: 'Astra Robotics',
    company: 'Astra Autonomous Robotics Ltd.',
    logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&auto=format&fit=crop&q=80',
    status: 'active',
    industry: 'Robotics & Industrial Automation',
    tier: 'Growth',
    owner: agencyOwners[1],
    primaryContact: {
      name: 'Kenji Sato',
      email: 'k.sato@astrarobotics.ai',
      phone: '+1 (408) 552-9011',
      title: 'Chief Strategy Officer'
    },
    retainerMonthly: 16500,
    joinedDate: '2026-02-01',
    website: 'https://astrarobotics.ai',
    tags: ['Robotics', 'Warehouse Automation', 'CES 2027'],
    notes: 'Humanoid warehouse robot pilot at major logistics chain. Preparing video B-roll for TV broadcast.',
    proposalDocs: [
      {
        id: 'doc-6',
        name: 'Astra_Launch_PR_Package.pdf',
        fileSize: '6.4 MB',
        uploadedAt: '2026-02-10T15:45:00Z',
        url: '#',
        type: 'proposal',
        status: 'signed'
      }
    ]
  },
  {
    id: 'client-6',
    name: 'Lumina FinTech',
    company: 'Lumina Global Payments Inc.',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
    status: 'active',
    industry: 'FinTech & Cross-Border Payments',
    tier: 'Growth',
    owner: agencyOwners[3],
    primaryContact: {
      name: 'Priya Sharma',
      email: 'priya.s@lumina.financial',
      phone: '+1 (212) 993-4100',
      title: 'VP Communications'
    },
    retainerMonthly: 21000,
    joinedDate: '2025-06-10',
    website: 'https://lumina.financial',
    tags: ['FinTech', 'B2B Payments', 'London', 'NYC', 'Forbes'],
    notes: 'Executive thought leadership piece placed in FT last month. Current focus on podcast circuit.',
    proposalDocs: [
      {
        id: 'doc-7',
        name: 'Lumina_Executive_Thought_Leadership_Scope.pdf',
        fileSize: '3.1 MB',
        uploadedAt: '2026-05-18T13:00:00Z',
        url: '#',
        type: 'proposal',
        status: 'signed'
      }
    ]
  },
  {
    id: 'client-7',
    name: 'Aetheria Luxury Goods',
    company: 'Aetheria Sustainable Couture',
    logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&auto=format&fit=crop&q=80',
    status: 'active',
    industry: 'Sustainable Luxury & Fashion',
    tier: 'Boutique',
    owner: agencyOwners[2],
    primaryContact: {
      name: 'Camille Laurent',
      email: 'camille@aetheria.luxury',
      phone: '+33 1 42 68 55 00',
      title: 'Brand Director'
    },
    retainerMonthly: 15000,
    joinedDate: '2026-03-01',
    website: 'https://aetheria.luxury',
    tags: ['Fashion', 'Sustainability', 'Paris Fashion Week', 'Vogue'],
    notes: 'Paris showroom event upcoming. Target coverage in Vogue, Business of Fashion, and GQ.',
    proposalDocs: [
      {
        id: 'doc-8',
        name: 'Aetheria_Fall_Winter_Campaign_Scope.pdf',
        fileSize: '7.8 MB',
        uploadedAt: '2026-03-12T10:00:00Z',
        url: '#',
        type: 'proposal',
        status: 'signed'
      }
    ]
  },
  {
    id: 'client-8',
    name: 'Veritas Health Analytics',
    company: 'Veritas Health Data Corp',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&auto=format&fit=crop&q=80',
    status: 'prospect',
    industry: 'Digital Health & AI Diagnostics',
    tier: 'Enterprise',
    owner: agencyOwners[0],
    primaryContact: {
      name: 'Dr. Robert Zimmerman',
      email: 'rzimmerman@veritasdata.health',
      phone: '+1 (312) 480-1920',
      title: 'Founder & CEO'
    },
    retainerMonthly: 25000,
    joinedDate: '2026-08-15',
    website: 'https://veritasdata.health',
    tags: ['Prospect', 'Series A', 'HealthTech', 'FDA Clearance'],
    notes: 'Proposal submitted for $25k/mo retainer. Second pitch call scheduled with board members.',
    proposalDocs: [
      {
        id: 'doc-9',
        name: 'Veritas_Pitch_Deck_PR_Agency_Proposal_v3.pdf',
        fileSize: '8.4 MB',
        uploadedAt: '2026-08-20T17:10:00Z',
        url: '#',
        type: 'proposal',
        status: 'review'
      }
    ]
  },
  {
    id: 'client-9',
    name: 'QuantumScale Chips',
    company: 'QuantumScale Technologies Inc.',
    logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80',
    status: 'prospect',
    industry: 'Semiconductors & Quantum Computing',
    tier: 'Enterprise',
    owner: agencyOwners[1],
    primaryContact: {
      name: 'Tanya Morales',
      email: 't.morales@quantumscale.io',
      phone: '+1 (650) 902-1144',
      title: 'VP of Commercial Strategy'
    },
    retainerMonthly: 32000,
    joinedDate: '2026-09-01',
    website: 'https://quantumscale.io',
    tags: ['Prospect', 'Semiconductor', 'Chips Act', 'Tier 1 Exclusive'],
    notes: 'Received inbound RFP. Competitor agency was pitching $28k. Elena and Marcus leading RFP response.',
    proposalDocs: [
      {
        id: 'doc-10',
        name: 'QuantumScale_RFP_Response_PrestigePR.pdf',
        fileSize: '5.6 MB',
        uploadedAt: '2026-09-05T09:30:00Z',
        url: '#',
        type: 'proposal',
        status: 'draft'
      }
    ]
  },
  {
    id: 'client-10',
    name: 'GreenWave Marine',
    company: 'GreenWave Electric Ferries',
    logo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&auto=format&fit=crop&q=80',
    status: 'prospect',
    industry: 'Maritime CleanTech & EV',
    tier: 'Growth',
    owner: agencyOwners[3],
    primaryContact: {
      name: 'Goran Lindqvist',
      email: 'goran@greenwaveferries.se',
      phone: '+46 8 500 2341',
      title: 'Managing Director'
    },
    retainerMonthly: 17500,
    joinedDate: '2026-08-28',
    website: 'https://greenwaveferries.se',
    tags: ['Prospect', 'Maritime', 'Clean Energy', 'Nordics'],
    notes: 'Draft proposal in progress for EU expansion PR and US media introduction.',
    proposalDocs: [
      {
        id: 'doc-11',
        name: 'GreenWave_Preliminary_PR_Scope.pdf',
        fileSize: '2.4 MB',
        uploadedAt: '2026-08-30T14:00:00Z',
        url: '#',
        type: 'proposal',
        status: 'review'
      }
    ]
  },
  {
    id: 'client-11',
    name: 'OrbitLink Satellites',
    company: 'OrbitLink Aerospace Co.',
    logo: 'https://images.unsplash.com/photo-1517976487507-5b3a4a159981?w=100&auto=format&fit=crop&q=80',
    status: 'churned',
    industry: 'SpaceTech & Telecom',
    tier: 'Growth',
    owner: agencyOwners[3],
    primaryContact: {
      name: 'Brett Anderson',
      email: 'banderson@orbitlink.space',
      phone: '+1 (303) 789-2144',
      title: 'Former Head of Marketing'
    },
    retainerMonthly: 19000,
    joinedDate: '2024-06-01',
    website: 'https://orbitlink.space',
    tags: ['SpaceTech', 'Acquired', 'Former Client'],
    notes: 'Churned due to acquisition by Defense Prime in April 2026. In-house defense team took over PR. Left on great terms.',
    proposalDocs: [
      {
        id: 'doc-12',
        name: 'OrbitLink_Final_Engagement_Debrief_2026.pdf',
        fileSize: '3.9 MB',
        uploadedAt: '2026-04-20T12:00:00Z',
        url: '#',
        type: 'report',
        status: 'signed'
      }
    ]
  },
  {
    id: 'client-12',
    name: 'Veloce Hypercars',
    company: 'Veloce Electric Supercars SpA',
    logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100&auto=format&fit=crop&q=80',
    status: 'churned',
    industry: 'Automotive & EV Hypercars',
    tier: 'Boutique',
    owner: agencyOwners[2],
    primaryContact: {
      name: 'Matteo Rossi',
      email: 'm.rossi@veloce.it',
      phone: '+39 02 899 4321',
      title: 'Comms Director'
    },
    retainerMonthly: 16000,
    joinedDate: '2025-02-15',
    website: 'https://veloce.it',
    tags: ['Automotive', 'EV', 'Monaco', 'Former Client'],
    notes: '6-month fixed project contract ended after successful Geneva Motor Show unveil.',
    proposalDocs: [
      {
        id: 'doc-13',
        name: 'Veloce_Post_Campaign_Report.pdf',
        fileSize: '4.7 MB',
        uploadedAt: '2025-09-01T15:00:00Z',
        url: '#',
        type: 'report',
        status: 'signed'
      }
    ]
  }
]
