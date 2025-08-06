import { z } from "zod";

// Base schemas
export const insertArtistSchema = z.object({
  name: z.string().min(1),
  stageName: z.string().min(1),
  genre: z.string().min(1),
  isActive: z.boolean().default(true),
  monthlyStreams: z.number().min(0),
  performanceRating: z.number().min(0).max(100),
  socialGrowthRate: z.string().optional(),
  profileImage: z.string().optional(),
  contractExpiry: z.string().optional(),
  chartPeak: z.number().optional(),
  monthlyRevenue: z.number().optional(),
  age: z.number().optional(),
  nationality: z.string().optional(),
  vocalSkill: z.number().optional(),
  stagePresence: z.number().optional(),
  songwriting: z.number().optional(),
  mediaHandling: z.number().optional(),
  workEthic: z.number().optional(),
  adaptability: z.number().optional(),
  socialFollowers: z.number().optional(),
  labelId: z.string().optional(),
  mood: z.number().optional(),
  publicImage: z.number().optional(),
  traits: z.array(z.string()).optional(),
  background: z.string().optional(),
});

export const insertContractSchema = z.object({
  artistId: z.string(),
  type: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  value: z.string(),
  status: z.string(),
  advance: z.string().optional(),
  royaltyRate: z.string().optional(),
  duration: z.string().optional(),
  clauses: z.array(z.string()).optional(),
});

export const insertProjectSchema = z.object({
  artistId: z.string(),
  title: z.string().min(1),
  type: z.string(),
  status: z.string(),
  budget: z.string(),
  spent: z.string(),
  estimatedCompletion: z.string().optional(),
  description: z.string().optional(),
  studio: z.string().optional(),
  producer: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  releaseDate: z.string().optional(),
});

export const insertChartSchema = z.object({
  artistId: z.string(),
  songTitle: z.string().min(1),
  position: z.number().min(1),
  previousPosition: z.number().optional(),
  chartName: z.string(),
  chartType: z.string().optional(),
  streams: z.number().min(0),
  peakPosition: z.number().min(1),
  weeksOnChart: z.number().min(0),
  week: z.number().optional(),
  year: z.number().optional(),
});

export const insertFinancialRecordSchema = z.object({
  artistId: z.string(),
  type: z.string(),
  amount: z.string(),
  description: z.string(),
  date: z.string(),
  category: z.string().optional(),
  projectId: z.string().optional(),
});

export const insertTourSchema = z.object({
  artistId: z.string(),
  name: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  venues: z.array(z.string()),
  status: z.string(),
  revenue: z.string().optional(),
});

export const insertProspectSchema = z.object({
  name: z.string().min(1),
  genre: z.string(),
  status: z.string(),
  contactEmail: z.string().email(),
  notes: z.string().optional(),
  rating: z.number().min(1).max(10),
  age: z.number().optional(),
  location: z.string().optional(),
  socialFollowers: z.number().optional(),
  socialGrowthRate: z.string().optional(),
  monthlyStreams: z.number().optional(),
  buzzScore: z.number().optional(),
  scoutRating: z.number().optional(),
  contractStatus: z.string().optional(),
  isShortlisted: z.boolean().optional(),
});

export const insertIndustryNewsSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  source: z.string(),
  url: z.string().url().optional(),
  category: z.string(),
  publishedAt: z.string(),
  summary: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

// TypeScript types
export type Artist = z.infer<typeof insertArtistSchema> & {
  id: string;
  createdAt: string;
};

export type Contract = z.infer<typeof insertContractSchema> & {
  id: string;
  createdAt: string;
};

export type Project = z.infer<typeof insertProjectSchema> & {
  id: string;
  createdAt: string;
};

export type Chart = z.infer<typeof insertChartSchema> & {
  id: string;
  createdAt: string;
};

export type FinancialRecord = z.infer<typeof insertFinancialRecordSchema> & {
  id: string;
  createdAt: string;
};

export type Tour = z.infer<typeof insertTourSchema> & {
  id: string;
  createdAt: string;
};

export type Prospect = z.infer<typeof insertProspectSchema> & {
  id: string;
  createdAt: string;
};

export type IndustryNews = z.infer<typeof insertIndustryNewsSchema> & {
  id: string;
  createdAt: string;
};