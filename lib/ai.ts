import OpenAI from "openai";

type Provider = "azure" | "openai";

function getProvider(): Provider {
  return (process.env.AI_PROVIDER as Provider) || "azure";
}

function getClient() {
  const provider = getProvider();
  if (provider === "azure") {
    return new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/extensions`,
    });
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function generateMeetingPrep(input: {
  prompt: string;
  model?: string;
}) {
  const client = getClient();
  const model = input.model || process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini";
  const chat = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "You are a concise enterprise sales assistant." },
      { role: "user", content: input.prompt },
    ],
    temperature: 0.2,
    max_tokens: 400,
  });
  return chat.choices[0]?.message?.content || "";
}



