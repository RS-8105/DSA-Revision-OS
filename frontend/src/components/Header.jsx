import React from 'react';

export const Header = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenQuickLog,
  selectedPatternName,
  currentUser,
  onOpenAuth,
  darkMode,
  onToggleTheme,
}) => {
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'pattern-library':
        return 'Pattern Library';
      case 'todays-revisions':
        return "Today's Revisions";
      case 'pattern-codex':
        return selectedPatternName || 'Pattern Codex';
      case 'revision-calendar':
        return 'Revision Calendar';
      case 'analytics':
        return 'Analytics';
      case 'revision-history':
        return 'Revision History';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-white/95 backdrop-blur-md border-b border-[#c9d8be]/60 z-40 px-6 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Breadcrumb Trail */}
      <div className="flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-wider text-[#3f562e]">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-[#526b3e] hover:text-[#326b00] transition-colors"
        >
          DSA Revision OS
        </button>
        <span className="text-[#c9d8be]">/</span>
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-[#526b3e] hover:text-[#326b00] transition-colors"
        >
          Workspace
        </button>
        <span className="text-[#c9d8be]">/</span>
        <span className="text-[#326b00] font-bold">{getViewTitle()}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-[#526b3e] text-[16px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search patterns, topics, complexity..."
            className="bg-[#f5fbf1] border border-[#c9d8be] rounded-lg pl-8 pr-16 py-1.5 font-serif text-sm text-[#111f09] placeholder:text-[#6f7d66] focus:outline-none focus:border-[#77c73d] focus:bg-white dark:focus:bg-[#182414] text-xs w-64 lg:w-84 transition-all"
          />
          <span className="absolute right-2 font-sans text-[10px] px-1.5 py-0.5 rounded border border-[#c9d8be] text-[#526b3e] bg-white dark:bg-[#182414] dark:text-[#a5b89a] pointer-events-none">
            Ctrl K
          </span>
        </div>

        {/* Quick Log Button */}
        <button
          onClick={onOpenQuickLog}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#77c73d] text-[#112600] font-serif font-bold text-xs rounded-lg hover:bg-[#89db4f] transition-all shadow-xs border border-[#64b02d] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>+ Quick Log</span>
        </button>

        {/* Notifications Icon */}
        <button
          aria-label="Notifications"
          type="button"
          className="relative p-1.5 text-[#3f562e] hover:text-[#111f09] transition-colors rounded-lg hover:bg-[#eef7e8]"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#77c73d] ring-2 ring-white"></span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          type="button"
          className="p-1.5 text-[#3f562e] hover:text-[#111f09] transition-colors rounded-lg hover:bg-[#eef7e8] cursor-pointer"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Avatar */}
        <div className="relative flex items-center pl-1">
          {currentUser ? (
            <button
              onClick={onOpenAuth}
              title={`Logged in as ${currentUser.name} (${currentUser.email})`}
              className="w-8 h-8 rounded-full bg-[#77c73d]/20 border border-[#77c73d] flex items-center justify-center text-[#255400] font-bold text-xs cursor-pointer hover:ring-2 hover:ring-[#77c73d]/50 transition-all"
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-serif font-bold text-[#326b00] bg-[#eef7e8] border border-[#c9d8be] rounded-lg hover:bg-[#e2f2da] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
