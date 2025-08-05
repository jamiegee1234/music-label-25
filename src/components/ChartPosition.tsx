import { Chart } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, Music, Award, Crown, Star, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartPositionProps {
  chart: Chart;
  artistName?: string;
  onClick?: () => void;
  showActions?: boolean;
  className?: string;
}

const getPositionIcon = (position: number) => {
  if (position === 1) return Crown;
  if (position <= 3) return Star;
  if (position <= 10) return Award;
  if (position <= 40) return Target;
  return Music;
};

const getPositionColor = (position: number) => {
  if (position <= 3) return "bg-[var(--fm-success)]/20 text-[var(--fm-success)] border-[var(--fm-success)]/30";
  if (position <= 10) return "bg-[var(--fm-warning)]/20 text-[var(--fm-warning)] border-[var(--fm-warning)]/30";
  if (position <= 40) return "bg-[var(--fm-accent)]/20 text-[var(--fm-accent)] border-[var(--fm-accent)]/30";
  return "bg-gray-500/20 text-gray-400 border-gray-500/30";
};

const getPositionBackground = (position: number) => {
  if (position <= 3) return "bg-[var(--fm-success)]/10";
  if (position <= 10) return "bg-[var(--fm-warning)]/10";
  if (position <= 40) return "bg-[var(--fm-accent)]/10";
  return "bg-gray-500/10";
};

export default function ChartPosition({ chart, artistName, onClick, showActions = true, className }: ChartPositionProps) {
  const formatStreams = (streams: number) => {
    if (streams >= 1000000) {
      return `${(streams / 1000000).toFixed(1)}M streams`;
    }
    if (streams >= 1000) {
      return `${(streams / 1000).toFixed(1)}K streams`;
    }
    return `${streams} streams`;
  };

  const getMovement = () => {
    if (!chart.previousPosition) return { icon: Minus, text: "New", color: "text-gray-400", bgColor: "bg-gray-500/20" };
    
    const movement = chart.previousPosition - chart.position;
    if (movement > 0) {
      return { 
        icon: TrendingUp, 
        text: `↑ ${movement}`, 
        color: "text-[var(--fm-success)]",
        bgColor: "bg-[var(--fm-success)]/20"
      };
    } else if (movement < 0) {
      return { 
        icon: TrendingDown, 
        text: `↓ ${Math.abs(movement)}`, 
        color: "text-red-400",
        bgColor: "bg-red-500/20"
      };
    } else {
      return { 
        icon: Minus, 
        text: "—", 
        color: "text-gray-400",
        bgColor: "bg-gray-500/20"
      };
    }
  };

  const movement = getMovement();
  const PositionIcon = getPositionIcon(chart.position);
  const isTopTen = chart.position <= 10;
  const isTopForty = chart.position <= 40;

  return (
    <div 
      className={cn(
        "flex items-center justify-between py-4 px-4 hover:bg-[var(--fm-dark)]/30 transition-all duration-200 cursor-pointer rounded-lg group",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        {/* Position Badge */}
        <div className="relative">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center relative",
            getPositionBackground(chart.position)
          )}>
            <PositionIcon className={cn("w-5 h-5", getPositionColor(chart.position).split(' ')[1])} />
            <span className={cn(
              "absolute inset-0 flex items-center justify-center font-bold text-lg",
              getPositionColor(chart.position).split(' ')[1]
            )}>
              {chart.position}
            </span>
          </div>
          {isTopTen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--fm-success)] rounded-full flex items-center justify-center">
              <Star className="w-2 h-2 text-white" />
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-sm text-[var(--fm-text)] group-hover:text-[var(--fm-accent)] transition-colors">
              {artistName || "Unknown Artist"}
            </h4>
            {isTopForty && (
              <Badge className={cn("text-xs", getPositionColor(chart.position))}>
                {chart.position <= 3 ? "Top 3" : chart.position <= 10 ? "Top 10" : "Top 40"}
              </Badge>
            )}
          </div>
          <p className="text-xs text-[var(--fm-text-dim)] mb-2">
            "{chart.songTitle}"
          </p>
          
          {/* Movement Indicator */}
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex items-center space-x-1 px-2 py-1 rounded-full text-xs",
              movement.bgColor
            )}>
              <movement.icon className={cn("w-3 h-3", movement.color)} />
              <span className={movement.color}>{movement.text}</span>
            </div>
            <span className="text-xs text-[var(--fm-text-dim)]">
              {formatStreams(chart.streams)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-[var(--fm-accent)] hover:bg-[var(--fm-accent)]/10"
            onClick={(e) => {
              e.stopPropagation();
              // Handle view details
            }}
          >
            <Music className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-[var(--fm-accent)] hover:bg-[var(--fm-accent)]/10"
            onClick={(e) => {
              e.stopPropagation();
              // Handle analytics
            }}
          >
            <TrendingUp className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 