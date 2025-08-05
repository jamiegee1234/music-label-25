"""
Chart Simulation Engine for Music Label Tycoon
Simulates realistic chart movements based on streaming, sales, radio, and social data
"""

import asyncio
import datetime
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field
from enum import Enum
import json
import math

class ChartType(Enum):
    BILLBOARD_HOT_100 = "billboard_hot_100"
    UK_OFFICIAL_SINGLES = "uk_official_singles"
    SPOTIFY_GLOBAL_50 = "spotify_global_50"
    APPLE_MUSIC_TOP_100 = "apple_music_top_100"
    GENRE_SPECIFIC = "genre_specific"

class DataSource(Enum):
    STREAMING = "streaming"
    SALES = "sales"
    RADIO = "radio"
    SOCIAL_MEDIA = "social_media"
    DOWNLOADS = "downloads"
    VINYL = "vinyl"

@dataclass
class ChartMetrics:
    streaming_points: float = 0.0
    sales_points: float = 0.0
    radio_points: float = 0.0
    social_points: float = 0.0
    download_points: float = 0.0
    vinyl_points: float = 0.0
    total_points: float = 0.0
    
    def calculate_total(self, weights: Dict[str, float]):
        """Calculate weighted total based on chart-specific weights"""
        self.total_points = (
            self.streaming_points * weights.get('streaming', 0.0) +
            self.sales_points * weights.get('sales', 0.0) +
            self.radio_points * weights.get('radio', 0.0) +
            self.social_points * weights.get('social', 0.0) +
            self.download_points * weights.get('downloads', 0.0) +
            self.vinyl_points * weights.get('vinyl', 0.0)
        )
        return self.total_points

@dataclass
class ChartEntry:
    track_id: str
    artist_name: str
    track_title: str
    current_position: int
    previous_position: Optional[int]
    peak_position: int
    weeks_on_chart: int
    metrics: ChartMetrics
    chart_momentum: float = 0.0  # Positive = rising, negative = falling
    
    def calculate_momentum(self):
        """Calculate chart momentum based on position changes"""
        if self.previous_position is None:
            self.chart_momentum = 10.0  # New entry bonus
        else:
            position_change = self.previous_position - self.current_position
            self.chart_momentum = position_change * 2.0  # Scale momentum
            
            # Apply diminishing returns for high positions
            if self.current_position <= 10:
                self.chart_momentum *= 0.8
                
        return self.chart_momentum

@dataclass
class Chart:
    chart_type: ChartType
    chart_name: str
    entries: List[ChartEntry]
    calculation_date: datetime.date
    weights: Dict[str, float]
    regional_modifiers: Dict[str, float] = field(default_factory=dict)
    
    def get_entry_by_position(self, position: int) -> Optional[ChartEntry]:
        """Get chart entry at specific position"""
        for entry in self.entries:
            if entry.current_position == position:
                return entry
        return None
    
    def get_entry_by_track(self, track_id: str) -> Optional[ChartEntry]:
        """Get chart entry for specific track"""
        for entry in self.entries:
            if entry.track_id == track_id:
                return entry
        return None

class ChartSimulationEngine:
    def __init__(self, api_integrator, market_data_provider):
        self.api_integrator = api_integrator
        self.market_data = market_data_provider
        self.chart_history = {}
        self.current_charts = {}
        
        # Chart-specific calculation weights
        self.chart_weights = {
            ChartType.BILLBOARD_HOT_100: {
                'streaming': 0.45,
                'sales': 0.25,
                'radio': 0.20,
                'social': 0.10
            },
            ChartType.UK_OFFICIAL_SINGLES: {
                'streaming': 0.50,
                'sales': 0.30,
                'downloads': 0.15,
                'vinyl': 0.05
            },
            ChartType.SPOTIFY_GLOBAL_50: {
                'streaming': 1.0
            },
            ChartType.APPLE_MUSIC_TOP_100: {
                'streaming': 0.85,
                'sales': 0.15
            }
        }
        
        # Regional multipliers for international charts
        self.regional_multipliers = {
            ChartType.BILLBOARD_HOT_100: {
                'us': 1.0, 'ca': 0.1, 'mx': 0.05
            },
            ChartType.UK_OFFICIAL_SINGLES: {
                'gb': 1.0, 'ie': 0.15, 'au': 0.05
            },
            ChartType.SPOTIFY_GLOBAL_50: {
                'global': 1.0
            }
        }
    
    async def calculate_weekly_charts(self, calculation_date: datetime.date):
        """Calculate all chart positions for the given week"""
        calculated_charts = {}
        
        for chart_type in ChartType:
            try:
                chart = await self.calculate_chart(chart_type, calculation_date)
                calculated_charts[chart_type] = chart
                self.current_charts[chart_type] = chart
                
                # Store in history
                if chart_type not in self.chart_history:
                    self.chart_history[chart_type] = []
                self.chart_history[chart_type].append(chart)
                
            except Exception as e:
                print(f"Error calculating {chart_type.value}: {e}")
                
        return calculated_charts
    
    async def calculate_chart(self, chart_type: ChartType, date: datetime.date) -> Chart:
        """Calculate a specific chart for the given date"""
        
        # Get eligible tracks (tracks with sufficient data and meeting criteria)
        eligible_tracks = await self.get_eligible_tracks(chart_type, date)
        
        # Calculate metrics for each track
        chart_entries = []
        for track in eligible_tracks:
            metrics = await self.calculate_track_metrics(track, chart_type, date)
            
            entry = ChartEntry(
                track_id=track['id'],
                artist_name=track['artist_name'],
                track_title=track['title'],
                current_position=0,  # Will be set after sorting
                previous_position=await self.get_previous_position(track['id'], chart_type),
                peak_position=await self.get_peak_position(track['id'], chart_type),
                weeks_on_chart=await self.get_weeks_on_chart(track['id'], chart_type),
                metrics=metrics
            )
            
            chart_entries.append(entry)
        
        # Sort by total points and assign positions
        chart_entries.sort(key=lambda x: x.metrics.total_points, reverse=True)
        
        for i, entry in enumerate(chart_entries[:100]):  # Top 100
            entry.current_position = i + 1
            entry.calculate_momentum()
        
        return Chart(
            chart_type=chart_type,
            chart_name=self.get_chart_display_name(chart_type),
            entries=chart_entries[:100],
            calculation_date=date,
            weights=self.chart_weights[chart_type],
            regional_modifiers=self.regional_multipliers.get(chart_type, {})
        )
    
    async def calculate_track_metrics(self, track: Dict, chart_type: ChartType, date: datetime.date) -> ChartMetrics:
        """Calculate comprehensive metrics for a track"""
        
        metrics = ChartMetrics()
        
        # Get raw data from various sources
        streaming_data = await self.get_streaming_data(track['id'], date)
        sales_data = await self.get_sales_data(track['id'], date)
        radio_data = await self.get_radio_data(track['id'], date)
        social_data = await self.get_social_data(track['id'], date)
        
        # Calculate streaming points
        metrics.streaming_points = await self.calculate_streaming_points(
            streaming_data, chart_type
        )
        
        # Calculate sales points
        metrics.sales_points = await self.calculate_sales_points(
            sales_data, chart_type
        )
        
        # Calculate radio points
        metrics.radio_points = await self.calculate_radio_points(
            radio_data, chart_type
        )
        
        # Calculate social media points
        metrics.social_points = await self.calculate_social_points(
            social_data, chart_type
        )
        
        # Calculate weighted total
        weights = self.chart_weights[chart_type]
        metrics.calculate_total(weights)
        
        # Apply regional and demographic modifiers
        metrics.total_points = await self.apply_regional_modifiers(
            metrics.total_points, track, chart_type
        )
        
        return metrics
    
    async def calculate_streaming_points(self, streaming_data: Dict, chart_type: ChartType) -> float:
        """Calculate points from streaming data"""
        if not streaming_data:
            return 0.0
        
        # Base streaming count
        total_streams = streaming_data.get('weekly_streams', 0)
        
        # Platform-specific multipliers
        platform_multipliers = {
            'spotify': 1.0,
            'apple_music': 0.95,
            'youtube_music': 0.85,
            'amazon_music': 0.8,
            'tidal': 0.75
        }
        
        weighted_streams = 0
        for platform, streams in streaming_data.get('platform_breakdown', {}).items():
            multiplier = platform_multipliers.get(platform, 0.5)
            weighted_streams += streams * multiplier
        
        # Apply logarithmic scaling to prevent dominance of mega-hits
        if weighted_streams > 0:
            points = math.log10(weighted_streams) * 100
        else:
            points = 0
        
        # Bonus for playlist placements
        playlist_bonus = 0
        for playlist, placement_data in streaming_data.get('playlist_placements', {}).items():
            playlist_multipliers = {
                'today_top_hits': 50,
                'rapcaviar': 35,
                'hot_country': 30,
                'discover_weekly': 20,
                'release_radar': 15
            }
            
            bonus = playlist_multipliers.get(playlist, 5)
            playlist_bonus += bonus * placement_data.get('weeks_on_playlist', 1)
        
        return points + playlist_bonus
    
    async def calculate_sales_points(self, sales_data: Dict, chart_type: ChartType) -> float:
        """Calculate points from sales data"""
        if not sales_data:
            return 0.0
        
        # Different sales types with different weights
        sales_multipliers = {
            'digital_download': 1.0,
            'physical_cd': 1.2,  # Slightly higher weight for physical
            'vinyl': 1.5,  # Premium weight for vinyl
            'cassette': 1.3  # Novelty factor
        }
        
        total_points = 0
        for sale_type, units in sales_data.get('sales_breakdown', {}).items():
            multiplier = sales_multipliers.get(sale_type, 1.0)
            total_points += units * multiplier * 10  # Scale factor
        
        # Regional sales bonuses
        if chart_type == ChartType.UK_OFFICIAL_SINGLES:
            uk_sales = sales_data.get('regional_sales', {}).get('gb', 0)
            total_points += uk_sales * 5  # UK bonus for UK charts
        
        return total_points
    
    async def calculate_radio_points(self, radio_data: Dict, chart_type: ChartType) -> float:
        """Calculate points from radio airplay"""
        if not radio_data:
            return 0.0
        
        # Radio station tier multipliers
        station_multipliers = {
            'tier_1_major_market': 10.0,  # Top 10 markets
            'tier_2_medium_market': 6.0,  # Medium markets
            'tier_3_small_market': 3.0,   # Smaller markets
            'streaming_radio': 1.5,       # Online radio
            'satellite': 4.0               # Satellite radio
        }
        
        total_points = 0
        for station_tier, airplay_data in radio_data.get('airplay_breakdown', {}).items():
            multiplier = station_multipliers.get(station_tier, 1.0)
            spins = airplay_data.get('weekly_spins', 0)
            audience_reach = airplay_data.get('audience_reach', 1)
            
            # Points = spins × reach × tier multiplier
            points = spins * math.log10(max(audience_reach, 1)) * multiplier
            total_points += points
        
        # Peak hour bonus (drive time gets bonus)
        peak_spins = radio_data.get('peak_hour_spins', 0)
        total_points += peak_spins * 5
        
        return total_points
    
    async def calculate_social_points(self, social_data: Dict, chart_type: ChartType) -> float:
        """Calculate points from social media activity"""
        if not social_data:
            return 0.0
        
        # Platform-specific multipliers
        platform_multipliers = {
            'tiktok': 2.0,      # Highest impact on charts
            'instagram': 1.5,
            'twitter': 1.2,
            'youtube': 1.8,
            'facebook': 1.0
        }
        
        total_points = 0
        for platform, metrics in social_data.get('platform_metrics', {}).items():
            multiplier = platform_multipliers.get(platform, 1.0)
            
            # Different metrics have different weights
            mentions = metrics.get('mentions', 0) * 0.1
            shares = metrics.get('shares', 0) * 0.5
            video_uses = metrics.get('video_uses', 0) * 1.0  # TikTok videos, etc.
            hashtag_uses = metrics.get('hashtag_uses', 0) * 0.3
            
            platform_points = (mentions + shares + video_uses + hashtag_uses) * multiplier
            total_points += platform_points
        
        # Viral trend bonus
        if social_data.get('is_trending', False):
            total_points *= 1.5
        
        # Influencer endorsement bonus
        influencer_tier_bonus = {
            'mega_influencer': 100,    # 10M+ followers
            'macro_influencer': 50,    # 1M-10M followers
            'micro_influencer': 20     # 100K-1M followers
        }
        
        for tier, count in social_data.get('influencer_mentions', {}).items():
            bonus = influencer_tier_bonus.get(tier, 0)
            total_points += bonus * count
        
        return total_points
    
    async def apply_regional_modifiers(self, base_points: float, track: Dict, chart_type: ChartType) -> float:
        """Apply regional and demographic modifiers"""
        
        # Get track's regional performance
        regional_data = await self.get_regional_performance(track['id'])
        
        modified_points = base_points
        
        # Apply regional multipliers
        if chart_type in self.regional_multipliers:
            for region, multiplier in self.regional_multipliers[chart_type].items():
                regional_performance = regional_data.get(region, 0)
                # Add bonus based on regional strength
                regional_bonus = regional_performance * multiplier * 0.1
                modified_points += regional_bonus
        
        # Genre-specific bonuses for certain charts
        genre_bonuses = await self.get_genre_bonuses(track['genre'], chart_type)
        modified_points += genre_bonuses
        
        return modified_points
    
    async def get_eligible_tracks(self, chart_type: ChartType, date: datetime.date) -> List[Dict]:
        """Get tracks eligible for chart inclusion"""
        
        # Mock data - in real implementation, this would query the game database
        # and apply eligibility rules (release date requirements, minimum thresholds, etc.)
        
        eligible_tracks = [
            {
                'id': 'track_001',
                'title': 'Summer Nights',
                'artist_name': 'Alex Rivers',
                'genre': 'pop',
                'release_date': date - datetime.timedelta(days=14),
                'label_id': 'label_001'
            },
            {
                'id': 'track_002',
                'title': 'Midnight Drive',
                'artist_name': 'Maya Storm',
                'genre': 'rock',
                'release_date': date - datetime.timedelta(days=21),
                'label_id': 'label_002'
            }
            # Add more tracks from game state
        ]
        
        # Apply eligibility filters
        filtered_tracks = []
        for track in eligible_tracks:
            if await self.meets_chart_criteria(track, chart_type, date):
                filtered_tracks.append(track)
        
        return filtered_tracks
    
    async def meets_chart_criteria(self, track: Dict, chart_type: ChartType, date: datetime.date) -> bool:
        """Check if track meets chart eligibility criteria"""
        
        # Basic criteria all tracks must meet
        release_date = track.get('release_date')
        if not release_date or (date - release_date).days > 365:  # Max 1 year old
            return False
        
        # Chart-specific criteria
        if chart_type == ChartType.BILLBOARD_HOT_100:
            # Must have sufficient US activity
            us_streams = await self.get_regional_streams(track['id'], 'us')
            return us_streams > 10000  # Minimum threshold
            
        elif chart_type == ChartType.UK_OFFICIAL_SINGLES:
            # Must have UK activity
            uk_activity = await self.get_regional_activity(track['id'], 'gb')
            return uk_activity > 5000
            
        elif chart_type == ChartType.SPOTIFY_GLOBAL_50:
            # Must be on Spotify
            spotify_streams = await self.get_platform_streams(track['id'], 'spotify')
            return spotify_streams > 50000
        
        return True
    
    async def get_streaming_data(self, track_id: str, date: datetime.date) -> Dict:
        """Get streaming data for a track"""
        # Mock implementation - would integrate with real APIs
        return {
            'weekly_streams': 1500000,
            'platform_breakdown': {
                'spotify': 800000,
                'apple_music': 400000,
                'youtube_music': 200000,
                'amazon_music': 100000
            },
            'playlist_placements': {
                'today_top_hits': {'weeks_on_playlist': 2, 'position': 15},
                'discover_weekly': {'weeks_on_playlist': 1, 'position': 8}
            }
        }
    
    async def get_sales_data(self, track_id: str, date: datetime.date) -> Dict:
        """Get sales data for a track"""
        return {
            'sales_breakdown': {
                'digital_download': 5000,
                'physical_cd': 1200,
                'vinyl': 800
            },
            'regional_sales': {
                'us': 4000,
                'gb': 1500,
                'ca': 800
            }
        }
    
    async def get_radio_data(self, track_id: str, date: datetime.date) -> Dict:
        """Get radio airplay data for a track"""
        return {
            'airplay_breakdown': {
                'tier_1_major_market': {'weekly_spins': 150, 'audience_reach': 2000000},
                'tier_2_medium_market': {'weekly_spins': 300, 'audience_reach': 800000},
                'satellite': {'weekly_spins': 80, 'audience_reach': 500000}
            },
            'peak_hour_spins': 45
        }
    
    async def get_social_data(self, track_id: str, date: datetime.date) -> Dict:
        """Get social media data for a track"""
        return {
            'platform_metrics': {
                'tiktok': {'mentions': 1200, 'video_uses': 850, 'hashtag_uses': 2200},
                'instagram': {'mentions': 800, 'shares': 400, 'hashtag_uses': 1100},
                'twitter': {'mentions': 600, 'shares': 250, 'hashtag_uses': 300}
            },
            'is_trending': False,
            'influencer_mentions': {
                'macro_influencer': 2,
                'micro_influencer': 8
            }
        }
    
    async def get_previous_position(self, track_id: str, chart_type: ChartType) -> Optional[int]:
        """Get track's previous chart position"""
        # Look up in chart history
        if chart_type in self.chart_history and self.chart_history[chart_type]:
            last_chart = self.chart_history[chart_type][-1]
            entry = last_chart.get_entry_by_track(track_id)
            return entry.current_position if entry else None
        return None
    
    async def get_peak_position(self, track_id: str, chart_type: ChartType) -> int:
        """Get track's peak position on this chart"""
        peak = 101  # Below chart if never charted
        
        if chart_type in self.chart_history:
            for chart in self.chart_history[chart_type]:
                entry = chart.get_entry_by_track(track_id)
                if entry and entry.current_position < peak:
                    peak = entry.current_position
        
        return peak
    
    async def get_weeks_on_chart(self, track_id: str, chart_type: ChartType) -> int:
        """Get number of weeks track has been on chart"""
        weeks = 0
        
        if chart_type in self.chart_history:
            for chart in self.chart_history[chart_type]:
                entry = chart.get_entry_by_track(track_id)
                if entry:
                    weeks += 1
        
        return weeks
    
    def get_chart_display_name(self, chart_type: ChartType) -> str:
        """Get human-readable chart name"""
        names = {
            ChartType.BILLBOARD_HOT_100: "Billboard Hot 100",
            ChartType.UK_OFFICIAL_SINGLES: "UK Official Singles Chart",
            ChartType.SPOTIFY_GLOBAL_50: "Spotify Global Top 50",
            ChartType.APPLE_MUSIC_TOP_100: "Apple Music Top 100"
        }
        return names.get(chart_type, chart_type.value)
    
    async def get_chart_analytics(self, chart_type: ChartType, weeks: int = 4) -> Dict:
        """Get analytics for chart performance over time"""
        if chart_type not in self.chart_history:
            return {}
        
        recent_charts = self.chart_history[chart_type][-weeks:]
        
        analytics = {
            'average_new_entries': 0,
            'highest_climber': None,
            'biggest_drop': None,
            'most_stable': None,
            'genre_distribution': {},
            'label_performance': {}
        }
        
        # Calculate analytics from recent chart data
        # Implementation would analyze trends, movements, etc.
        
        return analytics