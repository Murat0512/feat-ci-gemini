<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Ca3vDpNdztrKYFePOHHCCKBnmuXK8u14

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env.local` (or set Vercel Environment Variables) and add your Gemini API key as `VITE_GEMINI_API_KEY`.

   Example `.env.local`:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   # Optional (cloud sync):
   # VITE_SUPABASE_URL=https://your-supabase-url
   # VITE_SUPABASE_KEY=your-supabase-key
   ```

   Note: Vite requires `VITE_`-prefixed env vars at build time. On Vercel, add `VITE_GEMINI_API_KEY` under Project Settings → Environment Variables (set for "Production" so builds have access).

3. Run the app locally:
   `npm run dev`

4. Run tests:
   `npm test` (Vitest) — tests include unit coverage for `synthesizePortfolioRisk` which mocks the Gemini client.

CI: A GitHub Actions workflow (`.github/workflows/ci.yml`) runs tests and builds on push/pull_request. Ensure you add `VITE_GEMINI_API_KEY` to your repository Secrets (Settings → Secrets → Actions) and to Vercel Environment Variables (Project Settings → Environment Variables) so CI and production builds pass the prebuild check.

Developer note: `synthesizePortfolioRisk` is now implemented as a Gemini-backed endpoint that returns a markdown posture and is used by the `PortfolioSynthesis` UI; many other functions in `services/geminiService.ts` remain placeholders and are documented in `.github/copilot-instructions.md`.
