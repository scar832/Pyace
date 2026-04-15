import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import '../../Styles/classDetail.css';

/* ─── Helper ─────────────────────────────────────────────────────────────── */
const initials = (name) =>
  name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();

/* ─── Pure-CSS radial gauge ──────────────────────────────────────────────── */
/**
 * SVG-based circular gauge — zero external libraries.
 * Uses stroke-dasharray / stroke-dashoffset maths on a <circle>.
 */
const ScoreGauge = ({ score, color = '#0061ff' }) => {
  const r = 64; // radius
  const circ = 2 * Math.PI * r; // circumference ≈ 402
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
          {/* Track */}
          <circle
            className="score-gauge-track"
            cx="80" cy="80" r={r}
          />
          {/* Fill — rotated -90° via CSS transform on the SVG element */}
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

      {/* Grade badge */}
      <span
        className="score-grade-badge"
        style={{ background: grade.bg, color: grade.color }}
      >
        Grade {grade.label}
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
    reviews: ['Great structure', 'Tough grading', 'Very rewarding', 'Clear examples', 'Best TA support'],
    scoreBreakdown: [
      { name: 'Assignments', value: 88 },
      { name: 'Quizzes',     value: 79 },
      { name: 'Participation', value: 92 },
      { name: 'Final Exam',  value: 76 },
    ],
    assignments: [
      { id: 'a1', title: 'Graph Traversal Implementation', due: 'Oct 15, 2026', status: 'active' },
      { id: 'a2', title: 'Red-Black Tree Visualiser',      due: 'Sep 28, 2026', status: 'submitted' },
      { id: 'a3', title: 'Dynamic Programming Problem Set', due: 'Nov 02, 2026', status: 'active' },
      { id: 'a4', title: 'Hash Table Analysis Essay',      due: 'Sep 10, 2026', status: 'graded' },
    ],
    mates: [
      { id: 'm1', name: 'Kwame Asante',  tag: '3rd Year' },
      { id: 'm2', name: 'Priya Nair',    tag: '3rd Year' },
      { id: 'm3', name: 'Luca Ferrari',  tag: '2nd Year' },
      { id: 'm4', name: 'Sofia Mendes',  tag: '3rd Year' },
      { id: 'm5', name: 'James Osei',    tag: '3rd Year' },
      { id: 'm6', name: 'Aiko Tanaka',   tag: '2nd Year' },
      { id: 'm7', name: 'Ravi Patel',    tag: '3rd Year' },
      { id: 'm8', name: 'Chioma Eze',    tag: '3rd Year' },
    ],
    resources: [
      { id: 'r1', type: 'pdf',          title: 'Course Syllabus',             desc: 'Full outline, grading criteria, and important deadlines.',         date: 'Aug 25, 2026' },
      { id: 'r2', type: 'pdf',          title: 'Week 3 Lecture Notes — Trees', desc: 'Slides covering BST, AVL, and Red-Black Trees.',                   date: 'Sep 12, 2026' },
      { id: 'r3', type: 'link',         title: 'Algorithm Visualiser',        desc: 'Interactive tool for exploring sorting and graph algorithms.',        date: 'Sep 01, 2026' },
      { id: 'r4', type: 'video',        title: 'Office Hours — Week 5',       desc: 'Recap of common questions on dynamic programming memoisation.',      date: 'Sep 28, 2026' },
    ],
    announcements: [
      {
        id: 'an1',
        title: 'Assignment 3 Clarification',
        date: 'Oct 01, 2026',
        content: 'You may use any programming language for the graph traversal implementation. Pseudocode is not accepted. Submit your code and a 1-page write-up via the portal by midnight.',
      },
      {
        id: 'an2',
        title: 'Office Hours Rescheduled',
        date: 'Sep 25, 2026',
        content: "Grace's office hours this week are moved to Thursday, 3–5 PM (Room 204). All other schedules remain the same.",
      },
      {
        id: 'an3',
        title: 'Midterm Results Posted',
        date: 'Sep 18, 2026',
        content: 'Midterm scores are now visible on the portal. Class average was 74%. Please reach out during office hours if you have any questions about your grade.',
      },
    ],
  },

  cs450: {
    id: 'cs450',
    name: 'Introduction to Artificial Intelligence',
    courseCode: 'CS 450',
    description: 'Foundations of AI including search, knowledge representation, planning, machine learning, and neural networks.',
    lecturer: 'Prof. Geoffrey Hinton',
    tas: ['Yann LeCun'],
    status: 'active',
    coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80&fit=crop',
    accent: '#8b5cf6',
    overallScore: 91,
    reviews: ['Mind-expanding', 'Heavy workload', 'Inspiring lecturer', 'World-class content'],
    scoreBreakdown: [
      { name: 'Assignments',   value: 94 },
      { name: 'Quizzes',       value: 88 },
      { name: 'Participation', value: 95 },
      { name: 'Final Exam',    value: 87 },
    ],
    assignments: [
      { id: 'b1', title: 'Search Algorithms Lab',    due: 'Sep 10, 2026', status: 'graded' },
      { id: 'b2', title: 'Neural Network from Scratch', due: 'Nov 01, 2026', status: 'active' },
      { id: 'b3', title: 'Minimax Agent',            due: 'Oct 20, 2026', status: 'overdue' },
    ],
    mates: [
      { id: 'm9',  name: 'Eve Davis',    tag: '4th Year' },
      { id: 'm10', name: 'Frank Miller', tag: '3rd Year' },
      { id: 'm11', name: 'Laila Hassan', tag: '4th Year' },
    ],
    resources: [
      { id: 'r6', type: 'pdf',          title: 'Russell & Norvig — Chapter 3', desc: 'Required reading on uninformed and informed search strategies.', date: 'Sep 03, 2026' },
      { id: 'r7', type: 'video',        title: 'Backprop Explained',           desc: 'Recorded walkthrough of the backpropagation algorithm.',       date: 'Sep 20, 2026' },
    ],
    announcements: [
      {
        id: 'an4',
        title: 'Midterm Date Confirmed',
        date: 'Oct 02, 2026',
        content: 'The midterm exam will be held on October 30th, 9:00 AM in Hall B. The exam covers Chapters 1–8. No calculators allowed.',
      },
      {
        id: 'an5',
        title: 'Assignment 3 Extension',
        date: 'Oct 15, 2026',
        content: 'Due to the midterm, the Minimax Agent deadline has been extended by 5 days. New deadline: October 25th.',
      },
    ],
  },

  se210: {
    id: 'se210',
    name: 'User Interface Engineering',
    courseCode: 'SE 210',
    description: 'Principles of human-computer interaction, design systems, accessibility, and modern front-end engineering practices.',
    lecturer: 'Sarah Drasner',
    tas: ['Una Kravets', 'Adam Wathan'],
    status: 'active',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&fit=crop',
    accent: '#10b981',
    overallScore: 95,
    reviews: ['Excellent projects', 'Creative freedom', 'Best course this semester', 'Sarah is amazing'],
    scoreBreakdown: [
      { name: 'Assignments',   value: 97 },
      { name: 'Quizzes',       value: 91 },
      { name: 'Participation', value: 99 },
      { name: 'Final Project', value: 93 },
    ],
    assignments: [
      { id: 'c1', title: 'Component Library — Part 1', due: 'Oct 05, 2026', status: 'submitted' },
      { id: 'c2', title: 'Accessibility Audit Report', due: 'Oct 25, 2026', status: 'active' },
    ],
    mates: [
      { id: 'm12', name: 'Nadia Kowalski',   tag: '2nd Year' },
      { id: 'm13', name: 'Carlos Rivera',    tag: '2nd Year' },
      { id: 'm14', name: 'Zoe Kimura',       tag: '3rd Year' },
      { id: 'm15', name: 'Ibrahim Al-Rashid', tag: '2nd Year' },
    ],
    resources: [
      { id: 'r8', type: 'link', title: 'Design System Reference', desc: 'Official docs for the design tokens and component API used in this course.', date: 'Sep 05, 2026' },
    ],
    announcements: [
      {
        id: 'an6',
        title: 'Guest Lecture: Design at Scale',
        date: 'Sep 30, 2026',
        content: 'We will have a guest lecture from a senior designer at Figma on October 7th. Attendance is highly encouraged.',
      },
    ],
  },

  se305: {
    id: 'se305',
    name: 'Modern Web Architecture',
    courseCode: 'SE 305',
    description: 'Deep dive into scalable web systems: SSR, SSG, edge computing, API design, and performance optimisation.',
    lecturer: 'Dan Abramov',
    tas: ['Devon Govett'],
    status: 'active',
    coverImage: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=1200&q=80&fit=crop',
    accent: '#f59e0b',
    overallScore: 78,
    reviews: ['Very practical', 'Fast-paced', 'Solid fundamentals', 'Assignments are tough'],
    scoreBreakdown: [
      { name: 'Assignments',   value: 80 },
      { name: 'Quizzes',       value: 73 },
      { name: 'Participation', value: 85 },
      { name: 'Final Project', value: 74 },
    ],
    assignments: [
      { id: 'd1', title: 'Build a Full-Stack App', due: 'Nov 15, 2026', status: 'active' },
    ],
    mates: [
      { id: 'm16', name: 'Soren Andersen', tag: '4th Year' },
      { id: 'm17', name: 'Min-Ji Park',    tag: '3rd Year' },
    ],
    resources: [
      { id: 'r9', type: 'video', title: 'Lecture 2 — Edge vs CDN', desc: 'Recorded session comparing deployment patterns.', date: 'Sep 08, 2026' },
    ],
    announcements: [
      {
        id: 'an7',
        title: 'Final Project Guidelines Released',
        date: 'Oct 10, 2026',
        content: 'The final project spec is now available on the portal. Teams of 2–3. Must use a modern framework of your choice. Presentations are Dec 1st.',
      },
    ],
  },

  db201: {
    id: 'db201',
    name: 'Database Management Systems',
    courseCode: 'DB 201',
    description: 'Relational algebra, SQL, normalisation, indexing strategies, transactions, and NoSQL alternatives.',
    lecturer: 'Dr. Edgar Codd',
    tas: ['Michael Stonebraker'],
    status: 'past',
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=80&fit=crop',
    accent: '#ef4444',
    overallScore: 88,
    reviews: ['Dense but useful', 'SQL labs were great', 'Final was hard', 'Good reference material'],
    scoreBreakdown: [
      { name: 'Assignments',   value: 91 },
      { name: 'Quizzes',       value: 85 },
      { name: 'Participation', value: 90 },
      { name: 'Final Exam',    value: 83 },
    ],
    assignments: [
      { id: 'e1', title: 'ER Diagram Submission',      due: 'Sep 22, 2026', status: 'graded' },
      { id: 'e2', title: 'SQL Query Optimisation Lab', due: 'Oct 18, 2026', status: 'graded' },
    ],
    mates: [
      { id: 'm18', name: 'Amara Diallo',  tag: '2nd Year' },
      { id: 'm19', name: 'Tomás García',  tag: '2nd Year' },
      { id: 'm20', name: 'Elena Volkov',  tag: '3rd Year' },
    ],
    resources: [
      { id: 'r10', type: 'pdf', title: 'Normalisation Cheat Sheet', desc: '1NF through BCNF with worked examples.', date: 'Sep 15, 2026' },
    ],
    announcements: [
      {
        id: 'an8',
        title: 'Course Complete — Final Grades Posted',
        date: 'Dec 05, 2026',
        content: 'All final grades have been submitted. Thank you for a great semester. Transcripts will be updated within 10 business days.',
      },
    ],
  },

  cs220: {
    id: 'cs220',
    name: 'Computer Organisation & Architecture',
    courseCode: 'CS 220',
    description: 'From transistors to CPUs: instruction sets, memory hierarchies, pipelining, and parallel architectures.',
    lecturer: 'Prof. John Hennessy',
    tas: ['David Patterson'],
    status: 'past',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&fit=crop',
    accent: '#06b6d4',
    overallScore: 72,
    reviews: ['Low-level is tricky', 'RISC-V labs were fun', 'Very demanding', 'Worth the effort'],
    scoreBreakdown: [
      { name: 'Assignments',   value: 76 },
      { name: 'Quizzes',       value: 68 },
      { name: 'Participation', value: 80 },
      { name: 'Final Exam',    value: 65 },
    ],
    assignments: [
      { id: 'f1', title: 'RISC-V Assembly Program', due: 'Oct 10, 2026', status: 'graded' },
      { id: 'f2', title: 'Cache Simulation Report', due: 'Nov 05, 2026', status: 'graded' },
    ],
    mates: [
      { id: 'm21', name: 'Yusuf Balogun', tag: '2nd Year' },
      { id: 'm22', name: 'Mei Lin',        tag: '2nd Year' },
    ],
    resources: [
      { id: 'r11', type: 'pdf',  title: 'Patterson & Hennessy — Ch. 4', desc: 'Chapter on pipelining the datapath.',           date: 'Sep 20, 2026' },
      { id: 'r12', type: 'link', title: 'RISC-V Simulator',             desc: 'Browser-based RISC-V assembler and runtime.', date: 'Sep 02, 2026' },
    ],
    announcements: [
      {
        id: 'an9',
        title: 'Semester Wrap-up',
        date: 'Nov 28, 2026',
        content: "It's been a great semester! Final exam feedback will be shared via email by December 10th. Well done to everyone.",
      },
    ],
  },
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */
const ResourceIcon = ({ type }) => {
  const map = {
    pdf:          { icon: <FileText size={20} />, cls: 'pdf' },
    link:         { icon: <Link2 size={20} />,    cls: 'link' },
    video:        { icon: <Video size={20} />,    cls: 'video' },
    announcement: { icon: <Megaphone size={20} />, cls: 'announcement' },
  };
  const entry = map[type] ?? map['pdf'];
  return <div className={`resource-icon ${entry.cls}`}>{entry.icon}</div>;
};

const statusMap = {
  active:    { label: 'Active',     cls: 'status-active' },
  submitted: { label: 'Submitted',  cls: 'status-submitted' },
  graded:    { label: 'Graded',     cls: 'status-graded' },
  overdue:   { label: 'Overdue',    cls: 'status-overdue' },
};

// Bar colour by metric score
const barColor = (v) =>
  v >= 90 ? '#10b981' : v >= 75 ? '#0061ff' : v >= 60 ? '#f59e0b' : '#ef4444';

/* ─── More-actions kebab for the banner ─────────────────────────────────── */
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

/* ─── Tab definitions ────────────────────────────────────────────────────── */
const TABS = [
  { id: 'assignments',   label: 'Assignments',  Icon: FileText,     countKey: 'assignments' },
  { id: 'mates',         label: 'Classmates',   Icon: Users,        countKey: 'mates' },
  { id: 'resources',     label: 'Resources',    Icon: BookOpen,     countKey: 'resources' },
  { id: 'announcements', label: 'Announcements',Icon: Megaphone,    countKey: 'announcements' },
  { id: 'score',         label: 'Performance',  Icon: BarChart2,    countKey: null },
];

/* ─── Main Component ─────────────────────────────────────────────────────── */
const ClassDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('assignments');

  const cls = mockDb[id];
  if (!cls) return <Navigate to="/student/classes" replace />;

  const panel = {
    hidden:  { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="class-detail-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Back */}
      <Link to="/student/classes" className="class-detail-back">
        <ArrowLeft size={16} />
        Back to Classes
      </Link>

      {/* ── Banner Header ── */}
      <div className="class-detail-banner">
        {/* Background */}
        {cls.coverImage ? (
          <img className="class-detail-banner-img" src={cls.coverImage} alt={cls.name} />
        ) : (
          <div
            className="class-detail-banner-gradient"
            style={{ '--banner-gradient': `linear-gradient(135deg, ${cls.accent}cc, ${cls.accent}55)` }}
          />
        )}
        <div className="class-detail-banner-overlay" />

        {/* Content */}
        <div className="class-detail-banner-content">
          <div className="class-detail-banner-top">
            <span className="class-detail-code">{cls.courseCode}</span>
            <BannerMenu classId={cls.id} />
          </div>

          <h1 className="class-detail-name">{cls.name}</h1>
          <p className="class-detail-description">{cls.description}</p>

          {/* Staff */}
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

            {cls.tas.length > 0 && (
              <div className="staff-group">
                <p className="staff-group-label">
                  {cls.tas.length === 1 ? 'Teaching Assistant' : 'Teaching Assistants'}
                </p>
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

      {/* ── Tabs ── */}
      <div className="class-detail-tabs" role="tablist">
        {TABS.map(({ id: tabId, label, Icon, countKey }) => (
          <button
            key={tabId}
            role="tab"
            aria-selected={activeTab === tabId}
            className={`tab-btn${activeTab === tabId ? ' active' : ''}`}
            onClick={() => setActiveTab(tabId)}
          >
            <Icon size={15} />
            {label}
            {countKey && (
              <span className="tab-btn-count">{cls[countKey].length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Panels ── */}
      <AnimatePresence mode="wait">

        {/* ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <motion.div key="assignments" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            {cls.assignments.map((a) => {
              const { label, cls: sCls } = statusMap[a.status] ?? {};
              return (
                <div key={a.id} className="assignment-row">
                  <div className="assignment-icon"><FileText size={18} /></div>
                  <div className="assignment-info">
                    <p className="assignment-title">{a.title}</p>
                    <p className="assignment-due">Due {a.due}</p>
                  </div>
                  <span className={`assignment-status ${sCls}`}>{label}</span>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* CLASSMATES */}
        {activeTab === 'mates' && (
          <motion.div key="mates" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <div className="mates-grid">
              {cls.mates.map((m) => (
                <div key={m.id} className="mate-card">
                  <div className="mate-avatar">{initials(m.name)}</div>
                  <p className="mate-name">{m.name}</p>
                  <p className="mate-tag">{m.tag}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* RESOURCES */}
        {activeTab === 'resources' && (
          <motion.div key="resources" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            {cls.resources.map((r) => (
              <div key={r.id} className="resource-card">
                <ResourceIcon type={r.type} />
                <div className="resource-info">
                  <p className="resource-title">{r.title}</p>
                  <p className="resource-desc">{r.desc}</p>
                  <p className="resource-date">Posted {r.date}</p>
                </div>
                <ArrowLeft size={16} className="resource-arrow" style={{ transform: 'rotate(180deg)' }} />
              </div>
            ))}
          </motion.div>
        )}

        {/* ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <motion.div key="announcements" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <div className="announcements-list">
              {cls.announcements.map((a) => (
                <div key={a.id} className="announcement-card">
                  <div className="announcement-card-top">
                    <h3 className="announcement-title">{a.title}</h3>
                    <span className="announcement-date">{a.date}</span>
                  </div>
                  <span className="announcement-badge">
                    <Megaphone size={11} />
                    Announcement
                  </span>
                  <p className="announcement-content">{a.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PERFORMANCE / SCORE */}
        {activeTab === 'score' && (
          <motion.div key="score" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <div className="score-panel">
              {/* Radial gauge */}
              <ScoreGauge score={cls.overallScore} color={cls.accent} />

              {/* Per-metric breakdown */}
              <div className="score-breakdown">
                <p className="score-breakdown-title">Score Breakdown</p>
                {cls.scoreBreakdown.map((m) => (
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

            {/* Peer reviews */}
            <div className="reviews-section">
              <p className="reviews-title">
                <MessageSquare size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                Class Reviews
              </p>
              <div className="reviews-tags">
                {cls.reviews.map((r) => (
                  <span key={r} className="review-tag">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
};

export default ClassDetail;
