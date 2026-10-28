package com.dsarevision.config;

import com.dsarevision.entity.Pattern;
import com.dsarevision.entity.Problem;
import com.dsarevision.entity.User;
import com.dsarevision.repository.PatternRepository;
import com.dsarevision.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final PatternRepository patternRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            PatternRepository patternRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.patternRepository = patternRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedDemoUser();
        seedPatterns();
    }

    private void seedDemoUser() {
        String demoEmail = "alex.rivera@example.com";
        if (!userRepository.existsByEmail(demoEmail)) {
            User demoUser = new User();
            demoUser.setName("Alex Rivera");
            demoUser.setEmail(demoEmail);
            demoUser.setPassword(passwordEncoder.encode("password123"));
            userRepository.save(demoUser);
            log.info("Initialized demo user account: {} (password: password123)", demoEmail);
        }
    }

    private void seedPatterns() {
        if (patternRepository.count() > 0) {
            log.info("DSA Patterns already initialized in database. Skipping seed.");
            return;
        }

        log.info("Seeding 17 core DSA Patterns and sample practice problems...");

        seedPattern(
                "Sliding Window",
                "Arrays & Strings",
                "Medium-Hard",
                "Contiguous subarray or substring problems where a brute force approach yields O(N²) or O(N³), and target criteria mandate finding min/max length, contiguous sum constraints, or exact character distribution frequencies.",
                List.of(
                        new Problem(null, "Longest Substring Without Repeating Characters", "Medium", "https://leetcode.com/problems/longest-substring-without-repeating-characters/"),
                        new Problem(null, "Minimum Size Subarray Sum", "Medium", "https://leetcode.com/problems/minimum-size-subarray-sum/"),
                        new Problem(null, "Sliding Window Maximum", "Hard", "https://leetcode.com/problems/sliding-window-maximum/"),
                        new Problem(null, "Minimum Window Substring", "Hard", "https://leetcode.com/problems/minimum-window-substring/")
                )
        );

        seedPattern(
                "Binary Search on Answer",
                "Binary Search",
                "Medium-Hard",
                "When the solution domain is bounded and monotonic (e.g. if speed X works, any speed > X also works), enabling binary searching across possible answers rather than array indices.",
                List.of(
                        new Problem(null, "Koko Eating Bananas", "Medium", "https://leetcode.com/problems/koko-eating-bananas/"),
                        new Problem(null, "Capacity To Ship Packages Within D Days", "Medium", "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/"),
                        new Problem(null, "Split Array Largest Sum", "Hard", "https://leetcode.com/problems/split-array-largest-sum/")
                )
        );

        seedPattern(
                "Fast & Slow Pointers",
                "Linked Lists",
                "Medium",
                "Detecting cycles in linked lists, finding middle node in a single pass, or determining cycle entry point without extra memory.",
                List.of(
                        new Problem(null, "Linked List Cycle", "Easy", "https://leetcode.com/problems/linked-list-cycle/"),
                        new Problem(null, "Linked List Cycle II", "Medium", "https://leetcode.com/problems/linked-list-cycle-ii/"),
                        new Problem(null, "Palindrome Linked List", "Medium", "https://leetcode.com/problems/palindrome-linked-list/")
                )
        );

        seedPattern(
                "Topological Sort",
                "Graphs",
                "Medium-Hard",
                "Directed Acyclic Graphs (DAGs) requiring linear ordering of vertices such that for every directed edge u -> v, u comes before v. Used for task scheduling, build dependencies, and cycle detection.",
                List.of(
                        new Problem(null, "Course Schedule", "Medium", "https://leetcode.com/problems/course-schedule/"),
                        new Problem(null, "Course Schedule II", "Medium", "https://leetcode.com/problems/course-schedule-ii/"),
                        new Problem(null, "Alien Dictionary", "Hard", "https://leetcode.com/problems/alien-dictionary/")
                )
        );

        seedPattern(
                "1D Dynamic Programming",
                "Dynamic Programming",
                "Medium",
                "Optimal substructure where solution to state i depends on a fixed window of preceding states (e.g., i-1, i-2), reducible to O(1) space.",
                List.of(
                        new Problem(null, "Climbing Stairs", "Easy", "https://leetcode.com/problems/climbing-stairs/"),
                        new Problem(null, "House Robber", "Medium", "https://leetcode.com/problems/house-robber/"),
                        new Problem(null, "Coin Change", "Medium", "https://leetcode.com/problems/coin-change/")
                )
        );

        seedPattern(
                "Monotonic Stack",
                "Stack & Queue",
                "Medium-Hard",
                "Finding the next greater or smaller element in an array in O(N) time by maintaining an ordered stack.",
                List.of(
                        new Problem(null, "Daily Temperatures", "Medium", "https://leetcode.com/problems/daily-temperatures/"),
                        new Problem(null, "Next Greater Element I", "Easy", "https://leetcode.com/problems/next-greater-element-i/"),
                        new Problem(null, "Largest Rectangle in Histogram", "Hard", "https://leetcode.com/problems/largest-rectangle-in-histogram/")
                )
        );

        seedPattern(
                "Two Pointers",
                "Arrays & Strings",
                "Easy",
                "Searching pairs in sorted arrays or strings moving inward, or partitioning elements in-place with low memory.",
                List.of(
                        new Problem(null, "Two Sum II - Input Array Is Sorted", "Medium", "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/"),
                        new Problem(null, "3Sum", "Medium", "https://leetcode.com/problems/3sum/"),
                        new Problem(null, "Container With Most Water", "Medium", "https://leetcode.com/problems/container-with-most-water/")
                )
        );

        seedPattern(
                "Prefix Sum",
                "Arrays & Strings",
                "Easy",
                "Range sum queries on static arrays in O(1) time after O(N) precomputation.",
                List.of(
                        new Problem(null, "Range Sum Query - Immutable", "Easy", "https://leetcode.com/problems/range-sum-query-immutable/"),
                        new Problem(null, "Subarray Sum Equals K", "Medium", "https://leetcode.com/problems/subarray-sum-equals-k/"),
                        new Problem(null, "Contiguous Array", "Medium", "https://leetcode.com/problems/contiguous-array/")
                )
        );

        seedPattern(
                "Kadane's Algorithm",
                "Arrays & Strings",
                "Medium",
                "Maximum subarray sum in contiguous 1D array in linear O(N) time and O(1) space.",
                List.of(
                        new Problem(null, "Maximum Subarray", "Medium", "https://leetcode.com/problems/maximum-subarray/"),
                        new Problem(null, "Maximum Sum Circular Subarray", "Medium", "https://leetcode.com/problems/maximum-sum-circular-subarray/")
                )
        );

        seedPattern(
                "Linked List Reversal",
                "Linked Lists",
                "Easy",
                "In-place iterative pointer manipulation to reverse single or segment of linked list.",
                List.of(
                        new Problem(null, "Reverse Linked List", "Easy", "https://leetcode.com/problems/reverse-linked-list/"),
                        new Problem(null, "Reverse Linked List II", "Medium", "https://leetcode.com/problems/reverse-linked-list-ii/"),
                        new Problem(null, "Reverse Nodes in k-Group", "Hard", "https://leetcode.com/problems/reverse-nodes-in-k-group/")
                )
        );

        seedPattern(
                "Tree DFS",
                "Trees",
                "Medium",
                "Recursive or stack traversal (Preorder, Inorder, Postorder) exploring root-to-leaf paths and subtree aggregates.",
                List.of(
                        new Problem(null, "Maximum Depth of Binary Tree", "Easy", "https://leetcode.com/problems/maximum-depth-of-binary-tree/"),
                        new Problem(null, "Diameter of Binary Tree", "Easy", "https://leetcode.com/problems/diameter-of-binary-tree/"),
                        new Problem(null, "Path Sum II", "Medium", "https://leetcode.com/problems/path-sum-ii/")
                )
        );

        seedPattern(
                "Tree BFS",
                "Trees",
                "Medium",
                "Level-order traversal using queues to process nodes depth by depth or compute shortest path in unweighted trees.",
                List.of(
                        new Problem(null, "Binary Tree Level Order Traversal", "Medium", "https://leetcode.com/problems/binary-tree-level-order-traversal/"),
                        new Problem(null, "Binary Tree Right Side View", "Medium", "https://leetcode.com/problems/binary-tree-right-side-view/"),
                        new Problem(null, "Binary Tree Zigzag Level Order Traversal", "Medium", "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/")
                )
        );

        seedPattern(
                "Lowest Common Ancestor",
                "Trees",
                "Medium-Hard",
                "Finding the deepest node that has both target nodes p and q as descendants.",
                List.of(
                        new Problem(null, "Lowest Common Ancestor of a Binary Search Tree", "Medium", "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"),
                        new Problem(null, "Lowest Common Ancestor of a Binary Tree", "Medium", "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/")
                )
        );

        seedPattern(
                "Dijkstra's Algorithm",
                "Graphs",
                "Medium-Hard",
                "Single-source shortest path on weighted graphs with non-negative edge weights using a min-priority queue.",
                List.of(
                        new Problem(null, "Network Delay Time", "Medium", "https://leetcode.com/problems/network-delay-time/"),
                        new Problem(null, "Path with Maximum Probability", "Medium", "https://leetcode.com/problems/path-with-maximum-probability/"),
                        new Problem(null, "Cheapest Flights Within K Stops", "Medium", "https://leetcode.com/problems/cheapest-flights-within-k-stops/")
                )
        );

        seedPattern(
                "Union Find",
                "Graphs",
                "Medium-Hard",
                "Disjoint Set Union (DSU) with path compression and union by rank to detect cycles and manage connected components in near O(1) amortized time.",
                List.of(
                        new Problem(null, "Number of Connected Components in an Undirected Graph", "Medium", "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/"),
                        new Problem(null, "Redundant Connection", "Medium", "https://leetcode.com/problems/redundant-connection/"),
                        new Problem(null, "Accounts Merge", "Medium", "https://leetcode.com/problems/accounts-merge/")
                )
        );

        seedPattern(
                "Knapsack DP",
                "Dynamic Programming",
                "Medium-Hard",
                "Choosing subsets of items with weights and values to maximize total value without exceeding capacity bounds.",
                List.of(
                        new Problem(null, "Partition Equal Subset Sum", "Medium", "https://leetcode.com/problems/partition-equal-subset-sum/"),
                        new Problem(null, "Target Sum", "Medium", "https://leetcode.com/problems/target-sum/"),
                        new Problem(null, "Ones and Zeroes", "Medium", "https://leetcode.com/problems/ones-and-zeroes/")
                )
        );

        seedPattern(
                "Longest Increasing Subsequence",
                "Dynamic Programming",
                "Medium",
                "Finding longest subsequence where elements are strictly increasing in O(N log N) time with patience sorting / binary search.",
                List.of(
                        new Problem(null, "Longest Increasing Subsequence", "Medium", "https://leetcode.com/problems/longest-increasing-subsequence/"),
                        new Problem(null, "Russian Doll Envelopes", "Hard", "https://leetcode.com/problems/russian-doll-envelopes/"),
                        new Problem(null, "Number of Longest Increasing Subsequence", "Medium", "https://leetcode.com/problems/number-of-longest-increasing-subsequence/")
                )
        );

        log.info("Database seeding complete. {} patterns seeded.", patternRepository.count());
    }

    private void seedPattern(String name, String category, String difficulty, String description, List<Problem> problems) {
        Pattern pattern = new Pattern(name, category, difficulty, description);
        for (Problem problem : problems) {
            pattern.addProblem(problem);
        }
        patternRepository.save(pattern);
    }
}
