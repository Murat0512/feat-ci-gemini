// Simple build-time env check.
// - If running on CI/VERCEL/GITHUB_ACTIONS, this script will fail the build when VITE_GEMINI_API_KEY is missing.
// - Locally it will warn only.

const requiredVar = 'VITE_GEMINI_API_KEY';
const isCI = !!(process.env.CI === 'true' || process.env.VERCEL || process.env.GITHUB_ACTIONS);

if (!process.env[requiredVar]) {
  const msg = `Missing environment variable ${requiredVar}. Set it locally in .env.local for dev, and in your CI/Vercel environment variables for production builds.`;
  if (isCI) {
    console.error(msg);
    process.exit(1);
  } else {
    console.warn('Warning:', msg);
    process.exit(0);
  }
} else {
  console.log(`${requiredVar} detected.`);
  process.exit(0);
}