export const INITIAL_PATTERNS = [
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    category: 'Arrays & Strings',
    difficulty: 'Medium-Hard',
    mastery: 74,
    masteryLevel: 'Strong',
    spacedStage: 4,
    activeInterval: '7d',
    lastRevised: 'Oct 21',
    lastRevisedDaysAgo: '3d ago',
    nextTarget: 'Due Today',
    nextTargetDate: 'Oct 24',
    ladderInterval: '7D',
    isDueToday: true,
    sessionsCount: 4,
    complexityTime: 'O(N) amortized',
    complexitySpace: 'O(1) or O(K) (Alphabet size)',
    subproblemOrType: 'Fixed & Variable Window',
    whenToUse:
      'Contiguous subarray or substring problems where a brute force approach yields O(N²) or O(N³), and target criteria mandate finding min/max length, contiguous sum constraints, or exact character distribution frequencies.',
    recognitionClues: [
      'Lexical triggers: "longest contiguous substring with...", "minimum size subarray sum", "all anagram substrings".',
      'Window Invariants: Expand right pointer R++ until condition turns valid/invalid. Once triggered, shrink left pointer L++ while preserving invariant balance.'
    ],
    windowInvariants:
      'Expand right pointer R++ until condition turns valid/invalid. Once triggered, shrink left pointer L++ while preserving invariant balance.',
    commonGotchas:
      'Empty string inputs (len == 0), entire stream consisting of unique elements, window size 0 vs 1 handling, and post-loop termination checks where the final contiguous window is still valid but unprocessed.',
    formalInvariant:
      'Window boundaries [L, R] maintain monotonicity or frequency hashmap constraints without backtracking pointers.',
    criticalTraps:
      'Failing to account for left pointer going out of bounds, or re-initializing window frequency state inside the inner loop rather than incrementing.',
    codeSnippet: {
      language: 'cpp',
      code: `int left = 0;
for (int right = 0; right < n; right++) {
    add(nums[right]);           // Expand window to the right
    while (isInvalid()) {        // Shrink left pointer to restore invariant
        remove(nums[left++]);
    }
    updateAns();                // Update optimum snapshot
}`
    },
    inquiryPrompt:
      'Without peeking at references, define when the Sliding Window pattern is appropriate, specify the two primary variants (fixed vs dynamic window), and outline the invariant condition for shrinking the window.',
    defaultRecallNote:
      'Sliding window is used for contiguous subarray/substring problems. Two types: 1. Fixed size (size K is constant), 2. Dynamic/Variable size (expand right pointer until invalid, shrink left pointer while invariant broken). Invariant: right advances every step, left advances only to restore condition. Time complexity is O(N) because each pointer visits each element at most once.',
    problems: [
      {
        id: 'lc-3',
        number: '#0003',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        confidence: '5/5',
        platform: 'LeetCode',
        status: 'Mastered'
      },
      {
        id: 'lc-209',
        number: '#0209',
        title: 'Minimum Size Subarray Sum',
        difficulty: 'Medium',
        confidence: '4/5',
        platform: 'LeetCode',
        status: 'Mastered'
      },
      {
        id: 'lc-239',
        number: '#0239',
        title: 'Sliding Window Maximum',
        difficulty: 'Hard',
        confidence: '3/5',
        platform: 'Monotonic Deque',
        tag: 'Monotonic Deque',
        status: 'Needs Review'
      },
      {
        id: 'lc-567',
        number: '#0567',
        title: 'Permutation in String',
        difficulty: 'Medium',
        confidence: '5/5',
        platform: 'LeetCode',
        status: 'Mastered'
      },
      {
        id: 'lc-76',
        number: '#0076',
        title: 'Minimum Window Substring',
        difficulty: 'Hard',
        confidence: '3/5',
        platform: 'Frequency Hash',
        tag: 'Frequency Hash',
        status: 'Review Scheduled'
      }
    ],
    history: [
      {
        id: 's4',
        sessionNumber: 4,
        date: 'Oct 21',
        assessment: 'Good',
        score: 74,
        scoreDelta: '+6%',
        interval: '3d interval',
        nextTarget: 'Oct 24 (Due)',
        notes: 'Quick recall of variable window template. Accurately handled character count hash map.'
      },
      {
        id: 's3',
        sessionNumber: 3,
        date: 'Oct 14',
        assessment: 'Struggled',
        score: 68,
        scoreDelta: '-2%',
        interval: '7d (Reset)',
        nextTarget: 'Oct 21',
        notes: 'Stumbled on left pointer boundary condition when frequency count reached zero.'
      },
      {
        id: 's2',
        sessionNumber: 2,
        date: 'Oct 07',
        assessment: 'Good',
        score: 70,
        scoreDelta: '+15%',
        interval: '7d interval',
        nextTarget: 'Oct 14',
        notes: 'Recalled fixed size window sum template. Solved LC 643 in under 6 minutes.'
      },
      {
        id: 's1',
        sessionNumber: 1,
        date: 'Sep 30',
        assessment: 'Easy',
        score: 55,
        scoreDelta: '+30%',
        interval: '7d interval',
        nextTarget: 'Oct 07',
        notes: 'Initial synthesis from canonical notes.'
      }
    ]
  },
  {
    id: 'binary-search-answer',
    name: 'Binary Search on Answer',
    category: 'Binary Search',
    difficulty: 'Medium-Hard',
    mastery: 65,
    masteryLevel: 'Needs Practice',
    spacedStage: 3,
    activeInterval: '14d',
    lastRevised: 'Oct 17',
    lastRevisedDaysAgo: '7d ago',
    nextTarget: 'Due Today',
    nextTargetDate: 'Oct 24',
    ladderInterval: '14D',
    isDueToday: true,
    sessionsCount: 3,
    complexityTime: 'O(log K * N)',
    complexitySpace: 'O(1)',
    subproblemOrType: 'Monotonic Predicate Function',
    whenToUse:
      'When the solution domain is bounded and monotonic (e.g. if speed X works, any speed > X also works), enabling binary searching across possible answers rather than array indices.',
    recognitionClues: [
      'Keywords: "Minimize the maximum...", "find minimum capacity needed within D days".',
      'The check(mid) feasibility predicate returns a monotonic boolean (false...false...true...true).'
    ],
    windowInvariants: 'left <= right or left < right with search space invariant reduction.',
    commonGotchas: 'Integer overflow on (low + high) / 2 (use low + (high-low)/2), off-by-one in feasibility range, unbounded upper bound.',
    formalInvariant: 'Feasibility function is strictly monotonic over the discrete interval [low, high].',
    criticalTraps: 'Choosing an incorrect upper bound that cuts off the true optimum value.',
    codeSnippet: {
      language: 'cpp',
      code: `long long low = minVal, high = maxVal, ans = high;
while (low <= high) {
    long long mid = low + (high - low) / 2;
    if (isValid(mid)) {
        ans = mid;         // Record candidate and explore better left bound
        high = mid - 1;
    } else {
        low = mid + 1;
    }
}
return ans;`
    },
    inquiryPrompt: 'State the condition under which Binary Search on Answer is applicable. Write the monotonic condition and template.',
    defaultRecallNote: 'Applies when answer lies in a known range and has a monotonic property: isValid(x) implies isValid(y) for all y > x. Search space is [min_ans, max_ans].',
    problems: [
      { id: 'lc-875', number: '#0875', title: 'Koko Eating Bananas', difficulty: 'Medium', confidence: '4/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-1011', number: '#1011', title: 'Capacity To Ship Packages Within D Days', difficulty: 'Medium', confidence: '4/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-410', number: '#0410', title: 'Split Array Largest Sum', difficulty: 'Hard', confidence: '3/5', platform: 'LeetCode', status: 'Needs Review' }
    ],
    history: [
      { id: 'bs-1', sessionNumber: 3, date: 'Oct 17', assessment: 'Good', score: 65, scoreDelta: '+8%', interval: '14d interval', nextTarget: 'Oct 24 (Due)' }
    ]
  },
  {
    id: 'fast-slow-pointers',
    name: 'Fast & Slow Pointers',
    category: 'Linked Lists',
    difficulty: 'Medium',
    mastery: 58,
    masteryLevel: 'Needs Practice',
    spacedStage: 2,
    activeInterval: '7d',
    lastRevised: 'Oct 15',
    lastRevisedDaysAgo: '9d ago',
    nextTarget: 'Overdue (2d late)',
    nextTargetDate: 'Oct 22',
    ladderInterval: '3D',
    isOverdue: true,
    overdueText: 'Overdue (2d late)',
    sessionsCount: 2,
    complexityTime: 'O(N)',
    complexitySpace: 'O(1)',
    subproblemOrType: 'Floyd Cycle Detection',
    whenToUse: 'Detecting cycles in linked lists, finding middle node in a single pass, or determining cycle entry point without extra memory.',
    recognitionClues: [
      'Cyclic references, finding kth from end in 1 pass, palindrome linked list splitting.',
      'Fast pointer moves 2 steps, slow pointer moves 1 step.'
    ],
    windowInvariants: 'Distance between fast and slow increases by 1 each step in a loop until collision.',
    commonGotchas: 'Null pointer exceptions on fast.next before checking fast.',
    formalInvariant: 'If cycle length is C, fast and slow meet within C steps after slow enters cycle.',
    criticalTraps: 'Forgetting fast != null && fast.next != null guard before fast = fast.next.next.',
    codeSnippet: {
      language: 'cpp',
      code: `ListNode *slow = head, *fast = head;
while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) return true; // Cycle detected
}
return false;`
    },
    inquiryPrompt: 'Explain Floyd Cycle Detection algorithm and prove why fast and slow pointers will always meet inside a loop.',
    defaultRecallNote: 'Slow moves 1 step, fast moves 2 steps. In a cycle of length L, the relative distance between them decreases by 1 modulo L each step, guaranteeing meeting in O(L) steps.',
    problems: [
      { id: 'lc-141', number: '#0141', title: 'Linked List Cycle', difficulty: 'Easy', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-142', number: '#0142', title: 'Linked List Cycle II', difficulty: 'Medium', confidence: '3/5', platform: 'LeetCode', status: 'Needs Review' },
      { id: 'lc-234', number: '#0234', title: 'Palindrome Linked List', difficulty: 'Medium', confidence: '4/5', platform: 'LeetCode', status: 'Mastered' }
    ],
    history: [
      { id: 'fs-1', sessionNumber: 2, date: 'Oct 15', assessment: 'Struggled', score: 58, scoreDelta: '-5%', interval: '7d interval', nextTarget: 'Oct 22' }
    ]
  },
  {
    id: 'topological-sort',
    name: 'Topological Sort',
    category: 'Graphs',
    difficulty: 'Medium',
    mastery: 52,
    masteryLevel: 'Needs Practice',
    spacedStage: 2,
    activeInterval: '3d',
    lastRevised: 'Oct 23',
    lastRevisedDaysAgo: 'Yesterday',
    nextTarget: 'Due Today',
    nextTargetDate: 'Oct 24',
    ladderInterval: '3D',
    isDueToday: true,
    sessionsCount: 2,
    complexityTime: 'O(V + E)',
    complexitySpace: 'O(V + E)',
    subproblemOrType: "Kahn's / DFS Postorder",
    whenToUse: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u comes before v (e.g. build systems, course scheduling).',
    recognitionClues: [
      'Prerequisite dependencies, task scheduling, cycle detection in directed graphs.',
      'In-degree array + queue for BFS (Kahn) or recursion stack mark for DFS.'
    ],
    windowInvariants: 'Nodes with in-degree 0 can be processed immediately.',
    commonGotchas: 'If the processed nodes count != total V, the graph contains a directed cycle.',
    formalInvariant: 'Only vertices with in-degree equal to 0 enter the processing queue.',
    criticalTraps: 'Mutating graph adj list or failing to decrement in-degrees of neighbors.',
    codeSnippet: {
      language: 'cpp',
      code: `vector<int> inDegree(numCourses, 0);
for (auto& edge : prerequisites) inDegree[edge[0]]++;
queue<int> q;
for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.push(i);
vector<int> order;
while (!q.empty()) {
    int curr = q.front(); q.pop();
    order.push_back(curr);
    for (int nxt : adj[curr]) {
        if (--inDegree[nxt] == 0) q.push(nxt);
    }
}
return order.size() == numCourses ? order : vector<int>{};`
    },
    inquiryPrompt: "Describe Kahn's Algorithm for topological sorting and how it detects directed cycles.",
    defaultRecallNote: "Compute in-degrees for all vertices. Push 0 in-degree nodes to queue. Repeatedly pop, decrement neighbor in-degrees, and if neighbor hits 0, enqueue. If total processed < V, cycle exists.",
    problems: [
      { id: 'lc-207', number: '#0207', title: 'Course Schedule', difficulty: 'Medium', confidence: '4/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-210', number: '#0210', title: 'Course Schedule II', difficulty: 'Medium', confidence: '4/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-269', number: '#0269', title: 'Alien Dictionary', difficulty: 'Hard', confidence: '2/5', platform: 'LeetCode', status: 'Needs Review' }
    ],
    history: [
      { id: 'topo-1', sessionNumber: 2, date: 'Oct 23', assessment: 'Struggled', score: 52, scoreDelta: '+4%', interval: '3d interval', nextTarget: 'Oct 24 (Due)' }
    ]
  },
  {
    id: '1d-dynamic-programming',
    name: '1D Dynamic Programming',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    mastery: 42,
    masteryLevel: 'Learning',
    spacedStage: 2,
    activeInterval: '7d',
    lastRevised: 'Oct 21',
    lastRevisedDaysAgo: '3d ago',
    nextTarget: 'Due Today',
    nextTargetDate: 'Oct 24',
    ladderInterval: '7D',
    isDueToday: true,
    sessionsCount: 3,
    complexityTime: 'O(N)',
    complexitySpace: 'O(1) / O(N)',
    subproblemOrType: 'Subproblem State Transitions',
    whenToUse: 'Linear decision processes where state at step i depends on optimal substructure of previous steps i-1, i-2, etc. (House Robber, Climbing Stairs, Coin Change).',
    recognitionClues: [
      'Choice at each element (take or leave, jump size), optimal total value, overlapping subproblems.',
      'State definition dp[i] and base cases.'
    ],
    windowInvariants: 'dp[i] represents optimal solution up to index i.',
    commonGotchas: 'Incorrect base case initialization (e.g. dp[0] = 0 vs dp[0] = 1), off-by-one index mismatch.',
    formalInvariant: 'Optimal solution for prefix i is composed strictly of optimal solutions of smaller prefixes.',
    criticalTraps: 'Space complexity O(N) when only the last 2 states are needed.',
    codeSnippet: {
      language: 'cpp',
      code: `int prev2 = 0, prev1 = 0;
for (int num : nums) {
    int curr = max(prev1, prev2 + num);
    prev2 = prev1;
    prev1 = curr;
}
return prev1;`
    },
    inquiryPrompt: 'Define state representation and recurrence for the classic 1D decision problem (e.g. House Robber).',
    defaultRecallNote: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Space can be optimized to two variables prev1 and prev2.',
    problems: [
      { id: 'lc-70', number: '#0070', title: 'Climbing Stairs', difficulty: 'Easy', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-198', number: '#0198', title: 'House Robber', difficulty: 'Medium', confidence: '4/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-322', number: '#0322', title: 'Coin Change', difficulty: 'Medium', confidence: '3/5', platform: 'LeetCode', status: 'Needs Review' }
    ],
    history: [
      { id: 'dp-1', sessionNumber: 3, date: 'Oct 21', assessment: 'Forgot', score: 42, scoreDelta: '-8%', interval: '7d interval', nextTarget: 'Oct 24 (Due)' }
    ]
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic Stack',
    category: 'Stack & Queue',
    difficulty: 'Medium-Hard',
    mastery: 60,
    masteryLevel: 'Needs Practice',
    spacedStage: 3,
    activeInterval: '14d',
    lastRevised: 'Oct 18',
    lastRevisedDaysAgo: '6d ago',
    nextTarget: 'Due Today',
    nextTargetDate: 'Oct 24',
    ladderInterval: '14D',
    isDueToday: true,
    sessionsCount: 3,
    complexityTime: 'O(N)',
    complexitySpace: 'O(N)',
    subproblemOrType: 'Next Greater Element',
    whenToUse: 'Finding the next/previous greater or smaller element for every element in an array in linear O(N) time.',
    recognitionClues: [
      'Next warmer temperature, largest rectangle in histogram, daily temperatures, trapping rain water.',
      'Stack maintains strictly increasing or decreasing order.'
    ],
    windowInvariants: 'Elements in stack are maintained in monotonic order; non-qualifying elements popped once.',
    commonGotchas: 'Pushing values instead of indices into stack when distance or span is needed.',
    formalInvariant: 'Each index enters the stack at most once and is popped at most once.',
    criticalTraps: 'Using strictly greater (<) instead of greater-than-or-equal (<=) causing duplicate element bugs.',
    codeSnippet: {
      language: 'cpp',
      code: `vector<int> res(n, -1);
stack<int> st; // stores indices
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[st.top()] < nums[i]) {
        res[st.top()] = nums[i];
        st.pop();
    }
    st.push(i);
}
return res;`
    },
    inquiryPrompt: 'Explain how monotonic stack achieves O(N) amortized runtime for next greater element problem.',
    defaultRecallNote: 'Every index is pushed once and popped at most once, resulting in 2N total operations max. Stack holds indices with values in strictly decreasing order.',
    problems: [
      { id: 'lc-739', number: '#0739', title: 'Daily Temperatures', difficulty: 'Medium', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-84', number: '#0084', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', confidence: '3/5', platform: 'LeetCode', status: 'Needs Review' },
      { id: 'lc-42', number: '#0042', title: 'Trapping Rain Water', difficulty: 'Hard', confidence: '4/5', platform: 'LeetCode', status: 'Mastered' }
    ],
    history: [
      { id: 'ms-1', sessionNumber: 3, date: 'Oct 18', assessment: 'Good', score: 60, scoreDelta: '+10%', interval: '14d interval', nextTarget: 'Oct 24 (Due)' }
    ]
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    category: 'Arrays & Strings',
    difficulty: 'Medium',
    mastery: 92,
    masteryLevel: 'Mastered',
    spacedStage: 5,
    activeInterval: '30d',
    lastRevised: 'Oct 12',
    lastRevisedDaysAgo: '12d ago',
    nextTarget: 'in 18d',
    nextTargetDate: 'Nov 11',
    ladderInterval: '30D',
    sessionsCount: 6,
    complexityTime: 'O(N)',
    complexitySpace: 'O(1)',
    subproblemOrType: 'Converging & Parallel Pointers',
    whenToUse: 'Searching pairs in sorted arrays, palindrome checking, water trapping, partition steps.',
    recognitionClues: ['Sorted array pair sum, container with most water, remove duplicates in-place.'],
    windowInvariants: 'Pointers move towards each other; discarded elements cannot contribute to better answer.',
    commonGotchas: 'Skipping duplicate elements in 3Sum properly.',
    formalInvariant: 'At each step, the pointer with the inferior bound is advanced monotonically.',
    criticalTraps: 'Failing to sort array first before applying converging two pointers.',
    codeSnippet: {
      language: 'python',
      code: `def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    left, right = 0, len(nums) - 1
    while left < right:
        curr = nums[left] + nums[right]
        if curr == target:
            return [left, right]
        elif curr < target:
            left += 1
        else:
            right -= 1
    return []`
    },
    inquiryPrompt: 'State the condition that guarantees Two Pointers convergence without missing potential optimal pairs.',
    defaultRecallNote: 'Array must be sorted. If sum < target, increasing left pointer is the only way to increase sum because right is already at its current best.',
    problems: [
      { id: 'lc-167', number: '#0167', title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-11', number: '#0011', title: 'Container With Most Water', difficulty: 'Medium', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-15', number: '#0015', title: '3Sum', difficulty: 'Medium', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' }
    ],
    history: [
      { id: 'tp-1', sessionNumber: 6, date: 'Oct 12', assessment: 'Easy', score: 92, scoreDelta: '+4%', interval: '30d interval', nextTarget: 'Nov 11' }
    ]
  },
  {
    id: 'prefix-sum',
    name: 'Prefix Sum',
    category: 'Arrays & Strings',
    difficulty: 'Medium',
    mastery: 88,
    masteryLevel: 'Mastered',
    spacedStage: 5,
    activeInterval: '30d',
    lastRevised: 'Oct 10',
    lastRevisedDaysAgo: '14d ago',
    nextTarget: 'in 16d',
    nextTargetDate: 'Nov 09',
    ladderInterval: '30D',
    sessionsCount: 5,
    complexityTime: 'O(1) query / O(N) prep',
    complexitySpace: 'O(N) or O(1)',
    subproblemOrType: 'Range Sum Queries & Hashmap',
    whenToUse: 'Range sum queries in static arrays or counting subarrays with exact sum K using prefix_sum - K hash map.',
    recognitionClues: ['Subarray sum equals K, continuous subarray sum, 2D range sum query.'],
    windowInvariants: 'sum(i, j) = prefix[j] - prefix[i-1].',
    commonGotchas: 'Missing base case countMap[0] = 1 for subarrays starting at index 0.',
    formalInvariant: 'Difference between two prefix sums represents the exact sum of intermediate subarray.',
    criticalTraps: 'Off-by-one when computing range sums without a 1-indexed prefix array.',
    codeSnippet: {
      language: 'cpp',
      code: `unordered_map<int, int> countMap{{0, 1}};
int sum = 0, count = 0;
for (int num : nums) {
    sum += num;
    if (countMap.count(sum - k)) count += countMap[sum - k];
    countMap[sum]++;
}
return count;`
    },
    inquiryPrompt: 'How does prefix sum combined with a hashmap solve "Subarray Sum Equals K" in O(N) time?',
    defaultRecallNote: 'If prefixSum[j] - prefixSum[i] = K, then prefixSum[i] = prefixSum[j] - K. We store frequency of seen prefix sums in hashmap with countMap[0]=1.',
    problems: [
      { id: 'lc-560', number: '#0560', title: 'Subarray Sum Equals K', difficulty: 'Medium', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-525', number: '#0525', title: 'Contiguous Array', difficulty: 'Medium', confidence: '4/5', platform: 'LeetCode', status: 'Mastered' }
    ],
    history: [
      { id: 'ps-1', sessionNumber: 5, date: 'Oct 10', assessment: 'Good', score: 88, scoreDelta: '+6%', interval: '30d interval', nextTarget: 'Nov 09' }
    ]
  },
  {
    id: 'kadanes-algorithm',
    name: "Kadane's Algorithm",
    category: 'Arrays & Strings',
    difficulty: 'Medium',
    mastery: 80,
    masteryLevel: 'Strong',
    spacedStage: 4,
    activeInterval: '7d',
    lastRevised: 'Oct 18',
    lastRevisedDaysAgo: '6d ago',
    nextTarget: 'Tomorrow',
    nextTargetDate: 'Oct 25',
    ladderInterval: '7D',
    sessionsCount: 3,
    complexityTime: 'O(N)',
    complexitySpace: 'O(1)',
    subproblemOrType: 'Maximum Subarray Sum',
    whenToUse: 'Finding maximum sum of a contiguous subarray in an array with negative numbers.',
    recognitionClues: ['Maximum contiguous subarray sum, maximum circular subarray sum.'],
    windowInvariants: 'current_max is max(num, current_max + num). Reset when running sum drops below 0.',
    commonGotchas: 'All negative numbers in array (must initialize max_so_far to nums[0], not 0).',
    formalInvariant: 'Optimal subarray ending at index i either extends optimal subarray ending at i-1 or restarts at i.',
    criticalTraps: 'Initializing max_sum to 0 when all elements can be negative.',
    codeSnippet: {
      language: 'cpp',
      code: `int maxSoFar = nums[0], currMax = nums[0];
for (int i = 1; i < nums.size(); i++) {
    currMax = max(nums[i], currMax + nums[i]);
    maxSoFar = max(maxSoFar, currMax);
}
return maxSoFar;`
    },
    inquiryPrompt: "Formulate Kadane's algorithm recurrence and how to handle all-negative arrays.",
    defaultRecallNote: 'currMax = max(nums[i], currMax + nums[i]); maxSoFar = max(maxSoFar, currMax). Must initialize with nums[0].',
    problems: [
      { id: 'lc-53', number: '#0053', title: 'Maximum Subarray', difficulty: 'Medium', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-918', number: '#0918', title: 'Maximum Sum Circular Subarray', difficulty: 'Medium', confidence: '4/5', platform: 'LeetCode', status: 'Mastered' }
    ],
    history: [
      { id: 'kd-1', sessionNumber: 3, date: 'Oct 18', assessment: 'Good', score: 80, scoreDelta: '+10%', interval: '7d interval', nextTarget: 'Oct 25' }
    ]
  },
  {
    id: 'linked-list-reversal',
    name: 'Linked List Reversal',
    category: 'Linked Lists',
    difficulty: 'Medium',
    mastery: 95,
    masteryLevel: 'Mastered',
    spacedStage: 5,
    activeInterval: '30d',
    lastRevised: 'Oct 23',
    lastRevisedDaysAgo: 'Yesterday',
    nextTarget: 'in 29d',
    nextTargetDate: 'Nov 22',
    ladderInterval: '30D',
    sessionsCount: 7,
    complexityTime: 'O(N)',
    complexitySpace: 'O(1)',
    subproblemOrType: 'In-Place Pointer Redirection',
    whenToUse: 'Reversing a full or subsegment of a singly linked list in-place.',
    recognitionClues: ['Reverse linked list, reverse nodes in k-group, palindrome linked list.'],
    windowInvariants: 'prev pointer always points to head of already-reversed prefix.',
    commonGotchas: 'Losing reference to next node before rewriting curr.next.',
    formalInvariant: 'At step i, all nodes before curr point backwards towards prev.',
    criticalTraps: 'Not saving curr.next in a temp variable before reassigning curr.next = prev.',
    codeSnippet: {
      language: 'cpp',
      code: `ListNode *prev = nullptr, *curr = head;
while (curr) {
    ListNode *nxt = curr->next;
    curr->next = prev;
    prev = curr;
    curr = nxt;
}
return prev;`
    },
    inquiryPrompt: 'Write the 4-line iterative reversal step and state the loop invariants.',
    defaultRecallNote: 'Save next: nxt = curr.next. Reassign: curr.next = prev. Advance prev: prev = curr. Advance curr: curr = nxt.',
    problems: [
      { id: 'lc-206', number: '#0206', title: 'Reverse Linked List', difficulty: 'Easy', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-92', number: '#0092', title: 'Reverse Linked List II', difficulty: 'Medium', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-25', number: '#0025', title: 'Reverse Nodes in k-Group', difficulty: 'Hard', confidence: '4/5', platform: 'LeetCode', status: 'Mastered' }
    ],
    history: [
      { id: 'llr-1', sessionNumber: 7, date: 'Oct 23', assessment: 'Easy', score: 95, scoreDelta: '+3%', interval: '30d interval', nextTarget: 'Nov 22' }
    ]
  },
  {
    id: 'tree-dfs',
    name: 'Tree DFS (Pre/In/Post)',
    category: 'Trees',
    difficulty: 'Medium',
    mastery: 78,
    masteryLevel: 'Strong',
    spacedStage: 4,
    activeInterval: '7d',
    lastRevised: 'Oct 20',
    lastRevisedDaysAgo: '4d ago',
    nextTarget: 'Tomorrow',
    nextTargetDate: 'Oct 25',
    ladderInterval: '7D',
    sessionsCount: 4,
    complexityTime: 'O(N)',
    complexitySpace: 'O(H) recursion stack',
    subproblemOrType: 'Recursive Top-Down & Bottom-Up',
    whenToUse: 'Path problems, tree height, maximum diameter, validating BST (inorder property).',
    recognitionClues: ['Root to leaf paths, max path sum, serialize/deserialize tree.'],
    windowInvariants: 'Subtree properties computed recursively from left and right children.',
    commonGotchas: 'Global variable vs returning tuple from bottom-up helper in diameter problem.',
    formalInvariant: 'All descendants in left subtree evaluated before or after right subtree based on traversal order.',
    criticalTraps: 'Stack overflow on skewed trees without recursion limit awareness.',
    codeSnippet: {
      language: 'cpp',
      code: `int maxGain(TreeNode* node, int& maxPath) {
    if (!node) return 0;
    int left = max(0, maxGain(node->left, maxPath));
    int right = max(0, maxGain(node->right, maxPath));
    maxPath = max(maxPath, left + right + node->val);
    return node->val + max(left, right);
}`
    },
    inquiryPrompt: 'Differentiate top-down vs bottom-up DFS in trees and formulate Maximum Path Sum.',
    defaultRecallNote: 'Bottom-up returns contribution of single branch to parent while maintaining maxPath across full split (left + right + node.val).',
    problems: [
      { id: 'lc-104', number: '#0104', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-543', number: '#0543', title: 'Diameter of Binary Tree', difficulty: 'Easy', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-124', number: '#0124', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', confidence: '4/5', platform: 'LeetCode', status: 'Mastered' }
    ],
    history: [
      { id: 'tdfs-1', sessionNumber: 4, date: 'Oct 20', assessment: 'Good', score: 78, scoreDelta: '+8%', interval: '7d interval', nextTarget: 'Oct 25' }
    ]
  },
  {
    id: 'tree-bfs',
    name: 'Tree BFS (Level Order)',
    category: 'Trees',
    difficulty: 'Medium',
    mastery: 85,
    masteryLevel: 'Mastered',
    spacedStage: 4,
    activeInterval: '14d',
    lastRevised: 'Oct 24',
    lastRevisedDaysAgo: '2h ago',
    nextTarget: 'in 14d',
    nextTargetDate: 'Nov 07',
    ladderInterval: '14D',
    sessionsCount: 5,
    complexityTime: 'O(N)',
    complexitySpace: 'O(W) max tree width',
    subproblemOrType: 'Queue Level-by-Level Traversal',
    whenToUse: 'Level order traversal, zigzag traversal, right side view, shortest path in unweighted graphs/trees.',
    recognitionClues: ['Group nodes by level, right side view, closest leaf.'],
    windowInvariants: 'Inner loop iterates exactly sz times where sz = q.size() at start of level.',
    commonGotchas: 'Calling q.size() in loop condition directly rather than caching it upfront.',
    formalInvariant: 'At any point, the queue contains nodes from at most two consecutive levels.',
    criticalTraps: 'Evaluating queue.size() dynamically in the for loop as children are added.',
    codeSnippet: {
      language: 'cpp',
      code: `vector<vector<int>> levels;
if (!root) return levels;
queue<TreeNode*> q{{root}};
while (!q.empty()) {
    int sz = q.size();
    vector<int> level;
    for (int i = 0; i < sz; i++) {
        auto node = q.front(); q.pop();
        level.push_back(node->val);
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    levels.push_back(level);
}
return levels;`
    },
    inquiryPrompt: 'State the level-order BFS template and explain why caching queue size is mandatory.',
    defaultRecallNote: 'int sz = q.size() locks the snapshot of nodes for the current horizontal depth before enqueuing children.',
    problems: [
      { id: 'lc-102', number: '#0102', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-199', number: '#0199', title: 'Binary Tree Right Side View', difficulty: 'Medium', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' }
    ],
    history: [
      { id: 'tbfs-1', sessionNumber: 5, date: 'Oct 24', assessment: 'Easy', score: 85, scoreDelta: '+6%', interval: '14d interval', nextTarget: 'Nov 07' }
    ]
  },
  {
    id: 'lowest-common-ancestor',
    name: 'Lowest Common Ancestor',
    category: 'Trees',
    difficulty: 'Medium',
    mastery: 62,
    masteryLevel: 'Needs Practice',
    spacedStage: 3,
    activeInterval: '7d',
    lastRevised: 'Oct 14',
    lastRevisedDaysAgo: '10d ago',
    nextTarget: 'in 2d',
    nextTargetDate: 'Oct 26',
    ladderInterval: '7D',
    sessionsCount: 3,
    complexityTime: 'O(N)',
    complexitySpace: 'O(H)',
    subproblemOrType: 'Tree Postorder Disjunction',
    whenToUse: 'Finding the lowest shared ancestor of two nodes in binary trees or binary search trees.',
    recognitionClues: ['LCA, nearest common parent, distance between two nodes.'],
    windowInvariants: 'If node == p or node == q, return node. If both left and right return non-null, curr is LCA.',
    commonGotchas: 'Assuming it is a BST when it is an arbitrary Binary Tree.',
    formalInvariant: 'First node where p and q diverge into separate subtrees is the LCA.',
    criticalTraps: 'Comparing values instead of pointer equality for arbitrary binary trees with duplicate values.',
    codeSnippet: {
      language: 'cpp',
      code: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`
    },
    inquiryPrompt: 'Write the concise recursive LCA solution for a general binary tree.',
    defaultRecallNote: 'Base cases: null, p, or q. Recurse left and right. If both return non-null, root is LCA. Otherwise return the non-null child.',
    problems: [
      { id: 'lc-236', number: '#0236', title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', confidence: '4/5', platform: 'LeetCode', status: 'Mastered' }
    ],
    history: [
      { id: 'lca-1', sessionNumber: 3, date: 'Oct 14', assessment: 'Good', score: 62, scoreDelta: '+7%', interval: '7d interval', nextTarget: 'Oct 26' }
    ]
  },
  {
    id: 'dijkstras-algorithm',
    name: "Dijkstra's Algorithm",
    category: 'Graphs',
    difficulty: 'Medium-Hard',
    mastery: 41,
    masteryLevel: 'Learning',
    spacedStage: 1,
    activeInterval: '1d',
    lastRevised: 'Oct 19',
    lastRevisedDaysAgo: '5d ago',
    nextTarget: 'in 1d',
    nextTargetDate: 'Oct 25',
    ladderInterval: '1D',
    sessionsCount: 2,
    complexityTime: 'O((V + E) log V)',
    complexitySpace: 'O(V + E)',
    subproblemOrType: 'Min-Heap Single Source Shortest Path',
    whenToUse: 'Shortest path from single source in weighted graph with non-negative edge weights.',
    recognitionClues: ['Minimum network latency, cheapest flight with K stops, shortest travel time.'],
    windowInvariants: 'Distances in distance array are monotonically updated; min-heap pops greedily smallest.',
    commonGotchas: 'Negative edge weights (requires Bellman-Ford/SPFA), pushing stale entries without dist check.',
    formalInvariant: 'Once a vertex is finalized and popped from min-heap, its shortest path is guaranteed optimal.',
    criticalTraps: 'Forgetting the stale check `if (d > dist[u]) continue;` causing unnecessary O(E log V) redundant iterations.',
    codeSnippet: {
      language: 'cpp',
      code: `priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
vector<int> dist(n + 1, 1e9);
dist[src] = 0;
pq.push({0, src});
while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue; // Stale check
    for (auto& [v, weight] : adj[u]) {
        if (dist[u] + weight < dist[v]) {
            dist[v] = dist[u] + weight;
            pq.push({dist[v], v});
        }
    }
}`
    },
    inquiryPrompt: "Write Dijkstra's algorithm with min-heap priority queue and state the time complexity.",
    defaultRecallNote: 'Use min_heap storing {cost, node}. dist array initialized to infinity. Always check if popped cost > dist[u] to skip stale entries.',
    problems: [
      { id: 'lc-743', number: '#0743', title: 'Network Delay Time', difficulty: 'Medium', confidence: '3/5', platform: 'LeetCode', status: 'Needs Review' }
    ],
    history: [
      { id: 'dijk-1', sessionNumber: 2, date: 'Oct 19', assessment: 'Struggled', score: 41, scoreDelta: '-4%', interval: '1d interval', nextTarget: 'Oct 25' }
    ]
  },
  {
    id: 'union-find',
    name: 'Union Find (Disjoint Set)',
    category: 'Graphs',
    difficulty: 'Medium',
    mastery: 69,
    masteryLevel: 'Strong',
    spacedStage: 4,
    activeInterval: '7d',
    lastRevised: 'Oct 16',
    lastRevisedDaysAgo: '8d ago',
    nextTarget: 'Tomorrow',
    nextTargetDate: 'Oct 25',
    ladderInterval: '7D',
    sessionsCount: 3,
    complexityTime: 'O(α(N)) nearly O(1)',
    complexitySpace: 'O(N)',
    subproblemOrType: 'Path Compression & Union by Rank',
    whenToUse: 'Connected components, cycle detection in undirected graphs, Kruskal minimum spanning tree.',
    recognitionClues: ['Number of connected provinces, redundant connection, accounts merge.'],
    windowInvariants: 'parent[x] = find(parent[x]) flattens tree during search.',
    commonGotchas: 'Forgetting path compression or union by rank, degrading to O(N).',
    formalInvariant: 'Root represents component canonical leader.',
    criticalTraps: 'Failing to return boolean from union indicating whether cycle was detected.',
    codeSnippet: {
      language: 'cpp',
      code: `struct DSU {
    vector<int> parent, rank;
    DSU(int n) : parent(n), rank(n, 0) { iota(parent.begin(), parent.end(), 0); }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path compression
    }
    bool unite(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI == rootJ) return false;
        if (rank[rootI] < rank[rootJ]) parent[rootI] = rootJ;
        else if (rank[rootI] > rank[rootJ]) parent[rootJ] = rootI;
        else { parent[rootJ] = rootI; rank[rootI]++; }
        return true;
    }
};`
    },
    inquiryPrompt: 'Implement DSU with path compression and explain why the inverse Ackermann runtime α(N) is achieved.',
    defaultRecallNote: 'Path compression flattens tree on find(), union by rank attaches smaller tree under larger root, yielding nearly O(1) amortized ops.',
    problems: [
      { id: 'lc-547', number: '#0547', title: 'Number of Provinces', difficulty: 'Medium', confidence: '5/5', platform: 'LeetCode', status: 'Mastered' },
      { id: 'lc-684', number: '#0684', title: 'Redundant Connection', difficulty: 'Medium', confidence: '4/5', platform: 'LeetCode', status: 'Mastered' }
    ],
    history: [
      { id: 'uf-1', sessionNumber: 3, date: 'Oct 16', assessment: 'Good', score: 69, scoreDelta: '+12%', interval: '7d interval', nextTarget: 'Oct 25' }
    ]
  },
  {
    id: 'knapsack-dp',
    name: 'Knapsack DP (0/1 & Unbounded)',
    category: 'Dynamic Programming',
    difficulty: 'Medium-Hard',
    mastery: 34,
    masteryLevel: 'Learning',
    spacedStage: 1,
    activeInterval: '1d',
    lastRevised: 'Oct 22',
    lastRevisedDaysAgo: '2d ago',
    nextTarget: 'in 1d',
    nextTargetDate: 'Oct 25',
    ladderInterval: '1D',
    sessionsCount: 1,
    complexityTime: 'O(N * W)',
    complexitySpace: 'O(W) 1D rolling array',
    subproblemOrType: 'Bounded / Unbounded Capacity DP',
    whenToUse: 'Subset sum partition, target sum, coin change, rod cutting with weight/cost constraints.',
    recognitionClues: ['Max value with weight limit, partition equal subset sum, coin change ways.'],
    windowInvariants: 'In 0/1 knapsack, inner loop goes backwards w from W down to weight[i] to prevent reuse.',
    commonGotchas: 'Looping forward in 0/1 knapsack (turns it into unbounded knapsack).',
    formalInvariant: 'Iterating right-to-left ensures each item is chosen at most once per tier.',
    criticalTraps: 'Iterating capacity forwards for 0/1 knapsack causing duplicate item inclusions.',
    codeSnippet: {
      language: 'cpp',
      code: `// 0/1 Knapsack Space-Optimized
vector<int> dp(W + 1, 0);
for (int i = 0; i < n; i++) {
    for (int w = W; w >= weight[i]; w--) { // Reverse order!
        dp[w] = max(dp[w], dp[w - weight[i]] + val[i]);
    }
}
return dp[W];`
    },
    inquiryPrompt: 'Why must 0/1 Knapsack inner loop iterate backwards when optimizing to 1D space?',
    defaultRecallNote: 'Iterating backwards ensures dp[w - weight[i]] comes from the previous item (i-1), preventing the current item from being used multiple times.',
    problems: [
      { id: 'lc-416', number: '#0416', title: 'Partition Equal Subset Sum', difficulty: 'Medium', confidence: '2/5', platform: 'LeetCode', status: 'Needs Review' }
    ],
    history: [
      { id: 'knap-1', sessionNumber: 1, date: 'Oct 22', assessment: 'Forgot', score: 34, scoreDelta: '-10%', interval: '1d interval', nextTarget: 'Oct 25' }
    ]
  },
  {
    id: 'longest-increasing-subsequence',
    name: 'Longest Increasing Subsequence',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    mastery: 46,
    masteryLevel: 'Learning',
    spacedStage: 2,
    activeInterval: '3d',
    lastRevised: 'Oct 18',
    lastRevisedDaysAgo: '6d ago',
    nextTarget: 'in 2d',
    nextTargetDate: 'Oct 26',
    ladderInterval: '3D',
    sessionsCount: 2,
    complexityTime: 'O(N log N) patience sort',
    complexitySpace: 'O(N)',
    subproblemOrType: 'Binary Search Over Tails / DP',
    whenToUse: 'Finding length of longest strictly increasing subsequence in unsorted array.',
    recognitionClues: ['Russian doll envelopes, longest increasing subsequence, building bridges.'],
    windowInvariants: 'tails[k] is smallest tail of all increasing subsequences of length k+1.',
    commonGotchas: 'Using O(N²) quadratic DP when constraints require O(N log N).',
    formalInvariant: 'tails array remains strictly increasing, allowing std::lower_bound.',
    criticalTraps: 'Confusing lower_bound (strictly increasing) vs upper_bound (non-decreasing).',
    codeSnippet: {
      language: 'cpp',
      code: `vector<int> tails;
for (int x : nums) {
    auto it = lower_bound(tails.begin(), tails.end(), x);
    if (it == tails.end()) tails.push_back(x);
    else *it = x;
}
return tails.size();`
    },
    inquiryPrompt: 'Formulate the O(N log N) patience sorting / binary search tails algorithm for LIS.',
    defaultRecallNote: 'Maintain tails list. For each number x, binary search position via lower_bound. If at end, append. Else replace tails[idx] with x.',
    problems: [
      { id: 'lc-300', number: '#0300', title: 'Longest Increasing Subsequence', difficulty: 'Medium', confidence: '3/5', platform: 'LeetCode', status: 'Needs Review' },
      { id: 'lc-354', number: '#0354', title: 'Russian Doll Envelopes', difficulty: 'Hard', confidence: '2/5', platform: 'LeetCode', status: 'Needs Review' }
    ],
    history: [
      { id: 'lis-1', sessionNumber: 2, date: 'Oct 18', assessment: 'Struggled', score: 46, scoreDelta: '+4%', interval: '3d interval', nextTarget: 'Oct 26' }
    ]
  }
];
