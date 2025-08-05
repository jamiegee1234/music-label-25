import { AIInsight } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, TrendingUp, Calendar, Search, ExternalLink, AlertCircle, Lightbulb, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightsProps {
  insights: AIInsight[];
  onInsightClick?: (insight: AIInsight) => void;
  className?: string;
}

const getInsightIcon = (type: string) => {
  switch (type) {
    case "hot_prospect":
      return Search;
    case "genre_trend":
      return TrendingUp;
    case "release_timing":
      return Calendar;
    case "market_opportunity":
      return Target;
    case "risk_alert":
      return AlertCircle;
    case "creative_suggestion":
      return Lightbulb;
    default:
      return Bot;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "border-[var(--fm-success)] bg-[var(--fm-success)]/5";
    case "medium":
      return "border-[var(--fm-warning)] bg-[var(--fm-warning)]/5";
    case "low":
      return "border-[var(--fm-accent)] bg-[var(--fm-accent)]/5";
    default:
      return "border-gray-500 bg-gray-500/5";
  }
};

const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-[var(--fm-success)]/20 text-[var(--fm-success)] border-[var(--fm-success)]/30";
    case "medium":
      return "bg-[var(--fm-warning)]/20 text-[var(--fm-warning)] border-[var(--fm-warning)]/30";
    case "low":
      return "bg-[var(--fm-accent)]/20 text-[var(--fm-accent)] border-[var(--fm-accent)]/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getInsightTypeColor = (type: string) => {
  switch (type) {
    case "hot_prospect":
      return "text-purple-400";
    case "genre_trend":
      return "text-blue-400";
    case "release_timing":
      return "text-green-400";
    case "market_opportunity":
      return "text-orange-400";
    case "risk_alert":
      return "text-red-400";
    case "creative_suggestion":
      return "text-yellow-400";
    default:
      return "text-[var(--fm-accent)]";
  }
};

export default function AIInsights({ insights, onInsightClick, className }: AIInsightsProps) {
  if (!insights.length) {
    return (
      <div className={cn("bg-[var(--fm-panel)] rounded-xl border border-[var(--fm-border)]", className)}>
        <div className="p-6 border-b border-[var(--fm-border)]">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-[var(--fm-accent)]" />
            <h3 className="text-lg font-semibold text-[var(--fm-text)]">AI Insights</h3>
            <Badge className="bg-[var(--fm-accent)]/20 text-[var(--fm-accent)] text-xs">
              AI-Powered
            </Badge>
          </div>
        </div>
        <div className="p-8 text-center">
          <Bot className="w-12 h-12 text-[var(--fm-text-dim)] mx-auto mb-4 opacity-50" />
          <p className="text-[var(--fm-text-dim)] mb-2">
            No insights available at the moment.
          </p>
          <p className="text-xs text-[var(--fm-text-dim)] opacity-70">
            AI will analyze your data and provide strategic insights here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-[var(--fm-panel)] rounded-xl border border-[var(--fm-border)]", className)}>
      <div className="p-6 border-b border-[var(--fm-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-[var(--fm-accent)]" />
            <h3 className="text-lg font-semibold text-[var(--fm-text)]">AI Insights</h3>
            <Badge className="bg-[var(--fm-accent)]/20 text-[var(--fm-accent)] text-xs">
              {insights.length} Active
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--fm-success)] rounded-full animate-pulse"></div>
            <span className="text-xs text-[var(--fm-text-dim)]">Live Analysis</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          
          return (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer",
                getPriorityColor(insight.priority)
              )}
              onClick={() => onInsightClick?.(insight)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    getPriorityColor(insight.priority).replace("border-l-4", "")
                  )}>
                    <Icon className={cn("w-4 h-4", getInsightTypeColor(insight.type))} />
                  </div>
                  <div>
                    <h4 className={cn(
                      "font-semibold text-sm",
                      insight.priority === "high" ? "text-[var(--fm-success)]" :
                      insight.priority === "medium" ? "text-[var(--fm-warning)]" :
                      "text-[var(--fm-accent)]"
                    )}>
                      {insight.title}
                    </h4>
                    <p className="text-xs text-[var(--fm-text-dim)] capitalize">
                      {insight.type.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <Badge className={cn("text-xs font-medium", getPriorityBadgeColor(insight.priority))}>
                  {insight.priority}
                </Badge>
              </div>
              
              <p className="text-sm text-[var(--fm-text-dim)] mb-3 leading-relaxed">
                {insight.message}
              </p>
              
              <div className="flex items-center justify-between">
                {insight.actionable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--fm-accent)] hover:text-[var(--fm-accent)] hover:bg-[var(--fm-accent)]/10 p-0 h-auto text-xs font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInsightClick?.(insight);
                    }}
                  >
                    View Details <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                )}
                <div className="flex items-center space-x-2 text-xs text-[var(--fm-text-dim)]">
                  <span>AI Confidence: {insight.confidence || 85}%</span>
                  {insight.timestamp && (
                    <span>• {new Date(insight.timestamp).toLocaleTimeString()}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 