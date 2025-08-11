"use client";
import { useState } from "react";

export default function SimulatorPage() {
  const [goal, setGoal] = useState(2000000);
  const [pipeline, setPipeline] = useState({ Prospect: 600000, Qualify: 400000, Develop: 300000, Propose: 200000 });
  const [winRate, setWinRate] = useState(0.25);

  const currentWeighted = pipeline.Prospect*0.1 + pipeline.Qualify*0.25 + pipeline.Develop*0.5 + pipeline.Propose*0.75;
  const gap = Math.max(0, goal - currentWeighted*winRate);

  const scenarios = [
    { label: "Lift win-rate +5pp", impact: currentWeighted*(winRate+0.05) - currentWeighted*winRate },
    { label: "Add 5 opps @$150k", impact: 5*150000*0.25*winRate },
    { label: "Shift 3 opps to Propose", impact: 3*150000*(0.75-0.5)*winRate },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Quota Path Simulator</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded border bg-white p-4 space-y-3">
          <label className="block text-sm">Goal (quarter)</label>
          <input type="number" value={goal} onChange={(e)=>setGoal(parseInt(e.target.value||"0"))} className="w-full border rounded px-3 py-2" />
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(pipeline).map(([k,v]) => (
              <div key={k}>
                <label className="block text-sm">{k} pipeline</label>
                <input type="number" value={v} onChange={(e)=>setPipeline({...pipeline, [k]: parseInt(e.target.value||"0")})} className="w-full border rounded px-3 py-2" />
              </div>
            ))}
          </div>
          <label className="block text-sm">Win rate</label>
          <input type="number" step="0.01" value={winRate} onChange={(e)=>setWinRate(parseFloat(e.target.value||"0"))} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="rounded border bg-white p-4 space-y-2">
          <div className="text-sm text-gray-600">Weighted pipeline x win-rate</div>
          <div className="text-2xl font-semibold">${(currentWeighted*winRate).toLocaleString()}</div>
          <div className="text-sm text-gray-600">Gap to goal</div>
          <div className="text-2xl font-semibold text-red-600">${gap.toLocaleString()}</div>
          <div className="mt-4">
            <h2 className="font-semibold mb-2">Scenarios to hit target</h2>
            <ul className="list-disc list-inside text-sm">
              {scenarios.map((s) => (
                <li key={s.label}>{s.label}: +${Math.round(s.impact).toLocaleString()}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}



