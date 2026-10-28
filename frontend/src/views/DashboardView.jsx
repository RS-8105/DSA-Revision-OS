import React from 'react';
import { CATEGORIES } from '../types';

export const DashboardView = ({
  patterns = [],
  dashboardData = null,
  revisionHistory = [],
  onStartRevision,
  onOpenCodex,
  onOpenQuickLog,
}) => {
  // Compute queue items that are due today or overdue
  const queuePatterns = patterns.filter((p) => p.isDueToday || p.isOverdue).slice(0, 6);
  const overdueCount = dashboardData?.overdueCount ?? patterns.filter((p) => p.isOverdue).length;
  const dueTodayCount = dashboardData?.dueTodayCount ?? patterns.filter((p) => p.isDueToday).length;
  const totalDueCount = overdueCount + dueTodayCount;

  // Real streak from backend
  const streakDays = dashboardData?.revisionStreakDays ?? 0;

  // Overall mastery calculation
  const overallMastery =
    dashboardData?.overallMastery ??
    (patterns.length > 0
      ? Math.round(patterns.reduce((acc, p) => acc + (p.mastery || 0), 0) / patterns.length)
      : 0);

  const masteredCount =
    dashboardData?.progressSummary?.masteredPatterns ??
    patterns.filter((p) => p.mastery >= 80).length;

  // Real weekly revisions completed from backend or history in last 7 days
  const weeklyCompleted =
    dashboardData?.weeklyCompletedCount ??
    revisionHistory.filter((h) => {
      const ts = new Date(h.revisionDate || h.date).getTime();
      return !isNaN(ts) && Date.now() - ts <= 7 * 24 * 60 * 60 * 1000;
    }).length;

  const weeklyTarget = 20;
  const weeklyPct = Math.min(100, Math.round((weeklyCompleted / weeklyTarget) * 100));

  // Current formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  // Real weak areas (mastery < 70)
  const weakAreas = (
    dashboardData?.weakAreas?.length
      ? dashboardData.weakAreas.map((w) => patterns.find((p) => p.backendId === w.patternId || p.name === w.patternName) || w)
      : patterns.filter((p) => p.mastery < 70).sort((a, b) => a.mastery - b.mastery).slice(0, 3)
  );

  // Real upcoming schedule grouped dynamically by future due date
  const upcomingGrouped = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const groups = {};
    patterns
      .filter((p) => !p.isDueToday && !p.isOverdue && (p.nextRevision || p.nextTargetDate))
      .forEach((p) => {
        const rawDate = p.nextRevision || p.nextTargetDate;
        let diffDays = null;

        const targetDateObj = new Date(rawDate);
        if (!isNaN(targetDateObj.getTime())) {
          targetDateObj.setHours(0, 0, 0, 0);
          diffDays = Math.round((targetDateObj - today) / (1000 * 60 * 60 * 24));
        }

        let label = rawDate;
        if (diffDays === 1) label = 'Tomorrow';
        else if (diffDays === 2) label = 'In 2 Days';
        else if (diffDays === 3) label = 'In 3 Days';
        else if (diffDays !== null && diffDays > 3) label = `In ${diffDays} Days`;

        if (!groups[label]) groups[label] = [];
        groups[label].push(p);
      });

    return Object.entries(groups).slice(0, 4);
  }, [patterns]);

  // Real recent activity (from backend or unified history)
  const recentActivities = (
    dashboardData?.recentActivity?.length
      ? dashboardData.recentActivity
      : revisionHistory
  ).slice(0, 5);

  const formatActivityTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const diffMs = Date.now() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

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
                {todayFormatted} · Leitner SRS Engine
              </span>
              <span
                className={`px-3 py-0.5 rounded-full font-sans text-[10px] tracking-widest uppercase border font-bold ${
                  totalDueCount > 0
                    ? 'bg-[#ffebee] text-[#ba1a1a] border-[#ba1a1a]/20'
                    : 'bg-[#eef7e8] text-[#255400] border-[#77c73d]/40'
                }`}
              >
                {totalDueCount > 0 ? 'Active Review Window' : 'All Queues Clear'}
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
              onClick={() => onStartRevision(queuePatterns[0]?.id || patterns[0]?.id)}
              type="button"
              className="group relative flex items-center gap-2 px-5 py-2.5 bg-[#77c73d] text-[#112600] font-serif font-bold text-sm rounded-lg shadow-sm hover:bg-[#86d949] transition-all border border-[#64b02d] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">
                play_circle
              </span>
              <span>Start Today's Revision</span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-black/10 text-[#112600] font-sans text-[10px] uppercase font-bold">
                {totalDueCount} Due
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
            <span
              className={`px-1.5 py-0.5 rounded font-sans text-[10px] uppercase tracking-wider font-bold border ${
                overdueCount > 0
                  ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/20'
                  : 'bg-[#eef7e8] text-[#255400] border-[#77c73d]/40'
              }`}
            >
              {overdueCount > 0 ? `${overdueCount} Overdue` : '0 Overdue'}
            </span>
          </div>
          <div className="my-1">
            <div className="font-serif text-2xl font-bold text-[#111f09]">
              {totalDueCount} <span className="text-base font-normal text-[#414a38]">patterns</span>
            </div>
            <div className="font-serif text-xs text-[#414a38]">
              {overdueCount > 0 ? `${overdueCount} carried over from previous target` : 'All schedules on track'}
            </div>
          </div>
          <div className="w-full bg-[#ebf4e6] h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full ${overdueCount > 0 ? 'bg-[#ba1a1a]' : 'bg-[#77c73d]'}`}
              style={{
                width: totalDueCount > 0 ? `${Math.min(100, Math.max(10, (totalDueCount / patterns.length) * 100))}%` : '0%',
              }}
            ></div>
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
              <span className="font-sans text-[10px] uppercase font-bold">
                {streakDays > 0 ? 'Active' : 'Idle'}
              </span>
            </span>
          </div>
          <div className="my-1">
            <div className="font-serif text-2xl text-[#326b00] font-bold">
              {streakDays} <span className="text-base font-normal text-[#414a38]">days</span>
            </div>
            <div className="font-serif text-xs text-[#414a38]">
              {streakDays > 0 ? 'Consecutive daily revisions logged' : 'Log a revision today to start streak'}
            </div>
          </div>
          {/* 14-day streak pips */}
          <div className="flex items-center gap-1 mt-2 pt-1">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-xs ${i < streakDays ? 'bg-[#77c73d]' : 'bg-[#d7e6ce]'}`}
                title={`Day ${i + 1}`}
              ></span>
            ))}
          </div>
        </div>

        {/* Metric 3: Overall Mastery */}
        <div className="relative flex flex-col justify-between p-4 rounded-xl bg-white shadow-xs border border-[#c9d8be]/60 hover:border-[#326b00]/40 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#414a38] font-semibold">
              Overall Mastery
            </span>
            <span className="flex items-center text-[#326b00] font-sans text-[10px] uppercase font-bold">
              <span className="material-symbols-outlined text-[14px]">psychology</span> Live
            </span>
          </div>
          <div className="flex items-center justify-between my-1">
            <div>
              <div className="font-serif text-2xl text-[#006a6a] font-bold">{overallMastery}%</div>
              <div className="font-serif text-xs text-[#414a38]">
                {masteredCount} of {patterns.length} core patterns
              </div>
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
                strokeDasharray={`${overallMastery}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              ></path>
            </svg>
          </div>
          <div className="font-sans text-[10px] text-[#414a38]/80">
            Catalog retention index
          </div>
        </div>

        {/* Metric 4: Completed This Week */}
        <div className="relative flex flex-col justify-between p-4 rounded-xl bg-white shadow-xs border border-[#c9d8be]/60 hover:border-[#326b00]/40 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#414a38] font-semibold">
              Weekly Quota
            </span>
            <span className="font-sans text-[10px] text-[#414a38] uppercase font-medium">
              Target {weeklyTarget}
            </span>
          </div>
          <div className="my-1">
            <div className="font-serif text-2xl font-bold text-[#111f09]">
              {weeklyCompleted} <span className="text-base font-normal text-[#414a38]">revisions</span>
            </div>
            <div className="font-serif text-xs text-[#414a38]">
              {weeklyPct}% of weekly quota achieved
            </div>
          </div>
          <div className="w-full bg-[#ebf4e6] h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-[#77c73d] h-full rounded-full" style={{ width: `${weeklyPct}%` }}></div>
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
                  {queuePatterns.length} in active review batch
                </span>
              </div>
            </div>

            {/* Revision Items */}
            {queuePatterns.length > 0 ? (
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
                              {item.overdueText || 'Overdue'}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-[#77c73d]/20 text-[#255200] font-sans text-[10px] uppercase font-bold border border-[#77c73d]/40">
                              Due Today
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 font-sans text-[11px] text-[#414a38]">
                          <span>Last revised: {item.lastRevisedDaysAgo || item.lastRevised || 'Not yet'}</span>
                          <span>•</span>
                          <span>
                            Active Interval:{' '}
                            <strong className={isOverdue ? 'text-[#ba1a1a]' : 'text-[#006a6a]'}>
                              {item.activeInterval || item.ladderInterval || '1d'}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>Complexity: {item.complexityTime || 'O(N)'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => onStartRevision(item.id)}
                          type="button"
                          className={`px-3.5 py-1.5 rounded font-serif text-xs font-bold transition-all shadow-xs cursor-pointer ${
                            isOverdue
                              ? 'bg-[#ba1a1a] text-white hover:bg-red-700'
                              : 'bg-[#77c73d] text-[#112600] hover:bg-[#86d949] border border-[#64b02d]'
                          }`}
                        >
                          {isOverdue ? 'Resume' : 'Revise Now'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center bg-[#f5fbf1] rounded-xl border border-dashed border-[#c9d8be]/70 flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[32px] text-[#326b00]">check_circle</span>
                <span className="font-serif font-bold text-base text-[#111f09]">All Caught Up!</span>
                <p className="font-serif text-xs text-[#526b3e] max-w-sm">
                  No patterns are due for spaced repetition right now. You can practice any pattern from the library or log a session.
                </p>
                <button
                  onClick={() => onStartRevision(patterns[0]?.id)}
                  type="button"
                  className="mt-1 px-4 py-1.5 bg-[#eef7e8] hover:bg-[#e2f2da] text-[#326b00] border border-[#c9d8be] rounded-lg text-xs font-serif font-bold transition-colors"
                >
                  Review Any Pattern
                </button>
              </div>
            )}

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

          {/* 2. Mastery Overview (Dynamic Category Breakdown Meters) */}
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
                  Live taxonomy distribution across algorithm modules
                </p>
              </div>
              <span className="font-sans text-[10px] px-2 py-0.5 rounded bg-[#f5fbf1] text-[#414a38] font-semibold border border-[#c9d8be]/50">
                {CATEGORIES.length} Tracked Domains
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {CATEGORIES.map((cat) => {
                const catPatterns = patterns.filter((p) => p.category === cat);
                if (catPatterns.length === 0) return null;

                const catMastered = catPatterns.filter((p) => p.mastery >= 80).length;
                const catLearning = catPatterns.length - catMastered;
                const catAvg =
                  catPatterns.length > 0
                    ? Math.round(catPatterns.reduce((s, p) => s + (p.mastery || 0), 0) / catPatterns.length)
                    : 0;
                const needsAttention = catAvg < 50;

                return (
                  <div
                    key={cat}
                    className={`flex flex-col gap-1 p-2 rounded-lg transition-colors ${
                      needsAttention ? 'bg-[#fff8f7] border border-[#ba1a1a]/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-bold text-[#111f09]">{cat}</span>
                        {needsAttention && (
                          <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] font-sans text-[10px] uppercase font-bold border border-[#ba1a1a]/30">
                            Needs Attention
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 font-sans text-xs">
                        <span className="text-[#414a38]">
                          Mastered: {catMastered} · Learning: {catLearning}
                        </span>
                        <span
                          className={`font-serif text-base font-bold ${
                            catAvg >= 70 ? 'text-[#326b00]' : catAvg >= 50 ? 'text-[#006a6a]' : 'text-[#ba1a1a]'
                          }`}
                        >
                          {catAvg}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#ebf4e6] h-2 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full rounded-l-full ${
                          catAvg >= 70 ? 'bg-[#77c73d]' : catAvg >= 50 ? 'bg-[#006a6a]' : 'bg-[#ba1a1a]'
                        }`}
                        style={{ width: `${catAvg}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
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
                  Lowest retention probability &amp; active lapses
                </p>
              </div>
              <span className="font-sans text-[10px] px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] uppercase font-bold border border-[#ba1a1a]/30">
                {weakAreas.length} Identified
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {weakAreas.length > 0 ? (
                weakAreas.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg bg-[#fff8f7] hover:bg-[#feefed] transition-colors flex flex-col gap-1.5 border border-[#ba1a1a]/30"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => onOpenCodex(item.id)}
                        className="font-serif text-base text-[#111f09] truncate font-bold text-left hover:text-[#ba1a1a]"
                      >
                        {item.name || item.patternName}
                      </button>
                      <span className="font-serif font-bold text-[#ba1a1a] text-sm">
                        {item.mastery}% Mastery
                      </span>
                    </div>
                    <div className="font-sans text-[11px] text-[#414a38]">
                      {item.category || item.patternCategory} · Last: {item.lastRevisedDaysAgo || item.lastRevised || 'Never'}
                    </div>
                    <div className="w-full bg-[#fae8e6] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#ba1a1a] h-full rounded-full"
                        style={{ width: `${Math.max(5, item.mastery)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1 pt-1">
                      <span className="font-sans text-[10px] text-[#414a38]">
                        Next Target: {item.nextTarget || item.nextRevision || 'Immediate'}
                      </span>
                      <button
                        onClick={() => onOpenCodex(item.id)}
                        type="button"
                        className="px-2.5 py-1 rounded bg-white hover:bg-[#77c73d] hover:text-[#112600] text-[#326b00] font-serif font-bold text-xs transition-colors border border-[#c9d8be]/60 cursor-pointer"
                      >
                        Review Concept
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg bg-[#f5fbf1] text-xs font-serif text-[#526b3e] text-center border border-[#c9d8be]/50">
                  ✓ No weak patterns detected! All current patterns are at or above 70% mastery.
                </div>
              )}
            </div>
          </section>

          {/* 2. Upcoming Schedule (Dynamic pipeline from real dates) */}
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
                  Live projected review pipeline
                </p>
              </div>
              <span className="font-sans text-[10px] text-[#414a38] uppercase font-semibold">
                {patterns.filter((p) => !p.isDueToday && !p.isOverdue && (p.nextRevision || p.nextTargetDate)).length} Scheduled
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {upcomingGrouped.length > 0 ? (
                upcomingGrouped.map(([label, items]) => (
                  <div
                    key={label}
                    className="p-3 rounded-lg bg-[#fbfdfa] flex items-start justify-between gap-3 border border-[#c9d8be]/40"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="font-serif font-bold text-[#111f09] text-sm">{label}</span>
                      <span className="font-serif text-xs text-[#414a38] truncate">
                        {items.map((p) => p.name).join(', ')}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#e3f4d6] text-[#326b00] font-sans text-[10px] font-bold border border-[#326b00]/20 flex-shrink-0">
                      {items.length} {items.length === 1 ? 'Pattern' : 'Patterns'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg bg-[#f5fbf1] text-xs font-serif text-[#526b3e] text-center border border-[#c9d8be]/50">
                  No upcoming future revisions scheduled. Revise today's items to schedule future intervals.
                </div>
              )}
            </div>
          </section>

          {/* 3. Recent Activity Log (Live audit trail) */}
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
              {recentActivities.length > 0 ? (
                recentActivities.map((act, idx) => {
                  const rating = (act.confidence || act.assessment || 'Good').toUpperCase();
                  const isGood = rating === 'GOOD';
                  const isEasy = rating === 'EASY';
                  const isStruggled = rating === 'STRUGGLED';

                  return (
                    <div
                      key={act.id || idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#fbfdfa] text-xs border border-[#c9d8be]/40"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            isEasy || isGood ? 'bg-[#77c73d]' : isStruggled ? 'bg-[#286290]' : 'bg-[#ba1a1a]'
                          }`}
                        ></span>
                        <div className="truncate">
                          <div className="font-serif font-bold text-[#111f09] truncate text-sm">
                            {act.patternName || act.pattern?.name || 'Revision Session'}
                          </div>
                          <div className="font-sans text-[10px] text-[#414a38] truncate">
                            {act.notes || act.patternCategory || 'Spaced recall session'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 text-right">
                        <span
                          className={`px-1.5 py-0.5 rounded font-sans text-[10px] uppercase font-bold border ${
                            isEasy
                              ? 'bg-[#77c73d]/20 text-[#255200] border-[#77c73d]/40'
                              : isGood
                              ? 'bg-[#cee5ff] text-[#004a76] border-[#286290]/30'
                              : isStruggled
                              ? 'bg-[#cee5ff] text-[#286290] border-[#286290]/20'
                              : 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30'
                          }`}
                        >
                          {act.confidence || act.assessment || 'Good'}
                        </span>
                        <span className="font-sans text-[10px] text-[#717a67]">
                          {formatActivityTime(act.revisionDate || act.date)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 rounded-lg bg-[#f5fbf1] text-xs font-serif text-[#526b3e] text-center border border-[#c9d8be]/50">
                  No revision sessions recorded yet. Start a session or log a repetition to begin your activity trail.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
