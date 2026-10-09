import React from 'react';
import { NavView } from './Sidebar';

interface HeaderProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenQuickLog: () => void;
  selectedPatternName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenQuickLog,
  selectedPatternName,
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
            className="bg-[#f5fbf1] border border-[#c9d8be] rounded-lg pl-8 pr-16 py-1.5 font-serif text-sm text-[#111f09] placeholder:text-[#6f7d66] focus:outline-none focus:border-[#77c73d] focus:bg-white text-xs w-64 lg:w-84 transition-all"
          />
          <span className="absolute right-2 font-sans text-[10px] px-1.5 py-0.5 rounded border border-[#c9d8be] text-[#526b3e] bg-white pointer-events-none">
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

        {/* Avatar */}
        <div className="relative flex items-center pl-1">
          <img
            alt="Alex Rivera Profile"
            className="w-8 h-8 rounded-full object-cover border border-[#c9d8be] cursor-pointer hover:ring-2 hover:ring-[#77c73d]/50 transition-all"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA5O1flYku-0CRF2usfdfghJswpjMxTc115R9NFtxU6UyQb8oqGCTf83SZwNG4JjOIdKt_-x-AAkNkiX2V7JSmnRwm07BRZuXeRg4NeHywGmtC0pRVrsECqKNmdPlsdUZfC8T-2CsHay8c5mAmtBam31qJbzxbJaEo4BAjKKUOEQqIMdVw7nnzTQH5IAZs89QHEnoVATmLD7uE6ZqxA0TyJKLsdZdc4ts8nAbInXrM9XDPvMc_sc78"
          />
        </div>
      </div>
    </header>
  );
};
