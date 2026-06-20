# Cloakroom

**The AI infrastructure layer fashion commerce is missing.**

A working prototype built for a hackathon: fit-true virtual try-on, creator
storefronts, and brand ROI analytics, all running on one shared AI core
instead of five disconnected point solutions. **Image generation runs on
Hugging Face (free); every other AI feature runs on Gemini 2.5 Flash.**

This builds on the foundation of [Dropp](https://www.ondropp.app/) — the
creator affiliate platform — extending it into a full B2B2C AI rail for
shoppers, creators, and brands.

---

## What's in this prototype

| Surface | Route | What it does | Powered by |
|---|---|---|---|
| Pitch page | `/` | The full one-pager: problem, solution, architecture, business model, roadmap | — |
| Virtual try-on | `/demo` -> *Virtual try-on* | Upload a person photo + a garment photo, get back a real composited try-on render | IDM-VTON (free Hugging Face Space) |
| Creator storefront studio | `/demo` -> *Storefront studio* | Turns a creator handle + product into a shoppable drop: title, caption, hashtags, affiliate pitch | Gemini 2.5 Flash |
| Brand ROI dashboard | `/demo` -> *ROI dashboard* | Mock campaign metrics + charts, with a one-click AI executive summary | Gemini 2.5 Flash |
| Conversational AI stylist | `/demo` -> *AI stylist* | Working preview of the Phase 2 roadmap item: a styling chat layer over the same core | Gemini 2.5 Flash |

Every panel above (except the static KPI numbers in the dashboard, which are
mocked campaign data) makes a **real AI call** — nothing is hardcoded. The
four-layer architecture on the pitch page (Input -> AI Core Engine -> Platform
-> Experience) is the actual shape of this codebase: `app/api/*` is the AI
core, `lib/gemini.ts` and `lib/huggingface.ts` + `lib/hf-tryon.ts` are the
shared clients, and the panels in `components/demo/*` are the experience
layer on top.

## Tech stack

- **Next.js 14** (App Router, TypeScript) — one deployable app for both the
  marketing site and the API routes
- **Tailwind CSS** — custom "atelier rail" design tokens (see `tailwind.config.ts`)
- **Gemini API** — plain `fetch` against the `generateContent` endpoint, no
  SDK, for the three text features (storefront copy, ROI insights, stylist chat)
- **Hugging Face Inference** — used only for the virtual try-on image render
- **`@gradio/client`** — calls the free IDM-VTON Space for the virtual
  try-on render
- No database — this is a prototype. "Brand metrics" are mock data defined
  in `components/demo/BrandPanel.tsx`.

## Running it

```bash
npm install
cp .env.example .env.local
# edit .env.local and paste in your keys
npm run dev
```

Then open **http://localhost:3000**.

### Getting a Gemini API key (free, no card) — for text features

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in and click **Create API key**
3. Paste it into `.env.local` as `GEMINI_API_KEY=...`
4. Restart `npm run dev`

### Getting a Hugging Face token (free, no card) — for the try-on image render

1. Create an account at [huggingface.co](https://huggingface.co/join) if you don't have one
2. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) -> **New token**
3. Pick **Fine-grained**, and make sure **"Make calls to Inference Providers"** is checked
4. Paste it into `.env.local` as `HF_TOKEN=hf_...`
5. Restart `npm run dev`

Without either key, the app still runs and looks complete — each demo panel
shows a clear "no key detected" banner pointing at the right provider instead
of crashing. The try-on panel needs `HF_TOKEN`; the other three panels need
`GEMINI_API_KEY`.

### Deploying

Standard Next.js app — deploys to Vercel in about a minute:

```bash
npx vercel
```

Add `HF_TOKEN` and `GEMINI_API_KEY` as environment variables in the Vercel
project settings. The try-on route is set to `maxDuration = 120` since the
free Space can be slow to cold-start — check your hosting plan supports that
function duration (Vercel's Hobby plan caps at 60s; Pro allows up to 300s).

## Project structure

```
app/
  page.tsx                 -> pitch / landing page
  demo/page.tsx             -> demo console (reads ?tab= for deep links)
  api/tryon/route.ts        -> virtual try-on (calls the IDM-VTON Space, Hugging Face)
  api/creator/route.ts      -> storefront drop generator (Gemini)
  api/insights/route.ts     -> ROI executive summary (Gemini)
  api/stylist/route.ts      -> AI stylist chat (Gemini)
  api/health/route.ts       -> reports whether HF_TOKEN / GEMINI_API_KEY are set
components/
  Hero.tsx, Rail.tsx, SolutionSection.tsx, ArchitectureSection.tsx,
  BusinessModelSection.tsx, RoadmapSection.tsx, ...   -> pitch page sections
  demo/
    DemoShell.tsx           -> tab state + per-provider setup banner
    TryOnPanel.tsx, CreatorPanel.tsx, BrandPanel.tsx, StylistPanel.tsx
    ImageDrop.tsx            -> drag-and-drop image upload -> base64
lib/
  gemini.ts                 -> Gemini chat completion client + error helpers (text features)
  huggingface.ts            -> Hugging Face token helper (try-on only)
  hf-tryon.ts                -> Gradio Space client for the try-on render
  api-utils.ts               -> shared response helpers
```

## Important caveats — read before your demo

**The try-on render runs on a free, shared community GPU.** This is the
trade-off for not paying anything: it can take 30–90 seconds, and on a busy
day the Space can be slow or briefly unavailable. It is **not** the same
reliability tier as a paid API. Test it yourself the day before you present.
Two mitigations baked in:
- `HF_TRYON_SPACE` in `.env.local` lets you swap to a different Space (e.g.
  one you've duplicated under your own HF account, which gets you a private
  queue) without touching code.
- If the Space's API shape changes (community Spaces aren't versioned the
  way a real API is), `lib/hf-tryon.ts` will throw a clear error pointing
  you at the Space's "View API" page to check the current parameters.

**License note:** the default try-on model, IDM-VTON, is released under
**CC BY-NC-SA 4.0** — non-commercial use only. That's fine for a hackathon
demo, but if Cloakroom moves toward a real product, the try-on engine would
need either a commercially-licensed model or a paid API (Gemini's
`gemini-2.5-flash-image`, or fal.ai/Replicate's hosted version of the same
model, are both viable commercial paths).

**Gemini model availability:** `GEMINI_MODEL` defaults to `gemini-2.5-flash`.
If a route returns a "model not available for this key" error, set
`GEMINI_MODEL` in `.env.local` to another Gemini model id and restart.

## What's mocked vs. real, for judges

- **Real, live AI:** the try-on render (Hugging Face) and the storefront
  copy, ROI executive summary, and stylist chat (all Gemini 2.5 Flash) hit
  real endpoints at demo time, given the relevant key.
- **Mocked:** the brand dashboard's underlying campaign numbers (GTV by
  week, return rate trend, ROI multiplier). In production these would come
  from the Platform layer's catalog sync and attribution pipeline.
- **Roadmap, not built:** motion video try-on. The stylist chat is a working
  preview of the second roadmap item, not a mock.
