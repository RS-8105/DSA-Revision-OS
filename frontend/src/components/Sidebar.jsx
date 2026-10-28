import React from 'react';

export const Sidebar = ({
  currentView,
  onNavigate,
  dueCount,
  darkMode,
  onToggleTheme,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'pattern-library', label: 'Pattern Library', icon: 'layers' },
    {
      id: 'todays-revisions',
      label: "Today's Revisions",
      icon: 'check_circle',
      badge: `${dueCount} due`,
    },
    { id: 'revision-calendar', label: 'Revision Calendar', icon: 'calendar_today' },
    { id: 'analytics', label: 'Analytics', icon: 'bar_chart' },
    { id: 'revision-history', label: 'Revision History', icon: 'history' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#c9d8be]/70 z-50 flex flex-col justify-between shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col">
        {/* Brand Lockup */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="h-14 px-4 flex items-center gap-2.5 border-b border-[#c9d8be]/50 bg-white hover:bg-[#f5fbf1] transition-colors text-left w-full cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1b3a08] to-[#326b00] border border-[#64b02d]/40 flex items-center justify-center flex-shrink-0 shadow-xs">
            <svg
              className="w-5 h-5 text-[#8ee055]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="5" r="2.5" fill="#77c73d" />
              <circle cx="6" cy="18" r="2" fill="#77c73d" />
              <circle cx="18" cy="18" r="2" fill="#77c73d" />
              <path d="M12 7.5v4M12 11.5l-6 4.5M12 11.5l6 4.5" stroke="#a9f071" strokeWidth="1.75" />
              <path d="M7 9a6 6 0 0 1 10 0" stroke="#77c73d" strokeWidth="1.25" strokeDasharray="1.5 1.5" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-[16px] text-[#255400] tracking-wide font-bold leading-tight truncate">
              DSA Revision OS
            </span>
            <span className="font-sans text-[9px] uppercase tracking-widest text-[#526b3e] font-semibold">
              Spaced Repetition
            </span>
          </div>
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
          {currentUser ? (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#77c73d]/20 border border-[#77c73d] flex items-center justify-center text-[#255400] font-bold text-xs flex-shrink-0">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-serif font-bold text-sm text-[#111f09] truncate">
                  {currentUser.name}
                </div>
                <div className="font-sans text-[10px] text-[#526b3e] truncate font-medium">
                  {currentUser.email}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#77c73d]/20 hover:bg-[#77c73d]/30 text-[#255400] border border-[#77c73d]/50 font-serif text-xs font-bold transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In / Demo</span>
            </button>
          )}

          <div className="flex items-center gap-1">
            {currentUser && onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out"
                aria-label="Sign Out"
                className="p-1.5 text-[#526b3e] hover:text-[#ba1a1a] rounded hover:bg-[#ffdad6]/40 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            )}
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
      </div>
    </aside>
  );
};
