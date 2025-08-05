export interface AIInsight {
  type: "hot_prospect" | "genre_trend" | "release_timing" | "market_opportunity" | "risk_alert" | "creative_suggestion";
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  confidence?: number;
  timestamp?: string;
  data?: any;
}

export interface DashboardStats {
  activeArtists: number;
  topChartPositions: number;
  totalStreams: number;
  labelValue: number;
  recentProjects: any[];
  topCharts: any[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    tension?: number;
  }[];
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ArtistPerformance {
  artistId: string;
  artistName: string;
  monthlyStreams: number;
  socialGrowth: number;
  chartPosition?: number;
  revenue: number;
}

export interface ProjectTimeline {
  projectId: string;
  projectName: string;
  artistName: string;
  status: string;
  progress: number;
  estimatedCompletion: Date;
  releaseDate?: Date;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  actionUrl?: string;
} 