-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Content sections table for managing text content
CREATE TABLE content_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Product cards table for managing project cards
CREATE TABLE product_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  cycle_info TEXT,
  image_url TEXT,
  modal_content TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Site settings table for global configuration
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT NOT NULL DEFAULT 'text',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Row Level Security Policies
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Content sections policies
CREATE POLICY "Content sections are viewable by everyone" ON content_sections
  FOR SELECT USING (true);

CREATE POLICY "Content sections are editable by authenticated users" ON content_sections
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Content sections are insertable by authenticated users" ON content_sections
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Product cards policies
CREATE POLICY "Product cards are viewable by everyone" ON product_cards
  FOR SELECT USING (true);

CREATE POLICY "Product cards are editable by authenticated users" ON product_cards
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Product cards are insertable by authenticated users" ON product_cards
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Site settings policies
CREATE POLICY "Site settings are viewable by everyone" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Site settings are editable by authenticated users" ON site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Site settings are insertable by authenticated users" ON site_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert initial content sections
INSERT INTO content_sections (section_key, content, content_type) VALUES
  ('hero_title', 'Problems are the new APIs.<br/>Ethiopia is our stack.', 'html'),
  ('hero_subtitle', 'We take unreliable infrastructure, paper-based systems, and low-trust markets — and write code on top of it.<br/>AI is our multiplier. Every two weeks, we convert pain into product.', 'html'),
  ('protocol_title', 'Our 14-Day Operating Cadence.', 'text'),
  ('protocol_subtitle', 'A repeatable system for rapid execution and learning.', 'text'),
  ('archive_title', 'The Ship Log.', 'text'),
  ('archive_subtitle', 'An immutable record of execution.', 'text'),
  ('current_cycle_title', 'Current Cycle: FinTrack', 'text'),
  ('current_cycle_subtitle', 'Hypothesis: "We can build a personal finance tracker that automates 90% of categorization."', 'text'),
  ('services_title', 'We Build. For Us. For You.', 'text'),
  ('services_subtitle', 'Our 14-day cycle is our R&D. We offer that same velocity to a select group of partners. If you need to ship a high-quality product—fast—we are your execution team.', 'text'),
  ('signal_title', 'Follow the Signal.', 'text'),
  ('signal_subtitle', 'We operate in public. Raw insights, build logs, and early access are shared directly on our Telegram channel. No noise, just execution.', 'text');

-- Insert initial product cards
INSERT INTO product_cards (title, description, status, cycle_info, modal_content, sort_order) VALUES
  ('IQeTa', 'AI-powered learning assistant', 'ACTIVE', 'Cycle 01 / Aug 2025', 'Hypothesis was to validate if AI could make studying more effective. We built a tool to generate quizzes from any text. It gained initial traction but user retention was a challenge due to a narrow feature set.', 1),
  ('ConnectETH', 'Decentralized social network', 'SUNSET', 'Cycle 02 / Sep 2025', 'Post-mortem analysis shows the product was ahead of its time in the Ethiopian market. Infrastructure challenges and user adoption barriers led to sunset decision.', 2),
  ('MarketPulse', 'Real-time sentiment analysis', 'PIVOTED', 'Cycle 03 / Sep 2025', 'Original hypothesis was too broad. Pivoted to focus on specific market segments with higher validation potential.', 3);

-- Insert initial site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES
  ('site_title', 'Zero to Something | High-Velocity Venture Building', 'text'),
  ('telegram_link', '#', 'text'),
  ('tiktok_link', '#', 'text'),
  ('linkedin_link', '#', 'text'),
  ('current_cycle_name', 'FinTrack', 'text'),
  ('current_cycle_progress', '35', 'number'),
  ('current_cycle_day', '5', 'number'),
  ('current_cycle_phase', 'BUILD', 'text');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON content_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_cards_updated_at BEFORE UPDATE ON product_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
