import { describe, it, expect } from "vitest";
import { computeOpportunityScore, classifySignalTags, loadWeights } from "@/lib/scoring";
import type { Opportunity, Signal } from "@/types";

describe("scoring", () => {
  it("computes higher score for higher amount and stage", () => {
    const baseOpp: Opportunity = {
      id: "o1",
      accountId: "a1",
      name: "Test",
      amount: 100000,
      stage: "Prospect",
      state: "OH",
    };
    const signals: Signal[] = [];
    const low = computeOpportunityScore(baseOpp, signals);
    const high = computeOpportunityScore({ ...baseOpp, amount: 500000, stage: "Propose" }, signals);
    expect(high).toBeGreaterThan(low);
  });

  it("classifies tags based on keywords", () => {
    const tags = classifySignalTags({ title: "State issues RFP for modernization", summary: "Azure and GitHub" });
    expect(tags).toContain("RFP");
    expect(tags).toContain("Modernization");
    expect(tags).toContain("Azure");
    expect(tags).toContain("GitHub");
  });

  it("loads weights", () => {
    const w = loadWeights();
    expect(w.base).toBeTypeOf("number");
  });
});



