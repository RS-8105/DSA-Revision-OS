import React, { useState, useMemo } from 'react';

export const RevisionCalendarView = ({
  patterns = [],
  revisionHistory = [],
  onOpenCodex,
  onStartRevision,
}) => {
  const [activeDate, setActiveDate] = useState(() => new Date());

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const monthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(activeDate);

  const prevMonth = () => {
    setActiveDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setActiveDate(new Date(year, month + 1, 1));
  };

  const resetToToday = () => {
    setActiveDate(new Date());
  };

  // Calendar math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday

  const today = new Date();
  const isCurrentRealMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDayNumber = today.getDate();

  // Map patterns and history onto days of the month
  const calendarDays = useMemo(() => {
    const days = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = isCurrentRealMonth && d === todayDayNumber;
      const isFuture =
        year > today.getFullYear() ||
        (year === today.getFullYear() && month > today.getMonth()) ||
        (isCurrentRealMonth && d > todayDayNumber);

      // Find patterns due on this date
      const duePatterns = patterns.filter((p) => {
        if (isToday && p.isDueToday) return true;
        const targetDate = p.nextRevision || p.nextTargetDate;
        return targetDate && targetDate.startsWith(dateStr);
      });

      // Find revisions recorded on this date
      const revisedPatterns = revisionHistory.filter((h) => {
        const hDate = h.revisionDate || h.date;
        return hDate && hDate.startsWith(dateStr);
      });

      // Unique pattern entries for this day
      const dayEntries = [];
      const seen = new Set();

      duePatterns.forEach((p) => {
        if (!seen.has(p.name)) {
          seen.add(p.name);
          dayEntries.push({
            id: p.id,
            name: p.name,
            type: isToday ? 'due-today' : isFuture ? 'due-future' : 'overdue',
          });
        }
      });

      revisedPatterns.forEach((h) => {
        const name = h.patternName || h.pattern?.name;
        if (name && !seen.has(name)) {
          seen.add(name);
          dayEntries.push({
            id: h.patternId || h.pattern?.id,
            name,
            type: 'completed',
          });
        }
      });

      days.push({
        day: d,
        dateStr,
        isToday,
        isFuture,
        entries: dayEntries,
      });
    }

    return days;
  }, [year, month, daysInMonth, isCurrentRealMonth, todayDayNumber, patterns, revisionHistory]);

  // Aggregate monthly stats
  const totalDueThisMonth = calendarDays.reduce(
    (acc, cd) => acc + cd.entries.filter((e) => e.type.startsWith('due')).length,
    0
  );
  const totalCompletedThisMonth = calendarDays.reduce(
    (acc, cd) => acc + cd.entries.filter((e) => e.type === 'completed').length,
    0
  );

  return (
    <div className="flex flex-col w-full pb-16 space-y-6 pt-2">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-[#c9d8be]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#326b00]">calendar_month</span>
            <h1 className="font-serif text-3xl font-bold text-[#111f09]">Revision Calendar</h1>
          </div>
          <p className="font-serif text-sm text-[#414a38] mt-1">
            Live spaced repetition pipeline and audit ledger projected across the calendar.
          </p>
        </div>

        {/* Navigation & Month Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetToToday}
            type="button"
            className="px-2.5 py-1 text-xs font-serif font-bold text-[#326b00] bg-[#eef7e8] border border-[#c9d8be] rounded-lg hover:bg-[#e2f2da] transition-colors cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center border border-[#c9d8be] rounded-lg bg-[#f5fbf1] overflow-hidden">
            <button
              onClick={prevMonth}
              type="button"
              className="p-1.5 text-[#526b3e] hover:text-[#111f09] hover:bg-[#eef7e8] transition-colors cursor-pointer"
              aria-label="Previous Month"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="font-serif font-bold text-sm text-[#111f09] px-3 py-1">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              type="button"
              className="p-1.5 text-[#526b3e] hover:text-[#111f09] hover:bg-[#eef7e8] transition-colors cursor-pointer"
              aria-label="Next Month"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-[#c9d8be]/60 shadow-xs flex items-center justify-between">
          <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e]">Due / Scheduled</span>
          <span className="font-serif font-bold text-lg text-[#326b00]">{totalDueThisMonth}</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-[#c9d8be]/60 shadow-xs flex items-center justify-between">
          <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e]">Completed This Month</span>
          <span className="font-serif font-bold text-lg text-[#006a6a]">{totalCompletedThisMonth}</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-[#c9d8be]/60 shadow-xs flex items-center justify-between">
          <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e]">Active Interval Max</span>
          <span className="font-serif font-bold text-lg text-[#111f09]">30D Stage</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-[#c9d8be]/60 shadow-xs flex items-center justify-between">
          <span className="font-sans text-[10px] uppercase tracking-wider text-[#526b3e]">SRS Algorithm</span>
          <span className="font-serif font-bold text-xs text-[#255400]">SM-2 Leitner</span>
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
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div
              key={`pad-${i}`}
              className="h-28 p-2 rounded-lg bg-[#f5fbf1]/40 border border-dashed border-[#c9d8be]/30 opacity-40"
            ></div>
          ))}

          {calendarDays.map((cd) => (
            <div
              key={cd.day}
              className={`h-28 p-2 rounded-lg border flex flex-col justify-between transition-all ${
                cd.isToday
                  ? 'bg-[#eef7e8] border-[#77c73d] ring-2 ring-[#77c73d]/30'
                  : cd.entries.length > 0
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
                {cd.entries.slice(0, 2).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => item.id && onOpenCodex && onOpenCodex(item.id)}
                    type="button"
                    title={item.name}
                    className={`font-serif text-[11px] truncate px-1.5 py-0.5 rounded text-left border cursor-pointer transition-colors ${
                      item.type === 'due-today'
                        ? 'bg-[#77c73d]/25 text-[#1b4400] border-[#77c73d]/60 font-bold hover:bg-[#77c73d]/40'
                        : item.type === 'completed'
                        ? 'bg-[#cee5ff]/40 text-[#004a76] border-[#286290]/30 hover:bg-[#cee5ff]/60'
                        : item.type === 'overdue'
                        ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30 hover:bg-[#feefed]'
                        : 'bg-[#f5fbf1] border-[#c9d8be]/50 text-[#2d451b] hover:bg-[#eef7e8]'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
                {cd.entries.length > 2 && (
                  <span className="font-sans text-[9px] text-[#526b3e] font-semibold pl-1">
                    +{cd.entries.length - 2} more
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
