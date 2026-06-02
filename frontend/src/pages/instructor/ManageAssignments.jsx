import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, ChevronDown, ExternalLink, Edit2, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import CalendarWidget from '../../components/general/CalendarWidget';
import '../../Styles/classes.css';
import '../../Styles/classDetail.css';

/* ─── Mock Data ──────────────────────────────────────────────────────────── */
const mockAssignments = [
  {
    id: 'a1',
    title: 'Graph Traversal Implementation',
    courseName: 'Advanced Data Structures',
    courseCode: 'CS 301',
    due: 'Oct 15, 2026',
    status: 'active',
    details: 'Implement BFS and DFS in Python.',
    studentsSubmitted: 45,
    studentsNotSubmitted: 5,
    markedByAi: 40,
    totalStudents: 50,
    url: '#'
  },
  {
    id: 'a2',
    title: 'Red-Black Tree Visualiser',
    courseName: 'Advanced Data Structures',
    courseCode: 'CS 301',
    due: 'Sep 28, 2026',
    status: 'closed',
    details: 'Build an interactive web tool.',
    studentsSubmitted: 48,
    studentsNotSubmitted: 2,
    markedByAi: 48,
    totalStudents: 50,
    url: '#'
  },
  {
    id: 'c1',
    title: 'Component Library — Part 1',
    courseName: 'User Interface Engineering',
    courseCode: 'SE 210',
    due: 'Oct 05, 2026',
    status: 'closed',
    details: 'Design and build button and input components in React.',
    studentsSubmitted: 30,
    studentsNotSubmitted: 0,
    markedByAi: 30,
    totalStudents: 30,
    url: '#'
  }
];

const statusMap = {
  active: { label: 'Active', cls: 'status-active' },
  closed: { label: 'Closed', cls: 'status-submitted' },
  graded: { label: 'Graded', cls: 'status-graded' },
  overdue: { label: 'Overdue', cls: 'status-overdue' },
};

const ManageAssignments = () => {
  const [filterClass, setFilterClass] = useState('All');
  const [expandedAssignment, setExpandedAssignment] = useState(null);

  const classes = ['All', ...new Set(mockAssignments.map(a => a.courseCode))];

  const filteredAssignments = filterClass === 'All' 
    ? mockAssignments 
    : mockAssignments.filter(a => a.courseCode === filterClass);

  return (
    <motion.div
      className="classes-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="classes-page-header">
        <h1 className="classes-page-title">Manage Assignments</h1>
        <p className="classes-page-subtitle">Create, view, and manage assignments across your classes.</p>
      </div>

      <div className="join-class-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Filter by Class:</span>
          <select 
            value={filterClass} 
            onChange={(e) => setFilterClass(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-main)',
              outline: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.88rem'
            }}
          >
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button className="join-btn" style={{ margin: 0, display: 'flex', alignItems: 'center' }} onClick={() => alert('Create Assignment Dialog')}>
          <Plus size={16} style={{ marginRight: 6 }} /> Create Assignment
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(280px, 320px)', gap: '24px', alignItems: 'start' }}>
        <div className="classes-section" style={{ margin: 0 }}>
          <div className="classes-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 className="classes-section-title">Assignments</h2>
              <span className="classes-count">{filteredAssignments.length} total</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredAssignments.length === 0 ? (
              <div className="classes-empty">
                <div className="classes-empty-icon">
                  <FileText size={40} />
                </div>
                <h3>No assignments found</h3>
                <p>Create an assignment or change the filter.</p>
              </div>
            ) : (
              filteredAssignments.map((a) => {
                const { label, cls: sCls } = statusMap[a.status] ?? {};
                const isExpanded = expandedAssignment === a.id;
                return (
                  <div key={a.id} className={`assignment-accordion ${isExpanded ? 'expanded' : ''}`}>
                    <div className="assignment-row" onClick={() => setExpandedAssignment(isExpanded ? null : a.id)}>
                      <div className="assignment-icon"><FileText size={18} /></div>
                      <div className="assignment-info">
                        <p className="assignment-title">{a.title}</p>
                        <p className="assignment-due">
                          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{a.courseCode}</span> • Due {a.due}
                        </p>
                      </div>
                      <span className={`assignment-status ${sCls}`}>{label}</span>
                      <ChevronDown className={`assignment-chevron ${isExpanded ? 'rotated' : ''}`} size={16} />
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          className="assignment-details"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="assignment-details-content">
                            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', marginBottom: '20px' }}>{a.details}</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                              <div style={{ background: 'rgba(0, 97, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0, 97, 255, 0.1)' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', marginBottom: '8px' }}>
                                   <CheckCircle size={16} /> <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Submitted</span>
                                 </div>
                                 <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>{a.studentsSubmitted} <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>/ {a.totalStudents}</span></p>
                              </div>

                              <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: '8px' }}>
                                   <Clock size={16} /> <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Not Submitted</span>
                                 </div>
                                 <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#ef4444' }}>{a.studentsNotSubmitted}</p>
                              </div>

                              <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '8px' }}>
                                   <CheckCircle size={16} /> <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Marked by AI</span>
                                 </div>
                                 <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#10b981' }}>{a.markedByAi} <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>/ {a.studentsSubmitted}</span></p>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                              <Link to={a.url || '#'} className="join-btn" style={{ margin: 0, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                View Submissions <ExternalLink size={14} />
                              </Link>
                              <button className="join-btn" style={{ margin: 0, background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => alert('Edit assignment')}>
                                <Edit2 size={14} /> Edit Details
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="calendar-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-text-main)' }}>Calendar</h3>
          <CalendarWidget />
        </div>
      </div>
    </motion.div>
  );
};

export default ManageAssignments;
