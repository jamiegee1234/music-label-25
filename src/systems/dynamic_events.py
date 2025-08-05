"""
Dynamic Event System for Music Label Tycoon
Generates realistic industry events, crises, and opportunities
"""

import asyncio
import random
import datetime
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field
from enum import Enum
import json

class EventCategory(Enum):
    CRISIS = "crisis"
    OPPORTUNITY = "opportunity"
    MARKET_SHIFT = "market_shift"
    INDUSTRY_DISRUPTION = "industry_disruption"
    ARTIST_EVENT = "artist_event"
    LEGAL_CHALLENGE = "legal_challenge"
    TECHNOLOGY_CHANGE = "technology_change"

class CrisisType(Enum):
    SCANDAL = "scandal"
    LEGAL_ISSUE = "legal_issue"
    HEALTH_CRISIS = "health_crisis"
    SUBSTANCE_ABUSE = "substance_abuse"
    SOCIAL_MEDIA_CONTROVERSY = "social_media_controversy"
    CONTRACT_DISPUTE = "contract_dispute"
    FINANCIAL_TROUBLE = "financial_trouble"
    CREATIVE_BURNOUT = "creative_burnout"

class OpportunityType(Enum):
    VIRAL_MOMENT = "viral_moment"
    COLLABORATION_OFFER = "collaboration_offer"
    SYNC_LICENSING = "sync_licensing"
    FESTIVAL_BREAKTHROUGH = "festival_breakthrough"
    MEDIA_ATTENTION = "media_attention"
    TREND_ALIGNMENT = "trend_alignment"
    CULTURAL_MOMENT = "cultural_moment"
    TECHNOLOGY_ADOPTION = "technology_adoption"

@dataclass
class ResponseOption:
    id: str
    name: str
    description: str
    cost: float
    reputation_impact: float
    effectiveness: float
    time_requirement: int  # days
    prerequisites: List[str] = field(default_factory=list)
    consequences: Dict[str, float] = field(default_factory=dict)

@dataclass
class DynamicEvent:
    id: str
    name: str
    category: EventCategory
    event_type: str  # Specific type within category
    description: str
    trigger_date: datetime.date
    duration_days: int
    severity: float  # 0.1 to 1.0
    affected_entities: List[str]  # Artist IDs, label IDs, etc.
    market_impact: Dict[str, float]
    response_options: List[ResponseOption]
    auto_resolution_effects: Dict[str, float]  # What happens if ignored
    metadata: Dict[str, Any] = field(default_factory=dict)

class DynamicEventEngine:
    def __init__(self, game_state_manager):
        self.game_state = game_state_manager
        self.active_events = {}
        self.event_history = []
        self.probability_matrix = self.load_event_probabilities()
        self.response_tracking = {}
        
    def load_event_probabilities(self) -> Dict[str, Dict[str, float]]:
        """Load probability matrices for different event types"""
        return {
            "base_probabilities": {
                "scandal": 0.02,  # 2% chance per week per artist
                "viral_moment": 0.01,  # 1% chance per week per artist
                "collaboration_opportunity": 0.05,  # 5% chance per week
                "legal_challenge": 0.008,  # 0.8% chance per week
                "health_crisis": 0.003,  # 0.3% chance per week per artist
                "industry_disruption": 0.001,  # 0.1% chance per week globally
                "sync_opportunity": 0.03,  # 3% chance per week per artist
                "festival_breakthrough": 0.015  # 1.5% chance during festival season
            },
            "modifier_factors": {
                "artist_ego_high": {"scandal": 1.5, "social_media_controversy": 2.0},
                "artist_substance_risk": {"health_crisis": 2.5, "scandal": 1.8},
                "genre_trending": {"viral_moment": 1.8, "collaboration_opportunity": 1.4},
                "label_reputation_low": {"legal_challenge": 1.6, "contract_dispute": 2.0},
                "industry_event_active": {"media_attention": 1.5, "festival_breakthrough": 2.2}
            }
        }
    
    async def generate_weekly_events(self, current_date: datetime.date):
        """Generate potential events for the current week"""
        generated_events = []
        
        # Get current game state context
        context = await self.analyze_current_context(current_date)
        
        # Check each event type
        for event_type, base_probability in self.probability_matrix["base_probabilities"].items():
            adjusted_probability = self.calculate_adjusted_probability(
                event_type, base_probability, context
            )
            
            if random.random() < adjusted_probability:
                event = await self.generate_specific_event(event_type, context, current_date)
                if event:
                    generated_events.append(event)
                    
        return generated_events
    
    def calculate_adjusted_probability(self, event_type: str, base_prob: float, context: Dict) -> float:
        """Adjust probability based on current game context"""
        adjusted_prob = base_prob
        
        # Apply context modifiers
        for modifier, factor_dict in self.probability_matrix["modifier_factors"].items():
            if modifier in context and context[modifier]:
                if event_type in factor_dict:
                    adjusted_prob *= factor_dict[event_type]
        
        # Cap probability at reasonable maximum
        return min(adjusted_prob, 0.15)  # Max 15% chance per week
    
    async def generate_specific_event(self, event_type: str, context: Dict, date: datetime.date) -> Optional[DynamicEvent]:
        """Generate a specific type of event"""
        
        if event_type == "scandal":
            return await self.generate_scandal_event(context, date)
        elif event_type == "viral_moment":
            return await self.generate_viral_opportunity(context, date)
        elif event_type == "collaboration_opportunity":
            return await self.generate_collaboration_event(context, date)
        elif event_type == "legal_challenge":
            return await self.generate_legal_event(context, date)
        elif event_type == "health_crisis":
            return await self.generate_health_crisis(context, date)
        elif event_type == "sync_opportunity":
            return await self.generate_sync_opportunity(context, date)
        elif event_type == "festival_breakthrough":
            return await self.generate_festival_event(context, date)
        elif event_type == "industry_disruption":
            return await self.generate_industry_disruption(context, date)
            
        return None
    
    async def generate_scandal_event(self, context: Dict, date: datetime.date) -> DynamicEvent:
        """Generate a scandal crisis event"""
        
        # Select affected artist based on risk factors
        high_risk_artists = [
            artist for artist in context.get('artists', [])
            if artist.get('ego_level', 0) > 7 or artist.get('substance_risk', 0) > 6
        ]
        
        affected_artist = random.choice(high_risk_artists if high_risk_artists else context.get('artists', []))
        
        scandal_types = [
            {
                "name": "Social Media Controversy",
                "description": f"{affected_artist['name']} posts controversial content on social media, sparking outrage",
                "severity": random.uniform(0.3, 0.8),
                "market_impact": {"streaming": -0.15, "brand_partnerships": -0.4, "radio_play": -0.25}
            },
            {
                "name": "Legal Allegations",
                "description": f"{affected_artist['name']} faces serious legal allegations",
                "severity": random.uniform(0.6, 0.9),
                "market_impact": {"streaming": -0.3, "touring": -0.5, "industry_reputation": -0.6}
            },
            {
                "name": "Substance Abuse Incident",
                "description": f"{affected_artist['name']} involved in public substance abuse incident",
                "severity": random.uniform(0.4, 0.7),
                "market_impact": {"touring": -0.4, "brand_partnerships": -0.5, "fan_sentiment": -0.3}
            }
        ]
        
        scandal = random.choice(scandal_types)
        
        response_options = [
            ResponseOption(
                id="immediate_statement",
                name="Issue Immediate Statement",
                description="Release a carefully crafted public statement addressing the situation",
                cost=25000,
                reputation_impact=-0.1,
                effectiveness=0.4,
                time_requirement=1,
                consequences={"media_attention": -0.2, "fan_trust": 0.1}
            ),
            ResponseOption(
                id="crisis_pr_firm",
                name="Hire Crisis PR Firm",
                description="Engage professional crisis management specialists",
                cost=150000,
                reputation_impact=-0.05,
                effectiveness=0.8,
                time_requirement=3,
                prerequisites=["budget_minimum_100k"],
                consequences={"media_spin": 0.5, "long_term_reputation": 0.2}
            ),
            ResponseOption(
                id="legal_team",
                name="Deploy Legal Team",
                description="Have legal team handle all communications and responses",
                cost=100000,
                reputation_impact=-0.15,
                effectiveness=0.6,
                time_requirement=7,
                consequences={"legal_protection": 0.8, "public_perception": -0.1}
            ),
            ResponseOption(
                id="ignore_strategy",
                name="Ignore and Let Pass",
                description="Make no public response and wait for story to fade",
                cost=0,
                reputation_impact=-0.4,
                effectiveness=0.2,
                time_requirement=14,
                consequences={"organic_fade": 0.3, "fan_disappointment": -0.3}
            ),
            ResponseOption(
                id="charity_initiative",
                name="Launch Charity Initiative",
                description="Announce major charitable commitment to redirect attention",
                cost=200000,
                reputation_impact=0.1,
                effectiveness=0.7,
                time_requirement=5,
                consequences={"positive_press": 0.4, "charitable_reputation": 0.3}
            )
        ]
        
        return DynamicEvent(
            id=f"scandal_{affected_artist['id']}_{date.strftime('%Y%m%d')}",
            name=scandal["name"],
            category=EventCategory.CRISIS,
            event_type="scandal",
            description=scandal["description"],
            trigger_date=date,
            duration_days=random.randint(7, 21),
            severity=scandal["severity"],
            affected_entities=[affected_artist["id"]],
            market_impact=scandal["market_impact"],
            response_options=response_options,
            auto_resolution_effects={"reputation": -0.3, "fan_base": -0.15},
            metadata={"scandal_type": scandal["name"], "artist_risk_factors": affected_artist.get("risk_factors", [])}
        )
    
    async def generate_viral_opportunity(self, context: Dict, date: datetime.date) -> DynamicEvent:
        """Generate a viral moment opportunity"""
        
        artists = context.get('artists', [])
        if not artists:
            return None
            
        # Favor artists with high social media presence or trending genres
        trending_artists = [
            artist for artist in artists
            if artist.get('social_media_savvy', 0) > 6 or artist.get('genre') in context.get('trending_genres', [])
        ]
        
        selected_artist = random.choice(trending_artists if trending_artists else artists)
        
        viral_scenarios = [
            {
                "name": "Social Media Challenge",
                "description": f"A dance/music challenge featuring {selected_artist['name']}'s song goes viral on TikTok",
                "impact": {"streaming": 2.5, "social_media_followers": 1.8, "younger_demographic": 2.0},
                "duration": 14
            },
            {
                "name": "Celebrity Endorsement",
                "description": f"Major celebrity unexpectedly promotes {selected_artist['name']}'s music",
                "impact": {"streaming": 1.8, "mainstream_attention": 2.2, "credibility": 1.4},
                "duration": 10
            },
            {
                "name": "Meme Culture Adoption",
                "description": f"{selected_artist['name']}'s song becomes the soundtrack to a popular meme",
                "impact": {"streaming": 2.0, "cultural_relevance": 1.9, "younger_demographic": 2.3},
                "duration": 21
            },
            {
                "name": "Unexpected Cover Version",
                "description": f"Famous artist releases surprise cover of {selected_artist['name']}'s song",
                "impact": {"streaming": 1.6, "industry_respect": 1.7, "cross_genre_appeal": 1.5},
                "duration": 7
            }
        ]
        
        scenario = random.choice(viral_scenarios)
        
        response_options = [
            ResponseOption(
                id="capitalize_immediately",
                name="Capitalize Immediately",
                description="Rush to release content and merchandise to maximize viral moment",
                cost=75000,
                reputation_impact=0.1,
                effectiveness=0.9,
                time_requirement=2,
                consequences={"viral_multiplier": 1.5, "fanbase_growth": 0.3}
            ),
            ResponseOption(
                id="strategic_engagement",
                name="Strategic Social Engagement",
                description="Carefully plan social media strategy to extend viral moment",
                cost=25000,
                reputation_impact=0.05,
                effectiveness=0.7,
                time_requirement=5,
                consequences={"sustained_attention": 0.4, "authentic_connection": 0.2}
            ),
            ResponseOption(
                id="media_tour_blitz",
                name="Emergency Media Tour",
                description="Book immediate interviews and appearances while trending",
                cost=50000,
                reputation_impact=0.15,
                effectiveness=0.8,
                time_requirement=7,
                consequences={"mainstream_exposure": 0.5, "interview_fatigue": -0.1}
            ),
            ResponseOption(
                id="let_organic_growth",
                name="Let It Grow Organically",
                description="Don't interfere, let the viral moment develop naturally",
                cost=0,
                reputation_impact=0.0,
                effectiveness=0.5,
                time_requirement=0,
                consequences={"authentic_virality": 0.3, "missed_opportunities": -0.2}
            )
        ]
        
        return DynamicEvent(
            id=f"viral_{selected_artist['id']}_{date.strftime('%Y%m%d')}",
            name=scenario["name"],
            category=EventCategory.OPPORTUNITY,
            event_type="viral_moment",
            description=scenario["description"],
            trigger_date=date,
            duration_days=scenario["duration"],
            severity=0.0,  # Opportunities don't have negative severity
            affected_entities=[selected_artist["id"]],
            market_impact=scenario["impact"],
            response_options=response_options,
            auto_resolution_effects={"modest_boost": 1.2, "organic_growth": 0.15},
            metadata={"viral_type": scenario["name"], "platform_origin": "social_media"}
        )
    
    async def generate_industry_disruption(self, context: Dict, date: datetime.date) -> DynamicEvent:
        """Generate major industry-wide disruption events"""
        
        disruption_scenarios = [
            {
                "name": "New Streaming Platform Launch",
                "description": "Major tech company launches competing streaming service with revolutionary features",
                "impact": {"industry_uncertainty": 1.3, "new_opportunities": 1.2, "existing_platform_revenue": -0.1},
                "global_effect": True
            },
            {
                "name": "AI Music Generation Breakthrough",
                "description": "AI technology achieves human-level music composition, disrupting creative processes",
                "impact": {"producer_demand": -0.2, "songwriter_market": -0.3, "tech_adoption_pressure": 1.5},
                "global_effect": True
            },
            {
                "name": "Major Label Acquisition",
                "description": "Tech giant acquires one of the Big Three record labels, reshaping industry dynamics",
                "impact": {"market_concentration": 1.4, "artist_contract_uncertainty": 1.2, "innovation_pressure": 1.3},
                "global_effect": True
            },
            {
                "name": "Blockchain Royalty System",
                "description": "New blockchain-based royalty system promises transparent, instant payments to artists",
                "impact": {"royalty_transparency": 1.8, "traditional_system_pressure": -0.2, "tech_adoption": 1.4},
                "global_effect": True
            }
        ]
        
        scenario = random.choice(disruption_scenarios)
        
        response_options = [
            ResponseOption(
                id="early_adopter",
                name="Become Early Adopter",
                description="Immediately invest in and adopt the new technology/system",
                cost=500000,
                reputation_impact=0.2,
                effectiveness=0.8,
                time_requirement=30,
                prerequisites=["tech_team", "budget_minimum_500k"],
                consequences={"innovation_leader": 0.4, "competitive_advantage": 0.3}
            ),
            ResponseOption(
                id="wait_and_see",
                name="Wait and Observe",
                description="Monitor the situation and adopt once proven successful",
                cost=0,
                reputation_impact=0.0,
                effectiveness=0.5,
                time_requirement=90,
                consequences={"late_adoption_penalty": -0.1, "reduced_risk": 0.2}
            ),
            ResponseOption(
                id="coalition_response",
                name="Form Industry Coalition",
                description="Partner with other labels to create coordinated response",
                cost=200000,
                reputation_impact=0.1,
                effectiveness=0.7,
                time_requirement=60,
                consequences={"industry_influence": 0.3, "shared_costs": 0.1}
            )
        ]
        
        return DynamicEvent(
            id=f"disruption_{date.strftime('%Y%m%d')}",
            name=scenario["name"],
            category=EventCategory.INDUSTRY_DISRUPTION,
            event_type="industry_disruption",
            description=scenario["description"],
            trigger_date=date,
            duration_days=random.randint(60, 180),
            severity=0.0,
            affected_entities=["industry_wide"],
            market_impact=scenario["impact"],
            response_options=response_options,
            auto_resolution_effects={"gradual_adaptation": 0.1, "status_quo_erosion": -0.05},
            metadata={"disruption_type": scenario["name"], "global_impact": scenario["global_effect"]}
        )
    
    async def analyze_current_context(self, date: datetime.date) -> Dict[str, Any]:
        """Analyze current game state to inform event generation"""
        # This would integrate with the actual game state manager
        context = {
            "artists": await self.get_current_artists(),
            "trending_genres": await self.get_trending_genres(),
            "market_conditions": await self.get_market_conditions(),
            "label_reputation": await self.get_label_reputation(),
            "active_events": list(self.active_events.keys()),
            "season": self.get_season(date),
            "industry_events_active": await self.check_industry_events(date)
        }
        
        return context
    
    async def trigger_event(self, event: DynamicEvent):
        """Trigger an event and add it to active events"""
        self.active_events[event.id] = event
        
        # Apply immediate market impacts
        await self.apply_market_impacts(event)
        
        # Notify game systems
        await self.notify_event_triggered(event)
        
        return event
    
    async def resolve_event(self, event_id: str, chosen_response: Optional[str] = None):
        """Resolve an event with optional player response"""
        if event_id not in self.active_events:
            return False
            
        event = self.active_events[event_id]
        
        if chosen_response:
            # Player chose a response
            response = next((r for r in event.response_options if r.id == chosen_response), None)
            if response:
                await self.apply_response_effects(event, response)
                self.response_tracking[event_id] = chosen_response
        else:
            # Auto-resolution
            await self.apply_auto_resolution(event)
        
        # Move to history and remove from active
        self.event_history.append(event)
        del self.active_events[event_id]
        
        return True
    
    async def apply_market_impacts(self, event: DynamicEvent):
        """Apply event's market impacts to game state"""
        # This would integrate with actual market simulation
        pass
    
    async def apply_response_effects(self, event: DynamicEvent, response: ResponseOption):
        """Apply the effects of a player's response choice"""
        # Apply costs, reputation changes, and consequences
        pass
    
    async def apply_auto_resolution(self, event: DynamicEvent):
        """Apply effects when event resolves without player intervention"""
        # Apply auto-resolution effects
        pass
    
    async def get_current_artists(self) -> List[Dict]:
        """Get current artists from game state"""
        # Mock data - would integrate with real game state
        return [
            {"id": "artist_1", "name": "Alex Rivers", "ego_level": 8, "substance_risk": 3, "genre": "pop"},
            {"id": "artist_2", "name": "Maya Storm", "ego_level": 5, "substance_risk": 7, "genre": "rock"}
        ]
    
    async def notify_event_triggered(self, event: DynamicEvent):
        """Notify other game systems about the event"""
        # Integration point for event notifications
        pass
    
    def get_season(self, date: datetime.date) -> str:
        """Determine current season for context"""
        month = date.month
        if month in [12, 1, 2]:
            return "winter"
        elif month in [3, 4, 5]:
            return "spring"
        elif month in [6, 7, 8]:
            return "summer"
        else:
            return "autumn"