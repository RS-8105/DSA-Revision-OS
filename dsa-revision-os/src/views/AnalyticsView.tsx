import React from 'react';
import { Pattern } from '../types';

interface AnalyticsViewProps {
  patterns: Pattern[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ patterns }) => {
  const totalMastered = patterns.filter((p) => p.mastery >= 80).length;
  const avgMastery = Math.round(
    patterns.reduce((acc, p) => acc + p.mastery, 0) / (patterns.length || 1)
  );

  return (
    <div className="flex flex-col w-full pb-16 space-y-6 pt-2">
      <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#326b00]">bar_chart</span>
            <h1 className="font-serif text-3xl font-bold text-[#111f09]">Retention Analytics</h1>
          </div>
          <p className="font-serif text-sm text-[#414a38] mt-1">
            Algorithmic recall decay modeling, cognitive half-life, and taxonomy stability index.
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
          <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e]">Average Recall Score</span>
          <div className="font-serif text-3xl font-bold text-[#326b00] mt-1">{avgMastery}%</div>
          <span className="font-sans text-[10px] text-[#526b3e]">+4.2% this month</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#c9d8be]/60 shadow-xs">
          <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e]">Mastered Paradigms</span>
          <div className="font-serif text-3xl font-bold text-[#006a6a] mt-1">{totalMastered} / 56</div>
          <span className="font-sans text-[10px] text-[#526b3e]">Tier 1 Core Catalog</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#c9d8be]/60 shadow-xs">
          <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e]">Median Forgetting Halflife</span>
          <div className="font-serif text-3xl font-bold text-[#111f09] mt-1">18.4 Days</div>
          <span className="font-sans text-[10px] text-[#526b3e]">Optimal spaced expansion</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#c9d8be]/60 shadow-xs">
          <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e]">Lapse Ratio</span>
          <div className="font-serif text-3xl font-bold text-[#255400] mt-1">4.2%</div>
          <span className="font-sans text-[10px] text-[#526b3e]">Industry benchmark &lt;10%</span>
        </div>
      </div>

      {/* Simulated Decay Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/60 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#111f09] mb-1">
            Cognitive Decay Curve Simulation
          </h2>
          <p className="font-serif text-xs text-[#526b3e] mb-4">
            Ebbinghaus model projected against 5-stage Leitner repetitions.
          </p>
          <div className="h-60 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 500 240">
              <line x1="40" y1="20" x2="40" y2="200" stroke="#c9d8be" strokeWidth="1" />
              <line x1="40" y1="200" x2="480" y2="200" stroke="#c9d8be" strokeWidth="1" />
              {/* Threshold */}
              <line x1="40" y1="120" x2="480" y2="120" stroke="#ba1a1a" strokeDasharray="4 4" strokeWidth="1" opacity="0.6" />
              <text x="45" y="115" fontSize="10" fill="#ba1a1a" className="font-sans">Retention Threshold (60%)</text>
              {/* Curve 1 (no repetition) */}
              <path d="M 40 40 Q 80 140, 160 190" fill="none" stroke="#ba1a1a" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Repetition curves */}
              <path d="M 100 40 Q 150 110, 240 160" fill="none" stroke="#286290" strokeWidth="1.5" />
              <path d="M 200 40 Q 280 80, 420 120" fill="none" stroke="#77c73d" strokeWidth="2" />
              <path d="M 320 40 Q 400 60, 480 80" fill="none" stroke="#006a6a" strokeWidth="2.5" />
              <text x="40" y="220" fontSize="10" fill="#526b3e" className="font-sans">Day 0</text>
              <text x="140" y="220" fontSize="10" fill="#526b3e" className="font-sans">Day 7</text>
              <text x="260" y="220" fontSize="10" fill="#526b3e" className="font-sans">Day 14</text>
              <text x="380" y="220" fontSize="10" fill="#526b3e" className="font-sans">Day 30</text>
            </svg>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/60 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#111f09] mb-1">
            Taxonomy Mastery Distribution
          </h2>
          <p className="font-serif text-xs text-[#526b3e] mb-4">
            Percentage completion and consolidation across core modules.
          </p>
          <div className="space-y-3 font-serif">
            {[
              { label: 'Arrays & Strings', pct: 82, color: 'bg-[#77c73d]' },
              { label: 'Binary Search', pct: 76, color: 'bg-[#77c73d]' },
              { label: 'Trees & BSTs', pct: 71, color: 'bg-[#77c73d]' },
              { label: 'Linked Lists', pct: 65, color: 'bg-[#006a6a]' },
              { label: 'Stack & Queue', pct: 60, color: 'bg-[#006a6a]' },
              { label: 'Graphs', pct: 48, color: 'bg-[#ba1a1a]' },
              { label: 'Dynamic Programming', pct: 42, color: 'bg-[#ba1a1a]' },
            ].map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#111f09]">{d.label}</span>
                  <span className="font-mono text-[#326b00]">{d.pct}%</span>
                </div>
                <div className="w-full bg-[#ebf4e6] h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${d.color}`} style={{ width: `${d.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
