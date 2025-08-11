import type { Handler } from "@netlify/functions";
import Parser from "rss-parser";
import { v4 as uuidv4 } from "uuid";
import { classifySignalTags } from "../../lib/scoring";
import type { Signal } from "../../types";

const parser = new Parser();

// Mock list of state RFP feeds (placeholders)
const STATE_RFP_FEEDS: Record<string, string> = {
  AK: "https://example.com/ak/rfp/rss",
  AL: "https://example.com/al/rfp/rss",
  FL: "https://example.com/fl/rfp/rss",
  GA: "https://example.com/ga/rfp/rss",
  IL: "https://example.com/il/rfp/rss",
  IN: "https://example.com/in/rfp/rss",
  KY: "https://example.com/ky/rfp/rss",
  LA: "https://example.com/la/rfp/rss",
  MI: "https://example.com/mi/rfp/rss",
  MO: "https://example.com/mo/rfp/rss",
  MS: "https://example.com/ms/rfp/rss",
  OH: "https://example.com/oh/rfp/rss",
  TN: "https://example.com/tn/rfp/rss",
  WV: "https://example.com/wv/rfp/rss",
};

export const handler: Handler = async () => {
  const signals: Signal[] = [];
  for (const [state, feed] of Object.entries(STATE_RFP_FEEDS)) {
    try {
      const res = await parser.parseURL(feed);
      for (const item of res.items || []) {
        const title = item.title || "";
        const summary = item.contentSnippet || item.content || "";
        const s: Signal = {
          id: uuidv4(),
          type: "RFP",
          title,
          url: item.link,
          state: state as any,
          source: feed,
          summary,
          tags: classifySignalTags({ title, summary }),
          createdAt: new Date().toISOString(),
        };
        signals.push(s);
      }
    } catch {
      // mock mode ignores failures
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ count: signals.length }),
  };
};


