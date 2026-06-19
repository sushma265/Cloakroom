function IconTryOn() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M12 6h8l3 5-4 3v12H9V14l-4-3 3-5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="4.2" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconCreator() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="5" y="8" width="22" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 13h22" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="11" cy="18.5" r="2.1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16 18.5h7M16 22h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconBrand() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6 24V15l5-3 5 3v-5l5-3 5 3v14" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 24h24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const ITEMS = [
  {
    icon: <IconTryOn />,
    title: "AI virtual try-on",
    desc: "A fit-prediction and garment-draping engine reads body shape and garment geometry to show shoppers exactly how something will sit on them — before it ships.",
    tag: "Computer vision · body mapping · diffusion rendering",
  },
  {
    icon: <IconCreator />,
    title: "Creator empowerment",
    desc: "Storefronts turn a single piece of content into commerce — affiliate links, subscriptions, and timed drops, all attributed back to the creator automatically.",
    tag: "Affiliates · subscriptions · drops",
  },
  {
    icon: <IconBrand />,
    title: "Brand value",
    desc: "Plug-and-play catalog sync, campaign management, and a real-time ROI dashboard replace the spreadsheet-and-Slack-thread version of proving what's working.",
    tag: "Catalog sync · campaigns · live ROI",
  },
];

export default function SolutionSection() {
  return (
    <section id="solution" className="scroll-mt-20 border-b border-cream/10 bg-ink py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="font-tag text-xs uppercase tracking-[0.2em] text-brassLight/80">The solution</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-cream md:text-4xl">
            Unified infrastructure, not another app
          </h2>
          <p className="mt-4 text-creamDim">
            Cloakroom is a B2B2C network, not a destination app. Brands, creators, and
            shoppers each plug into the same AI core through the surface that fits them.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-brass/15 bg-velvet/40 p-7 transition hover:border-brass/40 hover:bg-velvet/60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brass/30 text-brassLight">
                {item.icon}
              </div>
              <h3 className="mt-5 font-display text-xl text-cream">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-creamDim">{item.desc}</p>
              <p className="mt-4 font-tag text-[10.5px] uppercase tracking-wide text-brassDim">
                {item.tag}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
