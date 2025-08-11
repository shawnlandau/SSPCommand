export type StateCode =
  | "AK"
  | "AL"
  | "FL"
  | "GA"
  | "IL"
  | "IN"
  | "KY"
  | "LA"
  | "MI"
  | "MO"
  | "MS"
  | "OH"
  | "TN"
  | "WV";

export type Stage = "Prospect" | "Qualify" | "Develop" | "Propose" | "CloseWon" | "CloseLost";

export interface Account {
  id: string;
  name: string;
  state: StateCode;
  industry?: string;
  ownerEmail?: string;
  heatScore?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Opportunity {
  id: string;
  accountId: string;
  name: string;
  amount: number; // USD
  stage: Stage;
  closeDate?: string; // ISO
  coSell?: boolean;
  notes?: string;
  state: StateCode;
  heatScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type SignalType = "News" | "RFP" | "Job" | "Other";

export interface Signal {
  id: string;
  accountId?: string; // optional if general state signal
  state?: StateCode;
  type: SignalType;
  title: string;
  url?: string;
  publishedAt?: string; // ISO
  summary?: string;
  tags?: string[];
  source: string; // provider name or feed URL
  embedding?: number[]; // pgvector
  createdAt?: string;
}

export interface Note {
  id: string;
  opportunityId: string;
  authorEmail: string;
  body: string;
  createdAt: string;
  embedding?: number[];
}

export interface KPI {
  pipelineUSD: number;
  coverageRatio: number;
  winRate: number;
  coSellCount: number;
}

export interface ScoringWeights {
  base: number;
  signalWeights: {
    News: number;
    RFP: number;
    Job: number;
    Other: number;
  };
  opportunity: {
    amountMultiplier: number; // per $100k
    stageBoosts: Record<Stage, number>;
    coSellBoost: number;
    recencyHalfLifeDays: number;
  };
  tags: Record<string, number>;
}



