import fs from "node:fs";
import path from "node:path";
import type { Opportunity, Signal, ScoringWeights } from "@/types";

let cachedWeights: ScoringWeights | null = null;

export function loadWeights(): ScoringWeights {
  if (cachedWeights) return cachedWeights;
  const filePath = path.join(process.cwd(), "config", "scoring.json");
  const json = JSON.parse(fs.readFileSync(filePath, "utf-8")) as ScoringWeights;
  cachedWeights = json;
  return json;
}

export function computeOpportunityScore(opportunity: Opportunity, recentSignals: Signal[]): number {
  const weights = loadWeights();
  let score = weights.base;

  // Opportunity amount influence
  score += (opportunity.amount / 100_000) * weights.opportunity.amountMultiplier;

  // Stage boost
  score += weights.opportunity.stageBoosts[opportunity.stage];

  // Co-sell boost
  if (opportunity.coSell) score += weights.opportunity.coSellBoost;

  // Signals
  for (const s of recentSignals) {
    const w = weights.signalWeights[s.type] ?? 0;
    score += w;
    if (s.tags) {
      for (const t of s.tags) {
        score += weights.tags[t] ?? 0;
      }
    }
  }

  return Math.max(0, Math.round(score));
}

export function classifySignalTags(input: { title: string; summary?: string }): string[] {
  const text = `${input.title} ${input.summary ?? ""}`.toLowerCase();
  const tags: string[] = [];
  if (/\brfp\b|request for proposal|bid due|due date/i.test(text)) tags.push("RFP");
  if (/acquires|acquisition|merger|m&a/i.test(text)) tags.push("M&A");
  if (/hiring|job\s+openings|engineer|developer|azure|devops|github/i.test(text)) tags.push("JobSpike");
  if (/modernization|legacy|mainframe|migration/i.test(text)) tags.push("Modernization");
  if (/azure/i.test(text)) tags.push("Azure");
  if (/github/i.test(text)) tags.push("GitHub");
  return Array.from(new Set(tags));
}



