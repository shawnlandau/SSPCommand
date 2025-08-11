import type { Handler } from "@netlify/functions";
import { postTeamsMessage } from "../../lib/teams";

export const handler: Handler = async () => {
  // Mock digest content
  const title = "Daily Territory Digest";
  const text = [
    "Top Accounts:",
    "1) Ohio Health - Heat 82 - Action: Schedule discovery",
    "2) State of TN - Heat 76 - Action: Review RFP",
    "3) MI DOT - Heat 71 - Action: Align solution plays",
  ].join("\n");
  await postTeamsMessage(title, text);
  return { statusCode: 200, body: JSON.stringify({ posted: true }) };
};


