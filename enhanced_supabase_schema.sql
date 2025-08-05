-- ENHANCED MUSIC LABEL MANAGEMENT GAME SCHEMA
-- This enhanced schema includes supercharged features for the most comprehensive music industry simulation

-- Build upon the existing schema with advanced features
-- Include all previous tables plus sophisticated new ones

-- =====================================================================
-- SOCIAL MEDIA & VIRAL MARKETING ECOSYSTEM
-- =====================================================================

-- Platform-specific social media tracking
CREATE TABLE social_media_platforms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- TikTok, Instagram, Twitter, YouTube, etc.
    platform_type VARCHAR(30) CHECK (platform_type IN ('short_video', 'long_video', 'image', 'audio', 'text')),
    algorithm_factors JSONB, -- Platform-specific algorithm considerations
    viral_threshold INTEGER DEFAULT 1000000, -- Views needed for viral status
    demographic_skew JSONB, -- Age, geography preferences
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artist social media presence across platforms
CREATE TABLE artist_social_media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    platform_id UUID REFERENCES social_media_platforms(id) ON DELETE CASCADE,
    
    -- Metrics
    followers_count BIGINT DEFAULT 0,
    engagement_rate DECIMAL(5, 2) DEFAULT 0.00, -- Percentage
    monthly_views BIGINT DEFAULT 0,
    viral_moments INTEGER DEFAULT 0,
    
    -- Content Strategy
    posting_frequency INTEGER DEFAULT 1, -- Posts per week
    content_quality INTEGER DEFAULT 50 CHECK (content_quality >= 0 AND content_quality <= 100),
    authenticity_level INTEGER DEFAULT 50 CHECK (authenticity_level >= 0 AND authenticity_level <= 100),
    
    -- Platform-Specific Metrics
    platform_metrics JSONB, -- TikTok: duets, Instagram: reels, etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Viral moments and their impact
CREATE TABLE viral_moments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    platform_id UUID REFERENCES social_media_platforms(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    
    -- Viral Event Details
    content_type VARCHAR(50), -- song, meme, controversy, challenge, etc.
    peak_views BIGINT NOT NULL,
    duration_hours INTEGER, -- How long it stayed viral
    viral_factor DECIMAL(8, 2), -- Multiplier effect on other metrics
    
    -- Impact
    follower_gain BIGINT DEFAULT 0,
    stream_increase BIGINT DEFAULT 0,
    revenue_generated DECIMAL(12, 2) DEFAULT 0,
    reputation_change INTEGER DEFAULT 0,
    
    -- Metadata
    description TEXT,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Influencer network and collaborations
CREATE TABLE influencers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    platform_id UUID REFERENCES social_media_platforms(id) ON DELETE CASCADE,
    
    -- Metrics
    follower_count BIGINT NOT NULL,
    engagement_rate DECIMAL(5, 2) DEFAULT 0.00,
    demographics JSONB, -- Age, location, interests of audience
    
    -- Business
    collaboration_rate DECIMAL(10, 2), -- Cost per collaboration
    brand_safety_rating INTEGER DEFAULT 50 CHECK (brand_safety_rating >= 0 AND brand_safety_rating <= 100),
    past_collaborations TEXT[], -- Array of previous brand partnerships
    
    -- Specialty
    content_niches TEXT[], -- Music, fashion, lifestyle, etc.
    target_demographics TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artist-influencer collaborations
CREATE TABLE influencer_collaborations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    
    -- Collaboration Details
    collaboration_type VARCHAR(30) CHECK (collaboration_type IN ('sponsored_post', 'song_feature', 'challenge_creation', 'brand_partnership')),
    cost DECIMAL(10, 2) NOT NULL,
    duration_days INTEGER DEFAULT 7,
    
    -- Results
    reach BIGINT DEFAULT 0,
    engagement BIGINT DEFAULT 0,
    conversion_rate DECIMAL(5, 2) DEFAULT 0.00,
    roi DECIMAL(8, 2) DEFAULT 0.00,
    
    -- Status
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- ADVANCED AI & ANALYTICS SYSTEMS
-- =====================================================================

-- AI Analysis of music tracks
CREATE TABLE track_ai_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    
    -- Audio Analysis
    tempo INTEGER,
    key VARCHAR(10),
    mode VARCHAR(10), -- major, minor
    energy_level INTEGER CHECK (energy_level >= 0 AND energy_level <= 100),
    danceability INTEGER CHECK (danceability >= 0 AND danceability <= 100),
    valence INTEGER CHECK (valence >= 0 AND valence <= 100), -- Musical positivity
    
    -- Lyrical Analysis
    lyrical_sentiment DECIMAL(5, 2), -- -1.0 to 1.0
    explicit_content BOOLEAN DEFAULT FALSE,
    themes TEXT[], -- Love, breakup, party, social justice, etc.
    complexity_score INTEGER CHECK (complexity_score >= 0 AND complexity_score <= 100),
    
    -- Commercial Predictions
    radio_friendliness INTEGER CHECK (radio_friendliness >= 0 AND radio_friendliness <= 100),
    streaming_potential INTEGER CHECK (streaming_potential >= 0 AND streaming_potential <= 100),
    viral_potential INTEGER CHECK (viral_potential >= 0 AND viral_potential <= 100),
    demographic_appeal JSONB, -- Which demographics will like this
    
    -- Genre Classification
    primary_genre VARCHAR(50),
    secondary_genres TEXT[],
    genre_fusion_score INTEGER CHECK (genre_fusion_score >= 0 AND genre_fusion_score <= 100),
    
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market intelligence and predictions
CREATE TABLE market_intelligence (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Temporal Context
    analysis_date DATE DEFAULT CURRENT_DATE,
    prediction_horizon INTEGER DEFAULT 30, -- Days into future
    confidence_level INTEGER CHECK (confidence_level >= 0 AND confidence_level <= 100),
    
    -- Market Factors
    economic_indicators JSONB, -- GDP, unemployment, consumer spending
    cultural_events TEXT[], -- Major events affecting music consumption
    technology_disruptions TEXT[], -- New platforms, format changes
    
    -- Genre Predictions
    genre_trends JSONB, -- Predicted changes by genre
    emerging_genres TEXT[],
    declining_genres TEXT[],
    
    -- Platform Predictions
    platform_algorithm_changes JSONB, -- Expected algorithm updates
    new_platform_threats TEXT[],
    
    -- Demographic Shifts
    generational_preferences JSONB, -- Gen Z, Alpha, Millennial trends
    geographic_trends JSONB, -- Regional market changes
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitor intelligence and tracking
CREATE TABLE competitor_intelligence (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    competitor_label_id UUID REFERENCES competitor_labels(id) ON DELETE CASCADE,
    
    -- Activity Tracking
    report_date DATE DEFAULT CURRENT_DATE,
    new_signings TEXT[], -- Recently signed artists
    releases_this_month INTEGER DEFAULT 0,
    marketing_spend_estimate DECIMAL(12, 2),
    
    -- Strategic Moves
    strategic_partnerships TEXT[],
    technology_investments TEXT[],
    market_expansion_activities TEXT[],
    
    -- Performance Metrics
    chart_success_rate DECIMAL(5, 2), -- Percentage of releases charting
    streaming_growth_rate DECIMAL(5, 2),
    social_media_engagement_change DECIMAL(5, 2),
    
    -- Intelligence Sources
    data_sources TEXT[], -- Social media, press releases, industry reports
    reliability_score INTEGER CHECK (reliability_score >= 0 AND reliability_score <= 100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- CRISIS MANAGEMENT & SCANDAL SYSTEM
-- =====================================================================

-- Types of crises and scandals
CREATE TABLE crisis_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('personal', 'professional', 'legal', 'health', 'political', 'social')),
    
    -- Impact Characteristics
    severity_range_min INTEGER DEFAULT 1,
    severity_range_max INTEGER DEFAULT 100,
    typical_duration_days INTEGER DEFAULT 14,
    media_attention_level INTEGER DEFAULT 50,
    
    -- Demographic Impact
    demographic_impact JSONB, -- How different demographics react
    platform_impact JSONB, -- How different platforms react
    
    -- Resolution Strategies
    recommended_responses TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crisis events affecting artists
CREATE TABLE crisis_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    crisis_type_id UUID REFERENCES crisis_types(id) ON DELETE CASCADE,
    
    -- Event Details
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    severity INTEGER CHECK (severity >= 1 AND severity <= 100),
    public_knowledge BOOLEAN DEFAULT FALSE,
    media_coverage_level INTEGER DEFAULT 0,
    
    -- Impact Tracking
    reputation_impact INTEGER DEFAULT 0, -- Positive or negative
    financial_impact DECIMAL(12, 2) DEFAULT 0,
    fanbase_impact_percentage DECIMAL(5, 2) DEFAULT 0.00,
    
    -- Response Tracking
    response_strategy VARCHAR(100),
    response_effectiveness INTEGER CHECK (response_effectiveness >= 0 AND response_effectiveness <= 100),
    resolution_timeline_days INTEGER,
    
    -- Status
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('brewing', 'active', 'contained', 'resolved', 'ongoing')),
    
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crisis management team and responses
CREATE TABLE crisis_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crisis_event_id UUID REFERENCES crisis_events(id) ON DELETE CASCADE,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    
    -- Response Details
    response_type VARCHAR(50) CHECK (response_type IN ('public_statement', 'apology', 'denial', 'legal_action', 'rehabilitation', 'silence')),
    response_date DATE DEFAULT CURRENT_DATE,
    cost DECIMAL(10, 2) DEFAULT 0,
    
    -- Response Content
    statement_text TEXT,
    channels_used TEXT[], -- Social media, press release, interview, etc.
    spokesperson VARCHAR(255), -- Artist, manager, PR team, lawyer
    
    -- Effectiveness
    public_reception INTEGER CHECK (public_reception >= 0 AND public_reception <= 100),
    media_reception INTEGER CHECK (media_reception >= 0 AND media_reception <= 100),
    fan_reception INTEGER CHECK (fan_reception >= 0 AND fan_reception <= 100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- ADVANCED FINANCIAL & INVESTMENT SYSTEMS
-- =====================================================================

-- Investment opportunities and partnerships
CREATE TABLE investment_opportunities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Opportunity Details
    opportunity_type VARCHAR(50) CHECK (opportunity_type IN ('venture_capital', 'private_equity', 'catalog_purchase', 'technology_investment', 'venue_ownership')),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Financial Terms
    investment_amount DECIMAL(15, 2) NOT NULL,
    equity_percentage DECIMAL(5, 2), -- If giving up equity
    expected_roi DECIMAL(5, 2), -- Expected return on investment
    risk_level INTEGER CHECK (risk_level >= 1 AND risk_level <= 10),
    
    -- Timeline
    investment_duration_months INTEGER,
    available_until DATE,
    
    -- Requirements
    minimum_label_tier VARCHAR(20) CHECK (minimum_label_tier IN ('startup', 'independent', 'major', 'mogul')),
    minimum_reputation INTEGER DEFAULT 0,
    minimum_cash_balance DECIMAL(15, 2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Label investments and partnerships
CREATE TABLE label_investments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES investment_opportunities(id) ON DELETE CASCADE,
    
    -- Investment Details
    investment_date DATE DEFAULT CURRENT_DATE,
    amount_invested DECIMAL(15, 2) NOT NULL,
    equity_given DECIMAL(5, 2) DEFAULT 0.00,
    
    -- Performance Tracking
    current_value DECIMAL(15, 2),
    roi_to_date DECIMAL(8, 2) DEFAULT 0.00,
    dividends_received DECIMAL(12, 2) DEFAULT 0.00,
    
    -- Status
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'exited', 'defaulted', 'matured')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Catalog acquisitions and sales
CREATE TABLE catalog_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Transaction Details
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('purchase', 'sale', 'licensing')),
    buyer_label_id UUID REFERENCES labels(id),
    seller_label_id UUID REFERENCES labels(id),
    
    -- Catalog Details
    catalog_name VARCHAR(255) NOT NULL,
    artist_names TEXT[], -- Artists included in catalog
    number_of_songs INTEGER NOT NULL,
    recording_years_range VARCHAR(20), -- e.g., "1990-2005"
    genres TEXT[],
    
    -- Financial Terms
    transaction_amount DECIMAL(15, 2) NOT NULL,
    royalty_percentage DECIMAL(5, 2), -- If ongoing royalties
    estimated_annual_revenue DECIMAL(12, 2),
    
    -- Valuation Factors
    historical_performance JSONB, -- Past revenue, chart performance
    future_potential_rating INTEGER CHECK (future_potential_rating >= 0 AND future_potential_rating <= 100),
    cultural_significance_rating INTEGER CHECK (cultural_significance_rating >= 0 AND cultural_significance_rating <= 100),
    
    transaction_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- TECHNOLOGY DISRUPTION & INNOVATION
-- =====================================================================

-- Emerging technologies and their impact
CREATE TABLE technology_disruptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Technology Details
    technology_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('streaming', 'ai_music', 'vr_ar', 'blockchain', 'social_media', 'production')),
    description TEXT,
    
    -- Adoption Timeline
    emergence_date DATE,
    mainstream_adoption_date DATE,
    peak_impact_date DATE,
    decline_date DATE,
    
    -- Impact on Industry
    revenue_impact_percentage DECIMAL(5, 2), -- Positive or negative
    affected_roles TEXT[], -- Which industry roles are affected
    new_opportunities TEXT[], -- New revenue streams, roles created
    obsoleted_practices TEXT[], -- What becomes outdated
    
    -- Adoption Requirements
    investment_required DECIMAL(12, 2), -- Cost for labels to adopt
    technical_complexity INTEGER CHECK (technical_complexity >= 1 AND technical_complexity <= 10),
    staff_training_required BOOLEAN DEFAULT FALSE,
    
    -- Competitive Advantage
    early_adopter_advantage BOOLEAN DEFAULT TRUE,
    market_share_impact DECIMAL(5, 2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Label technology adoption tracking
CREATE TABLE technology_adoption (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES technology_disruptions(id) ON DELETE CASCADE,
    
    -- Adoption Details
    adoption_date DATE DEFAULT CURRENT_DATE,
    investment_amount DECIMAL(12, 2) NOT NULL,
    implementation_timeline_days INTEGER,
    
    -- Results
    roi_percentage DECIMAL(8, 2) DEFAULT 0.00,
    efficiency_improvement DECIMAL(5, 2) DEFAULT 0.00,
    new_revenue_generated DECIMAL(12, 2) DEFAULT 0.00,
    competitive_advantage_gained INTEGER CHECK (competitive_advantage_gained >= 0 AND competitive_advantage_gained <= 100),
    
    -- Status
    adoption_status VARCHAR(30) DEFAULT 'planning' CHECK (adoption_status IN ('planning', 'implementing', 'operational', 'optimizing', 'discontinued')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- ADVANCED FAN MANAGEMENT & COMMUNITY
-- =====================================================================

-- Detailed fan demographics and behavior
CREATE TABLE fan_segments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    
    -- Demographic Details
    segment_name VARCHAR(100) NOT NULL,
    age_range VARCHAR(20), -- "18-24", "25-34", etc.
    gender_distribution JSONB, -- Percentage breakdown
    geographic_concentration TEXT[], -- Top cities/countries
    income_level VARCHAR(30) CHECK (income_level IN ('low', 'middle', 'high', 'mixed')),
    
    -- Behavior Patterns
    engagement_level INTEGER CHECK (engagement_level >= 1 AND engagement_level <= 10),
    spending_power DECIMAL(8, 2), -- Average annual spending on artist
    platform_preferences TEXT[], -- Where they primarily engage
    content_preferences TEXT[], -- Music videos, behind scenes, etc.
    
    -- Loyalty Metrics
    loyalty_score INTEGER CHECK (loyalty_score >= 0 AND loyalty_score <= 100),
    churn_risk INTEGER CHECK (churn_risk >= 0 AND churn_risk <= 100),
    influence_factor INTEGER CHECK (influence_factor >= 0 AND influence_factor <= 100), -- How much they influence others
    
    -- Size and Growth
    segment_size INTEGER NOT NULL,
    growth_rate DECIMAL(5, 2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fan engagement campaigns and activities
CREATE TABLE fan_engagement_campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    
    -- Campaign Details
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(50) CHECK (campaign_type IN ('meet_greet', 'exclusive_content', 'fan_club', 'contest', 'collaboration')),
    description TEXT,
    
    -- Targeting
    target_fan_segments UUID[], -- Array of fan_segment IDs
    platforms_used TEXT[],
    
    -- Timeline and Budget
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    
    -- Results
    participants_count INTEGER DEFAULT 0,
    engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),
    roi DECIMAL(8, 2) DEFAULT 0.00,
    new_fans_acquired INTEGER DEFAULT 0,
    
    -- Impact on Artist
    loyalty_improvement DECIMAL(5, 2) DEFAULT 0.00,
    revenue_generated DECIMAL(12, 2) DEFAULT 0.00,
    
    status VARCHAR(30) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- GLOBAL MARKET EXPANSION
-- =====================================================================

-- International markets and their characteristics
CREATE TABLE international_markets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Market Details
    country_code VARCHAR(2) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    region VARCHAR(50), -- Europe, Asia-Pacific, Latin America, etc.
    
    -- Market Characteristics
    music_market_size DECIMAL(15, 2), -- Annual revenue in USD
    streaming_penetration DECIMAL(5, 2), -- Percentage using streaming
    physical_sales_percentage DECIMAL(5, 2),
    live_music_culture_rating INTEGER CHECK (live_music_culture_rating >= 0 AND live_music_culture_rating <= 100),
    
    -- Platform Landscape
    dominant_streaming_platforms TEXT[],
    local_streaming_platforms TEXT[],
    social_media_preferences TEXT[],
    
    -- Cultural Factors
    language_requirements TEXT[], -- Languages needed for success
    cultural_sensitivity_factors TEXT[],
    popular_genres TEXT[],
    local_music_influence INTEGER CHECK (local_music_influence >= 0 AND local_music_influence <= 100),
    
    -- Business Environment
    ease_of_entry INTEGER CHECK (ease_of_entry >= 1 AND ease_of_entry <= 10),
    regulatory_complexity INTEGER CHECK (regulatory_complexity >= 1 AND regulatory_complexity <= 10),
    tax_implications JSONB,
    required_local_partnerships BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Label international expansion tracking
CREATE TABLE international_expansion (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    market_id UUID REFERENCES international_markets(id) ON DELETE CASCADE,
    
    -- Expansion Details
    entry_date DATE DEFAULT CURRENT_DATE,
    entry_strategy VARCHAR(50) CHECK (entry_strategy IN ('direct', 'partnership', 'licensing', 'joint_venture')),
    initial_investment DECIMAL(12, 2) NOT NULL,
    
    -- Local Partnerships
    local_partner_name VARCHAR(255),
    partnership_terms JSONB,
    revenue_split_percentage DECIMAL(5, 2),
    
    -- Performance Tracking
    artists_active_in_market INTEGER DEFAULT 0,
    market_share DECIMAL(5, 2) DEFAULT 0.00,
    annual_revenue DECIMAL(12, 2) DEFAULT 0.00,
    roi DECIMAL(8, 2) DEFAULT 0.00,
    
    -- Cultural Adaptation
    localized_content_percentage DECIMAL(5, 2) DEFAULT 0.00,
    local_artist_signings INTEGER DEFAULT 0,
    cultural_missteps INTEGER DEFAULT 0,
    
    expansion_status VARCHAR(30) DEFAULT 'planning' CHECK (expansion_status IN ('planning', 'entering', 'established', 'expanding', 'withdrawing')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- ENHANCED PERFORMANCE INDEXES
-- =====================================================================

-- Social Media Performance Indexes
CREATE INDEX idx_artist_social_media_platform ON artist_social_media(artist_id, platform_id);
CREATE INDEX idx_viral_moments_artist_date ON viral_moments(artist_id, occurred_at);
CREATE INDEX idx_influencer_collaborations_artist ON influencer_collaborations(artist_id);

-- Crisis Management Indexes
CREATE INDEX idx_crisis_events_artist_status ON crisis_events(artist_id, status);
CREATE INDEX idx_crisis_events_severity ON crisis_events(severity DESC);

-- Financial and Investment Indexes
CREATE INDEX idx_label_investments_label_status ON label_investments(label_id, status);
CREATE INDEX idx_catalog_transactions_date ON catalog_transactions(transaction_date);

-- Technology and Market Indexes
CREATE INDEX idx_technology_adoption_label ON technology_adoption(label_id);
CREATE INDEX idx_international_expansion_label ON international_expansion(label_id);

-- Fan Management Indexes
CREATE INDEX idx_fan_segments_artist ON fan_segments(artist_id);
CREATE INDEX idx_fan_campaigns_artist_dates ON fan_engagement_campaigns(artist_id, start_date, end_date);

-- =====================================================================
-- ENHANCED TRIGGERS
-- =====================================================================

-- Trigger for viral moment impact calculation
CREATE OR REPLACE FUNCTION calculate_viral_impact()
RETURNS TRIGGER AS $$
BEGIN
    -- Update artist social media metrics based on viral moment
    UPDATE artist_social_media 
    SET followers_count = followers_count + NEW.follower_gain,
        monthly_views = monthly_views + NEW.peak_views,
        viral_moments = viral_moments + 1
    WHERE artist_id = NEW.artist_id AND platform_id = NEW.platform_id;
    
    -- Update artist reputation
    UPDATE artists 
    SET social_media_followers = social_media_followers + NEW.follower_gain
    WHERE id = NEW.artist_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_viral_impact 
    AFTER INSERT ON viral_moments 
    FOR EACH ROW EXECUTE FUNCTION calculate_viral_impact();

-- Trigger for crisis impact on artist reputation
CREATE OR REPLACE FUNCTION apply_crisis_impact()
RETURNS TRIGGER AS $$
BEGIN
    -- Apply reputation impact when crisis severity changes
    IF NEW.severity != OLD.severity OR NEW.status != OLD.status THEN
        UPDATE artists 
        SET 
            -- Reputation calculation based on crisis severity and resolution
            monthly_streams = GREATEST(0, monthly_streams + (NEW.reputation_impact * 1000)),
            social_media_followers = GREATEST(0, social_media_followers + NEW.reputation_impact * 100)
        WHERE id = NEW.artist_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_crisis_impact 
    AFTER UPDATE ON crisis_events 
    FOR EACH ROW EXECUTE FUNCTION apply_crisis_impact();

-- =====================================================================
-- ENHANCED ROW LEVEL SECURITY
-- =====================================================================

-- Enable RLS on new tables
ALTER TABLE social_media_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE viral_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE label_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE technology_adoption ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE international_expansion ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- ENHANCED INITIAL DATA
-- =====================================================================

-- Insert social media platforms
INSERT INTO social_media_platforms (name, platform_type, viral_threshold, demographic_skew) VALUES
('TikTok', 'short_video', 1000000, '{"primary_age": "16-24", "secondary_age": "25-34"}'),
('Instagram', 'image', 500000, '{"primary_age": "25-34", "secondary_age": "18-24"}'),
('YouTube', 'long_video', 1000000, '{"primary_age": "18-34", "global": true}'),
('Twitter', 'text', 100000, '{"primary_age": "25-44", "high_engagement": true}'),
('Snapchat', 'short_video', 500000, '{"primary_age": "13-24", "ephemeral": true}'),
('Spotify', 'audio', 1000000, '{"primary_age": "18-34", "music_focused": true}');

-- Insert sample crisis types
INSERT INTO crisis_types (name, category, severity_range_min, severity_range_max, typical_duration_days) VALUES
('Substance Abuse Incident', 'personal', 30, 80, 21),
('Social Media Controversy', 'social', 10, 60, 7),
('Legal Trouble', 'legal', 40, 90, 60),
('Relationship Drama', 'personal', 15, 50, 14),
('Cultural Appropriation', 'social', 25, 70, 30),
('Contract Dispute', 'professional', 20, 60, 45),
('Health Issues', 'health', 10, 85, 90),
('Political Statement Backlash', 'political', 20, 75, 21);

-- Insert sample technology disruptions
INSERT INTO technology_disruptions (technology_name, category, emergence_date, investment_required, early_adopter_advantage) VALUES
('AI Music Generation', 'ai_music', '2023-01-01', 50000.00, true),
('Virtual Reality Concerts', 'vr_ar', '2022-06-01', 200000.00, true),
('Blockchain Royalties', 'blockchain', '2021-01-01', 75000.00, true),
('TikTok Algorithm Mastery', 'social_media', '2020-01-01', 25000.00, false),
('Spatial Audio Production', 'production', '2023-03-01', 100000.00, true),
('NFT Music Collectibles', 'blockchain', '2021-05-01', 30000.00, false);

-- Insert sample international markets
INSERT INTO international_markets (country_code, country_name, region, music_market_size, streaming_penetration, popular_genres) VALUES
('JP', 'Japan', 'Asia-Pacific', 2800000000.00, 45.2, '{"J-Pop", "Rock", "Electronic"}'),
('DE', 'Germany', 'Europe', 1600000000.00, 68.1, '{"Pop", "Electronic", "Hip-Hop"}'),
('BR', 'Brazil', 'Latin America', 350000000.00, 72.3, '{"Latin", "Pop", "Hip-Hop", "Rock"}'),
('IN', 'India', 'Asia-Pacific', 150000000.00, 89.4, '{"Bollywood", "Hip-Hop", "Pop"}'),
('MX', 'Mexico', 'Latin America', 290000000.00, 85.7, '{"Latin", "Pop", "Regional Mexican"}'),
('SE', 'Sweden', 'Europe', 180000000.00, 91.2, '{"Pop", "Electronic", "Metal"}');

COMMENT ON SCHEMA public IS 'Enhanced music label management game schema with supercharged features for comprehensive industry simulation';

-- Views for complex analytics
CREATE VIEW artist_performance_summary AS
SELECT 
    a.id,
    a.name,
    a.career_stage,
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT t.id) as total_tours,
    COUNT(DISTINCT vm.id) as viral_moments,
    COUNT(DISTINCT ce.id) as crisis_events,
    AVG(asm.followers_count) as avg_social_followers,
    SUM(p.revenue_generated) as total_revenue
FROM artists a
LEFT JOIN projects p ON a.id = p.artist_id
LEFT JOIN tours t ON a.id = t.artist_id  
LEFT JOIN viral_moments vm ON a.id = vm.artist_id
LEFT JOIN crisis_events ce ON a.id = ce.artist_id
LEFT JOIN artist_social_media asm ON a.id = asm.artist_id
GROUP BY a.id, a.name, a.career_stage;

CREATE VIEW label_market_presence AS
SELECT 
    l.id,
    l.name,
    l.label_tier,
    COUNT(DISTINCT ie.market_id) as international_markets,
    SUM(ie.annual_revenue) as international_revenue,
    AVG(ie.market_share) as avg_market_share
FROM labels l
LEFT JOIN international_expansion ie ON l.id = ie.label_id
WHERE ie.expansion_status = 'established'
GROUP BY l.id, l.name, l.label_tier;