import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertTriangle, CheckCircle2, Clock, BarChart3, RefreshCw, Download } from 'lucide-react';
import { getConsistencyMetrics, getConsistencyReport, resetConsistencyMetrics } from '../services/aiServiceWrapper';

interface ConsistencyMetrics {
  totalRequests: number;
  successfulResponses: number;
  failedResponses: number;
  averageResponseTime: number;
  qualityScore: number;
  deviations: any[];
}

const ConsistencyDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ConsistencyMetrics | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(getConsistencyMetrics());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Refresh every 5s

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleDownloadReport = () => {
    const report = getConsistencyReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consistency-report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
  };

  const handleReset = () => {
    if (confirm('Reset all consistency metrics? This cannot be undone.')) {
      resetConsistencyMetrics();
      setMetrics(getConsistencyMetrics());
    }
  };

  if (!metrics) {
    return <div className="text-center text-gray-400">Loading metrics...</div>;
  }

  const successRate = metrics.totalRequests > 0 
    ? ((metrics.successfulResponses / metrics.totalRequests) * 100).toFixed(1)
    : 0;

  const failureRate = metrics.totalRequests > 0 
    ? ((metrics.failedResponses / metrics.totalRequests) * 100).toFixed(1)
    : 0;

  const statusColor = metrics.qualityScore >= 90 ? 'emerald' : metrics.qualityScore >= 70 ? 'amber' : 'red';
  const statusEmoji = metrics.qualityScore >= 90 ? '✅' : metrics.qualityScore >= 70 ? '⚠️' : '❌';

  return (
    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
            <Activity size={24} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic">AI Consistency Monitor</h2>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Real-time accuracy & performance</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg transition-all ${autoRefresh ? 'bg-emerald-600/20 border border-emerald-500/30' : 'bg-white/5 border border-white/10'}`}
          >
            <RefreshCw size={18} className={autoRefresh ? 'text-emerald-400 animate-spin' : 'text-gray-400'} />
          </button>
          <button
            onClick={handleDownloadReport}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all"
          >
            <Download size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Quality Score */}
      <div className={`bg-${statusColor}-600/10 border border-${statusColor}-500/30 rounded-xl p-6`}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Overall Quality Score</p>
            <div className="text-6xl font-black text-white">{metrics.qualityScore.toFixed(1)}</div>
            <p className="text-[10px] font-bold text-gray-500 mt-2">Out of 100</p>
          </div>
          <div className="text-5xl">{statusEmoji}</div>
        </div>
        <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full bg-${statusColor}-500 transition-all duration-500`}
            style={{ width: `${metrics.qualityScore}%` }}
          />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Requests */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Total Requests</span>
            <Activity size={16} className="text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{metrics.totalRequests}</div>
          <p className="text-[10px] text-gray-600 mt-2">Cumulative API calls</p>
        </div>

        {/* Success Rate */}
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Success Rate</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{successRate}%</div>
          <p className="text-[10px] text-gray-600 mt-2">{metrics.successfulResponses} successful</p>
        </div>

        {/* Failure Rate */}
        <div className={`bg-${metrics.failedResponses > 0 ? 'red' : 'emerald'}-600/10 border border-${metrics.failedResponses > 0 ? 'red' : 'emerald'}-500/30 rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Failures</span>
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div className={`text-3xl font-black ${metrics.failedResponses > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {metrics.failedResponses}
          </div>
          <p className="text-[10px] text-gray-600 mt-2">{failureRate}% of total</p>
        </div>

        {/* Avg Response Time */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Avg Response</span>
            <Clock size={16} className="text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{metrics.averageResponseTime.toFixed(0)}ms</div>
          <p className="text-[10px] text-gray-600 mt-2">Average latency</p>
        </div>
      </div>

      {/* Deviations List */}
      {metrics.deviations.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-400" />
            Recent Deviations {`(${metrics.deviations.length})`}
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {metrics.deviations.slice(-5).map((dev, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border ${
                  dev.severity === 'high'
                    ? 'bg-red-600/10 border-red-500/30'
                    : dev.severity === 'medium'
                    ? 'bg-amber-600/10 border-amber-500/30'
                    : 'bg-blue-600/10 border-blue-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-white text-sm">{dev.feature}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                    dev.severity === 'high'
                      ? 'bg-red-600 text-white'
                      : dev.severity === 'medium'
                      ? 'bg-amber-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {dev.severity}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">{dev.message}</p>
                <p className="text-[9px] text-gray-600 mt-2">{dev.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Deviations */}
      {metrics.deviations.length === 0 && metrics.totalRequests > 0 && (
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-6 text-center">
          <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-emerald-400">All Systems Nominal</p>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-2">No deviations recorded</p>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <button
          onClick={handleDownloadReport}
          className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <BarChart3 size={16} />
          Download Full Report
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-red-600/20 hover:border-red-500/30 text-gray-400 font-bold rounded-lg transition-all"
        >
          Reset Metrics
        </button>
      </div>
    </div>
  );
};

export default ConsistencyDashboard;
