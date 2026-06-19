import { ReactNode } from "react";

export interface RailTag {
  eyebrow: string;
  title: string;
  body: ReactNode;
  accent?: "brass" | "signal" | "moss" | "rust";
}

const accentDot: Record<string, string> = {
  brass: "bg-brass",
  signal: "bg-signal",
  moss: "bg-moss",
  rust: "bg-rust",
};

/**
 * Renders a horizontal brass rail with hang-tags suspended from it.
 * On small screens it degrades to a simple vertical rack.
 */
export default function Rail({ tags }: { tags: RailTag[] }) {
  return (
    <div className="w-full">
      {/* the rail itself */}
      <div className="relative hidden md:block">
        <div className="rail-line h-[5px] w-full rounded-full" />
        <div
          className="absolute inset-x-0 top-0 flex justify-between px-2"
          style={{ transform: "translateY(-3px)" }}
        >
          {tags.map((_, i) => (
            <span
              key={i}
              className="rail-bracket block h-[11px] w-[11px] rounded-full"
              style={{ marginLeft: i === 0 ? 0 : undefined }}
            />
          ))}
        </div>
      </div>

      <div className="mt-0 grid gap-8 md:mt-0 md:grid-cols-3 md:gap-6">
        {tags.map((tag, i) => (
          <div key={i} className="flex flex-col items-center md:pt-0">
            {/* hanging string, desktop only */}
            <div className="hidden h-7 w-px bg-brassDim/70 md:block" />
            <div
              className="tag-card shadow-tag w-full max-w-sm origin-top px-6 py-7 motion-safe:animate-sway"
              style={{ animationDelay: `${i * 0.55}s` }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${accentDot[tag.accent ?? "brass"]}`} />
                <span className="font-tag text-[11px] uppercase tracking-[0.18em] text-ink/60">
                  {tag.eyebrow}
                </span>
              </div>
              <h3 className="font-display text-[1.4rem] leading-tight text-ink">{tag.title}</h3>
              <div className="mt-2 text-[0.92rem] leading-relaxed text-ink/70">{tag.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
