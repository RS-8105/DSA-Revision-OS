import React, { useState } from 'react';
import { Pattern } from '../types';

interface RevisionHistoryViewProps {
  patterns: Pattern[];
  onOpenCodex: (patternId: string) => void;
}

export const RevisionHistoryView: React.FC<RevisionHistoryViewProps> = ({
  patterns,
  onOpenCodex,
}) => {
  const [filterRating, setFilterRating] = useState('all');

  // Flatten all history sessions
  const allLogs = patterns.flatMap((p) =>
    p.history.map((h) => ({
      ...h,
      patternId: p.id,
      patternName: p.name,
      patternCategory: p.category,
    }))
  );

  const filteredLogs = allLogs.filter((log) => {
    if (filterRating === 'all') return true;
    return log.assessment.toLowerCase() === filterRating.toLowerCase();
  });

  return (
    <div className="flex flex-col w-full pb-16 space-y-6 pt-2">
      <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#326b00]">history</span>
            <h1 className="font-serif text-3xl font-bold text-[#111f09]">Revision History</h1>
          </div>
          <p className="font-serif text-sm text-[#414a38] mt-1">
            Complete audit ledger of algorithmic recall attempts, score adjustments, and interval shifts.
          </p>
        </div>
        <div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="bg-[#f5fbf1] border border-[#c9d8be] text-[#111f09] text-xs font-serif p-2 rounded-lg"
          >
            <option value="all">All Assessments</option>
            <option value="easy">Easy</option>
            <option value="good">Good</option>
            <option value="struggled">Struggled</option>
            <option value="forgot">Forgot</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/60 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-serif text-xs">
            <thead>
              <tr className="bg-[#f5fbf1] text-[#526b3e] font-sans text-[10px] uppercase tracking-wider border-b border-[#c9d8be]/40">
                <th className="p-3">Pattern</th>
                <th className="p-3">Category</th>
                <th className="p-3">Session Date</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Score Delta</th>
                <th className="p-3">New Interval</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9d8be]/30">
              {filteredLogs.map((log) => (
                <tr key={`${log.patternId}-${log.id}`} className="hover:bg-[#f5fbf1]/60 transition-colors">
                  <td className="p-3">
                    <button
                      onClick={() => onOpenCodex(log.patternId)}
                      className="font-bold text-[#111f09] hover:text-[#326b00] text-left"
                    >
                      {log.patternName}
                    </button>
                  </td>
                  <td className="p-3 text-[#526b3e]">{log.patternCategory}</td>
                  <td className="p-3 text-[#111f09]">{log.date}</td>
                  <td className="p-3">
                    <span
                      className={`font-sans text-[9px] uppercase px-1.5 py-0.5 rounded font-bold border ${
                        log.assessment === 'Good'
                          ? 'bg-[#cee5ff] text-[#286290] border-[#286290]/30'
                          : log.assessment === 'Easy'
                          ? 'bg-[#77c73d]/20 text-[#255400] border-[#77c73d]/40'
                          : 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/20'
                      }`}
                    >
                      {log.assessment}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-[#326b00]">{log.scoreDelta}</td>
                  <td className="p-3">{log.interval}</td>
                  <td className="p-3 text-[#526b3e] max-w-xs truncate">{log.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
