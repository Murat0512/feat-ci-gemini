# Copilot Instructions — LexiScan Pro

Quick, action-oriented guidance for AI coding agents working in this repository.

## Big picture

- Single-page React app (Vite + TypeScript + Tailwind). UI entry points in `App.tsx` and many feature components under `components/`.
- Integrations and side-effectful logic live in `services/` (notably `geminiService.ts`, `supabaseClient.ts`, `exportService.ts`). Favor changes there for cross-cutting behavior.
- Persistence: local-only state is stored in `localStorage` keys like `lexiscan_projects`, `lexiscan_user`, `lexiscan_history_local`, `lexiscan_provisions`. Cloud-sync is gated by `isCloudConfigured()` and `supabase` usage.

## How to run & build

- Install: `npm install`
- Dev server: `npm run dev` (Vite)
- Build (type-check + bundle): `npm run build` (runs `tsc && vite build`)
- Lint: `npm run lint` (ESLint for `.ts`/`.tsx`)
- Preview production build: `npm run preview`

## Environment & keys (explicit)

- Primary runtime env variable used by code: `VITE_GEMINI_API_KEY` (referenced in `services/geminiService.ts`).
- Note: README previously referenced `GEMINI_API_KEY` — prefer `VITE_GEMINI_API_KEY` when adding or reading environment variables.
- Optional cloud env vars: `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` (used by `services/supabaseClient.ts` if provided). Note: the repo no longer includes a baked-in Supabase key; set these env vars in Vercel Project Settings → Environment Variables for production builds.

## Vercel deployment notes

- Build command: `npm run build` (runs `tsc && vite build`) and output dir: `dist`.
- Vite requires `VITE_`-prefixed env vars to be present at build time — set `VITE_GEMINI_API_KEY` in the Vercel Project → Settings → Environment Variables (set for Production and Preview as needed).
- For SPAs, include a simple `vercel.json` if you want consistent routing and build options (this repo includes one that sets the static build output to `dist`).
- This project includes a build-time env check (`scripts/checkEnv.js`) that runs as `prebuild` and will fail CI/Vercel builds if `VITE_GEMINI_API_KEY` is not set — set the var in Vercel Project Settings → Environment Variables for a successful production build.
- If you prefer a minimal check: verify the `dist/` folder appears after `npm run build` locally before deploying.

## Service patterns & examples

- Gemini integration (RPC-style): use `genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })` and call `model.generateContent(...)`. See `services/geminiService.ts`. The repo uses `executeWithRetry` wrapper for model calls — reuse it for robust requests.

### Service implementation status
- Implemented (real or model-backed):
  - `analyzeLegalDocument` — image input auditing (calls the model)
  - `compareLegalDocuments` — document comparison (calls the model)
  - `synthesizePortfolioRisk` — macro-synthesis (calls the model and returns markdown posture)

- Implemented but simulated / lightweight (work to replace with production prompts):
  - `runNeuralCommandStream` — streaming simulation (used by `NeuralCommand`)

- Placeholders / TODO (implement these with robust prompts, parsing, and tests):
  - `generateMarketingAssets`, `generateMarketingVisual`, `generateSonicIdentity`, `generateSovereignVideo`
  - `searchVaultIntelligence`, `checkCompliance`, `forgeLegalRebuttal`
  - `generateCounterpartyDossier`, `projectJudicialOutcome`, `runHighTableConsensus`
  - `generateClauseRewrite`, `generateRemediatedDraft`, `generateForensicManifest`
  - `runNeuralMaskScan`, `evaluateSandboxComposition`, `runVoidScan`
  - `generateNeuralRedline`, `forecastLitigationVector`, `generateRiskAssessment`
  - `runSovereignGraph`, `getGeoLegalIntelligence`, `runNeuralDiscovery`

Notes:
- `synthesizePortfolioRisk` is implemented and unit-tested (Vitest). Check `services/__tests__/geminiService.test.ts` for examples of mocking `genAI`.
- Add tests for other functions as they are implemented; prefer mocking the `genAI` client to keep tests fast and deterministic.

- Testing: run `npm test` (Vitest) — tests include the new `synthesizePortfolioRisk` unit tests (mocking `GoogleGenerativeAI`).

- Export: bundling logic and a README for shipped bundles is in `services/exportService.ts` — it writes a `gitignore_template.txt` and a `README.md` into zip bundles (Windows note about dotfiles).

## Common conventions & gotchas

- Many service functions return placeholder/dummy values to keep UI stable (e.g., `generateMarketingAssets` returns a stub string). Search for `// FIXED:` and placeholder return values in `services/geminiService.ts` when implementing real behavior.
- UI modules are lazy-loaded in `App.tsx` — changes to exports can break dynamic imports. When renaming components, update the corresponding lazy imports in `App.tsx`.
- Local vs Cloud user detection: code treats user IDs beginning with `LOCAL-` as local-only. Respect that check when implementing sync behavior.
- Use existing localStorage keys for state if you want to seed test data quickly.

## Dependency notes

- The code imports `@google/generative-ai` in `services/geminiService.ts` — ensure the runtime dependency matches this import. `package.json` contains both `@google/genai` and `@google/generative-ai` in different sections; prefer the package actually imported by files.

## Where to make changes

- UI: `components/` directory. Keep presentational changes isolated and preserve prop contracts used in `App.tsx`.
- API adapters: `services/`. Centralize changes here (e.g., retry logic, auth headers, env keys).
- Shared types: `types.ts` — update here for any structural data changes and run `npm run build` to catch type issues.

## Typical PR scope for AI agents

- Small bugfix: modify `services/geminiService.ts` implementation (use `executeWithRetry`), add/adjust tests (if any), run `npm run build` and `npm run lint` locally.
- Feature: introduce API contract change → update `types.ts` + callers in `components/*` + add a migration note in PR description.

## Testing & validation tips

- Manual validation: run `npm run dev` and interact with flows that use the modified service (e.g., Neural Vault search uses `searchVaultIntelligence`).
- Use local dev overrides: update `localStorage` keys in the browser console to simulate records and user state for UI testing.
- When touching cloud flows, test both `isCloudConfigured()` = true and false code paths.
- CI: The repository includes `.github/workflows/ci.yml` which runs tests and builds on push/pull_request; ensure `VITE_GEMINI_API_KEY` is stored as a repository Secret so CI and Vercel builds pass the prebuild check.

## Safety & boundaries

- Do **not** modify the activation and licensing logic lightly. `components/LicenseGate.tsx` contains gating UX; `services/exportService.ts` includes comments explicitly warning against changing activation logic unless required.

---

If any part of this file is unclear or you want me to include examples for a specific feature (e.g., adding a new Gemini-backed endpoint or migrating Supabase config to env variables), tell me which area to expand. I can iterate quickly.
