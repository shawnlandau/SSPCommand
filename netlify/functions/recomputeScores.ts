import type { Handler } from "@netlify/functions";
import { computeOpportunityScore } from "../../lib/scoring";
import type { Opportunity, Signal } from "../../types";

export const handler: Handler = async () => {
  // Mock: pretend to load opportunities and recent signals and recompute
  const opportunities: Opportunity[] = [
    { id: "1", accountId: "a1", name: "Modernize ERP", amount: 350000, stage: "Develop", state: "OH", coSell: true },
  ];
  const signals: Signal[] = [
    { id: "s1", type: "RFP", title: "State issues ERP modernization RFP", source: "mock", createdAt: new Date().toISOString(), tags: ["RFP", "Modernization", "Azure"] },
  ];
  const recomputed = opportunities.map((o) => ({ id: o.id, score: computeOpportunityScore(o, signals) }));

  // TODO: persist new scores to Supabase
  return {
    statusCode: 200,
    body: JSON.stringify({ recomputed }),
  };
};


