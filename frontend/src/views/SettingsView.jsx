import React, { useState } from 'react';

export const SettingsView = () => {
  const [dailyQuota, setDailyQuota] = useState(6);
  const [targetMastery, setTargetMastery] = useState(85);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-6 pt-2 max-w-3xl">
      <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/60 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#326b00]">settings</span>
            <h1 className="font-serif text-3xl font-bold text-[#111f09]">Settings &amp; Parameters</h1>
          </div>
          <p className="font-serif text-sm text-[#414a38] mt-1">
            Configure Leitner spaced repetition intervals, mastery ceilings, and daily recall batches.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#c9d8be]/60 shadow-xs space-y-6 font-serif">
        <div>
          <h2 className="text-lg font-bold text-[#111f09] mb-1">Daily Review Batch Limit</h2>
          <p className="text-xs text-[#526b3e] mb-3">
            Maximum number of prioritized patterns queued for revision each calendar morning.
          </p>
          <input
            type="number"
            min={1}
            max={20}
            value={dailyQuota}
            onChange={(e) => setDailyQuota(Number(e.target.value))}
            className="w-32 p-2 border border-[#c9d8be] rounded-lg bg-[#f5fbf1] text-sm"
          />
        </div>

        <div className="pt-4 border-t border-[#c9d8be]/40">
          <h2 className="text-lg font-bold text-[#111f09] mb-1">Target Mastery Threshold</h2>
          <p className="text-xs text-[#526b3e] mb-3">
            Score percentage at which an algorithmic pattern qualifies for the 30-Day Mastered tier.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={60}
              max={95}
              value={targetMastery}
              onChange={(e) => setTargetMastery(Number(e.target.value))}
              className="w-64 accent-[#77c73d]"
            />
            <span className="font-mono text-sm font-bold text-[#326b00]">{targetMastery}%</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#c9d8be]/40 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111f09]">Auto-advance Cycle on Enter Key</h2>
            <p className="text-xs text-[#526b3e]">
              Enables keyboard-only speed recall sessions using hotkeys [1, 2, 3, 4] and [Enter].
            </p>
          </div>
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={(e) => setAutoAdvance(e.target.checked)}
            className="w-5 h-5 accent-[#77c73d] rounded cursor-pointer"
          />
        </div>

        <div className="pt-4 border-t border-[#c9d8be]/40 flex items-center justify-between">
          <span className="text-xs text-[#255400] font-sans">
            {savedNotice ? '✓ Settings preserved in local session storage' : ''}
          </span>
          <button
            onClick={handleSave}
            type="button"
            className="px-5 py-2 bg-[#77c73d] text-[#112600] font-bold text-xs rounded-lg hover:bg-[#86d949] transition-colors shadow-xs border border-[#64b02d]"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
