"use client";

export interface DemoTab {
  id: string;
  label: string;
  eyebrow: string;
}

export default function DemoTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: DemoTab[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="scrollbar-thin flex gap-2 overflow-x-auto border-b border-cream/10 pb-px">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-none rounded-t-md border-b-2 px-4 py-3 text-left transition ${
              isActive
                ? "border-brass bg-velvet/30 text-cream"
                : "border-transparent text-creamDim/70 hover:text-cream"
            }`}
          >
            <span className="block font-tag text-[10px] uppercase tracking-wide text-brassDim">
              {tab.eyebrow}
            </span>
            <span className="block font-display text-[0.95rem]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
