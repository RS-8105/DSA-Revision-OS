/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_PATTERNS } from './data/patterns';
import { Pattern } from './types';
import { Sidebar, NavView } from './components/Sidebar';
import { Header } from './components/Header';
import { QuickLogModal } from './components/QuickLogModal';
import { AddPatternModal } from './components/AddPatternModal';
import { DashboardView } from './views/DashboardView';
import { PatternLibraryView } from './views/PatternLibraryView';
import { PatternCodexView } from './views/PatternCodexView';
import { ActiveRevisionView } from './views/ActiveRevisionView';
import { RevisionCalendarView } from './views/RevisionCalendarView';
import { AnalyticsView } from './views/AnalyticsView';
import { RevisionHistoryView } from './views/RevisionHistoryView';
import { SettingsView } from './views/SettingsView';

const STORAGE_KEY = 'dsa_revision_os_patterns_v2';

export default function App() {
  const [patterns, setPatterns] = useState<Pattern[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_PATTERNS;
  });

  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [selectedPatternId, setSelectedPatternId] = useState<string>('sliding-window');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isAddPatternOpen, setIsAddPatternOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
    } catch {
      // ignore
    }
  }, [patterns]);

  // Global Ctrl+K hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('header input') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedPattern = patterns.find((p) => p.id === selectedPatternId) || patterns[0];
  const dueCount = patterns.filter((p) => p.isDueToday || p.isOverdue).length;

  // Handlers
  const handleStartRevision = (patternId?: string) => {
    if (patternId) setSelectedPatternId(patternId);
    setCurrentView('todays-revisions');
  };

  const handleOpenCodex = (patternId: string) => {
    setSelectedPatternId(patternId);
    setCurrentView('pattern-codex');
  };

  const handleRecordQuality = (
    patternId: string,
    assessment: 'Easy' | 'Good' | 'Struggled' | 'Forgot',
    notes: string = ''
  ) => {
    setPatterns((prev) =>
      prev.map((p) => {
        if (p.id !== patternId) return p;

        let deltaScore = 0;
        let newInterval = p.activeInterval;
        let newStage = p.spacedStage;
        let nextTarget = 'in 7d';

        if (assessment === 'Easy') {
          deltaScore = 12;
          newInterval = '30d';
          newStage = Math.min(5, p.spacedStage + 2);
          nextTarget = 'in 30d';
        } else if (assessment === 'Good') {
          deltaScore = 6;
          newInterval = '14d';
          newStage = Math.min(5, p.spacedStage + 1);
          nextTarget = 'in 14d';
        } else if (assessment === 'Struggled') {
          deltaScore = 0;
          newInterval = '3d';
          nextTarget = 'in 3d';
        } else {
          deltaScore = -10;
          newInterval = '1d';
          newStage = Math.max(1, p.spacedStage - 1);
          nextTarget = 'Tomorrow';
        }

        const newScore = Math.min(100, Math.max(0, p.mastery + deltaScore));
        const newHistory = [
          {
            id: `h-${Date.now()}`,
            sessionNumber: p.sessionsCount + 1,
            date: 'Today',
            assessment,
            score: newScore,
            scoreDelta: deltaScore >= 0 ? `+${deltaScore}%` : `${deltaScore}%`,
            interval: `${newInterval} interval`,
            nextTarget,
            notes: notes || `Logged with ${assessment} recall rating.`,
          },
          ...p.history,
        ];

        return {
          ...p,
          mastery: newScore,
          masteryLevel:
            newScore >= 85
              ? 'Mastered'
              : newScore >= 70
              ? 'Strong'
              : newScore >= 50
              ? 'Needs Practice'
              : 'Learning',
          spacedStage: newStage,
          activeInterval: newInterval,
          lastRevised: 'Today',
          lastRevisedDaysAgo: 'Just now',
          nextTarget,
          isDueToday: false,
          isOverdue: false,
          sessionsCount: p.sessionsCount + 1,
          history: newHistory,
        };
      })
    );

    showToast(`✓ Recall recorded for ${patterns.find((p) => p.id === patternId)?.name}: ${assessment}`);
  };

  const handleAdvancePattern = (
    patternId: string,
    assessment: 'Easy' | 'Good' | 'Struggled' | 'Forgot'
  ) => {
    handleRecordQuality(patternId, assessment);
    // Find next due pattern in queue
    const remainingDue = patterns.filter(
      (p) => p.id !== patternId && (p.isDueToday || p.isOverdue)
    );

    if (remainingDue.length > 0) {
      setSelectedPatternId(remainingDue[0].id);
      showToast(`Saved! Advancing to ${remainingDue[0].name}`);
    } else {
      setCurrentView('dashboard');
      showToast('🎉 Congratulations! All revision queue items completed today!');
    }
  };

  const handleAddPattern = (newPattern: Pattern) => {
    setPatterns((prev) => [newPattern, ...prev]);
    showToast(`✓ Added "${newPattern.name}" to pattern library`);
  };

  const handleUpdatePattern = (updated: Pattern) => {
    setPatterns((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast('✓ Notes and practice suite updated');
  };

  return (
    <div className={`min-h-screen bg-[#f5fbf1] text-[#111f09] antialiased ${darkMode ? 'dark' : ''}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#111f09] text-white px-4 py-2.5 rounded-lg shadow-lg font-serif text-sm flex items-center gap-2 border border-[#77c73d]/50 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#77c73d] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        dueCount={dueCount}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
      />

      {/* Main Content Area */}
      <div className="pl-64">
        <Header
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenQuickLog={() => setIsQuickLogOpen(true)}
          selectedPatternName={selectedPattern?.name}
        />

        <main className="relative pt-14 w-full px-8 min-h-screen bg-[#f5fbf1]">
          {currentView === 'dashboard' && (
            <DashboardView
              patterns={patterns}
              onStartRevision={handleStartRevision}
              onOpenCodex={handleOpenCodex}
              onOpenQuickLog={() => setIsQuickLogOpen(true)}
            />
          )}

          {currentView === 'pattern-library' && (
            <PatternLibraryView
              patterns={patterns}
              onOpenCodex={handleOpenCodex}
              onStartRevision={handleStartRevision}
              onOpenAddPattern={() => setIsAddPatternOpen(true)}
              onRecordQuality={handleRecordQuality}
            />
          )}

          {currentView === 'todays-revisions' && (
            <ActiveRevisionView
              pattern={selectedPattern}
              patternsList={patterns}
              onExitSession={() => setCurrentView('dashboard')}
              onAdvancePattern={handleAdvancePattern}
            />
          )}

          {currentView === 'pattern-codex' && (
            <PatternCodexView
              pattern={selectedPattern}
              onStartRevision={handleStartRevision}
              onBackToLibrary={() => setCurrentView('pattern-library')}
              onUpdatePattern={handleUpdatePattern}
            />
          )}

          {currentView === 'revision-calendar' && (
            <RevisionCalendarView
              patterns={patterns}
              onOpenCodex={handleOpenCodex}
              onStartRevision={handleStartRevision}
            />
          )}

          {currentView === 'analytics' && <AnalyticsView patterns={patterns} />}

          {currentView === 'revision-history' && (
            <RevisionHistoryView patterns={patterns} onOpenCodex={handleOpenCodex} />
          )}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        patterns={patterns}
        onSaveLog={(patternId, assessment, notes) =>
          handleRecordQuality(patternId, assessment, notes)
        }
      />

      <AddPatternModal
        isOpen={isAddPatternOpen}
        onClose={() => setIsAddPatternOpen(false)}
        onAddPattern={handleAddPattern}
      />
    </div>
  );
}
