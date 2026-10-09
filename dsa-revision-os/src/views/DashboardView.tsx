import React from 'react';
import { Pattern } from '../types';

interface DashboardViewProps {
  patterns: Pattern[];
  onStartRevision: (patternId?: string) => void;
  onOpenCodex: (patternId: string) => void;
  onOpenQuickLog: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patterns,
  onStartRevision,
  onOpenCodex,
  onOpenQuickLog,
}) => {
  // Filter queue items that are due or overdue
  const queuePatterns = patterns.filter((p) => p.isDueToday || p.isOverdue).slice(0, 6);
  const overdueCount = patterns.filter((p) => p.isOverdue).length;

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Command Header */}
      <section className="relative mb-6 rounded-xl bg-white p-6 overflow-hidden shadow-xs border border-[#c9d8be]/60">
        <div className="absolute -right-16 -top-24 w-80 h-80 rounded-full bg-[#77c73d]/15 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ebf5e5] text-[#326b00] font-sans text-[11px] uppercase tracking-wider border border-[#cbe3bf]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#326b00] animate-pulse"></span>
                Tuesday, October 24 · Spaced Repetition Cycle #4
              </span>
              <span className="px-3 py-0.5 rounded-full bg-[#ffebee] text-[#ba1a1a] font-sans text-[10px] tracking-widest uppercase border border-[#ba1a1a]/20 font-bold">
                Active Review Window
              </span>
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl text-[#111f09] tracking-tight font-bold">
              Your DSA Workspace
            </h1>
            <p className="font-serif text-lg text-[#414a38] max-w-xl">
              Build consistency. Strengthen recall. Master patterns.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-center">
            <button
              onClick={() => onStartRevision('sliding-window')}
              type="button"
              className="group relative flex items-center gap-2 px-5 py-2.5 bg-[#77c73d] text-[#112600] font-serif font-bold text-sm rounded-lg shadow-sm hover:bg-[#86d949] transition-all border border-[#64b02d] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">
                play_circle
              </span>
              <span>Start Today's Revision</span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-black/10 text-[#112600] font-sans text-[10px] uppercase font-bold">
                6 Due
              </span>
            </button>
            <button
              onClick={onOpenQuickLog}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#f0f8ec] text-[#111f09] hover:text-[#326b00] rounded-lg transition-colors font-serif font-bold text-sm border border-[#c9d8be]/60 hover:border-[#326b00]/40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              <span>Log Custom Session</span>
            </button>
          </div>
        </div>
      </section>

      {/* Overview Metrics (4-Column Bento Bar) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Metric 1: Due Today */}
        <div className="relative flex flex-col justify-between p-4 rounded-xl bg-white shadow-xs border border-[#c9d8be]/60 hover:border-[#326b00]/40 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#414a38] font-semibold">
              Queue Load
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] font-sans text-[10px] uppercase tracking-wider font-bold border border-[#ba1a1a]/20">
              {overdueCount} Overdue
            </span>
          </div>
          <div className="my-1">
            <div className="font-serif text-2xl font-bold text-[#111f09]">
              6 <span className="text-base font-normal text-[#414a38]">patterns</span>
            </div>
            <div className="font-serif text-xs text-[#414a38]">2 carried over from yesterday</div>
          </div>
          <div className="w-full bg-[#ebf4e6] h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-[#ba1a1a] h-full rounded-full w-1/3"></div>
          </div>
        </div>

        {/* Metric 2: Streak */}
        <div className="relative flex flex-col justify-between p-4 rounded-xl bg-white shadow-xs border border-[#c9d8be]/60 hover:border-[#326b00]/40 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#414a38] font-semibold">
              Cadence
            </span>
            <span className="flex items-center gap-1 text-[#326b00]">
              <span className="material-symbols-outlined text-[16px] text-[#326b00]">
                local_fire_department
              </span>
              <span className="font-sans text-[10px] uppercase font-bold">Active</span>
            </span>
          </div>
          <div className="my-1">
            <div className="font-serif text-2xl text-[#326b00] font-bold">
              12 <span className="text-base font-normal text-[#414a38]">days</span>
            </div>
            <div className="font-serif text-xs text-[#414a38]">Personal best: 24 consecutive days</div>
          </div>
          {/* 14-day streak pips */}
          <div className="flex items-center gap-1 mt-2 pt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-xs bg-[#77c73d]"
                title={`Day ${i}`}
              ></span>
            ))}
            <span className="w-2.5 h-2.5 rounded-xs bg-[#d7e6ce]" title="Day 13"></span>
            <span className="w-2.5 h-2.5 rounded-xs bg-[#d7e6ce]" title="Day 14"></span>
          </div>
        </div>

        {/* Metric 3: Overall Mastery */}
        <div className="relative flex flex-col justify-between p-4 rounded-xl bg-white shadow-xs border border-[#c9d8be]/60 hover:border-[#326b00]/40 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#414a38] font-semibold">
              Overall Mastery
            </span>
            <span className="flex items-center text-[#326b00] font-sans text-[10px] uppercase font-bold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +4.2%
            </span>
          </div>
          <div className="flex items-center justify-between my-1">
            <div>
              <div className="font-serif text-2xl text-[#006a6a] font-bold">68%</div>
              <div className="font-serif text-xs text-[#414a38]">38 of 56 core patterns</div>
            </div>
            <svg className="w-12 h-12 -rotate-90 text-[#006a6a]" viewBox="0 0 36 36">
              <path
                className="text-[#e2eee0]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              ></path>
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="68, 100"
                strokeLinecap="round"
                strokeWidth="3.5"
              ></path>
            </svg>
          </div>
          <div className="font-sans text-[10px] text-[#414a38]/80">
            Monthly velocity: +6 mastered
          </div>
        </div>

        {/* Metric 4: Completed This Week */}
        <div className="relative flex flex-col justify-between p-4 rounded-xl bg-white shadow-xs border border-[#c9d8be]/60 hover:border-[#326b00]/40 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#414a38] font-semibold">
              Weekly Quota
            </span>
            <span className="font-sans text-[10px] text-[#414a38] uppercase font-medium">
              Target 25
            </span>
          </div>
          <div className="my-1">
            <div className="font-serif text-2xl font-bold text-[#111f09]">
              18 <span className="text-base font-normal text-[#414a38]">revisions</span>
            </div>
            <div className="font-serif text-xs text-[#414a38]">72% of weekly milestone</div>
          </div>
          <div className="w-full bg-[#ebf4e6] h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-[#77c73d] h-full rounded-full" style={{ width: '72%' }}></div>
          </div>
        </div>
      </section>

      {/* Main Content Layout (7 cols left, 5 cols right on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 1. Today's Revision Queue */}
          <section className="rounded-xl bg-white p-5 shadow-xs border border-[#c9d8be]/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 pb-2 border-b border-[#c9d8be]/30">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#326b00] text-[20px]">
                    checklist
                  </span>
                  <h2 className="font-serif text-2xl text-[#111f09] font-bold">
                    Today's Revision Queue
                  </h2>
                </div>
                <p className="font-sans text-[10px] text-[#414a38] uppercase tracking-widest">
                  Prioritized by retention decay &amp; spaced interval
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-[#326b00] text-sm">
                  2 of 6 completed (33%)
                </span>
              </div>
            </div>

            {/* Hairline Progress */}
            <div className="w-full bg-[#ebf4e6] h-1.5 rounded-full overflow-hidden mb-4">
              <div
                className="bg-[#77c73d] h-full rounded-full transition-all duration-700"
                style={{ width: '33.33%' }}
              ></div>
            </div>

            {/* Revision Items */}
            <div className="flex flex-col gap-2">
              {queuePatterns.map((item) => {
                const isOverdue = item.isOverdue;
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg transition-colors gap-3 border ${
                      isOverdue
                        ? 'bg-[#fff8f7] hover:bg-[#feefed] border-[#ba1a1a]/30'
                        : 'bg-[#f9fdf7] hover:bg-[#f0f8ec] border-[#c9d8be]/40'
                    }`}
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => onOpenCodex(item.id)}
                          className="font-serif text-base text-[#111f09] truncate font-bold hover:text-[#326b00] transition-colors text-left"
                        >
                          {item.name}
                        </button>
                        <span className="px-1.5 py-0.5 rounded bg-[#e7f3df] text-[#2d451b] font-sans text-[10px] uppercase font-semibold border border-[#d2e4c7]">
                          {item.category}
                        </span>
                        {isOverdue ? (
                          <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] font-sans text-[10px] uppercase font-bold border border-[#ba1a1a]/30">
                            {item.overdueText || 'Overdue (2d late)'}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-[#77c73d]/20 text-[#255200] font-sans text-[10px] uppercase font-bold border border-[#77c73d]/40">
                            Due Today
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 font-sans text-[11px] text-[#414a38]">
                        <span>Last revised: {item.lastRevisedDaysAgo}</span>
                        <span>•</span>
                        <span>
                          Active Interval:{' '}
                          <strong className={isOverdue ? 'text-[#ba1a1a]' : 'text-[#006a6a]'}>
                            {item.activeInterval}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>Complexity: {item.complexityTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onStartRevision(item.id)}
                        type="button"
                        className={`px-3.5 py-1.5 rounded font-serif text-xs font-bold transition-all shadow-xs cursor-pointer ${
                          isOverdue
                            ? 'bg-[#ba1a1a] text-white hover:bg-red-700'
                            : item.id === 'sliding-window' || item.id === 'binary-search-answer'
                            ? 'bg-[#77c73d] text-[#112600] hover:bg-[#86d949] border border-[#64b02d]'
                            : 'bg-[#eef7e8] text-[#111f09] hover:bg-[#e2f1d8] hover:text-[#326b00] border border-[#c9d8be]/60'
                        }`}
                      >
                        {isOverdue ? 'Resume' : item.id === 'sliding-window' || item.id === 'binary-search-answer' ? 'Revise Now' : 'Start'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hotkey hint bar */}
            <div className="mt-4 p-2.5 rounded-lg bg-[#f0f8ec] flex items-center justify-between text-[#414a38] font-sans text-[11px] border border-[#c9d8be]/50">
              <span className="flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">keyboard</span>
                <span>Speed Assessment Hotkeys during review:</span>
              </span>
              <div className="flex items-center gap-2 font-semibold">
                <span className="px-1.5 py-0.5 rounded bg-white border border-[#c9d8be]/50">[1] Forgot</span>
                <span className="px-1.5 py-0.5 rounded bg-white border border-[#c9d8be]/50">[2] Struggled</span>
                <span className="px-1.5 py-0.5 rounded bg-white border border-[#c9d8be]/50">[3] Good</span>
                <span className="px-1.5 py-0.5 rounded bg-[#77c73d]/30 text-[#326b00] border border-[#326b00]/40 font-bold">
                  [4] Easy
                </span>
              </div>
            </div>
          </section>

          {/* 2. Mastery Overview (Category Breakdown Meters) */}
          <section className="rounded-xl bg-white p-5 shadow-xs border border-[#c9d8be]/60">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#c9d8be]/30">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#006a6a] text-[20px]">
                    analytics
                  </span>
                  <h2 className="font-serif text-2xl text-[#111f09] font-bold">
                    Mastery Overview
                  </h2>
                </div>
                <p className="font-sans text-[10px] text-[#414a38] uppercase tracking-widest">
                  Taxonomy distribution across algorithm modules
                </p>
              </div>
              <span className="font-sans text-[10px] px-2 py-0.5 rounded bg-[#f5fbf1] text-[#414a38] font-semibold border border-[#c9d8be]/50">
                6 Tracked Domains
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {/* Domain 1: Arrays & Strings */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-[#111f09]">Arrays &amp; Strings</span>
                  <div className="flex items-center gap-3 font-sans text-xs">
                    <span className="text-[#414a38]">Mastered: 8 · Learning: 2</span>
                    <span className="font-serif text-base font-bold text-[#326b00]">82%</span>
                  </div>
                </div>
                <div className="w-full bg-[#ebf4e6] h-2 rounded-full overflow-hidden flex">
                  <div className="bg-[#77c73d] h-full rounded-l-full" style={{ width: '82%' }}></div>
                  <div className="bg-[#8adddd] h-full" style={{ width: '18%' }}></div>
                </div>
              </div>

              {/* Domain 2: Binary Search */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-[#111f09]">Binary Search</span>
                  <div className="flex items-center gap-3 font-sans text-xs">
                    <span className="text-[#414a38]">Mastered: 5 · Learning: 1</span>
                    <span className="font-serif text-base font-bold text-[#326b00]">76%</span>
                  </div>
                </div>
                <div className="w-full bg-[#ebf4e6] h-2 rounded-full overflow-hidden flex">
                  <div className="bg-[#77c73d] h-full rounded-l-full" style={{ width: '76%' }}></div>
                  <div className="bg-[#8adddd] h-full" style={{ width: '24%' }}></div>
                </div>
              </div>

              {/* Domain 3: Trees */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-[#111f09]">
                    Trees &amp; Binary Search Trees
                  </span>
                  <div className="flex items-center gap-3 font-sans text-xs">
                    <span className="text-[#414a38]">Mastered: 6 · Learning: 2</span>
                    <span className="font-serif text-base font-bold text-[#326b00]">71%</span>
                  </div>
                </div>
                <div className="w-full bg-[#ebf4e6] h-2 rounded-full overflow-hidden flex">
                  <div className="bg-[#77c73d] h-full rounded-l-full" style={{ width: '71%' }}></div>
                  <div className="bg-[#8adddd] h-full" style={{ width: '29%' }}></div>
                </div>
              </div>

              {/* Domain 4: Linked Lists */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-[#111f09]">Linked Lists</span>
                  <div className="flex items-center gap-3 font-sans text-xs">
                    <span className="text-[#414a38]">Mastered: 4 · Learning: 2</span>
                    <span className="font-serif text-base font-bold text-[#006a6a]">65%</span>
                  </div>
                </div>
                <div className="w-full bg-[#ebf4e6] h-2 rounded-full overflow-hidden flex">
                  <div className="bg-[#006a6a] h-full rounded-l-full" style={{ width: '65%' }}></div>
                  <div className="bg-[#6fa4d6] h-full" style={{ width: '35%' }}></div>
                </div>
              </div>

              {/* Domain 5: Graphs (Needs Attention) */}
              <div className="flex flex-col gap-1 p-2 rounded-lg bg-[#fff8f7] border border-[#ba1a1a]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-[#111f09]">Graphs</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] font-sans text-[10px] uppercase font-bold border border-[#ba1a1a]/30">
                      Needs Attention
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-sans text-xs">
                    <span className="text-[#414a38]">Mastered: 3 · Learning: 4</span>
                    <span className="font-serif text-base font-bold text-[#ba1a1a]">48%</span>
                  </div>
                </div>
                <div className="w-full bg-[#fae8e6] h-2 rounded-full overflow-hidden flex">
                  <div className="bg-[#ba1a1a] h-full rounded-l-full" style={{ width: '48%' }}></div>
                  <div className="bg-[#f0d0cb] h-full" style={{ width: '52%' }}></div>
                </div>
              </div>

              {/* Domain 6: Dynamic Programming (Needs Attention) */}
              <div className="flex flex-col gap-1 p-2 rounded-lg bg-[#fff8f7] border border-[#ba1a1a]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-[#111f09]">
                      Dynamic Programming
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] font-sans text-[10px] uppercase font-bold border border-[#ba1a1a]/30">
                      Needs Attention
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-sans text-xs">
                    <span className="text-[#414a38]">Mastered: 3 · Learning: 5</span>
                    <span className="font-serif text-base font-bold text-[#ba1a1a]">42%</span>
                  </div>
                </div>
                <div className="w-full bg-[#fae8e6] h-2 rounded-full overflow-hidden flex">
                  <div className="bg-[#ba1a1a] h-full rounded-l-full" style={{ width: '42%' }}></div>
                  <div className="bg-[#f0d0cb] h-full" style={{ width: '58%' }}></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* 1. "Needs Attention" Panel */}
          <section className="rounded-xl bg-white p-5 shadow-xs border border-[#c9d8be]/60">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#c9d8be]/30">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">
                    warning
                  </span>
                  <h2 className="font-serif text-2xl text-[#111f09] font-bold">Needs Attention</h2>
                </div>
                <p className="font-sans text-[10px] text-[#414a38] uppercase tracking-widest">
                  Lowest retention probability &amp; recent lapses
                </p>
              </div>
              <span className="font-sans text-[10px] px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] uppercase font-bold border border-[#ba1a1a]/30">
                3 Critical
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Item A: Knapsack 0/1 */}
              <div className="p-3.5 rounded-lg bg-[#fff8f7] hover:bg-[#feefed] transition-colors flex flex-col gap-1.5 border border-[#ba1a1a]/30">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onOpenCodex('knapsack-dp')}
                    className="font-serif text-base text-[#111f09] truncate font-bold text-left hover:text-[#ba1a1a]"
                  >
                    Knapsack 0/1
                  </button>
                  <span className="font-serif font-bold text-[#ba1a1a] text-sm">34% Mastery</span>
                </div>
                <div className="font-sans text-[11px] text-[#414a38]">
                  Dynamic Programming · Last: <span className="text-[#ba1a1a] font-bold">"Forgot"</span> (2 days ago)
                </div>
                <div className="w-full bg-[#fae8e6] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#ba1a1a] h-full rounded-full" style={{ width: '34%' }}></div>
                </div>
                <div className="flex items-center justify-between mt-1 pt-1">
                  <span className="font-sans text-[10px] text-[#414a38]">Decay Factor: High</span>
                  <button
                    onClick={() => onOpenCodex('knapsack-dp')}
                    type="button"
                    className="px-2.5 py-1 rounded bg-white hover:bg-[#77c73d] hover:text-[#112600] text-[#326b00] font-serif font-bold text-xs transition-colors border border-[#c9d8be]/60 cursor-pointer"
                  >
                    Review Concept
                  </button>
                </div>
              </div>

              {/* Item B: Dijkstra's Algorithm */}
              <div className="p-3.5 rounded-lg bg-[#fbfdfa] hover:bg-[#f0f8ec] transition-colors flex flex-col gap-1.5 border border-[#c9d8be]/40">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onOpenCodex('dijkstras-algorithm')}
                    className="font-serif text-base text-[#111f09] truncate font-bold text-left hover:text-[#326b00]"
                  >
                    Dijkstra's Algorithm
                  </button>
                  <span className="font-serif font-bold text-[#ba1a1a] text-sm">41% Mastery</span>
                </div>
                <div className="font-sans text-[11px] text-[#414a38]">
                  Graphs · Last: <span className="text-[#286290] font-bold">"Struggled"</span> (5 days ago)
                </div>
                <div className="w-full bg-[#ebf4e6] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#ba1a1a] h-full rounded-full" style={{ width: '41%' }}></div>
                </div>
                <div className="flex items-center justify-between mt-1 pt-1">
                  <span className="font-sans text-[10px] text-[#414a38]">Min-Heap Implementation</span>
                  <button
                    onClick={() => onOpenCodex('dijkstras-algorithm')}
                    type="button"
                    className="px-2.5 py-1 rounded bg-white hover:bg-[#77c73d] hover:text-[#112600] text-[#326b00] font-serif font-bold text-xs transition-colors border border-[#c9d8be]/60 cursor-pointer"
                  >
                    Review Concept
                  </button>
                </div>
              </div>

              {/* Item C: Monotonic Queue */}
              <div className="p-3.5 rounded-lg bg-[#fbfdfa] hover:bg-[#f0f8ec] transition-colors flex flex-col gap-1.5 border border-[#c9d8be]/40">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onOpenCodex('monotonic-stack')}
                    className="font-serif text-base text-[#111f09] truncate font-bold text-left hover:text-[#326b00]"
                  >
                    Monotonic Queue
                  </button>
                  <span className="font-serif font-bold text-[#006a6a] text-sm">45% Mastery</span>
                </div>
                <div className="font-sans text-[11px] text-[#414a38]">
                  Stack &amp; Queue · Last:{' '}
                  <span className="text-[#286290] font-bold">"Struggled"</span> (4 days ago)
                </div>
                <div className="w-full bg-[#ebf4e6] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#006a6a] h-full rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="flex items-center justify-between mt-1 pt-1">
                  <span className="font-sans text-[10px] text-[#414a38]">Sliding Window Maximum</span>
                  <button
                    onClick={() => onOpenCodex('monotonic-stack')}
                    type="button"
                    className="px-2.5 py-1 rounded bg-white hover:bg-[#77c73d] hover:text-[#112600] text-[#326b00] font-serif font-bold text-xs transition-colors border border-[#c9d8be]/60 cursor-pointer"
                  >
                    Review Concept
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Upcoming Schedule */}
          <section className="rounded-xl bg-white p-5 shadow-xs border border-[#c9d8be]/60">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#c9d8be]/30">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#286290] text-[20px]">
                    calendar_month
                  </span>
                  <h2 className="font-serif text-2xl text-[#111f09] font-bold">Upcoming Schedule</h2>
                </div>
                <p className="font-sans text-[10px] text-[#414a38] uppercase tracking-widest">
                  Next 4 days projected review pipeline
                </p>
              </div>
              <span className="font-sans text-[10px] text-[#414a38] uppercase font-semibold">
                14 Total Scheduled
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-lg bg-[#fbfdfa] flex items-start justify-between gap-3 border border-[#c9d8be]/40">
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-[#111f09] text-sm">Tomorrow (Wednesday)</span>
                  <span className="font-serif text-xs text-[#414a38]">
                    Tree DFS, Union Find, Kadane's, Trie
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#e3f4d6] text-[#326b00] font-sans text-[10px] font-bold border border-[#326b00]/20">
                  4 Patterns
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#fbfdfa] flex items-start justify-between gap-3 border border-[#c9d8be]/40">
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-[#111f09] text-sm">Thursday</span>
                  <span className="font-serif text-xs text-[#414a38]">
                    Prefix Sum, Subsets Backtracking, BFS
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#f0f8ec] text-[#414a38] font-sans text-[10px] font-bold border border-[#c9d8be]/50">
                  3 Patterns
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#fbfdfa] flex items-start justify-between gap-3 border border-[#c9d8be]/40">
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-[#111f09] text-sm">Friday</span>
                  <span className="font-serif text-xs text-[#414a38]">
                    Segment Tree, LCA, 2D DP, Monotonic Deque...
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#d8f4f4] text-[#006a6a] font-sans text-[10px] font-bold border border-[#006a6a]/20">
                  5 Patterns
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#fbfdfa] flex items-start justify-between gap-3 border border-[#c9d8be]/40">
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-[#111f09] text-sm">Saturday</span>
                  <span className="font-serif text-xs text-[#414a38]">
                    QuickSelect, Interval Merge
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#f0f8ec] text-[#414a38] font-sans text-[10px] font-bold border border-[#c9d8be]/50">
                  2 Patterns
                </span>
              </div>
            </div>
          </section>

          {/* 3. Recent Activity Log */}
          <section className="rounded-xl bg-white p-5 shadow-xs border border-[#c9d8be]/60">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#c9d8be]/30">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#326b00] text-[20px]">
                    history_toggle_off
                  </span>
                  <h2 className="font-serif text-2xl text-[#111f09] font-bold">Recent Activity Log</h2>
                </div>
                <p className="font-sans text-[10px] text-[#414a38] uppercase tracking-widest">
                  Live audit trail of algorithmic revisions
                </p>
              </div>
              <span className="material-symbols-outlined text-[#717a67] text-[18px]">tune</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#fbfdfa] text-xs border border-[#c9d8be]/40">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#77c73d] flex-shrink-0"></span>
                  <div className="truncate">
                    <div className="font-serif font-bold text-[#111f09] truncate text-sm">Tree BFS</div>
                    <div className="font-sans text-[10px] text-[#414a38]">next interval: 14d</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 text-right">
                  <span className="px-1.5 py-0.5 rounded bg-[#77c73d]/20 text-[#255200] font-sans text-[10px] uppercase font-bold border border-[#77c73d]/40">
                    Easy (+6%)
                  </span>
                  <span className="font-sans text-[10px] text-[#717a67]">2h ago</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#fbfdfa] text-xs border border-[#c9d8be]/40">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#286290] flex-shrink-0"></span>
                  <div className="truncate">
                    <div className="font-serif font-bold text-[#111f09] truncate text-sm">
                      Linked List Reversal
                    </div>
                    <div className="font-sans text-[10px] text-[#414a38]">next interval: 7d</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 text-right">
                  <span className="px-1.5 py-0.5 rounded bg-[#cee5ff] text-[#004a76] font-sans text-[10px] uppercase font-bold border border-[#286290]/30">
                    Good (+3%)
                  </span>
                  <span className="font-sans text-[10px] text-[#717a67]">5h ago</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#fff8f7] text-xs border border-[#ba1a1a]/30">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a] flex-shrink-0"></span>
                  <div className="truncate">
                    <div className="font-serif font-bold text-[#111f09] truncate text-sm">
                      Subsets Backtracking
                    </div>
                    <div className="font-sans text-[10px] text-[#414a38]">reset interval to 3d</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 text-right">
                  <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] font-sans text-[10px] uppercase font-bold border border-[#ba1a1a]/30">
                    Struggled
                  </span>
                  <span className="font-sans text-[10px] text-[#717a67]">Yesterday</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#fbfdfa] text-xs border border-[#c9d8be]/40">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#77c73d] flex-shrink-0"></span>
                  <div className="truncate">
                    <div className="font-serif font-bold text-[#111f09] truncate text-sm">Two Pointers</div>
                    <div className="font-sans text-[10px] text-[#414a38]">extended interval: 30d</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 text-right">
                  <span className="px-1.5 py-0.5 rounded bg-[#77c73d]/20 text-[#255200] font-sans text-[10px] uppercase font-bold border border-[#77c73d]/40">
                    Easy
                  </span>
                  <span className="font-sans text-[10px] text-[#717a67]">Yesterday</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
