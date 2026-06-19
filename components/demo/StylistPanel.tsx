"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const STARTER: ChatMessage = {
  role: "model",
  text: "Hi, I'm the Cloakroom Stylist — a preview of what's coming after virtual try-on. Tell me what you're dressing for and I'll help you put it together.",
};

export default function StylistPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: next }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong.");
      setMessages([...next, { role: "model", text: data.reply }]);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-cream">Conversational AI stylist</h3>
        <span className="flex items-center gap-1.5 font-tag text-[10px] uppercase tracking-wide text-moss">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" /> Phase 2 preview
        </span>
      </div>
      <p className="mt-1.5 text-sm text-creamDim">
        A roadmap feature: a chat layer over the same AI core that talks shoppers through
        fit and pairing instead of a static grid.
      </p>

      <div
        ref={scrollRef}
        className="scrollbar-thin mt-5 flex h-[360px] flex-col gap-3 overflow-y-auto rounded-lg border border-cream/15 bg-ink2 p-4"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-brass text-ink"
                  : "border border-brass/25 bg-velvet/40 text-creamDim"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg border border-brass/25 bg-velvet/40 px-3.5 py-2.5 text-sm text-creamDim/60">
              typing…
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-md border border-rust/40 bg-rust/10 px-3 py-2 text-sm text-creamDim">
          {error}
        </p>
      )}

      <div className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="e.g. What goes with a camel coat for a work dinner?"
          className="flex-1 rounded-full border border-cream/20 bg-ink2 px-4 py-2.5 text-sm text-cream placeholder:text-creamDim/40 focus:border-brass focus:outline-none"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="rounded-full bg-brass px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-brassLight disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}
