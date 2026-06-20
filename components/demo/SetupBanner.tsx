interface SetupBannerProps {
  provider: "huggingface" | "gemini";
}

const COPY = {
  huggingface: {
    label: "No Hugging Face token detected.",
    envVar: "HF_TOKEN",
    feature: "live AI",
    href: "https://huggingface.co/settings/tokens",
    cta: "Get a free token →",
  },
  gemini: {
    label: "No Gemini API key detected.",
    envVar: "GEMINI_API_KEY",
    feature: "live AI",
    href: "https://aistudio.google.com/apikey",
    cta: "Get a free API key →",
  },
};

export default function SetupBanner({ provider }: SetupBannerProps) {
  const c = COPY[provider];
  return (
    <div className="mb-6 flex flex-col gap-2 rounded-lg border border-rust/40 bg-rust/10 px-5 py-4 text-sm text-creamDim sm:flex-row sm:items-center sm:justify-between">
      <p>
        <span className="font-semibold text-cream">{c.label}</span>{" "}
        Add a free key to <code className="rounded bg-ink px-1.5 py-0.5 font-tag text-xs">.env.local</code>{" "}
        as <code className="rounded bg-ink px-1.5 py-0.5 font-tag text-xs">{c.envVar}</code> and restart{" "}
        <code className="rounded bg-ink px-1.5 py-0.5 font-tag text-xs">npm run dev</code> to activate {c.feature}.
      </p>
      <a
        href={c.href}
        target="_blank"
        rel="noreferrer"
        className="flex-none rounded-full border border-brass/50 px-3 py-1.5 text-xs font-medium text-brassLight hover:bg-brass/10"
      >
        {c.cta}
      </a>
    </div>
  );
}
