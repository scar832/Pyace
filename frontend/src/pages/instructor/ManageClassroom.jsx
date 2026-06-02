import React, { useState } from 'react';
import { School, Plus } from 'lucide-react';
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
    },
    {
        id: 'cs450',
        name: 'Introduction to Artificial Intelligence',
        courseCode: 'CS 450',
        lecturer: 'Prof. Geoffrey Hinton',
        accent: '#8b5cf6',
        status: 'active',
        coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80&fit=crop',
    },
    {
        id: 'se210',
        name: 'User Interface Engineering',
        courseCode: 'SE 210',
        lecturer: 'Sarah Drasner',
        accent: '#10b981',
        status: 'active',
        coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
    },
    {
        id: 'db201',
        name: 'Database Management Systems',
        courseCode: 'DB 201',
        lecturer: 'Dr. Edgar Codd',
        accent: '#ef4444',
        status: 'past',
        coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80&fit=crop',
    }
];

const ManageClassroom = () => {
    const [className, setClassName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [filter, setFilter] = useState('active');

    const handleCreate = (e) => {
        e.preventDefault();
        if (!className || !courseCode) return;
        alert(`Class Created: ${className} (${courseCode})`);
        setClassName('');
        setCourseCode('');
    };

    const filtered = mockClasses.filter((c) => c.status === filter);

    return (
        <motion.div
            className="classes-container"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
        >
            <div className="classes-page-header">
                <h1 className="classes-page-title">Manage Classroom</h1>
                <p className="classes-page-subtitle">Create and manage your courses, students, and resources.</p>
            </div>

            <div className="join-class-section">
                <p className="join-class-label">Create a new class</p>
                <form className="join-class-form" onSubmit={handleCreate}>
                    <input
                        type="text"
                        className="join-input"
                        placeholder="Class Name (e.g. Data Structures)"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        className="join-input"
                        placeholder="Course Code (e.g. CS 301)"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        required
                    />
                    <input type="file" className="join-input" alt="Upload Cover Image" />
                    <button type="submit" className="join-btn" style={{ display: 'flex', alignItems: 'center' }}>
                        <Plus size={16} style={{ marginRight: 6 }} /> Create Class
                    </button>
                </form>
            </div>

            <div className="classes-section">
                <div className="classes-section-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h2 className="classes-section-title">
                            {filter === 'active' ? 'Active Classes' : 'Past Classes'}
                        </h2>
                        <span className="classes-count">{filtered.length} classes</span>
                    </div>

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

                <div className="classes-grid">
                    {filtered.length === 0 ? (
                        <div className="classes-empty">
                            <div className="classes-empty-icon">
                                <School size={40} />
                            </div>
                            <h3>No {filter} classes</h3>
                            <p>Create a class above to get started.</p>
                        </div>
                    ) : (
                        filtered.map((cls) => <ClassCard key={cls.id} basePath="/instructor/classroom" {...cls} />)
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ManageClassroom;
