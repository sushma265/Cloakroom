"use client";

import { useState } from "react";

const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6"];
const GTV = [180, 205, 198, 240, 265, 284]; // $k
const RETURN_RATE = [29, 27, 26, 24, 21, 19]; // %

const KPIS = [
  { label: "Creator GTV (30d)", value: "$284,500", delta: "+22% MoM", tone: "moss" as const },
  { label: "Return rate", value: "19%", delta: "−11pt vs. baseline", tone: "moss" as const },
  { label: "Active storefronts", value: "1,240", delta: "+8% MoM", tone: "brass" as const },
  { label: "Avg. campaign ROI", value: "4.2×", delta: "+0.6× MoM", tone: "brass" as const },
];

function BarChart() {
  const max = Math.max(...GTV);
  const w = 320;
  const h = 140;
  const barW = 32;
  const gap = (w - barW * GTV.length) / (GTV.length - 1);

  return (
    <svg viewBox={`0 0 ${w} ${h + 24}`} className="w-full" role="img" aria-label="Weekly creator GTV in thousands of dollars">
      {GTV.map((v, i) => {
        const barH = (v / max) * h;
        const x = i * (barW + gap);
        const y = h - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill="#C9A04D" opacity={0.4 + (i / GTV.length) * 0.6} />
            <text x={x + barW / 2} y={h + 16} textAnchor="middle" className="font-tag" fontSize="9" fill="#C9BFAF">
              {WEEKS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function TrendLine() {
  const w = 320;
  const h = 100;
  const max = Math.max(...RETURN_RATE);
  const min = Math.min(...RETURN_RATE);
  const range = max - min || 1;
  const stepX = w / (RETURN_RATE.length - 1);

  const points = RETURN_RATE.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / range) * (h - 20) - 10;
    return [x, y];
  });

  const path = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Weekly return rate trending down">
      <path d={path} fill="none" stroke="#7FA98A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#7FA98A" />
      ))}
    </svg>
  );
}

export default function BrandPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics: [
            { label: "Creator GTV (30d)", value: "$284,500, +22% month over month" },
            { label: "Return rate", value: "19%, down from a 30% category baseline" },
            { label: "Active storefronts", value: "1,240, +8% month over month" },
            { label: "Avg. campaign ROI", value: "4.2x, up from 3.6x" },
            { label: "Weekly GTV trend ($k)", value: GTV.join(", ") },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong.");
      setSummary(data.summary);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="font-display text-xl text-cream">Brand ROI dashboard</h3>
      <p className="mt-1.5 max-w-2xl text-sm text-creamDim">
        Mock campaign data for a mid-size brand running on Cloakroom's rails. Generate an
        executive summary to see Gemini 2.5 Flash read the metrics like a merchandiser would.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-lg border border-cream/15 bg-ink2 p-4">
            <p className="font-tag text-[10.5px] uppercase tracking-wide text-creamDim/60">{k.label}</p>
            <p className="mt-1.5 font-display text-2xl text-cream">{k.value}</p>
            <p className={`mt-1 text-xs ${k.tone === "moss" ? "text-moss" : "text-brassLight"}`}>{k.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-cream/15 bg-ink2 p-5">
          <p className="font-tag text-[11px] uppercase tracking-wide text-creamDim/70">Creator GTV by week</p>
          <div className="mt-3">
            <BarChart />
          </div>
        </div>
        <div className="rounded-lg border border-cream/15 bg-ink2 p-5">
          <p className="font-tag text-[11px] uppercase tracking-wide text-creamDim/70">Return rate trend</p>
          <div className="mt-3">
            <TrendLine />
          </div>
        </div>
      </div>

      <button
        onClick={generate}
        disabled={loading}
        className="mt-6 rounded-full bg-brass px-5 py-3 font-body text-sm font-semibold text-ink transition hover:bg-brassLight disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Reading the numbers…" : "Generate executive insight"}
      </button>

      {error && (
        <p className="mt-3 rounded-md border border-rust/40 bg-rust/10 px-3 py-2 text-sm text-creamDim">
          {error}
        </p>
      )}

      {summary && (
        <p className="mt-4 max-w-2xl rounded-md border border-brass/25 bg-velvet/30 px-4 py-3 text-sm leading-relaxed text-creamDim">
          <span className="mr-1 font-tag text-[10px] uppercase tracking-wide text-brassLight">
            Executive summary —
          </span>
          {summary}
        </p>
      )}
    </div>
  );
}
