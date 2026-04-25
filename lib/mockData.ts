// lib/mockData.ts
// Hackathon mock data — replace with real Copernicus + NGO API calls post-demo.

export type PollutionSource = 'satellite' | 'ngo-sensor' | 'citizen';
export type Severity = 'low' | 'moderate' | 'high' | 'critical';

export interface PollutionPoint {
  id: string;
  coords: [number, number]; // [lat, lng]
  name: string;
  source: PollutionSource;
  severity: Severity;
  metrics: {
    chlorophyll_mg_m3: number; // Sentinel-3 OLCI proxy
    nitrates_mg_l: number;
    phosphates_mg_l: number;
    heatAnomaly_C: number;     // Sentinel-3 SLSTR thermal
  };
  reportedAt: string; // ISO
  notes?: string;
}

// Real-ish points along the Danube — Bucharest area, Iron Gates, Delta, etc.
export const POLLUTION_POINTS: PollutionPoint[] = [
  {
    id: 'p-001',
    coords: [44.4268, 26.1025], // Bucharest tributary outlet
    name: 'Dâmbovița confluence',
    source: 'citizen',
    severity: 'high',
    metrics: { chlorophyll_mg_m3: 38.2, nitrates_mg_l: 12.4, phosphates_mg_l: 2.1, heatAnomaly_C: 1.8 },
    reportedAt: '2026-04-23T08:14:00Z',
    notes: 'Algal bloom + plastic debris reported by 3 citizens.',
  },
  {
    id: 'p-002',
    coords: [44.6228, 22.6750], // Iron Gates I
    name: 'Iron Gates Reservoir',
    source: 'satellite',
    severity: 'moderate',
    metrics: { chlorophyll_mg_m3: 22.1, nitrates_mg_l: 6.8, phosphates_mg_l: 1.0, heatAnomaly_C: 0.6 },
    reportedAt: '2026-04-24T11:00:00Z',
  },
  {
    id: 'p-003',
    coords: [45.2157, 28.7969], // Tulcea / Delta entry
    name: 'Tulcea — Delta intake',
    source: 'ngo-sensor',
    severity: 'low',
    metrics: { chlorophyll_mg_m3: 8.4, nitrates_mg_l: 2.1, phosphates_mg_l: 0.3, heatAnomaly_C: 0.2 },
    reportedAt: '2026-04-24T07:30:00Z',
    notes: 'Stable readings — protected zone.',
  },
  {
    id: 'p-004',
    coords: [44.0833, 27.2667], // Călărași
    name: 'Călărași industrial outflow',
    source: 'satellite',
    severity: 'critical',
    metrics: { chlorophyll_mg_m3: 51.7, nitrates_mg_l: 18.9, phosphates_mg_l: 3.6, heatAnomaly_C: 3.4 },
    reportedAt: '2026-04-24T15:22:00Z',
    notes: 'Sentinel-2 detected color anomaly + Sentinel-3 thermal spike.',
  },
];

export interface NGO {
  id: string;
  name: string;
  region: string;
  description: string;
  sensorCount: number;
  // Subset of points belonging to this NGO — for the home-page mini map
  pointIds: string[];
  accent: 'water' | 'grass' | 'dusk';
}

export const NGOS: NGO[] = [
  {
    id: 'ngo-1',
    name: 'Asociația Salvați Dunărea',
    region: 'Lower Danube · RO',
    description: 'Field sensors and water-sampling teams across the Romanian stretch.',
    sensorCount: 24,
    pointIds: ['p-003', 'p-004'],
    accent: 'water',
  },
  {
    id: 'ngo-2',
    name: 'Danube Delta Watch',
    region: 'Tulcea · RO',
    description: 'Biodiversity & water-quality monitoring inside the Biosphere Reserve.',
    sensorCount: 11,
    pointIds: ['p-003'],
    accent: 'grass',
  },
  {
    id: 'ngo-3',
    name: 'Iron Gates Coalition',
    region: 'RO/RS border',
    description: 'Cross-border pollution alerts, focus on heavy industry runoff.',
    sensorCount: 8,
    pointIds: ['p-002'],
    accent: 'dusk',
  },
];

// Citizen-Science form schema — drives the camera-flow questionnaire
export const ODOR_OPTIONS  = ['Odorless', 'Chemical', 'Rotten Eggs / Sulfur', 'Sewage', 'Fishy'] as const;
export const COLOR_OPTIONS = ['Clear', 'Brown', 'Greenish', 'Reddish', 'Black', 'Foamy White'] as const;
export const FLOW_OPTIONS  = ['Low', 'Normal', 'High', 'Flood'] as const;
export const ACTIVITY_OPTIONS = ['Factory nearby', 'Agriculture/Farm runoff', 'Boats/Marina', 'Construction', 'None visible'] as const;

export type CitizenReport = {
  photoDataUrl?: string;
  odor:    typeof ODOR_OPTIONS[number]   | null;
  color:   typeof COLOR_OPTIONS[number]  | null;
  flow:    typeof FLOW_OPTIONS[number]   | null;
  activity: typeof ACTIVITY_OPTIONS[number][];
  submittedAt?: string;
};

// --- Chatbot context (mock state, swap for Zustand) ---
// The camera flow writes the most recent report here; the chatbot reads it on mount.
export const chatbotContext: { lastReport: CitizenReport | null } = {
  lastReport: null,
};

export function buildChatbotGreeting(): string {
  const r = chatbotContext.lastReport;
  if (!r) return "Hi! I'm DanubeGuard AI. Ask me anything about water quality, your area, or how to interpret satellite data.";

  if (r.odor === 'Rotten Eggs / Sulfur') {
    return "I noticed you reported a sulfur smell. This usually indicates high nitrite levels or organic decomposition (anaerobic conditions). How can I help you analyze this area further?";
  }
  if (r.color === 'Greenish' || r.color === 'Foamy White') {
    return `You reported water that looks "${r.color.toLowerCase()}" — this often correlates with eutrophication or algal blooms. Want me to pull the latest Sentinel-3 chlorophyll readings for your zone?`;
  }
  if (r.activity?.includes('Factory nearby')) {
    return "Thanks for flagging factory activity nearby. I can cross-reference EU industrial emission registries for that zone if you'd like.";
  }
  return `Thanks for your recent report. I logged: odor=${r.odor ?? '—'}, color=${r.color ?? '—'}, flow=${r.flow ?? '—'}. What would you like to explore?`;
}
