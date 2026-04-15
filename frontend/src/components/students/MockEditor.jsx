import React, { useRef, useState, useCallback } from 'react';
import { Play, Cpu, ClipboardCheck, X } from 'lucide-react';
import { MOCK_ASSIGNMENTS } from './SandboxWelcome';

/* ─── Assignment Submission Modal ────────────────────────────────────────── */
const SubmitModal = ({ preselectedId, onClose }) => {
    const [selected,  setSelected]  = useState(preselectedId ?? MOCK_ASSIGNMENTS[0].id);
    const [submitted, setSubmitted] = useState(false);
    const [loading,   setLoading]   = useState(false);

    const handleConfirm = () => {
        setLoading(true);
        // Simulate a network call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1200);
    };

    const assignment = MOCK_ASSIGNMENTS.find((a) => a.id === selected);

    return (
        <div className="sb-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="sb-modal">
                {/* Header */}
                <div className="sb-modal-header">
                    <h2 className="sb-modal-title">
                        {submitted ? 'Submission Received' : 'Submit Assignment'}
                    </h2>
                    <button className="sb-modal-close" onClick={onClose} aria-label="Close modal">
                        <X size={18} />
                    </button>
                </div>

                {submitted ? (
                    /* ── Success state ── */
                    <div className="sb-modal-success">
                        <div className="sb-modal-success-icon">✅</div>
                        <h3>Assignment Submitted!</h3>
                        <p>
                            <strong style={{ color: 'var(--sb-text)' }}>{assignment?.name}</strong>
                            <br />
                            Your workspace has been submitted for grading. You'll receive
                            feedback within 24 hours.
                        </p>
                        <button className="sb-modal-success-btn" onClick={onClose}>
                            Back to Editor
                        </button>
                    </div>
                ) : (
                    /* ── Default state ── */
                    <>
                        <div className="sb-modal-body">
                            <div>
                                <span className="sb-modal-label">Assignment</span>
                                <select
                                    className="sb-modal-select"
                                    value={selected}
                                    onChange={(e) => setSelected(e.target.value)}
                                >
                                    {MOCK_ASSIGNMENTS.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name} — {a.due}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="sb-modal-info">
                                <span className="sb-modal-info-icon">💡</span>
                                <span>
                                    Your entire current workspace will be submitted for grading.
                                    Make sure your code runs without errors before confirming.
                                </span>
                            </div>
                        </div>

                        <div className="sb-modal-footer">
                            <button className="sb-modal-cancel" onClick={onClose}>
                                Cancel
                            </button>
                            <button
                                className="sb-modal-confirm"
                                onClick={handleConfirm}
                                disabled={loading}
                            >
                                {loading ? 'Submitting…' : 'Confirm Submission'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

/* ─── MockEditor ─────────────────────────────────────────────────────────── */
/**
 * MockEditor
 * Props:
 *   code            string    — controlled value
 *   onChange        (str)     — code setter
 *   fileName        string
 *   onRun           ()        — trigger run
 *   onSubmitAI      ()        — trigger AI review
 *   isLoading       bool      — AI submit in-flight
 *   assignmentId    string | null — pre-selects assignment in the modal
 */
const MockEditor = ({
    code,
    onChange,
    fileName = 'main.py',
    onRun,
    onSubmitAI,
    isLoading,
    assignmentId = null,
}) => {
    const textareaRef = useRef(null);
    const lineNumRef  = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);

    /* Sync line-number panel scroll with textarea scroll */
    const syncScroll = () => {
        if (lineNumRef.current && textareaRef.current) {
            lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    /* Tab-key inserts 4 spaces */
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd } = e.target;
            const spaces = '    ';
            const newCode = code.slice(0, selectionStart) + spaces + code.slice(selectionEnd);
            onChange(newCode);
            requestAnimationFrame(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart =
                    textareaRef.current.selectionEnd = selectionStart + spaces.length;
                }
            });
        }
    }, [code, onChange]);

    const lineCount = (code.match(/\n/g) ?? []).length + 1;

    /* Cursor position for statusbar */
    const [cursor, setCursor] = useState({ line: 1, col: 1 });
    const updateCursor = () => {
        const ta = textareaRef.current;
        if (!ta) return;
        const before = code.slice(0, ta.selectionStart);
        const lines  = before.split('\n');
        setCursor({ line: lines.length, col: lines[lines.length - 1].length + 1 });
    };

    return (
        <>
            <div className="editor-column">
                {/* Top action bar */}
                <div className="editor-topbar">
                    <div className="editor-lang-badge">
                        <div className="editor-lang-dot" />
                        Python 3.11
                    </div>

                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <span style={{
                            fontSize: '0.8rem',
                            color: 'var(--sb-muted)',
                            fontFamily: 'var(--font-code)',
                        }}>
                            {fileName}
                        </span>
                    </div>

                    <div className="editor-topbar-actions">
                        <button className="sb-btn run" onClick={onRun}>
                            <Play size={13} fill="currentColor" />
                            Run Code
                        </button>
                        <button
                            className={`sb-btn submit${isLoading ? ' loading' : ''}`}
                            onClick={onSubmitAI}
                            disabled={isLoading}
                        >
                            <Cpu size={13} />
                            {isLoading ? 'Grading…' : 'Submit to AI'}
                        </button>
                        {/* ── Submit Assignment button ── */}
                        <button
                            className="sb-btn assign-submit"
                            onClick={() => setModalOpen(true)}
                        >
                            <ClipboardCheck size={13} />
                            Submit Assignment
                        </button>
                    </div>
                </div>

                {/* Editor area */}
                <div className="editor-area">
                    {/* Line numbers */}
                    <div className="editor-line-numbers" ref={lineNumRef}>
                        {Array.from({ length: lineCount }, (_, i) => (
                            <span key={i + 1}>{i + 1}</span>
                        ))}
                    </div>

                    {/* Code textarea */}
                    <textarea
                        ref={textareaRef}
                        className="editor-textarea"
                        value={code}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onScroll={syncScroll}
                        onKeyUp={updateCursor}
                        onClick={updateCursor}
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        aria-label="Code editor"
                    />
                </div>

                {/* Status bar */}
                <div className="editor-statusbar">
                    <span className="statusbar-item">Ln {cursor.line}, Col {cursor.col}</span>
                    <span className="statusbar-item">UTF-8</span>
                    <span className="statusbar-item">Python</span>
                    <span className="statusbar-item" style={{ marginLeft: 'auto' }}>Pyace Sandbox</span>
                </div>
            </div>

            {/* Modal — rendered as sibling so it can overlay the full sandbox-root */}
            {modalOpen && (
                <SubmitModal
                    preselectedId={assignmentId}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    );
};

export default MockEditor;
