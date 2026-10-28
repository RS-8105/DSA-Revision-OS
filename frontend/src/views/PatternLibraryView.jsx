import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../types';

export const PatternLibraryView = ({
  patterns = [],
  dashboardData = null,
  onOpenCodex,
  onStartRevision,
  onOpenAddPattern,
  onRecordQuality,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [masteryFilter, setMasteryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('mastery-asc');

  // Drawer state
  const [drawerPattern, setDrawerPattern] = useState(null);

  const categoryCounts = useMemo(() => {
    const counts = { all: patterns.length };
    patterns.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [patterns]);

  const categories = useMemo(() => [
    { id: 'all', label: `All Categories (${patterns.length})` },
    ...CATEGORIES.map((cat) => ({
      id: cat,
      label: `${cat} (${categoryCounts[cat] || 0})`,
    })),
  ], [patterns.length, categoryCounts]);

  // Derived telemetry metrics
  const masteredCount = useMemo(
    () => patterns.filter((p) => p.mastery >= 80).length,
    [patterns]
  );

  const dueTodayCount = useMemo(
    () => patterns.filter((p) => p.isDueToday).length,
    [patterns]
  );

  const overdueCount = useMemo(
    () => patterns.filter((p) => p.isOverdue).length,
    [patterns]
  );

  const avgInterval = useMemo(() => {
    if (patterns.length === 0) return 0;
    const totalDays = patterns.reduce((acc, p) => {
      const match = (p.activeInterval || p.ladderInterval || '1d').match(/\d+/);
      return acc + (match ? parseInt(match[0], 10) : 1);
    }, 0);
    return (totalDays / patterns.length).toFixed(1);
  }, [patterns]);

  const totalRepetitions = useMemo(() => {
    if (dashboardData?.totalRevisionsCompleted != null) {
      return dashboardData.totalRevisionsCompleted;
    }
    return patterns.reduce((acc, p) => acc + (p.sessionsCount || p.revisionCount || 0), 0);
  }, [dashboardData, patterns]);

  const avgMastery = useMemo(() => {
    if (patterns.length === 0) return 0;
    return Math.round(patterns.reduce((acc, p) => acc + (p.mastery || 0), 0) / patterns.length);
  }, [patterns]);

  const filteredPatterns = useMemo(() => {
    let result = patterns.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.whenToUse && p.whenToUse.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMastery =
        masteryFilter === 'all' ||
        (masteryFilter === 'Mastered' && p.mastery >= 85) ||
        (masteryFilter === 'Strong' && p.mastery >= 70 && p.mastery < 85) ||
        (masteryFilter === 'Needs Practice' && p.mastery >= 50 && p.mastery < 70) ||
        (masteryFilter === 'Learning' && p.mastery < 50);

      return matchesCategory && matchesSearch && matchesMastery;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'mastery-asc') return a.mastery - b.mastery;
      if (sortBy === 'mastery-desc') return b.mastery - a.mastery;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [patterns, selectedCategory, searchQuery, masteryFilter, sortBy]);

  return (
    <div className="flex flex-col w-full pb-16 pt-2">
      {/* Top Analytical Banner & Meta Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch mb-6">
        {/* Left 8 Cols */}
        <div className="xl:col-span-8 bg-white border border-[#c9d8be] p-6 rounded-xl flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-[#77c73d]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col gap-1 relative z-10">
            <div className="flex items-center gap-2">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#2d6300] font-bold px-2 py-0.5 bg-[#77c73d]/20 rounded border border-[#77c73d]/40">
                Codex Index
              </span>
              <span className="font-sans text-[11px] text-[#526b3e]">
                v4.18 Spaced Spanning Tree
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#111f09] tracking-tight">
              Pattern Library
            </h1>
            <p className="font-serif text-base text-[#2d451b] max-w-2xl leading-relaxed">
              Your personal map of algorithmic taxonomy · {patterns.length} distinct mental paradigms cataloged
              across structural, asymptotic, and recursive topographies.
            </p>
          </div>

          <div className="mt-6 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#c9d8be]/30">
            <div className="bg-[#f5fbf1] border border-[#c9d8be]/60 p-2.5 rounded-lg flex flex-col">
              <span className="font-sans text-[10px] uppercase text-[#526b3e] font-semibold">
                Mastered (80%+)
              </span>
              <span className="font-serif text-2xl text-[#006e6e] font-bold mt-1">
                {masteredCount} <span className="font-sans text-xs text-[#526b3e] font-normal">/ {patterns.length}</span>
              </span>
            </div>
            <div className="bg-[#f5fbf1] border border-[#c9d8be]/60 p-2.5 rounded-lg flex flex-col">
              <span className="font-sans text-[10px] uppercase text-[#526b3e] font-semibold">
                Due Today / Overdue
              </span>
              <span className="font-serif text-2xl text-[#2d6300] font-bold mt-1">
                {dueTodayCount + overdueCount}{' '}
                <span className="font-sans text-xs text-[#ba1a1a] font-normal">
                  ({overdueCount} overdue)
                </span>
              </span>
            </div>
            <div className="bg-[#f5fbf1] border border-[#c9d8be]/60 p-2.5 rounded-lg flex flex-col">
              <span className="font-sans text-[10px] uppercase text-[#526b3e] font-semibold">
                Active Interval Avg
              </span>
              <span className="font-serif text-2xl text-[#111f09] font-bold mt-1">{avgInterval}d</span>
            </div>
            <div className="bg-[#f5fbf1] border border-[#c9d8be]/60 p-2.5 rounded-lg flex flex-col">
              <span className="font-sans text-[10px] uppercase text-[#526b3e] font-semibold">
                Total Repetitions
              </span>
              <span className="font-serif text-2xl text-[#111f09] font-bold mt-1">{totalRepetitions}</span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Retention Geometry */}
        <div className="xl:col-span-4 bg-white border border-[#c9d8be] p-6 rounded-xl flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e] font-semibold">
              Retention Geometry
            </span>
            <span className="font-sans text-[10px] text-[#005e5e] bg-[#8adddd]/30 border border-[#8adddd] px-2 py-0.5 rounded font-bold">
              Avg Recall: {avgMastery}%
            </span>
          </div>

          {/* SVG Vector Graph */}
          <div className="py-2 flex items-center justify-center">
            <svg className="w-full h-24 text-[#2d6300] overflow-visible" fill="none" viewBox="0 0 320 80">
              <path
                className="text-[#2d6300]"
                d="M 0 70 Q 60 65, 100 40 T 180 32 T 250 18 T 320 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              ></path>
              <path
                className="text-[#77c73d]/25"
                d="M 0 70 Q 60 65, 100 40 T 180 32 T 250 18 T 320 8 L 320 80 L 0 80 Z"
                fill="currentColor"
              ></path>
              <circle className="fill-white stroke-[#007a7a] stroke-2" cx="100" cy="40" r="3.5"></circle>
              <circle className="fill-white stroke-[#007a7a] stroke-2" cx="180" cy="32" r="3.5"></circle>
              <circle className="fill-white stroke-[#007a7a] stroke-2" cx="250" cy="18" r="3.5"></circle>
              <circle className="fill-[#77c73d] stroke-[#2d6300] stroke-[1.5]" cx="320" cy="8" r="4"></circle>
              <text className="text-[#526b3e] font-sans text-[10px] font-bold" fill="currentColor" x="5" y="20">1D</text>
              <text className="text-[#526b3e] font-sans text-[10px] font-bold" fill="currentColor" x="95" y="20">3D</text>
              <text className="text-[#526b3e] font-sans text-[10px] font-bold" fill="currentColor" x="175" y="20">7D</text>
              <text className="text-[#526b3e] font-sans text-[10px] font-bold" fill="currentColor" x="240" y="32">14D</text>
              <text className="text-[#2d6300] font-sans text-[10px] font-bold" fill="currentColor" x="290" y="30">30D</text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 bg-[#eef7e8] border border-[#c9d8be]/60 p-2.5 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#007a7a]"></span>
              <span className="font-serif text-[#2d451b] text-xs font-semibold">
                Target Recall Interval
              </span>
            </div>
            <span className="font-sans text-[10px] text-[#111f09] font-bold tracking-wider">
              LEITNER BUCKET V
            </span>
          </div>
        </div>
      </div>

      {/* Search & Action Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white border border-[#c9d8be] p-3.5 rounded-xl shadow-xs mb-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#526b3e] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter patterns by name, LeetCode tag, or prerequisite... [⌘F]"
            className="w-full bg-[#f5fbf1] border border-[#c9d8be] text-[#111f09] pl-10 pr-20 py-2 rounded-lg text-sm font-serif placeholder:text-[#526b3e]/70 focus:outline-none focus:bg-white dark:focus:bg-[#182414] focus:border-[#77c73d] transition-colors"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="font-sans text-[10px] bg-[#e6f3de] border border-[#c9d8be] px-1.5 py-0.5 rounded text-[#2d451b] font-mono">
              ⌘
            </kbd>
            <kbd className="font-sans text-[10px] bg-[#e6f3de] border border-[#c9d8be] px-1.5 py-0.5 rounded text-[#2d451b] font-mono">
              F
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Mastery Filter */}
          <div className="relative">
            <select
              value={masteryFilter}
              onChange={(e) => setMasteryFilter(e.target.value)}
              className="bg-[#f5fbf1] border border-[#c9d8be] text-[#111f09] text-xs font-serif py-2 px-3 rounded-lg appearance-none pr-7 cursor-pointer hover:bg-[#eef7e8] transition-colors focus:outline-none focus:border-[#77c73d]"
            >
              <option value="all">All Mastery Levels</option>
              <option value="Mastered">Mastered (85%+)</option>
              <option value="Strong">Strong (70%-84%)</option>
              <option value="Needs Practice">Needs Practice (50%-69%)</option>
              <option value="Learning">Learning (&lt;50%)</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#526b3e] text-[16px]">
              expand_more
            </span>
          </div>

          {/* Sort Select */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#f5fbf1] border border-[#c9d8be] text-[#111f09] text-xs font-serif py-2 px-3 rounded-lg appearance-none pr-7 cursor-pointer hover:bg-[#eef7e8] transition-colors focus:outline-none focus:border-[#77c73d]"
            >
              <option value="mastery-asc">Sort: Mastery (Low → High)</option>
              <option value="mastery-desc">Sort: Mastery (High → Low)</option>
              <option value="name">Sort: Pattern Name</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#526b3e] text-[16px]">
              sort
            </span>
          </div>

          <button
            onClick={onOpenAddPattern}
            type="button"
            className="flex items-center gap-1.5 bg-[#77c73d] text-[#112600] font-serif font-bold px-3 py-2 rounded-lg hover:bg-[#68b532] transition-colors shadow-xs whitespace-nowrap text-xs border border-[#68b532] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>+ Add Custom Pattern</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
        {categories.map((c) => {
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer font-serif ${
                isSelected
                  ? 'bg-[#77c73d] text-[#112600] font-bold shadow-xs border border-[#68b532]'
                  : 'bg-white border border-[#c9d8be] text-[#2d451b] hover:text-[#111f09] hover:bg-[#eef7e8]'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Counter & Scale Indicator */}
      <div className="flex items-center justify-between text-xs px-1 mb-4">
        <div className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-wider text-[#526b3e]">
          <span>Catalog Display:</span>
          <span className="text-[#2d6300] font-bold">
            Showing {filteredPatterns.length} of {patterns.length} Patterns
          </span>
          <span className="text-[#c9d8be]">•</span>
          <span className="text-[#2d451b]">Spaced Repetition Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-[10px] uppercase text-[#526b3e] mr-1">Interval Scale:</span>
          <span className="font-sans text-[10px] px-1.5 py-0.5 bg-white border border-[#c9d8be] rounded text-[#2d451b]">1D</span>
          <span className="font-sans text-[10px] px-1.5 py-0.5 bg-white border border-[#c9d8be] rounded text-[#2d451b]">3D</span>
          <span className="font-sans text-[10px] px-1.5 py-0.5 bg-white border border-[#c9d8be] rounded text-[#2d451b]">7D</span>
          <span className="font-sans text-[10px] px-1.5 py-0.5 bg-white border border-[#c9d8be] rounded text-[#2d451b]">14D</span>
          <span className="font-sans text-[10px] px-1.5 py-0.5 bg-[#8adddd]/40 border border-[#8adddd] rounded text-[#005e5e] font-bold">30D</span>
        </div>
      </div>

      {/* Pattern Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredPatterns.map((p) => {
          const isOverdue = p.isOverdue;
          const isDue = p.isDueToday;
          const isMastered = p.masteryLevel === 'Mastered';
          const isStrong = p.masteryLevel === 'Strong';
          const isNeedsPractice = p.masteryLevel === 'Needs Practice';

          return (
            <div
              key={p.id}
              className={`bg-white border rounded-xl p-4 flex flex-col justify-between shadow-xs relative group hover:shadow-md transition-all duration-150 ${
                isDue
                  ? 'border-[#77c73d]/70'
                  : isOverdue
                  ? 'border-[#ffdad6] hover:border-[#ba1a1a]'
                  : 'border-[#c9d8be] hover:border-[#77c73d]'
              }`}
            >
              <div className="flex flex-col gap-2">
                {/* Header Tag */}
                <div className="flex items-start justify-between gap-2">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e] bg-[#f5fbf1] border border-[#c9d8be]/60 px-1.5 py-0.5 rounded font-semibold">
                    {p.category}
                  </span>
                  {isDue ? (
                    <span className="font-sans text-[10px] bg-[#77c73d]/25 text-[#1f4900] border border-[#77c73d] px-1.5 py-0.5 rounded uppercase font-bold">
                      Due Today
                    </span>
                  ) : isOverdue ? (
                    <span className="font-sans text-[10px] bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/40 px-1.5 py-0.5 rounded uppercase font-bold">
                      {p.overdueText || 'Overdue (2d)'}
                    </span>
                  ) : isMastered ? (
                    <span className="font-sans text-[10px] bg-[#8adddd]/30 text-[#006a6a] border border-[#8adddd] px-1.5 py-0.5 rounded uppercase font-bold">
                      Mastered
                    </span>
                  ) : isStrong ? (
                    <span className="font-sans text-[10px] bg-[#77c73d]/20 text-[#1f4900] border border-[#77c73d]/50 px-1.5 py-0.5 rounded uppercase font-bold">
                      Strong
                    </span>
                  ) : isNeedsPractice ? (
                    <span className="font-sans text-[10px] bg-[#6fa4d6]/20 text-[#1a5180] border border-[#6fa4d6]/60 px-1.5 py-0.5 rounded uppercase font-bold">
                      Needs Practice
                    </span>
                  ) : (
                    <span className="font-sans text-[10px] bg-[#6fa4d6]/20 text-[#1a5180] border border-[#6fa4d6]/60 px-1.5 py-0.5 rounded uppercase font-bold">
                      Learning
                    </span>
                  )}
                </div>

                {/* Title & Mastery */}
                <div className="flex items-baseline justify-between mt-1">
                  <button
                    onClick={() => onOpenCodex(p.id)}
                    className="font-serif text-lg text-[#111f09] tracking-wide group-hover:text-[#2d6300] font-bold transition-colors text-left"
                  >
                    {p.name}
                  </button>
                  <span
                    className={`font-serif text-lg font-bold ${
                      p.mastery >= 80
                        ? 'text-[#007a7a]'
                        : p.mastery >= 70
                        ? 'text-[#2d6300]'
                        : p.mastery >= 50
                        ? 'text-[#2e6a9e]'
                        : 'text-[#ba1a1a]'
                    }`}
                  >
                    {p.mastery}%
                  </span>
                </div>

                {/* Hairline Bar */}
                <div className="w-full h-1.5 bg-[#e6f3de] rounded-full overflow-hidden my-1">
                  <div
                    className={`h-full rounded-full ${
                      p.mastery >= 80
                        ? 'bg-[#009b9b]'
                        : p.mastery >= 70
                        ? 'bg-[#77c73d]'
                        : p.mastery >= 50
                        ? 'bg-[#6fa4d6]'
                        : 'bg-[#ba1a1a]'
                    }`}
                    style={{ width: `${p.mastery}%` }}
                  ></div>
                </div>

                {/* Stat Box */}
                <div
                  className={`grid grid-cols-3 gap-1 p-2 rounded-lg mt-1 text-center border ${
                    isOverdue
                      ? 'bg-[#fef2f2] border-[#ffdad6]'
                      : 'bg-[#eef7e8] border-[#c9d8be]/60'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-sans text-[9px] text-[#526b3e] uppercase font-semibold">
                      Last
                    </span>
                    <span className="font-serif text-xs text-[#111f09]">{p.lastRevisedDaysAgo}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-[9px] text-[#526b3e] uppercase font-semibold">
                      Next
                    </span>
                    <span
                      className={`font-serif text-xs font-bold ${
                        isDue
                          ? 'text-[#2d6300]'
                          : isOverdue
                          ? 'text-[#ba1a1a]'
                          : 'text-[#2d451b]'
                      }`}
                    >
                      {p.nextTarget}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-[9px] text-[#526b3e] uppercase font-semibold">
                      Ladder
                    </span>
                    <span className="font-serif text-xs font-bold text-[#007a7a]">
                      {p.ladderInterval}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-2 flex items-center justify-between border-t border-[#c9d8be]/30">
                <span className="font-sans text-[11px] text-[#526b3e]">
                  {p.sessionsCount} Sessions completed
                </span>
                <button
                  onClick={() => setDrawerPattern(p)}
                  type="button"
                  className={`text-xs font-serif font-semibold px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer shadow-2xs ${
                    isDue
                      ? 'bg-[#77c73d] text-[#112600] hover:bg-[#68b532]'
                      : isOverdue
                      ? 'bg-[#ba1a1a] text-white hover:bg-[#93000a]'
                      : 'bg-[#f5fbf1] border border-[#c9d8be] text-[#2d451b] hover:bg-[#77c73d] hover:text-[#112600]'
                  }`}
                >
                  <span>Inspect &amp; Practice</span>
                  <span className="material-symbols-outlined text-[14px]">
                    {isOverdue ? 'priority_high' : 'arrow_forward'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-over Inspection Sheet Modal */}
      {drawerPattern && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white border-l border-[#c9d8be] shadow-2xl h-full flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#c9d8be]/60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2d6300] text-[20px]">
                    psychology
                  </span>
                  <span className="font-sans text-[11px] uppercase tracking-widest text-[#2d6300] font-bold">
                    Algorithmic Telemetry
                  </span>
                </div>
                <button
                  onClick={() => setDrawerPattern(null)}
                  className="text-[#526b3e] hover:text-[#111f09] p-1 rounded hover:bg-[#eef7e8]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div>
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e] bg-[#eef7e8] border border-[#c9d8be] px-2 py-0.5 rounded font-semibold">
                  {drawerPattern.category}
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#111f09] mt-2">
                  {drawerPattern.name}
                </h2>
                <p className="font-serif text-sm text-[#2d451b] mt-1 leading-relaxed">
                  {drawerPattern.whenToUse}
                </p>
              </div>

              {/* Ladder Visualizer */}
              <div className="bg-[#f5fbf1] border border-[#c9d8be] p-4 rounded-xl flex flex-col gap-2">
                <span className="font-sans text-[10px] uppercase text-[#526b3e] font-bold">
                  Spaced Repetition Ladder (Current: {drawerPattern.ladderInterval})
                </span>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {['1D', '3D', '7D', '14D', '30D'].map((step) => {
                    const isReached =
                      step === '1D' ||
                      (step === '3D' && drawerPattern.spacedStage >= 2) ||
                      (step === '7D' && drawerPattern.spacedStage >= 3) ||
                      (step === '14D' && drawerPattern.spacedStage >= 4) ||
                      (step === '30D' && drawerPattern.spacedStage >= 5);
                    const isCurrent = step === drawerPattern.ladderInterval;

                    return (
                      <div
                        key={step}
                        className={`p-2 rounded text-center flex flex-col items-center border ${
                          isCurrent
                            ? 'bg-[#8adddd]/40 border-[#8adddd] text-[#005e5e] font-bold'
                            : isReached
                            ? 'bg-[#e6f3de] border-[#c9d8be] text-[#007a7a]'
                            : 'bg-white border-[#c9d8be]/50 text-[#526b3e]'
                        }`}
                      >
                        <span className="font-sans text-[10px] font-bold">{step}</span>
                        <span className="material-symbols-outlined text-[14px]">
                          {isCurrent ? 'stars' : isReached ? 'check' : 'lock'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Canonical Invariant Code block */}
              <div className="bg-[#eef7e8] border border-[#c9d8be] p-4 rounded-xl font-mono text-xs">
                <div className="flex items-center justify-between pb-2 text-[#526b3e] font-sans text-[10px] uppercase font-bold">
                  <span>Canonical Invariant Structure</span>
                  <span className="text-[#2d6300]">{drawerPattern.complexityTime}</span>
                </div>
                <pre className="text-[#111f09] font-mono text-[11px] leading-relaxed overflow-x-auto p-3 rounded bg-white border border-[#c9d8be]">
                  <code>{drawerPattern.codeSnippet.code}</code>
                </pre>
              </div>

              {/* Practice Quality Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <span className="font-sans text-[10px] uppercase text-[#526b3e] font-bold">
                  Record Practice Quality (Leitner Step)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      onRecordQuality(drawerPattern.id, 'Forgot');
                      setDrawerPattern(null);
                    }}
                    type="button"
                    className="p-2 bg-[#ffdad6]/60 hover:bg-[#ffdad6] border border-[#ffdad6] text-[#ba1a1a] rounded-lg flex flex-col items-center transition-all cursor-pointer"
                  >
                    <span className="font-sans text-[9px] uppercase font-bold">[1] Forgot</span>
                    <span className="text-[10px] mt-1 font-semibold">→ 1d</span>
                  </button>
                  <button
                    onClick={() => {
                      onRecordQuality(drawerPattern.id, 'Struggled');
                      setDrawerPattern(null);
                    }}
                    type="button"
                    className="p-2 bg-[#6fa4d6]/15 hover:bg-[#6fa4d6]/25 border border-[#6fa4d6]/40 text-[#2e6a9e] rounded-lg flex flex-col items-center transition-all cursor-pointer"
                  >
                    <span className="font-sans text-[9px] uppercase font-bold">[2] Struggled</span>
                    <span className="text-[10px] mt-1 font-semibold">→ same</span>
                  </button>
                  <button
                    onClick={() => {
                      onRecordQuality(drawerPattern.id, 'Good');
                      setDrawerPattern(null);
                    }}
                    type="button"
                    className="p-2 bg-[#77c73d]/20 hover:bg-[#77c73d]/30 border border-[#77c73d]/50 text-[#1f4900] rounded-lg flex flex-col items-center transition-all cursor-pointer"
                  >
                    <span className="font-sans text-[9px] uppercase font-bold">[3] Good</span>
                    <span className="text-[10px] mt-1 font-semibold">→ +1 tier</span>
                  </button>
                  <button
                    onClick={() => {
                      onRecordQuality(drawerPattern.id, 'Easy');
                      setDrawerPattern(null);
                    }}
                    type="button"
                    className="p-2 bg-[#8adddd]/30 hover:bg-[#8adddd]/50 border border-[#8adddd] text-[#006a6a] rounded-lg flex flex-col items-center transition-all cursor-pointer"
                  >
                    <span className="font-sans text-[9px] uppercase font-bold">[4] Easy</span>
                    <span className="text-[10px] mt-1 font-semibold">→ +2 tiers</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-[#f5fbf1] border-t border-[#c9d8be] flex items-center justify-between">
              <button
                onClick={() => {
                  const id = drawerPattern.id;
                  setDrawerPattern(null);
                  onOpenCodex(id);
                }}
                className="text-xs font-serif font-bold text-[#326b00] hover:underline"
              >
                Inspect Full Codex →
              </button>
              <button
                onClick={() => {
                  const id = drawerPattern.id;
                  setDrawerPattern(null);
                  onStartRevision(id);
                }}
                className="px-4 py-2 bg-[#77c73d] text-[#112600] rounded-lg font-serif font-bold text-xs hover:bg-[#68b532] shadow-xs cursor-pointer border border-[#64b02d]"
              >
                Start Focused Recall Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
