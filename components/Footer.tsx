import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <rect width="100" height="100" rx="18" fill="#1C1714" />
              <path
                d="M20 32h60M30 32v8c0 11 9 16 20 16s20-5 20-16v-8"
                stroke="#C9A04D"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-display text-base text-cream">Cloakroom</span>
          </div>
          <p className="mt-2 max-w-md text-sm text-creamDim/70">
            A hackathon prototype for unified AI infrastructure in fashion commerce.
            Built on the Dropp creator network's foundation —{" "}
            <a
              href="https://www.ondropp.app/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-brassDim underline-offset-2 hover:text-cream"
            >
              ondropp.app
            </a>
            .
          </p>
        </div>

        <div className="flex items-center gap-6 font-tag text-xs uppercase tracking-wide text-creamDim/60">
          <span>Powered by Gemini 2.5 Flash</span>
          <Link href="/demo" className="text-brassLight hover:text-brass">
            Live demo →
          </Link>
        </div>
      </div>
    </footer>
  );
}
