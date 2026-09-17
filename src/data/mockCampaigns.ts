import { Campaign } from '../types/campaign'

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    title: 'NovaAI Series C & Enterprise Scalability Announcement',
    clientId: 'client-1',
    clientName: 'NovaAI Systems',
    status: 'active',
    type: 'Tech Launch & Funding',
    startDate: '2026-09-01',
    endDate: '2026-10-15',
    owner: 'Marcus Vance',
    targetOutlets: ['Bloomberg Technology', 'TechCrunch', 'Forbes Tech', 'The Information', 'VentureBeat'],
    copyText: `SUBJECT: EMBARGOED: NovaAI raises $180M Series C to bring fault-tolerant LLM agents to Fortune 100

Hi [First Name],

Given your recent coverage of generative AI enterprise deployments, I wanted to share an embargoed development ahead of Thursday, Oct 8 at 6:00 AM ET.

NovaAI Systems—the infrastructure platform powering compliant LLM agents for 22 Fortune 100 banks and healthcare providers—is announcing a $180M Series C round led by Coatue, with participation from Lightspeed and NVentures (NVIDIA).

Key takeaways for your readers:
- Proven 142% Net Revenue Retention across enterprise accounts with zero hallucination breaches in regulated finance.
- Proprietary 'Constitutional Guardrails v3' running directly on private cloud hardware without transmitting unencrypted data.
- Quotes available from Dr. Sarah Lin (CMO), Jonathan Hayes (CEO), and Coatue General Partner.

Would you be interested in a 20-minute embargoed conversation with CEO Jonathan Hayes this Tuesday at 11:00 AM ET?

Full media kit with uncompressed benchmark charts and product B-roll: [Link]

Best regards,
Marcus Vance
Tech Practice Lead, Prestige PR`,
    tags: ['GenAI', 'Funding Round', 'Exclusive Pitch', 'Tier-1 Tech'],
    metrics: [
      {
        id: 'met-1-1',
        channel: 'Tier-1 Technology Reporters (Bloomberg, TC, Forbes)',
        pitched: 14,
        impressions: 420000,
        opens: 13,
        clicks: 11,
        replies: 8,
        coverageSecured: 3,
        responseRate: 0.571
      },
      {
        id: 'met-1-2',
        channel: 'Venture & Private Equity Newsletters (Term Sheet, StrictlyVC)',
        pitched: 28,
        impressions: 185000,
        opens: 24,
        clicks: 19,
        replies: 12,
        coverageSecured: 5,
        responseRate: 0.428
      },
      {
        id: 'met-1-3',
        channel: 'Enterprise Software & CIO Trade Desks (CIO.com, InfoWorld)',
        pitched: 45,
        impressions: 120000,
        opens: 32,
        clicks: 21,
        replies: 9,
        coverageSecured: 4,
        responseRate: 0.200
      },
      {
        id: 'met-1-4',
        channel: 'AI Podcasts & Video Channels (20VC, Cognitive Revolution)',
        pitched: 12,
        impressions: 95000,
        opens: 10,
        clicks: 8,
        replies: 6,
        coverageSecured: 2,
        responseRate: 0.500
      }
    ],
    screenshots: [
      {
        id: 'sc-1',
        fileName: 'MuckRack_Analytics_NovaAI_Launch_W1.png',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80',
        uploadedAt: '2026-09-14T17:40:00Z',
        fileSize: '1.2 MB',
        extractedMetrics: {
          impressions: 820000,
          pitched: 99,
          opens: 79,
          clicks: 59,
          replies: 35,
          coverageSecured: 14,
          confidenceScore: 97,
          notes: 'High confidence OCR extraction from Muck Rack PR outreach dashboard. Verified recipient open rate 79.8% and secured tier-1 citations.',
          detectedChannel: 'Muck Rack Aggregated Campaign Report'
        }
      }
    ]
  },
  {
    id: 'camp-2',
    title: 'Helion Commercial Fusion Whitepaper & Policy Briefing',
    clientId: 'client-2',
    clientName: 'Helion Energy Grid',
    status: 'active',
    type: 'CleanTech & Policy PR',
    startDate: '2026-08-15',
    endDate: '2026-10-30',
    owner: 'Elena Rostova',
    targetOutlets: ['Wall Street Journal', 'Axios Generate', 'Politico Energy', 'Financial Times', 'Reuters'],
    copyText: `SUBJECT: Clean Baseload Power for AI: Helion Energy releases 2029 Grid Interconnect Whitepaper

Hi [First Name],

As data center energy constraints threaten the expansion of US artificial intelligence clusters, fusion energy is transitioning from scientific experiment to commercial power purchase agreements.

Helion Energy Grid is today publishing its technical roadmap verifying commercial electricity delivery to private hyperscale customers starting Q3 2029.

Highlights:
- 100% carbon-free baseload power requiring zero water cooling.
- Co-location agreements with two of the world's top three cloud providers.
- Bipartisan support letter signed by 14 state governors and energy commissioners.

We are hosting an off-the-record background breakfast at the Hay-Adams in Washington, DC next month, and our Chief Scientist Dr. Arthur Sterling is open for 1-on-1 briefings under embargo.

Would you like access to the complete 42-page technical report?

Best,
Elena Rostova
Prestige PR Partner`,
    tags: ['CleanTech', 'Energy Policy', 'Whitepaper', 'Washington DC'],
    metrics: [
      {
        id: 'met-2-1',
        channel: 'National Policy Desks (Politico Pro, Axios, Bloomberg Gov)',
        pitched: 22,
        impressions: 340000,
        opens: 19,
        clicks: 15,
        replies: 10,
        coverageSecured: 4,
        responseRate: 0.454
      },
      {
        id: 'met-2-2',
        channel: 'Financial & Energy Mainstream (WSJ, FT, Reuters Energy)',
        pitched: 18,
        impressions: 610000,
        opens: 16,
        clicks: 14,
        replies: 8,
        coverageSecured: 3,
        responseRate: 0.444
      },
      {
        id: 'met-2-3',
        channel: 'Scientific & CleanTech Verticals (MIT Tech Review, Canary Media)',
        pitched: 35,
        impressions: 140000,
        opens: 28,
        clicks: 22,
        replies: 14,
        coverageSecured: 6,
        responseRate: 0.400
      }
    ],
    screenshots: [
      {
        id: 'sc-2',
        fileName: 'Cision_Media_Monitor_Helion_DC.png',
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80',
        uploadedAt: '2026-09-10T12:15:00Z',
        fileSize: '2.1 MB',
        extractedMetrics: {
          impressions: 1090000,
          pitched: 75,
          opens: 63,
          clicks: 51,
          replies: 32,
          coverageSecured: 13,
          confidenceScore: 94,
          notes: 'Extracted from Cision PR monitoring dashboard. Includes national syndicated wire pickup and Capitol Hill readership impressions.',
          detectedChannel: 'Cision Distribution Intelligence'
        }
      }
    ]
  },
  {
    id: 'camp-3',
    title: 'CyberShield Q3 Ransomware Threat Intelligence Campaign',
    clientId: 'client-4',
    clientName: 'CyberShield Zero',
    status: 'completed',
    type: 'Threat Report & Thought Leadership',
    startDate: '2026-08-01',
    endDate: '2026-09-10',
    owner: 'Marcus Vance',
    targetOutlets: ['Dark Reading', 'Wired', 'The Register', 'BleepingComputer', 'Forbes Tech'],
    copyText: `SUBJECT: Data Exclusive: Automated AI extortion surges 310% in Q3 (CyberShield Threat Report)

Hi [First Name],

Our telemetry team at CyberShield Zero just finalized our Q3 Threat Intelligence Report tracking over 85 million enterprise endpoint events.

The standout finding: ransomware cartels have fully automated employee impersonation. By ingesting public social profiles into local language models, attackers now generate personalized extortion emails in 14 languages within 3 seconds of scraping an executive's profile.

Report Highlights:
- 310% quarter-over-quarter increase in AI-orchestrated identity extortion.
- Average ransom demand paid dropped by 38% as enterprises shift to automated immutable snapshots.
- New zero-day vulnerability weaponized in legacy VPN gateways (patch details included).

Dmitri Volkov, our Chief Hacker and CEO, is available to walk you through our anonymized attack replays and raw sensor data.

Read the executive summary here: [Link]

Warmly,
Marcus Vance`,
    tags: ['Cybersecurity', 'Research Report', 'Dark Reading', 'Wired'],
    metrics: [
      {
        id: 'met-3-1',
        channel: 'Infosec Core Press (Dark Reading, BleepingComputer, The Register)',
        pitched: 32,
        impressions: 480000,
        opens: 29,
        clicks: 25,
        replies: 16,
        coverageSecured: 8,
        responseRate: 0.500
      },
      {
        id: 'met-3-2',
        channel: 'Mainstream Business Cyber (Forbes, WSJ Pro Cyber, Axios Codebook)',
        pitched: 24,
        impressions: 320000,
        opens: 20,
        clicks: 16,
        replies: 11,
        coverageSecured: 5,
        responseRate: 0.458
      },
      {
        id: 'met-3-3',
        channel: 'Cybersecurity Newsletters & Substack Authors',
        pitched: 40,
        impressions: 110000,
        opens: 35,
        clicks: 30,
        replies: 19,
        coverageSecured: 9,
        responseRate: 0.475
      }
    ],
    screenshots: [
      {
        id: 'sc-3',
        fileName: 'CyberShield_Q3_BuzzSumo_Coverage.png',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&auto=format&fit=crop&q=80',
        uploadedAt: '2026-09-08T18:00:00Z',
        fileSize: '1.6 MB',
        extractedMetrics: {
          impressions: 910000,
          pitched: 96,
          opens: 84,
          clicks: 71,
          replies: 46,
          coverageSecured: 22,
          confidenceScore: 98,
          notes: 'Extracted from BuzzSumo and Meltwater monitoring. High engagement across LinkedIn and Reddit infosec communities.',
          detectedChannel: 'Meltwater Global Cyber Media'
        }
      }
    ]
  },
  {
    id: 'camp-4',
    title: 'Astra Robotics Humanoid Warehouse Pilot Unveiling',
    clientId: 'client-5',
    clientName: 'Astra Robotics',
    status: 'active',
    type: 'Product Launch & Video Feature',
    startDate: '2026-08-20',
    endDate: '2026-10-20',
    owner: 'Marcus Vance',
    targetOutlets: ['CBS Sunday Morning', 'WSJ Tech Video', 'IEEE Spectrum', 'TechCrunch Disrupt', 'The Verge'],
    copyText: `SUBJECT: First Look Video: Astra's humanoid robot sorts 10,000 packages/hour in live commercial warehouse

Hi [First Name],

While humanoid robots have dazzled audiences in controlled stage demonstrations, Astra Autonomous Robotics has quietly deployed 40 units into a live 500,000 sq ft logistics hub in Ohio.

The robots are not an experiment: they are on the clock 18 hours a day, reducing repetitive heavy-lifting strain on human shift workers by 68%.

We have prepared:
- Unedited 4K 60fps footage of the robots navigating conveyor bottlenecks.
- On-site interviews with the facility floor safety manager.
- Interview availability with Astra CSO Kenji Sato.

We are granting exclusive first-broadcast rights to one national network. Let me know if you would like to review the embargoed video reel today.

Best regards,
Marcus Vance`,
    tags: ['Robotics', 'Automation', 'Video Feature', 'CBS News'],
    metrics: [
      {
        id: 'met-4-1',
        channel: 'Broadcast TV & Video Producers (CBS, CNBC, Bloomberg TV)',
        pitched: 8,
        impressions: 980000,
        opens: 7,
        clicks: 7,
        replies: 4,
        coverageSecured: 2,
        responseRate: 0.500
      },
      {
        id: 'met-4-2',
        channel: 'Leading Tech Publications (Wired, The Verge, Ars Technica)',
        pitched: 25,
        impressions: 340000,
        opens: 21,
        clicks: 18,
        replies: 9,
        coverageSecured: 4,
        responseRate: 0.360
      },
      {
        id: 'met-4-3',
        channel: 'Industrial Automation Trades (Modern Materials Handling, Robotics Business Review)',
        pitched: 30,
        impressions: 85000,
        opens: 22,
        clicks: 17,
        replies: 11,
        coverageSecured: 6,
        responseRate: 0.366
      }
    ],
    screenshots: [
      {
        id: 'sc-4',
        fileName: 'Astra_Broadcast_Coverage_Tracker.png',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
        uploadedAt: '2026-09-12T14:30:00Z',
        fileSize: '3.4 MB',
        extractedMetrics: {
          impressions: 1405000,
          pitched: 63,
          opens: 50,
          clicks: 42,
          replies: 24,
          coverageSecured: 12,
          confidenceScore: 92,
          notes: 'AI OCR extracted from TVEyes broadcast media monitoring system. Verified CBS Sunday Morning preliminary segment interest.',
          detectedChannel: 'TVEyes Broadcast Intelligence'
        }
      }
    ]
  },
  {
    id: 'camp-5',
    title: 'Nimbus BioHealth Phase II Clinical Trial Announcement',
    clientId: 'client-3',
    clientName: 'Nimbus BioHealth',
    status: 'draft',
    type: 'Clinical Biotech Data',
    startDate: '2026-09-20',
    endDate: '2026-11-15',
    owner: 'Elena Rostova',
    targetOutlets: ['Stat News', 'Endpoints News', 'Fierce Biotech', 'BioCentury', 'CNBC Health'],
    copyText: `SUBJECT: EMBARGOED [Date]: Nimbus Phase II trial demonstrates 42% cognitive decline slowing (p < 0.001)

Dear [First Name],

Under strict embargo until [Date] at 7:00 AM ET (coinciding with SEC disclosure), Nimbus BioHealth is reporting top-line results from its 24-week Phase II clinical trial in early-stage neurodegenerative decline.

The study met its primary composite cognitive endpoint with high statistical significance (p = 0.0008) and demonstrated an exceptional clean safety profile with zero treatment-emergent amyloid-related imaging abnormalities (ARIA).

Spokespersons available for embargoed pre-briefing:
- Dr. Alan Ross, Chief Medical Officer
- Dr. Claire Beauchamp, Director of Corporate Affairs

Full statistical tables and patient enrollment demographics attached under non-disclosure.

Elena Rostova
Prestige PR`,
    tags: ['BioTech', 'Clinical Trials', 'FDA', 'Stat News'],
    metrics: [
      {
        id: 'met-5-1',
        channel: 'Top Biotech Journalists (Stat News, Endpoints, Fierce)',
        pitched: 16,
        impressions: 0,
        opens: 0,
        clicks: 0,
        replies: 0,
        coverageSecured: 0,
        responseRate: 0.000
      },
      {
        id: 'met-5-2',
        channel: 'Financial Health Analysts & Columnists',
        pitched: 20,
        impressions: 0,
        opens: 0,
        clicks: 0,
        replies: 0,
        coverageSecured: 0,
        responseRate: 0.000
      }
    ],
    screenshots: []
  },
  {
    id: 'camp-6',
    title: 'Lumina FinTech UK & European Expansion Media Blitz',
    clientId: 'client-6',
    clientName: 'Lumina FinTech',
    status: 'completed',
    type: 'International Market Expansion',
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    owner: 'David Kalu',
    targetOutlets: ['Financial Times', 'City A.M.', 'Handelsblatt', 'Les Echos', 'Sifted'],
    copyText: `SUBJECT: Lumina secures Dutch Central Bank EMI authorization to challenge SWIFT in Eurozone

Hi [First Name],

Following our launch in the United Kingdom, Lumina FinTech has received official Electronic Money Institution (EMI) passporting authorization from De Nederlandsche Bank (DNB).

With this license, Lumina now delivers instant cross-border treasury settlements for European corporate treasuries without standard 48-hour correspondent banking delays.

Highlights:
- Guaranteed sub-3-second cross-border settlement in EUR, USD, and GBP.
- 60% lower foreign exchange spread fees compared to legacy money center banks.
- $12B annual annualized settlement volume achieved in first 180 days.

CEO op-ed available for exclusive European syndication.

David Kalu
Prestige PR`,
    tags: ['FinTech', 'Europe', 'Banking License', 'Financial Times'],
    metrics: [
      {
        id: 'met-6-1',
        channel: 'London City Financial Media (FT, City A.M., Citywire)',
        pitched: 28,
        impressions: 720000,
        opens: 25,
        clicks: 22,
        replies: 15,
        coverageSecured: 7,
        responseRate: 0.535
      },
      {
        id: 'met-6-2',
        channel: 'Continental European Business Press (Handelsblatt, Les Echos)',
        pitched: 34,
        impressions: 430000,
        opens: 27,
        clicks: 21,
        replies: 12,
        coverageSecured: 5,
        responseRate: 0.352
      },
      {
        id: 'met-6-3',
        channel: 'FinTech Special Interest Portals (Finextra, Sifted, BankingTech)',
        pitched: 42,
        impressions: 190000,
        opens: 36,
        clicks: 31,
        replies: 18,
        coverageSecured: 11,
        responseRate: 0.428
      }
    ],
    screenshots: [
      {
        id: 'sc-6',
        fileName: 'Lumina_EU_Coverage_Summary_Q2.png',
        thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
        uploadedAt: '2026-08-05T11:00:00Z',
        fileSize: '1.8 MB',
        extractedMetrics: {
          impressions: 1340000,
          pitched: 104,
          opens: 88,
          clicks: 74,
          replies: 45,
          coverageSecured: 23,
          confidenceScore: 96,
          notes: 'Full European media impact audit confirmed by Onclusive PR metrics.',
          detectedChannel: 'Onclusive European Media Monitor'
        }
      }
    ]
  },
  {
    id: 'camp-7',
    title: 'Aetheria Sustainable Couture Paris Runway Showcase',
    clientId: 'client-7',
    clientName: 'Aetheria Luxury Goods',
    status: 'completed',
    type: 'Fashion & Luxury Lifestyle',
    startDate: '2026-07-15',
    endDate: '2026-08-30',
    owner: 'Sophia Chen',
    targetOutlets: ['British Vogue', 'Vogue Paris', 'Business of Fashion', 'WWD', 'Harper’s Bazaar'],
    copyText: `SUBJECT: Invitation: Aetheria Autumn/Winter Sustainable Couture Runway Preview — Paris

Chère [First Name],

We would be delighted to invite you to the private salon unveiling of Aetheria's Autumn/Winter 2027 collection on Friday, August 28th at 18:00 at Galerie Vivienne, Paris.

Aetheria represents the world's first luxury atelier using 100% bio-synthesized silk polymers that are completely biodegradable in soil within 90 days, while surpassing the hand-feel of traditional mulberry silk.

Front-row press invitations are strictly limited. Following the presentation, Lead Designer Hélène Dupuis and Brand Director Camille Laurent will be hosting an intimate champagne reception for fashion editors.

RSVP directly to confirm your seat and receive your bespoke fabric material sample case.

Cordially,
Sophia Chen
Lifestyle Director, Prestige PR`,
    tags: ['Luxury', 'Fashion Week', 'Sustainability', 'Vogue'],
    metrics: [
      {
        id: 'met-7-1',
        channel: 'Top Tier Global Fashion Editors (Vogue, Elle, Harper’s Bazaar)',
        pitched: 26,
        impressions: 1250000,
        opens: 24,
        clicks: 22,
        replies: 19,
        coverageSecured: 9,
        responseRate: 0.730
      },
      {
        id: 'met-7-2',
        channel: 'Fashion Business & Trade (BoF, WWD, Fashionista)',
        pitched: 18,
        impressions: 460000,
        opens: 16,
        clicks: 14,
        replies: 11,
        coverageSecured: 6,
        responseRate: 0.611
      },
      {
        id: 'met-7-3',
        channel: 'Sustainable Lifestyle & Cultural Substack Newsletters',
        pitched: 35,
        impressions: 210000,
        opens: 30,
        clicks: 27,
        replies: 16,
        coverageSecured: 8,
        responseRate: 0.457
      }
    ],
    screenshots: [
      {
        id: 'sc-7',
        fileName: 'Vogue_Runway_Feature_Metrics.png',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&auto=format&fit=crop&q=80',
        uploadedAt: '2026-08-31T16:20:00Z',
        fileSize: '2.5 MB',
        extractedMetrics: {
          impressions: 1920000,
          pitched: 79,
          opens: 70,
          clicks: 63,
          replies: 46,
          coverageSecured: 23,
          confidenceScore: 99,
          notes: 'Direct screenshot from Launchmetrics PR dashboard showing Media Impact Value (MIV) of $2.4M and 23 confirmed editorial articles.',
          detectedChannel: 'Launchmetrics Fashion MIV'
        }
      }
    ]
  },
  {
    id: 'camp-8',
    title: 'Executive Thought Leadership: AI in Supply Chains (Multi-Client)',
    clientId: undefined,
    clientName: 'Agency Multi-Client Initiative',
    status: 'paused',
    type: 'Executive Thought Leadership',
    startDate: '2026-08-01',
    endDate: '2026-11-01',
    owner: 'Marcus Vance',
    targetOutlets: ['Harvard Business Review', 'MIT Sloan Management Review', 'Fast Company', 'Fortune Commentary'],
    copyText: `SUBJECT: Op-Ed Pitch: Why the next trillion dollars in AI will be won in loading docks, not chatbots

Dear [First Name],

Every corporate board is currently pouring capital into conversational customer service bots, while the deepest economic bottleneck remains invisible: physical supply chain latency.

We have brought together insights from CEOs across autonomous robotics (Astra), enterprise AI guardrails (NovaAI), and transatlantic freight payments (Lumina) to present an authoritative perspective on the industrial AI transformation.

Proposed Angles:
1. The 'Invisible 45%': How manual freight handoffs drain operating margins.
2. Safe Autonomy: Why physical robotics requires higher certainty thresholds than generative content.
3. Case studies from live factory pilots demonstrating 30% speedups.

Authored by Kenji Sato (Astra CSO) and Dr. Sarah Lin (NovaAI CMO).

Would you be open to reviewing the 1,200-word draft op-ed on an exclusive consideration basis?

Marcus Vance
Prestige PR`,
    tags: ['Op-Ed', 'HBR', 'Fast Company', 'Thought Leadership'],
    metrics: [
      {
        id: 'met-8-1',
        channel: 'Top Tier Business Opinions (HBR, MIT Sloan, Fast Company)',
        pitched: 12,
        impressions: 150000,
        opens: 9,
        clicks: 7,
        replies: 4,
        coverageSecured: 1,
        responseRate: 0.333
      },
      {
        id: 'met-8-2',
        channel: 'Syndicated Business Columnists & Contributors',
        pitched: 25,
        impressions: 95000,
        opens: 18,
        clicks: 13,
        replies: 7,
        coverageSecured: 3,
        responseRate: 0.280
      }
    ],
    screenshots: []
  }
]
