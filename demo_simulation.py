#!/usr/bin/env python3
"""
Music Label Tycoon - Live Calendar Demonstration
Shows integration of real-world events, API data, and dynamic simulation
"""

import asyncio
import datetime
import json
from pathlib import Path

# Import our custom systems
from src.systems.master_integration import MusicIndustrySimulator, GameState
from src.systems.calendar_manager import EventType, EventImpact
from src.systems.dynamic_events import EventCategory, CrisisType
from src.systems.chart_simulation import ChartType

class DemoDatabase:
    """Mock database session for demonstration"""
    def __init__(self):
        self.data = {}

async def run_live_simulation_demo():
    """Demonstrate the live calendar and event system"""
    
    print("🎵 MUSIC LABEL TYCOON - Live Industry Simulation")
    print("=" * 60)
    
    # Initialize simulation
    db_session = DemoDatabase()
    simulator = MusicIndustrySimulator(db_session)
    
    # Setup initial label configuration
    label_config = {
        'label_id': 'demo_label_001',
        'initial_reputation': 65.0,
        'initial_budget': 2500000.0,
        'initial_artists': [
            {
                'id': 'artist_001',
                'name': 'Alex Rivers',
                'genre': 'pop',
                'ego_level': 6,
                'substance_risk': 3,
                'social_media_savvy': 8,
                'fan_base': 250000,
                'track_ids': ['track_001', 'track_002']
            },
            {
                'id': 'artist_002', 
                'name': 'Maya Storm',
                'genre': 'rock',
                'ego_level': 7,
                'substance_risk': 5,
                'social_media_savvy': 6,
                'fan_base': 180000,
                'track_ids': ['track_003']
            },
            {
                'id': 'artist_003',
                'name': 'DJ Pulse',
                'genre': 'electronic',
                'ego_level': 4,
                'substance_risk': 2,
                'social_media_savvy': 9,
                'fan_base': 400000,
                'track_ids': ['track_004', 'track_005']
            }
        ]
    }
    
    # Start simulation on January 1, 2025
    start_date = datetime.date(2025, 1, 1)
    await simulator.initialize_simulation(start_date, label_config)
    
    print(f"🏢 Initialized '{label_config['label_id']}' with {len(label_config['initial_artists'])} artists")
    print(f"💰 Starting budget: ${label_config['initial_budget']:,}")
    print(f"⭐ Starting reputation: {label_config['initial_reputation']}/100")
    print()
    
    # Demonstrate calendar events for different months
    months_to_simulate = [
        (datetime.date(2025, 1, 15), "Mid-January: NAMM Show Period"),
        (datetime.date(2025, 2, 9), "Grammy Awards Week"),
        (datetime.date(2025, 3, 10), "SXSW Festival Period"),
        (datetime.date(2025, 4, 15), "Coachella Season"),
        (datetime.date(2025, 7, 15), "Summer Festival Peak"),
        (datetime.date(2025, 12, 15), "Holiday Music Season")
    ]
    
    for target_date, description in months_to_simulate:
        print(f"📅 SIMULATING: {description}")
        print("-" * 50)
        
        # Jump to target date
        simulator.game_state.current_date = target_date
        
        # Get current industry events
        current_events = await simulator.calendar.get_current_events(target_date)
        upcoming_events = await simulator.calendar.get_upcoming_events(14)
        
        print(f"🎪 Active Industry Events ({len(current_events)}):")
        for event in current_events:
            impact_emoji = "🔥" if event.impact_level == EventImpact.CRITICAL else "⚡" if event.impact_level == EventImpact.HIGH else "📈"
            print(f"   {impact_emoji} {event.name} ({event.event_type.value})")
            print(f"      Duration: {event.duration_days} days")
            print(f"      Market Effects: {', '.join(event.market_modifiers.keys())}")
            print(f"      Opportunities: {len(event.opportunities)}")
        
        if not current_events:
            print("   No major industry events active")
        
        print()
        print(f"🔮 Upcoming Events (Next 2 weeks):")
        for event in upcoming_events[:3]:
            days_until = (event.date - target_date).days
            print(f"   📆 {event.name} in {days_until} days ({event.date.strftime('%b %d')})")
        
        # Show market opportunities for our artists
        print()
        print("💡 Current Market Opportunities:")
        all_opportunities = []
        for artist in simulator.game_state.artists:
            opportunities = await simulator.calendar.get_genre_opportunities(artist['genre'], target_date)
            for opp in opportunities:
                opp['artist'] = artist['name']
                all_opportunities.append(opp)
        
        if all_opportunities:
            for opp in all_opportunities[:5]:  # Show top 5
                boost_pct = opp['value'] * 100 if 'value' in opp else 0
                print(f"   🎯 {opp['artist']}: {opp['type']} (+{boost_pct:.0f}% boost)")
        else:
            print("   No specific opportunities detected")
        
        # Simulate some dynamic events
        print()
        print("🎲 Dynamic Event Simulation:")
        generated_events = await simulator.dynamic_events.generate_weekly_events(target_date)
        
        if generated_events:
            for event in generated_events[:2]:  # Show first 2 events
                category_emoji = "🚨" if event.category == EventCategory.CRISIS else "✨"
                print(f"   {category_emoji} {event.name}")
                print(f"      {event.description}")
                print(f"      Severity: {event.severity:.1f}/1.0" if event.severity > 0 else "      Opportunity Level: High")
                print(f"      Response Options: {len(event.response_options)}")
        else:
            print("   No dynamic events generated this week")
        
        # Show seasonal trends
        seasonal_trends = await simulator.calendar.trigger_seasonal_trends(target_date)
        if seasonal_trends:
            print()
            print("🌍 Seasonal Market Trends:")
            for trend, multiplier in seasonal_trends.items():
                trend_direction = "📈" if multiplier > 1.0 else "📉"
                print(f"   {trend_direction} {trend.replace('_', ' ').title()}: {multiplier:.1f}x")
        
        print()
        print("=" * 60)
        print()
    
    # Demonstrate chart simulation
    print("📊 CHART SIMULATION DEMO")
    print("-" * 50)
    
    # Simulate charts for current week
    current_charts = await simulator.chart_engine.calculate_weekly_charts(datetime.date(2025, 2, 10))
    
    for chart_type, chart in current_charts.items():
        if chart_type == ChartType.BILLBOARD_HOT_100:  # Show Billboard as example
            print(f"🏆 {chart.chart_name} - Week of {chart.calculation_date}")
            print("Top 10 Positions:")
            
            for entry in chart.entries[:10]:
                momentum_emoji = "🔼" if entry.chart_momentum > 0 else "🔽" if entry.chart_momentum < 0 else "➡️"
                position_str = f"#{entry.current_position:2d}"
                
                # Check if this is one of our artists
                our_artist = any(entry.track_id in artist.get('track_ids', []) for artist in simulator.game_state.artists)
                artist_marker = "⭐" if our_artist else "  "
                
                print(f"   {position_str} {momentum_emoji} {artist_marker} {entry.artist_name} - {entry.track_title}")
                
                if our_artist:
                    print(f"        💰 Streaming boost: +{entry.metrics.streaming_points:.0f} points")
    
    # Show financial impact simulation
    print()
    print("💰 FINANCIAL IMPACT SIMULATION")
    print("-" * 50)
    
    # Simulate weekly revenue from various sources
    simulated_revenue = {
        'streaming_royalties': 45000,
        'sync_licensing': 25000,
        'touring_revenue': 120000,
        'merchandise': 18000,
        'chart_performance_bonus': 35000
    }
    
    total_weekly = sum(simulated_revenue.values())
    print(f"Weekly Revenue Breakdown:")
    for source, amount in simulated_revenue.items():
        percentage = (amount / total_weekly) * 100
        print(f"   {source.replace('_', ' ').title()}: ${amount:,} ({percentage:.1f}%)")
    
    print(f"\n💵 Total Weekly Revenue: ${total_weekly:,}")
    print(f"📈 Projected Annual Revenue: ${total_weekly * 52:,}")
    
    # Show strategic recommendations
    print()
    print("🎯 AI STRATEGIC RECOMMENDATIONS")
    print("-" * 50)
    
    recommendations = await simulator.generate_strategic_recommendations(datetime.date(2025, 2, 15))
    for i, rec in enumerate(recommendations, 1):
        print(f"{i}. {rec}")
    
    print()
    print("🎉 SIMULATION DEMO COMPLETE")
    print("=" * 60)
    print("This demonstration shows:")
    print("• Real-time industry calendar integration")
    print("• Dynamic event generation and response systems")
    print("• Chart simulation with realistic algorithms")
    print("• Market opportunity identification")
    print("• Financial impact modeling")
    print("• AI-powered strategic recommendations")
    print()
    print("The system integrates real-world APIs for:")
    print("• Spotify streaming data")
    print("• MusicBrainz artist information")
    print("• Last.fm demographic analytics")
    print("• Chart position tracking")
    print("• Social media trend analysis")

def print_system_overview():
    """Print overview of the integrated systems"""
    print("\n🏗️  SYSTEM ARCHITECTURE OVERVIEW")
    print("=" * 60)
    
    systems = {
        "🗓️  Calendar Manager": [
            "52-week industry event calendar",
            "Real-world festival and awards integration",
            "Seasonal trend modeling",
            "Market opportunity identification"
        ],
        "⚡ Dynamic Event Engine": [
            "Crisis and opportunity generation",
            "Realistic probability modeling",
            "Multi-choice response systems",
            "Long-term consequence tracking"
        ],
        "📊 Chart Simulation": [
            "Billboard Hot 100 algorithm",
            "UK Official Charts modeling",
            "Streaming platform integration",
            "Radio airplay calculations"
        ],
        "🔗 API Integration": [
            "Spotify real-time metrics",
            "MusicBrainz discography data",
            "Last.fm demographic analytics",
            "Social media trend tracking"
        ],
        "🧠 Master Coordinator": [
            "Cross-system event propagation",
            "Market condition synthesis",
            "Strategic recommendation AI",
            "Financial impact modeling"
        ]
    }
    
    for system_name, features in systems.items():
        print(f"\n{system_name}")
        print("-" * (len(system_name) - 2))
        for feature in features:
            print(f"  • {feature}")
    
    print(f"\n🎮 TOTAL INTEGRATION FEATURES: {sum(len(features) for features in systems.values())}")

if __name__ == "__main__":
    print_system_overview()
    print("\n" + "=" * 60)
    
    # Run the main simulation demo
    asyncio.run(run_live_simulation_demo())