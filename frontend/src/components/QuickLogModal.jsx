import React, { useState } from 'react';

export const QuickLogModal = ({
  isOpen,
  onClose,
  patterns,
  onSaveLog,
}) => {
  const [selectedPatternId, setSelectedPatternId] = useState(patterns[0]?.id || '');
  const [assessment, setAssessment] = useState('Good');
  const [notes, setNotes] = useState('');

  const activePatternId = selectedPatternId || patterns[0]?.id || '';

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activePatternId) return;
    onSaveLog(activePatternId, assessment, notes);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-[#c9d8be] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-[#c9d8be]/60 flex items-center justify-between bg-[#f5fbf1]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#326b00]">edit_calendar</span>
            <h3 className="font-serif font-bold text-lg text-[#111f09]">Log Custom Revision</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#526b3e] hover:text-[#111f09] p-1 rounded hover:bg-[#eef7e8]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-[#526b3e] font-semibold mb-1">
              Select Algorithmic Pattern
            </label>
            <select
              value={selectedPatternId}
              onChange={(e) => setSelectedPatternId(e.target.value)}
              className="w-full bg-[#f5fbf1] border border-[#c9d8be] rounded-lg p-2 text-sm font-serif text-[#111f09] focus:outline-none focus:border-[#77c73d]"
            >
              {patterns.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category}) · {p.mastery}%
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-[#526b3e] font-semibold mb-1">
              Spaced Repetition Assessment
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setAssessment('Forgot')}
                className={`p-2 rounded-lg text-center border transition-all text-xs font-serif ${
                  assessment === 'Forgot'
                    ? 'bg-[#ffdad6] border-[#ba1a1a] text-[#ba1a1a] font-bold'
                    : 'bg-[#f5fbf1] border-[#c9d8be] text-[#526b3e] hover:bg-[#fff2f0]'
                }`}
              >
                [1] Forgot
              </button>
              <button
                type="button"
                onClick={() => setAssessment('Struggled')}
                className={`p-2 rounded-lg text-center border transition-all text-xs font-serif ${
                  assessment === 'Struggled'
                    ? 'bg-[#cee5ff] border-[#286290] text-[#286290] font-bold'
                    : 'bg-[#f5fbf1] border-[#c9d8be] text-[#526b3e] hover:bg-[#f0f7fd]'
                }`}
              >
                [2] Struggled
              </button>
              <button
                type="button"
                onClick={() => setAssessment('Good')}
                className={`p-2 rounded-lg text-center border transition-all text-xs font-serif ${
                  assessment === 'Good'
                    ? 'bg-[#e6f3de] border-[#77c73d] text-[#255400] font-bold'
                    : 'bg-[#f5fbf1] border-[#c9d8be] text-[#526b3e] hover:bg-[#eef7e8]'
                }`}
              >
                [3] Good
              </button>
              <button
                type="button"
                onClick={() => setAssessment('Easy')}
                className={`p-2 rounded-lg text-center border transition-all text-xs font-serif ${
                  assessment === 'Easy'
                    ? 'bg-[#8adddd]/40 border-[#006a6a] text-[#006a6a] font-bold'
                    : 'bg-[#f5fbf1] border-[#c9d8be] text-[#526b3e] hover:bg-[#eafafa]'
                }`}
              >
                [4] Easy
              </button>
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-[#526b3e] font-semibold mb-1">
              Recall Notes &amp; Observations
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Practiced LC 76, recognized dynamic bounds immediately, verified monotonic deque invariant..."
              className="w-full bg-[#f5fbf1] border border-[#c9d8be] rounded-lg p-2 text-sm font-serif text-[#111f09] focus:outline-none focus:border-[#77c73d]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#c9d8be]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-[#c9d8be] text-xs font-serif hover:bg-[#eef7e8] text-[#526b3e]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#77c73d] text-[#112600] font-serif font-bold text-xs hover:bg-[#89db4f] transition-colors border border-[#64b02d]"
            >
              Save Repetition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
