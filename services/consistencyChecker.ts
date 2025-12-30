/**
 * Consistency Checker: Real-time validation of AI outputs
 * Tracks metrics, deviations, and quality scores
 */

interface ConsistencyMetrics {
  totalRequests: number;
  successfulResponses: number;
  failedResponses: number;
  averageResponseTime: number;
  qualityScore: number; // 0-100
  deviations: Deviation[];
}

interface Deviation {
  timestamp: string;
  feature: string;
  input: string;
  expectedPattern: string;
  actualOutput: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
}

class ConsistencyChecker {
  private metrics: ConsistencyMetrics = {
    totalRequests: 0,
    successfulResponses: 0,
    failedResponses: 0,
    averageResponseTime: 0,
    qualityScore: 100,
    deviations: []
  };

  private timings: number[] = [];

  /**
   * Validate response against expected patterns
   */
  validateResponse(
    feature: string,
    input: string,
    output: string,
    validators: ((output: string) => boolean)[]
  ): { isValid: boolean; failures: string[] } {
    const failures: string[] = [];

    validators.forEach((validator, index) => {
      try {
        if (!validator(output)) {
          failures.push(`Validator ${index + 1} failed for ${feature}`);
        }
      } catch (error) {
        failures.push(`Validator ${index + 1} threw error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    const isValid = failures.length === 0;

    if (!isValid) {
      this.recordDeviation({
        timestamp: new Date().toISOString(),
        feature,
        input: input.substring(0, 100),
        expectedPattern: 'See validators above',
        actualOutput: output.substring(0, 200),
        severity: failures.length > 2 ? 'high' : failures.length > 1 ? 'medium' : 'low',
        message: failures.join('; ')
      });
    }

    return { isValid, failures };
  }

  /**
   * Track response time for performance monitoring
   */
  trackTiming(milliseconds: number): void {
    this.timings.push(milliseconds);
    const sum = this.timings.reduce((a, b) => a + b, 0);
    this.metrics.averageResponseTime = sum / this.timings.length;
  }

  /**
   * Record a response as successful
   */
  recordSuccess(): void {
    this.metrics.totalRequests++;
    this.metrics.successfulResponses++;
    this.updateQualityScore();
  }

  /**
   * Record a response as failed
   */
  recordFailure(): void {
    this.metrics.totalRequests++;
    this.metrics.failedResponses++;
    this.updateQualityScore();
  }

  /**
   * Record a deviation from expected behavior
   */
  recordDeviation(deviation: Deviation): void {
    this.metrics.deviations.push(deviation);
    this.updateQualityScore();
  }

  /**
   * Update quality score based on success rate and deviations
   */
  private updateQualityScore(): void {
    if (this.metrics.totalRequests === 0) {
      this.metrics.qualityScore = 100;
      return;
    }

    const successRate = (this.metrics.successfulResponses / this.metrics.totalRequests) * 100;
    const deviationPenalty = Math.min(
      this.metrics.deviations.length * 2,
      20
    );

    this.metrics.qualityScore = Math.max(0, Math.min(100, successRate - deviationPenalty));
  }

  /**
   * Get current metrics report
   */
  getMetrics(): ConsistencyMetrics {
    return { ...this.metrics };
  }

  /**
   * Get recent deviations
   */
  getDeviations(limit: number = 10): Deviation[] {
    return this.metrics.deviations.slice(-limit);
  }

  /**
   * Generate markdown report
   */
  generateReport(): string {
    const { totalRequests, successfulResponses, failedResponses, averageResponseTime, qualityScore, deviations } = this.metrics;

    let report = `# AI Tool Consistency Report\n\n`;
    report += `**Generated:** ${new Date().toISOString()}\n\n`;

    report += `## Summary Metrics\n`;
    report += `- **Total Requests:** ${totalRequests}\n`;
    report += `- **Successful:** ${successfulResponses} (${totalRequests > 0 ? ((successfulResponses / totalRequests) * 100).toFixed(1) : 0}%)\n`;
    report += `- **Failed:** ${failedResponses}\n`;
    report += `- **Avg Response Time:** ${this.metrics.averageResponseTime.toFixed(0)}ms\n`;
    report += `- **Quality Score:** ${qualityScore.toFixed(1)}/100\n\n`;

    if (deviations.length > 0) {
      report += `## Recent Deviations (Last 10)\n`;
      deviations.slice(-10).forEach((dev, i) => {
        report += `\n### ${i + 1}. ${dev.feature} [${dev.severity.toUpperCase()}]\n`;
        report += `- **Time:** ${dev.timestamp}\n`;
        report += `- **Issue:** ${dev.message}\n`;
        report += `- **Input:** \`${dev.input}\`\n`;
      });
    } else {
      report += `## ✅ No Deviations Recorded\n`;
    }

    return report;
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      totalRequests: 0,
      successfulResponses: 0,
      failedResponses: 0,
      averageResponseTime: 0,
      qualityScore: 100,
      deviations: []
    };
    this.timings = [];
  }
}

// Global instance
export const consistencyChecker = new ConsistencyChecker();

/**
 * Validators for common output types
 */
export const validators = {
  /**
   * Markdown format with heading
   */
  hasMarkdownHeading: (output: string) => /^#+\s/m.test(output),

  /**
   * Contains structured data marker
   */
  hasDataMarker: (pattern: string) => (output: string) => new RegExp(pattern).test(output),

  /**
   * Minimum length validation
   */
  minLength: (length: number) => (output: string) => output.length >= length,

  /**
   * Contains all required keywords
   */
  containsKeywords: (keywords: string[]) => (output: string) =>
    keywords.every(keyword => output.toLowerCase().includes(keyword.toLowerCase())),

  /**
   * Valid percentage range (0-100)
   */
  hasValidPercentage: (output: string) => {
    const matches = output.match(/\d+%/g);
    if (!matches) return false;
    return matches.every(match => {
      const num = parseInt(match);
      return num >= 0 && num <= 100;
    });
  },

  /**
   * Has both text and sources properties
   */
  hasStructure: (output: any) => 
    output && typeof output === 'object' && 'text' in output && 'sources' in output,

  /**
   * Is valid JSON
   */
  isValidJSON: (output: string) => {
    try {
      JSON.parse(output);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Logging utility for tracking consistency issues
 */
export const consistencyLogger = {
  log: (feature: string, status: 'success' | 'failure' | 'warning', message: string) => {
    const timestamp = new Date().toISOString();
    const emoji = status === 'success' ? '✅' : status === 'failure' ? '❌' : '⚠️';
    console.log(`[${timestamp}] ${emoji} ${feature}: ${message}`);
  },

  startTiming: () => Date.now(),

  endTiming: (startTime: number, feature: string) => {
    const elapsed = Date.now() - startTime;
    consistencyChecker.trackTiming(elapsed);
    if (elapsed > 5000) {
      consistencyLogger.log(feature, 'warning', `Slow response: ${elapsed}ms`);
    }
  }
};
