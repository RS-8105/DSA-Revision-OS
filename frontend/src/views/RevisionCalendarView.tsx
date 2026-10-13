import React, { useState } from 'react';
import { Pattern } from '../types';

interface RevisionCalendarViewProps {
  patterns: Pattern[];
  onOpenCodex: (patternId: string) => void;
  onStartRevision: (patternId: string) => void;
}

export const RevisionCalendarView: React.FC<RevisionCalendarViewProps> = ({
  patterns,
  onOpenCodex,
  onStartRevision,
}) => {
  const [currentMonth] = useState('October 2026');

  // Days of month
  const calendarDays = [
    { day: 1, inMonth: true, patterns: [] },
    { day: 2, inMonth: true, patterns: [] },
    { day: 3, inMonth: true, patterns: ['Two Pointers'] },
    { day: 4, inMonth: true, patterns: [] },
    { day: 5, inMonth: true, patterns: [] },
    { day: 6, inMonth: true, patterns: ['Prefix Sum'] },
    { day: 7, inMonth: true, patterns: ['Sliding Window'] },
    { day: 8, inMonth: true, patterns: [] },
    { day: 9, inMonth: true, patterns: [] },
    { day: 10, inMonth: true, patterns: ['Linked List Reversal'] },
    { day: 11, inMonth: true, patterns: [] },
    { day: 12, inMonth: true, patterns: ['Two Pointers'] },
    { day: 13, inMonth: true, patterns: [] },
    { day: 14, inMonth: true, patterns: ['Sliding Window', 'Lowest Common Ancestor'] },
    { day: 15, inMonth: true, patterns: ['Fast & Slow Pointers'] },
    { day: 16, inMonth: true, patterns: ['Union Find'] },
    { day: 17, inMonth: true, patterns: ['Search on Answer'] },
    { day: 18, inMonth: true, patterns: ['Kadane\'s Algorithm', 'Monotonic Stack'] },
    { day: 19, inMonth: true, patterns: ['Dijkstra\'s Algorithm'] },
    { day: 20, inMonth: true, patterns: ['Tree DFS'] },
    { day: 21, inMonth: true, patterns: ['Sliding Window', '1D DP'] },
    { day: 22, inMonth: true, patterns: ['Knapsack DP'] },
    { day: 23, inMonth: true, patterns: ['Topological Sort', 'Linked List Reversal'] },
    { day: 24, inMonth: true, isToday: true, patterns: ['Sliding Window', 'Search on Answer', '1D DP', 'Monotonic Stack'] },
    { day: 25, inMonth: true, isFuture: true, patterns: ['Tree DFS', 'Union Find', 'Kadane\'s Algorithm'] },
    { day: 26, inMonth: true, isFuture: true, patterns: ['Lowest Common Ancestor', 'LIS'] },
    { day: 27, inMonth: true, isFuture: true, patterns: ['Prefix Sum', 'Subsets'] },
    { day: 28, inMonth: true, isFuture: true, patterns: [] },
    { day: 29, inMonth: true, isFuture: true, patterns: ['Tree BFS'] },
    { day: 30, inMonth: true, isFuture: true, patterns: [] },
    { day: 31, inMonth: true, isFuture: true, patterns: ['Two Pointers'] },
  ];

  return (
    <div className="flex flex-col w-full pb-16 space-y-6 pt-2">
      <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#326b00]">calendar_month</span>
            <h1 className="font-serif text-3xl font-bold text-[#111f09]">Revision Calendar</h1>
          </div>
          <p className="font-serif text-sm text-[#414a38] mt-1">
            Spaced repetition pipeline projected across the 30-day Leitner expansion horizon.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-base text-[#111f09] px-3 py-1 bg-[#eef7e8] rounded-lg border border-[#c9d8be]/50">
            {currentMonth}
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/60 shadow-xs">
        <div className="grid grid-cols-7 gap-2 text-center pb-3 border-b border-[#c9d8be]/40 font-sans text-xs uppercase font-bold text-[#526b3e]">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-3">
          {/* Pad beginning for month alignment */}
          <div className="h-28 p-2 rounded-lg bg-[#f5fbf1]/40 border border-dashed border-[#c9d8be]/30 opacity-40"></div>
          <div className="h-28 p-2 rounded-lg bg-[#f5fbf1]/40 border border-dashed border-[#c9d8be]/30 opacity-40"></div>
          <div className="h-28 p-2 rounded-lg bg-[#f5fbf1]/40 border border-dashed border-[#c9d8be]/30 opacity-40"></div>

          {calendarDays.map((cd) => (
            <div
              key={cd.day}
              className={`h-28 p-2 rounded-lg border flex flex-col justify-between transition-all ${
                cd.isToday
                  ? 'bg-[#eef7e8] border-[#77c73d] ring-2 ring-[#77c73d]/30'
                  : cd.patterns.length > 0
                  ? 'bg-white border-[#c9d8be]/70 hover:border-[#77c73d]'
                  : 'bg-[#fbfdfa] border-[#c9d8be]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-serif text-sm font-bold ${
                    cd.isToday
                      ? 'w-6 h-6 rounded-full bg-[#77c73d] text-[#112600] flex items-center justify-center font-bold'
                      : 'text-[#111f09]'
                  }`}
                >
                  {cd.day}
                </span>
                {cd.isToday && (
                  <span className="font-sans text-[9px] uppercase px-1 rounded bg-[#77c73d]/20 text-[#255400] font-bold">
                    Today
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 overflow-hidden my-1">
                {cd.patterns.slice(0, 2).map((p, idx) => (
                  <span
                    key={idx}
                    className="font-serif text-[11px] truncate px-1.5 py-0.5 rounded bg-[#f5fbf1] border border-[#c9d8be]/50 text-[#2d451b]"
                  >
                    {p}
                  </span>
                ))}
                {cd.patterns.length > 2 && (
                  <span className="font-sans text-[9px] text-[#526b3e] font-semibold">
                    +{cd.patterns.length - 2} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
