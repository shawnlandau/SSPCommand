const MOCK = [
  { id: "s1", type: "News", title: "Azure ARC adoption rises in IL", state: "IL", tags: ["Azure"] },
  { id: "s2", type: "RFP", title: "TN issues modernization RFP", state: "TN", tags: ["RFP", "Modernization"] },
  { id: "s3", type: "Job", title: "Hiring Azure DevOps in OH", state: "OH", tags: ["JobSpike", "DevOps"] },
];

export default function SignalsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Signals</h1>
      <div className="grid gap-3">
        {MOCK.map((s) => (
          <div key={s.id} className="rounded border bg-white p-3">
            <div className="text-sm text-gray-500">{s.type} • {s.state}</div>
            <div className="font-medium">{s.title}</div>
            <div className="flex gap-2 mt-1">
              {s.tags?.map((t: string) => (
                <span key={t} className="text-xs border rounded-full px-2 py-0.5 bg-gray-50">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



