import React, { useState, useMemo } from 'react';
import { Layout, CheckSquare, X } from 'lucide-react';
import AssignmentCalendar from './AssignmentCalendar';
import AssignmentList from './AssignmentList';
import { mockAssignments } from '../../data/mockAssignments';
import '../../Styles/assignments.css';

const MOCK_ASSIGNMENTS = mockAssignments;

const Assignments = () => {
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedDate, setSelectedDate] = useState(null);

  const classes = ['All', ...new Set(MOCK_ASSIGNMENTS.map(a => a.courseCode))];

  const filteredAssignments = useMemo(() => {
    let filtered = [...MOCK_ASSIGNMENTS];
    
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