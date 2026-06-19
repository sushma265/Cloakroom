"use client";

import { useState } from "react";

interface Drop {
  dropTitle: string;
  caption: string;
  hashtags: string[];
  affiliatePitch: string;
  suggestedTake: string;
}

export default function CreatorPanel() {
  const [handle, setHandle] = useState("maya.wears");
  const [productName, setProductName] = useState("Linen wrap blazer");
  const [price, setPrice] = useState("$128");
  const [vibe, setVibe] = useState("quiet luxury, off-duty editor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drop, setDrop] = useState<Drop | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setDrop(null);
    try {
      const res = await fetch("/api/creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, productName, price, vibe }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong.");
      setDrop(data.drop);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <h3 className="font-display text-xl text-cream">Creator storefront generator</h3>
        <p className="mt-1.5 text-sm text-creamDim">
          A creator drops in what they're wearing — Cloakroom turns it into a shoppable
          drop with copy, hashtags, and an affiliate pitch, ready to paste into a story.
        </p>

        <div className="mt-6 grid gap-4">
          <Field label="Creator handle" value={handle} onChange={setHandle} prefix="@" />
          <Field label="Product" value={productName} onChange={setProductName} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price" value={price} onChange={setPrice} />
            <Field label="Vibe / aesthetic" value={vibe} onChange={setVibe} />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!handle || !productName || loading}
          className="mt-5 w-full rounded-full bg-brass px-5 py-3 font-body text-sm font-semibold text-ink transition hover:bg-brassLight disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Writing the drop…" : "Generate drop"}
        </button>

        {error && (
          <p className="mt-3 rounded-md border border-rust/40 bg-rust/10 px-3 py-2 text-sm text-creamDim">
            {error}
          </p>
        )}
      </div>

      <div>
        <p className="mb-2 font-tag text-[11px] uppercase tracking-wide text-creamDim/70">
          Storefront preview
        </p>
        <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-cream/15 bg-ink2 p-5">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-creamDim/70">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
              <p className="text-sm">Cloakroom is writing this drop…</p>
            </div>
          ) : drop ? (
            <div className="tag-card shadow-tag w-full px-6 py-7">
              <p className="font-tag text-[10px] uppercase tracking-wide text-ink/50">
                @{handle} · {price}
              </p>
              <h4 className="mt-2 font-display text-2xl text-ink">{drop.dropTitle}</h4>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">{drop.caption}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {drop.hashtags.map((h) => (
                  <span key={h} className="rounded-full bg-ink/10 px-2.5 py-1 text-xs text-ink/70">
                    {h}
                  </span>
                ))}
              </div>
              <div className="mt-5 rounded-md bg-ink/5 px-3.5 py-3">
                <p className="font-tag text-[10px] uppercase tracking-wide text-ink/50">
                  Story sticker pitch
                </p>
                <p className="mt-1 text-sm text-ink/80">{drop.affiliatePitch}</p>
              </div>
              <p className="mt-4 font-tag text-[10px] uppercase tracking-wide text-brassDim">
                Cloakroom take · {drop.suggestedTake}
              </p>
            </div>
          ) : (
            <p className="px-6 text-center text-sm text-creamDim/50">
              Fill in the form and generate to preview the storefront drop here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-tag text-[11px] uppercase tracking-wide text-creamDim/70">
        {label}
      </span>
      <div className="flex items-center rounded-md border border-cream/20 bg-ink2 px-3 focus-within:border-brass">
        {prefix && <span className="text-creamDim/50">{prefix}</span>}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-2.5 text-sm text-cream placeholder:text-creamDim/40 focus:outline-none"
        />
      </div>
    </label>
  );
}
