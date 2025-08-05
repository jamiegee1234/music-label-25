-- Music Label Management Game - Complete Supabase Schema
-- This schema supports a comprehensive music industry simulation game

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- =====================================================================
-- CORE TABLES
-- =====================================================================

-- Game Sessions / Label Instances
CREATE TABLE labels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    founded_date DATE DEFAULT CURRENT_DATE,
    headquarters_city VARCHAR(100),
    headquarters_country VARCHAR(50),
    label_tier VARCHAR(20) DEFAULT 'startup' CHECK (label_tier IN ('startup', 'independent', 'major', 'mogul')),
    reputation INTEGER DEFAULT 0,
    cash_balance DECIMAL(15, 2) DEFAULT 50000.00,
    total_value DECIMAL(15, 2) DEFAULT 50000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- ARTIST MANAGEMENT
-- =====================================================================

-- Artists table with comprehensive attributes
CREATE TABLE artists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    stage_name VARCHAR(255),
    birth_date DATE,
    nationality VARCHAR(50),
    hometown VARCHAR(100),
    photo_url TEXT,
    biography TEXT,
    
    -- Musical Attributes (1-100 scale)
    vocal_ability INTEGER DEFAULT 50 CHECK (vocal_ability >= 0 AND vocal_ability <= 100),
    instrumental_skill INTEGER DEFAULT 50 CHECK (instrumental_skill >= 0 AND instrumental_skill <= 100),
    songwriting_ability INTEGER DEFAULT 50 CHECK (songwriting_ability >= 0 AND songwriting_ability <= 100),
    
    -- Performance Attributes
    stage_presence INTEGER DEFAULT 50 CHECK (stage_presence >= 0 AND stage_presence <= 100),
    charisma INTEGER DEFAULT 50 CHECK (charisma >= 0 AND charisma <= 100),
    audience_connection INTEGER DEFAULT 50 CHECK (audience_connection >= 0 AND audience_connection <= 100),
    
    -- Business Attributes
    professionalism INTEGER DEFAULT 50 CHECK (professionalism >= 0 AND professionalism <= 100),
    reliability INTEGER DEFAULT 50 CHECK (reliability >= 0 AND reliability <= 100),
    marketing_appeal INTEGER DEFAULT 50 CHECK (marketing_appeal >= 0 AND marketing_appeal <= 100),
    
    -- Personal Attributes
    ego INTEGER DEFAULT 50 CHECK (ego >= 0 AND ego <= 100),
    loyalty INTEGER DEFAULT 50 CHECK (loyalty >= 0 AND loyalty <= 100),
    work_ethic INTEGER DEFAULT 50 CHECK (work_ethic >= 0 AND work_ethic <= 100),
    substance_issues INTEGER DEFAULT 0 CHECK (substance_issues >= 0 AND substance_issues <= 100),
    
    -- Career Stats
    career_stage VARCHAR(20) DEFAULT 'unknown' CHECK (career_stage IN ('unknown', 'prospect', 'developing', 'established', 'superstar', 'legend')),
    primary_genre VARCHAR(50),
    monthly_streams BIGINT DEFAULT 0,
    total_album_sales BIGINT DEFAULT 0,
    social_media_followers BIGINT DEFAULT 0,
    
    -- Contract Status
    is_signed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artist genres (many-to-many relationship)
CREATE TABLE artist_genres (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    genre VARCHAR(50) NOT NULL,
    proficiency INTEGER DEFAULT 50 CHECK (proficiency >= 0 AND proficiency <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- CONTRACTS & LEGAL
-- =====================================================================

-- Contract types and terms
CREATE TABLE contracts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    contract_type VARCHAR(30) DEFAULT 'traditional' CHECK (contract_type IN ('traditional', '360_deal', 'distribution', 'joint_venture', 'licensing')),
    
    -- Financial Terms
    advance_amount DECIMAL(12, 2) DEFAULT 0,
    label_royalty_percentage DECIMAL(5, 2) DEFAULT 50.00, -- Label's share
    artist_royalty_percentage DECIMAL(5, 2) DEFAULT 50.00, -- Artist's share
    recoupment_rate DECIMAL(5, 2) DEFAULT 100.00, -- Percentage of royalties used for recoupment
    
    -- Contract Scope
    includes_recording BOOLEAN DEFAULT TRUE,
    includes_publishing BOOLEAN DEFAULT FALSE,
    includes_touring BOOLEAN DEFAULT FALSE,
    includes_merchandise BOOLEAN DEFAULT FALSE,
    includes_endorsements BOOLEAN DEFAULT FALSE,
    
    -- Terms
    start_date DATE NOT NULL,
    end_date DATE,
    album_commitment INTEGER DEFAULT 1,
    albums_delivered INTEGER DEFAULT 0,
    option_periods INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'fulfilled', 'terminated', 'expired')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- PROJECTS & RELEASES
-- =====================================================================

-- Albums, singles, and other releases
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    project_type VARCHAR(20) DEFAULT 'album' CHECK (project_type IN ('single', 'ep', 'album', 'compilation', 'live')),
    
    -- Production Details
    producer_name VARCHAR(255),
    studio_name VARCHAR(255),
    recording_start_date DATE,
    recording_end_date DATE,
    
    -- Release Information
    release_date DATE,
    genre VARCHAR(50),
    track_count INTEGER DEFAULT 1,
    duration_seconds INTEGER,
    
    -- Commercial Performance
    production_cost DECIMAL(12, 2) DEFAULT 0,
    marketing_budget DECIMAL(12, 2) DEFAULT 0,
    total_sales BIGINT DEFAULT 0,
    streaming_count BIGINT DEFAULT 0,
    revenue_generated DECIMAL(12, 2) DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'recording', 'mixing', 'mastering', 'completed', 'released', 'cancelled')),
    
    -- Quality Ratings (1-100)
    production_quality INTEGER DEFAULT 50 CHECK (production_quality >= 0 AND production_quality <= 100),
    commercial_appeal INTEGER DEFAULT 50 CHECK (commercial_appeal >= 0 AND commercial_appeal <= 100),
    critical_rating INTEGER DEFAULT 50 CHECK (critical_rating >= 0 AND critical_rating <= 100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual tracks within projects
CREATE TABLE tracks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    track_number INTEGER NOT NULL,
    duration_seconds INTEGER,
    genre VARCHAR(50),
    songwriters TEXT[], -- Array of songwriter names
    featured_artists TEXT[], -- Array of featured artist names
    is_single BOOLEAN DEFAULT FALSE,
    
    -- Performance Metrics
    radio_play_count INTEGER DEFAULT 0,
    streaming_count BIGINT DEFAULT 0,
    sync_licenses INTEGER DEFAULT 0, -- TV, film, commercial usage
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- CHARTS & PERFORMANCE
-- =====================================================================

-- Chart systems (Billboard, UK Official Charts, etc.)
CREATE TABLE chart_systems (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50),
    chart_type VARCHAR(30) CHECK (chart_type IN ('singles', 'albums', 'streaming', 'genre_specific')),
    genre VARCHAR(50), -- For genre-specific charts
    max_positions INTEGER DEFAULT 100,
    update_frequency VARCHAR(20) DEFAULT 'weekly' CHECK (update_frequency IN ('daily', 'weekly', 'monthly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chart positions and history
CREATE TABLE chart_positions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chart_system_id UUID REFERENCES chart_systems(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    chart_date DATE NOT NULL,
    position INTEGER NOT NULL,
    weeks_on_chart INTEGER DEFAULT 1,
    peak_position INTEGER,
    weeks_at_peak INTEGER DEFAULT 0,
    previous_position INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- VENUES & TOURS
-- =====================================================================

-- Venue database with capacity tiers
CREATE TABLE venues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL,
    venue_type VARCHAR(20) NOT NULL CHECK (venue_type IN ('club', 'theater', 'arena', 'stadium', 'festival')),
    tier INTEGER NOT NULL CHECK (tier >= 1 AND tier <= 6),
    
    -- Venue Details
    address TEXT,
    established_year INTEGER,
    reputation INTEGER DEFAULT 50 CHECK (reputation >= 0 AND reputation <= 100),
    booking_difficulty INTEGER DEFAULT 50 CHECK (booking_difficulty >= 0 AND booking_difficulty <= 100),
    technical_quality INTEGER DEFAULT 50 CHECK (technical_quality >= 0 AND technical_quality <= 100),
    
    -- Financial
    base_rental_cost DECIMAL(10, 2),
    revenue_split_percentage DECIMAL(5, 2) DEFAULT 85.00, -- Venue's cut of ticket sales
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tours and tour legs
CREATE TABLE tours (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    tour_type VARCHAR(20) DEFAULT 'standard' CHECK (tour_type IN ('showcase', 'club', 'theater', 'arena', 'stadium', 'festival')),
    
    -- Tour Dates
    start_date DATE,
    end_date DATE,
    
    -- Financial
    total_budget DECIMAL(12, 2) DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    merchandise_revenue DECIMAL(12, 2) DEFAULT 0,
    
    -- Performance Metrics
    total_attendance INTEGER DEFAULT 0,
    sold_out_shows INTEGER DEFAULT 0,
    average_ticket_price DECIMAL(8, 2),
    
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'announced', 'on_sale', 'active', 'completed', 'cancelled')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual tour dates/shows
CREATE TABLE tour_dates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    show_date DATE NOT NULL,
    doors_time TIME,
    show_time TIME,
    
    -- Ticketing
    ticket_price DECIMAL(8, 2),
    tickets_available INTEGER,
    tickets_sold INTEGER DEFAULT 0,
    vip_packages_sold INTEGER DEFAULT 0,
    
    -- Financial
    gross_revenue DECIMAL(10, 2) DEFAULT 0,
    venue_costs DECIMAL(10, 2) DEFAULT 0,
    production_costs DECIMAL(10, 2) DEFAULT 0,
    net_profit DECIMAL(10, 2) DEFAULT 0,
    
    -- Performance
    attendance INTEGER DEFAULT 0,
    is_sold_out BOOLEAN DEFAULT FALSE,
    show_rating INTEGER DEFAULT 50 CHECK (show_rating >= 0 AND show_rating <= 100),
    
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'on_sale', 'sold_out', 'completed', 'cancelled')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- STAFF & PERSONNEL
-- =====================================================================

-- Label staff (A&R, marketing, legal, etc.)
CREATE TABLE staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(50) NOT NULL,
    position VARCHAR(100) NOT NULL,
    
    -- Skills (1-100 scale)
    skill_level INTEGER DEFAULT 50 CHECK (skill_level >= 0 AND skill_level <= 100),
    experience_years INTEGER DEFAULT 0,
    specialty VARCHAR(100),
    
    -- Employment
    hire_date DATE DEFAULT CURRENT_DATE,
    salary DECIMAL(10, 2),
    contract_type VARCHAR(20) DEFAULT 'full_time' CHECK (contract_type IN ('full_time', 'part_time', 'contractor', 'consultant')),
    
    -- Performance
    performance_rating INTEGER DEFAULT 50 CHECK (performance_rating >= 0 AND performance_rating <= 100),
    successful_projects INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scouts for talent discovery
CREATE TABLE scouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    territory VARCHAR(100), -- Geographic area or online platform
    specialties TEXT[], -- Array of genres or artist types
    
    -- Scout Attributes
    discovery_skill INTEGER DEFAULT 50 CHECK (discovery_skill >= 0 AND discovery_skill <= 100),
    network_strength INTEGER DEFAULT 50 CHECK (network_strength >= 0 AND network_strength <= 100),
    cost_per_month DECIMAL(8, 2),
    
    -- Performance History
    artists_discovered INTEGER DEFAULT 0,
    successful_signings INTEGER DEFAULT 0,
    success_rate DECIMAL(5, 2) DEFAULT 0.00,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- External producers, engineers, etc.
CREATE TABLE industry_professionals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    profession VARCHAR(50) NOT NULL, -- producer, engineer, songwriter, etc.
    
    -- Skills and Reputation
    skill_level INTEGER DEFAULT 50 CHECK (skill_level >= 0 AND skill_level <= 100),
    reputation INTEGER DEFAULT 50 CHECK (reputation >= 0 AND reputation <= 100),
    specialties TEXT[], -- Genres, techniques, etc.
    
    -- Availability and Cost
    cost_per_day DECIMAL(8, 2),
    cost_per_project DECIMAL(10, 2),
    availability_percentage INTEGER DEFAULT 70 CHECK (availability_percentage >= 0 AND availability_percentage <= 100),
    
    -- Career Stats
    successful_projects INTEGER DEFAULT 0,
    awards_won INTEGER DEFAULT 0,
    notable_collaborations TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- FINANCIAL MANAGEMENT
-- =====================================================================

-- Financial transactions
CREATE TABLE financial_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    transaction_date DATE DEFAULT CURRENT_DATE,
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('income', 'expense', 'investment', 'loan', 'royalty', 'advance')),
    category VARCHAR(50) NOT NULL, -- studio_rental, marketing, salaries, etc.
    
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    
    -- Related entities
    artist_id UUID REFERENCES artists(id),
    project_id UUID REFERENCES projects(id),
    tour_id UUID REFERENCES tours(id),
    
    -- Tax and accounting
    is_tax_deductible BOOLEAN DEFAULT FALSE,
    tax_category VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Royalty calculations and payments
CREATE TABLE royalty_statements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    
    statement_period_start DATE NOT NULL,
    statement_period_end DATE NOT NULL,
    
    -- Revenue Breakdown
    physical_sales_revenue DECIMAL(12, 2) DEFAULT 0,
    digital_sales_revenue DECIMAL(12, 2) DEFAULT 0,
    streaming_revenue DECIMAL(12, 2) DEFAULT 0,
    sync_licensing_revenue DECIMAL(12, 2) DEFAULT 0,
    touring_revenue DECIMAL(12, 2) DEFAULT 0,
    merchandise_revenue DECIMAL(12, 2) DEFAULT 0,
    other_revenue DECIMAL(12, 2) DEFAULT 0,
    
    -- Calculations
    gross_revenue DECIMAL(12, 2) GENERATED ALWAYS AS (
        physical_sales_revenue + digital_sales_revenue + streaming_revenue + 
        sync_licensing_revenue + touring_revenue + merchandise_revenue + other_revenue
    ) STORED,
    
    -- Deductions
    production_costs DECIMAL(12, 2) DEFAULT 0,
    marketing_costs DECIMAL(12, 2) DEFAULT 0,
    distribution_costs DECIMAL(12, 2) DEFAULT 0,
    other_deductions DECIMAL(12, 2) DEFAULT 0,
    
    net_revenue DECIMAL(12, 2),
    artist_royalty_amount DECIMAL(12, 2),
    label_share DECIMAL(12, 2),
    
    -- Recoupment tracking
    unrecouped_balance DECIMAL(12, 2) DEFAULT 0,
    recoupment_this_period DECIMAL(12, 2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- STUDIO & EQUIPMENT
-- =====================================================================

-- Recording studios
CREATE TABLE studios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE SET NULL, -- Can be owned by label or external
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    studio_type VARCHAR(20) DEFAULT 'external' CHECK (studio_type IN ('home', 'project', 'professional', 'world_class')),
    
    -- Equipment and Quality
    equipment_quality INTEGER DEFAULT 50 CHECK (equipment_quality >= 0 AND equipment_quality <= 100),
    acoustic_quality INTEGER DEFAULT 50 CHECK (acoustic_quality >= 0 AND acoustic_quality <= 100),
    mixing_board_channels INTEGER DEFAULT 8,
    
    -- Availability and Cost
    hourly_rate DECIMAL(8, 2),
    daily_rate DECIMAL(10, 2),
    is_available BOOLEAN DEFAULT TRUE,
    
    -- Reputation
    reputation INTEGER DEFAULT 50 CHECK (reputation >= 0 AND reputation <= 100),
    notable_recordings TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment owned by the label
CREATE TABLE equipment (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    studio_id UUID REFERENCES studios(id) ON DELETE SET NULL,
    
    equipment_type VARCHAR(50) NOT NULL, -- mixing_board, microphone, guitar, etc.
    brand VARCHAR(100),
    model VARCHAR(100),
    
    -- Specifications
    quality_rating INTEGER DEFAULT 50 CHECK (quality_rating >= 0 AND quality_rating <= 100),
    purchase_date DATE,
    purchase_price DECIMAL(10, 2),
    current_value DECIMAL(10, 2),
    
    -- Maintenance
    condition VARCHAR(20) DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'broken')),
    last_maintenance_date DATE,
    maintenance_cost_ytd DECIMAL(8, 2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- INDUSTRY EVENTS & CALENDAR
-- =====================================================================

-- Awards shows, festivals, industry events
CREATE TABLE industry_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('awards', 'festival', 'conference', 'showcase', 'market')),
    
    -- Event Details
    date_start DATE NOT NULL,
    date_end DATE,
    location VARCHAR(255),
    country VARCHAR(50),
    
    -- Significance
    prestige_level INTEGER DEFAULT 50 CHECK (prestige_level >= 0 AND prestige_level <= 100),
    industry_importance INTEGER DEFAULT 50 CHECK (industry_importance >= 0 AND industry_importance <= 100),
    genres TEXT[], -- Relevant genres
    
    -- Participation
    submission_deadline DATE,
    entry_fee DECIMAL(8, 2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event participation and results
CREATE TABLE event_participation (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES industry_events(id) ON DELETE CASCADE,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    
    participation_type VARCHAR(30) CHECK (participation_type IN ('nomination', 'performance', 'showcase', 'attendance')),
    category VARCHAR(100), -- For awards
    
    -- Results
    result VARCHAR(30) CHECK (result IN ('won', 'nominated', 'performed', 'attended', 'rejected')),
    placement INTEGER, -- For competitions/charts
    
    -- Impact
    publicity_value DECIMAL(10, 2) DEFAULT 0,
    industry_reputation_change INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- MARKET & COMPETITION
-- =====================================================================

-- Competitor labels
CREATE TABLE competitor_labels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    label_type VARCHAR(20) CHECK (label_type IN ('major', 'independent', 'boutique')),
    
    -- Market Position
    market_share DECIMAL(5, 2) DEFAULT 0.00,
    reputation INTEGER DEFAULT 50 CHECK (reputation >= 0 AND reputation <= 100),
    estimated_value DECIMAL(15, 2),
    
    -- Strengths
    primary_genres TEXT[],
    key_markets TEXT[],
    notable_artists TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market trends and genre popularity
CREATE TABLE market_trends (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    trend_date DATE DEFAULT CURRENT_DATE,
    genre VARCHAR(50) NOT NULL,
    popularity_score INTEGER CHECK (popularity_score >= 0 AND popularity_score <= 100),
    change_from_previous DECIMAL(5, 2) DEFAULT 0.00, -- Percentage change
    
    -- Trend Factors
    streaming_growth DECIMAL(5, 2) DEFAULT 0.00,
    radio_play_growth DECIMAL(5, 2) DEFAULT 0.00,
    social_media_buzz INTEGER DEFAULT 50,
    
    -- Predictions
    predicted_direction VARCHAR(20) CHECK (predicted_direction IN ('rising', 'stable', 'declining', 'uncertain')),
    confidence_level INTEGER DEFAULT 50 CHECK (confidence_level >= 0 AND confidence_level <= 100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- PROSPECT SCOUTING
-- =====================================================================

-- Potential artists to sign
CREATE TABLE prospects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    scout_id UUID REFERENCES scouts(id) ON DELETE SET NULL,
    discovered_by_label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    stage_name VARCHAR(255),
    age INTEGER,
    location VARCHAR(255),
    
    -- Discovery Details
    discovery_source VARCHAR(50), -- social_media, venue, demo, referral, etc.
    discovery_date DATE DEFAULT CURRENT_DATE,
    
    -- Attributes (estimated)
    estimated_vocal_ability INTEGER DEFAULT 50 CHECK (estimated_vocal_ability >= 0 AND estimated_vocal_ability <= 100),
    estimated_stage_presence INTEGER DEFAULT 50 CHECK (estimated_stage_presence >= 0 AND estimated_stage_presence <= 100),
    estimated_commercial_appeal INTEGER DEFAULT 50 CHECK (estimated_commercial_appeal >= 0 AND estimated_commercial_appeal <= 100),
    
    -- Current Status
    genre VARCHAR(50),
    current_following INTEGER DEFAULT 0,
    is_unsigned BOOLEAN DEFAULT TRUE,
    asking_advance DECIMAL(10, 2),
    
    -- Scouting Progress
    scout_status VARCHAR(30) DEFAULT 'identified' CHECK (scout_status IN ('identified', 'contacted', 'interested', 'negotiating', 'signed', 'passed', 'lost')),
    contact_attempts INTEGER DEFAULT 0,
    last_contact_date DATE,
    
    -- Decision Factors
    competition_level INTEGER DEFAULT 50 CHECK (competition_level >= 0 AND competition_level <= 100),
    signing_urgency INTEGER DEFAULT 50 CHECK (signing_urgency >= 0 AND signing_urgency <= 100),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- GAME MECHANICS
-- =====================================================================

-- Player achievements and milestones
CREATE TABLE achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Achievement Details
    achieved_date DATE DEFAULT CURRENT_DATE,
    points_awarded INTEGER DEFAULT 0,
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    
    -- Related Data
    related_artist_id UUID REFERENCES artists(id),
    related_project_id UUID REFERENCES projects(id),
    achievement_value DECIMAL(12, 2), -- Chart position, sales number, etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game progression and unlocks
CREATE TABLE game_progression (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    
    -- Experience and Level
    total_experience INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    
    -- Unlocked Features
    unlocked_genres TEXT[] DEFAULT '{}',
    unlocked_markets TEXT[] DEFAULT '{}',
    unlocked_venue_tiers INTEGER DEFAULT 1,
    max_artists INTEGER DEFAULT 3,
    max_staff INTEGER DEFAULT 5,
    
    -- Skill Points
    available_skill_points INTEGER DEFAULT 0,
    spent_skill_points INTEGER DEFAULT 0,
    
    -- Skill Tree Progress
    ar_skill_level INTEGER DEFAULT 1 CHECK (ar_skill_level >= 1 AND ar_skill_level <= 10),
    marketing_skill_level INTEGER DEFAULT 1 CHECK (marketing_skill_level >= 1 AND marketing_skill_level <= 10),
    financial_skill_level INTEGER DEFAULT 1 CHECK (financial_skill_level >= 1 AND financial_skill_level <= 10),
    production_skill_level INTEGER DEFAULT 1 CHECK (production_skill_level >= 1 AND production_skill_level <= 10),
    touring_skill_level INTEGER DEFAULT 1 CHECK (touring_skill_level >= 1 AND touring_skill_level <= 10),
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- NEWS & COMMUNICATIONS
-- =====================================================================

-- Industry news and random events
CREATE TABLE industry_news (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    headline VARCHAR(500) NOT NULL,
    content TEXT,
    news_type VARCHAR(30) CHECK (news_type IN ('market', 'artist', 'technology', 'legal', 'trend', 'event')),
    
    -- Impact on game
    affects_genre VARCHAR(50),
    market_impact INTEGER DEFAULT 0 CHECK (market_impact >= -100 AND market_impact <= 100),
    duration_days INTEGER DEFAULT 30,
    
    -- Publication
    publication_date DATE DEFAULT CURRENT_DATE,
    source VARCHAR(255),
    is_global BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================================

-- Artist performance indexes
CREATE INDEX idx_artists_label_id ON artists(label_id);
CREATE INDEX idx_artists_career_stage ON artists(career_stage);
CREATE INDEX idx_artists_is_signed ON artists(is_signed);

-- Contract indexes
CREATE INDEX idx_contracts_label_artist ON contracts(label_id, artist_id);
CREATE INDEX idx_contracts_status ON contracts(status);

-- Project indexes
CREATE INDEX idx_projects_label_id ON projects(label_id);
CREATE INDEX idx_projects_artist_id ON projects(artist_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_release_date ON projects(release_date);

-- Chart indexes
CREATE INDEX idx_chart_positions_date ON chart_positions(chart_date);
CREATE INDEX idx_chart_positions_project ON chart_positions(project_id);

-- Financial indexes
CREATE INDEX idx_financial_records_label_date ON financial_records(label_id, transaction_date);
CREATE INDEX idx_financial_records_type ON financial_records(transaction_type);

-- Tour indexes
CREATE INDEX idx_tours_label_id ON tours(label_id);
CREATE INDEX idx_tours_dates ON tours(start_date, end_date);
CREATE INDEX idx_tour_dates_tour_id ON tour_dates(tour_id);

-- Venue indexes
CREATE INDEX idx_venues_country_capacity ON venues(country, capacity);
CREATE INDEX idx_venues_tier ON venues(tier);

-- =====================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at columns
CREATE TRIGGER update_labels_updated_at BEFORE UPDATE ON labels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON prospects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_progression_updated_at BEFORE UPDATE ON game_progression FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for labels (each user can only access their own label)
-- Note: This assumes you have user authentication set up
CREATE POLICY "Users can only access their own label" ON labels
    FOR ALL USING (auth.uid()::text = owner_name); -- Adjust based on your auth setup

-- =====================================================================
-- INITIAL DATA SETUP
-- =====================================================================

-- Insert basic chart systems
INSERT INTO chart_systems (name, country, chart_type, max_positions) VALUES
('Billboard Hot 100', 'US', 'singles', 100),
('Billboard 200', 'US', 'albums', 200),
('UK Official Singles Chart', 'UK', 'singles', 100),
('UK Official Albums Chart', 'UK', 'albums', 100),
('Spotify Global 50', 'Global', 'streaming', 50),
('Apple Music Top 100', 'Global', 'streaming', 100);

-- Insert sample venues for different tiers
INSERT INTO venues (name, city, country, capacity, venue_type, tier, base_rental_cost) VALUES
-- UK Venues
('The Windmill', 'London', 'UK', 200, 'club', 1, 500.00),
('Night & Day Café', 'Manchester', 'UK', 350, 'club', 1, 400.00),
('The Scala', 'London', 'UK', 1100, 'theater', 2, 2500.00),
('King Tuts Wah Wah Hut', 'Glasgow', 'UK', 300, 'club', 1, 800.00),
('Roundhouse', 'London', 'UK', 3300, 'theater', 3, 8000.00),
('O2 Academy Brixton', 'London', 'UK', 4921, 'theater', 3, 15000.00),
('Eventim Apollo', 'London', 'UK', 5100, 'theater', 4, 25000.00),
('O2 Arena', 'London', 'UK', 20000, 'arena', 5, 75000.00),
('Wembley Stadium', 'London', 'UK', 90000, 'stadium', 6, 500000.00),

-- US Venues
('Mercury Lounge', 'New York', 'US', 250, 'club', 1, 800.00),
('The Troubadour', 'Los Angeles', 'US', 400, 'club', 1, 1200.00),
('9:30 Club', 'Washington DC', 'US', 1200, 'club', 2, 4000.00),
('The Fillmore', 'San Francisco', 'US', 1315, 'theater', 2, 5000.00),
('Red Rocks Amphitheatre', 'Morrison', 'US', 9525, 'theater', 4, 35000.00),
('Radio City Music Hall', 'New York', 'US', 6015, 'theater', 4, 40000.00),
('Madison Square Garden', 'New York', 'US', 20789, 'arena', 5, 100000.00),
('MetLife Stadium', 'East Rutherford', 'US', 82500, 'stadium', 6, 750000.00);

-- Insert sample industry events
INSERT INTO industry_events (name, event_type, date_start, location, country, prestige_level) VALUES
('Grammy Awards', 'awards', '2025-02-02', 'Los Angeles', 'US', 100),
('BRIT Awards', 'awards', '2025-02-11', 'London', 'UK', 90),
('Coachella', 'festival', '2025-04-11', 'Indio', 'US', 85),
('Glastonbury Festival', 'festival', '2025-06-25', 'Somerset', 'UK', 95),
('SXSW', 'festival', '2025-03-07', 'Austin', 'US', 80),
('Lollapalooza', 'festival', '2025-08-01', 'Chicago', 'US', 85),
('MTV VMAs', 'awards', '2025-08-30', 'New York', 'US', 75),
('Mercury Prize', 'awards', '2025-09-15', 'London', 'UK', 85);

-- Insert basic market trends
INSERT INTO market_trends (genre, popularity_score, predicted_direction) VALUES
('Pop', 85, 'stable'),
('Hip-Hop', 90, 'rising'),
('Rock', 60, 'declining'),
('Electronic', 75, 'rising'),
('Country', 70, 'stable'),
('R&B', 80, 'rising'),
('Indie', 65, 'stable'),
('Alternative', 55, 'declining'),
('Folk', 45, 'stable'),
('Jazz', 35, 'stable');

COMMENT ON TABLE labels IS 'Main game instances - each represents a player''s record label';
COMMENT ON TABLE artists IS 'Artists signed to or being courted by labels';
COMMENT ON TABLE contracts IS 'Legal agreements between labels and artists';
COMMENT ON TABLE projects IS 'Albums, singles, and other musical releases';
COMMENT ON TABLE venues IS 'Concert venues with different capacity tiers';
COMMENT ON TABLE tours IS 'Concert tours organized by labels for their artists';
COMMENT ON TABLE chart_positions IS 'Historical chart performance data';
COMMENT ON TABLE financial_records IS 'All financial transactions for labels';
COMMENT ON TABLE prospects IS 'Potential artists being scouted';
COMMENT ON TABLE game_progression IS 'Player advancement and unlocked features';