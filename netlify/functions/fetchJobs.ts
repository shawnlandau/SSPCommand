import type { Handler } from "@netlify/functions";
import { v4 as uuidv4 } from "uuid";
import { classifySignalTags } from "../../lib/scoring";
import type { Signal, StateCode } from "../../types";

// Mock provider that generates job postings per state
function mockJobPosts(states: StateCode[]): Signal[] {
  const now = new Date().toISOString();
  return states.map((s) => ({
    id: uuidv4(),
    type: "Job",
    title: `Hiring: Azure DevOps Engineer (${s})`,
    state: s,
    source: "mock-jobs",
    summary: "Public sector hiring spike for Azure/DevOps skills.",
    tags: classifySignalTags({ title: `Azure DevOps Engineer ${s}`, summary: "hiring Azure and DevOps engineers" }),
    createdAt: now,
  }));
}

export const handler: Handler = async () => {
  const states: StateCode[] = [
    "AK","AL","FL","GA","IL","IN","KY","LA","MI","MO","MS","OH","TN","WV"
  ];
  const signals = mockJobPosts(states);
  return {
    statusCode: 200,
    body: JSON.stringify({ count: signals.length }),
  };
};


