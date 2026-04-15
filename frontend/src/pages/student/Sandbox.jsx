import React, { useState, useCallback } from 'react';
import ChallengeSidebar, {
    FREE_PLAY_STARTER,
} from '../../components/students/ChallengeSidebar';
import MockEditor    from '../../components/students/MockEditor';
import ConsoleOutput from '../../components/students/ConsoleOutput';
import SandboxWelcome from '../../components/students/SandboxWelcome';
import '../../Styles/sandbox.css';

/* ─── Mock AI Responses ──────────────────────────────────────────────────── */
const getMockAiResult = (challengeId, code) => {
    if (code.trim().length < 20) {
        return {
            score: 2, grade: 'Needs Work', summary: 'Submission too short to evaluate.',
            review: 'Your submission appears to be incomplete or empty. Make sure to implement the full solution before submitting.',
            tips: [
                'Read the objective carefully and plan your approach before coding.',
                'Start with a simple case and build from there.',
                'Add at least one print statement to verify your output.',
            ],
        };
    }

    const presets = {
        ch1: {
            score: 8, grade: 'Great', summary: 'Solid approach with room for micro-optimisations.',
            review: 'Your `reverse_string` implementation is correct and readable. You correctly avoided Python\'s built-in slicing shortcut and used an iterative approach.',
            tips: [
                'Avoid `result += char` in a loop — string concatenation is O(n²). Use a list and `"".join(result)` at the end.',
                'Add a docstring to document your function\'s purpose and edge cases.',
                'Consider handling edge cases: empty string, single character input.',
            ],
        },
        ch2: {
            score: 9, grade: 'Excellent', summary: 'Clean, Pythonic solution.',
            review: 'Excellent work on the anagram checker. Using `Counter` from `collections` is the canonical Python approach.',
            tips: [
                'You could further simplify with `return Counter(a.lower()) == Counter(b.lower())`.',
                'Consider filtering out spaces if the spec requires it.',
                'Add a type hint return annotation for production readiness.',
            ],
        },
        ch3: {
            score: 7, grade: 'Good', summary: 'Working solution but the comprehension could be more Pythonic.',
            review: 'Your `flatten` function produces the correct output. The nested loop comprehension can be expressed more idiomatically.',
            tips: [
                'Preferred idiom: `return [x for sublist in nested for x in sublist]`.',
                'Add a type hint: `def flatten(nested: list[list]) -> list`.',
                'For deeper nesting explore `itertools.chain.from_iterable`.',
            ],
        },
        ch4: {
            score: 10, grade: 'Perfect', summary: 'Optimal memoised solution.',
            review: 'Outstanding. Your recursive Fibonacci implementation correctly uses `@lru_cache` to achieve O(n) time complexity.',
            tips: [
                'In Python 3.9+ you can use `@cache` as a cleaner alias for `@lru_cache(maxsize=None)`.',
                'For very large `n`, consider an iterative bottom-up approach to avoid Python\'s recursion limit.',
                'Add `sys.setrecursionlimit` if you need n > 900 with recursion.',
            ],
        },
    };

    return presets[challengeId] ?? {
        score: 7, grade: 'Good', summary: 'Solid submission.',
        review: 'Your code demonstrates a good understanding of Python fundamentals. The logic is clear and the naming conventions are consistent.',
        tips: [
            'Use type hints (`def foo(x: int) -> str`) for improved readability.',
            'Extract magic numbers or strings into named constants.',
            'Consider edge cases: empty inputs, negative numbers, type mismatches.',
        ],
    };
};

/* ─── Mock run simulator ─────────────────────────────────────────────────── */
const simulateRun = (code, challenge) => {
    const lines = [];
    const ts = new Date().toLocaleTimeString();
    lines.push({ prefix: '$', text: `python main.py  [${ts}]`, type: 'system' });

    if (!code.trim()) {
        lines.push({ text: 'SyntaxError: no code to execute.', type: 'error' });
        return lines;
    }

    if (challenge) {
        const outs = {
            ch1: ['"olleh"', '"ecayP"'],
            ch2: ['True', 'False'],
            ch3: ['[1, 2, 3, 4, 5]'],
            ch4: ['13', '55'],
        };
        const output = outs[challenge.id];
        if (output) output.forEach((o) => lines.push({ text: o }));
        else lines.push({ text: '[output depends on your implementation]', type: 'warn' });
    } else {
        lines.push({ text: 'Hello, Student! Welcome to Pyace.' });
    }

    lines.push({ text: '\nProcess finished with exit code 0.', type: 'info' });
    return lines;
};

/* ─── Main Sandbox Component ─────────────────────────────────────────────── */
const Sandbox = () => {
    /* ── View state: 'welcome' | 'editor' ── */
    const [currentView, setCurrentView] = useState('welcome');

    /* Sidebar state */
    const [mode,             setMode]             = useState('freeplay');
    const [activeTopic,      setActiveTopic]      = useState(null);
    const [activeChallenge,  setActiveChallenge]  = useState(null);
    const [currentChallenge, setCurrentChallenge] = useState(null);

    /* Editor state */
    const [code,         setCode]         = useState(FREE_PLAY_STARTER);
    const [fileName,     setFileName]     = useState('main.py');
    const [assignmentId, setAssignmentId] = useState(null);

    /* Console state */
    const [consoleView,   setConsoleView]   = useState('terminal');
    const [terminalLines, setTerminalLines] = useState([]);
    const [aiResult,      setAiResult]      = useState(null);
    const [isLoading,     setIsLoading]     = useState(false);

    /* ── Welcome screen → editor transition ── */
    const handleLaunch = useCallback(({ code: launchCode, fileName: launchFile, assignmentId: aId = null }) => {
        setCode(launchCode);
        setFileName(launchFile);
        setAssignmentId(aId);
        setTerminalLines([]);
        setAiResult(null);
        setConsoleView('terminal');
        setCurrentChallenge(null);
        setActiveChallenge(null);
        setActiveTopic(null);
        setMode('freeplay');
        setCurrentView('editor');
    }, []);

    /* ── Challenge sidebar → load challenge ── */
    const handleLoadChallenge = useCallback((challenge) => {
        setCurrentChallenge(challenge);
        setCode(challenge.starterCode);
        setFileName(`${challenge.id}.py`);
        setAssignmentId(null);
        setTerminalLines([]);
        setAiResult(null);
        setConsoleView('terminal');
    }, []);

    /* ── Free-play mode switch ── */
    const handleSetMode = (m) => {
        setMode(m);
        if (m === 'freeplay') {
            setCurrentChallenge(null);
            setActiveChallenge(null);
            setActiveTopic(null);
            setCode(FREE_PLAY_STARTER);
            setFileName('main.py');
            setAssignmentId(null);
            setTerminalLines([]);
            setAiResult(null);
        }
    };

    /* ── Run Code ── */
    const handleRun = useCallback(() => {
        setTerminalLines(simulateRun(code, currentChallenge));
        setConsoleView('terminal');
    }, [code, currentChallenge]);

    /* ── Submit to AI ── */
    const handleSubmitAI = useCallback(() => {
        if (isLoading) return;
        setIsLoading(true);
        setConsoleView('terminal');
        setTerminalLines([
            { prefix: '$', text: 'Sending to Pyace AI grader…', type: 'system' },
            { text: 'Analysing code structure, logic, and style…', type: 'info' },
        ]);
        setTimeout(() => {
            setAiResult(getMockAiResult(currentChallenge?.id, code));
            setConsoleView('ai');
            setIsLoading(false);
        }, 1800);
    }, [code, currentChallenge, isLoading]);

    /* ── Clear terminal ── */
    const handleClear = () => setTerminalLines([]);

    const displayFile = currentChallenge ? `${currentChallenge.id}.py` : fileName;

    /* ── Title-bar back button (only in editor view) ── */
    const handleBackToWelcome = () => {
        setCurrentView('welcome');
        setCurrentChallenge(null);
    };

    return (
        <div className="sandbox-root">
            {/* macOS-style title bar */}
            <div className="sandbox-titlebar">
                <div className="sandbox-titlebar-dots">
                    <div className="sb-dot red"    />
                    <div className="sb-dot yellow" />
                    <div
                        className="sb-dot green"
                        style={{ cursor: currentView === 'editor' ? 'pointer' : 'default' }}
                        title={currentView === 'editor' ? 'Back to Welcome screen' : undefined}
                        onClick={currentView === 'editor' ? handleBackToWelcome : undefined}
                    />
                </div>
                <span className="sandbox-titlebar-label">PYACE SANDBOX</span>
                {currentView === 'editor' && (
                    <>
                        <span className="sandbox-titlebar-file">{displayFile}</span>
                        <button
                            onClick={handleBackToWelcome}
                            style={{
                                marginLeft: 'auto',
                                background: 'none',
                                border: '1px solid var(--sb-border)',
                                borderRadius: '6px',
                                color: 'var(--sb-muted)',
                                fontSize: '0.75rem',
                                fontFamily: 'var(--font-ui)',
                                fontWeight: 600,
                                padding: '3px 10px',
                                cursor: 'pointer',
                                transition: 'color 0.15s, border-color 0.15s',
                            }}
                            onMouseEnter={e => { e.target.style.color = 'var(--sb-text)'; e.target.style.borderColor = 'var(--sb-muted)'; }}
                            onMouseLeave={e => { e.target.style.color = 'var(--sb-muted)'; e.target.style.borderColor = 'var(--sb-border)'; }}
                        >
                            ← Home
                        </button>
                    </>
                )}
            </div>

            {/* ── WELCOME VIEW ── */}
            {currentView === 'welcome' && (
                <SandboxWelcome onLaunch={handleLaunch} />
            )}

            {/* ── EDITOR VIEW ── */}
            {currentView === 'editor' && (
                <div className="sandbox-body">
                    <ChallengeSidebar
                        mode={mode}
                        setMode={handleSetMode}
                        activeTopic={activeTopic}
                        setActiveTopic={setActiveTopic}
                        activeChallenge={activeChallenge}
                        setActiveChallenge={setActiveChallenge}
                        onLoadChallenge={handleLoadChallenge}
                    />

                    {/* Right column: editor + console */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, position: 'relative' }}>
                        <MockEditor
                            code={code}
                            onChange={setCode}
                            fileName={displayFile}
                            onRun={handleRun}
                            onSubmitAI={handleSubmitAI}
                            isLoading={isLoading}
                            assignmentId={assignmentId}
                        />
                        <ConsoleOutput
                            view={consoleView}
                            setView={setConsoleView}
                            lines={terminalLines}
                            aiResult={aiResult}
                            onClear={handleClear}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sandbox;