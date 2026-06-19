import Link from "next/link";

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="26" height="26" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect width="100" height="100" rx="18" fill="#1C1714" />
            <path
              d="M20 32h60M30 32v8c0 11 9 16 20 16s20-5 20-16v-8"
              stroke="#C9A04D"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-display text-lg tracking-wide text-cream">
            Cloakroom
          </span>
        </Link>

        <nav className="hidden items-center gap-7 font-body text-sm text-creamDim md:flex">
          <a href="/#problem" className="transition hover:text-cream">
            Problem
          </a>
          <a href="/#solution" className="transition hover:text-cream">
            Solution
          </a>
          <a href="/#architecture" className="transition hover:text-cream">
            Architecture
          </a>
          <a href="/#model" className="transition hover:text-cream">
            Business model
          </a>
        </nav>

        <Link
          href="/demo"
          className="rounded-full border border-brass/60 bg-brass/10 px-4 py-2 font-body text-sm font-medium text-brassLight transition hover:bg-brass/20"
        >
          Open the live demo →
        </Link>
      </div>
    </header>
  );
}
