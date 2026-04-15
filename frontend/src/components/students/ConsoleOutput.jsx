import React, { useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

/**
 * ConsoleOutput
 * Props:
 *   view       'terminal' | 'ai'
 *   setView    setter
 *   lines      TerminalLine[]   — terminal output
 *   aiResult   AIResult | null  — AI review object
 *   onClear    ()               — clears terminal lines
 */
const ConsoleOutput = ({ view, setView, lines, aiResult, onClear }) => {
    const bodyRef = useRef(null);

    /* Auto-scroll to bottom whenever lines or view changes */
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [lines, view, aiResult]);

    /* Grade colour */
    const gradeColor = (score) => {
        if (score >= 9) return '#10b981';
        if (score >= 7) return '#0061ff';
        if (score >= 5) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="console-panel">
            {/* Header */}
            <div className="console-header">
                <div className="console-tabs">
                    <button
                        className={`console-tab${view === 'terminal' ? ' active' : ''}`}
                        onClick={() => setView('terminal')}
                    >
                        Terminal
                    </button>
                    <button
                        className={`console-tab${view === 'ai' ? ' active' : ''}`}
                        onClick={() => setView('ai')}
                    >
                        AI Review
                        {aiResult && (
                            <span style={{
                                marginLeft: '6px',
                                fontSize: '0.7rem',
                                color: gradeColor(aiResult.score),
                                fontWeight: 700,
                            }}>
                                {aiResult.score}/10
                            </span>
                        )}
                    </button>
                </div>

                {view === 'terminal' && (
                    <button className="console-clear-btn" onClick={onClear}>
                        <Trash2 size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        Clear
                    </button>
                )}
            </div>

            {/* Body */}
            <div className="console-body" ref={bodyRef}>
                {/* ── TERMINAL ── */}
                {view === 'terminal' && (
                    <>
                        {lines.length === 0 ? (
                            <div className="console-line">
                                <span className="console-text system">
                                    Ready. Press "Run Code" to execute your script.
                                </span>
                            </div>
                        ) : (
                            lines.map((l, i) => (
                                <div key={i} className="console-line">
                                    {l.prefix && (
                                        <span className="console-prefix">{l.prefix}</span>
                                    )}
                                    <span className={`console-text${l.type ? ` ${l.type}` : ''}`}>
                                        {l.text}
                                    </span>
                                </div>
                            ))
                        )}
                    </>
                )}

                {/* ── AI REVIEW ── */}
                {view === 'ai' && (
                    <>
                        {!aiResult ? (
                            <p className="ai-empty">
                                No AI review yet — write some code and press "Submit to AI".
                            </p>
                        ) : (
                            <div className="ai-review-panel">
                                {/* Score */}
                                <div className="ai-score-row">
                                    <div
                                        className="ai-score-circle"
                                        style={{ borderColor: gradeColor(aiResult.score) }}
                                    >
                                        <div style={{ textAlign: 'center' }}>
                                            <div className="ai-score-num" style={{ color: gradeColor(aiResult.score) }}>
                                                {aiResult.score}
                                            </div>
                                            <div className="ai-score-denom">/10</div>
                                        </div>
                                    </div>

                                    <div className="ai-score-info">
                                        <span className="ai-score-label">{aiResult.grade}</span>
                                        <span className="ai-score-grade">{aiResult.summary}</span>
                                    </div>

                                    <div className="ai-score-bar" style={{ flex: 1 }}>
                                        <div
                                            className="ai-score-fill"
                                            style={{
                                                width: `${(aiResult.score / 10) * 100}%`,
                                                background: gradeColor(aiResult.score),
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Review text */}
                                <p className="ai-section-label">Performance Review</p>
                                <p className="ai-review-text">{aiResult.review}</p>

                                {/* Optimisation tips */}
                                <p className="ai-section-label">Optimization Tips</p>
                                <ul className="ai-tips-list">
                                    {aiResult.tips.map((tip, i) => (
                                        <li key={i} className="ai-tip-item">
                                            <span className="ai-tip-dot" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ConsoleOutput;
