import { Artist, Project, Chart, Contract, Prospect, IndustryNews, FinancialRecord } from "@shared/schema";

// Utility functions for generating realistic demo data
export const generateMockArtist = (overrides: Partial<Artist> = {}): Omit<Artist, 'id' | 'createdAt'> => {
  const genres = ["Pop/R&B", "Hip-Hop", "Indie Rock", "Electronic", "Country", "Jazz", "Folk", "Reggae"];
  const nationalities = ["US", "UK", "Canada", "Australia", "Brazil", "Germany", "France", "Japan"];
  const names = [
    "Luna Martinez", "Alex Rivers", "Maya Chen", "Jordan Blake", "Riley Park",
    "Casey Morgan", "Sam Rodriguez", "Taylor Kim", "Avery Johnson", "Quinn Davis"
  ];
  const stageNames = [
    "Luna Stone", "River Flow", "Maya Dreams", "Jordan Beats", "Riley Nights",
    "Casey Waves", "Sam Echo", "Taylor Shine", "Avery Glow", "Quinn Storm"
  ];

  return {
    name: names[Math.floor(Math.random() * names.length)],
    stageName: stageNames[Math.floor(Math.random() * stageNames.length)],
    age: Math.floor(Math.random() * 20) + 18, // 18-38 years old
    nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
    genre: genres[Math.floor(Math.random() * genres.length)],
    profileImage: `https://images.unsplash.com/photo-${1493225457124 + Math.floor(Math.random() * 1000)}-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400`,
    vocalSkill: Math.floor(Math.random() * 40) + 60, // 60-100
    stagePresence: Math.floor(Math.random() * 40) + 60,
    songwriting: Math.floor(Math.random() * 40) + 60,
    mediaHandling: Math.floor(Math.random() * 40) + 60,
    workEthic: Math.floor(Math.random() * 40) + 60,
    adaptability: Math.floor(Math.random() * 40) + 60,
    monthlyStreams: Math.floor(Math.random() * 20000000) + 1000000, // 1M-21M
    socialFollowers: Math.floor(Math.random() * 5000000) + 100000, // 100K-5.1M
    socialGrowthRate: (Math.random() * 50 + 5).toFixed(1), // 5-55%
    chartPeak: Math.random() > 0.3 ? Math.floor(Math.random() * 99) + 1 : undefined,
    performanceRating: Math.floor(Math.random() * 40) + 60,
    labelId: "stellar-music",
    contractExpiry: new Date(Date.now() + Math.random() * 5 * 365 * 24 * 60 * 60 * 1000), // Random future date within 5 years
    mood: Math.floor(Math.random() * 40) + 60,
    publicImage: Math.floor(Math.random() * 40) + 60,
    traits: ["Creative", "Hardworking", "Collaborative", "Independent", "Perfectionist"].slice(0, Math.floor(Math.random() * 3) + 1),
    background: "Discovered through viral social media content and local performances",
    isActive: Math.random() > 0.1, // 90% chance of being active
    ...overrides
  };
};

export const generateMockProject = (artistId: string, overrides: Partial<Project> = {}): Omit<Project, 'id' | 'createdAt'> => {
  const types = ["album", "single", "ep"];
  const statuses = ["planning", "recording", "mixing", "mastering", "completed"];
  const producers = ["Max Rivers", "DJ Apex", "Sarah Chen", "Mike Johnson", "Lisa Park"];
  const studios = ["Abbey Road Studios", "SoundWave Studios", "Electric Lady", "Capitol Studios"];
  const titles = ["Midnight Dreams", "City Lights", "Echoes", "Neon Nights", "Digital Dreams"];

  const budget = Math.floor(Math.random() * 200000) + 20000; // $20K-$220K
  const spent = Math.floor(budget * (Math.random() * 0.8 + 0.1)); // 10-90% of budget

  return {
    artistId,
    title: titles[Math.floor(Math.random() * titles.length)],
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    budget: budget.toString(),
    spent: spent.toString(),
    producer: producers[Math.floor(Math.random() * producers.length)],
    studio: studios[Math.floor(Math.random() * studios.length)],
    progress: Math.floor(Math.random() * 100),
    estimatedCompletion: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000), // Random date within 6 months
    releaseDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within 1 year
    ...overrides
  };
};

export const generateMockChart = (artistId: string, overrides: Partial<Chart> = {}): Omit<Chart, 'id' | 'createdAt'> => {
  const songTitles = ["Street Symphony", "Neon Nights", "Digital Dreams", "Midnight Hour", "Electric Feel"];
  const chartTypes = ["global", "regional", "genre"];
  
  const position = Math.floor(Math.random() * 100) + 1;
  const previousPosition = Math.random() > 0.3 ? position + Math.floor(Math.random() * 20) - 10 : undefined;

  return {
    artistId,
    projectId: undefined, // Can be linked to a project if needed
    songTitle: songTitles[Math.floor(Math.random() * songTitles.length)],
    position,
    previousPosition,
    chartType: chartTypes[Math.floor(Math.random() * chartTypes.length)],
    streams: Math.floor(Math.random() * 50000000) + 1000000, // 1M-51M streams
    week: 48,
    year: 2024,
    ...overrides
  };
};

export const generateMockProspect = (overrides: Partial<Prospect> = {}): Omit<Prospect, 'id' | 'discoveredAt'> => {
  const names = ["Riley Park", "Jordan Stone", "Casey River", "Alex Moon", "Taylor Spark"];
  const genres = ["Indie Pop", "Alternative R&B", "Electronic", "Folk Rock", "Hip-Hop"];
  const locations = ["Los Angeles, CA", "Nashville, TN", "Atlanta, GA", "New York, NY", "Austin, TX"];
  const contractStatuses = ["unsigned", "indie", "major"];

  return {
    name: names[Math.floor(Math.random() * names.length)],
    age: Math.floor(Math.random() * 15) + 18, // 18-33 years old
    genre: genres[Math.floor(Math.random() * genres.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    socialFollowers: Math.floor(Math.random() * 2000000) + 50000, // 50K-2.05M
    socialGrowthRate: (Math.random() * 100 + 10).toFixed(1), // 10-110%
    monthlyStreams: Math.floor(Math.random() * 5000000) + 100000, // 100K-5.1M
    buzzScore: Math.floor(Math.random() * 100) + 1,
    scoutRating: Math.floor(Math.random() * 5) + 1,
    contractStatus: contractStatuses[Math.floor(Math.random() * contractStatuses.length)],
    notes: "Promising talent with strong social media presence and growing fanbase",
    isShortlisted: Math.random() > 0.7, // 30% chance of being shortlisted
    ...overrides
  };
};

export const generateMockFinancialRecord = (artistId?: string, overrides: Partial<FinancialRecord> = {}): Omit<FinancialRecord, 'id' | 'createdAt'> => {
  const types = ["revenue", "expense"];
  const revenueCategories = ["streaming", "touring", "merchandise", "sync"];
  const expenseCategories = ["studio", "marketing", "touring", "operational"];
  const descriptions = {
    streaming: ["Spotify royalties", "Apple Music payout", "YouTube revenue", "Platform distribution"],
    touring: ["Concert ticket sales", "Merchandise sales", "VIP packages", "Tour sponsorship"],
    merchandise: ["T-shirt sales", "Vinyl sales", "Digital downloads", "Limited edition items"],
    sync: ["TV commercial placement", "Movie soundtrack", "Video game license", "Advertisement usage"],
    studio: ["Recording session", "Mixing costs", "Mastering fees", "Equipment rental"],
    marketing: ["Social media ads", "Radio promotion", "PR campaign", "Influencer partnerships"],
    operational: ["Staff salaries", "Office rent", "Legal fees", "Insurance costs"]
  };

  const type = types[Math.floor(Math.random() * types.length)];
  const categories = type === "revenue" ? revenueCategories : expenseCategories;
  const category = categories[Math.floor(Math.random() * categories.length)];
  const categoryDescriptions = descriptions[category as keyof typeof descriptions];
  
  return {
    type,
    category,
    amount: (Math.random() * 100000 + 1000).toFixed(2), // $1K-$101K
    description: categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)],
    artistId,
    projectId: undefined,
    date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
    ...overrides
  };
};

export const generateMockContract = (artistId: string, overrides: Partial<Contract> = {}): Omit<Contract, 'id' | 'createdAt'> => {
  const types = ["record_deal", "360_deal", "distribution"];
  const durations = [24, 36, 48, 60]; // months
  const clauses = ["Exclusivity", "Territory Rights", "Merchandising", "Digital Rights", "Tour Support"];

  const advance = Math.floor(Math.random() * 500000) + 50000; // $50K-$550K
  const royaltyRate = (Math.random() * 10 + 12).toFixed(1); // 12-22%
  const duration = durations[Math.floor(Math.random() * durations.length)];
  const startDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000); // Random start within last year
  const endDate = new Date(startDate.getTime() + duration * 30 * 24 * 60 * 60 * 1000);

  return {
    artistId,
    type: types[Math.floor(Math.random() * types.length)],
    advance: advance.toString(),
    royaltyRate,
    duration,
    startDate,
    endDate,
    clauses: clauses.slice(0, Math.floor(Math.random() * 3) + 2), // 2-4 clauses
    status: endDate > new Date() ? "active" : "expired",
    ...overrides
  };
};

export const generateMockIndustryNews = (overrides: Partial<IndustryNews> = {}): Omit<IndustryNews, 'id' | 'createdAt'> => {
  const categories = ["signings", "charts", "industry", "awards"];
  const priorities = ["low", "medium", "high"];
  const titles = [
    "Major Label Signs Viral TikTok Star",
    "Streaming Rates Increase for Independent Artists",
    "Grammy Nominations Announced",
    "New Distribution Platform Launches",
    "Industry Revenue Hits Record High"
  ];
  const summaries = [
    "Latest developments in the music industry affecting label operations",
    "Market trends and opportunities for label growth",
    "Regulatory changes impacting music distribution",
    "Technology innovations changing the industry landscape",
    "Artist development strategies gaining traction"
  ];

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)] as "low" | "medium" | "high",
    publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
    ...overrides
  };
};

// Batch generation functions
export const generateMockArtists = (count: number): Omit<Artist, 'id' | 'createdAt'>[] => {
  return Array.from({ length: count }, () => generateMockArtist());
};

export const generateMockProjects = (artistIds: string[], projectsPerArtist: number = 2): Omit<Project, 'id' | 'createdAt'>[] => {
  return artistIds.flatMap(artistId => 
    Array.from({ length: projectsPerArtist }, () => generateMockProject(artistId))
  );
};

export const generateMockCharts = (artistIds: string[], chartsPerArtist: number = 1): Omit<Chart, 'id' | 'createdAt'>[] => {
  return artistIds.flatMap(artistId => 
    Array.from({ length: chartsPerArtist }, () => generateMockChart(artistId))
  );
};

export const generateMockProspects = (count: number): Omit<Prospect, 'id' | 'discoveredAt'>[] => {
  return Array.from({ length: count }, () => generateMockProspect());
};

export const generateMockFinancialRecords = (artistIds: string[], recordsPerArtist: number = 5): Omit<FinancialRecord, 'id' | 'createdAt'>[] => {
  return artistIds.flatMap(artistId => 
    Array.from({ length: recordsPerArtist }, () => generateMockFinancialRecord(artistId))
  );
};

export const generateMockContracts = (artistIds: string[]): Omit<Contract, 'id' | 'createdAt'>[] => {
  return artistIds.map(artistId => generateMockContract(artistId));
};

export const generateMockIndustryNews = (count: number): Omit<IndustryNews, 'id' | 'createdAt'>[] => {
  return Array.from({ length: count }, () => generateMockIndustryNews());
}; 