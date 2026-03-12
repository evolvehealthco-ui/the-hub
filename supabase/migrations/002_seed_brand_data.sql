-- Seed Elizabeth's brand data from Voice Engine analysis

-- Brand Profile
INSERT INTO brand_profile (id, business_name, tagline, origin_story, mission, values, brand_personality_keywords, credentials, key_stats)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Elizabeth Campbell',
  'Wellness isn''t a destination â it''s how you show up every day.',
  'Former corporate burnout turned holistic health advocate. After transforming my own relationship with fitness, nutrition, and mindset, I now help other women build sustainable wellness practices rooted in science and self-compassion.',
  'Make fitness accessible, science-backed, and judgment-free for women at every stage of their journey.',
  'Evidence over trends. Community over competition. Progress over perfection. Showing up over showing off.',
  ARRAY['Warm', 'Direct', 'Evidence-based', 'Encouraging', 'No-BS', 'Real'],
  E'NASM-CPT (Certified Personal Trainer)\nNutrition Coaching Certification\nBreathwork Facilitator Training',
  E'500+ women coached\n3+ years of consistent content creation\n72K+ words of analyzed brand content'
);

-- Voice Rules
INSERT INTO voice_rules (brand_profile_id, signature_phrases, language_to_use, language_to_avoid, sentence_style, emotional_tone)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  ARRAY['Here''s the thing...', 'Let me be real with you...', 'This isn''t about perfection â it''s about showing up.'],
  'Second person (''you''), conversational, direct, action-oriented. Short punchy sentences mixed with longer flowing ones.',
  'Jargon, ''just'' (minimizing), ''guilty pleasure'', diet culture language, toxic positivity, condescending tone',
  'Short punchy sentences mixed with longer flowing ones. Start paragraphs with bold statements. Use line breaks for pacing.',
  'Like a smart friend who''s been through it â not a lecturer, not a cheerleader. Warm but direct.'
);

-- Audience Profiles
INSERT INTO audience_profiles (brand_profile_id, name, demographics, pain_points, aspirations, language_they_use, is_default)
VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'Beginner Women',
  'Women 25-40, urban/suburban, health-curious but overwhelmed',
  'Overwhelmed by fitness info, inconsistent with routines, don''t know where to start, tired of starting and stopping',
  'Feel strong and confident, have a clear plan, belong to a community, stop second-guessing themselves',
  E'I don''t know what I''m doing.\nI always start and stop.\nI just want someone to tell me what to do.',
  true
),
(
  '00000000-0000-0000-0000-000000000001',
  'Postpartum Moms',
  'Women 28-38, 0-2 years postpartum',
  'Body feels unfamiliar, no time, guilt about self-care, pressure to ''bounce back''',
  'Feel like themselves again, sustainable routine, grace with the process',
  E'I just want to feel like me again.\nI have zero time.\nEveryone says to rest but I feel stuck.',
  false
);

-- Content Pillars
INSERT INTO content_pillars (brand_profile_id, name, description, target_ratio, color_hex, sort_order)
VALUES
('00000000-0000-0000-0000-000000000001', 'Health & Wellness', 'Fitness, nutrition, recovery, evidence-based health practices', 40, '#B5606B', 1),
('00000000-0000-0000-0000-000000000001', 'Personal Transformation', 'Mindset, habits, identity shifts, growth stories', 25, '#8B3A46', 2),
('00000000-0000-0000-0000-000000000001', 'Community & Connection', 'Events, group activities, building real relationships', 15, '#3D8E96', 3),
('00000000-0000-0000-0000-000000000001', 'Lifestyle & Travel', 'Daily routines, solo dates, travel, living fully', 20, '#6B7280', 4);

-- Offers
INSERT INTO offers (brand_profile_id, name, type, price_point, cta_text, status)
VALUES
('00000000-0000-0000-0000-000000000001', 'Free Glute Guide', 'lead_magnet', 'Free', 'Download Now', 'active'),
('00000000-0000-0000-0000-000000000001', '12-Week Coaching Program', 'service', '$$$', 'Book Your Call', 'active'),
('00000000-0000-0000-0000-000000000001', 'Weekend Wellness Retreats', 'event', '$$', 'Reserve Your Spot', 'active');

-- Autopilot Settings (default off)
INSERT INTO autopilot_settings (brand_profile_id, is_enabled, frequency, generation_day, generation_time, pieces_per_batch)
VALUES ('00000000-0000-0000-0000-000000000001', false, 'weekly', 'Sunday', '20:00', 7);
