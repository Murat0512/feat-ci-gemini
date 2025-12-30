import { HistoricAudit } from '../types';

/**
 * Advanced Search Service with:
 * - Full-text search
 * - Fuzzy matching
 * - Weighted ranking (recency + relevance + risk score)
 * - Search history & analytics
 * - Multi-field search
 */

interface SearchResult {
  audit: HistoricAudit;
  relevanceScore: number; // 0-100
  matchType: 'exact' | 'fuzzy' | 'partial';
  matchedFields: string[];
}

interface SearchAnalytics {
  query: string;
  resultCount: number;
  timestamp: number;
  executionTime: number;
}

class SearchService {
  private searchHistory: SearchAnalytics[] = [];
  private maxHistorySize = 100;

  /**
   * Fuzzy string matching algorithm (Levenshtein distance)
   */
  private fuzzyMatch(searchTerm: string, target: string, threshold: number = 0.6): number {
    const search = searchTerm.toLowerCase();
    const text = target.toLowerCase();

    if (text.includes(search)) return 1; // Exact substring match
    if (text.startsWith(search)) return 0.9; // Starts with match

    // Levenshtein distance for fuzzy matching
    const distance = this.levenshteinDistance(search, text);
    const maxLength = Math.max(search.length, text.length);
    const similarity = 1 - distance / maxLength;

    return similarity > threshold ? similarity : 0;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Calculate relevance score with weights:
   * - Exact/fuzzy match on file name (50%)
   * - Match on analysis text (30%)
   * - Risk score match (10%)
   * - Recency bonus (10%)
   */
  private calculateRelevanceScore(
    audit: HistoricAudit,
    searchTerm: string,
    matchedFields: string[]
  ): number {
    let score = 0;

    // File name match (highest priority)
    const fileNameMatch = this.fuzzyMatch(searchTerm, audit.fileName || '', 0.5);
    score += fileNameMatch * 50;

    // Analysis text match
    const analysisMatch = this.fuzzyMatch(searchTerm, audit.analysisText || '', 0.5);
    score += analysisMatch * 30;

    // Jurisdiction match
    const jurisdictionMatch = this.fuzzyMatch(searchTerm, audit.jurisdiction || '', 0.7);
    score += jurisdictionMatch * 10;

    // Recency bonus (within last 7 days gets bonus)
    const auditDate = new Date(audit.timestamp).getTime();
    const now = Date.now();
    const daysSince = (now - auditDate) / (1000 * 60 * 60 * 24);
    const recencyBonus = Math.max(0, 10 - daysSince);
    score += recencyBonus;

    // Risk score bonus (high-risk documents get slight boost)
    const riskBonus = (audit.score || 0) / 100 * 5;
    score += riskBonus;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Main search function
   */
  public search(audits: HistoricAudit[], searchTerm: string): SearchResult[] {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    const startTime = performance.now();
    const results: SearchResult[] = [];

    // Normalize search term
    const normalizedTerm = searchTerm.toLowerCase().trim();

    audits.forEach(audit => {
      const matchedFields: string[] = [];

      // Check file name
      const fileNameScore = this.fuzzyMatch(normalizedTerm, audit.fileName || '', 0.5);
      if (fileNameScore > 0) matchedFields.push('fileName');

      // Check analysis text
      const analysisScore = this.fuzzyMatch(normalizedTerm, audit.analysisText || '', 0.5);
      if (analysisScore > 0) matchedFields.push('analysisText');

      // Check jurisdiction
      const jurisdictionScore = this.fuzzyMatch(normalizedTerm, audit.jurisdiction || '', 0.7);
      if (jurisdictionScore > 0) matchedFields.push('jurisdiction');

      // Check ID
      if (audit.id.toLowerCase().includes(normalizedTerm)) {
        matchedFields.push('id');
      }

      // If any match found, add to results
      if (matchedFields.length > 0) {
        const relevanceScore = this.calculateRelevanceScore(audit, normalizedTerm, matchedFields);

        // Determine match type
        let matchType: 'exact' | 'fuzzy' | 'partial' = 'fuzzy';
        if (matchedFields.some(field => {
          const fieldValue = (audit as any)[field]?.toLowerCase() || '';
          return fieldValue === normalizedTerm;
        })) {
          matchType = 'exact';
        } else if (matchedFields.some(field => {
          const fieldValue = (audit as any)[field]?.toLowerCase() || '';
          return fieldValue.includes(normalizedTerm);
        })) {
          matchType = 'partial';
        }

        results.push({
          audit,
          relevanceScore,
          matchType,
          matchedFields
        });
      }
    });

    // Sort by relevance score (highest first)
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Record search analytics
    const executionTime = performance.now() - startTime;
    this.recordSearchAnalytics(normalizedTerm, results.length, executionTime);

    return results;
  }

  /**
   * Advanced search with filters
   */
  public advancedSearch(
    audits: HistoricAudit[],
    searchTerm: string,
    filters?: {
      minRisk?: number;
      maxRisk?: number;
      jurisdiction?: string;
      dateFrom?: Date;
      dateTo?: Date;
    }
  ): SearchResult[] {
    let filtered = audits;

    if (filters) {
      filtered = audits.filter(audit => {
        if (filters.minRisk && (audit.score || 0) < filters.minRisk) return false;
        if (filters.maxRisk && (audit.score || 0) > filters.maxRisk) return false;
        if (filters.jurisdiction && !audit.jurisdiction?.toLowerCase().includes(filters.jurisdiction.toLowerCase())) return false;
        if (filters.dateFrom && new Date(audit.timestamp) < filters.dateFrom) return false;
        if (filters.dateTo && new Date(audit.timestamp) > filters.dateTo) return false;
        return true;
      });
    }

    return this.search(filtered, searchTerm);
  }

  /**
   * Get trending search terms (for analytics/suggestions)
   */
  public getTrendingSearches(limit: number = 5): Array<{ term: string; count: number }> {
    const termCounts = new Map<string, number>();

    this.searchHistory.forEach(entry => {
      const count = termCounts.get(entry.query) || 0;
      termCounts.set(entry.query, count + 1);
    });

    return Array.from(termCounts.entries())
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get search suggestions based on history
   */
  public getSuggestions(partialTerm: string, limit: number = 5): string[] {
    const normalized = partialTerm.toLowerCase();
    const suggestions = new Set<string>();

    this.searchHistory.forEach(entry => {
      if (entry.query.toLowerCase().startsWith(normalized)) {
        suggestions.add(entry.query);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Record search analytics
   */
  private recordSearchAnalytics(query: string, resultCount: number, executionTime: number): void {
    this.searchHistory.push({
      query,
      resultCount,
      timestamp: Date.now(),
      executionTime
    });

    // Keep history size manageable
    if (this.searchHistory.length > this.maxHistorySize) {
      this.searchHistory = this.searchHistory.slice(-this.maxHistorySize);
    }

    // Persist to localStorage
    try {
      localStorage.setItem('lexiscan_search_history', JSON.stringify(this.searchHistory));
    } catch (e) {
      console.warn('Failed to persist search history:', e);
    }
  }

  /**
   * Load search history from localStorage
   */
  public loadHistory(): void {
    try {
      const stored = localStorage.getItem('lexiscan_search_history');
      if (stored) {
        this.searchHistory = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load search history:', e);
    }
  }

  /**
   * Clear search history
   */
  public clearHistory(): void {
    this.searchHistory = [];
    try {
      localStorage.removeItem('lexiscan_search_history');
    } catch (e) {
      console.warn('Failed to clear search history:', e);
    }
  }

  /**
   * Get search analytics
   */
  public getAnalytics(): {
    totalSearches: number;
    avgExecutionTime: number;
    uniqueQueries: number;
  } {
    const totalSearches = this.searchHistory.length;
    const avgExecutionTime = totalSearches > 0
      ? this.searchHistory.reduce((sum, entry) => sum + entry.executionTime, 0) / totalSearches
      : 0;
    const uniqueQueries = new Set(this.searchHistory.map(entry => entry.query)).size;

    return {
      totalSearches,
      avgExecutionTime,
      uniqueQueries
    };
  }
}

// Export singleton instance
export const searchService = new SearchService();

// Load history on init
searchService.loadHistory();
