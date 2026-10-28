import React, { useState } from 'react';

export const AddPatternModal = ({
  isOpen,
  onClose,
  onAddPattern,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Arrays & Strings');
  const [difficulty, setDifficulty] = useState('Medium');
  const [whenToUse, setWhenToUse] = useState('');
  const [invariant, setInvariant] = useState('');
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newPattern = {
      id,
      name: name.trim(),
      category,
      difficulty,
      mastery: 50,
      masteryLevel: 'Needs Practice',
      spacedStage: 1,
      activeInterval: '1d',
      lastRevised: 'Today',
      lastRevisedDaysAgo: 'Just now',
      nextTarget: 'in 1d',
      nextTargetDate: 'Tomorrow',
      ladderInterval: '1D',
      sessionsCount: 1,
      complexityTime: 'O(N)',
      complexitySpace: 'O(1)',
      whenToUse: whenToUse || 'Custom pattern formulation for specific recurrence problem bounds.',
      recognitionClues: [
        'Lexical cues matching problem parameters.',
        'Invariant condition maintenance.'
      ],
      windowInvariants: invariant || 'Monotonic invariant bounds.',
      commonGotchas: 'Edge case bounds at indices 0 and N-1.',
      formalInvariant: invariant || 'State invariant holds before and after each loop iteration.',
      criticalTraps: 'Off-by-one errors and unbounded state mutation.',
      codeSnippet: {
        language: 'cpp',
        code: code || `// Canonical template for ${name}\nvoid solve() {\n    // Implementation logic\n}`
      },
      inquiryPrompt: `Define the core invariant and algorithmic blueprint for ${name}.`,
      defaultRecallNote: `Key mental model for ${name}: Maintain invariant across linear or tree state progression.`,
      problems: [
        {
          id: `${id}-1`,
          number: '#0001',
          title: `${name} Benchmark Archetype`,
          difficulty: difficulty === 'Medium-Hard' ? 'Medium' : difficulty,
          confidence: '3/5',
          platform: 'LeetCode',
          status: 'Needs Review'
        }
      ],
      history: [
        {
          id: `${id}-s1`,
          sessionNumber: 1,
          date: 'Today',
          assessment: 'Good',
          score: 50,
          scoreDelta: '+50%',
          interval: '1d interval',
          nextTarget: 'Tomorrow',
          notes: 'Added custom pattern into codex catalog.'
        }
      ]
    };

    onAddPattern(newPattern);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-[#c9d8be] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-[#c9d8be]/60 flex items-center justify-between bg-[#f5fbf1]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#326b00]">add_box</span>
            <h3 className="font-serif font-bold text-lg text-[#111f09]">Add Custom Pattern</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#526b3e] hover:text-[#111f09] p-1 rounded hover:bg-[#eef7e8]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3.5 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-[#526b3e] font-semibold mb-1">
              Pattern Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Monotonic Deque, Matrix Exponentiation, Bitmask DP"
              className="w-full bg-[#f5fbf1] border border-[#c9d8be] rounded-lg p-2 text-sm font-serif text-[#111f09] focus:outline-none focus:border-[#77c73d]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-xs uppercase tracking-wider text-[#526b3e] font-semibold mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#f5fbf1] border border-[#c9d8be] rounded-lg p-2 text-xs font-serif text-[#111f09] focus:outline-none focus:border-[#77c73d]"
              >
                <option value="Arrays & Strings">Arrays & Strings</option>
                <option value="Binary Search">Binary Search</option>
                <option value="Linked Lists">Linked Lists</option>
                <option value="Stack & Queue">Stack & Queue</option>
                <option value="Trees">Trees</option>
                <option value="Graphs">Graphs</option>
                <option value="Greedy">Greedy</option>
                <option value="Backtracking">Backtracking</option>
                <option value="Dynamic Programming">Dynamic Programming</option>
              </select>
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-wider text-[#526b3e] font-semibold mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-[#f5fbf1] border border-[#c9d8be] rounded-lg p-2 text-xs font-serif text-[#111f09] focus:outline-none focus:border-[#77c73d]"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Medium-Hard">Medium-Hard</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-[#526b3e] font-semibold mb-1">
              When to Use &amp; Mental Trigger
            </label>
            <textarea
              rows={2}
              value={whenToUse}
              onChange={(e) => setWhenToUse(e.target.value)}
              placeholder="Contiguous elements, subproblems, monotonicity constraints..."
              className="w-full bg-[#f5fbf1] border border-[#c9d8be] rounded-lg p-2 text-xs font-serif text-[#111f09] focus:outline-none focus:border-[#77c73d]"
            />
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-[#526b3e] font-semibold mb-1">
              Formal Invariant Condition
            </label>
            <input
              type="text"
              value={invariant}
              onChange={(e) => setInvariant(e.target.value)}
              placeholder="e.g. Window boundaries [L, R] maintain frequency constraints without backtracking"
              className="w-full bg-[#f5fbf1] border border-[#c9d8be] rounded-lg p-2 text-xs font-serif text-[#111f09] focus:outline-none focus:border-[#77c73d]"
            />
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-[#526b3e] font-semibold mb-1">
              Canonical Code Template
            </label>
            <textarea
              rows={3}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste algorithmic snippet here"
              className="w-full bg-[#f5fbf1] border border-[#c9d8be] rounded-lg p-2 text-xs font-mono text-[#111f09] focus:outline-none focus:border-[#77c73d]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#c9d8be]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-[#c9d8be] text-xs font-serif hover:bg-[#eef7e8] text-[#526b3e]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#77c73d] text-[#112600] font-serif font-bold text-xs hover:bg-[#89db4f] transition-colors border border-[#64b02d]"
            >
              Add to Pattern Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
