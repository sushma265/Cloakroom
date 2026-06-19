import Link from "next/link";

export default function RoadmapSection() {
  return (
    <section className="border-b border-cream/10 bg-velvet/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-tag text-xs uppercase tracking-[0.2em] text-brassLight/80">What's next on the rail</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl leading-tight text-cream md:text-4xl">
          Today's still photo is tomorrow's full conversation
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-brass/20 bg-ink p-7">
            <span className="font-tag text-[10.5px] uppercase tracking-wide text-brassDim">Phase 2</span>
            <h3 className="mt-2 font-display text-xl text-cream">Motion video try-on</h3>
            <p className="mt-3 text-sm leading-relaxed text-creamDim">
              Extend the diffusion-rendering core from a single frame to short video, so
              shoppers see how a garment actually moves — drape, stretch, and sway — not
              just how it sits still.
            </p>
          </div>

          <div className="rounded-lg border border-brass/40 bg-ink p-7">
            <div className="flex items-center justify-between">
              <span className="font-tag text-[10.5px] uppercase tracking-wide text-moss">
                Live preview available now
              </span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-signal" />
            </div>
            <h3 className="mt-2 font-display text-xl text-cream">Conversational AI stylist</h3>
            <p className="mt-3 text-sm leading-relaxed text-creamDim">
              A chat layer on top of the same core that talks shoppers through fit, pairing,
              and occasion — instead of making them scroll a grid. An early version is
              already running in the demo console.
            </p>
            <Link
              href="/demo?tab=stylist"
              className="mt-4 inline-flex items-center gap-1.5 font-body text-sm font-medium text-brassLight underline decoration-brassDim underline-offset-4 hover:text-brass"
            >
              Try the stylist preview →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
