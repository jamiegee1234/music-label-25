import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertArtistSchema,
  insertContractSchema,
  insertProjectSchema,
  insertChartSchema,
  insertFinancialRecordSchema,
  insertTourSchema,
  insertProspectSchema,
  insertIndustryNewsSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Artists routes
  app.get("/api/artists", async (req, res) => {
    try {
      const artists = await storage.getArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artists" });
    }
  });

  app.get("/api/artists/:id", async (req, res) => {
    try {
      const artist = await storage.getArtist(req.params.id);
      if (!artist) {
        return res.status(404).json({ error: "Artist not found" });
      }
      res.json(artist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artist" });
    }
  });

  app.post("/api/artists", async (req, res) => {
    try {
      const result = insertArtistSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: "Invalid artist data", details: result.error });
      }

      const artist = await storage.createArtist(result.data);
      res.status(201).json(artist);
    } catch (error) {
      res.status(500).json({ error: "Failed to create artist" });
    }
  });

  app.patch("/api/artists/:id", async (req, res) => {
    try {
      const artist = await storage.updateArtist(req.params.id, req.body);
      if (!artist) {
        return res.status(404).json({ error: "Artist not found" });
      }
      res.json(artist);
    } catch (error) {
      res.status(500).json({ error: "Failed to update artist" });
    }
  });

  // Contracts routes
  app.get("/api/contracts", async (req, res) => {
    try {
      const contracts = await storage.getContracts();
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contracts" });
    }
  });

  app.get("/api/artists/:artistId/contracts", async (req, res) => {
    try {
      const contracts = await storage.getContractsByArtist(req.params.artistId);
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artist contracts" });
    }
  });

  app.post("/api/contracts", async (req, res) => {
    try {
      const result = insertContractSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: "Invalid contract data", details: result.error });
      }

      const contract = await storage.createContract(result.data);
      res.status(201).json(contract);
    } catch (error) {
      res.status(500).json({ error: "Failed to create contract" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/artists/:artistId/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsByArtist(req.params.artistId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artist projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const result = insertProjectSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: "Invalid project data", details: result.error });
      }

      const project = await storage.createProject(result.data);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // Charts routes
  app.get("/api/charts", async (req, res) => {
    try {
      const charts = await storage.getCharts();
      res.json(charts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch charts" });
    }
  });

  app.get("/api/artists/:artistId/charts", async (req, res) => {
    try {
      const charts = await storage.getChartsByArtist(req.params.artistId);
      res.json(charts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artist charts" });
    }
  });

  app.post("/api/charts", async (req, res) => {
    try {
      const result = insertChartSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: "Invalid chart data", details: result.error });
      }

      const chart = await storage.createChart(result.data);
      res.status(201).json(chart);
    } catch (error) {
      res.status(500).json({ error: "Failed to create chart entry" });
    }
  });

  // Financial routes
  app.get("/api/financial", async (req, res) => {
    try {
      const records = await storage.getFinancialRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch financial records" });
    }
  });

  app.post("/api/financial", async (req, res) => {
    try {
      const result = insertFinancialRecordSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: "Invalid financial data", details: result.error });
      }

      const record = await storage.createFinancialRecord(result.data);
      res.status(201).json(record);
    } catch (error) {
      res.status(500).json({ error: "Failed to create financial record" });
    }
  });

  // Tours routes
  app.get("/api/tours", async (req, res) => {
    try {
      const tours = await storage.getTours();
      res.json(tours);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tours" });
    }
  });

  app.post("/api/tours", async (req, res) => {
    try {
      const result = insertTourSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: "Invalid tour data", details: result.error });
      }

      const tour = await storage.createTour(result.data);
      res.status(201).json(tour);
    } catch (error) {
      res.status(500).json({ error: "Failed to create tour" });
    }
  });

  // Prospects routes
  app.get("/api/prospects", async (req, res) => {
    try {
      const prospects = await storage.getProspects();
      res.json(prospects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prospects" });
    }
  });

  app.post("/api/prospects", async (req, res) => {
    try {
      const result = insertProspectSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: "Invalid prospect data", details: result.error });
      }

      const prospect = await storage.createProspect(result.data);
      res.status(201).json(prospect);
    } catch (error) {
      res.status(500).json({ error: "Failed to create prospect" });
    }
  });

  app.patch("/api/prospects/:id", async (req, res) => {
    try {
      const prospect = await storage.updateProspect(req.params.id, req.body);
      if (!prospect) {
        return res.status(404).json({ error: "Prospect not found" });
      }
      res.json(prospect);
    } catch (error) {
      res.status(500).json({ error: "Failed to update prospect" });
    }
  });

  // Industry news routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getIndustryNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch industry news" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const result = insertIndustryNewsSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ error: "Invalid news data", details: result.error });
      }

      const news = await storage.createIndustryNews(result.data);
      res.status(201).json(news);
    } catch (error) {
      res.status(500).json({ error: "Failed to create news item" });
    }
  });

  // AI Insights endpoint
  app.get("/api/ai-insights", async (req, res) => {
    try {
      const artists = await storage.getArtists();
      const prospects = await storage.getProspects();
      const charts = await storage.getCharts();

      // Simulate AI-generated insights
      const insights = [
        {
          type: "hot_prospect",
          title: "Hot Prospect Alert",
          message:
            "Indie artist 'Riley Park' trending on TikTok with 2.3M views. Unsigned and available.",
          priority: "high",
          actionable: true,
          data: prospects.find((p) => p.name === "Riley Park"),
        },
        {
          type: "genre_trend",
          title: "Genre Trend",
          message:
            "Afrobeat fusion rising 34% this month. Consider diversifying portfolio.",
          priority: "medium",
          actionable: false,
        },
        {
          type: "release_timing",
          title: "Release Timing",
          message:
            "Optimal release window for Zara's album: March 15-22 (low competition).",
          priority: "medium",
          actionable: true,
          data: { artist: "Zara Eclipse", suggestedDate: "2025-03-15" },
        },
      ];

      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate AI insights" });
    }
  });

  // Dashboard stats endpoint
  app.get("/api/dashboard-stats", async (req, res) => {
    try {
      const artists = await storage.getArtists();
      const projects = await storage.getProjects();
      const charts = await storage.getCharts();
      const prospects = await storage.getProspects();

      const activeArtists = artists.filter((a) => a.isActive).length;
      const topChartPositions = charts.filter((c) => c.position <= 40).length;
      const totalStreams = artists.reduce(
        (sum, a) => sum + a.monthlyStreams,
        0,
      );
      const labelValue = 45800000; // Static for demo

      const stats = {
        activeArtists,
        topChartPositions,
        totalStreams,
        labelValue,
        recentProjects: projects
          .filter((p) => p.status !== "completed")
          .slice(0, 3),
        topCharts: charts.sort((a, b) => a.position - b.position).slice(0, 3),
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
