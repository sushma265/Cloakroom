export default function SetupBanner() {
  return (
    <div className="mb-6 flex flex-col gap-2 rounded-lg border border-rust/40 bg-rust/10 px-5 py-4 text-sm text-creamDim sm:flex-row sm:items-center sm:justify-between">
      <p>
        <span className="font-semibold text-cream">No Gemini API key detected.</span>{" "}
        Add a free key to <code className="rounded bg-ink px-1.5 py-0.5 font-tag text-xs">.env.local</code>{" "}
        as <code className="rounded bg-ink px-1.5 py-0.5 font-tag text-xs">GEMINI_API_KEY</code> and restart{" "}
        <code className="rounded bg-ink px-1.5 py-0.5 font-tag text-xs">npm run dev</code> to activate live AI.
      </p>
      <a
        href="https://aistudio.google.com/app/apikey"
        target="_blank"
        rel="noreferrer"
        className="flex-none rounded-full border border-brass/50 px-3 py-1.5 text-xs font-medium text-brassLight hover:bg-brass/10"
      >
        Get a free key →
      </a>
    </div>
  );
}
