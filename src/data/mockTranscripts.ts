import { Transcript } from '../types/transcript'

export const mockTranscripts: Transcript[] = [
  {
    id: 'tr-1',
    meetingId: 'meet-1',
    clientId: 'client-1',
    clientName: 'NovaAI Systems',
    title: 'Series C Embargo Strategy & Tier-1 Media Exclusive Planning',
    date: '2026-09-15T14:00:00Z',
    totalDuration: '52 mins',
    participants: ['Marcus Vance (Agency)', 'Elena Rostova (Agency)', 'Dr. Sarah Lin (NovaAI CMO)', 'Alex Rivera (NovaAI Comms)'],
    hasAttachment: true,
    keyTakeaways: [
      'Agreed to pitch Bloomberg Technology exclusively 72 hours before wider wire release.',
      'Sarah Lin insisted on strict ground rules: no leaks regarding the $180M valuation floor.',
      'Draft Q&A messaging document around enterprise safety benchmarks to be finalized by Friday.'
    ],
    actionItems: [
      { id: 'act-1', task: 'Finalize Bloomberg exclusive pitch draft with quote approvals', assignee: 'Marcus Vance', completed: true },
      { id: 'act-2', task: 'Schedule 30-min founder media training session with CEO', assignee: 'Elena Rostova', completed: false },
      { id: 'act-3', task: 'Provide customer case study quotes from Fortune 500 pilots', assignee: 'Dr. Sarah Lin', completed: false }
    ],
    parts: [
      {
        id: 'part-1-1',
        partNumber: 1,
        title: 'Exclusive Angle vs Wire Distribution Strategy',
        duration: '18 mins',
        segments: [
          {
            id: 'seg-1',
            speaker: 'Marcus Vance',
            speakerRole: 'Agency Tech Lead',
            isClient: false,
            timestamp: '00:45',
            text: "Thanks everyone for hopping on. The big decision today is whether we offer the Series C announcement as an exclusive to Bloomberg or TechCrunch, or if we go straight to an embargoed briefing with 10 top reporters.",
            sentiment: 'neutral'
          },
          {
            id: 'seg-2',
            speaker: 'Dr. Sarah Lin',
            speakerRole: 'CMO, NovaAI',
            isClient: true,
            timestamp: '02:10',
            text: "Our board strongly prefers Bloomberg for the initial exclusive because of the enterprise investor readership. TechCrunch is great for developers, but this round is about enterprise scalability and global infrastructure.",
            sentiment: 'positive'
          },
          {
            id: 'seg-3',
            speaker: 'Elena Rostova',
            speakerRole: 'Agency Partner',
            isClient: false,
            timestamp: '04:15',
            text: "That aligns with our assessment. If we give Bloomberg the exclusive, we can offer their lead enterprise AI reporter a 1-on-1 with your CEO on Tuesday morning under embargo, lifting 6am ET Thursday.",
            sentiment: 'positive'
          },
          {
            id: 'seg-4',
            speaker: 'Alex Rivera',
            speakerRole: 'Comms Lead, NovaAI',
            isClient: true,
            timestamp: '07:30',
            text: "What happens if Bloomberg passes on the exclusive? Do we have a fast backup? We cannot afford to slip past the October 8th window.",
            sentiment: 'neutral'
          },
          {
            id: 'seg-5',
            speaker: 'Marcus Vance',
            speakerRole: 'Agency Tech Lead',
            isClient: false,
            timestamp: '08:50',
            text: "We will give Bloomberg a 24-hour acceptance window. If they don't lock it in, we immediately pivot to Reuters and Wall Street Journal Pro Venture, then lift to TechCrunch and Forbes simultaneously.",
            sentiment: 'positive'
          }
        ]
      },
      {
        id: 'part-1-2',
        partNumber: 2,
        title: 'Spokesperson Prep & Sensitive Valuation Questions',
        duration: '21 mins',
        segments: [
          {
            id: 'seg-6',
            speaker: 'Dr. Sarah Lin',
            speakerRole: 'CMO, NovaAI',
            isClient: true,
            timestamp: '19:20',
            text: "One red line from our CFO: reporters will inevitably ask about our GPU cluster burn rate and whether we are profitable at the gross margin level. How do we guide our CEO to answer without sounding defensive?",
            sentiment: 'urgent'
          },
          {
            id: 'seg-7',
            speaker: 'Marcus Vance',
            speakerRole: 'Agency Tech Lead',
            isClient: false,
            timestamp: '21:05',
            text: "We bridge to unit economics and customer retention. The soundbite should be: 'We have chosen to invest aggressively in foundational capability because our Net Revenue Retention across Fortune 100 pilots exceeds 140%.' We don't comment on specific GPU depreciation.",
            sentiment: 'positive'
          },
          {
            id: 'seg-8',
            speaker: 'Alex Rivera',
            speakerRole: 'Comms Lead, NovaAI',
            isClient: true,
            timestamp: '24:10',
            text: "I like that framing. It turns a potential capital expenditure risk into proof of compounding enterprise adoption.",
            sentiment: 'positive'
          },
          {
            id: 'seg-9',
            speaker: 'Elena Rostova',
            speakerRole: 'Agency Partner',
            isClient: false,
            timestamp: '26:40',
            text: "We will also prepare a 2-page rapid response pocket card for the CEO to review 10 minutes prior to the briefing.",
            sentiment: 'neutral'
          }
        ]
      },
      {
        id: 'part-1-3',
        partNumber: 3,
        title: 'Timeline, Media Kit Assets & Signoffs',
        duration: '13 mins',
        segments: [
          {
            id: 'seg-10',
            speaker: 'Alex Rivera',
            speakerRole: 'Comms Lead, NovaAI',
            isClient: true,
            timestamp: '40:15',
            text: "For the media kit: we have high-res executive headshots, customer quote cards from Siemens and Pfizer, and a 45-second product demo video without background music so broadcast TV can edit it.",
            sentiment: 'positive'
          },
          {
            id: 'seg-11',
            speaker: 'Marcus Vance',
            speakerRole: 'Agency Tech Lead',
            isClient: false,
            timestamp: '42:50',
            text: "Perfect. We will package those in an unlisted media room with password protection and share the preview link with you by tomorrow afternoon.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-2',
    meetingId: 'meet-2',
    clientId: 'client-2',
    clientName: 'Helion Energy Grid',
    title: 'Clean Energy Fusion Whitepaper Rollout & Policy Desk Pitching',
    date: '2026-09-12T11:00:00Z',
    totalDuration: '45 mins',
    participants: ['Elena Rostova (Agency)', 'Julian Montgomery (Helion VP Comms)', 'Dr. Arthur Sterling (Chief Scientist)'],
    hasAttachment: true,
    keyTakeaways: [
      'Targeting Axios Generate, Politico Energy, and WSJ Climate desks.',
      'Scientific data needs to be translated into understandable grid reliability terms for policymakers.',
      'Plan an invitation-only background breakfast for Washington energy reporters next month.'
    ],
    actionItems: [
      { id: 'act-4', task: 'Draft Politico Pro and Axios Generate embargo letters', assignee: 'Elena Rostova', completed: true },
      { id: 'act-5', task: 'Provide simplified 1-page grid stability explainer graphic', assignee: 'Julian Montgomery', completed: false }
    ],
    parts: [
      {
        id: 'part-2-1',
        partNumber: 1,
        title: 'Scientific Validation vs Regulatory Framing',
        duration: '22 mins',
        segments: [
          {
            id: 'seg-12',
            speaker: 'Julian Montgomery',
            speakerRole: 'VP Comms, Helion',
            isClient: true,
            timestamp: '01:10',
            text: "Our challenge with the whitepaper is that trade media gets lost in magnetic confinement plasma physics. We need mainstream outlets to focus on commercial grid interconnectivity by 2029.",
            sentiment: 'urgent'
          },
          {
            id: 'seg-13',
            speaker: 'Elena Rostova',
            speakerRole: 'Agency Partner',
            isClient: false,
            timestamp: '03:40',
            text: "Exactly. The headline is not the magnet coil resistance; the headline is zero-carbon baseload power directly co-located with AI hyperscale data centers.",
            sentiment: 'positive'
          },
          {
            id: 'seg-14',
            speaker: 'Dr. Arthur Sterling',
            speakerRole: 'Chief Scientist, Helion',
            isClient: true,
            timestamp: '07:20',
            text: "I am fine with that as long as we don't overpromise net-electricity timing. Keep the technical claims strictly grounded in our peer-reviewed milestone measurements.",
            sentiment: 'neutral'
          }
        ]
      },
      {
        id: 'part-2-2',
        partNumber: 2,
        title: 'DC Media Tour & Breakfast Briefing',
        duration: '23 mins',
        segments: [
          {
            id: 'seg-15',
            speaker: 'Elena Rostova',
            speakerRole: 'Agency Partner',
            isClient: false,
            timestamp: '23:15',
            text: "For the DC trip in October, we are reserving a private room at the Hay-Adams for an off-the-record backgrounder with 8 select energy and national security correspondents.",
            sentiment: 'positive'
          },
          {
            id: 'seg-16',
            speaker: 'Julian Montgomery',
            speakerRole: 'VP Comms, Helion',
            isClient: true,
            timestamp: '27:00',
            text: "Approved. Let's make sure we include Financial Times US Energy correspondent as well.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-3',
    meetingId: 'meet-3',
    clientId: 'client-3',
    clientName: 'Nimbus BioHealth',
    title: 'FDA Phase II Clinical Trial Results & Embargo Protocol',
    date: '2026-09-08T15:30:00Z',
    totalDuration: '38 mins',
    participants: ['Elena Rostova (Agency)', 'Claire Beauchamp (Nimbus Director Comms)', 'Dr. Alan Ross (Chief Medical Officer)'],
    hasAttachment: true,
    keyTakeaways: [
      'Primary endpoint met with statistical significance (p < 0.001); secondary safety profile clean.',
      'Coordinate coordinated release between SEC 8-K filing and press release at 7:00 AM ET.',
      'Offer advance embargoed access to Stat News (Matthew Herper) and Endpoints News.'
    ],
    actionItems: [
      { id: 'act-6', task: 'Align press release wording exactly with SEC 8-K disclosure', assignee: 'Claire Beauchamp', completed: true },
      { id: 'act-7', task: 'Pitch Stat News and Endpoints under signed embargo agreement', assignee: 'Elena Rostova', completed: true }
    ],
    parts: [
      {
        id: 'part-3-1',
        partNumber: 1,
        title: 'Clinical Data Interpretation & SEC Compliance',
        duration: '20 mins',
        segments: [
          {
            id: 'seg-17',
            speaker: 'Dr. Alan Ross',
            speakerRole: 'CMO, Nimbus',
            isClient: true,
            timestamp: '02:00',
            text: "The p-value is 0.0008, well beyond our target. However, legal insists the press release cannot use words like 'cure' or 'revolutionary'. Stick strictly to 'statistically significant biomarker reduction'.",
            sentiment: 'neutral'
          },
          {
            id: 'seg-18',
            speaker: 'Elena Rostova',
            speakerRole: 'Agency Partner',
            isClient: false,
            timestamp: '04:15',
            text: "Understood. The biotech press actually prefers measured scientific precision over marketing hype. We will emphasize the 42% reduction in cognitive decline over 24 weeks.",
            sentiment: 'positive'
          }
        ]
      },
      {
        id: 'part-3-2',
        partNumber: 2,
        title: 'Media Embargo Timetable & Broadcast Interviews',
        duration: '18 mins',
        segments: [
          {
            id: 'seg-19',
            speaker: 'Claire Beauchamp',
            speakerRole: 'Comms Director, Nimbus',
            isClient: true,
            timestamp: '21:30',
            text: "CNBC Squawk Box reached out through our lead investor. Can we get Dr. Ross on live at 7:45 AM ET on launch day?",
            sentiment: 'positive'
          },
          {
            id: 'seg-20',
            speaker: 'Elena Rostova',
            speakerRole: 'Agency Partner',
            isClient: false,
            timestamp: '23:50',
            text: "Yes, we will confirm the live satellite truck feed to his office. We will run a 20-minute teleprompter rehearsal the afternoon before.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-4',
    meetingId: 'meet-4',
    clientId: 'client-4',
    clientName: 'CyberShield Zero',
    title: 'Q3 Ransomware Threat Intelligence Report Media Launch',
    date: '2026-09-04T10:00:00Z',
    totalDuration: '40 mins',
    participants: ['Marcus Vance (Agency)', 'Alex Vance (CyberShield Brand Lead)', 'Sarah Jenkins (Threat Intel Director)'],
    hasAttachment: true,
    keyTakeaways: [
      'Report shows 310% surge in automated AI-orchestrated identity extortion.',
      'Pitch Dark Reading, BleepingComputer, Forbes Cybersecurity, and WSJ Pro Cybersecurity.',
      'Create interactive data visualizations for journalists to embed in articles.'
    ],
    actionItems: [
      { id: 'act-8', task: 'Draft threat briefing pitches with tailored industry hooks (Healthcare, Finance)', assignee: 'Marcus Vance', completed: true },
      { id: 'act-9', task: 'Export chart assets in SVG and 300dpi PNG for newsrooms', assignee: 'Alex Vance', completed: true }
    ],
    parts: [
      {
        id: 'part-4-1',
        partNumber: 1,
        title: 'Threat Intel Hooks & Data Exclusives',
        duration: '22 mins',
        segments: [
          {
            id: 'seg-21',
            speaker: 'Sarah Jenkins',
            speakerRole: 'Threat Intel, CyberShield',
            isClient: true,
            timestamp: '01:30',
            text: "The standout statistic is that attackers are using localized LLMs to generate bespoke phishing emails in 14 languages within 3 seconds of scraping an employee's LinkedIn.",
            sentiment: 'urgent'
          },
          {
            id: 'seg-22',
            speaker: 'Marcus Vance',
            speakerRole: 'Agency Tech Lead',
            isClient: false,
            timestamp: '03:45',
            text: "That is our lead hook for WIRED and The Register. We should lead the pitch subject line with: 'New Data: AI-generated spear-phishing hits 4,000 attacks/minute'.",
            sentiment: 'positive'
          }
        ]
      },
      {
        id: 'part-4-2',
        partNumber: 2,
        title: 'BlackHat & DEFCON Spillover Strategy',
        duration: '18 mins',
        segments: [
          {
            id: 'seg-23',
            speaker: 'Alex Vance',
            speakerRole: 'Brand Lead, CyberShield',
            isClient: true,
            timestamp: '24:00',
            text: "Let's make sure we offer our researchers for on-the-record commentary anytime a high-profile breach hits the news cycle over the next 60 days.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-5',
    meetingId: 'meet-5',
    clientId: 'client-5',
    clientName: 'Astra Robotics',
    title: 'Warehouse Humanoid Commercial Pilot Press Strategy',
    date: '2026-08-27T16:00:00Z',
    totalDuration: '48 mins',
    participants: ['Marcus Vance (Agency)', 'Kenji Sato (Astra CSO)', 'Maya Thorne (Astra Head of PR)'],
    hasAttachment: false,
    keyTakeaways: [
      'Focus coverage on worker safety and ergonomics rather than job displacement.',
      'Engage CBS Sunday Morning and WSJ Tech video team for on-site factory tour.',
      'Strict protocol on filming restrictions around client facility brand names.'
    ],
    actionItems: [
      { id: 'act-10', task: 'Draft b-roll filming protocol agreement for video crews', assignee: 'Maya Thorne', completed: true },
      { id: 'act-11', task: 'Pitch WSJ Video tech producer with exclusive factory footage preview', assignee: 'Marcus Vance', completed: true }
    ],
    parts: [
      {
        id: 'part-5-1',
        partNumber: 1,
        title: 'Framing Automation: Augmentation vs Replacement',
        duration: '25 mins',
        segments: [
          {
            id: 'seg-24',
            speaker: 'Kenji Sato',
            speakerRole: 'CSO, Astra',
            isClient: true,
            timestamp: '02:30',
            text: "We know union organizers and mainstream media will look for a 'robots take our jobs' headline. Our pilot specifically handles repetitive heavy lifting above 45 lbs.",
            sentiment: 'urgent'
          },
          {
            id: 'seg-25',
            speaker: 'Marcus Vance',
            speakerRole: 'Agency Tech Lead',
            isClient: false,
            timestamp: '05:10',
            text: "We will frame the story around 'eliminating chronic spinal injury in heavy logistics'. We should have the factory floor safety manager quoted alongside your CEO.",
            sentiment: 'positive'
          }
        ]
      },
      {
        id: 'part-5-2',
        partNumber: 2,
        title: 'Video B-Roll Distribution & TV Placement',
        duration: '23 mins',
        segments: [
          {
            id: 'seg-26',
            speaker: 'Maya Thorne',
            speakerRole: 'Head of PR, Astra',
            isClient: true,
            timestamp: '26:40',
            text: "We have 4K 60fps footage of the robots sorting packages during graveyard shifts. The motion smoothness is incredible.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-6',
    meetingId: 'meet-6',
    clientId: 'client-6',
    clientName: 'Lumina FinTech',
    title: 'Cross-Border B2B Settlement Engine UK & US Media Push',
    date: '2026-08-20T13:00:00Z',
    totalDuration: '35 mins',
    participants: ['David Kalu (Agency)', 'Priya Sharma (Lumina VP Comms)', 'Sean O’Connor (Head of Treasury)'],
    hasAttachment: true,
    keyTakeaways: [
      'Position Lumina as the modern alternative to SWIFT correspondent banking delays.',
      'Op-ed by CEO on the hidden $40B annual foreign exchange tax paid by mid-sized exporters.',
      'Target Financial Times Alphaville and City A.M. in London.'
    ],
    actionItems: [
      { id: 'act-12', task: 'Pitch FT opinion editor with CEO draft op-ed', assignee: 'David Kalu', completed: true },
      { id: 'act-13', task: 'Verify treasury fee data points with compliance counsel', assignee: 'Sean O’Connor', completed: true }
    ],
    parts: [
      {
        id: 'part-6-1',
        partNumber: 1,
        title: 'FT Op-Ed Angle & Tone Calibration',
        duration: '35 mins',
        segments: [
          {
            id: 'seg-27',
            speaker: 'Priya Sharma',
            speakerRole: 'VP Comms, Lumina',
            isClient: true,
            timestamp: '03:15',
            text: "Our CEO's op-ed needs to feel authoritative and macroeconomic, not like a sales brochure for Lumina's API.",
            sentiment: 'positive'
          },
          {
            id: 'seg-28',
            speaker: 'David Kalu',
            speakerRole: 'Agency Corporate Lead',
            isClient: false,
            timestamp: '06:20',
            text: "We stripped out all product mentions. The narrative focuses squarely on fragmented liquidity in transatlantic supply chains. That gives us high odds with the FT editors.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-7',
    meetingId: 'meet-7',
    clientId: 'client-7',
    clientName: 'Aetheria Luxury Goods',
    title: 'Paris Fashion Week Sustainable Runway Preview & Vogue Pitch',
    date: '2026-08-14T15:00:00Z',
    totalDuration: '42 mins',
    participants: ['Sophia Chen (Agency)', 'Camille Laurent (Brand Director)', 'Hélène Dupuis (Lead Designer)'],
    hasAttachment: true,
    keyTakeaways: [
      'Curate VIP guest list of 15 senior fashion journalists and style editors.',
      'Provide organic lab-grown silk tactile swatch kits in editor gift boxes.',
      'Secured exclusive behind-the-scenes fitting access for British Vogue.'
    ],
    actionItems: [
      { id: 'act-14', task: 'Send engraved invitations to Vogue, Harper’s Bazaar, and WWD editors', assignee: 'Sophia Chen', completed: true },
      { id: 'act-15', task: 'Deliver swatch materials kit to London agency office', assignee: 'Camille Laurent', completed: true }
    ],
    parts: [
      {
        id: 'part-7-1',
        partNumber: 1,
        title: 'Editor Invitations & Seating Tiering',
        duration: '20 mins',
        segments: [
          {
            id: 'seg-29',
            speaker: 'Camille Laurent',
            speakerRole: 'Brand Director, Aetheria',
            isClient: true,
            timestamp: '02:00',
            text: "Front row seating is limited to 18 slots. How should we allocate between print editors vs high-credibility digital critics?",
            sentiment: 'neutral'
          },
          {
            id: 'seg-30',
            speaker: 'Sophia Chen',
            speakerRole: 'Agency Lifestyle Lead',
            isClient: false,
            timestamp: '05:30',
            text: "Give 10 seats to tier-1 masthead editors (Vogue, Elle, BoF, WWD) and 8 seats to top cultural essayists who write deep substacks on luxury sustainability.",
            sentiment: 'positive'
          }
        ]
      },
      {
        id: 'part-7-2',
        partNumber: 2,
        title: 'Material Science Storytelling',
        duration: '22 mins',
        segments: [
          {
            id: 'seg-31',
            speaker: 'Hélène Dupuis',
            speakerRole: 'Designer, Aetheria',
            isClient: true,
            timestamp: '22:15',
            text: "The garments literally decompose in home soil within 90 days without toxic microfibers. That contrast with fast fashion is our purest headline.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-8',
    meetingId: 'meet-8',
    clientId: 'client-8',
    clientName: 'Veritas Health Analytics',
    title: 'New Client Pitch: Strategic Vision & Multi-Tier Agency Scope',
    date: '2026-08-25T14:30:00Z',
    totalDuration: '50 mins',
    participants: ['Elena Rostova (Agency)', 'Marcus Vance (Agency)', 'Dr. Robert Zimmerman (Veritas CEO)', 'Rachel Cole (VP Growth)'],
    hasAttachment: true,
    keyTakeaways: [
      'Veritas seeking agency of record to transition from clinical obscurity to prominent AI healthcare brand.',
      'Needs crisis prep for patient privacy debates alongside aggressive growth PR.',
      'Elena proposed $25k/month comprehensive scope including FDA clearance campaign.'
    ],
    actionItems: [
      { id: 'act-16', task: 'Submit revised scope document incorporating HIPAA audit clause', assignee: 'Elena Rostova', completed: true },
      { id: 'act-17', task: 'Provide 3 client reference contacts in adjacent BioTech spaces', assignee: 'Marcus Vance', completed: true }
    ],
    parts: [
      {
        id: 'part-8-1',
        partNumber: 1,
        title: 'Agency Capabilities Presentation',
        duration: '25 mins',
        segments: [
          {
            id: 'seg-32',
            speaker: 'Elena Rostova',
            speakerRole: 'Agency Partner',
            isClient: false,
            timestamp: '04:00',
            text: "Welcome Dr. Zimmerman. Over the past four years, our health practice has driven over 400 tier-1 features, including front-page coverage in the Wall Street Journal and live segments on CNBC.",
            sentiment: 'positive'
          },
          {
            id: 'seg-33',
            speaker: 'Dr. Robert Zimmerman',
            speakerRole: 'CEO, Veritas',
            isClient: true,
            timestamp: '08:40',
            text: "Our previous agency simply could not comprehend our algorithmic diagnostic models. They kept pitching local newspapers when we needed clinical cardiologists to read about us in trade journals.",
            sentiment: 'urgent'
          }
        ]
      },
      {
        id: 'part-8-2',
        partNumber: 2,
        title: 'Commercial Terms & Deliverables Review',
        duration: '25 mins',
        segments: [
          {
            id: 'seg-34',
            speaker: 'Marcus Vance',
            speakerRole: 'Agency Tech Lead',
            isClient: false,
            timestamp: '27:10',
            text: "Our retainer covers 2 major product/study launches per quarter, guaranteed minimum 6 tier-1 media placements, full crisis standby, and monthly investor relations briefing packs.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-9',
    meetingId: 'meet-9',
    clientId: 'client-9',
    clientName: 'QuantumScale Chips',
    title: 'RFP Pitch: Semiconductor Foundry Partnerships & US CHIPS Act Narrative',
    date: '2026-09-03T11:00:00Z',
    totalDuration: '55 mins',
    participants: ['Marcus Vance (Agency)', 'Elena Rostova (Agency)', 'Tanya Morales (QuantumScale VP Strategy)', 'Dr. Victor Chen (CTO)'],
    hasAttachment: true,
    keyTakeaways: [
      'QuantumScale competing for $450M US CHIPS Act funding round.',
      'PR goal: establish QuantumScale as national security imperative and domestic semiconductor champion.',
      'Competitor agency gave a generic pitch; our Washington policy contacts were a decisive differentiator.'
    ],
    actionItems: [
      { id: 'act-18', task: 'Refine RFP response to showcase bipartisan Beltway press relationships', assignee: 'Marcus Vance', completed: true },
      { id: 'act-19', task: 'Follow up with board references by Friday morning', assignee: 'Elena Rostova', completed: false }
    ],
    parts: [
      {
        id: 'part-9-1',
        partNumber: 1,
        title: 'Geopolitical Semiconductor Framing',
        duration: '30 mins',
        segments: [
          {
            id: 'seg-35',
            speaker: 'Tanya Morales',
            speakerRole: 'VP Strategy, QuantumScale',
            isClient: true,
            timestamp: '03:30',
            text: "Our board wants to know: can you get our CTO on Meet the Press or Face the Nation when the Congressional semiconductor subcommittee convenes next month?",
            sentiment: 'urgent'
          },
          {
            id: 'seg-36',
            speaker: 'Elena Rostova',
            speakerRole: 'Agency Partner',
            isClient: false,
            timestamp: '06:00',
            text: "We placed the CEO of Helion on CNBC and Bloomberg TV three times this year. Our DC media relations partner specializes specifically in high-stakes committee testimony and Sunday political talk shows.",
            sentiment: 'positive'
          }
        ]
      },
      {
        id: 'part-9-2',
        partNumber: 2,
        title: 'Draft Campaign Roadmap & Budgeting',
        duration: '25 mins',
        segments: [
          {
            id: 'seg-37',
            speaker: 'Marcus Vance',
            speakerRole: 'Agency Tech Lead',
            isClient: false,
            timestamp: '32:15',
            text: "We have mapped out a 90-day sprint leading straight to the Commerce Department award window.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-10',
    meetingId: 'meet-10',
    clientId: 'client-1',
    clientName: 'NovaAI Systems',
    title: 'Emergency Crisis PR: Hallucination Bug in Enterprise Customer Pilot',
    date: '2026-07-19T08:30:00Z',
    totalDuration: '44 mins',
    participants: ['David Kalu (Agency)', 'Marcus Vance (Agency)', 'Dr. Sarah Lin (NovaAI CMO)', 'Jonathan Hayes (CEO)'],
    hasAttachment: false,
    keyTakeaways: [
      'Customer internal leak on Reddit regarding false financial forecasts produced by model.',
      'Agreed on immediate transparent post-mortem blog post before Bloomberg catches wind.',
      'Provided CEO statement acknowledging boundary condition and rollout of automated sanity-check guardrails.'
    ],
    actionItems: [
      { id: 'act-20', task: 'Draft proactive engineering transparency statement', assignee: 'David Kalu', completed: true },
      { id: 'act-21', task: 'Pre-brief trusted reporters at The Information and TechCrunch under background', assignee: 'Marcus Vance', completed: true }
    ],
    parts: [
      {
        id: 'part-10-1',
        partNumber: 1,
        title: 'Situation Assessment & Leak Containment',
        duration: '20 mins',
        segments: [
          {
            id: 'seg-38',
            speaker: 'Jonathan Hayes',
            speakerRole: 'CEO, NovaAI',
            isClient: true,
            timestamp: '01:00',
            text: "A tester posted a screenshot of an erroneous hallucination on Hacker News and it is currently ranked #3. Two reporters from The Verge have already reached out for comment.",
            sentiment: 'urgent'
          },
          {
            id: 'seg-39',
            speaker: 'David Kalu',
            speakerRole: 'Crisis Lead, Agency',
            isClient: false,
            timestamp: '03:15',
            text: "Do not issue a standard 'no comment'. In tech crisis communications, silence is parsed as culpability. We need an immediate factual engineering response within 60 minutes.",
            sentiment: 'urgent'
          },
          {
            id: 'seg-40',
            speaker: 'Dr. Sarah Lin',
            speakerRole: 'CMO, NovaAI',
            isClient: true,
            timestamp: '06:40',
            text: "Our engineering team already deployed the hotfix at 4 AM this morning. It only affected 3 accounts in sandbox mode, never live production data.",
            sentiment: 'neutral'
          },
          {
            id: 'seg-41',
            speaker: 'David Kalu',
            speakerRole: 'Crisis Lead, Agency',
            isClient: false,
            timestamp: '08:00',
            text: "That is your lead fact. 'Sandbox environment isolated, hotfix deployed in 3 hours, zero production impact.' That kills the negative story in one news cycle.",
            sentiment: 'positive'
          }
        ]
      },
      {
        id: 'part-10-2',
        partNumber: 2,
        title: 'Media Rapid Response Coordination',
        duration: '24 mins',
        segments: [
          {
            id: 'seg-42',
            speaker: 'Marcus Vance',
            speakerRole: 'Agency Tech Lead',
            isClient: false,
            timestamp: '22:30',
            text: "I am responding to The Verge and Hacker News moderators directly with the verified statement.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-11',
    meetingId: 'meet-11',
    clientId: 'client-10',
    clientName: 'GreenWave Marine',
    title: 'Nordic Clean Maritime Transition Pitch & US Debut Scoping',
    date: '2026-09-02T13:00:00Z',
    totalDuration: '36 mins',
    participants: ['David Kalu (Agency)', 'Goran Lindqvist (GreenWave MD)', 'Astrid Blom (Head of Sustainability)'],
    hasAttachment: true,
    keyTakeaways: [
      'GreenWave seeking to launch US ferry electrification pilots in Seattle and San Francisco.',
      'Pitch US CleanTech media and maritime trade journals.',
      'Target features in Fast Company World Changing Ideas.'
    ],
    actionItems: [
      { id: 'act-22', task: 'Prepare pitch angle for Seattle Times and Puget Sound Business Journal', assignee: 'David Kalu', completed: false }
    ],
    parts: [
      {
        id: 'part-11-1',
        partNumber: 1,
        title: 'Pacific Northwest Pilot Positioning',
        duration: '36 mins',
        segments: [
          {
            id: 'seg-43',
            speaker: 'Goran Lindqvist',
            speakerRole: 'Managing Director, GreenWave',
            isClient: true,
            timestamp: '02:45',
            text: "Washington State Ferries is the largest ferry system in the US. Our Gothenburg pilot proved 80% diesel fuel displacement.",
            sentiment: 'positive'
          },
          {
            id: 'seg-44',
            speaker: 'David Kalu',
            speakerRole: 'Agency Corporate Lead',
            isClient: false,
            timestamp: '05:10',
            text: "That is an irresistible regional news story. We can pit Washington state against Scandinavia on green transit leadership.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-12',
    meetingId: 'meet-12',
    clientId: 'client-2',
    clientName: 'Helion Energy Grid',
    title: 'Series D Milestone Retrospective & Investor Comms Review',
    date: '2026-07-28T14:00:00Z',
    totalDuration: '40 mins',
    participants: ['Elena Rostova (Agency)', 'Julian Montgomery (Helion VP Comms)'],
    hasAttachment: false,
    keyTakeaways: [
      'WSJ front page feature drove 14 inbound sovereign wealth fund inquiries.',
      'Next quarter needs more employee spotlight stories to aid engineering recruitment.',
      'Agency team rewarded with bonus scope for Q4.'
    ],
    actionItems: [
      { id: 'act-23', task: 'Draft MIT Technology Review exclusive feature on magnet engineers', assignee: 'Elena Rostova', completed: true }
    ],
    parts: [
      {
        id: 'part-12-1',
        partNumber: 1,
        title: 'Coverage Analytics & Pipeline Impact',
        duration: '40 mins',
        segments: [
          {
            id: 'seg-45',
            speaker: 'Julian Montgomery',
            speakerRole: 'VP Comms, Helion',
            isClient: true,
            timestamp: '03:00',
            text: "Elena, the WSJ piece was a masterclass. Our CEO received calls from two energy ministers in Europe within hours of publication.",
            sentiment: 'positive'
          },
          {
            id: 'seg-46',
            speaker: 'Elena Rostova',
            speakerRole: 'Agency Partner',
            isClient: false,
            timestamp: '06:15',
            text: "Thank you Julian. The timing right before the G7 clean energy summit gave it maximum international lift.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-13',
    meetingId: 'meet-13',
    clientId: 'client-4',
    clientName: 'CyberShield Zero',
    title: 'Executive Podcast Tour: Prep for Lex Fridman & Risky Business',
    date: '2026-06-15T11:00:00Z',
    totalDuration: '46 mins',
    participants: ['Marcus Vance (Agency)', 'Alex Vance (Brand Lead)', 'Dmitri Volkov (Founder & Chief Hacker)'],
    hasAttachment: true,
    keyTakeaways: [
      'Dmitri confirmed for 2-hour interview on Risky Business and pitching Lex Fridman.',
      'Coached on speaking plainly without acronym overload (SIEM, SOAR, EDR, XDR).',
      'Story arc: from teenager dissecting Soviet satellite feeds to protecting global power grids.'
    ],
    actionItems: [
      { id: 'act-24', task: 'Compile soundbite cheat-sheet for Dmitri', assignee: 'Marcus Vance', completed: true }
    ],
    parts: [
      {
        id: 'part-13-1',
        partNumber: 1,
        title: 'Storytelling Arc & Personal Vulnerability',
        duration: '24 mins',
        segments: [
          {
            id: 'seg-47',
            speaker: 'Marcus Vance',
            speakerRole: 'Agency Tech Lead',
            isClient: false,
            timestamp: '04:10',
            text: "Dmitri, long-form podcast listeners don't tune in for corporate soundbites. They want the human story of when you first realized critical infrastructure had zero security passwords.",
            sentiment: 'positive'
          },
          {
            id: 'seg-48',
            speaker: 'Dmitri Volkov',
            speakerRole: 'Founder, CyberShield',
            isClient: true,
            timestamp: '07:30',
            text: "I can talk about the 2019 blackouts in Ukraine when we were on the front lines analyzing the wiper malware. That changed my entire philosophy.",
            sentiment: 'positive'
          }
        ]
      },
      {
        id: 'part-13-2',
        partNumber: 2,
        title: 'Handling Controversial Geopolitical Questions',
        duration: '22 mins',
        segments: [
          {
            id: 'seg-49',
            speaker: 'Alex Vance',
            speakerRole: 'Brand Lead, CyberShield',
            isClient: true,
            timestamp: '25:00',
            text: "Podcasters will ask about state-sponsored cyber warfare. We have to be careful not to reveal sensitive ongoing government engagements.",
            sentiment: 'urgent'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-14',
    meetingId: 'meet-14',
    clientId: 'client-6',
    clientName: 'Lumina FinTech',
    title: 'European Banking License Acquisition & Brussels Policy Briefing',
    date: '2026-07-09T16:00:00Z',
    totalDuration: '39 mins',
    participants: ['David Kalu (Agency)', 'Priya Sharma (VP Comms)', 'Henrik Van Der Meer (Chief Legal Officer)'],
    hasAttachment: false,
    keyTakeaways: [
      'Dutch Central Bank (DNB) granted full EMI authorization.',
      'Coordinate coordinated release across Reuters, Les Echos, and Handelsblatt.',
      'Highlight compliance with new EU Instant Payments Regulation.'
    ],
    actionItems: [
      { id: 'act-25', task: 'Distribute French and German translated releases to Paris and Frankfurt news desks', assignee: 'David Kalu', completed: true }
    ],
    parts: [
      {
        id: 'part-14-1',
        partNumber: 1,
        title: 'Multilingual European Media Strategy',
        duration: '39 mins',
        segments: [
          {
            id: 'seg-50',
            speaker: 'Henrik Van Der Meer',
            speakerRole: 'CLO, Lumina',
            isClient: true,
            timestamp: '03:30',
            text: "Having the European banking license eliminates our last regulatory barrier to serving enterprise DAX 40 clients in Germany.",
            sentiment: 'positive'
          },
          {
            id: 'seg-51',
            speaker: 'David Kalu',
            speakerRole: 'Agency Corporate Lead',
            isClient: false,
            timestamp: '06:00',
            text: "We will run targeted outreach with Handelsblatt financial markets reporters. German B2B decision makers respond strongly to local compliance endorsements.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  },
  {
    id: 'tr-15',
    meetingId: 'meet-15',
    clientId: 'client-3',
    clientName: 'Nimbus BioHealth',
    title: 'Advisory Board Announcement & Scientific Media Briefing',
    date: '2026-06-03T10:00:00Z',
    totalDuration: '33 mins',
    participants: ['Elena Rostova (Agency)', 'Claire Beauchamp (Director Comms)', 'Dr. Jennifer Wu (Advisory Chair)'],
    hasAttachment: true,
    keyTakeaways: [
      'Two Nobel laureates joined scientific advisory board.',
      'Biotech press loves pedigree announcements; pitch BioCentury and Nature Biotechnology.',
      'Coordinate photo shoot for advisory board profile feature.'
    ],
    actionItems: [
      { id: 'act-26', task: 'Coordinate executive portraits for Nobel laureates', assignee: 'Claire Beauchamp', completed: true },
      { id: 'act-27', task: 'Pitch BioCentury weekly analysis column', assignee: 'Elena Rostova', completed: true }
    ],
    parts: [
      {
        id: 'part-15-1',
        partNumber: 1,
        title: 'Nobel Laureate Credentials & Scientific Rigor',
        duration: '33 mins',
        segments: [
          {
            id: 'seg-52',
            speaker: 'Dr. Jennifer Wu',
            speakerRole: 'Advisory Chair, Nimbus',
            isClient: true,
            timestamp: '04:00',
            text: "Our announcement should highlight why these world-class geneticists chose to dedicate their time to Nimbus over the dozen other biotechs competing for them.",
            sentiment: 'positive'
          },
          {
            id: 'seg-53',
            speaker: 'Elena Rostova',
            speakerRole: 'Agency Partner',
            isClient: false,
            timestamp: '07:15',
            text: "We will craft the story around scientific conviction in your novel mRNA targeting mechanism. That gives reporters a legitimate scientific breakthrough narrative.",
            sentiment: 'positive'
          }
        ]
      }
    ]
  }
]
