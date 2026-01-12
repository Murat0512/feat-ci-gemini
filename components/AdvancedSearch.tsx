import React, { useState, useEffect } from 'react';
import { Search, History, AlertCircle, TrendingUp } from 'lucide-react';
import { HistoricAudit } from '../types';
import { searchService } from '../services/searchService';

interface AdvancedSearchProps {
  audits: HistoricAudit[];
  onSearchResults: (results: HistoricAudit[]) => void;
  onSearchHighlight?: (matchedIds: string[]) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ audits, onSearchResults, onSearchHighlight }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<Array<{ term: string; count: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Load trending searches on mount
  useEffect(() => {
    const trending = searchService.getTrendingSearches(5);
    setTrendingSearches(trending);
  }, []);

  // Update suggestions as user types
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const suggestions = searchService.getSuggestions(searchTerm, 5);
      setSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    if (!term.trim()) {
      onSearchResults(audits);
      setSearchPerformed(false);
      return;
    }

    setSearchTerm(term);
    const results = searchService.search(audits, term);
    
    // Extract audit objects and matched IDs
    const foundAudits = results.map(r => r.audit);
    const matchedIds = foundAudits.map(a => a.id);

    onSearchResults(foundAudits);
    onSearchHighlight?.(matchedIds);
    setSearchPerformed(true);
    setShowSuggestions(false);

    // Update trending searches
    const trending = searchService.getTrendingSearches(5);
    setTrendingSearches(trending);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <div className="w-full space-y-3">
      {/* Search Input with Suggestions */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search documents, risk scores, jurisdictions... (fuzzy matching enabled)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.trim().length > 0 && setShowSuggestions(true)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-gray-800 text-gray-300 text-sm border-b border-gray-800 last:border-b-0 transition"
              >
                <History className="inline w-4 h-4 mr-2 text-gray-500" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Trending Searches */}
      {!searchPerformed && trendingSearches.length > 0 && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            Popular Searches
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((trend, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(trend.term)}
                className="px-3 py-1 bg-gray-800 hover:bg-blue-900 text-gray-300 text-sm rounded transition duration-200 flex items-center gap-1"
              >
                {trend.term}
                <span className="text-gray-500 text-xs">({trend.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Tips */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 flex gap-2 text-xs text-blue-300">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Search Tips:</strong> Use file names, risk scores (e.g., "high risk"), jurisdictions, or keywords. Supports fuzzy matching for typos.
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
