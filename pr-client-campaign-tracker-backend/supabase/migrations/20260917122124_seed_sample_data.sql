-- =============================================
-- SEED SAMPLE DATA (Corrected)
-- =============================================

-- Clear existing data
truncate table public.campaign_screenshots cascade;
truncate table public.campaign_metrics cascade;
truncate table public.campaigns cascade;
truncate table public.transcript_action_items cascade;
truncate table public.transcript_segments cascade;
truncate table public.transcript_parts cascade;
truncate table public.transcripts cascade;
truncate table public.meeting_attendees cascade;
truncate table public.meetings cascade;
truncate table public.proposals cascade;
truncate table public.clients cascade;

-- We intentionally do NOT seed profiles here
-- because profiles are linked to auth.users
-- You will create the 4 team members (P, R, S, M) from the Auth dashboard

-- =============================================
-- CLIENTS (owner_id left null for now)
-- =============================================

insert into public.clients (
  id, name, company, status, industry, tier,
  primary_contact_name, primary_contact_email, primary_contact_title,
  retainer_monthly, joined_date, website, tags, notes
) values
  ('a1000000-0000-0000-0000-000000000001', 'NovaTech', 'NovaTech Solutions', 'active', 'SaaS', 'Enterprise',
   'Ananya Rao', 'ananya@novatech.io', 'CMO', 85000, '2025-03-12', 'https://novatech.io', array['tech','saas','enterprise'], 'Key strategic client.'),

  ('a1000000-0000-0000-0000-000000000002', 'GreenLeaf', 'GreenLeaf Organics', 'active', 'FMCG', 'Growth',
   'Vikram Singh', 'vikram@greenleaf.com', 'Founder', 45000, '2025-06-01', 'https://greenleaf.com', array['fmcg','organic','d2c'], null),

  ('a1000000-0000-0000-0000-000000000003', 'Finova', 'Finova Capital', 'prospect', 'Fintech', 'Enterprise',
   'Meera Kapoor', 'meera@finova.co', 'Head of Marketing', 0, '2026-01-15', 'https://finova.co', array['fintech','b2b'], 'In final proposal stage.'),

  ('a1000000-0000-0000-0000-000000000004', 'UrbanNest', 'UrbanNest Interiors', 'active', 'Home & Lifestyle', 'Boutique',
   'Kavita Desai', 'kavita@urbannest.in', 'CEO', 28000, '2025-09-20', 'https://urbannest.in', array['lifestyle','design'], null),

  ('a1000000-0000-0000-0000-000000000005', 'Pulse Health', 'Pulse Health Tech', 'churned', 'Healthtech', 'Growth',
   'Dr. Arjun Nair', 'arjun@pulsehealth.com', 'Co-founder', 0, '2024-11-05', 'https://pulsehealth.com', array['healthtech'], 'Contract ended Dec 2025.'),

  ('a1000000-0000-0000-0000-000000000006', 'CloudForge', 'CloudForge Systems', 'active', 'Cloud Infrastructure', 'Enterprise',
   'Sanjay Reddy', 'sanjay@cloudforge.io', 'VP Marketing', 120000, '2025-01-10', 'https://cloudforge.io', array['cloud','b2b','enterprise'], 'Largest retainer client.'),

  ('a1000000-0000-0000-0000-000000000007', 'Bloom Beauty', 'Bloom Beauty Co', 'prospect', 'Beauty', 'Growth',
   'Riya Malhotra', 'riya@bloombeauty.com', 'Brand Manager', 0, '2026-02-28', 'https://bloombeauty.com', array['beauty','d2c'], null),

  ('a1000000-0000-0000-0000-000000000008', 'EduSpark', 'EduSpark Learning', 'active', 'Edtech', 'Boutique',
   'Neha Joshi', 'neha@eduspark.in', 'Founder', 32000, '2025-07-18', 'https://eduspark.in', array['edtech','education'], null);

-- =============================================
-- MEETINGS
-- =============================================

insert into public.meetings (
  id, client_id, title, scheduled_at, duration_minutes, type, location, transcript_status, notes
) values
  ('b2000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Weekly Sync - Product Launch', '2026-09-10 11:00:00+05:30', 45, 'Weekly Sync', 'Zoom', 'has_transcript', 'Discussed launch timeline.'),
  ('b2000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Strategy & Messaging Workshop', '2026-09-05 15:00:00+05:30', 90, 'Strategy & Launch', 'Google Meet', 'has_transcript', null),
  ('b2000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'Monthly Performance Review', '2026-09-12 10:30:00+05:30', 60, 'Quarterly Review', 'Zoom', 'pending', null),
  ('b2000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000006', 'Crisis Advisory Call', '2026-09-08 16:00:00+05:30', 30, 'Crisis Advisory', 'Phone', 'has_transcript', null),
  ('b2000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000004', 'Creative Briefing', '2026-09-15 14:00:00+05:30', 45, 'Strategy & Launch', 'Zoom', 'none', null),
  ('b2000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 'Discovery Call', '2026-09-03 12:00:00+05:30', 40, 'Executive Onboarding', 'Google Meet', 'has_transcript', null),
  ('b2000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000008', 'Content Calendar Review', '2026-09-11 11:30:00+05:30', 30, 'Weekly Sync', 'Zoom', 'none', null);

-- =============================================
-- TRANSCRIPTS
-- =============================================

insert into public.transcripts (id, meeting_id, client_id, title, date, total_duration, participants, key_takeaways, source)
values (
  'c3000000-0000-0000-0000-000000000001',
  'b2000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'Weekly Sync - Product Launch',
  '2026-09-10',
  '45 mins',
  array['Priya Sharma', 'Ananya Rao', 'Rahul Mehta'],
  array['Finalize media list by Friday', 'Need 3 customer stories', 'Launch date confirmed for Oct 15'],
  'manual'
);

insert into public.transcript_parts (id, transcript_id, part_number, title, duration) values
  ('d4000000-0000-0000-0000-000000000001', 'c3000000-0000-0000-0000-000000000001', 1, 'Opening & Agenda', '12 mins'),
  ('d4000000-0000-0000-0000-000000000002', 'c3000000-0000-0000-0000-000000000001', 2, 'Media Strategy Discussion', '20 mins'),
  ('d4000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000001', 3, 'Action Items & Next Steps', '13 mins');

insert into public.transcript_segments (part_id, speaker, speaker_role, is_client, timestamp, text, sentiment) values
  ('d4000000-0000-0000-0000-000000000001', 'Priya Sharma', 'Account Lead', false, '00:01', 'Thanks everyone for joining. Today we will lock the final media list.', 'neutral'),
  ('d4000000-0000-0000-0000-000000000001', 'Ananya Rao', 'CMO', true, '00:45', 'Sounds good. We also need to decide on the embargo date.', 'neutral'),
  ('d4000000-0000-0000-0000-000000000002', 'Rahul Mehta', 'Media Manager', false, '12:10', 'I have shortlisted 28 journalists.', 'positive'),
  ('d4000000-0000-0000-0000-000000000003', 'Priya Sharma', 'Account Lead', false, '33:00', 'Action items: Rahul to share final list by Friday.', 'positive');

insert into public.transcript_action_items (transcript_id, task, assignee, completed) values
  ('c3000000-0000-0000-0000-000000000001', 'Share final media list', 'Rahul Mehta', false),
  ('c3000000-0000-0000-0000-000000000001', 'Provide 3 customer story contacts', 'Ananya Rao', false);

-- Second transcript
insert into public.transcripts (id, meeting_id, client_id, title, date, total_duration, participants, key_takeaways, source)
values (
  'c3000000-0000-0000-0000-000000000002',
  'b2000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000006',
  'Crisis Advisory Call',
  '2026-09-08',
  '28 mins',
  array['Priya Sharma', 'Sanjay Reddy'],
  array['Prepared holding statement', 'Monitoring social mentions'],
  'manual'
);

insert into public.transcript_parts (id, transcript_id, part_number, title, duration) values
  ('d4000000-0000-0000-0000-000000000004', 'c3000000-0000-0000-0000-000000000002', 1, 'Full Call', '28 mins');

insert into public.transcript_segments (part_id, speaker, speaker_role, is_client, timestamp, text, sentiment) values
  ('d4000000-0000-0000-0000-000000000004', 'Sanjay Reddy', 'VP Marketing', true, '00:20', 'We are seeing some negative threads on Twitter.', 'urgent'),
  ('d4000000-0000-0000-0000-000000000004', 'Priya Sharma', 'Account Lead', false, '01:15', 'I have already drafted a holding statement.', 'positive');

-- =============================================
-- CAMPAIGNS
-- =============================================

insert into public.campaigns (
  id, title, client_id, status, type, start_date, end_date, target_outlets, copy_text, tags
) values
  ('e5000000-0000-0000-0000-000000000001', 'NovaTech Product Launch - Media Outreach', 'a1000000-0000-0000-0000-000000000001', 'active', 'Product Launch', '2026-09-01', '2026-10-15',
   array['TechCrunch', 'YourStory', 'Inc42', 'Economic Times'], 
   'Exciting product launch outreach focused on AI features.', array['launch','tech']),

  ('e5000000-0000-0000-0000-000000000002', 'GreenLeaf Influencer + Lifestyle Push', 'a1000000-0000-0000-0000-000000000002', 'active', 'Brand Awareness', '2026-08-15', '2026-09-30',
   array['Vogue', 'Elle', 'Nykaa'], 
   'Lifestyle and influencer focused campaign.', array['influencer','lifestyle']),

  ('e5000000-0000-0000-0000-000000000003', 'CloudForge Thought Leadership', 'a1000000-0000-0000-0000-000000000006', 'completed', 'Thought Leadership', '2026-06-01', '2026-08-31',
   array['Forbes', 'Mint', 'Business Standard'], 
   'Executive bylines on cloud security.', array['b2b','thought-leadership']);

-- Campaign Metrics
insert into public.campaign_metrics (campaign_id, channel, pitched, impressions, opens, clicks, replies, coverage_secured, response_rate) values
  ('e5000000-0000-0000-0000-000000000001', 'Email Outreach', 42, 12500, 890, 156, 18, 7, 0.4286),
  ('e5000000-0000-0000-0000-000000000001', 'Twitter/X', 15, 8900, 0, 320, 9, 2, 0.6000),
  ('e5000000-0000-0000-0000-000000000002', 'Influencer Seeding', 28, 45000, 0, 2100, 12, 9, 0.4286),
  ('e5000000-0000-0000-0000-000000000003', 'Email Outreach', 35, 9800, 720, 95, 11, 5, 0.3143);