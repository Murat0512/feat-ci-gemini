# AI Tool Accuracy & Consistency Testing Suite

## Overview

This suite ensures your AI-powered features deliver **consistent, accurate, and reliable results** across all modules. It includes:

1. **Accuracy Tests** - Validates AI outputs against expected patterns
2. **Consistency Checker** - Tracks metrics and detects deviations in real-time
3. **AI Service Wrapper** - Wraps Gemini calls with automatic validation
4. **Consistency Dashboard** - Visual monitoring of AI quality metrics

---

## Components

### 1. **Accuracy Test Suite** (`services/__tests__/accuracy.test.ts`)

Comprehensive test coverage for:
- Response structure validation (markdown, JSON, data markers)
- Language parameter handling (English, French, Spanish, etc.)
- Edge cases (empty inputs, special characters, large datasets)
- Known test cases with expected outputs
- Output quality metrics (substantiveness, completeness)

**Run tests:**
```bash
npm run test -- accuracy.test.ts
```

**Example test:**
```typescript
it('synthesizePortfolioRisk returns markdown with required markers', async () => {
  const result = await synthesizePortfolioRisk(mockAudits, 'English');
  expect(result).toContain('# '); // Has heading
  expect(result).toMatch(/\[AGGREGATE_RISK\]:\s*(\d+)%/);
});
```

---

### 2. **Consistency Checker** (`services/consistencyChecker.ts`)

Real-time metric tracking:
- **Total Requests**: Count of API calls
- **Success Rate**: % of valid responses
- **Failure Rate**: % of errors
- **Average Response Time**: Performance monitoring
- **Quality Score**: 0-100 composite score
- **Deviations**: Logged inconsistencies with severity levels

**Usage in code:**
```typescript
import { consistencyChecker, consistencyLogger } from './services/consistencyChecker';

// Validate an output
const { isValid, failures } = consistencyChecker.validateResponse(
  'myFeature',
  'input text',
  aiOutput,
  [
    validators.hasMarkdownHeading,
    validators.minLength(100),
    validators.containsKeywords(['risk', 'compliance'])
  ]
);

if (!isValid) {
  consistencyLogger.log('myFeature', 'failure', failures.join('; '));
}
```

**Built-in validators:**
```typescript
validators.hasMarkdownHeading        // Checks for # heading
validators.hasDataMarker(pattern)    // Regex pattern matching
validators.minLength(n)              // Minimum output length
validators.containsKeywords([...])   // Required keywords present
validators.hasValidPercentage        // 0-100% values
validators.hasStructure              // Has text & sources
validators.isValidJSON               // Valid JSON parsing
```

---

### 3. **AI Service Wrapper** (`services/aiServiceWrapper.ts`)

Automatically validates all AI calls with consistency checking:

```typescript
// Instead of:
const result = await synthesizePortfolioRisk(audits);

// Use wrapped version (includes automatic validation):
const result = await synthesizePortfolioRiskWithValidation(audits);
```

**Wrapped Functions:**
- `synthesizePortfolioRiskWithValidation()`
- `checkComplianceWithValidation()`
- `compareDocumentsWithValidation()`
- `analyzeDocumentWithValidation()`
- `generateDossierWithValidation()`

**Benefits:**
- Automatic error tracking
- Performance monitoring
- Deviation logging
- Consistent response handling

---

### 4. **Consistency Dashboard** (`components/ConsistencyDashboard.tsx`)

Visual monitoring component showing:
- Overall quality score (0-100)
- Real-time success/failure rates
- Average response latency
- Recent deviations with severity levels
- Download reports as markdown
- Auto-refresh metrics every 5 seconds

**Add to UI:**
```tsx
import ConsistencyDashboard from './components/ConsistencyDashboard';

export default function AdminPanel() {
  return (
    <div>
      <ConsistencyDashboard />
    </div>
  );
}
```

---

## Setup & Integration

### Step 1: Import Wrapped Functions

Replace direct calls with wrapped versions:

**Before:**
```typescript
import { synthesizePortfolioRisk } from './services/geminiService';
const result = await synthesizePortfolioRisk(audits);
```

**After:**
```typescript
import { synthesizePortfolioRiskWithValidation } from './services/aiServiceWrapper';
const result = await synthesizePortfolioRiskWithValidation(audits);
```

### Step 2: Run Tests Locally

```bash
# Run all accuracy tests
npm run test

# Run specific test file
npm run test -- accuracy.test.ts

# Run with coverage
npm run test -- --coverage
```

### Step 3: Monitor in Admin Panel

Add the dashboard to your admin/settings area:

```tsx
import ConsistencyDashboard from './components/ConsistencyDashboard';

export default function AdminPanel() {
  return (
    <div className="space-y-8">
      <ConsistencyDashboard />
      {/* ... other admin panels */}
    </div>
  );
}
```

### Step 4: Download Reports

Export consistency reports via dashboard or programmatically:

```typescript
import { getConsistencyReport } from './services/aiServiceWrapper';

const report = getConsistencyReport();
console.log(report); // Markdown format
```

---

## Accuracy Benchmarks

### Known Test Cases

Each AI feature should pass these consistency checks:

| Feature | Input | Expected Pattern | Severity |
|---------|-------|------------------|----------|
| Portfolio Synthesis | 2+ audits | Markdown with `[AGGREGATE_RISK]: X%` | High |
| Compliance Check | Clause + Jurisdiction | JSON with text & sources | High |
| Dossier Generation | Entity name | Text contains risk index | Medium |
| Document Comparison | 2 documents | Substantive analysis (100+ chars) | Medium |
| Document Analysis | Base64 image | Valid text output (50+ chars) | Low |

---

## Interpreting Metrics

### Quality Score (0-100)

- **90-100**: Excellent - All requests valid, no deviations
- **70-89**: Good - Minor deviations, acceptable error rate
- **50-69**: Fair - Multiple deviations, needs investigation
- **Below 50**: Poor - Critical issues, immediate action needed

### Deviation Severity

- **High**: Structural errors (missing required fields, invalid format)
- **Medium**: Quality issues (too short, missing context)
- **Low**: Minor inconsistencies (slow response, edge case)

### Response Time Targets

- < 1000ms: ✅ Excellent
- 1000-3000ms: ⚠️ Acceptable
- > 3000ms: ❌ Slow, investigate

---

## Common Issues & Fixes

### Issue: Low Quality Score

**Check:**
1. Are all wrapped functions being used (not raw functions)?
2. Run `npm run test` to identify failing validators
3. Check `/components/ConsistencyDashboard` for recent deviations

**Fix:**
```typescript
// ❌ Wrong - bypasses validation
const result = await synthesizePortfolioRisk(audits);

// ✅ Correct - includes validation
const result = await synthesizePortfolioRiskWithValidation(audits);
```

### Issue: High Failure Rate

**Check:**
1. Verify Gemini API key is correct (`VITE_GEMINI_API_KEY`)
2. Check network connectivity
3. Review error logs in dashboard

**Fix:**
```typescript
try {
  const result = await synthesizePortfolioRiskWithValidation(audits);
} catch (error) {
  console.error('API Error:', error);
  // Fallback to cached result or placeholder
}
```

### Issue: Slow Responses (> 3s)

**Check:**
1. Dashboard shows `averageResponseTime > 3000`
2. Review audit size - larger audits take longer
3. Check Gemini quota/rate limits

**Optimize:**
```typescript
// Batch smaller audits instead of single large batch
const batches = chunkAudits(audits, 10); // 10 per call
for (const batch of batches) {
  await synthesizePortfolioRiskWithValidation(batch);
}
```

---

## Running the Validation Suite

### Quick Validation (Development)

```bash
npm run test -- accuracy.test.ts
```

### Full Test Suite

```bash
npm run test
```

### CI/CD Integration

Add to your GitHub Actions or CI pipeline:

```yaml
- name: Run AI Accuracy Tests
  run: npm run test -- accuracy.test.ts

- name: Check Quality Score
  run: node scripts/validateConsistency.js
```

---

## Best Practices

1. **Always use wrapped functions** - `*WithValidation` versions
2. **Monitor dashboard regularly** - Catch deviations early
3. **Download weekly reports** - Track trends over time
4. **Reset metrics monthly** - Keep data fresh and actionable
5. **Investigate deviations immediately** - Address high-severity issues
6. **Test language parameters** - Verify multi-language support

---

## API Reference

### consistencyChecker

```typescript
// Validate a response
const { isValid, failures } = consistencyChecker.validateResponse(
  feature: string,
  input: string,
  output: string,
  validators: ((output: string) => boolean)[]
);

// Record metrics
consistencyChecker.recordSuccess();
consistencyChecker.recordFailure();
consistencyChecker.recordDeviation(deviation);

// Get data
const metrics = consistencyChecker.getMetrics();
const deviations = consistencyChecker.getDeviations(limit);
const report = consistencyChecker.generateReport();
```

### consistencyLogger

```typescript
// Log events
consistencyLogger.log(feature, status, message);

// Time operations
const startTime = consistencyLogger.startTiming();
// ... do work ...
consistencyLogger.endTiming(startTime, feature);
```

---

## Support & Troubleshooting

For issues or questions:

1. Check test output: `npm run test -- accuracy.test.ts`
2. Review dashboard deviations
3. Download full report for detailed analysis
4. Check `services/__tests__/geminiService.test.ts` for existing patterns

---

**Last Updated:** December 30, 2025
**Version:** 1.0.0
