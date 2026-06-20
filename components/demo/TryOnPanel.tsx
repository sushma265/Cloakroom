"use client";

import { useState } from "react";
import ImageDrop, { ImagePayload } from "./ImageDrop";

interface TryOnImage {
  url?: string;
  data?: string;
  mimeType?: string;
}

interface TryOnResult {
  image: TryOnImage;
  note: string;
}

function imageSrc(image: TryOnImage) {
  if (image.url) return image.url;
  if (image.data) return `data:${image.mimeType ?? "image/png"};base64,${image.data}`;
  return "";
}

export default function TryOnPanel() {
  const [person, setPerson] = useState<ImagePayload | null>(null);
  const [garment, setGarment] = useState<ImagePayload | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TryOnResult | null>(null);

  async function generate() {
    if (!person || !garment) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personImage: person, garmentImage: garment, garmentNote: note }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult({ image: data.image, note: data.note });
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <h3 className="font-display text-xl text-cream">Virtual try-on engine</h3>
        <p className="mt-1.5 text-sm text-creamDim">
          Upload a photo of a person and a garment. Rendered live by the IDM-VTON
          virtual try-on model, hosted free on Hugging Face.
        </p>
        <p className="mt-2 font-tag text-[10px] uppercase tracking-wide text-brassDim">
          Runs on a shared community GPU queue — first render may take 30–90s
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <ImageDrop label="Person photo" hint="Front-facing, plain background works best" onImage={setPerson} />
          <ImageDrop label="Garment photo" hint="Flat-lay or on a model" onImage={setGarment} />
        </div>

        <label className="mt-5 block">
          <span className="mb-1.5 block font-tag text-[11px] uppercase tracking-wide text-creamDim/70">
            Garment description (optional)
          </span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. cropped denim jacket"
            className="w-full rounded-md border border-cream/20 bg-ink2 px-3 py-2.5 text-sm text-cream placeholder:text-creamDim/40 focus:border-brass focus:outline-none"
          />
        </label>

        <button
          onClick={generate}
          disabled={!person || !garment || loading}
          className="mt-5 w-full rounded-full bg-brass px-5 py-3 font-body text-sm font-semibold text-ink transition hover:bg-brassLight disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Draping garment…" : "Generate try-on"}
        </button>

        {error && (
          <p className="mt-3 rounded-md border border-rust/40 bg-rust/10 px-3 py-2 text-sm text-creamDim">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <p className="mb-2 font-tag text-[11px] uppercase tracking-wide text-creamDim/70">Result</p>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-cream/15 bg-ink2 p-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-creamDim/70">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
              <p className="text-sm">Rendering on the shared GPU queue…</p>
            </div>
          ) : result ? (
            <div className="w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc(result.image)}
                alt="Virtual try-on result"
                className="mx-auto max-h-[420px] rounded-md object-contain"
              />
              {result.note && (
                <p className="mt-4 rounded-md border border-brass/25 bg-velvet/30 px-4 py-3 text-sm leading-relaxed text-creamDim">
                  <span className="mr-1 font-tag text-[10px] uppercase tracking-wide text-brassLight">
                    Note —
                  </span>
                  {result.note}
                </p>
              )}
            </div>
          ) : (
            <p className="px-6 text-center text-sm text-creamDim/50">
              Upload both photos and generate to see the composite render here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
