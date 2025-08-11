import { notFound } from "next/navigation";
import { generateMeetingPrep } from "@/lib/ai";

const MOCK = [
  { id: "1", name: "Ohio Health - Data Platform", amount: 650000, stage: "Develop", state: "OH", coSell: true },
  { id: "2", name: "TN DoT - DevOps Modernization", amount: 420000, stage: "Qualify", state: "TN", coSell: false },
];

export default async function OpportunityDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opp = MOCK.find((o) => o.id === id);
  if (!opp) return notFound();

  async function getAISummary() {
    const prompt = `Summarize opportunity: ${opp.name} in ${opp.state}, stage ${opp.stage}, amount $${opp.amount}.`;
    try {
      const summary = await generateMeetingPrep({ prompt });
      return summary;
    } catch {
      return "Summary unavailable in mock mode.";
    }
  }

  const summary = await getAISummary();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{opp.name}</h1>
        <button className="px-3 py-2 border rounded">Generate Meeting Prep</button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded border bg-white p-4">
            <h2 className="font-semibold mb-2">AI Summary</h2>
            <div className="prose max-w-none whitespace-pre-wrap text-sm">{summary}</div>
          </div>
          <div className="rounded border bg-white p-4">
            <h2 className="font-semibold mb-2">Notes</h2>
            <ul className="space-y-2 text-sm">
              <li className="border p-2 rounded">Kickoff call scheduled for next week.</li>
              <li className="border p-2 rounded">Security team interested in GitHub Advanced Security.</li>
            </ul>
          </div>
        </div>
        <div className="space-y-2">
          <div className="rounded border bg-white p-4">
            <div className="text-sm text-gray-500">Amount</div>
            <div className="text-lg font-semibold">${opp.amount.toLocaleString()}</div>
          </div>
          <div className="rounded border bg-white p-4">
            <div className="text-sm text-gray-500">Stage</div>
            <div className="text-lg font-semibold">{opp.stage}</div>
          </div>
          <div className="rounded border bg-white p-4">
            <div className="text-sm text-gray-500">State</div>
            <div className="text-lg font-semibold">{opp.state}</div>
          </div>
        </div>
      </div>
    </div>
  );
}



