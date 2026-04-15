import React, { useState } from 'react';
import { School } from 'lucide-react';
import { motion } from 'framer-motion';
import ClassCard from '../../components/students/ClassCard';
import '../../Styles/classes.css';

/* ─── Mock Data ──────────────────────────────────────────────────────────── */
const mockClasses = [
    {
        id: 'cs301',
        name: 'Advanced Data Structures',
        courseCode: 'CS 301',
        lecturer: 'Dr. Alan Turing',
        accent: '#0061ff',
        status: 'active',
        coverImage: 'https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?w=600&q=80&fit=crop',
        overallScore: 84,
        reviews: ['Great structure', 'Tough grading', 'Very rewarding', 'Clear examples'],
    },
    {
        id: 'cs450',
        name: 'Introduction to Artificial Intelligence',
        courseCode: 'CS 450',
        lecturer: 'Prof. Geoffrey Hinton',
        accent: '#8b5cf6',
        status: 'active',
        coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80&fit=crop',
        overallScore: 91,
        reviews: ['Mind-expanding', 'Heavy workload', 'Inspiring lecturer'],
    },
    {
        id: 'se210',
        name: 'User Interface Engineering',
        courseCode: 'SE 210',
        lecturer: 'Sarah Drasner',
        accent: '#10b981',
        status: 'active',
        coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
        overallScore: 95,
        reviews: ['Excellent projects', 'Creative freedom', 'Best course this semester'],
    },
    {
        id: 'se305',
        name: 'Modern Web Architecture',
        courseCode: 'SE 305',
        lecturer: 'Dan Abramov',
        accent: '#f59e0b',
        status: 'active',
        coverImage: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&q=80&fit=crop',
        overallScore: 78,
        reviews: ['Very practical', 'Fast-paced', 'Solid fundamentals'],
    },
    {
        id: 'db201',
        name: 'Database Management Systems',
        courseCode: 'DB 201',
        lecturer: 'Dr. Edgar Codd',
        accent: '#ef4444',
        status: 'past',
        coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80&fit=crop',
        overallScore: 88,
        reviews: ['Dense but useful', 'SQL labs were great', 'Final was hard'],
    },
    {
        id: 'cs220',
        name: 'Computer Organisation & Architecture',
        courseCode: 'CS 220',
        lecturer: 'Prof. John Hennessy',
        accent: '#06b6d4',
        status: 'past',
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&fit=crop',
        overallScore: 72,
        reviews: ['Low-level is tricky', 'RISC-V labs were fun', 'Very demanding'],
    },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
const Classes = () => {
    const [joinCode, setJoinCode] = useState('');
    const [filter, setFilter] = useState('active'); // 'active' | 'past'

    const handleJoin = (e) => {
        e.preventDefault();
        const code = joinCode.trim();
        if (!code) return;
        // TODO: wire to POST /api/classes/join
        alert(`Join request sent for code: "${code}"`);
        setJoinCode('');
    };

    const filtered = mockClasses.filter((c) => c.status === filter);

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
                        placeholder="Enter class code (e.g. XK-4291)"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <button type="submit" className="join-btn">
                        Join Class
                    </button>
                </form>
            </div>

            {/* Enrolled Classes */}
            <div className="classes-section">
                <div className="classes-section-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h2 className="classes-section-title">
                            {filter === 'active' ? 'Active Classes' : 'Past Classes'}
                        </h2>
                        <span className="classes-count">{filtered.length} classes</span>
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
                        <button
                            className={`filter-pill favorites${filter === 'favorites' ? ' active' : ''}`}
                            onClick={() => setFilter('favorites')}
                        >
                            Favorites
                        </button>
                    </div>
                </div>

                <div className="classes-grid">
                    {filtered.length === 0 ? (
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
                        filtered.map((cls) => <ClassCard key={cls.id} {...cls} />)
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Classes;