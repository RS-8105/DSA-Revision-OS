import React from 'react';

export type NavView =
  | 'dashboard'
  | 'pattern-library'
  | 'todays-revisions'
  | 'pattern-codex'
  | 'revision-calendar'
  | 'analytics'
  | 'revision-history'
  | 'settings';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  dueCount: number;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  dueCount,
  darkMode,
  onToggleTheme,
}) => {
  const navItems = [
    { id: 'dashboard' as NavView, label: 'Dashboard', icon: 'grid_view' },
    { id: 'pattern-library' as NavView, label: 'Pattern Library', icon: 'layers' },
    {
      id: 'todays-revisions' as NavView,
      label: "Today's Revisions",
      icon: 'check_circle',
      badge: `${dueCount} due`,
    },
    { id: 'revision-calendar' as NavView, label: 'Revision Calendar', icon: 'calendar_today' },
    { id: 'analytics' as NavView, label: 'Analytics', icon: 'bar_chart' },
    { id: 'revision-history' as NavView, label: 'Revision History', icon: 'history' },
    { id: 'settings' as NavView, label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#c9d8be]/70 z-50 flex flex-col justify-between shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col">
        {/* Brand Lockup */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="h-14 px-4 flex items-center gap-2 border-b border-[#c9d8be]/50 bg-white hover:bg-[#f5fbf1] transition-colors text-left w-full"
        >
          <img
            alt="DSA Revision OS Emblem"
            className="h-8 w-auto object-contain flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VfNlxfcihquN1DHQXsbT_rf9t9LXLz8ykQPrbeynnMK07wA4d16qU_Ig7YV4hRfal_2j4-na8SyEJsu053FNxpFsD6kC18K08G14SQnedbVywx2L_FoDj2ucnJK1f47BOiA1_PNK5qhxzH8G8slh51o01ovRFASclfOHgQ5i_AbxiOZesQSrMmOqm9YqMQ-Llger5yyP5UxZUMB20ot4uRb78lTF08QZLR4EwneRqryjjiHvRrkjHiOA0"
          />
          <span className="font-serif text-lg text-[#326b00] tracking-wide font-bold">
            DSA Revision OS
          </span>
        </button>

        {/* Navigation list */}
        <div className="px-4 py-3">
          <div className="font-sans text-[10px] uppercase tracking-widest text-[#526b3e] mb-2 font-semibold">
            Curriculum Core
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                currentView === item.id ||
                (item.id === 'pattern-library' && currentView === 'pattern-codex');

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left w-full ${
                    isActive
                      ? 'bg-[#eef7e8] text-[#326b00] font-bold shadow-xs'
                      : 'text-[#3f562e] hover:bg-[#eef7e8]/60 hover:text-[#111f09]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        isActive ? 'text-[#326b00]' : 'text-[#526b3e]'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-serif text-base">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="font-sans text-[10px] px-1.5 py-0.5 rounded bg-[#77c73d]/20 text-[#255400] border border-[#77c73d]/50 uppercase font-bold tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User profile & footer */}
      <div className="p-3 border-t border-[#c9d8be]/50 bg-[#eef7e8]/40">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-[#c9d8be] flex-shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA5O1flYku-0CRF2usfdfghJswpjMxTc115R9NFtxU6UyQb8oqGCTf83SZwNG4JjOIdKt_-x-AAkNkiX2V7JSmnRwm07BRZuXeRg4NeHywGmtC0pRVrsECqKNmdPlsdUZfC8T-2CsHay8c5mAmtBam31qJbzxbJaEo4BAjKKUOEQqIMdVw7nnzTQH5IAZs89QHEnoVATmLD7uE6ZqxA0TyJKLsdZdc4ts8nAbInXrM9XDPvMc_sc78"
            />
            <div className="min-w-0">
              <div className="font-serif font-bold text-sm text-[#111f09] truncate">
                Alex Rivera
              </div>
              <div className="font-sans text-[10px] text-[#526b3e] truncate font-medium">
                SWE Prep · Level 4
              </div>
            </div>
          </div>
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 text-[#526b3e] hover:text-[#326b00] rounded hover:bg-[#eef7e8] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {darkMode ? 'dark_mode' : 'light_mode'}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
