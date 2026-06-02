import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ChatDrawer from '../../components/student/ChatDrawer';
import {
  ArrowLeft, FileText, Users, BookOpen, Link2, Video, Megaphone,
  MoreVertical, Star, Archive, LogOut, BarChart2, MessageSquare,
  ChevronDown, Pin, MessageCircle, Download, ExternalLink, X, Layers,
  Award, Plus, Trash2, Edit2, ShieldAlert, UserPlus, Settings
} from 'lucide-react';
import '../../Styles/classDetail.css';

/* ─── Helper ─────────────────────────────────────────────────────────────── */
const initials = (name) =>
  name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();

const ScoreGauge = ({ score, color = '#0061ff' }) => {
  const r = 64;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  const grade =
    score >= 90 ? { label: 'A', bg: 'rgba(16,185,129,0.12)', color: '#10b981' } :
      score >= 80 ? { label: 'B', bg: 'rgba(0,97,255,0.1)', color: '#0061ff' } :
        score >= 70 ? { label: 'C', bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' } :
          { label: 'D', bg: 'rgba(239,68,68,0.1)', color: '#ef4444' };

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
          <span className="score-gauge-label">Avg / 100</span>
        </div>
      </div>
      <span className="score-grade-badge" style={{ background: grade.bg, color: grade.color }}>
        Avg Grade {grade.label}
      </span>
    </div>
  );
};

/* ─── Mock Database ──────────────────────────────────────────────────────── */
const mockDb = {
  cs301: {
    id: 'cs301',
    name: 'Advanced Data Structures',
    courseCode: 'CS 301',
    description: 'An in-depth study of fundamental and advanced data structures, algorithm complexity, and their practical applications in software engineering.',
    lecturer: 'Dr. Alan Turing',
    tas: ['Grace Hopper', 'Ada Lovelace'],
    status: 'active',
    coverImage: 'https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?w=1200&q=80&fit=crop',
    accent: '#0061ff',
    overallScore: 84,
    reviews: ['Great structure', 'Tough grading'],
    hasGroups: true,
    groups: [
      { id: 'g1', name: 'Alpha Team', members: ['Kwame Asante', 'Priya Nair'] },
      { id: 'g2', name: 'Beta Squad', members: ['Luca Ferrari', 'Sofia Mendes'] },
    ],
    scoreBreakdown: [
      { name: 'Assignments', value: 88 },
      { name: 'Quizzes', value: 79 },
      { name: 'Participation', value: 92 },
      { name: 'Final Exam', value: 76 },
    ],
    assignments: [
      { id: 'a1', title: 'Graph Traversal Implementation', due: 'Oct 15, 2026', status: 'active', details: 'Implement BFS and DFS in Python.', url: '#' },
      { id: 'a2', title: 'Red-Black Tree Visualiser', due: 'Sep 28, 2026', status: 'closed', details: 'Build an interactive web tool.', url: '#' },
    ],
    mates: [
      { id: 'm1', name: 'Kwame Asante', tag: '3rd Year', isLeader: true },
      { id: 'm2', name: 'Priya Nair', tag: '3rd Year' },
      { id: 'm3', name: 'Luca Ferrari', tag: '2nd Year' },
      { id: 'm4', name: 'Sofia Mendes', tag: '3rd Year' },
    ],
    resources: [
      { id: 'r1', type: 'document', title: 'Course Syllabus', desc: 'Full outline.', date: 'Aug 25, 2026', url: '#', thumbnail: '' },
    ],
    announcements: [
      { id: 'an1', title: 'Assignment 3 Clarification', date: 'Oct 01, 2026', content: 'Submit code and write-up.', isPinned: true },
    ],
  },
  se210: {
    id: 'se210',
    name: 'User Interface Engineering',
    courseCode: 'SE 210',
    description: 'Principles of human-computer interaction, design systems, accessibility, and modern front-end engineering practices.',
    lecturer: 'Sarah Drasner',
    tas: ['Una Kravets'],
    status: 'active',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&fit=crop',
    accent: '#10b981',
    overallScore: 95,
    reviews: ['Excellent projects', 'Sarah is amazing'],
    hasGroups: false,
    scoreBreakdown: [
      { name: 'Assignments', value: 97 },
      { name: 'Quizzes', value: 91 },
    ],
    assignments: [
      { id: 'c1', title: 'Component Library — Part 1', due: 'Oct 05, 2026', status: 'closed', details: 'Design and build button and input components in React.', url: '#' },
    ],
    mates: [
      { id: 'm12', name: 'Nadia Kowalski', tag: '2nd Year' },
      { id: 'm13', name: 'Carlos Rivera', tag: '2nd Year' },
    ],
    resources: [
      { id: 'r8', type: 'link', title: 'Design System Reference', desc: 'Official docs for the design tokens and component API used in this course.', date: 'Sep 05, 2026', url: '#' },
    ],
    announcements: [
      { id: 'an6', title: 'Guest Lecture: Design at Scale', date: 'Sep 30, 2026', content: 'We will have a guest lecture from a senior designer at Figma.', isPinned: false },
    ],
  }
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */
const ResourceIcon = ({ type, className }) => {
  const map = {
    document: { icon: <FileText size={20} />, cls: 'pdf' },
    pdf: { icon: <FileText size={20} />, cls: 'pdf' },
    link: { icon: <Link2 size={20} />, cls: 'link' },
    video: { icon: <Video size={20} />, cls: 'video' },
    announcement: { icon: <Megaphone size={20} />, cls: 'announcement' },
  };
  const entry = map[type] ?? map['document'];
  return <div className={`resource-icon ${entry.cls} ${className || ''}`}>{entry.icon}</div>;
};

const statusMap = {
  active: { label: 'Active', cls: 'status-active' },
  closed: { label: 'Closed', cls: 'status-submitted' },
  graded: { label: 'Graded', cls: 'status-graded' },
  overdue: { label: 'Overdue', cls: 'status-overdue' },
};

const barColor = (v) => v >= 90 ? '#10b981' : v >= 75 ? '#0061ff' : v >= 60 ? '#f59e0b' : '#ef4444';

const InstructorBannerMenu = ({ classId }) => {
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
    console.log(`[InstructorBannerMenu] ${label} → ${classId}`);
  };

  return (
    <div className="banner-menu-wrapper" ref={ref}>
      <button className="banner-kebab-btn" onClick={() => setOpen((p) => !p)} aria-label="More options">
        <Settings size={18} />
      </button>

      {open && (
        <div className="banner-dropdown" role="menu">
          <button className="banner-dropdown-item" onClick={() => act('edit')}>
            <Edit2 size={15} /> Edit Details
          </button>
          <button className="banner-dropdown-item" onClick={() => act('archive')}>
            <Archive size={15} /> Archive Class
          </button>
          <button className="banner-dropdown-item danger" onClick={() => act('delete')}>
            <Trash2 size={15} /> Delete Class
          </button>
        </div>
      )}
    </div>
  );
};

const StudentKebabMenu = ({ student, onAction }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div className="card-menu-wrapper" ref={ref}>
      <button className="card-kebab-btn" onClick={() => setOpen(!open)}>
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="banner-dropdown" style={{ right: 0, left: 'auto', top: 30 }} role="menu">
          <button className="banner-dropdown-item" onClick={() => { onAction('prefect', student); setOpen(false); }}>
            <Award size={15} /> Toggle Prefect
          </button>
          <button className="banner-dropdown-item" onClick={() => { onAction('ta', student); setOpen(false); }}>
            <ShieldAlert size={15} /> Make T.A
          </button>
          <button className="banner-dropdown-item" onClick={() => { onAction('group', student); setOpen(false); }}>
            <Layers size={15} /> Assign Group
          </button>
          <button className="banner-dropdown-item danger" onClick={() => { onAction('remove', student); setOpen(false); }}>
            <LogOut size={15} /> Remove Student
          </button>
        </div>
      )}
    </div>
  );
};


/* ─── Main Component ─────────────────────────────────────────────────────── */
const ManageClassDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('assignments');
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  // Default to cs301 if id not in mock
  const cls = mockDb[id] || mockDb['cs301'];

  const panel = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  };

  const handleStudentAction = (action, student) => {
    alert(`Action [${action}] applied to ${student.name}`);
  };

  const currentTabs = [
    { id: 'assignments', label: 'Assignments', Icon: FileText, countKey: 'assignments' },
    { id: 'students', label: 'Students', Icon: Users, countKey: 'mates' },
    { id: 'groups', label: 'Groups', Icon: Layers, countKey: 'groups' },
    { id: 'resources', label: 'Resources', Icon: BookOpen, countKey: 'resources' },
    { id: 'announcements', label: 'Announcements', Icon: Megaphone, countKey: 'announcements' },
    { id: 'score', label: 'Analytics', Icon: BarChart2, countKey: null }
  ];

  return (
    <motion.div
      className="class-detail-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Link to="/instructor/classroom" className="class-detail-back">
        <ArrowLeft size={16} />
        Back to Manage Classroom
      </Link>

      <div className="class-detail-banner">
        {cls.coverImage ? (
          <img className="class-detail-banner-img" src={cls.coverImage} alt={cls.name} />
        ) : (
          <div
            className="class-detail-banner-gradient"
            style={{ '--banner-gradient': `linear-gradient(135deg, ${cls.accent}cc, ${cls.accent}55)` }}
          />
        )}
        <div className="class-detail-banner-overlay" />

        <div className="class-detail-banner-content">
          <div className="class-detail-banner-top">
            <span className="class-detail-code">{cls.courseCode}</span>
            <InstructorBannerMenu classId={cls.id} />
          </div>

          <h1 className="class-detail-name">{cls.name}</h1>
          <p className="class-detail-description">{cls.description}</p>

          <div className="class-detail-staff">
            <div className="staff-group">
              <p className="staff-group-label">Lecturer</p>
              <div className="staff-member">
                <div className="staff-avatar">{initials(cls.lecturer)}</div>
                <div className="staff-info">
                  <span className="staff-name">{cls.lecturer}</span>
                  <span className="staff-role">Primary Lecturer</span>
                </div>
              </div>
            </div>

            {cls.tas?.length > 0 && (
              <div className="staff-group">
                <p className="staff-group-label">Teaching Assistants</p>
                {cls.tas.map((ta) => (
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
        {currentTabs.map(({ id: tabId, label, Icon, countKey }) => (
          <button
            key={tabId}
            role="tab"
            aria-selected={activeTab === tabId}
            className={`tab-btn${activeTab === tabId ? ' active' : ''}`}
            onClick={() => setActiveTab(tabId)}
          >
            <Icon size={15} />
            {label}
            {countKey && cls[countKey] && (
              <span className="tab-btn-count">{cls[countKey].length}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <motion.div key="assignments" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button className="join-btn" style={{ margin: 0, display: 'flex', alignItems: 'center' }} onClick={() => alert('Add Assignment Dialog')}>
                <Plus size={16} style={{ marginRight: 6 }} /> Create Assignment
              </button>
            </div>
            {cls.assignments?.map((a) => {
              const { label, cls: sCls } = statusMap[a.status] ?? {};
              const isExpanded = expandedAssignment === a.id;
              return (
                <div key={a.id} className={`assignment-accordion ${isExpanded ? 'expanded' : ''}`}>
                  <div className="assignment-row" onClick={() => setExpandedAssignment(isExpanded ? null : a.id)}>
                    <div className="assignment-icon"><FileText size={18} /></div>
                    <div className="assignment-info">
                      <p className="assignment-title">{a.title}</p>
                      <p className="assignment-due">Due {a.due}</p>
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
                          <p>{a.details}</p>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <Link to={a.url || '#'} className="assignment-view-btn">
                              View Submissions <ExternalLink size={14} />
                            </Link>
                            <button className="resource-modal-btn default" onClick={() => alert('Edit assignment')}>Edit</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* STUDENTS */}
        {activeTab === 'students' && (
          <motion.div key="students" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', gap: '32px' }}>
              <button className="general-chat-btn" style={{ margin: 0 }} onClick={() => { setActiveChat("General Class Chat"); setIsChatOpen(true); }}>
                <MessageSquare size={18} /> Class Announcement Chat
              </button>
              <button className="join-btn" style={{ margin: 0, display: 'flex', alignItems: 'center' }} onClick={() => alert('Invite Student')}>
                <UserPlus size={16} style={{ marginRight: 6 }} /> Invite Student
              </button>
            </div>
            <div className="mates-grid">
              {cls.mates?.map((m) => (
                <div key={m.id} className={`mate-card ${m.isLeader ? 'leader' : ''}`}>
                  <div className="mate-avatar">{initials(m.name)}</div>
                  <div className="mate-info">
                    <p className="mate-name">
                      {m.name}
                      {m.isLeader && <span className="leader-badge" title="Class Prefect"><Award size={12} /> Prefect</span>}
                    </p>
                    <p className="mate-tag">{m.tag}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button className="mate-message-btn" title="Message" onClick={() => { setActiveChat(m); setIsChatOpen(true); }}>
                      <MessageCircle size={16} />
                    </button>
                    <StudentKebabMenu student={m} onAction={handleStudentAction} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* GROUPS */}
        {activeTab === 'groups' && (
          <motion.div key="groups" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button className="join-btn" style={{ margin: 0, display: 'flex', alignItems: 'center' }} onClick={() => alert('Create Group Dialog')}>
                <Layers size={16} style={{ marginRight: 6 }} /> Create Group
              </button>
            </div>
            <div className="groups-grid">
              {cls.groups?.map(g => (
                <div key={g.id} className="group-card">
                  <div className="group-header">
                    <div className="group-icon-wrapper"><Layers size={18} /></div>
                    <h3 className="group-name">{g.name}</h3>
                    <button className="card-kebab-btn" style={{ marginLeft: 'auto' }} onClick={() => alert('Edit group')}>
                      <Edit2 size={14} />
                    </button>
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button className="join-btn" style={{ margin: 0, display: 'flex', alignItems: 'center' }} onClick={() => alert('Upload Resource')}>
                <Plus size={16} style={{ marginRight: 6 }} /> Upload Resource
              </button>
            </div>
            {cls.resources?.map((r) => (
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button className="join-btn" style={{ margin: 0, display: 'flex', alignItems: 'center' }} onClick={() => alert('Create Announcement')}>
                <Megaphone size={16} style={{ marginRight: 6 }} /> New Announcement
              </button>
            </div>
            <div className="announcements-list">
              {[...(cls.announcements || [])].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)).map((a) => (
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

        {/* ANALYTICS */}
        {activeTab === 'score' && (
          <motion.div key="score" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <div className="score-panel">
              <ScoreGauge score={cls.overallScore || 0} color={cls.accent} />
              <div className="score-breakdown">
                <p className="score-breakdown-title">Class Average Breakdown</p>
                {cls.scoreBreakdown?.map((m) => (
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
          </motion.div>
        )}

      </AnimatePresence>

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        chatContext={activeChat}
        mockMessages={[]}
      />

    </motion.div>
  );
};

export default ManageClassDetail;
