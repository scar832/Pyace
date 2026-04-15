import React, { useState } from 'react';

/* ─── Mock Data ──────────────────────────────────────────────────────────── */
export const TOPICS = [
    {
        id: 'strings',
        label: 'Strings & String Methods',
        challenges: ['ch1', 'ch2'],
    },
    {
        id: 'lists',
        label: 'Lists & List Comprehensions',
        challenges: ['ch3'],
    },
    {
        id: 'functions',
        label: 'Functions & Recursion',
        challenges: ['ch4'],
    },
    {
        id: 'oop',
        label: 'Classes & Objects',
        challenges: [],
    },
    {
        id: 'errors',
        label: 'Error Handling',
        challenges: [],
    },
    {
        id: 'dicts',
        label: 'Dictionaries & Sets',
        challenges: [],
    },
    {
        id: 'algos',
        label: 'Sorting Algorithms',
        challenges: [],
    },
];

export const CHALLENGES = {
    ch1: {
        id: 'ch1',
        topicId: 'strings',
        title: 'Reverse a String Manually',
        difficulty: 'easy',
        points: 10,
        objective:
            'Write a function named `reverse_string(s)` that reverses a string without using Python\'s built-in `reversed()` or slicing shortcut `[::-1]`.',
        example: 'Input:  "hello"\nOutput: "olleh"',
        starterCode:
            'def reverse_string(s: str) -> str:\n    # Your solution here\n    pass\n\n\n# Test your solution\nprint(reverse_string("hello"))   # Expected: "olleh"\nprint(reverse_string("Pyace"))   # Expected: "ecayP"\n',
    },
    ch2: {
        id: 'ch2',
        topicId: 'strings',
        title: 'Check for Anagram',
        difficulty: 'medium',
        points: 20,
        objective:
            'Write a function `is_anagram(a, b)` that returns `True` if the two strings are anagrams of each other (same characters, different order). Ignore case.',
        example: 'Input:  "listen", "silent"\nOutput: True',
        starterCode:
            'def is_anagram(a: str, b: str) -> bool:\n    # Your solution here\n    pass\n\n\nprint(is_anagram("listen", "silent"))  # True\nprint(is_anagram("hello", "world"))   # False\n',
    },
    ch3: {
        id: 'ch3',
        topicId: 'lists',
        title: 'Flatten a Nested List',
        difficulty: 'medium',
        points: 25,
        objective:
            'Write a function `flatten(nested)` that takes a list of lists (one level deep) and returns a single flat list using a list comprehension.',
        example: 'Input:  [[1, 2], [3, 4], [5]]\nOutput: [1, 2, 3, 4, 5]',
        starterCode:
            'def flatten(nested: list) -> list:\n    # Hint: use a list comprehension\n    pass\n\n\nprint(flatten([[1, 2], [3, 4], [5]]))  # [1, 2, 3, 4, 5]\n',
    },
    ch4: {
        id: 'ch4',
        topicId: 'functions',
        title: 'Fibonacci Sequence (Recursive)',
        difficulty: 'hard',
        points: 35,
        objective:
            'Write a recursive function `fibonacci(n)` that returns the nth Fibonacci number (0-indexed). Optimise it using memoization.',
        example: 'Input:  n = 7\nOutput: 13  (sequence: 0,1,1,2,3,5,8,13)',
        starterCode:
            'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fibonacci(n: int) -> int:\n    # Your solution here\n    pass\n\n\nprint(fibonacci(7))   # Expected: 13\nprint(fibonacci(10))  # Expected: 55\n',
    },
};

/* ─── FREE PLAY starter ─────────────────────────────────────────────────── */
export const FREE_PLAY_STARTER =
    '# Welcome to the Pyace Sandbox 🐍\n# Free-code anything you want below.\n\n\ndef greet(name: str) -> str:\n    """Return a personalised greeting."""\n    return f"Hello, {name}! Welcome to Pyace."\n\n\nprint(greet("Student"))\n';

/* ─── Component ─────────────────────────────────────────────────────────── */
/**
 * ChallengeSidebar
 * Props:
 *   mode            'freeplay' | 'challenges'
 *   setMode         setter
 *   activeTopic     string | null
 *   setActiveTopic  setter
 *   activeChallenge string | null
 *   setActiveChallenge setter
 *   onLoadChallenge (challenge) => void  — called when user selects a challenge
 */
const ChallengeSidebar = ({
    mode,
    setMode,
    activeTopic,
    setActiveTopic,
    activeChallenge,
    setActiveChallenge,
    onLoadChallenge,
}) => {
    const topicChallenges = activeTopic
        ? TOPICS.find((t) => t.id === activeTopic)?.challenges ?? []
        : [];

    const handleSelectTopic = (topicId) => {
        setActiveTopic(topicId === activeTopic ? null : topicId);
        setActiveChallenge(null);
    };

    const handleSelectChallenge = (chalId) => {
        setActiveChallenge(chalId);
        onLoadChallenge(CHALLENGES[chalId]);
    };

    const challenge = activeChallenge ? CHALLENGES[activeChallenge] : null;

    return (
        <aside className="challenge-sidebar">
            {/* Tab bar */}
            <div className="csb-tabs">
                <button
                    className={`csb-tab ${mode === 'freeplay' ? 'active' : ''}`}
                    onClick={() => setMode('freeplay')}
                >
                    Free Play
                </button>
                <button
                    className={`csb-tab ${mode === 'challenges' ? 'active' : ''}`}
                    onClick={() => setMode('challenges')}
                >
                    Challenges
                </button>
            </div>

            <div className="csb-content">
                {/* ── FREE PLAY ── */}
                {mode === 'freeplay' && (
                    <>
                        <div className="csb-freeplay-tip">
                            <strong>🧪 Free Play Mode</strong>
                            Write any Python code you like. Use "Run Code" to simulate execution,
                            or "Submit to AI" for instant feedback on your style and logic.
                        </div>

                        <p className="csb-section-label">Quick starters</p>
                        <div className="csb-topic-list">
                            {[
                                'Fibonacci Sequence',
                                'Bubble Sort',
                                'Binary Search',
                                'Linked List Node',
                                'Decorator Pattern',
                            ].map((s) => (
                                <button
                                    key={s}
                                    className="csb-topic-btn"
                                    onClick={() => {/* future: load starter template */}}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* ── CHALLENGES ── */}
                {mode === 'challenges' && (
                    <>
                        <p className="csb-section-label">Python Topics</p>

                        <div className="csb-topic-list">
                            {TOPICS.map((t) => (
                                <button
                                    key={t.id}
                                    className={`csb-topic-btn ${activeTopic === t.id ? 'active' : ''}`}
                                    onClick={() => handleSelectTopic(t.id)}
                                >
                                    {t.label}
                                    <span className="csb-topic-count">
                                        {t.challenges.length}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Challenges under selected topic */}
                        {activeTopic && topicChallenges.length > 0 && (
                            <>
                                <p className="csb-section-label">Challenges</p>
                                <div className="csb-challenge-list">
                                    {topicChallenges.map((cid) => {
                                        const ch = CHALLENGES[cid];
                                        return (
                                            <div
                                                key={cid}
                                                className={`csb-challenge-card ${activeChallenge === cid ? 'active' : ''}`}
                                                onClick={() => handleSelectChallenge(cid)}
                                            >
                                                <p className="csb-challenge-title">{ch.title}</p>
                                                <div className="csb-challenge-meta">
                                                    <span className={`csb-diff-badge ${ch.difficulty}`}>
                                                        {ch.difficulty}
                                                    </span>
                                                    <span className="csb-pts">{ch.points} pts</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {activeTopic && topicChallenges.length === 0 && (
                            <p className="csb-freeplay-tip" style={{ fontSize: '0.82rem' }}>
                                No challenges yet for this topic. Check back soon!
                            </p>
                        )}

                        {/* Active challenge prompt */}
                        {challenge && (
                            <>
                                <p className="csb-section-label">Objective</p>
                                <div className="csb-prompt-box">
                                    <p className="csb-prompt-title">{challenge.title}</p>
                                    <p className="csb-prompt-text">{challenge.objective}</p>
                                    <pre className="csb-prompt-example">{challenge.example}</pre>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </aside>
    );
};

export default ChallengeSidebar;
