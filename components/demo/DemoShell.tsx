"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DemoTabs, { DemoTab } from "./DemoTabs";
import SetupBanner from "./SetupBanner";
import TryOnPanel from "./TryOnPanel";
import CreatorPanel from "./CreatorPanel";
import BrandPanel from "./BrandPanel";
import StylistPanel from "./StylistPanel";

const TABS: DemoTab[] = [
  { id: "tryon", eyebrow: "Shopper", label: "Virtual try-on" },
  { id: "creator", eyebrow: "Creator", label: "Storefront studio" },
  { id: "brand", eyebrow: "Brand", label: "ROI dashboard" },
  { id: "stylist", eyebrow: "Phase 2", label: "AI stylist" },
];

export default function DemoShell({ initialTab }: { initialTab: string }) {
  const [active, setActive] = useState(
    TABS.some((t) => t.id === initialTab) ? initialTab : "tryon"
  );
  const [hfConfigured, setHfConfigured] = useState<boolean | null>(null);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => {
        setHfConfigured(Boolean(d.hf));
        setGeminiConfigured(Boolean(d.gemini));
      })
      .catch(() => {
        setHfConfigured(false);
        setGeminiConfigured(false);
      });
  }, []);

  // tryon needs Hugging Face; the other three panels need Gemini.
  const needsBanner =
    active === "tryon" ? hfConfigured === false : geminiConfigured === false;
  const bannerProvider = active === "tryon" ? "huggingface" : "gemini";

  return (
    <main className="min-h-screen bg-grain pb-24">
      <header className="sticky top-0 z-50 border-b border-cream/10 bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <rect width="100" height="100" rx="18" fill="#1C1714" />
              <path
                d="M20 32h60M30 32v8c0 11 9 16 20 16s20-5 20-16v-8"
                stroke="#C9A04D"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-display text-base text-cream">Cloakroom</span>
          </Link>
          <span className="font-tag text-[11px] uppercase tracking-wide text-creamDim/60">
            Demo console
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 pt-10">
        <p className="font-tag text-xs uppercase tracking-[0.2em] text-brassLight/80">Live prototype</p>
        <h1 className="mt-2 font-display text-3xl text-cream md:text-[2.2rem]">
          Try the AI rail yourself
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-creamDim">
          The try-on render runs on Hugging Face; storefront copy, ROI insights, and the
          stylist chat run on Gemini 2.5 Flash.
        </p>

        {needsBanner && <div className="mt-6"><SetupBanner provider={bannerProvider} /></div>}

        <div className="mt-8">
          <DemoTabs tabs={TABS} active={active} onChange={setActive} />
        </div>

        <div className="mt-8 rounded-xl border border-cream/10 bg-ink2/60 p-6 md:p-9">
          {active === "tryon" && <TryOnPanel />}
          {active === "creator" && <CreatorPanel />}
          {active === "brand" && <BrandPanel />}
          {active === "stylist" && <StylistPanel />}
        </div>
      </div>
    </main>
  );
}
