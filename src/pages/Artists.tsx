import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ArtistCard from "@/components/ArtistCard";
import { Artist } from "@shared/schema";
import { Search, Plus, Filter, Users, TrendingUp, Star, Music, Target } from "lucide-react";
import { useState } from "react";

export default function Artists() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState<"performance" | "streams" | "name" | "growth">("performance");

  const { data: artists, isLoading } = useQuery<Artist[]>({
    queryKey: ["/api/artists"],
  });

  const filteredArtists = artists?.filter(artist => {
    const matchesSearch = artist.stageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "all" || artist.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const sortedArtists = filteredArtists?.sort((a, b) => {
    switch (sortBy) {
      case "performance":
        return b.performanceRating - a.performanceRating;
      case "streams":
        return b.monthlyStreams - a.monthlyStreams;
      case "name":
        return a.stageName.localeCompare(b.stageName);
      case "growth":
        return (parseFloat(b.socialGrowthRate || "0") - parseFloat(a.socialGrowthRate || "0"));
      default:
        return 0;
    }
  });

  const genres = Array.from(new Set(artists?.map(a => a.genre) || []));

  const getAverageRating = () => {
    if (!artists?.length) return 0;
    return Math.round(artists.reduce((sum, a) => sum + a.performanceRating, 0) / artists.length);
  };

  const getTotalStreams = () => {
    if (!artists?.length) return 0;
    return artists.reduce((sum, a) => sum + a.monthlyStreams, 0);
  };

  const getTopPerformers = () => {
    return artists?.filter(a => a.performanceRating >= 85).length || 0;
  };

  const getAverageGrowth = () => {
    if (!artists?.length) return 0;
    const totalGrowth = artists.reduce((sum, a) => sum + parseFloat(a.socialGrowthRate || "0"), 0);
    return Math.round(totalGrowth / artists.length);
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

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-[var(--fm-panel)] rounded mb-6"></div>
          <div className="grid grid-cols-4 gap-6 mb-8">
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
          <h2 className="text-xl font-semibold text-[var(--fm-text)]">Artist Roster</h2>
          <Badge className="bg-[var(--fm-accent)]/20 text-[var(--fm-accent)]">
            {artists?.length || 0} Active
          </Badge>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--fm-success)] rounded-full animate-pulse"></div>
            <span className="text-xs text-[var(--fm-text-dim)]">Live Updates</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="border-[var(--fm-border)] text-[var(--fm-text)]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[var(--fm-accent)] hover:bg-[var(--fm-accent)]/80 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Sign Artist
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)] hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[var(--fm-text-dim)] text-sm font-medium">Total Artists</h3>
                <Users className="w-4 h-4 text-[var(--fm-accent)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--fm-text)]">{artists?.length || 0}</p>
              <p className="text-xs text-[var(--fm-success)] mt-1">
                {artists?.filter(a => a.isActive).length || 0} currently active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)] hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[var(--fm-text-dim)] text-sm font-medium">Avg Performance</h3>
                <Star className="w-4 h-4 text-[var(--fm-success)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--fm-text)]">{getAverageRating()}/100</p>
              <p className="text-xs text-[var(--fm-success)] mt-1">
                {getTopPerformers()} top performers
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)] hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[var(--fm-text-dim)] text-sm font-medium">Total Streams</h3>
                <Music className="w-4 h-4 text-[var(--fm-warning)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--fm-text)]">
                {formatNumber(getTotalStreams())}
              </p>
              <p className="text-xs text-[var(--fm-success)] mt-1">
                +{getAverageGrowth()}% avg growth
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)] hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[var(--fm-text-dim)] text-sm font-medium">Genres</h3>
                <Target className="w-4 h-4 text-[var(--fm-text-dim)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--fm-text)]">{genres.length}</p>
              <p className="text-xs text-[var(--fm-text-dim)] mt-1">
                {artists?.filter(a => a.genre === genres[0]).length || 0} in {genres[0]}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--fm-text-dim)]" />
            <Input
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[var(--fm-panel)] border-[var(--fm-border)] text-[var(--fm-text)]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedGenre === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGenre("all")}
              className={selectedGenre === "all" ? 
                "bg-[var(--fm-accent)] text-white" : 
                "border-[var(--fm-border)] text-[var(--fm-text)]"
              }
            >
              All
            </Button>
            {genres.slice(0, 5).map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGenre(genre)}
                className={selectedGenre === genre ? 
                  "bg-[var(--fm-accent)] text-white" : 
                  "border-[var(--fm-border)] text-[var(--fm-text)]"
                }
              >
                {genre}
              </Button>
            ))}
            {genres.length > 5 && (
              <Badge className="bg-[var(--fm-accent)]/20 text-[var(--fm-accent)]">
                +{genres.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        {/* Sort Options */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[var(--fm-text-dim)]">Sort by:</span>
            <Button
              variant={sortBy === "performance" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("performance")}
              className={sortBy === "performance" ? 
                "bg-[var(--fm-accent)] text-white" : 
                "border-[var(--fm-border)] text-[var(--fm-text)]"
              }
            >
              Performance
            </Button>
            <Button
              variant={sortBy === "streams" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("streams")}
              className={sortBy === "streams" ? 
                "bg-[var(--fm-accent)] text-white" : 
                "border-[var(--fm-border)] text-[var(--fm-text)]"
              }
            >
              Streams
            </Button>
            <Button
              variant={sortBy === "growth" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("growth")}
              className={sortBy === "growth" ? 
                "bg-[var(--fm-accent)] text-white" : 
                "border-[var(--fm-border)] text-[var(--fm-text)]"
              }
            >
              Growth
            </Button>
            <Button
              variant={sortBy === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("name")}
              className={sortBy === "name" ? 
                "bg-[var(--fm-accent)] text-white" : 
                "border-[var(--fm-border)] text-[var(--fm-text)]"
              }
            >
              Name
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-[var(--fm-success)]/20 text-[var(--fm-success)]">
              {sortedArtists?.filter(a => a.performanceRating >= 85).length || 0} Top Performers
            </Badge>
            <Badge className="bg-[var(--fm-warning)]/20 text-[var(--fm-warning)]">
              {sortedArtists?.filter(a => parseFloat(a.socialGrowthRate || "0") > 20).length || 0} Trending
            </Badge>
          </div>
        </div>

        {/* Artists List */}
        <Card className="bg-[var(--fm-panel)] border-[var(--fm-border)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-[var(--fm-text)]">
                Artists ({sortedArtists?.length || 0})
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-[var(--fm-accent)]">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="ghost" size="sm" className="text-[var(--fm-accent)]">
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {sortedArtists?.length ? (
              <div className="divide-y divide-[var(--fm-border)]">
                {sortedArtists.map((artist, index) => (
                  <div key={artist.id} className="relative">
                    {index < 3 && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-[var(--fm-success)] text-white text-xs">
                          #{index + 1} Top Performer
                        </Badge>
                      </div>
                    )}
                    <ArtistCard 
                      artist={artist}
                      onClick={() => {
                        // TODO: Navigate to artist detail page
                        console.log("View artist:", artist.stageName);
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-[var(--fm-text-dim)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--fm-text)] mb-2">
                  No artists found
                </h3>
                <p className="text-[var(--fm-text-dim)] mb-4">
                  {searchTerm || selectedGenre !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Start building your roster by signing new talent"
                  }
                </p>
                <Button className="bg-[var(--fm-accent)] hover:bg-[var(--fm-accent)]/80 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Scout New Artist
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 