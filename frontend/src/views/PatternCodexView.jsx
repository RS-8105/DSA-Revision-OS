import React, { useState } from 'react';

export const PatternCodexView = ({
  pattern,
  onStartRevision,
  onBackToLibrary,
  onUpdatePattern,
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [mentalModelNotes, setMentalModelNotes] = useState(pattern?.whenToUse || '');
  const [isAddingProblem, setIsAddingProblem] = useState(false);
  const [newProbTitle, setNewProbTitle] = useState('');
  const [newProbNum, setNewProbNum] = useState('');
  const [newProbDiff, setNewProbDiff] = useState('Medium');

  if (!pattern) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-[#c9d8be]/70 shadow-xs my-6">
        <span className="material-symbols-outlined text-[48px] text-[#526b3e] mb-2">menu_book</span>
        <h3 className="font-serif font-bold text-lg text-[#111f09] mb-1">No Pattern Selected</h3>
        <p className="font-serif text-sm text-[#526b3e] mb-4">Please select a pattern from the library to view its codex and problems.</p>
        <button
          onClick={onBackToLibrary}
          className="px-4 py-2 bg-[#77c73d] hover:bg-[#89db4f] text-[#173800] font-serif font-bold text-xs rounded-lg transition-all"
        >
          Return to Pattern Library
        </button>
      </div>
    );
  }

  const historyList = pattern.history || [];
  const latestSession = historyList[0];
  const deltaText = latestSession?.scoreDelta || (pattern.sessionsCount > 0 ? 'Active' : '—');

  const handleSaveNotes = () => {
    onUpdatePattern({
      ...pattern,
      whenToUse: mentalModelNotes,
    });
    setIsEditingNotes(false);
  };

  const handleAddProblem = (e) => {
    e.preventDefault();
    if (!newProbTitle) return;
    const newProb = {
      id: `p-${Date.now()}`,
      number: newProbNum ? `#${newProbNum.replace('#', '').padStart(4, '0')}` : '#0000',
      title: newProbTitle,
      difficulty: newProbDiff,
      confidence: '3/5',
      platform: 'LeetCode',
      status: 'Needs Review',
    };
    onUpdatePattern({
      ...pattern,
      problems: [...pattern.problems, newProb],
    });
    setNewProbTitle('');
    setNewProbNum('');
    setIsAddingProblem(false);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-6 pt-2">
      {/* Breadcrumb & Top Command Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#c9d8be]/50 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-widest text-[#526b3e]">
            <button
              onClick={onBackToLibrary}
              className="hover:text-[#326b00] transition-colors"
            >
              Pattern Library
            </button>
            <span className="text-[#c9d8be]">/</span>
            <span className="hover:text-[#326b00] transition-colors">
              {pattern.category}
            </span>
            <span className="text-[#c9d8be]">/</span>
            <span className="text-[#326b00] font-bold">{pattern.name}</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="font-serif text-3xl lg:text-4xl text-[#111f09] tracking-wide uppercase font-bold">
              {pattern.name}
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-[10px] uppercase px-2 py-0.5 rounded-lg bg-[#eef7e8] text-[#111f09] tracking-wider font-semibold border border-[#c9d8be]/60">
                {pattern.category}
              </span>
              <span className="font-sans text-[10px] uppercase px-2 py-0.5 rounded-lg bg-[#8adddd]/40 text-[#006a6a] tracking-wider font-bold border border-[#8adddd]">
                {pattern.masteryLevel}
              </span>
              <span className="font-sans text-[10px] uppercase px-2 py-0.5 rounded-lg bg-[#f0f8ec] text-[#414a38] tracking-wider font-semibold border border-[#c9d8be]/40">
                {pattern.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onStartRevision(pattern.id)}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#326b00] text-white font-serif font-bold text-sm rounded-lg shadow-sm hover:bg-[#255200] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">play_circle</span>
            <span>Start Focused Revision Session</span>
          </button>
          <button
            onClick={() => setIsEditingNotes(!isEditingNotes)}
            type="button"
            className="flex items-center gap-1 px-3 py-2 bg-[#f5fbf1] text-[#111f09] border border-[#c9d8be]/60 font-serif font-bold text-xs rounded-lg hover:bg-[#eef7e8] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#326b00]">
              edit_note
            </span>
            <span>{isEditingNotes ? 'Close Editor' : 'Edit Notes'}</span>
          </button>
          <button
            onClick={() => setIsAddingProblem(!isAddingProblem)}
            type="button"
            className="flex items-center gap-1 px-3 py-2 bg-[#f5fbf1] text-[#111f09] border border-[#c9d8be]/60 font-serif font-bold text-xs rounded-lg hover:bg-[#eef7e8] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#326b00]">
              add_circle
            </span>
            <span>Add Problem</span>
          </button>
          <button
            aria-label="Share Pattern"
            type="button"
            className="p-2 bg-[#f5fbf1] border border-[#c9d8be]/60 text-[#526b3e] hover:text-[#111f09] rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
        </div>
      </div>

      {/* Quick Telemetry Ribbon (5 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-[#c9d8be]/50 shadow-xs flex flex-col justify-between">
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e]">
            Mastery Index
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif text-3xl text-[#326b00] font-bold">
              {pattern.mastery}%
            </span>
            <span className="font-sans text-[10px] text-[#326b00] font-bold">
              {latestSession?.scoreDelta ? `▲ ${latestSession.scoreDelta}` : (pattern.sessionsCount > 0 ? '▲ Active' : '—')}
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#c9d8be]/50 shadow-xs flex flex-col justify-between">
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e]">
            Spaced Interval
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif text-2xl text-[#006a6a] font-bold">
              Stage {pattern.spacedStage}
            </span>
            <span className="font-sans text-[10px] text-[#526b3e]">{pattern.activeInterval} Step</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#c9d8be]/50 shadow-xs flex flex-col justify-between">
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e]">
            Last Revised
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif text-2xl text-[#111f09] font-bold">
              {pattern.lastRevised}
            </span>
            <span className="font-sans text-[10px] text-[#526b3e]">
              {pattern.lastRevisedDaysAgo}
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#77c73d]/40 shadow-xs flex flex-col justify-between bg-gradient-to-br from-white via-[#f5fbf1] to-[#77c73d]/15">
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#326b00] font-bold">
            Next Target
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif text-2xl text-[#326b00] font-bold">
              {pattern.nextTarget}
            </span>
            <span className="font-sans text-[10px] text-[#526b3e] font-medium">
              {pattern.nextTargetDate}
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#c9d8be]/50 shadow-xs flex flex-col justify-between col-span-2 md:col-span-1">
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e]">
            Total Cadence
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif text-2xl text-[#111f09] font-bold">
              {pattern.sessionsCount}
            </span>
            <span className="font-sans text-[10px] text-[#526b3e]">Sessions</span>
          </div>
        </div>
      </div>

      {/* Inline Problem Creation Modal/Banner */}
      {isAddingProblem && (
        <form onSubmit={handleAddProblem} className="bg-white p-4 rounded-xl border border-[#77c73d] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-sm text-[#326b00]">Add New Benchmark Practice Problem</span>
            <button type="button" onClick={() => setIsAddingProblem(false)} className="text-xs text-[#526b3e]">Cancel</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="LC Number (e.g. 0003)"
              value={newProbNum}
              onChange={(e) => setNewProbNum(e.target.value)}
              className="p-2 border border-[#c9d8be] rounded text-xs font-serif bg-[#f5fbf1]"
            />
            <input
              type="text"
              placeholder="Problem Title"
              required
              value={newProbTitle}
              onChange={(e) => setNewProbTitle(e.target.value)}
              className="p-2 border border-[#c9d8be] rounded text-xs font-serif bg-[#f5fbf1]"
            />
            <select
              value={newProbDiff}
              onChange={(e) => setNewProbDiff(e.target.value)}
              className="p-2 border border-[#c9d8be] rounded text-xs font-serif bg-[#f5fbf1]"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <button type="submit" className="self-end px-3 py-1.5 bg-[#77c73d] text-[#112600] font-serif font-bold text-xs rounded">
            Save Problem
          </button>
        </form>
      )}

      {/* Primary Workspace: Two-Tier Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Mastery Telemetry, Retention Decay, & Revision History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section: Mastery & Retention Curve */}
          <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/50 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#326b00] text-[20px]">
                  psychology
                </span>
                <span className="font-serif text-lg uppercase tracking-wider text-[#111f09] font-bold">
                  Retention Vector
                </span>
              </div>
              <span className="font-sans text-[10px] uppercase px-1.5 py-0.5 bg-[#326b00]/10 text-[#326b00] border border-[#326b00]/20 rounded font-semibold">
                Ebbinghaus Curve
              </span>
            </div>

            {/* Metric Display & Sparkline */}
            <div className="bg-[#f5fbf1] border border-[#c9d8be]/40 p-4 rounded-lg space-y-2">
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-sans text-[10px] uppercase text-[#526b3e]">
                    Current Recall Score
                  </div>
                  <div className="font-serif text-4xl text-[#326b00] tracking-tight leading-none font-bold">
                    {pattern.mastery}%
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-sans text-[11px] text-[#326b00] block font-bold">
                    {deltaText}
                  </span>
                  <span className="font-sans text-[10px] text-[#526b3e]">
                    Optimal Trigger: {pattern.nextTargetDate || pattern.nextTarget || 'Scheduled'}
                  </span>
                </div>
              </div>

              {/* Retention Curve Visualization */}
              <div className="w-full pt-2">
                <svg className="w-full h-24 overflow-visible" fill="none" viewBox="0 0 320 80">
                  <line
                    className="text-[#60784f]/40"
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                    x1="0"
                    x2="320"
                    y1="60"
                    y2="60"
                  ></line>
                  <text className="font-sans fill-[#526b3e]" fontSize="8" x="5" y="56">
                    FORGETTING THRESHOLD (60%)
                  </text>
                  <path
                    className="text-[#77c73d]/25"
                    d="M 0 15 C 60 16, 90 28, 140 40 C 190 52, 230 48, 280 44 L 320 62 L 320 80 L 0 80 Z"
                    fill="currentColor"
                  ></path>
                  <path
                    className="text-[#326b00]"
                    d="M 0 15 C 60 16, 90 28, 140 40 C 190 52, 230 48, 280 44 L 320 62"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  ></path>
                  <circle className="fill-[#326b00]" cx="0" cy="15" r="3.5"></circle>
                  <circle className="fill-[#326b00]" cx="100" cy="30" r="3.5"></circle>
                  <circle className="fill-[#326b00]" cx="210" cy="46" r="3.5"></circle>
                  <circle
                    className="fill-[#006a6a] stroke-white stroke-2"
                    cx="280"
                    cy="44"
                    r="5"
                  ></circle>
                  <text
                    className="font-sans font-bold"
                    fill="#006a6a"
                    fontSize="8"
                    fontWeight="700"
                    x="235"
                    y="38"
                  >
                    {pattern.isDueToday ? 'DUE TODAY' : pattern.isOverdue ? 'OVERDUE' : (pattern.nextTarget || 'SCHEDULED')}
                  </text>
                </svg>
              </div>
            </div>

            {/* Dynamic Interval Ladder */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-[#526b3e] font-sans text-[10px] uppercase tracking-wider">
                <span>Interval Horizon</span>
                <span>Target: 30D (Mastery)</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {['1D', '3D', '7D', '14D', '30D'].map((step, idx) => {
                  const stepStage = idx + 1;
                  const isCurrent =
                    (pattern.activeInterval || '').toUpperCase().startsWith(step.toLowerCase()) ||
                    (pattern.ladderInterval || '').toUpperCase() === step ||
                    pattern.spacedStage === stepStage;
                  const isCompleted = (pattern.spacedStage || 1) > stepStage;

                  return (
                    <div
                      key={step}
                      className={`p-1.5 rounded text-center border ${
                        isCurrent
                          ? 'bg-[#8adddd]/30 border-[#006a6a]/40 text-[#006a6a]'
                          : isCompleted
                          ? 'bg-[#eef7e8] border-[#c9d8be]/30 text-[#006a6a]'
                          : 'bg-[#eef7e8]/50 border-[#c9d8be]/20 opacity-60 text-[#526b3e]'
                      }`}
                    >
                      <span className="font-sans text-[10px] font-bold block">{step}</span>
                      {isCurrent ? (
                        <span className="font-sans text-[10px] text-[#006a6a] font-bold">Active</span>
                      ) : isCompleted ? (
                        <span className="material-symbols-outlined text-[14px] text-[#006a6a] font-bold">check</span>
                      ) : (
                        <span className="font-sans text-[10px] text-[#526b3e]">
                          {stepStage === (pattern.spacedStage || 1) + 1 ? 'Next' : 'Goal'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decay Warning */}
            <div className="bg-[#f5fbf1] border border-[#006a6a]/20 p-3.5 rounded-lg flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#006a6a] text-[20px] flex-shrink-0 mt-0.5">
                timer
              </span>
              <div className="space-y-0.5">
                <div className="font-serif font-bold text-[#111f09] text-xs uppercase tracking-wider">
                  Critical Retention Window
                </div>
                <p className="font-serif text-[#414a38] text-xs leading-relaxed">
                  Recall confidence is entering optimal recall window. Revising today prevents
                  forgetting curve drop and locks in Stage 5 progression.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Chronological Revision History */}
          <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/50 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#526b3e] text-[20px]">
                  history_toggle_off
                </span>
                <span className="font-serif text-lg uppercase tracking-wider text-[#111f09] font-bold">
                  Audit Ledger
                </span>
                           <span className="font-sans text-[10px] text-[#526b3e] font-semibold">
                {historyList.length} Logged Sessions
              </span>
            </div>

            {/* Table */}
            {historyList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-serif text-xs">
                  <thead>
                    <tr className="bg-[#f5fbf1] text-[#526b3e] font-sans text-[10px] uppercase tracking-wider border-b border-[#c9d8be]/40">
                      <th className="p-2 rounded-l-lg">Session</th>
                      <th className="p-2">Assessment</th>
                      <th className="p-2">Score</th>
                      <th className="p-2 rounded-r-lg">Interval &amp; Next</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c9d8be]/30">
                    {historyList.map((h, idx) => {
                      const rating = (h.assessment || h.confidence || 'Good').toLowerCase();
                      const isGood = rating === 'good';
                      const isEasy = rating === 'easy';
                      const isStruggled = rating === 'struggled';
                      return (
                        <tr key={h.id || idx} className="hover:bg-[#f5fbf1]/60 transition-colors">
                          <td className="p-2">
                            <div className="font-bold text-[#111f09]">Session {h.sessionNumber || (historyList.length - idx)}</div>
                            <div className="font-sans text-[10px] text-[#526b3e]">{h.date}</div>
                          </td>
                          <td className="p-2">
                            <span
                              className={`font-sans text-[9px] uppercase px-1.5 py-0.5 rounded font-semibold border ${
                                isGood
                                  ? 'bg-[#cee5ff] text-[#286290] border-[#286290]/30'
                                  : isEasy
                                  ? 'bg-[#77c73d]/20 text-[#255400] border-[#77c73d]/40'
                                  : isStruggled
                                  ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/20'
                                  : 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/20'
                              }`}
                            >
                              {h.assessment || h.confidence}
                            </span>
                          </td>
                          <td className="p-2">
                            <div className="font-bold text-[#326b00]">{h.score}%</div>
                            <div className="font-sans text-[10px] text-[#326b00] font-semibold">
                              {h.scoreDelta}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="text-[#111f09]">{h.interval}</div>
                            <div className="font-sans text-[10px] text-[#006a6a] font-bold">
                              {h.nextTarget}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[#f5fbf1] text-xs font-serif text-[#526b3e] text-center border border-[#c9d8be]/50">
                No revision sessions recorded yet for this pattern. Complete a session to begin your audit ledger.
              </div>
            )}  </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Knowledge Repository & Curated Problems */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section: Mental Model & Academic Notes */}
          <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/50 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006a6a] text-[20px]">
                  menu_book
                </span>
                <span className="font-serif text-lg uppercase tracking-wider text-[#111f09] font-bold">
                  Codex Mental Model
                </span>
              </div>
              <span className="font-sans text-[10px] uppercase px-1.5 py-0.5 bg-[#eef7e8] text-[#414a38] border border-[#c9d8be]/30 rounded font-semibold">
                Markdown Synthesized
              </span>
            </div>

            <div className="space-y-3">
              {/* When to Use */}
              <div className="bg-[#f5fbf1] border border-[#c9d8be]/30 p-3.5 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-[#326b00] font-serif text-base font-bold">
                  <span className="material-symbols-outlined text-[16px]">target</span>
                  <span>When to Use</span>
                </div>
                {isEditingNotes ? (
                  <div className="space-y-2 mt-2">
                    <textarea
                      rows={3}
                      value={mentalModelNotes}
                      onChange={(e) => setMentalModelNotes(e.target.value)}
                      className="w-full p-2 border border-[#77c73d] rounded text-sm font-serif bg-white"
                    />
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 py-1 bg-[#77c73d] text-[#112600] font-bold text-xs rounded"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <p className="font-serif text-[#414a38] text-sm leading-relaxed">
                    {pattern.whenToUse}
                  </p>
                )}
              </div>

              {/* Recognition Clues */}
              <div className="bg-[#f5fbf1] border border-[#c9d8be]/30 p-3.5 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-[#006a6a] font-serif text-base font-bold">
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>Recognition Clues &amp; Invariants</span>
                </div>
                <ul className="space-y-1 font-serif text-[#414a38] text-sm list-none">
                  {pattern.recognitionClues.map((clue, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006a6a] mt-1 flex-shrink-0">
                        arrow_right
                      </span>
                      <span>{clue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gotchas & Edge Cases */}
              <div className="bg-[#f5fbf1] border border-[#c9d8be]/30 p-3.5 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-[#ba1a1a] font-serif text-base font-bold">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  <span>Common Gotchas &amp; Edge Cases</span>
                </div>
                <p className="font-serif text-[#414a38] text-sm leading-relaxed">
                  {pattern.commonGotchas}
                </p>
              </div>

              {/* Complexity Matrix Block */}
              <div className="bg-[#eef7e8] p-3.5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border border-[#c9d8be]/30">
                <div>
                  <div className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e]">
                    Asymptotic Bound
                  </div>
                  <div className="font-serif font-bold text-[#111f09] text-sm">
                    Time Complexity:{' '}
                    <span className="text-[#326b00] font-mono font-bold">
                      {pattern.complexityTime}
                    </span>
                  </div>
                </div>
                <div className="md:text-right">
                  <div className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e]">
                    Memory Overhead
                  </div>
                  <div className="font-serif font-bold text-[#111f09] text-sm">
                    Space Complexity:{' '}
                    <span className="text-[#006a6a] font-mono font-bold">
                      {pattern.complexitySpace}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Curated Practice Problems */}
          <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/50 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#326b00] text-[20px]">
                  checklist
                </span>
                <span className="font-serif text-lg uppercase tracking-wider text-[#111f09] font-bold">
                  Curated Practice Suite
                </span>
              </div>
              <span className="font-sans text-[10px] text-[#526b3e] uppercase tracking-wider font-semibold">
                {pattern.problems.length} Benchmarks
              </span>
            </div>

            <div className="space-y-2">
              {pattern.problems.map((prob) => {
                const isMastered = prob.status === 'Mastered';
                const isNeedsReview = prob.status === 'Needs Review';

                return (
                  <div
                    key={prob.id}
                    className="bg-[#f9fdf7] hover:bg-[#f0f8ec] border border-[#c9d8be]/30 transition-colors p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`material-symbols-outlined text-[20px] mt-0.5 ${
                          isMastered
                            ? 'text-[#326b00]'
                            : isNeedsReview
                            ? 'text-[#ba1a1a]'
                            : 'text-[#286290]'
                        }`}
                      >
                        {isMastered
                          ? 'check_circle'
                          : isNeedsReview
                          ? 'radio_button_unchecked'
                          : 'pending'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-[#111f09] text-sm">
                            {prob.title}
                          </span>
                          <span className="font-sans text-[10px] text-[#526b3e]">
                            {prob.number}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#414a38] font-serif mt-0.5">
                          <span
                            className={`font-sans text-[9px] px-1 py-0.5 rounded font-bold ${
                              prob.difficulty === 'Easy'
                                ? 'bg-[#77c73d]/20 text-[#255400]'
                                : prob.difficulty === 'Medium'
                                ? 'bg-[#8adddd]/40 text-[#006a6a]'
                                : 'bg-[#ffdad6] text-[#ba1a1a]'
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                          <span>
                            Confidence: <strong className="font-bold">{prob.confidence}</strong>
                          </span>
                          <span className="text-[#c9d8be]">·</span>
                          <span className="text-[#526b3e]">{prob.platform}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span
                        className={`font-sans text-[10px] uppercase px-2.5 py-1 font-bold rounded border ${
                          isMastered
                            ? 'bg-[#326b00]/10 text-[#326b00] border-[#326b00]/20'
                            : isNeedsReview
                            ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/20'
                            : 'bg-[#8adddd]/30 text-[#006a6a] border-[#006a6a]/20'
                        }`}
                      >
                        {prob.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
