const STATS = [
  { value: "30%", label: "of online fashion orders are returned" },
  { value: "96%", label: "of creators earn under $100K a year" },
  { value: "$56B", label: "spent yearly on fragmented brand tools" },
  { value: "5+", label: "point solutions Cloakroom replaces with one rail" },
];

export default function StatTicker() {
  const items = [...STATS, ...STATS];
  return (
    <div className="border-y border-brass/20 bg-velvet/60">
      <div className="scrollbar-thin overflow-hidden">
        <div className="flex w-max gap-12 px-6 py-4 motion-safe:animate-ticker">
          {items.map((s, i) => (
            <div key={i} className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="font-display text-xl text-brassLight">{s.value}</span>
              <span className="font-tag text-[11px] uppercase tracking-wide text-creamDim/70">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
