import { Artist } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Mic, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  Users, 
  Music, 
  Star,
  Crown,
  Award,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtistCardProps {
  artist: Artist;
  onClick?: () => void;
  showActions?: boolean;
  className?: string;
}

const getGenreColor = (genre: string) => {
  const colors: Record<string, string> = {
    "Pop/R&B": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    "Hip-Hop": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Indie Rock": "bg-green-500/20 text-green-400 border-green-500/30",
    "Electronic": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Country": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "Alternative": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    "Jazz": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    "Classical": "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return colors[genre] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
};

const getStatusColor = (rating: number) => {
  if (rating >= 90) return "bg-[var(--fm-success)]/20 text-[var(--fm-success)] border-[var(--fm-success)]/30";
  if (rating >= 80) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  if (rating >= 70) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  return "bg-gray-500/20 text-gray-400 border-gray-500/30";
};

const getStatusText = (rating: number) => {
  if (rating >= 90) return "Rising Star";
  if (rating >= 80) return "Established";
  if (rating >= 70) return "Developing";
  return "New Artist";
};

const getPerformanceIcon = (rating: number) => {
  if (rating >= 95) return Crown;
  if (rating >= 90) return Star;
  if (rating >= 80) return Award;
  if (rating >= 70) return TrendingUp;
  return Music;
};

export default function ArtistCard({ artist, onClick, showActions = true, className }: ArtistCardProps) {
  const formatStreams = (streams: number) => {
    if (streams >= 1000000) {
      return `${(streams / 1000000).toFixed(1)}M`;
    }
    if (streams >= 1000) {
      return `${(streams / 1000).toFixed(1)}K`;
    }
    return streams.toString();
  };

  const formatGrowth = (rate: string | null) => {
    if (!rate) return "0%";
    const value = parseFloat(rate);
    return `${value > 0 ? '+' : ''}${value.toFixed(0)}%`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const contractYearsLeft = artist.contractExpiry 
    ? Math.max(0, Math.ceil((new Date(artist.contractExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 365)))
    : 0;

  const isContractExpiring = contractYearsLeft <= 1;
  const isHighPerformer = artist.performanceRating >= 85;
  const isTrending = artist.socialGrowthRate && parseFloat(artist.socialGrowthRate) > 20;

  const PerformanceIcon = getPerformanceIcon(artist.performanceRating);

  return (
    <div 
      className={cn(
        "p-6 hover:bg-[var(--fm-dark)]/30 transition-all duration-200 cursor-pointer border-b border-[var(--fm-border)] last:border-b-0 group",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        {/* Artist Image */}
        <div className="relative">
          <img
            src={artist.profileImage || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100`}
            alt={artist.stageName}
            className="w-16 h-16 rounded-lg object-cover"
          />
          {isHighPerformer && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--fm-success)] rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-white" />
            </div>
          )}
          {isTrending && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--fm-warning)] rounded-full flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Artist Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold text-lg text-[var(--fm-text)] group-hover:text-[var(--fm-accent)] transition-colors">
              {artist.stageName}
            </h4>
            <Badge className={cn("text-xs", getGenreColor(artist.genre))}>
              {artist.genre}
            </Badge>
            <Badge className={cn("text-xs", getStatusColor(artist.performanceRating))}>
              {getStatusText(artist.performanceRating)}
            </Badge>
            {isContractExpiring && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                Contract Expiring
              </Badge>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Music className="w-3 h-3 text-[var(--fm-text-dim)]" />
                <p className="text-[var(--fm-text-dim)] text-xs">Monthly Streams</p>
              </div>
              <p className="font-semibold text-[var(--fm-success)]">
                {formatStreams(artist.monthlyStreams)}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-[var(--fm-text-dim)]" />
                <p className="text-[var(--fm-text-dim)] text-xs">Chart Peak</p>
              </div>
              <p className="font-semibold text-[var(--fm-text)]">
                {artist.chartPeak ? `#${artist.chartPeak} Global` : "No charts"}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3 text-[var(--fm-text-dim)]" />
                <p className="text-[var(--fm-text-dim)] text-xs">Social Growth</p>
              </div>
              <p className={cn(
                "font-semibold",
                artist.socialGrowthRate && parseFloat(artist.socialGrowthRate) > 0 
                  ? "text-[var(--fm-success)]" 
                  : "text-red-400"
              )}>
                {formatGrowth(artist.socialGrowthRate || "0")}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-[var(--fm-text-dim)]" />
                <p className="text-[var(--fm-text-dim)] text-xs">Contract</p>
              </div>
              <p className={cn(
                "font-semibold",
                isContractExpiring ? "text-red-400" : "text-[var(--fm-text)]"
              )}>
                {contractYearsLeft > 0 ? `${contractYearsLeft} years left` : "Expired"}
              </p>
            </div>
          </div>

          {/* Revenue Progress */}
          {artist.monthlyRevenue && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-[var(--fm-text-dim)] mb-1">
                <span>Monthly Revenue</span>
                <span>{formatCurrency(artist.monthlyRevenue)}</span>
              </div>
              <Progress 
                value={Math.min((artist.monthlyRevenue / 100000) * 100, 100)} 
                className="h-1" 
              />
            </div>
          )}
        </div>

        {/* Performance Rating */}
        <div className="text-right">
          <div 
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center mb-2 relative",
              getStatusColor(artist.performanceRating)
            )}
          >
            <PerformanceIcon className="w-5 h-5 absolute opacity-20" />
            <span className="font-bold text-lg relative z-10">
              {artist.performanceRating}
            </span>
          </div>
          <p className="text-xs text-[var(--fm-text-dim)]">Performance</p>
          
          {/* Quick Actions */}
          {showActions && (
            <div className="mt-3 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-6 text-xs text-[var(--fm-accent)] hover:bg-[var(--fm-accent)]/10"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle view details
                }}
              >
                <Mic className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-6 text-xs text-[var(--fm-accent)] hover:bg-[var(--fm-accent)]/10"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit
                }}
              >
                <Zap className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 