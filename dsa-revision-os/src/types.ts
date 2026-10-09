export type MasteryLevel = 'Mastered' | 'Strong' | 'Needs Practice' | 'Learning';

export type Category =
  | 'Arrays & Strings'
  | 'Binary Search'
  | 'Linked Lists'
  | 'Stack & Queue'
  | 'Trees'
  | 'Graphs'
  | 'Greedy'
  | 'Backtracking'
  | 'Dynamic Programming';

export type IntervalNode = '1D' | '3D' | '7D' | '14D' | '30D';

export interface AuditSession {
  id: string;
  sessionNumber: number;
  date: string;
  assessment: 'Easy' | 'Good' | 'Struggled' | 'Forgot';
  score: number;
  scoreDelta: string;
  interval: string;
  nextTarget: string;
  notes?: string;
}

export interface PracticeProblem {
  id: string;
  number: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  confidence: string; // e.g., '5/5'
  platform: string; // 'LeetCode'
  tag?: string; // 'Monotonic Deque'
  status: 'Mastered' | 'Needs Review' | 'Review Scheduled';
  url?: string;
}

export interface Pattern {
  id: string;
  name: string;
  category: Category;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Medium-Hard';
  mastery: number; // percentage 0 - 100
  masteryLevel: MasteryLevel;
  spacedStage: number; // e.g., 4
  activeInterval: string; // e.g., '7d'
  lastRevised: string; // e.g., 'Oct 21'
  lastRevisedDaysAgo: string; // e.g., '3d ago'
  nextTarget: string; // e.g., 'Due Today (Oct 24)'
  nextTargetDate: string; // e.g., 'Oct 24'
  ladderInterval: IntervalNode;
  isDueToday?: boolean;
  isOverdue?: boolean;
  overdueText?: string; // e.g., 'Overdue (2d late)'
  sessionsCount: number;
  complexityTime: string; // 'O(N)'
  complexitySpace: string; // 'O(1) / O(K)'
  subproblemOrType?: string; // 'Fixed & Dynamic'
  
  // Codex Mental Model
  whenToUse: string;
  recognitionClues: string[];
  windowInvariants: string;
  commonGotchas: string;
  formalInvariant: string;
  criticalTraps: string;
  
  // Code blueprint
  codeSnippet: {
    language: string;
    code: string;
  };
  
  // Recall inquiry
  inquiryPrompt: string;
  defaultRecallNote: string;
  
  // Practice Suite
  problems: PracticeProblem[];
  
  // Audit Ledger
  history: AuditSession[];
}
