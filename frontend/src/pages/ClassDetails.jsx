import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchClasses } from '../api/classes';
import ChatDrawer from '../components/student/ChatDrawer';
import {
  ArrowLeft,
  FileText,
  Users,
  BookOpen,
  Link2,
  Video,
  Megaphone,
  MoreVertical,
  Star,
  Archive,
  LogOut,
  BarChart2,
  MessageSquare,
  ChevronDown,
  Pin,
  MessageCircle,
  Download,
  ExternalLink,
  X,
  Layers,
  Award,
  Clipboard,
  Check,
  Loader2,
  Plus
} from 'lucide-react';
import { fetchAssignments } from '../api/assignments';
import AssignmentCard from '../components/AssignmentCard';
import CreateAssignmentModal from '../components/CreateAssignmentModal';
import '../Styles/classDetail.css';

/* ─── Helper for initials ────────────────────────────────────────────────── */
const initials = (name) =>
  name ? name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '??';

/* ─── Pure-CSS radial gauge ──────────────────────────────────────────────── */
const ScoreGauge = ({ score, color = '#0061ff' }) => {
  const r = 64;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  const grade =
    score >= 90 ? { label: 'A', bg: 'rgba(16,185,129,0.12)', color: '#10b981' } :
    score >= 80 ? { label: 'B', bg: 'rgba(0,97,255,0.1)',    color: '#0061ff' } :
    score >= 70 ? { label: 'C', bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' } :
                  { label: 'D', bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' };

  return (
    <div className="score-gauge-wrapper">
      <div className="score-gauge">
        <svg viewBox="0 0 160 160" width="160" height="160">
          <circle className="score-gauge-track" cx="80" cy="80" r={r} />
          <circle
            className="score-gauge-fill"
            cx="80" cy="80" r={r}
            stroke={color}
            strokeDasharray={`${circ}`}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="score-gauge-center">
          <span className="score-gauge-value">{score}</span>
          <span className="score-gauge-label">/ 100</span>
        </div>
      </div>
      <span className="score-grade-badge" style={{ background: grade.bg, color: grade.color }}>
        Grade {grade.label}
      </span>
    </div>
  );
};

/* ─── Mock Database Scoped fallbacks ─────────────────────────────────────── */
const mockDb = {
  cs301: {
    tas: ['Grace Hopper', 'Ada Lovelace'],
    hasGroups: true,
    groups: [
      { id: 'g1', name: 'Alpha Team', members: ['Kwame Asante', 'Priya Nair'] },
      { id: 'g2', name: 'Beta Squad', members: ['Luca Ferrari', 'Sofia Mendes', 'James Osei'] },
      { id: 'g3', name: 'Gamma Coders', members: ['Aiko Tanaka', 'Ravi Patel', 'Chioma Eze'] },
    ],
    scoreBreakdown: [
      { name: 'Assignments', value: 88 },
      { name: 'Quizzes',     value: 79 },
      { name: 'Participation', value: 92 },
      { name: 'Final Exam',  value: 76 },
    ],
    assignments: [
      { id: 'a1', title: 'Graph Traversal Implementation', due: 'Oct 15, 2026', status: 'active', details: 'Implement BFS and DFS in Python to find the shortest path in a weighted graph.', url: '#' },
      { id: 'a2', title: 'Red-Black Tree Visualiser',      due: 'Sep 28, 2026', status: 'submitted', details: 'Build an interactive web tool that visualises node insertions and rotations for Red-Black Trees.', url: '#' },
      { id: 'a3', title: 'Dynamic Programming Problem Set', due: 'Nov 02, 2026', status: 'active', details: 'Solve 5 complex dynamic programming challenges to optimise time complexity.', url: '#' },
      { id: 'a4', title: 'Hash Table Analysis Essay',      due: 'Sep 10, 2026', status: 'graded', details: 'Discuss the impact of different collision resolution strategies on hash table performance.', url: '#' },
    ],
    mates: [
      { id: 'm1', name: 'Kwame Asante',  tag: '3rd Year', isLeader: true },
      { id: 'm2', name: 'Priya Nair',    tag: '3rd Year' },
      { id: 'm3', name: 'Luca Ferrari',  tag: '2nd Year' },
      { id: 'm4', name: 'Sofia Mendes',  tag: '3rd Year' },
      { id: 'm5', name: 'James Osei',    tag: '3rd Year' },
      { id: 'm6', name: 'Aiko Tanaka',   tag: '2nd Year' },
      { id: 'm7', name: 'Ravi Patel',    tag: '3rd Year' },
      { id: 'm8', name: 'Chioma Eze',    tag: '3rd Year', isLeader: true },
    ],
    resources: [
      { id: 'r1', type: 'document',     title: 'Course Syllabus',             desc: 'Full outline, grading criteria, and important deadlines.',         date: 'Aug 25, 2026', url: '#', thumbnail: '' },
      { id: 'r2', type: 'document',     title: 'Week 3 Lecture Notes — Trees', desc: 'Slides covering BST, AVL, and Red-Black Trees.',                   date: 'Sep 12, 2026', url: '#' },
      { id: 'r3', type: 'link',         title: 'Algorithm Visualiser',        desc: 'Interactive tool for exploring sorting and graph algorithms.',        date: 'Sep 01, 2026', url: '#' },
      { id: 'r4', type: 'video',        title: 'Office Hours — Week 5',       desc: 'Recap of common questions on dynamic programming memoisation.',      date: 'Sep 28, 2026', url: '#' },
    ],
    announcements: [
      { id: 'an1', title: 'Assignment 3 Clarification', date: 'Oct 01, 2026', content: 'You may use any programming language for the graph traversal implementation. Pseudocode is not accepted. Submit your code and a 1-page write-up via the portal by midnight.', isPinned: true },
      { id: 'an2', title: 'Office Hours Rescheduled', date: 'Sep 25, 2026', content: "Grace's office hours this week are moved to Thursday, 3–5 PM (Room 204). All other schedules remain the same.", isPinned: false },
      { id: 'an3', title: 'Midterm Results Posted', date: 'Sep 18, 2026', content: 'Midterm scores are now visible on the portal. Class average was 74%. Please reach out during office hours if you have any questions about your grade.', isPinned: false },
    ],
    overallScore: 84,
    reviews: ['Great structure', 'Tough grading', 'Very rewarding', 'Clear examples', 'Best TA support']
  },
  cs450: {
    tas: ['Yann LeCun'],
    hasGroups: false,
    scoreBreakdown: [
      { name: 'Assignments',   value: 94 },
      { name: 'Quizzes',       value: 88 },
      { name: 'Participation', value: 95 },
      { name: 'Final Exam',    value: 87 },
    ],
    assignments: [
      { id: 'b1', title: 'Search Algorithms Lab',    due: 'Sep 10, 2026', status: 'graded', details: 'Implement A* search.', url: '#' },
      { id: 'b2', title: 'Neural Network from Scratch', due: 'Nov 01, 2026', status: 'active', details: 'Build a feedforward NN.', url: '#' },
      { id: 'b3', title: 'Minimax Agent',            due: 'Oct 20, 2026', status: 'overdue', details: 'Create an agent to play Tic-Tac-Toe.', url: '#' },
    ],
    mates: [
      { id: 'm9',  name: 'Eve Davis',    tag: '4th Year' },
      { id: 'm10', name: 'Frank Miller', tag: '3rd Year' },
      { id: 'm11', name: 'Laila Hassan', tag: '4th Year' },
    ],
    resources: [
      { id: 'r6', type: 'document',     title: 'Russell & Norvig — Chapter 3', desc: 'Required reading on uninformed and informed search strategies.', date: 'Sep 03, 2026', url: '#' },
      { id: 'r7', type: 'video',        title: 'Backprop Explained',           desc: 'Recorded walkthrough of the backpropagation algorithm.',       date: 'Sep 20, 2026', url: '#' },
    ],
    announcements: [
      { id: 'an4', title: 'Midterm Date Confirmed', date: 'Oct 02, 2026', content: 'The midterm exam will be held on October 30th, 9:00 AM in Hall B. The exam covers Chapters 1–8. No calculators allowed.', isPinned: true },
      { id: 'an5', title: 'Assignment 3 Extension', date: 'Oct 15, 2026', content: 'Due to the midterm, the Minimax Agent deadline has been extended by 5 days. New deadline: October 25th.', isPinned: false },
    ],
    overallScore: 91,
    reviews: ['Mind-expanding', 'Heavy workload', 'Inspiring lecturer', 'World-class content']
  }
};

/* ─── Accent Color Utility ────────────────────────────────────────────────── */
const getAccentColor = (code) => {
  const accents = ['#0061ff', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
  let hash = 0;
  if (code) {
    for (let i = 0; i < code.length; i++) {
      hash = code.charCodeAt(i) + ((hash << 5) - hash);
    }
  }
  const index = Math.abs(hash) % accents.length;
  return accents[index];
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */
const ResourceIcon = ({ type, className }) => {
  const map = {
    document:     { icon: <FileText size={20} />, cls: 'pdf' },
    pdf:          { icon: <FileText size={20} />, cls: 'pdf' },
    link:         { icon: <Link2 size={20} />,    cls: 'link' },
    video:        { icon: <Video size={20} />,    cls: 'video' },
    announcement: { icon: <Megaphone size={20} />, cls: 'announcement' },
  };
  const entry = map[type] ?? map['document'];
  return <div className={`resource-icon ${entry.cls} ${className || ''}`}>{entry.icon}</div>;
};

const statusMap = {
  active:    { label: 'Active',     cls: 'status-active' },
  submitted: { label: 'Submitted',  cls: 'status-submitted' },
  graded:    { label: 'Graded',     cls: 'status-graded' },
  overdue:   { label: 'Overdue',    cls: 'status-overdue' },
};

const barColor = (v) =>
  v >= 90 ? '#10b981' : v >= 75 ? '#0061ff' : v >= 60 ? '#f59e0b' : '#ef4444';

const BannerMenu = ({ classId }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const act = (label) => {
    setOpen(false);
    console.log(`[BannerMenu] ${label} → ${classId}`);
  };

  return (
    <div className="banner-menu-wrapper" ref={ref}>
      <button
        className="banner-kebab-btn"
        onClick={() => setOpen((p) => !p)}
        aria-label="More options"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="banner-dropdown" role="menu">
          <button className="banner-dropdown-item" onClick={() => act('favourite')}>
            <Star size={15} /> Favourite
          </button>
          <button className="banner-dropdown-item" onClick={() => act('archive')}>
            <Archive size={15} /> Archive
          </button>
          <button className="banner-dropdown-item danger" onClick={() => act('leave')}>
            <LogOut size={15} /> Leave Class
          </button>
        </div>
      )}
    </div>
  );
};

/* ─── Main ClassDetails Page Component ───────────────────────────────────── */
const ClassDetails = () => {
  const { classId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [fetchedClass, setFetchedClass] = useState(null);
  const [loading, setLoading] = useState(!location.state?.classData);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('assignments');
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [copied, setCopied] = useState(false);

  // Real Database Assignment state
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [assignmentsError, setAssignmentsError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadAssignments = async () => {
    setLoadingAssignments(true);
    setAssignmentsError('');
    try {
      const data = await fetchAssignments(classId);
      setAssignments(data);
    } catch (err) {
      setAssignmentsError(err.message || 'Failed to load assignments.');
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [classId]);

  // Fallback API Fetch if refreshed / direct navigated
  useEffect(() => {
    if (!location.state?.classData) {
      const loadData = async () => {
        try {
          const list = await fetchClasses();
          const target = list.find((c) => c.id === classId);
          if (target) {
            setFetchedClass(target);
          } else {
            setError('Class not found or access denied.');
          }
        } catch (err) {
          setError(err.message || 'Failed to load class.');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [location.state?.classData, classId]);

  const classData = location.state?.classData || fetchedClass;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
        <Loader2 size={40} className="modal-spinner" style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Loading classroom details...</p>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', fontWeight: 600 }}>{error || 'Class details unavailable.'}</p>
        <Link to={role === 'teacher' ? '/instructor/classroom' : '/student/classes'} className="class-detail-back" style={{ margin: '16px auto 0' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  // Get mock details scoped to the class id, or fall back to default template
  const details = mockDb[classData.id] || mockDb[classData.class_code] || {
    tas: [],
    hasGroups: false,
    assignments: [
      { id: 'def-a1', title: 'Getting Started with Python', due: 'Next Week', status: 'active', details: 'Review the fundamentals of control flows, variables, and function declarations in python.', url: '#' }
    ],
    mates: [
      { id: 'def-m1', name: 'Classmates loading...', tag: 'Student' }
    ],
    resources: [
      { id: 'def-r1', type: 'document', title: 'Course Syllabus', desc: 'Overview of the course topics, schedule, and guidelines.', date: 'Today', url: '#' }
    ],
    announcements: [
      { id: 'def-an1', title: 'Welcome to the classroom!', date: 'Today', content: 'Welcome! I will post course updates, announcements, and resources in this view. Stay tuned.', isPinned: true }
    ],
    scoreBreakdown: [
      { name: 'Assignments', value: 100 },
      { name: 'Quizzes', value: 100 }
    ],
    overallScore: 100,
    reviews: ['Excellent setup']
  };

  const accent = getAccentColor(classData.class_code);
  const gradientStyle = {
    background: `linear-gradient(135deg, ${accent}cc, ${accent}55)`,
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(classData.class_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTabs = () => {
    const tabs = [
      { id: 'assignments',   label: 'Assignments',  Icon: FileText,     count: assignments.length },
      { id: 'mates',         label: role === 'teacher' ? 'Students' : 'Classmates',   Icon: Users,        countKey: 'mates' }
    ];
    if (details.hasGroups) {
      tabs.push({ id: 'groups', label: 'Groups', Icon: Layers, countKey: 'groups' });
    }
    tabs.push({ id: 'resources',     label: 'Resources',    Icon: BookOpen,     countKey: 'resources' });
    tabs.push({ id: 'announcements', label: 'Announcements',Icon: Megaphone,    countKey: 'announcements' });
    if (role === 'student') {
      tabs.push({ id: 'score',         label: 'Performance',  Icon: BarChart2,    countKey: null });
    }
    return tabs;
  };

  const currentTabs = getTabs();

  const panel = {
    hidden:  { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  };

  const mockMessages = [
    { id: 1, text: "Hey! Does anyone have the notes for week 3?", isSent: false, time: "10:30 AM" },
    { id: 2, text: "Check the Resources tab, I think the TA uploaded them.", isSent: true, time: "10:32 AM" },
    { id: 3, text: "Awesome, found them. Thanks!", isSent: false, time: "10:34 AM" }
  ];

  return (
    <motion.div
      className="class-detail-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Link to={role === 'teacher' ? '/instructor/classroom' : '/student/classes'} className="class-detail-back">
        <ArrowLeft size={16} />
        {role === 'teacher' ? 'Back to Classrooms' : 'Back to Classes'}
      </Link>

      <div className="class-detail-banner">
        {classData.img_link ? (
          <img className="class-detail-banner-img" src={classData.img_link} alt={classData.class_name} />
        ) : (
          <div className="class-detail-banner-gradient" style={gradientStyle} />
        )}
        <div className="class-detail-banner-overlay" />

        <div className="class-detail-banner-content" style={{
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '20px',
          margin: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div className="class-detail-banner-top">
            {role === 'teacher' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="class-detail-code">Invite Code</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {classData.class_code}
                  <button onClick={handleCopy} style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0',
                    marginLeft: '2px'
                  }} title="Copy code">
                    {copied ? <Check size={12} color="#10b981" /> : <Clipboard size={12} />}
                  </button>
                </div>
              </div>
            ) : (
              <span className="class-detail-code" style={{ opacity: 0.65 }}>Enrolled</span>
            )}
            <BannerMenu classId={classData.id} />
          </div>

          <h1 className="class-detail-name">{classData.class_name}</h1>
          {classData.description && <p className="class-detail-description">{classData.description}</p>}

          <div className="class-detail-staff">
            <div className="staff-group">
              <p className="staff-group-label">Lecturer</p>
              <div className="staff-member">
                <div className="staff-avatar">{initials(classData.instructor_name || 'Instructor')}</div>
                <div className="staff-info">
                  <span className="staff-name">{classData.instructor_name || 'Instructor'}</span>
                  <span className="staff-role">Primary Instructor</span>
                </div>
              </div>
            </div>

            {details.tas.length > 0 && (
              <div className="staff-group">
                <p className="staff-group-label">
                  {details.tas.length === 1 ? 'Teaching Assistant' : 'Teaching Assistants'}
                </p>
                {details.tas.map((ta) => (
                  <div key={ta} className="staff-member">
                    <div className="staff-avatar ta">{initials(ta)}</div>
                    <div className="staff-info">
                      <span className="staff-name">{ta}</span>
                      <span className="staff-role">TA</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="class-detail-tabs" role="tablist">
        {currentTabs.map(({ id: tabId, label, Icon, countKey, count }) => (
          <button
            key={tabId}
            role="tab"
            aria-selected={activeTab === tabId}
            className={`tab-btn${activeTab === tabId ? ' active' : ''}`}
            onClick={() => setActiveTab(tabId)}
          >
            <Icon size={15} />
            {label}
            {count !== undefined ? (
              <span className="tab-btn-count">{count}</span>
            ) : countKey && details[countKey] ? (
              <span className="tab-btn-count">{details[countKey].length}</span>
            ) : null}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <motion.div key="assignments" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            {role === 'teacher' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button
                  className="join-btn"
                  onClick={() => setIsCreateModalOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} />
                  <span>Create Assignment</span>
                </button>
              </div>
            )}

            {loadingAssignments ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px', gap: '12px' }}>
                <Loader2 size={30} className="modal-spinner" style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Loading assignments...</p>
              </div>
            ) : assignmentsError ? (
              <div style={{ padding: '16px', color: '#ef4444', textAlign: 'center', fontSize: '0.9rem' }}>
                {assignmentsError}
              </div>
            ) : assignments.length === 0 ? (
              <div className="classes-empty">
                <FileText size={40} className="classes-empty-icon" />
                <h3>No assignments yet</h3>
                <p>
                  {role === 'teacher'
                    ? 'Click "Create Assignment" to add the first task.'
                    : 'Your instructor has not posted any assignments yet.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {assignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* CLASSMATES / STUDENTS */}
        {activeTab === 'mates' && (
          <motion.div key="mates" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <button className="general-chat-btn" onClick={() => { setActiveChat("General Class Chat"); setIsChatOpen(true); }}>
              <MessageSquare size={18} /> General Class Chat
            </button>
            <div className="mates-grid">
              {details.mates.map((m) => (
                <div key={m.id} className={`mate-card ${m.isLeader ? 'leader' : ''}`}>
                  <div className="mate-avatar">{initials(m.name)}</div>
                  <div className="mate-info">
                     <p className="mate-name">
                       {m.name} 
                       {m.isLeader && <span className="leader-badge" title="Class Prefect"><Award size={12}/> Prefect</span>}
                     </p>
                     <p className="mate-tag">{m.tag}</p>
                  </div>
                  <button className="mate-message-btn" title="Message" aria-label={`Message ${m.name}`} onClick={() => { setActiveChat(m); setIsChatOpen(true); }}>
                    <MessageCircle size={16} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* GROUPS */}
        {activeTab === 'groups' && details.hasGroups && (
          <motion.div key="groups" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <div className="groups-grid">
              {details.groups?.map(g => (
                <div key={g.id} className="group-card">
                  <div className="group-header">
                    <div className="group-icon-wrapper"><Layers size={18} /></div>
                    <h3 className="group-name">{g.name}</h3>
                  </div>
                  <div className="group-members">
                    {g.members.map(member => (
                      <div key={member} className="group-member">
                        <div className="group-member-avatar">{initials(member)}</div>
                        <span className="group-member-name">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* RESOURCES */}
        {activeTab === 'resources' && (
          <motion.div key="resources" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            {details.resources.map((r) => (
              <div key={r.id} className="resource-card" onClick={() => setSelectedResource(r)}>
                <ResourceIcon type={r.type} />
                <div className="resource-info">
                  <p className="resource-title">{r.title}</p>
                  <p className="resource-desc">{r.desc}</p>
                  <p className="resource-date">Posted {r.date}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <motion.div key="announcements" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <div className="announcements-list">
              {[...details.announcements].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)).map((a) => (
                <div key={a.id} className={`announcement-card ${a.isPinned ? 'pinned' : ''}`}>
                  <div className="announcement-card-top">
                    <h3 className="announcement-title">
                      {a.isPinned && <Pin size={14} className="pin-icon" />}
                      {a.title}
                    </h3>
                    <span className="announcement-date">{a.date}</span>
                  </div>
                  <span className={`announcement-badge ${a.isPinned ? 'pinned' : ''}`}>
                    <Megaphone size={11} />
                    Announcement
                  </span>
                  <p className="announcement-content">{a.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PERFORMANCE / SCORE (Student Only) */}
        {activeTab === 'score' && role === 'student' && (
          <motion.div key="score" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <div className="score-panel">
              <ScoreGauge score={details.overallScore} color={accent} />
              <div className="score-breakdown">
                <p className="score-breakdown-title">Score Breakdown</p>
                {details.scoreBreakdown.map((m) => (
                  <div key={m.name} className="score-metric-row">
                    <div className="score-metric-header">
                      <span className="score-metric-name">{m.name}</span>
                      <span className="score-metric-value">{m.value}%</span>
                    </div>
                    <div className="score-bar-track">
                      <div
                        className="score-bar-fill"
                        style={{ width: `${m.value}%`, background: barColor(m.value) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reviews-section">
              <p className="reviews-title">
                <MessageSquare size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                Class Reviews
              </p>
              <div className="reviews-tags">
                {details.reviews.map((r) => (
                  <span key={r} className="review-tag">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Resource Modal ── */}
      <AnimatePresence>
        {selectedResource && (
           <motion.div 
             className="resource-modal-overlay" 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }} 
             onClick={() => setSelectedResource(null)}
           >
              <motion.div 
                className="resource-modal-card" 
                initial={{ y: 50, opacity: 0, scale: 0.95 }} 
                animate={{ y: 0, opacity: 1, scale: 1 }} 
                exit={{ y: 50, opacity: 0, scale: 0.95 }} 
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="resource-modal-close" onClick={() => setSelectedResource(null)}><X size={20}/></button>
                <div className="resource-modal-preview">
                  {selectedResource.thumbnail ? (
                     <img src={selectedResource.thumbnail} alt="preview" />
                  ) : (
                     <ResourceIcon type={selectedResource.type} className="resource-modal-icon-lg" />
                  )}
                </div>
                <div className="resource-modal-content">
                  <span className="resource-modal-type">{selectedResource.type}</span>
                  <h2 className="resource-modal-title">{selectedResource.title}</h2>
                  <p className="resource-modal-desc">{selectedResource.desc}</p>
                </div>
                <div className="resource-modal-footer">
                  {selectedResource.type === 'link' ? (
                     <a href={selectedResource.url || '#'} target="_blank" rel="noreferrer" className="resource-modal-btn">
                       <ExternalLink size={16} /> Open Link
                     </a>
                  ) : (
                     <a href={selectedResource.url || '#'} download className="resource-modal-btn default">
                       <Download size={16} /> Download
                     </a>
                  )}
                </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      <ChatDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        chatContext={activeChat} 
        mockMessages={mockMessages} 
      />

      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        classId={classData.id}
        onCreated={() => {
          loadAssignments();
        }}
      />

    </motion.div>
  );
};

export default ClassDetails;
