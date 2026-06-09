import React, { useState, useEffect } from 'react';
import { School, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ClassCard from '../../components/students/ClassCard';
import { fetchClasses, joinClass } from '../../api/classes';
import '../../Styles/classes.css';

/* ─── Accent color helper ────────────────────────────────────────────────── */
const getAccentColor = (code) => {
    const accents = [
        '#0061ff', // blue
        '#8b5cf6', // purple
        '#10b981', // green
        '#f59e0b', // amber
        '#ef4444', // red
        '#06b6d4'  // cyan
    ];
    let hash = 0;
    if (code) {
        for (let i = 0; i < code.length; i++) {
            hash = code.charCodeAt(i) + ((hash << 5) - hash);
        }
    }
    const index = Math.abs(hash) % accents.length;
    return accents[index];
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joinCode, setJoinCode] = useState('');
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('active'); // 'active' | 'past'

    const loadClasses = async () => {
        try {
            const data = await fetchClasses();
            setClasses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClasses();
    }, []);

    const handleJoin = async (e) => {
        e.preventDefault();
        const code = joinCode.trim();
        if (!code) return;

        try {
            setError('');
            setSuccess('');
            setJoining(true);
            await joinClass(code);
            setJoinCode('');
            setSuccess('Successfully joined the class!');
            // Refresh classes list
            await loadClasses();
        } catch (err) {
            const msg = err.message || '';
            if (msg.includes('not found') || msg.includes('404')) {
                setError('No class found with this code. Check the code and try again.');
            } else if (msg.includes('Already enrolled') || msg.includes('already a member') || msg.includes('400')) {
                setError('You are already a member of this class.');
            } else {
                setError(msg || 'An error occurred while joining the class.');
            }
        } finally {
            setJoining(false);
        }
    };

    const filtered = classes.filter((c) => {
        if (filter === 'active') return c.status === 'active';
        if (filter === 'past') return c.status === 'archived';
        return true;
    });

    const mappedClasses = filtered.map((cls) => ({
        id: cls.id,
        name: cls.class_name,
        courseCode: cls.class_code,
        lecturer: cls.instructor_name || 'Instructor',
        status: cls.status,
        coverImage: cls.img_link,
        accent: getAccentColor(cls.class_code),
        rawClass: cls,
    }));

    return (
        <motion.div
            className="classes-container"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
        >
            {/* Page Header */}
            <div className="classes-page-header">
                <h1 className="classes-page-title">My Classes</h1>
                <p className="classes-page-subtitle">View and manage your enrolled courses.</p>
            </div>

            {/* Join Class */}
            <div className="join-class-section">
                <p className="join-class-label">Join a class</p>
                <form className="join-class-form" onSubmit={handleJoin}>
                    <input
                        type="text"
                        className="join-input"
                        placeholder="Enter class code (e.g. XK4291)"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        autoComplete="off"
                        spellCheck={false}
                        disabled={joining}
                    />
                    <button type="submit" className="join-btn" disabled={joining}>
                        {joining ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Loader2 className="modal-spinner" size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                Joining...
                            </span>
                        ) : (
                            'Join Class'
                        )}
                    </button>
                </form>

                {error && (
                    <div className="modal-error-banner" style={{ marginTop: '10px' }}>
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div style={{
                        marginTop: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        borderRadius: '12px',
                        color: '#34d399',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                    }}>
                        <CheckCircle2 size={16} />
                        <span>{success}</span>
                    </div>
                )}
            </div>

            {/* Enrolled Classes */}
            <div className="classes-section">
                <div className="classes-section-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h2 className="classes-section-title">
                            {filter === 'active' ? 'Active Classes' : 'Past Classes'}
                        </h2>
                        <span className="classes-count">{loading ? '...' : mappedClasses.length} classes</span>
                    </div>

                    {/* Active / Past toggle */}
                    <div className="classes-filter-pills">
                        <button
                            className={`filter-pill${filter === 'active' ? ' active' : ''}`}
                            onClick={() => setFilter('active')}
                        >
                            Active
                        </button>
                        <button
                            className={`filter-pill past${filter === 'past' ? ' active' : ''}`}
                            onClick={() => setFilter('past')}
                        >
                            Past
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                        <Loader2 size={32} className="modal-spinner" style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
                    </div>
                ) : (
                    <div className="classes-grid">
                        {mappedClasses.length === 0 ? (
                            <div className="classes-empty">
                                <div className="classes-empty-icon">
                                    <School size={40} />
                                </div>
                                <h3>No {filter} classes</h3>
                                <p>
                                    {filter === 'active'
                                        ? 'Join a class above using a code from your lecturer.'
                                        : 'Completed classes will appear here.'}
                                </p>
                            </div>
                        ) : (
                            mappedClasses.map((cls) => <ClassCard key={cls.id} {...cls} />)
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Classes;