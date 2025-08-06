import type { Artist, Contract, Project, Chart, FinancialRecord, Tour, Prospect, IndustryNews } from "./src/shared/schema";

// Simple in-memory storage for demonstration
class Storage {
  private artists: Artist[] = [];
  private contracts: Contract[] = [];
  private projects: Project[] = [];
  private charts: Chart[] = [];
  private financialRecords: FinancialRecord[] = [];
  private tours: Tour[] = [];
  private prospects: Prospect[] = [];
  private industryNews: IndustryNews[] = [];

  // Artists
  async getArtists(): Promise<Artist[]> {
    return this.artists;
  }

  async getArtist(id: string): Promise<Artist | undefined> {
    return this.artists.find(a => a.id === id);
  }

  async createArtist(data: Omit<Artist, 'id' | 'createdAt'>): Promise<Artist> {
    const artist: Artist = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.artists.push(artist);
    return artist;
  }

  async updateArtist(id: string, data: Partial<Omit<Artist, 'id' | 'createdAt'>>): Promise<Artist | null> {
    const index = this.artists.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    this.artists[index] = { ...this.artists[index], ...data };
    return this.artists[index];
  }

  // Contracts
  async getContracts(): Promise<Contract[]> {
    return this.contracts;
  }

  async getContractsByArtist(artistId: string): Promise<Contract[]> {
    return this.contracts.filter(c => c.artistId === artistId);
  }

  async createContract(data: Omit<Contract, 'id' | 'createdAt'>): Promise<Contract> {
    const contract: Contract = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.contracts.push(contract);
    return contract;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.projects;
  }

  async getProjectsByArtist(artistId: string): Promise<Project[]> {
    return this.projects.filter(p => p.artistId === artistId);
  }

  async createProject(data: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const project: Project = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.projects.push(project);
    return project;
  }

  async updateProject(id: string, data: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project | null> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.projects[index] = { ...this.projects[index], ...data };
    return this.projects[index];
  }

  // Charts
  async getCharts(): Promise<Chart[]> {
    return this.charts;
  }

  async getChartsByArtist(artistId: string): Promise<Chart[]> {
    return this.charts.filter(c => c.artistId === artistId);
  }

  async createChart(data: Omit<Chart, 'id' | 'createdAt'>): Promise<Chart> {
    const chart: Chart = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.charts.push(chart);
    return chart;
  }

  // Financial Records
  async getFinancialRecords(): Promise<FinancialRecord[]> {
    return this.financialRecords;
  }

  async createFinancialRecord(data: Omit<FinancialRecord, 'id' | 'createdAt'>): Promise<FinancialRecord> {
    const record: FinancialRecord = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.financialRecords.push(record);
    return record;
  }

  // Tours
  async getTours(): Promise<Tour[]> {
    return this.tours;
  }

  async createTour(data: Omit<Tour, 'id' | 'createdAt'>): Promise<Tour> {
    const tour: Tour = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.tours.push(tour);
    return tour;
  }

  // Prospects
  async getProspects(): Promise<Prospect[]> {
    return this.prospects;
  }

  async createProspect(data: Omit<Prospect, 'id' | 'createdAt'>): Promise<Prospect> {
    const prospect: Prospect = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.prospects.push(prospect);
    return prospect;
  }

  async updateProspect(id: string, data: Partial<Omit<Prospect, 'id' | 'createdAt'>>): Promise<Prospect | null> {
    const index = this.prospects.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.prospects[index] = { ...this.prospects[index], ...data };
    return this.prospects[index];
  }

  // Industry News
  async getIndustryNews(): Promise<IndustryNews[]> {
    return this.industryNews;
  }

  async createIndustryNews(data: Omit<IndustryNews, 'id' | 'createdAt'>): Promise<IndustryNews> {
    const news: IndustryNews = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.industryNews.push(news);
    return news;
  }
}

export const storage = new Storage();