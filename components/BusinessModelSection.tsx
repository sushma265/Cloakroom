const STREAMS = [
  {
    title: "Take rate",
    detail: "A percentage of creator-driven gross transaction value — Cloakroom earns when creators sell.",
    figure: "% of GTV",
  },
  {
    title: "Brand SaaS",
    detail: "Tiered subscription for catalog sync, campaign tools, and the ROI dashboard, priced to brand size.",
    figure: "Monthly / tier",
  },
  {
    title: "Creator Pro",
    detail: "Optional paid tools for creators who want deeper analytics, custom storefronts, and priority drops.",
    figure: "Optional add-on",
  },
];

const BEFORE = [
  "Try-on vendor",
  "Affiliate platform",
  "Analytics tool",
  "Influencer CRM",
  "Catalog feed manager",
];

export default function BusinessModelSection() {
  return (
    <section id="model" className="scroll-mt-20 border-b border-cream/10 bg-ink py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="font-tag text-xs uppercase tracking-[0.2em] text-brassLight/80">Business model</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-cream md:text-4xl">
            Three streams, one ledger
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STREAMS.map((s) => (
            <div
              key={s.title}
              className="relative rounded-md border border-brass/25 bg-velvet/40 px-6 py-6"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(201,160,77,0.35) 6px, rgba(201,160,77,0.35) 7px)",
                backgroundSize: "100% 1px",
                backgroundPosition: "top",
                backgroundRepeat: "no-repeat",
              }}
            >
              <p className="font-tag text-[10.5px] uppercase tracking-wide text-brassDim">
                {s.figure}
              </p>
              <h3 className="mt-2 font-display text-xl text-cream">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-creamDim">{s.detail}</p>
            </div>
          ))}
        </div>

        {/* before / after */}
        <div className="mt-16 grid items-center gap-8 rounded-xl border border-brass/15 bg-velvet/20 p-8 md:grid-cols-[1fr_auto_1fr]">
          <div>
            <p className="font-tag text-[11px] uppercase tracking-wide text-rust">Before · $56B/yr</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {BEFORE.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-rust/30 px-3 py-1.5 text-xs text-creamDim/80"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden text-creamDim/50 md:block">
            <svg width="34" height="20" viewBox="0 0 34 20" fill="none" aria-hidden="true">
              <path d="M0 10h28M20 2l8 8-8 8" stroke="#C9A04D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div>
            <p className="font-tag text-[11px] uppercase tracking-wide text-moss">After</p>
            <div className="mt-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-brass/50 bg-brass/10 px-4 py-2 font-display text-sm text-brassLight">
                One Cloakroom rail
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
