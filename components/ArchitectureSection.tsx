const LAYERS = [
  {
    n: "01",
    name: "Input",
    desc: "Shopper photos, brand catalogs, and creator content enter the system in whatever format they already exist in.",
    tags: ["Photos", "PDP feeds", "Video & captions"],
  },
  {
    n: "02",
    name: "AI core engine",
    desc: "Computer vision and body mapping read garment geometry and body shape; diffusion-based rendering composites the result.",
    tags: ["Computer vision", "Body mapping", "Diffusion rendering"],
  },
  {
    n: "03",
    name: "Platform",
    desc: "Catalog sync, campaign orchestration, and attribution turn raw AI output into something brands and creators can run a business on.",
    tags: ["Catalog sync", "Campaigns", "Attribution"],
  },
  {
    n: "04",
    name: "Experience",
    desc: "The rendered try-on, the creator storefront, and the ROI dashboard — the only three things any user ever actually sees.",
    tags: ["Try-on UI", "Storefronts", "ROI dashboard"],
  },
];

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="scroll-mt-20 border-b border-cream/10 bg-velvet/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="font-tag text-xs uppercase tracking-[0.2em] text-brassLight/80">Architecture</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-cream md:text-4xl">
            Four layers, one rail
          </h2>
          <p className="mt-4 text-creamDim">
            Every surface — try-on, storefront, dashboard — is a thin client on top of the
            same core. Build one layer well, and every surface above it gets better at once.
          </p>
        </div>

        <div className="mt-14 grid gap-3 md:grid-cols-4 md:gap-0">
          {LAYERS.map((layer, i) => (
            <div key={layer.n} className="relative flex">
              <div className="flex-1 rounded-lg border border-brass/20 bg-ink p-6 md:mx-2 md:rounded-xl">
                <span className="font-tag text-xs text-brassDim">{layer.n}</span>
                <h3 className="mt-2 font-display text-lg text-brassLight">{layer.name}</h3>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-creamDim">{layer.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {layer.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-brass/25 px-2.5 py-1 font-tag text-[10px] uppercase tracking-wide text-creamDim/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {i < LAYERS.length - 1 && (
                <div className="hidden w-6 flex-none items-center justify-center md:flex">
                  <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
                    <path d="M0 7h18M13 1l7 6-7 6" stroke="#8A6B33" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
