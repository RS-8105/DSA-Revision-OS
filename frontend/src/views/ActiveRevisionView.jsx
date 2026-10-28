import React, { useState, useEffect, useRef } from 'react';

export const ActiveRevisionView = ({
  pattern,
  patternsList,
  onExitSession,
  onAdvancePattern,
}) => {
  const [scratchpadText, setScratchpadText] = useState(pattern?.defaultRecallNote || '');
  const [isCodexRevealed, setIsCodexRevealed] = useState(false);
  const [selectedSRS, setSelectedSRS] = useState('Good');
  const [elapsedSeconds, setElapsedSeconds] = useState(222); // 03:42 initially
  const codexRef = useRef(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Keyboard orchestration
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is actively typing in the textarea
      if (document.activeElement?.tagName === 'TEXTAREA') {
        if (e.key === 'Tab') {
          e.preventDefault();
          setIsCodexRevealed((prev) => !prev);
        }
        return;
      }

      if (e.key === '1') setSelectedSRS('Forgot');
      if (e.key === '2') setSelectedSRS('Struggled');
      if (e.key === '3') setSelectedSRS('Good');
      if (e.key === '4') setSelectedSRS('Easy');
      if (e.key === ' ' || e.key === 'Tab') {
        e.preventDefault();
        setIsCodexRevealed((prev) => !prev);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (pattern?.id) {
          onAdvancePattern(pattern.id, selectedSRS, scratchpadText);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pattern?.id, selectedSRS, scratchpadText, onAdvancePattern]);

  const handleRevealClick = () => {
    setIsCodexRevealed(true);
    setTimeout(() => {
      codexRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const getProjection = () => {
    switch (selectedSRS) {
      case 'Forgot':
        return { interval: '1 Day', date: 'Wednesday, Oct 25', ladder: '1D', masteryDelta: '-10%' };
      case 'Struggled':
        return { interval: '3 Days', date: 'Friday, Oct 27', ladder: '3D', masteryDelta: '0%' };
      case 'Good':
        return { interval: '14 Days', date: 'Tuesday, Nov 07', ladder: '14D', masteryDelta: '+6%' };
      case 'Easy':
        return { interval: '30 Days', date: 'Wednesday, Nov 23', ladder: '30D', masteryDelta: '+12%' };
      default:
        return { interval: '14 Days', date: 'Tuesday, Nov 07', ladder: '14D', masteryDelta: '+6%' };
    }
  };

  if (!pattern) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-[#c9d8be]/70 shadow-xs my-6">
        <span className="material-symbols-outlined text-[48px] text-[#77c73d] mb-2">check_circle</span>
        <h3 className="font-serif font-bold text-xl text-[#111f09] mb-1">Queue Completed</h3>
        <p className="font-serif text-sm text-[#526b3e] mb-4">No patterns are currently pending revision in your queue.</p>
        <button
          onClick={onExitSession}
          className="px-4 py-2 bg-[#77c73d] hover:bg-[#89db4f] text-[#173800] font-serif font-bold text-xs rounded-lg transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const projection = getProjection();

  return (
    <div className="flex flex-col w-full pb-16 pt-2">
      {/* Session Status Header Ribbon */}
      <div className="relative w-full mb-6">
        <div className="bg-white border border-[#c9d8be]/70 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#77c73d] animate-pulse"></span>
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#255400] font-bold">
                Active Revision Cycle · Pattern 2 of 6
              </span>
              <span className="bg-[#eef7e8] border border-[#c9d8be]/60 text-[#2d451b] font-sans text-[10px] px-2 py-0.5 rounded font-semibold">
                Spaced Repetition Protocol
              </span>
            </div>
            <div className="flex items-center gap-2 font-serif text-xl text-[#111f09] flex-wrap">
              <span className="text-[#526b3e]">Today's Queue</span>
              <span className="material-symbols-outlined text-[16px] text-[#6f7d66]">
                chevron_right
              </span>
              <span className="font-serif text-2xl text-[#255400] font-bold">{pattern.name}</span>
              <span className="font-sans text-[10px] text-[#004f50] bg-[#8adddd]/30 border border-[#8adddd] px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                {pattern.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#eef7e8] px-3 py-1.5 rounded-lg text-[#526b3e] border border-[#c9d8be]/60">
              <span className="material-symbols-outlined text-[16px] text-[#326b00]">cloud_done</span>
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#2d451b] font-medium">
                Auto-saved 14s ago
              </span>
            </div>
            <button
              onClick={onExitSession}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eef7e8] hover:bg-[#e6f3de] text-[#111f09] border border-[#c9d8be] font-serif font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#526b3e]">logout</span>
              <span className="font-sans text-[10px] uppercase tracking-wider">Exit Session</span>
            </button>
          </div>
        </div>

        {/* Progress meter */}
        <div className="w-full bg-[#e6f3de] rounded-full h-1 mt-2 overflow-hidden border border-[#c9d8be]/40">
          <div className="bg-[#77c73d] h-full transition-all duration-500 ease-out" style={{ width: '33.33%' }}></div>
        </div>
        <div className="flex justify-between items-center mt-1 px-1 font-sans text-[10px] text-[#526b3e]">
          <span>Completed: 1 / 6 Patterns</span>
          <span className="text-[#255400] font-bold">33% Cycle Completion</span>
          <span>Estimated remaining: 14m</span>
        </div>
      </div>

      {/* Main Dual-Column Study Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Primary Active Recall & Codex Flow (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Step 1: Active Recall Challenge Card */}
          <div className="bg-white border border-[#c9d8be]/70 rounded-xl p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#77c73d] text-[#173800] font-sans text-xs flex items-center justify-center font-bold">
                  01
                </span>
                <span className="font-serif text-lg font-bold text-[#111f09]">
                  Step 1: Active Recall (Without looking at notes)
                </span>
              </div>
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#255400] px-2 py-0.5 bg-[#eef7e8] border border-[#c9d8be]/60 rounded font-semibold">
                Phase: Unassisted
              </span>
            </div>

            {/* Prompt Callout */}
            <div className="bg-[#eef7e8] border border-[#c9d8be]/60 p-4 rounded-lg flex gap-3">
              <span className="material-symbols-outlined text-[#326b00] text-[20px] flex-shrink-0 mt-0.5">
                psychology
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e] font-semibold">
                  Algorithmic Formulation Inquiry
                </span>
                <p className="font-serif text-[#111f09] leading-relaxed text-sm">
                  {pattern.inquiryPrompt}
                </p>
              </div>
            </div>

            {/* Input / Scratchpad Pane */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="scratchpad"
                  className="font-sans text-[11px] uppercase tracking-wider text-[#2d451b] flex items-center gap-1 font-semibold"
                >
                  <span className="material-symbols-outlined text-[14px]">edit_note</span>
                  Your Active Scratchpad &amp; Synthesized Recall
                </label>
                <div className="flex items-center gap-2 text-[#526b3e] font-sans text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">timer</span>
                    {formatTimer(elapsedSeconds)} elapsed
                  </span>
                  <span>·</span>
                  <span className="text-[#255400] font-semibold">
                    {scratchpadText.length} characters typed
                  </span>
                </div>
              </div>

              <div className="relative bg-white border border-[#c9d8be] rounded-lg p-3 focus-within:border-[#77c73d] focus-within:ring-2 focus-within:ring-[#77c73d]/20 transition-all">
                <textarea
                  id="scratchpad"
                  rows={5}
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  placeholder="Transcribe logic, boundaries, and pointer invariants here..."
                  className="w-full bg-transparent font-serif text-sm text-[#111f09] placeholder:text-[#6f7d66] focus:outline-none resize-y leading-relaxed"
                />
              </div>
            </div>

            {/* Reveal Toggle Trigger */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 font-sans text-[11px] text-[#526b3e]">
                <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                <span>Tip: Formulate pointer bounds precisely before revealing</span>
              </div>
              <button
                type="button"
                onClick={handleRevealClick}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#77c73d] text-[#112600] hover:bg-[#89db4f] font-serif font-bold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <span>{isCodexRevealed ? 'Codex Revealed' : 'Reveal Pattern Codex & Review Notes'}</span>
                <span className="material-symbols-outlined text-[16px]">
                  {isCodexRevealed ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>
          </div>

          {/* Step 2: Revealed Knowledge Verification (Ground Truth Matrix) */}
          <div
            ref={codexRef}
            className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden transition-all duration-300 ${
              isCodexRevealed
                ? 'border-[#77c73d] ring-2 ring-[#77c73d]/20 opacity-100'
                : 'border-[#c9d8be]/70 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#006a6a] text-white font-sans text-xs flex items-center justify-center font-bold">
                  02
                </span>
                <span className="font-serif text-lg font-bold text-[#111f09]">
                  Step 2: Canonical Codex &amp; Blueprint Verification
                </span>
              </div>
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#006a6a] px-2 py-0.5 bg-[#8adddd]/20 border border-[#8adddd]/60 rounded font-semibold">
                Ground Truth Matrix
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Formal Invariant */}
              <div className="bg-[#eef7e8] border border-[#c9d8be]/50 p-3.5 rounded-lg flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[#006a6a]">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span className="font-sans text-[10px] uppercase tracking-wider font-semibold">
                    Formal Invariant
                  </span>
                </div>
                <p className="font-serif text-xs text-[#111f09] leading-snug">
                  {pattern.formalInvariant}
                </p>
              </div>

              {/* Critical Traps */}
              <div className="bg-[#fff2f0] border border-[#ffdad6] p-3.5 rounded-lg flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[#ba1a1a]">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  <span className="font-sans text-[10px] uppercase tracking-wider font-semibold">
                    Critical Traps to Avoid
                  </span>
                </div>
                <p className="font-serif text-xs text-[#111f09] leading-snug">
                  {pattern.criticalTraps}
                </p>
              </div>
            </div>

            {/* Syntactic Implementation Blueprint */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e] flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">code</span>
                  Canonical {pattern.codeSnippet.language.toUpperCase()} Structure
                </span>
                <div className="flex items-center gap-2 font-sans text-[10px] text-[#526b3e]">
                  <span className="text-[#255400] font-bold">O(N) Time</span>
                  <span>·</span>
                  <span className="text-[#006a6a] font-bold">O(1) / O(K) Auxiliary Space</span>
                </div>
              </div>
              <div className="bg-[#f5fbf1] border border-[#c9d8be] p-3.5 rounded-lg overflow-x-auto text-[#111f09]">
                <pre className="font-mono text-xs leading-relaxed">
                  <code>{pattern.codeSnippet.code}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Step 3: Spaced Repetition Assessment Decision Matrix */}
          <div className="bg-white border border-[#c9d8be]/70 rounded-xl p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#326b00] text-white font-sans text-xs flex items-center justify-center font-bold">
                  03
                </span>
                <span className="font-serif text-lg font-bold text-[#111f09]">
                  Step 3: Self-Assessment — How well did you remember this pattern?
                </span>
              </div>
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e] font-semibold">
                Keys [1, 2, 3, 4]
              </span>
            </div>

            {/* 4 Assessment Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* [1] Forgot */}
              <div
                onClick={() => setSelectedSRS('Forgot')}
                className={`cursor-pointer p-3.5 rounded-lg flex flex-col justify-between gap-2 transition-all border ${
                  selectedSRS === 'Forgot'
                    ? 'bg-[#fff2f0] border-2 border-[#ba1a1a] shadow-xs'
                    : 'bg-[#eef7e8] border-[#c9d8be] hover:border-[#ba1a1a]/50 hover:bg-[#fff2f0]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[9px] bg-[#ffdad6] text-[#ba1a1a] px-1.5 py-0.5 rounded uppercase font-bold">
                      [1] Forgot
                    </span>
                    <span className="font-serif font-bold text-sm text-[#111f09]">Blackout</span>
                  </div>
                  {selectedSRS === 'Forgot' ? (
                    <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">
                      check_circle
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[#6f7d66] text-[18px]">
                      replay
                    </span>
                  )}
                </div>
                <p className="font-serif text-[#3f562e] text-xs">
                  I couldn't recall it without looking at the notes. Complete mental lapse.
                </p>
                <div className="flex items-center justify-between pt-1 font-sans text-[10px]">
                  <span className="text-[#ba1a1a] font-bold">Interval: 1 Day</span>
                  <span className="text-[#526b3e]">Mastery -10%</span>
                </div>
              </div>

              {/* [2] Struggled */}
              <div
                onClick={() => setSelectedSRS('Struggled')}
                className={`cursor-pointer p-3.5 rounded-lg flex flex-col justify-between gap-2 transition-all border ${
                  selectedSRS === 'Struggled'
                    ? 'bg-[#f0f7fd] border-2 border-[#286290] shadow-xs'
                    : 'bg-[#eef7e8] border-[#c9d8be] hover:border-[#6fa4d6] hover:bg-[#f0f7fd]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[9px] bg-[#cee5ff] text-[#286290] px-1.5 py-0.5 rounded uppercase font-bold">
                      [2] Struggled
                    </span>
                    <span className="font-serif font-bold text-sm text-[#111f09]">
                      Partial Recall
                    </span>
                  </div>
                  {selectedSRS === 'Struggled' ? (
                    <span className="material-symbols-outlined text-[#286290] text-[20px]">
                      check_circle
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[#6f7d66] text-[18px]">
                      help
                    </span>
                  )}
                </div>
                <p className="font-serif text-[#3f562e] text-xs">
                  I remembered partially, but needed significant prompting or stumbled on bounds.
                </p>
                <div className="flex items-center justify-between pt-1 font-sans text-[10px]">
                  <span className="text-[#286290] font-bold">Interval: 3 Days</span>
                  <span className="text-[#526b3e]">Mastery unchanged</span>
                </div>
              </div>

              {/* [3] Good */}
              <div
                onClick={() => setSelectedSRS('Good')}
                className={`cursor-pointer p-3.5 rounded-lg flex flex-col justify-between gap-2 transition-all border ${
                  selectedSRS === 'Good'
                    ? 'bg-[#e6f3de] border-2 border-[#77c73d] shadow-xs'
                    : 'bg-[#eef7e8] border-[#c9d8be] hover:border-[#77c73d] hover:bg-[#e6f3de]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[9px] bg-[#77c73d] text-[#173800] px-1.5 py-0.5 rounded uppercase font-bold">
                      [3] Good
                    </span>
                    <span className="font-serif font-bold text-sm text-[#255400]">
                      Solid Mastery
                    </span>
                  </div>
                  {selectedSRS === 'Good' ? (
                    <span className="material-symbols-outlined text-[#326b00] text-[20px]">
                      check_circle
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[#326b00] text-[18px]">
                      check
                    </span>
                  )}
                </div>
                <p className="font-serif text-[#111f09] text-xs">
                  I remembered the core mechanics and invariants accurately with minimal hesitation.
                </p>
                <div className="flex items-center justify-between pt-1 font-sans text-[10px]">
                  <span className="text-[#255400] font-bold">Interval: 7d → 14 Days</span>
                  <span className="text-[#255400] font-bold">Mastery +6%</span>
                </div>
              </div>

              {/* [4] Easy */}
              <div
                onClick={() => setSelectedSRS('Easy')}
                className={`cursor-pointer p-3.5 rounded-lg flex flex-col justify-between gap-2 transition-all border ${
                  selectedSRS === 'Easy'
                    ? 'bg-[#eafafa] border-2 border-[#006a6a] shadow-xs'
                    : 'bg-[#eef7e8] border-[#c9d8be] hover:border-[#8adddd] hover:bg-[#eafafa]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[9px] bg-[#8adddd]/40 text-[#006a6a] px-1.5 py-0.5 rounded uppercase font-bold">
                      [4] Easy
                    </span>
                    <span className="font-serif font-bold text-sm text-[#111f09]">Effortless</span>
                  </div>
                  {selectedSRS === 'Easy' ? (
                    <span className="material-symbols-outlined text-[#006a6a] text-[20px]">
                      check_circle
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[#6f7d66] text-[18px]">
                      bolt
                    </span>
                  )}
                </div>
                <p className="font-serif text-[#3f562e] text-xs">
                  I recalled it effortlessly and immediately knew the template and edge cases cold.
                </p>
                <div className="flex items-center justify-between pt-1 font-sans text-[10px]">
                  <span className="text-[#006a6a] font-bold">Interval: 7d → 30 Days</span>
                  <span className="text-[#006a6a] font-bold">Mastery +12%</span>
                </div>
              </div>
            </div>

            {/* Projection Pill */}
            <div className="bg-[#f5fbf1] border border-[#c9d8be] p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a6a] text-[20px]">
                  event_repeat
                </span>
                <div className="flex flex-col">
                  <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e] font-semibold">
                    Algorithm Interval Projection
                  </span>
                  <span className="font-serif font-bold text-[#111f09] text-sm">
                    Next revision scheduled for:{' '}
                    <span className="text-[#006a6a] font-bold">{projection.date}</span> (
                    {projection.interval} from now)
                  </span>
                </div>
              </div>

              {/* Interval Track Ladder */}
              <div className="flex items-center gap-1 font-sans text-[10px]">
                {['1D', '3D', '7D', '14D', '30D'].map((step) => {
                  const isActive = step === projection.ladder;
                  return (
                    <span
                      key={step}
                      className={`px-2 py-0.5 rounded border ${
                        isActive
                          ? 'bg-[#006a6a] text-white font-bold border-[#006a6a]'
                          : 'bg-[#eef7e8] text-[#526b3e] border-[#c9d8be]/60'
                      }`}
                    >
                      {step}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Footer Console */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              onClick={onExitSession}
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-[#eef7e8] text-[#111f09] border border-[#c9d8be] font-serif font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#526b3e]">home</span>
              <span className="font-sans text-[10px] uppercase tracking-wider">
                Complete Session &amp; Return to Dashboard
              </span>
            </button>

            <button
              onClick={() => onAdvancePattern(pattern.id, selectedSRS, scratchpadText)}
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#77c73d] hover:bg-[#89db4f] text-[#173800] font-serif font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm border border-[#64b02d] cursor-pointer"
            >
              <span>Save Assessment &amp; Continue to Next Pattern (3 of 6)</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right Telemetry & Context Inspector (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Pattern Codex Dossier */}
          <div className="bg-white border border-[#c9d8be]/70 rounded-xl p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e] font-semibold">
                Pattern Codex Dossier
              </span>
              <span className="font-sans text-[10px] text-[#255400] bg-[#77c73d]/20 border border-[#77c73d]/50 px-1.5 py-0.5 rounded uppercase font-bold">
                Tier 1 Core
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-serif text-lg font-bold text-[#111f09]">
                {pattern.name} Taxonomy
              </h3>
              <p className="font-serif text-[#3f562e] text-xs leading-relaxed">
                {pattern.whenToUse}
              </p>
            </div>

            {/* Rich Visual: Inline SVG Archetype Chart */}
            <div className="bg-[#f5fbf1] border border-[#c9d8be] p-2.5 rounded-lg flex flex-col gap-1">
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e] font-semibold">
                Pointer Invariant Topology
              </span>
              <svg className="w-full text-[#326b00]" fill="none" viewBox="0 0 320 70">
                {/* Array cells */}
                <rect className="fill-white stroke-[#c9d8be]" height="26" rx="4" width="40" x="10" y="24"></rect>
                <rect className="fill-white stroke-[#c9d8be]" height="26" rx="4" width="40" x="55" y="24"></rect>
                <rect className="fill-[#77c73d]/25 stroke-[#77c73d]" height="26" rx="4" width="40" x="100" y="24"></rect>
                <rect className="fill-[#77c73d]/25 stroke-[#77c73d]" height="26" rx="4" width="40" x="145" y="24"></rect>
                <rect className="fill-[#77c73d]/25 stroke-[#77c73d]" height="26" rx="4" width="40" x="190" y="24"></rect>
                <rect className="fill-white stroke-[#c9d8be]" height="26" rx="4" width="40" x="235" y="24"></rect>
                <rect className="fill-white stroke-[#c9d8be]" height="26" rx="4" width="30" x="280" y="24"></rect>
                {/* Window bracket */}
                <path d="M100 20 H230" stroke="#326b00" strokeLinecap="round" strokeWidth="2"></path>
                <circle cx="100" cy="20" fill="#326b00" r="3"></circle>
                <circle cx="230" cy="20" fill="#326b00" r="3"></circle>
                {/* Pointer Labels */}
                <text className="font-sans text-[10px] font-bold" fill="#326b00" x="105" y="14">L</text>
                <text className="font-sans text-[10px] font-bold" fill="#326b00" x="215" y="14">R →</text>
                {/* Array Indices */}
                <text className="font-sans text-[11px]" fill="#526b3e" x="26" y="41">0</text>
                <text className="font-sans text-[11px]" fill="#526b3e" x="71" y="41">1</text>
                <text className="font-sans text-[11px] font-bold" fill="#255400" x="116" y="41">2</text>
                <text className="font-sans text-[11px] font-bold" fill="#255400" x="161" y="41">3</text>
                <text className="font-sans text-[11px] font-bold" fill="#255400" x="206" y="41">4</text>
                <text className="font-sans text-[11px]" fill="#526b3e" x="251" y="41">5</text>
              </svg>
            </div>

            {/* Representative Problem Archetypes */}
            <div className="flex flex-col gap-1.5">
              <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e] font-semibold">
                Representative Problem Archetypes
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between p-2 bg-[#eef7e8] border border-[#c9d8be]/50 rounded text-xs">
                  <span className="text-[#111f09] truncate font-medium">
                    LC 3: Longest Substring Without Repeating
                  </span>
                  <span className="text-[#006a6a] font-sans text-[9px] font-bold bg-[#8adddd]/30 px-1.5 py-0.5 rounded">
                    Dynamic
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#eef7e8] border border-[#c9d8be]/50 rounded text-xs">
                  <span className="text-[#111f09] truncate font-medium">
                    LC 76: Minimum Window Substring
                  </span>
                  <span className="text-[#ba1a1a] font-sans text-[9px] font-bold bg-[#ffdad6] px-1.5 py-0.5 rounded">
                    Hard
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#eef7e8] border border-[#c9d8be]/50 rounded text-xs">
                  <span className="text-[#111f09] truncate font-medium">
                    LC 643: Maximum Average Subarray I
                  </span>
                  <span className="text-[#255400] font-sans text-[9px] font-bold bg-[#77c73d]/25 px-1.5 py-0.5 rounded">
                    Fixed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Retention Telemetry */}
          <div className="bg-white border border-[#c9d8be]/70 rounded-xl p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e] font-semibold">
                Retention Telemetry
              </span>
              <span className="font-sans text-[10px] text-[#006a6a] bg-[#8adddd]/30 border border-[#8adddd] px-1.5 py-0.5 rounded font-bold">
                Stability Index
              </span>
            </div>

            {/* Donut Mastery Gauge */}
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#e6f3de] stroke-current"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3.5"
                  ></path>
                  <path
                    className="text-[#77c73d] stroke-current"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeDasharray="74, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  ></path>
                </svg>
                <span className="absolute font-serif text-base text-[#111f09] font-bold">
                  {pattern.mastery}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base text-[#111f09] font-bold">
                  Calculated Mastery
                </span>
                <span className="font-sans text-[10px] text-[#526b3e]">
                  Will rise to {Math.min(100, pattern.mastery + 6)}% with Good rating
                </span>
                <span className="font-sans text-[10px] text-[#255400] font-bold mt-0.5">
                  Status: Consolidating
                </span>
              </div>
            </div>

            {/* Historical Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#f5fbf1] border border-[#c9d8be]/60 p-2 rounded flex flex-col">
                <span className="font-sans text-[9px] uppercase text-[#526b3e] font-semibold">
                  Prior Reps
                </span>
                <span className="font-serif font-bold text-[#111f09]">
                  {pattern.sessionsCount} Sessions
                </span>
              </div>
              <div className="bg-[#f5fbf1] border border-[#c9d8be]/60 p-2 rounded flex flex-col">
                <span className="font-sans text-[9px] uppercase text-[#526b3e] font-semibold">
                  Lapse Count
                </span>
                <span className="font-serif font-bold text-[#111f09]">0 Lapses</span>
              </div>
              <div className="bg-[#f5fbf1] border border-[#c9d8be]/60 p-2 rounded flex flex-col">
                <span className="font-sans text-[9px] uppercase text-[#526b3e] font-semibold">
                  First Encounters
                </span>
                <span className="font-serif font-bold text-[#111f09]">Oct 11, 2023</span>
              </div>
              <div className="bg-[#f5fbf1] border border-[#c9d8be]/60 p-2 rounded flex flex-col">
                <span className="font-sans text-[9px] uppercase text-[#526b3e] font-semibold">
                  Last Interval
                </span>
                <span className="font-serif font-bold text-[#111f09]">{pattern.activeInterval}</span>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-white border border-[#c9d8be]/70 p-4 rounded-xl flex flex-col gap-1 shadow-xs">
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e] font-semibold">
              Keyboard Orchestration
            </span>
            <div className="flex flex-col gap-1 text-xs text-[#2d451b] mt-1">
              <div className="flex justify-between items-center py-0.5">
                <span>Forgot / Struggle / Good / Easy</span>
                <span className="font-sans text-[10px] bg-[#eef7e8] border border-[#c9d8be] px-1.5 py-0.5 rounded text-[#255400] font-bold">
                  1 · 2 · 3 · 4
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span>Toggle Codex Reveal</span>
                <span className="font-sans text-[10px] bg-[#eef7e8] border border-[#c9d8be] px-1.5 py-0.5 rounded text-[#526b3e] font-bold">
                  Space / Tab
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span>Save &amp; Advance Pattern</span>
                <span className="font-sans text-[10px] bg-[#eef7e8] border border-[#c9d8be] px-1.5 py-0.5 rounded text-[#255400] font-bold">
                  Enter
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
