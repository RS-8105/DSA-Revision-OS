/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_PATTERNS } from './data/patterns';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { QuickLogModal } from './components/QuickLogModal';
import { AddPatternModal } from './components/AddPatternModal';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './views/DashboardView';
import { PatternLibraryView } from './views/PatternLibraryView';
import { PatternCodexView } from './views/PatternCodexView';
import { ActiveRevisionView } from './views/ActiveRevisionView';
import { RevisionCalendarView } from './views/RevisionCalendarView';
import { AnalyticsView } from './views/AnalyticsView';
import { RevisionHistoryView } from './views/RevisionHistoryView';
import { SettingsView } from './views/SettingsView';
import { authApi, patternsApi, revisionsApi, dashboardApi } from './api';

const STORAGE_KEY = 'dsa_revision_os_patterns_v2';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => authApi.getCachedUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [revisionHistory, setRevisionHistory] = useState([]);

  const [patterns, setPatterns] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_PATTERNS;
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPatternId, setSelectedPatternId] = useState('sliding-window');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isAddPatternOpen, setIsAddPatternOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('dsa_theme') === 'dark';
  });
  const [toastMessage, setToastMessage] = useState(null);

  // Sync dark class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dsa_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dsa_theme', 'light');
    }
  }, [darkMode]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Synchronize with backend data
  const loadBackendData = useCallback(async () => {
    try {
      // 1. Fetch catalog patterns from backend
      const serverPatterns = await patternsApi.getPatterns();
      setBackendConnected(true);

      // 2. If authenticated, fetch user revision progress, history & dashboard metrics
      let userProgressMap = new Map();
      let userHistoryMap = new Map();

      if (authApi.isAuthenticated()) {
        try {
          const [allProgress, rawHistory, dashData] = await Promise.all([
            dashboardApi.getAllProgress(),
            revisionsApi.getHistory(),
            dashboardApi.getDashboard(),
          ]);

          if (dashData) {
            setDashboardData(dashData);
          }
          if (rawHistory) {
            setRevisionHistory(rawHistory);
          }

          for (const prog of allProgress) {
            userProgressMap.set(prog.patternId, prog);
          }

          for (const h of rawHistory) {
            if (!userHistoryMap.has(h.patternId)) {
              userHistoryMap.set(h.patternId, []);
            }
            userHistoryMap.get(h.patternId).push({
              id: `h-${h.id}`,
              sessionNumber: 1,
              date: new Date(h.revisionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              assessment: (h.confidence?.charAt(0).toUpperCase() + h.confidence?.slice(1).toLowerCase()),
              score: 75,
              scoreDelta: '+6%',
              interval: 'normal interval',
              nextTarget: 'Upcoming',
              notes: h.notes || undefined,
            });
          }
        } catch {
          // Progress fetch failed or unauthorized; continue with catalog
        }
      }

      // 3. Merge server catalog & progress with rich codex static definitions
      const isAuth = authApi.isAuthenticated();

      const mergedPatterns = serverPatterns.map((sp) => {
        const staticTemplate =
          INITIAL_PATTERNS.find(
            (p) => p.name.trim().toLowerCase() === sp.name.trim().toLowerCase()
          ) || INITIAL_PATTERNS[0];

        const userProgress = userProgressMap.get(sp.id);
        const userHist = userHistoryMap.get(sp.id) || [];

        // For authenticated users, mastery, scheduling, and history are derived strictly from user records.
        // A newly registered account starts with 0 mastery, 0 revisions, and clean history.
        const mastery = isAuth ? (userProgress ? userProgress.mastery : 0) : staticTemplate.mastery;
        const masteryLevel =
          mastery >= 85
            ? 'Mastered'
            : mastery >= 70
            ? 'Strong'
            : mastery >= 50
            ? 'Needs Practice'
            : 'Learning';

        const sessionsCount = isAuth
          ? (userProgress ? userProgress.revisionCount : 0)
          : staticTemplate.sessionsCount;

        const history = isAuth ? userHist : (userHist.length > 0 ? userHist : staticTemplate.history);
        const isDueToday = isAuth ? (userProgress ? userProgress.isDueToday : false) : staticTemplate.isDueToday;
        const isOverdue = isAuth ? (userProgress ? userProgress.isOverdue : false) : staticTemplate.isOverdue;

        const nextTarget = isAuth
          ? (userProgress?.nextRevision
              ? (userProgress.isDueToday
                  ? 'Due Today'
                  : userProgress.isOverdue
                  ? 'Overdue'
                  : `Due ${userProgress.nextRevision}`)
              : 'Not scheduled')
          : staticTemplate.nextTarget;

        const nextTargetDate = isAuth
          ? (userProgress?.nextRevision || '—')
          : staticTemplate.nextTargetDate;

        const activeInterval = isAuth
          ? (userProgress?.nextRevision ? `${userProgress.intervalDays || 1}d` : '1d')
          : staticTemplate.activeInterval;

        const spacedStage = isAuth
          ? (userProgress ? Math.min(5, Math.max(1, Math.floor(userProgress.mastery / 20) + 1)) : 1)
          : staticTemplate.spacedStage;

        const lastRevised = isAuth
          ? (userProgress?.lastRevised ? userProgress.lastRevised : 'Not yet')
          : staticTemplate.lastRevised;

        const lastRevisedDaysAgo = isAuth
          ? (userProgress?.lastRevised ? `${userProgress.lastRevised}` : 'Never')
          : staticTemplate.lastRevisedDaysAgo;

        return {
          ...staticTemplate,
          id: staticTemplate.id || String(sp.id),
          backendId: sp.id,
          name: sp.name,
          category: sp.category || staticTemplate.category,
          difficulty: sp.difficulty || staticTemplate.difficulty,
          whenToUse: sp.description || staticTemplate.whenToUse,
          mastery,
          masteryLevel,
          sessionsCount,
          history,
          isDueToday,
          isOverdue,
          nextTarget,
          nextTargetDate,
          activeInterval,
          spacedStage,
          lastRevised,
          lastRevisedDaysAgo,
        };
      });

      if (mergedPatterns.length > 0) {
        setPatterns(mergedPatterns);
      }
    } catch {
      // Backend not running; keep offline localStorage/initial patterns
      setBackendConnected(false);
    }
  }, []);

  // Validate session on mount
  useEffect(() => {
    if (authApi.isAuthenticated()) {
      authApi.getCurrentUser()
        .then((user) => {
          if (user) {
            setCurrentUser(user);
          }
        })
        .catch(() => {
          authApi.logout();
          setCurrentUser(null);
          setDashboardData(null);
          setRevisionHistory([]);
        });
    }
  }, []);

  // Initial mount load
  useEffect(() => {
    loadBackendData();
  }, [loadBackendData, currentUser]);

  // Listen for unauthorized 401 events to prompt login
  useEffect(() => {
    const handleUnauthorized = () => {
      authApi.logout();
      setCurrentUser(null);
      setDashboardData(null);
      setRevisionHistory([]);
      setIsAuthOpen(true);
      showToast('Session expired. Please sign in again.');
      loadBackendData();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [loadBackendData]);

  // Save to localStorage as fallback for offline guest mode only
  useEffect(() => {
    try {
      if (!currentUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
      }
    } catch {
      // ignore
    }
  }, [patterns, currentUser]);

  // Global Ctrl+K hotkey
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('header input');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedPattern = patterns.find((p) => p.id === selectedPatternId) || patterns[0];
  const dueCount = patterns.filter((p) => p.isDueToday || p.isOverdue).length;

  // Handlers
  const handleStartRevision = (patternId) => {
    if (patternId) setSelectedPatternId(patternId);
    setCurrentView('todays-revisions');
  };

  const handleOpenCodex = (patternId) => {
    setSelectedPatternId(patternId);
    setCurrentView('pattern-codex');
  };

  const handleRecordQuality = async (
    patternId,
    assessment,
    notes = ''
  ) => {
    const targetPattern = patterns.find((p) => p.id === patternId);
    if (!targetPattern) return;

    // If authenticated and pattern has a backend ID, sync with Spring Boot
    if (authApi.isAuthenticated() && targetPattern.backendId) {
      try {
        const res = await revisionsApi.recordRevision(
          targetPattern.backendId,
          assessment.toUpperCase(),
          notes
        );

        setPatterns((prev) =>
          prev.map((p) => {
            if (p.id !== patternId) return p;

            const newScore = res.mastery;
            const newHistory = [
              {
                id: `h-${Date.now()}`,
                sessionNumber: res.revisionCount,
                date: 'Today',
                assessment,
                score: newScore,
                scoreDelta: `+${res.intervalDays}d`,
                interval: `${res.intervalDays}d interval`,
                nextTarget: res.nextRevision,
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
              spacedStage: Math.min(5, p.spacedStage + (assessment === 'Easy' ? 2 : assessment === 'Good' ? 1 : 0)),
              activeInterval: `${res.intervalDays}d`,
              lastRevised: 'Today',
              lastRevisedDaysAgo: 'Just now',
              nextTarget: `Due ${res.nextRevision}`,
              nextTargetDate: res.nextRevision,
              isDueToday: false,
              isOverdue: false,
              sessionsCount: res.revisionCount,
              history: newHistory,
            };
          })
        );

        showToast(`✓ Server updated for ${targetPattern.name}: ${assessment} (${res.intervalDays}d interval)`);
        await loadBackendData();
        return;
      } catch (err) {
        showToast(`Backend sync notice: ${err?.message || 'Using local update'}`);
      }
    }

    // Local state fallback calculation
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

    setRevisionHistory((prev) => [
      {
        id: `h-${Date.now()}`,
        patternId: targetPattern.backendId || targetPattern.id,
        patternName: targetPattern.name,
        patternCategory: targetPattern.category,
        date: 'Today',
        revisionDate: new Date().toISOString(),
        assessment,
        confidence: assessment.toUpperCase(),
        score: targetPattern.mastery,
        scoreDelta:
          assessment === 'Easy'
            ? '+12%'
            : assessment === 'Good'
            ? '+6%'
            : assessment === 'Struggled'
            ? '0%'
            : '-10%',
        interval: targetPattern.activeInterval || '1d',
        notes: notes || `Logged with ${assessment} recall rating.`,
      },
      ...prev,
    ]);

    showToast(`✓ Recall recorded for ${targetPattern.name}: ${assessment} (Local)`);
  };

  const handleAdvancePattern = (
    patternId,
    assessment,
    notes = ''
  ) => {
    handleRecordQuality(patternId, assessment, notes);
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

  const handleAddPattern = async (newPattern) => {
    // If authenticated, sync pattern to backend
    if (authApi.isAuthenticated()) {
      try {
        const created = await patternsApi.createPattern({
          name: newPattern.name,
          category: newPattern.category,
          difficulty: newPattern.difficulty,
          description: newPattern.whenToUse,
        });
        newPattern.backendId = created.id;
      } catch {
        // Fallback to local
      }
    }
    setPatterns((prev) => [newPattern, ...prev]);
    showToast(`✓ Added "${newPattern.name}" to pattern library`);
  };

  const handleUpdatePattern = async (updated) => {
    // If practice problem added and pattern has backend ID, sync
    if (authApi.isAuthenticated() && updated.backendId) {
      const orig = patterns.find((p) => p.id === updated.id);
      if (orig && updated.problems.length > orig.problems.length) {
        const latestProb = updated.problems[updated.problems.length - 1];
        try {
          await patternsApi.addProblem(updated.backendId, {
            title: latestProb.title,
            difficulty: latestProb.difficulty,
            link: latestProb.url || '',
          });
        } catch {
          // Ignore
        }
      }
    }
    setPatterns((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast('✓ Notes and practice suite updated');
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    showToast(`✓ Welcome, ${user.name}! Connected to PostgreSQL.`);
    loadBackendData();
  };

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    showToast('Signed out of workspace.');
    loadBackendData();
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
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
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
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode(!darkMode)}
        />

        <main className="relative pt-14 w-full px-8 min-h-screen bg-[#f5fbf1]">
          {currentView === 'dashboard' && (
            <DashboardView
              patterns={patterns}
              dashboardData={dashboardData}
              revisionHistory={revisionHistory}
              onStartRevision={handleStartRevision}
              onOpenCodex={handleOpenCodex}
              onOpenQuickLog={() => setIsQuickLogOpen(true)}
            />
          )}

          {currentView === 'pattern-library' && (
            <PatternLibraryView
              patterns={patterns}
              dashboardData={dashboardData}
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
              revisionHistory={revisionHistory}
              onOpenCodex={handleOpenCodex}
              onStartRevision={handleStartRevision}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView
              patterns={patterns}
              dashboardData={dashboardData}
              revisionHistory={revisionHistory}
            />
          )}

          {currentView === 'revision-history' && (
            <RevisionHistoryView
              patterns={patterns}
              revisionHistory={revisionHistory}
              onOpenCodex={handleOpenCodex}
            />
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

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    </div>
  );
}
