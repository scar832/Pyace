import React, { useState } from 'react';

/* ─── Mock data ──────────────────────────────────────────────────────────── */
const RECENT_PROJECTS = [
    {
        id: 'rp1',
        name: 'sorting_algorithms.py',
        desc: 'Bubble sort + merge sort comparison',
        time: '2 hours ago',
        code: '# Sorting Algorithms\n\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\n\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))\n',
    },
    {
        id: 'rp2',
        name: 'linked_list.py',
        desc: 'Singly linked list with insertion & traversal',
        time: 'Yesterday',
        code: '# Singly Linked List\n\nclass Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n\n    def append(self, data):\n        new_node = Node(data)\n        if not self.head:\n            self.head = new_node\n            return\n        current = self.head\n        while current.next:\n            current = current.next\n        current.next = new_node\n\n    def print_list(self):\n        current = self.head\n        while current:\n            print(current.data, end=" -> ")\n            current = current.next\n        print("None")\n\n\nll = LinkedList()\nll.append(1)\nll.append(2)\nll.append(3)\nll.print_list()\n',
    },
    {
        id: 'rp3',
        name: 'decorators_demo.py',
        desc: 'Timer and memoisation decorator patterns',
        time: '3 days ago',
        code: '# Python Decorators\nimport time\nfrom functools import wraps\n\n\ndef timer(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f"{func.__name__!r} ran in {elapsed:.4f}s")\n        return result\n    return wrapper\n\n\n@timer\ndef slow_function():\n    time.sleep(0.1)\n    return "done"\n\n\nprint(slow_function())\n',
    },
];

export const MOCK_ASSIGNMENTS = [
    { id: 'asgn1', name: 'CS 301 — Assignment 3: Dynamic Programming',   due: 'Due Oct 15, 2026' },
    { id: 'asgn2', name: 'CS 450 — Assignment 2: Neural Network from Scratch', due: 'Due Nov 01, 2026' },
    { id: 'asgn3', name: 'SE 210 — Assignment 2: Accessibility Audit',    due: 'Due Oct 25, 2026' },
];

const GH_PLACEHOLDER = 'https://github.com/username/repository';

/* ─── Fake GitHub clone simulator ────────────────────────────────────────── */
const MOCK_GH_CODE = (repo) =>
    `# Cloned from: ${repo}\n# Pyace Sandbox — GitHub Integration\n\n\ndef main():\n    """Entry point."""\n    print("Repository loaded successfully!")\n    print(f"Source: ${'{repo}'}")\n\n\nif __name__ == "__main__":\n    main()\n`
        .replace('${repo}', repo);

/* ─── Component ─────────────────────────────────────────────────────────── */
/**
 * SandboxWelcome
 * Props:
 *   onLaunch({ code, fileName, assignmentId? }) — called to open the editor
 */
const SandboxWelcome = ({ onLaunch }) => {
    /* GitHub card state */
    const [ghUrl,      setGhUrl]      = useState('');
    const [ghLoading,  setGhLoading]  = useState(false);
    const [ghError,    setGhError]    = useState('');

    /* Assignment card state */
    const [selectedAsgn, setSelectedAsgn] = useState(MOCK_ASSIGNMENTS[0].id);

    /* ── Handlers ── */
    const handleFreePlay = () => {
        onLaunch({
            code: '# Pyace Sandbox — Free Play 🐍\n# Write any Python you like!\n\n\n',
            fileName: 'main.py',
        });
    };

    const handleRecent = (project) => {
        onLaunch({ code: project.code, fileName: project.name });
    };

    const handleAssignment = () => {
        const asgn = MOCK_ASSIGNMENTS.find((a) => a.id === selectedAsgn);
        onLaunch({
            code: `# ${asgn.name}\n# ${asgn.due}\n\n\n# Write your solution below:\n\n\n`,
            fileName: `${asgn.id}.py`,
            assignmentId: asgn.id,
        });
    };

    const handleGitHubClone = (e) => {
        e.preventDefault();
        const url = ghUrl.trim();
        if (!url) { setGhError('Please enter a repository URL.'); return; }
        if (!url.startsWith('https://github.com/')) {
            setGhError('Must be a valid https://github.com/ URL.');
            return;
        }
        setGhError('');
        setGhLoading(true);

        /* Simulate clone latency (~1.4 s) */
        setTimeout(() => {
            const parts   = url.replace('https://github.com/', '').split('/');
            const repoName = (parts[1] ?? 'repo').replace(/\.git$/, '');
            setGhLoading(false);
            onLaunch({
                code: MOCK_GH_CODE(url),
                fileName: `${repoName}.py`,
            });
        }, 1400);
    };

    return (
        <div className="sandbox-welcome">
            {/* Hero header */}
            <div className="sw-header">
                <p className="sw-eyebrow">Pyace Sandbox</p>
                <h1 className="sw-title">What would you like to build today?</h1>
                <p className="sw-subtitle">
                    Write Python freely, pick up where you left off, tackle an assignment,
                    or clone a GitHub repository — all in one place.
                </p>
            </div>

            {/* Launch card grid */}
            <div className="sw-grid">

                {/* ── Free Play ── */}
                <div className="sw-card free-play" onClick={handleFreePlay}>
                    <div className="sw-card-icon green">🧪</div>
                    <p className="sw-card-title">Free Play</p>
                    <p className="sw-card-desc">
                        Start from a blank slate. Experiment with any Python concept,
                        then submit to AI for instant feedback.
                    </p>
                    <button className="sw-start-btn" onClick={handleFreePlay}>
                        ▶&nbsp; Start Coding
                    </button>
                </div>

                {/* ── Continue Recent Project ── */}
                <div className="sw-card recent interactive">
                    <div className="sw-card-icon purple">📂</div>
                    <p className="sw-card-title">Continue a Project</p>
                    <div className="sw-recent-list">
                        {RECENT_PROJECTS.map((p) => (
                            <div
                                key={p.id}
                                className="sw-recent-item"
                                onClick={() => handleRecent(p)}
                            >
                                <span className="sw-recent-icon">🐍</span>
                                <div className="sw-recent-info">
                                    <span className="sw-recent-name">{p.name}</span>
                                    <span className="sw-recent-meta">{p.desc} · {p.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Work on Assignment ── */}
                <div className="sw-card assignment interactive">
                    <div className="sw-card-icon amber">📝</div>
                    <p className="sw-card-title">Work on Assignment</p>
                    <p className="sw-card-desc">
                        Load a pending assignment directly into the editor with the
                        correct starter template.
                    </p>
                    <select
                        className="sw-select"
                        value={selectedAsgn}
                        onChange={(e) => setSelectedAsgn(e.target.value)}
                    >
                        {MOCK_ASSIGNMENTS.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.name}
                            </option>
                        ))}
                    </select>
                    <button className="sw-open-btn" onClick={handleAssignment}>
                        Open in Editor →
                    </button>
                </div>

                {/* ── Pull from GitHub ── */}
                <div className="sw-card github interactive">
                    <div className="sw-card-icon grey">
                        {/* Inline GitHub mark SVG to avoid any import issues */}
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="var(--sb-text)">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                    </div>
                    <p className="sw-card-title">Pull from GitHub</p>
                    <p className="sw-card-desc">
                        Enter a public repository URL to clone its main file directly
                        into the editor.
                    </p>
                    <form onSubmit={handleGitHubClone} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div className="sw-gh-row">
                            <input
                                type="url"
                                className="sw-gh-input"
                                placeholder={GH_PLACEHOLDER}
                                value={ghUrl}
                                onChange={(e) => { setGhUrl(e.target.value); setGhError(''); }}
                                spellCheck={false}
                                autoComplete="off"
                            />
                            <button type="submit" className="sw-gh-btn" disabled={ghLoading}>
                                Clone
                            </button>
                        </div>
                        {ghError && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--sb-red)' }}>{ghError}</span>
                        )}
                        {ghLoading && (
                            <div className="sw-gh-loading">
                                <div className="sb-spinner" />
                                Cloning repository…
                            </div>
                        )}
                    </form>
                </div>

            </div>
        </div>
    );
};

export default SandboxWelcome;
