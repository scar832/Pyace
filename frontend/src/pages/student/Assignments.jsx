import React, { useState, useMemo } from 'react';
import { Layout, CheckSquare, X } from 'lucide-react';
import AssignmentCalendar from './AssignmentCalendar';
import AssignmentList from './AssignmentList';
import '../../styles/assignments.css';

const MOCK_ASSIGNMENTS = [
  { 
    id: '1', 
    title: 'Graph Traversal Implementation', 
    className: 'Advanced Data Structures', 
    courseCode: 'CS 301', 
    dueDate: new Date().toISOString(), 
    status: 'pending', 
    accent: '#0061ff' 
  },
  { 
    id: '2', 
    title: 'Accessibility Audit Report', 
    className: 'User Interface Engineering', 
    courseCode: 'SE 210', 
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), 
    status: 'pending', 
    accent: '#10b981' 
  },
  { 
    id: '3', 
    title: 'Minimax Agent', 
    className: 'Artificial Intelligence', 
    courseCode: 'CS 450', 
    dueDate: new Date(Date.now() - 86400000 * 3).toISOString(), 
    status: 'overdue', 
    accent: '#8b5cf6' 
  },
  { 
    id: '4', 
    title: 'Component Library — Part 1', 
    className: 'User Interface Engineering', 
    courseCode: 'SE 210', 
    dueDate: new Date(Date.now() - 86400000 * 7).toISOString(), 
    status: 'graded', 
    score: 95, 
    accent: '#10b981' 
  },
  { 
    id: '5', 
    title: 'Red-Black Tree Visualiser', 
    className: 'Advanced Data Structures', 
    courseCode: 'CS 301', 
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(), 
    status: 'submitted', 
    accent: '#0061ff' 
  },
  { 
    id: '6', 
    title: 'SQL Query Optimisation Lab', 
    className: 'Database Management Systems', 
    courseCode: 'DB 201', 
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), 
    status: 'pending', 
    accent: '#ef4444' 
  },
  { 
    id: '7', 
    title: 'Modern Web Architecture Final', 
    className: 'Modern Web Architecture', 
    courseCode: 'SE 305', 
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString(), 
    status: 'pending', 
    accent: '#f59e0b' 
  },
];

const Assignments = () => {
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedDate, setSelectedDate] = useState(null);

  const classes = ['All', ...new Set(MOCK_ASSIGNMENTS.map(a => a.courseCode))];

  const filteredAssignments = useMemo(() => {
    let filtered = MOCK_ASSIGNMENTS;
    
    // Filter by Class
    if (selectedClass !== 'All') {
      filtered = filtered.filter(a => a.courseCode === selectedClass);
    }
    
    // Filter by selected Date
    if (selectedDate) {
      filtered = filtered.filter(a => {
        const d = new Date(a.dueDate);
        return d.getDate() === selectedDate.getDate() && 
               d.getMonth() === selectedDate.getMonth() && 
               d.getFullYear() === selectedDate.getFullYear();
      });
    }
    
    // Sort by due date natively
    return filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [selectedClass, selectedDate]);

  const totalCompleted = MOCK_ASSIGNMENTS.filter(a => a.status === 'submitted' || a.status === 'graded').length;
  const progressRatio = MOCK_ASSIGNMENTS.length ? totalCompleted / MOCK_ASSIGNMENTS.length : 0;

  return (
    <div className="assignments-page layout-content">
      
      <div className="assignments-header-section">
         <div className="assignments-title-box">
             <h1><CheckSquare size={24} /> Assignments Hub</h1>
             <p>Manage your upcoming deadlines and track your progress.</p>
         </div>

         <div className="weekly-progress-box">
            <div className="progress-text">
               <span className="progress-number">{totalCompleted}</span>
               <span className="progress-label">of {MOCK_ASSIGNMENTS.length} Completed</span>
            </div>
            <div className="progress-track">
               <div className="progress-fill" style={{ width: `${progressRatio * 100}%` }}></div>
            </div>
         </div>
      </div>

      <div className="filter-pills">
         {classes.map(c => (
           <button 
             key={c} 
             className={`filter-pill ${selectedClass === c ? 'active' : ''}`}
             onClick={() => setSelectedClass(c)}
           >
             {c === 'All' ? <Layout size={14} /> : null}
             {c}
           </button>
         ))}
         {selectedDate && (
           <button 
             className="filter-pill reset-date" 
             onClick={() => setSelectedDate(null)}
             title="Clear Date Filter"
           >
             <X size={14} /> Clear Date
           </button>
         )}
      </div>

      <div className="assignments-layout">
         <div className="assignments-calendar-col">
           <AssignmentCalendar 
             assignments={MOCK_ASSIGNMENTS} 
             selectedDate={selectedDate} 
             onSelectDate={setSelectedDate} 
           />
         </div>
         <div className="assignments-list-col">
           <AssignmentList assignments={filteredAssignments} />
         </div>
      </div>
    </div>
  );
};

export default Assignments;