import React from 'react';
import { CATEGORIES } from '../types';

export const AnalyticsView = ({
  patterns = [],
  dashboardData = null,
  revisionHistory = [],
}) => {
  const totalMastered =
    dashboardData?.progressSummary?.masteredPatterns ??
    patterns.filter((p) => p.mastery >= 80).length;

  const avgMastery =
    dashboardData?.overallMastery ??
    (patterns.length > 0
      ? Math.round(patterns.reduce((acc, p) => acc + (p.mastery || 0), 0) / patterns.length)
      : 0);

  const totalSessions =
    dashboardData?.totalRevisionsCompleted ??
    revisionHistory.length;

  // Real assessment counts from actual revision history
  const forgotCount = revisionHistory.filter(
    (h) => (h.confidence || h.assessment || '').toUpperCase() === 'FORGOT'
  ).length;

  const struggledCount = revisionHistory.filter(
    (h) => (h.confidence || h.assessment || '').toUpperCase() === 'STRUGGLED'
  ).length;

  const goodCount = revisionHistory.filter(
    (h) => (h.confidence || h.assessment || '').toUpperCase() === 'GOOD'
  ).length;

  const easyCount = revisionHistory.filter(
    (h) => (h.confidence || h.assessment || '').toUpperCase() === 'EASY'
  ).length;

  const lapseRatio =
    revisionHistory.length > 0
      ? `${((forgotCount / revisionHistory.length) * 100).toFixed(1)}%`
      : '0.0%';

  // Assessment percentages
  const historyTotal = revisionHistory.length || 1;
  const easyPct = Math.round((easyCount / historyTotal) * 100);
  const goodPct = Math.round((goodCount / historyTotal) * 100);
  const struggledPct = Math.round((struggledCount / historyTotal) * 100);
  const forgotPct = Math.round((forgotCount / historyTotal) * 100);

  return (
    <div className="flex flex-col w-full pb-16 space-y-6 pt-2">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#326b00]">bar_chart</span>
            <h1 className="font-serif text-3xl font-bold text-[#111f09]">Retention Analytics</h1>
          </div>
          <p className="font-serif text-sm text-[#414a38] mt-1">
            Real performance telemetry, assessment distribution, and taxonomy mastery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans text-[11px] uppercase tracking-wider px-3 py-1 bg-[#77c73d]/20 text-[#255400] font-bold rounded-lg border border-[#77c73d]/40">
            SM-2 Leitner Engine Active
          </span>
        </div>
      </div>

      {/* 4 Stat KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#c9d8be]/60 shadow-xs">
          <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e]">
            Average Recall Score
          </span>
          <div className="font-serif text-3xl font-bold text-[#326b00] mt-1">{avgMastery}%</div>
          <span className="font-sans text-[10px] text-[#526b3e]">
            Across {patterns.length} tracked paradigms
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c9d8be]/60 shadow-xs">
          <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e]">
            Mastered Paradigms
          </span>
          <div className="font-serif text-3xl font-bold text-[#006a6a] mt-1">
            {totalMastered} / {patterns.length}
          </div>
          <span className="font-sans text-[10px] text-[#526b3e]">
            {Math.round((totalMastered / (patterns.length || 1)) * 100)}% at 80%+ mastery
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c9d8be]/60 shadow-xs">
          <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e]">
            Total Revisions Logged
          </span>
          <div className="font-serif text-3xl font-bold text-[#111f09] mt-1">
            {totalSessions}
          </div>
          <span className="font-sans text-[10px] text-[#526b3e]">
            {revisionHistory.length} in active user ledger
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#c9d8be]/60 shadow-xs">
          <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e]">
            Lapse Ratio
          </span>
          <div className="font-serif text-3xl font-bold text-[#ba1a1a] mt-1">{lapseRatio}</div>
          <span className="font-sans text-[10px] text-[#526b3e]">
            {forgotCount} lapses in {revisionHistory.length} total sessions
          </span>
        </div>
      </div>

      {/* Main Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Assessment Distribution */}
        <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif text-xl font-bold text-[#111f09]">
                Assessment Quality Distribution
              </h2>
              <span className="font-sans text-[10px] uppercase px-2 py-0.5 rounded bg-[#f5fbf1] text-[#526b3e] font-semibold border border-[#c9d8be]/50">
                {revisionHistory.length} Total Ratings
              </span>
            </div>
            <p className="font-serif text-xs text-[#526b3e] mb-5">
              Empirical breakdown of recall self-assessments recorded in revision sessions.
            </p>

            {revisionHistory.length > 0 ? (
              <div className="space-y-4 font-serif">
                {/* Easy */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-[#006a6a] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#006a6a]"></span>
                      [4] Easy (Effortless)
                    </span>
                    <span className="font-mono text-[#006a6a] font-bold">
                      {easyCount} ({easyPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#ebf4e6] h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006a6a]" style={{ width: `${easyPct}%` }}></div>
                  </div>
                </div>

                {/* Good */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-[#255400] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#77c73d]"></span>
                      [3] Good (Solid Recall)
                    </span>
                    <span className="font-mono text-[#255400] font-bold">
                      {goodCount} ({goodPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#ebf4e6] h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#77c73d]" style={{ width: `${goodPct}%` }}></div>
                  </div>
                </div>

                {/* Struggled */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-[#286290] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#286290]"></span>
                      [2] Struggled (Partial Recall)
                    </span>
                    <span className="font-mono text-[#286290] font-bold">
                      {struggledCount} ({struggledPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#ebf4e6] h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#286290]" style={{ width: `${struggledPct}%` }}></div>
                  </div>
                </div>

                {/* Forgot */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-[#ba1a1a] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
                      [1] Forgot (Lapse)
                    </span>
                    <span className="font-mono text-[#ba1a1a] font-bold">
                      {forgotCount} ({forgotPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#fae8e6] h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ba1a1a]" style={{ width: `${forgotPct}%` }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-[#f5fbf1] rounded-xl border border-dashed border-[#c9d8be]/70 text-xs text-[#526b3e]">
                No revision history logged yet. Complete revision reviews to view assessment distribution.
              </div>
            )}
          </div>

          {/* Model Status Note */}
          <div className="mt-4 p-3.5 bg-[#f5fbf1] border border-[#c9d8be]/60 rounded-lg text-xs font-serif text-[#414a38]">
            <div className="flex items-center gap-1.5 text-[#326b00] font-bold mb-1">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Forgetting Half-Life Telemetry</span>
            </div>
            <p className="leading-relaxed">
              Empirical half-life decay modeling requires historical multi-week regression points.
              Current interval calculations use the deterministic SM-2 Leitner expansion ladder (1D → 3D → 7D → 14D → 30D).
            </p>
          </div>
        </div>

        {/* Real Taxonomy Mastery Distribution */}
        <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/60 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-serif text-xl font-bold text-[#111f09]">
              Taxonomy Mastery Distribution
            </h2>
            <span className="font-sans text-[10px] uppercase px-2 py-0.5 rounded bg-[#f5fbf1] text-[#526b3e] font-semibold border border-[#c9d8be]/50">
              Live Category Index
            </span>
          </div>
          <p className="font-serif text-xs text-[#526b3e] mb-4">
            Percentage completion and consolidation across active curriculum modules.
          </p>

          <div className="space-y-3 font-serif">
            {CATEGORIES.map((cat) => {
              const catPatterns = patterns.filter((p) => p.category === cat);
              if (catPatterns.length === 0) return null;

              const pct = Math.round(
                catPatterns.reduce((acc, p) => acc + (p.mastery || 0), 0) / catPatterns.length
              );
              const color =
                pct >= 70 ? 'bg-[#77c73d]' : pct >= 50 ? 'bg-[#006a6a]' : 'bg-[#ba1a1a]';

              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-[#111f09]">
                      {cat}{' '}
                      <span className="text-[#526b3e] font-normal">
                        ({catPatterns.length} {catPatterns.length === 1 ? 'pattern' : 'patterns'})
                      </span>
                    </span>
                    <span className="font-mono text-[#326b00] font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-[#ebf4e6] h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
