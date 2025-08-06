import { Project } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Disc, 
  Music, 
  Album, 
  Calendar, 
  DollarSign, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  artistName?: string;
  onClick?: () => void;
  showActions?: boolean;
  className?: string;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    "planning": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "recording": "bg-[var(--fm-warning)]/20 text-[var(--fm-warning)] border-[var(--fm-warning)]/30",
    "mixing": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "mastering": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "completed": "bg-[var(--fm-success)]/20 text-[var(--fm-success)] border-[var(--fm-success)]/30",
    "on_hold": "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
};

const getProjectIcon = (type: string) => {
  switch (type) {
    case "album":
      return Album;
    case "single":
      return Music;
    case "ep":
      return Disc;
    default:
      return Music;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return CheckCircle;
    case "on_hold":
      return Pause;
    case "recording":
    case "mixing":
    case "mastering":
      return Play;
    default:
      return Clock;
  }
};

export default function ProjectCard({ project, artistName, onClick, showActions = true, className }: ProjectCardProps) {
  const Icon = getProjectIcon(project.type);
  const StatusIcon = getStatusIcon(project.status);
  
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "TBD";
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getTimeRemaining = (date: Date | null) => {
    if (!date) return "TBD";
    const now = new Date();
    const target = new Date(date);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return `${Math.ceil(diffDays / 30)} months`;
  };

  const isOverdue = project.estimatedCompletion && new Date(project.estimatedCompletion) < new Date();
  const isNearDeadline = project.estimatedCompletion && (() => {
    const diffDays = Math.ceil((new Date(project.estimatedCompletion).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  })();

  const budgetUtilization = (parseFloat(project.spent) / parseFloat(project.budget)) * 100;
  const isOverBudget = budgetUtilization > 100;

  return (
    <div 
      className={cn(
        "p-4 bg-[var(--fm-dark)]/30 rounded-lg border border-[var(--fm-border)] hover:shadow-lg transition-all duration-200 cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        {/* Project Icon */}
        <div className="relative">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            getStatusColor(project.status)
          )}>
            <Icon className="w-6 h-6" />
          </div>
          {isOverdue && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold text-[var(--fm-text)] group-hover:text-[var(--fm-accent)] transition-colors">
              {artistName && `${artistName} - `}"{project.title}"
            </h4>
            <Badge className={cn("text-xs capitalize", getStatusColor(project.status))}>
              {project.status.replace("_", " ")}
            </Badge>
            {isOverdue && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                Overdue
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-[var(--fm-text-dim)] mb-3">
            {project.type.toUpperCase()} • {project.studio} • Producer: {project.producer}
          </p>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-[var(--fm-text-dim)] mb-1">
              <span>Progress</span>
              <span className={cn(
                (project.progress || 0) >= 90 ? "text-[var(--fm-success)]" : 
                (project.progress || 0) >= 70 ? "text-[var(--fm-warning)]" : 
                "text-[var(--fm-accent)]"
              )}>
                {project.progress || 0}%
              </span>
            </div>
            <Progress value={project.progress || 0} className="h-2" />
          </div>

          {/* Budget and Timeline */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3 text-[var(--fm-text-dim)]" />
                <span className="text-[var(--fm-text-dim)]">Budget</span>
              </div>
              <p className={cn(
                "font-semibold",
                isOverBudget ? "text-red-400" : "text-[var(--fm-text)]"
              )}>
                {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
              </p>
              {isOverBudget && (
                <p className="text-red-400 text-xs">Over budget</p>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-[var(--fm-text-dim)]" />
                <span className="text-[var(--fm-text-dim)]">Release</span>
              </div>
              <p className="font-semibold text-[var(--fm-text)]">
                {formatDate(project.releaseDate ? new Date(project.releaseDate) : null)}
              </p>
            </div>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-2">
            <StatusIcon className="w-4 h-4 text-[var(--fm-accent)]" />
            <span className={cn(
              "text-sm font-semibold",
              (project.progress || 0) >= 90 ? "text-[var(--fm-success)]" : 
              (project.progress || 0) >= 70 ? "text-[var(--fm-warning)]" : 
              "text-[var(--fm-accent)]"
            )}>
              {project.progress || 0}% Complete
            </span>
          </div>
          <p className="text-xs text-[var(--fm-text-dim)] mb-3">
            ETA: {getTimeRemaining(project.estimatedCompletion ? new Date(project.estimatedCompletion) : null)}
          </p>
          
          {/* Quick Actions */}
          {showActions && (
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-6 text-xs text-[var(--fm-accent)] hover:bg-[var(--fm-accent)]/10"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle view details
                }}
              >
                <Music className="w-3 h-3 mr-1" />
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