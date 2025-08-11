import { NextRequest, NextResponse } from "next/server";
import { generateMeetingPrep } from "@/lib/ai";
import fs from "node:fs";
import path from "node:path";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { opportunity_name, account_name, state, stage, amount, close_date, co_sell, signals_bulleted } = body || {};
  const promptTemplate = fs.readFileSync(path.join(process.cwd(), "config/prompts/meeting_prep.txt"), "utf-8");
  const prompt = promptTemplate
    .replace("{{opportunity_name}}", opportunity_name ?? "")
    .replace("{{account_name}}", account_name ?? "")
    .replace("{{state}}", state ?? "")
    .replace("{{stage}}", stage ?? "")
    .replace("{{amount}}", String(amount ?? ""))
    .replace("{{close_date}}", close_date ?? "")
    .replace("{{co_sell}}", String(co_sell ?? ""))
    .replace("{{signals_bulleted}}", signals_bulleted ?? "");
  const text = await generateMeetingPrep({ prompt });
  return NextResponse.json({ text });
}



