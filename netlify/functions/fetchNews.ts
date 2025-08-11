import type { Handler } from "@netlify/functions";
import Parser from "rss-parser";
import { v4 as uuidv4 } from "uuid";
import { classifySignalTags } from "../../lib/scoring";
import type { Signal } from "../../types";

const parser = new Parser();

const TERMS = [
  "Azure",
  "DevOps",
  "GitHub",
  "modernization",
  "Alaska",
  "Alabama",
  "Florida",
  "Georgia",
  "Illinois",
  "Indiana",
  "Kentucky",
  "Louisiana",
  "Michigan",
  "Missouri",
  "Mississippi",
  "Ohio",
  "Tennessee",
  "West Virginia",
];

const FEEDS = [
  "https://news.google.com/rss/search?q=Azure",
  "https://news.google.com/rss/search?q=DevOps",
  "https://news.google.com/rss/search?q=GitHub",
  "https://news.google.com/rss/search?q=modernization",
];

export const handler: Handler = async () => {
  const signals: Signal[] = [];
  for (const feed of FEEDS) {
    try {
      const res = await parser.parseURL(feed);
      for (const item of res.items || []) {
        const title = item.title || "";
        if (!TERMS.some((t) => title.includes(t))) continue;
        const s: Signal = {
          id: uuidv4(),
          type: "News",
          title,
          url: item.link,
          source: feed,
          summary: item.contentSnippet || item.content || "",
          tags: classifySignalTags({ title, summary: item.contentSnippet || item.content || "" }),
          createdAt: new Date().toISOString(),
        };
        signals.push(s);
      }
    } catch (e) {
      // ignore feed errors
    }
  }

  // TODO: persist to Supabase
  return {
    statusCode: 200,
    body: JSON.stringify({ count: signals.length }),
  };
};


