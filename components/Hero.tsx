import Link from "next/link";
import Rail from "./Rail";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-grain pb-20 pt-16 md:pt-24">
      <div
        className="pointer-events-none absolute -left-32 top-[-220px] h-[480px] w-[480px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #39102A, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 top-[120px] h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #C9A04D, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <p className="font-tag text-xs uppercase tracking-[0.25em] text-brassLight/80">
            AI rails for fashion commerce
          </p>
          <h1 className="mt-4 font-display text-[2.6rem] leading-[1.08] tracking-tight text-cream sm:text-[3.4rem] md:text-[4rem]">
            Five disconnected tools.
            <br />
            <span className="text-brassLight">One rail to hang them on.</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance font-body text-base leading-relaxed text-creamDim md:text-lg">
            Cloakroom is the B2B2C infrastructure layer fashion commerce is missing —
            fit-true virtual try-on, creator storefronts, and brand ROI analytics,
            running on one shared AI core instead of five disconnected point solutions.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/demo"
              className="rounded-full bg-brass px-6 py-3 font-body text-sm font-semibold text-ink shadow-tag transition hover:bg-brassLight"
            >
              Launch the live prototype
            </Link>
            <a
              href="#architecture"
              className="font-body text-sm font-medium text-creamDim underline decoration-brassDim underline-offset-4 transition hover:text-cream"
            >
              See how it's built ↓
            </a>
          </div>
        </div>

        <div id="problem" className="mt-20 scroll-mt-24">
          <p className="mb-6 font-tag text-[11px] uppercase tracking-[0.2em] text-creamDim/60">
            Built for everyone on the rack
          </p>
          <Rail
            tags={[
              {
                eyebrow: "Shopper",
                title: "Trust the fit before you buy",
                accent: "moss",
                body: "30% of online fashion orders come back. AI fit-prediction means fewer surprises and fewer returns.",
              },
              {
                eyebrow: "Creator",
                title: "Turn your feed into a storefront",
                accent: "signal",
                body: "96% of creators earn under $100K a year. Cloakroom storefronts monetize every drop, not just sponsored posts.",
              },
              {
                eyebrow: "Brand",
                title: "Prove it's working",
                accent: "brass",
                body: "Brands spend $56B a year stitching together point solutions. Cloakroom replaces five tools with one rail.",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
