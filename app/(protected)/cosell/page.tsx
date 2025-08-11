export default function CoSellPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Co-Sell Readiness</h1>
      <div className="rounded border bg-white p-4 space-y-2">
        <p className="text-sm text-gray-700">Hitachi Solutions advanced specializations and readiness summary for Azure and GitHub solution plays. Content is static in v1.</p>
        <ul className="list-disc list-inside text-sm text-gray-700">
          <li>Azure Expert MSP</li>
          <li>Analytics on Microsoft Azure</li>
          <li>Modernization of Web Applications</li>
          <li>DevOps with GitHub</li>
        </ul>
      </div>
      <form className="rounded border bg-white p-4 space-y-3">
        <h2 className="font-semibold">Partner Center Metadata</h2>
        <input className="w-full border rounded px-3 py-2" placeholder="Solution play tags (comma-separated)" />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Description" rows={4} />
        <button className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
      </form>
    </div>
  );
}



