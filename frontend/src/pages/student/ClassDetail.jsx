import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ChatDrawer from '../../components/student/ChatDrawer';
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
  Award
} from 'lucide-react';
import '../../Styles/classDetail.css';

/* ─── Helper ─────────────────────────────────────────────────────────────── */
const initials = (name) =>
  name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();

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
      {
        id: 'an1',
        title: 'Assignment 3 Clarification',
        date: 'Oct 01, 2026',
        content: 'You may use any programming language for the graph traversal implementation. Pseudocode is not accepted. Submit your code and a 1-page write-up via the portal by midnight.',
        isPinned: true
      },
      {
        id: 'an2',
        title: 'Office Hours Rescheduled',
        date: 'Sep 25, 2026',
        content: "Grace's office hours this week are moved to Thursday, 3–5 PM (Room 204). All other schedules remain the same.",
        isPinned: false
      },
      {
        id: 'an3',
        title: 'Midterm Results Posted',
        date: 'Sep 18, 2026',
        content: 'Midterm scores are now visible on the portal. Class average was 74%. Please reach out during office hours if you have any questions about your grade.',
        isPinned: false
      },
    ],
  },
  // the rest of the mock data remains mostly unchanged, except tweaking resource types 
  // and ensuring properties don't crash
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
      {
        id: 'an4',
        title: 'Midterm Date Confirmed',
        date: 'Oct 02, 2026',
        content: 'The midterm exam will be held on October 30th, 9:00 AM in Hall B. The exam covers Chapters 1–8. No calculators allowed.',
        isPinned: true
      },
      {
        id: 'an5',
        title: 'Assignment 3 Extension',
        date: 'Oct 15, 2026',
        content: 'Due to the midterm, the Minimax Agent deadline has been extended by 5 days. New deadline: October 25th.',
        isPinned: false
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
    hasGroups: false,
    scoreBreakdown: [
      { name: 'Assignments',   value: 97 },
      { name: 'Quizzes',       value: 91 },
      { name: 'Participation', value: 99 },
      { name: 'Final Project', value: 93 },
    ],
    assignments: [
      { id: 'c1', title: 'Component Library — Part 1', due: 'Oct 05, 2026', status: 'submitted', details: 'Design and build button and input components in React.', url: '#' },
      { id: 'c2', title: 'Accessibility Audit Report', due: 'Oct 25, 2026', status: 'active', details: 'Run an audit on a popular website and suggest improvements.', url: '#' },
    ],
    mates: [
      { id: 'm12', name: 'Nadia Kowalski',   tag: '2nd Year' },
      { id: 'm13', name: 'Carlos Rivera',    tag: '2nd Year' },
      { id: 'm14', name: 'Zoe Kimura',       tag: '3rd Year' },
      { id: 'm15', name: 'Ibrahim Al-Rashid', tag: '2nd Year' },
    ],
    resources: [
      { id: 'r8', type: 'link', title: 'Design System Reference', desc: 'Official docs for the design tokens and component API used in this course.', date: 'Sep 05, 2026', url: '#' },
    ],
    announcements: [
      {
        id: 'an6',
        title: 'Guest Lecture: Design at Scale',
        date: 'Sep 30, 2026',
        content: 'We will have a guest lecture from a senior designer at Figma on October 7th. Attendance is highly encouraged.',
        isPinned: false
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
    hasGroups: false,
    scoreBreakdown: [
      { name: 'Assignments',   value: 80 },
      { name: 'Quizzes',       value: 73 },
      { name: 'Participation', value: 85 },
      { name: 'Final Project', value: 74 },
    ],
    assignments: [
      { id: 'd1', title: 'Build a Full-Stack App', due: 'Nov 15, 2026', status: 'active', details: 'Create a full-stack Next.js app including database integration.', url: '#' },
    ],
    mates: [
      { id: 'm16', name: 'Soren Andersen', tag: '4th Year' },
      { id: 'm17', name: 'Min-Ji Park',    tag: '3rd Year' },
    ],
    resources: [
      { id: 'r9', type: 'video', title: 'Lecture 2 — Edge vs CDN', desc: 'Recorded session comparing deployment patterns.', date: 'Sep 08, 2026', url: '#' },
    ],
    announcements: [
      {
        id: 'an7',
        title: 'Final Project Guidelines Released',
        date: 'Oct 10, 2026',
        content: 'The final project spec is now available on the portal. Teams of 2–3. Must use a modern framework of your choice. Presentations are Dec 1st.',
        isPinned: true
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
    hasGroups: false,
    scoreBreakdown: [
      { name: 'Assignments',   value: 91 },
      { name: 'Quizzes',       value: 85 },
      { name: 'Participation', value: 90 },
      { name: 'Final Exam',    value: 83 },
    ],
    assignments: [
      { id: 'e1', title: 'ER Diagram Submission',      due: 'Sep 22, 2026', status: 'graded', details: 'Submit the ER diagram for the mid-term project.', url: '#' },
      { id: 'e2', title: 'SQL Query Optimisation Lab', due: 'Oct 18, 2026', status: 'graded', details: 'Optimize the given dataset queries.', url: '#' },
    ],
    mates: [
      { id: 'm18', name: 'Amara Diallo',  tag: '2nd Year' },
      { id: 'm19', name: 'Tomás García',  tag: '2nd Year' },
      { id: 'm20', name: 'Elena Volkov',  tag: '3rd Year' },
    ],
    resources: [
      { id: 'r10', type: 'document', title: 'Normalisation Cheat Sheet', desc: '1NF through BCNF with worked examples.', date: 'Sep 15, 2026', url: '#' },
    ],
    announcements: [
      {
        id: 'an8',
        title: 'Course Complete — Final Grades Posted',
        date: 'Dec 05, 2026',
        content: 'All final grades have been submitted. Thank you for a great semester. Transcripts will be updated within 10 business days.',
        isPinned: false
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
    hasGroups: false,
    scoreBreakdown: [
      { name: 'Assignments',   value: 76 },
      { name: 'Quizzes',       value: 68 },
      { name: 'Participation', value: 80 },
      { name: 'Final Exam',    value: 65 },
    ],
    assignments: [
      { id: 'f1', title: 'RISC-V Assembly Program', due: 'Oct 10, 2026', status: 'graded', details: 'Write a program to multiply matrices in RISC-V.', url: '#' },
      { id: 'f2', title: 'Cache Simulation Report', due: 'Nov 05, 2026', status: 'graded', details: 'Evaluate cache hit rates under different policies.', url: '#' },
    ],
    mates: [
      { id: 'm21', name: 'Yusuf Balogun', tag: '2nd Year' },
      { id: 'm22', name: 'Mei Lin',        tag: '2nd Year' },
    ],
    resources: [
      { id: 'r11', type: 'document',  title: 'Patterson & Hennessy — Ch. 4', desc: 'Chapter on pipelining the datapath.',           date: 'Sep 20, 2026', url: '#' },
      { id: 'r12', type: 'link', title: 'RISC-V Simulator',             desc: 'Browser-based RISC-V assembler and runtime.', date: 'Sep 02, 2026', url: '#' },
    ],
    announcements: [
      {
        id: 'an9',
        title: 'Semester Wrap-up',
        date: 'Nov 28, 2026',
        content: "It's been a great semester! Final exam feedback will be shared via email by December 10th. Well done to everyone.",
        isPinned: false
      },
    ],
  },
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

/* ─── Main Component ─────────────────────────────────────────────────────── */
const ClassDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('assignments');
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const mockMessages = [
    { id: 1, text: "Hey! Does anyone have the notes for week 3?", isSent: false, time: "10:30 AM" },
    { id: 2, text: "Check the Resources tab, I think the TA uploaded them.", isSent: true, time: "10:32 AM" },
    { id: 3, text: "Awesome, found them. Thanks!", isSent: false, time: "10:34 AM" }
  ];

  const cls = mockDb[id];
  if (!cls) return <Navigate to="/student/classes" replace />;

  const panel = {
    hidden:  { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  };

  const getTabs = () => {
    const tabs = [
      { id: 'assignments',   label: 'Assignments',  Icon: FileText,     countKey: 'assignments' },
      { id: 'mates',         label: 'Classmates',   Icon: Users,        countKey: 'mates' }
    ];
    if (cls.hasGroups) {
      tabs.push({ id: 'groups', label: 'Groups', Icon: Layers, countKey: 'groups' });
    }
    tabs.push({ id: 'resources',     label: 'Resources',    Icon: BookOpen,     countKey: 'resources' });
    tabs.push({ id: 'announcements', label: 'Announcements',Icon: Megaphone,    countKey: 'announcements' });
    tabs.push({ id: 'score',         label: 'Performance',  Icon: BarChart2,    countKey: null });
    return tabs;
  };

  const currentTabs = getTabs();

  return (
    <motion.div
      className="class-detail-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Link to="/student/classes" className="class-detail-back">
        <ArrowLeft size={16} />
        Back to Classes
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
            <BannerMenu classId={cls.id} />
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
            {countKey && (
              <span className="tab-btn-count">{cls[countKey].length}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <motion.div key="assignments" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            {cls.assignments.map((a) => {
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
                          <Link to={a.url || '#'} className="assignment-view-btn">
                            View Full Assignment <ExternalLink size={14} />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* CLASSMATES */}
        {activeTab === 'mates' && (
          <motion.div key="mates" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <button className="general-chat-btn" onClick={() => { setActiveChat("General Class Chat"); setIsChatOpen(true); }}>
              <MessageSquare size={18} /> General Class Chat
            </button>
            <div className="mates-grid">
              {cls.mates.map((m) => (
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
        {activeTab === 'groups' && cls.hasGroups && (
          <motion.div key="groups" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <div className="groups-grid">
              {cls.groups?.map(g => (
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
            {cls.resources.map((r) => (
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
              {[...cls.announcements].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)).map((a) => (
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

        {/* PERFORMANCE / SCORE */}
        {activeTab === 'score' && (
          <motion.div key="score" role="tabpanel" className="tab-panel" variants={panel} initial="hidden" animate="visible" exit="hidden">
            <div className="score-panel">
              <ScoreGauge score={cls.overallScore} color={cls.accent} />
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

    </motion.div>
  );
};

export default ClassDetail;
