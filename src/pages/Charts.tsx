import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChartPosition from "@/components/ChartPosition";
import { Chart, Artist } from "@shared/schema";
import { 
  TrendingUp, 
  Trophy, 
  Play, 
  Globe,
  Music,
  BarChart3,
  Calendar,
  Target,
  Star,
  Award,
  ExternalLink,
  Crown,
  TrendingDown,
  Activity
} from "lucide-react";
import { useState } from "react";

export default function Charts() {
  const [selectedChart, setSelectedChart] = useState("global");
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  const { data: charts, isLoading: chartsLoading } = useQuery<Chart[]>({
    queryKey: ["/api/charts"],
  });

  const { data: artists, isLoading: artistsLoading } = useQuery<Artist[]>({
    queryKey: ["/api/artists"],
  });

  const filteredCharts = charts?.filter(chart => {
    const matchesChart = selectedChart === "all" || chart.chartType === selectedChart;
    return matchesChart;
  });

  const sortedCharts = filteredCharts?.sort((a, b) => a.position - b.position) || [];
  const topCharts = sortedCharts.slice(0, 10);
  const labelCharts = sortedCharts.filter(chart => {
    const artist = artists?.find(a => a.id === chart.artistId);
    return artist; // Only show our label's artists
  });

  const getTotalStreams = () => {
    return labelCharts.reduce((sum, chart) => sum + chart.streams, 0);
  };

  const getTopPosition = () => {
    return labelCharts.length > 0 ? Math.min(...labelCharts.map(c => c.position)) : 0;
  };

  const getAveragePosition = () => {
    if (!labelCharts.length) return 0;
    return Math.round(labelCharts.reduce((sum, c) => sum + c.position, 0) / labelCharts.length);
  };

  const getChartingSongs = () => {
    return labelCharts.length;
  };

  const getTop40Songs = () => {
    return labelCharts.filter(c => c.position <= 40).length;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return "text-[var(--fm-success)]";
    if (position <= 10) return "text-[var(--fm-warning)]";
    if (position <= 40) return "text-[var(--fm-accent)]";
    return "text-[var(--fm-text-dim)]";
  };

  const getMovementIcon = (current: number, previous?: number) => {
    if (!previous) return "🆕";
    if (current < previous) return "📈";
    if (current > previous) return "📉";
    return "➖";
  };

  const genreData = [
    { genre: "Pop", growth: "+15%", color: "bg-pink-500/20 text-pink-400", streams: "2.4M" },
    { genre: "Hip-Hop", growth: "+8%", color: "bg-purple-500/20 text-purple-400", streams: "1.8M" },
    { genre: "Rock", growth: "-3%", color: "bg-red-500/20 text-red-400", streams: "950K" },
    { genre: "Electronic", growth: "+22%", color: "bg-blue-500/20 text-blue-400", streams: "3.1M" },
    { genre: "R&B", growth: "+12%", color: "bg-yellow-500/20 text-yellow-400", streams: "1.2M" },
  ];

  if (chartsLoading || artistsLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-[var(--fm-panel)] rounded"></div>
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-[var(--fm-panel)] rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-[var(--fm-panel)] rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-[var(--fm-panel)] border-b border-[var(--fm-border)] flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-[var(--fm-text)]">Charts & Trends</h2>
          <Badge className="bg-[var(--fm-accent)]/20 text-[var(--fm-accent)]">
            {getChartingSongs()} Charting Songs
          </Badge>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--fm-success)] rounded-full animate-pulse"></div>
            <span className="text-xs text-[var(--fm-text-dim)]">Live Data</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="border-[var(--fm-border)] text-[var(--fm-text)]">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button className="bg-[var(--fm-accent)] hover:bg-[var(--fm-accent)]/80 text-white">
            <ExternalLink className="w-4 h-4 mr-2" />
            Full Charts
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[var(--fm-panel)] border border-[var(--fm-border)]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--fm-accent)] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="global" className="data-[state=active]:bg-[var(--fm-accent)] data-[state=active]:text-white">
              Global Charts
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-[var(--fm-accent)] data-[state=active]:text-white">
              Genre Trends
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[var(--fm-accent)] data-[state=active]:text-white">
              Performance Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-6">
              <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)] hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[var(--fm-text-dim)] text-sm font-medium">Charting Songs</h3>
                    <Music className="w-4 h-4 text-[var(--fm-accent)]" />
                  </div>
                  <p className="text-2xl font-bold text-[var(--fm-text)]">{getChartingSongs()}</p>
                  <p className="text-sm text-[var(--fm-success)] mt-1">
                    {getTop40Songs()} in Top 40
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)] hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[var(--fm-text-dim)] text-sm font-medium">Highest Position</h3>
                    <Trophy className="w-4 h-4 text-[var(--fm-warning)]" />
                  </div>
                  <p className={`text-2xl font-bold ${getPositionColor(getTopPosition())}`}>
                    #{getTopPosition() || "—"}
                  </p>
                  <p className="text-sm text-[var(--fm-text-dim)] mt-1">Peak this week</p>
                </CardContent>
              </Card>

              <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)] hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[var(--fm-text-dim)] text-sm font-medium">Total Streams</h3>
                    <Play className="w-4 h-4 text-[var(--fm-success)]" />
                  </div>
                  <p className="text-2xl font-bold text-[var(--fm-text)]">
                    {formatNumber(getTotalStreams())}
                  </p>
                  <p className="text-sm text-[var(--fm-success)] mt-1">This week</p>
                </CardContent>
              </Card>

              <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)] hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[var(--fm-text-dim)] text-sm font-medium">Avg Position</h3>
                    <Target className="w-4 h-4 text-[var(--fm-text-dim)]" />
                  </div>
                  <p className="text-2xl font-bold text-[var(--fm-text)]">
                    #{getAveragePosition() || "—"}
                  </p>
                  <p className="text-sm text-[var(--fm-text-dim)] mt-1">Across all charts</p>
                </CardContent>
              </Card>
            </div>

            {/* Chart Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[var(--fm-text)]">Our Label's Chart Performance</CardTitle>
                    <Globe className="w-5 h-5 text-[var(--fm-accent)]" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {labelCharts.slice(0, 5).map((chart, index) => {
                    const artist = artists?.find(a => a.id === chart.artistId);
                    return (
                      <div key={chart.id} className="relative">
                        {index === 0 && (
                          <div className="absolute top-2 right-2 z-10">
                            <Badge className="bg-[var(--fm-success)] text-white text-xs">
                              <Crown className="w-3 h-3 mr-1" />
                              Best Position
                            </Badge>
                          </div>
                        )}
                        <ChartPosition 
                          chart={chart} 
                          artistName={artist?.stageName}
                        />
                      </div>
                    );
                  })}
                  {labelCharts.length === 0 && (
                    <div className="text-center py-8">
                      <Music className="w-8 h-8 text-[var(--fm-text-dim)] mx-auto mb-3" />
                      <p className="text-sm text-[var(--fm-text-dim)]">
                        No songs currently charting
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)]">
                <CardHeader>
                  <CardTitle className="text-[var(--fm-text)]">Weekly Movement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {labelCharts.slice(0, 5).map((chart) => {
                    const artist = artists?.find(a => a.id === chart.artistId);
                    const movement = chart.previousPosition ? 
                      chart.previousPosition - chart.position : 0;
                    
                    return (
                      <div key={chart.id} className="flex items-center justify-between p-3 bg-[var(--fm-dark)]/30 rounded-lg hover:bg-[var(--fm-dark)]/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">
                            {getMovementIcon(chart.position, chart.previousPosition)}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-[var(--fm-text)]">
                              {artist?.stageName}
                            </p>
                            <p className="text-xs text-[var(--fm-text-dim)]">
                              "{chart.songTitle}"
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${getPositionColor(chart.position)}`}>
                            #{chart.position}
                          </p>
                          {movement !== 0 && (
                            <p className={`text-xs ${movement > 0 ? 'text-[var(--fm-success)]' : 'text-red-400'}`}>
                              {movement > 0 ? '+' : ''}{movement}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Achievement Highlights */}
            <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)]">
              <CardHeader>
                <CardTitle className="text-[var(--fm-text)]">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-[var(--fm-dark)]/30 rounded-lg border-l-4 border-[var(--fm-success)]">
                    <Award className="w-8 h-8 text-[var(--fm-warning)]" />
                    <div>
                      <p className="font-semibold text-[var(--fm-text)]">First Top 10 Hit</p>
                      <p className="text-sm text-[var(--fm-text-dim)]">Marcus Flow - "Street Symphony"</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-[var(--fm-dark)]/30 rounded-lg border-l-4 border-[var(--fm-success)]">
                    <Star className="w-8 h-8 text-[var(--fm-success)]" />
                    <div>
                      <p className="font-semibold text-[var(--fm-text)]">Breakthrough Artist</p>
                      <p className="text-sm text-[var(--fm-text-dim)]">Zara Eclipse enters Top 20</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-[var(--fm-dark)]/30 rounded-lg border-l-4 border-[var(--fm-accent)]">
                    <TrendingUp className="w-8 h-8 text-[var(--fm-accent)]" />
                    <div>
                      <p className="font-semibold text-[var(--fm-text)]">Rising Fast</p>
                      <p className="text-sm text-[var(--fm-text-dim)]">Luna Stone climbs 12 positions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="global" className="space-y-6">
            {/* Chart Filters */}
            <div className="flex items-center space-x-4">
              <Select value={selectedChart} onValueChange={setSelectedChart}>
                <SelectTrigger className="w-48 bg-[var(--fm-panel)] border-[var(--fm-border)] text-[var(--fm-text)]">
                  <SelectValue placeholder="Select chart" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global Charts</SelectItem>
                  <SelectItem value="regional">Regional Charts</SelectItem>
                  <SelectItem value="genre">Genre Charts</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48 bg-[var(--fm-panel)] border-[var(--fm-border)] text-[var(--fm-text)]">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Week</SelectItem>
                  <SelectItem value="last">Last Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Top 10 Global Charts */}
            <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[var(--fm-text)]">
                    Top 10 Global Songs - Week 43, 2024
                  </CardTitle>
                  <Badge className="bg-[var(--fm-accent)]/20 text-[var(--fm-accent)]">
                    <Activity className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {topCharts.map((chart, index) => {
                  const artist = artists?.find(a => a.id === chart.artistId);
                  const isOurArtist = !!artist;
                  
                  return (
                    <div 
                      key={chart.id} 
                      className={`p-3 rounded-lg border ${
                        isOurArtist 
                          ? 'bg-[var(--fm-accent)]/10 border-[var(--fm-accent)]/30' 
                          : 'bg-[var(--fm-dark)]/30 border-[var(--fm-border)]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        {index < 3 && (
                          <Badge className="bg-[var(--fm-success)] text-white text-xs">
                            #{index + 1}
                          </Badge>
                        )}
                        <ChartPosition 
                          chart={chart} 
                          artistName={artist?.stageName || "Unknown Artist"}
                        />
                      </div>
                      {isOurArtist && (
                        <Badge className="ml-8 mt-2 bg-[var(--fm-accent)]/20 text-[var(--fm-accent)] text-xs">
                          Our Label
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Genre Performance */}
            <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)]">
              <CardHeader>
                <CardTitle className="text-[var(--fm-text)]">Genre Trends - This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {genreData.map((genre, i) => (
                    <div key={i} className="p-4 bg-[var(--fm-dark)]/30 rounded-lg border border-[var(--fm-border)] hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={genre.color}>
                          {genre.genre}
                        </Badge>
                        <span className={`text-sm font-semibold ${
                          genre.growth.startsWith('+') ? 'text-[var(--fm-success)]' : 'text-red-400'
                        }`}>
                          {genre.growth}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-[var(--fm-text-dim)]">
                          <span>Streaming Growth</span>
                          <span>{genre.streams} streams</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-2 bg-[var(--fm-border)] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[var(--fm-success)] rounded-full"
                              style={{ width: `${Math.abs(parseInt(genre.growth))}%` }}
                            />
                          </div>
                          <div className="h-2 bg-[var(--fm-border)] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[var(--fm-accent)] rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trend Predictions */}
            <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)]">
              <CardHeader>
                <CardTitle className="text-[var(--fm-text)]">AI Trend Predictions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-[var(--fm-dark)]/30 rounded-lg border-l-4 border-[var(--fm-success)]">
                  <h4 className="font-semibold text-[var(--fm-success)] mb-2">Rising Trend</h4>
                  <p className="text-sm text-[var(--fm-text)]">
                    Afrobeat fusion expected to grow 34% next month based on social media engagement
                  </p>
                </div>
                <div className="p-4 bg-[var(--fm-dark)]/30 rounded-lg border-l-4 border-[var(--fm-warning)]">
                  <h4 className="font-semibold text-[var(--fm-warning)] mb-2">Opportunity</h4>
                  <p className="text-sm text-[var(--fm-text)]">
                    Lo-fi jazz revival predicted for Q1 2025 - consider developing artists in this space
                  </p>
                </div>
                <div className="p-4 bg-[var(--fm-dark)]/30 rounded-lg border-l-4 border-[var(--fm-accent)]">
                  <h4 className="font-semibold text-[var(--fm-accent)] mb-2">Market Insight</h4>
                  <p className="text-sm text-[var(--fm-text)]">
                    Collaborative tracks between genres showing 45% higher chart success rate
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)]">
                <CardHeader>
                  <CardTitle className="text-[var(--fm-text)]">Chart Performance by Artist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {artists?.map((artist) => {
                    const artistCharts = charts?.filter(c => c.artistId === artist.id) || [];
                    const bestPosition = artistCharts.length > 0 ? 
                      Math.min(...artistCharts.map(c => c.position)) : 0;
                    const totalStreams = artistCharts.reduce((sum, c) => sum + c.streams, 0);
                    
                    return (
                      <div key={artist.id} className="flex items-center justify-between p-3 bg-[var(--fm-dark)]/30 rounded-lg hover:bg-[var(--fm-dark)]/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <img
                            src={artist.profileImage || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"}
                            alt={artist.stageName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-[var(--fm-text)]">{artist.stageName}</p>
                            <p className="text-xs text-[var(--fm-text-dim)]">{artistCharts.length} charting songs</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${getPositionColor(bestPosition)}`}>
                            #{bestPosition || "—"}
                          </p>
                          <p className="text-xs text-[var(--fm-text-dim)]">
                            {formatNumber(totalStreams)} streams
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)]">
                <CardHeader>
                  <CardTitle className="text-[var(--fm-text)]">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--fm-text-dim)]">Chart Success Rate</span>
                      <span className="text-[var(--fm-text)]">75%</span>
                    </div>
                    <div className="h-2 bg-[var(--fm-border)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--fm-success)] rounded-full w-3/4" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--fm-text-dim)]">Top 40 Success Rate</span>
                      <span className="text-[var(--fm-text)]">60%</span>
                    </div>
                    <div className="h-2 bg-[var(--fm-border)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--fm-warning)] rounded-full w-3/5" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--fm-text-dim)]">Average Chart Life</span>
                      <span className="text-[var(--fm-text)]">8.5 weeks</span>
                    </div>
                    <div className="h-2 bg-[var(--fm-border)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--fm-accent)] rounded-full w-4/5" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--fm-border)]">
                    <h4 className="font-semibold text-[var(--fm-text)] mb-3">Goals for Next Quarter</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[var(--fm-success)] rounded-full" />
                        <span className="text-[var(--fm-text-dim)]">Achieve first #1 hit</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[var(--fm-warning)] rounded-full" />
                        <span className="text-[var(--fm-text-dim)]">5 songs in Top 40 simultaneously</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[var(--fm-accent)] rounded-full" />
                        <span className="text-[var(--fm-text-dim)]">Break into international markets</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 