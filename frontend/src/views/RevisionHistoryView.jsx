import React, { useState, useMemo } from 'react';

export const RevisionHistoryView = ({
  patterns = [],
  revisionHistory = [],
  onOpenCodex,
}) => {
  const [filterRating, setFilterRating] = useState('all');

  const allLogs = useMemo(() => {
    if (revisionHistory && revisionHistory.length > 0) {
      return revisionHistory.map((h, idx) => {
        const pat = patterns.find(
          (p) =>
            p.backendId === h.patternId ||
            p.id === String(h.patternId) ||
            p.name?.toLowerCase() === h.patternName?.toLowerCase()
        );

        const rating = (h.confidence || h.assessment || 'Good').trim();
        const normalizedRating =
          rating.charAt(0).toUpperCase() + rating.slice(1).toLowerCase();

        const dateStr = h.revisionDate
          ? new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date(h.revisionDate))
          : h.date || 'Today';

        const scoreDelta =
          h.scoreDelta ||
          (normalizedRating === 'Easy'
            ? '+12%'
            : normalizedRating === 'Good'
            ? '+6%'
            : normalizedRating === 'Struggled'
            ? '0%'
            : '-10%');

        return {
          id: h.id || `hist-${idx}`,
          patternId: pat?.id || (h.patternId ? String(h.patternId) : null),
          patternName: h.patternName || pat?.name || 'Algorithmic Pattern',
          patternCategory: h.patternCategory || pat?.category || 'General',
          date: dateStr,
          rawDate: h.revisionDate || h.date,
          assessment: normalizedRating,
          scoreDelta,
          interval: h.interval || pat?.activeInterval || '1d',
          notes: h.notes || '—',
        };
      });
    }

    // Fallback to pattern-level local history
    return patterns.flatMap((p) =>
      (p.history || []).map((h) => ({
        ...h,
        patternId: p.id,
        patternName: p.name,
        patternCategory: p.category,
      }))
    );
  }, [patterns, revisionHistory]);

  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      if (filterRating === 'all') return true;
      return log.assessment.toLowerCase() === filterRating.toLowerCase();
    });
  }, [allLogs, filterRating]);

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
        <div className="flex items-center gap-3">
          <span className="font-sans text-[11px] text-[#526b3e] font-semibold">
            {filteredLogs.length} Sessions Logged
          </span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="bg-[#f5fbf1] border border-[#c9d8be] text-[#111f09] text-xs font-serif p-2 rounded-lg cursor-pointer"
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
        {filteredLogs.length > 0 ? (
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
                {filteredLogs.map((log) => {
                  const rating = log.assessment.toLowerCase();
                  const isEasy = rating === 'easy';
                  const isGood = rating === 'good';
                  const isStruggled = rating === 'struggled';

                  return (
                    <tr key={`${log.patternId || 'p'}-${log.id}`} className="hover:bg-[#f5fbf1]/60 transition-colors">
                      <td className="p-3">
                        {log.patternId ? (
                          <button
                            onClick={() => onOpenCodex(log.patternId)}
                            className="font-bold text-[#111f09] hover:text-[#326b00] text-left cursor-pointer"
                          >
                            {log.patternName}
                          </button>
                        ) : (
                          <span className="font-bold text-[#111f09]">{log.patternName}</span>
                        )}
                      </td>
                      <td className="p-3 text-[#526b3e]">{log.patternCategory}</td>
                      <td className="p-3 text-[#111f09]">{log.date}</td>
                      <td className="p-3">
                        <span
                          className={`font-sans text-[9px] uppercase px-1.5 py-0.5 rounded font-bold border ${
                            isGood
                              ? 'bg-[#cee5ff] text-[#286290] border-[#286290]/30'
                              : isEasy
                              ? 'bg-[#77c73d]/20 text-[#255400] border-[#77c73d]/40'
                              : isStruggled
                              ? 'bg-[#ffe0b2] text-[#b26a00] border-[#b26a00]/30'
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
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-[#f5fbf1] rounded-xl border border-dashed border-[#c9d8be]/70 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-[#526b3e]">history</span>
            <span className="font-serif font-bold text-base text-[#111f09]">No Revision History Recorded</span>
            <p className="font-serif text-xs text-[#526b3e] max-w-sm">
              Sessions logged via Quick Log, the revision queue, or custom reviews will populate this audit ledger with real intervals and ratings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

