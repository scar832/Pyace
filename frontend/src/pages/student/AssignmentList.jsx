import React from 'react';
import { Play, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import '../../styles/assignments.css';

const AssignmentList = ({ assignments }) => {
  const overdue = assignments.filter(a => a.status === 'overdue');
  const upNext = assignments.filter(a => a.status === 'pending');
  const completed = assignments.filter(a => a.status === 'submitted' || a.status === 'graded');

  const renderSection = (title, items, icon) => {
    if (items.length === 0) return null;
    return (
      <div className="assignment-section">
        <h3 className="section-title">{icon} {title}</h3>
        <div className="section-list">
          {items.map(a => (
            <div key={a.id} className={`assignment-list-card status-${a.status}`}>
              <div className="card-main">
                <h4 className="card-title">{a.title}</h4>
                <div className="card-meta">
                  <span className="class-badge" style={{'--accent': a.accent || '#8b5cf6'}}>{a.courseCode}</span>
                  <span className="due-date">Due: {new Date(a.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="card-action">
                {a.status === 'pending' && <button className="btn-start"><Play size={14}/> Start Work</button>}
                {a.status === 'overdue' && <span className="badge-overdue">Overdue</span>}
                {a.status === 'submitted' && <span className="badge-submitted">Submitted</span>}
                {a.status === 'graded' && <span className="badge-graded">Score: {a.score}%</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="assignment-list-container">
       {renderSection("Overdue", overdue, <AlertCircle size={18} className="icon-overdue" />)}
       {renderSection("Up Next", upNext, <FileText size={18} className="icon-pending" />)}
       {renderSection("Completed", completed, <CheckCircle size={18} className="icon-completed" />)}
       
       {assignments.length === 0 && (
         <div className="empty-state">No assignments match your criteria.</div>
       )}
    </div>
  );
};

export default AssignmentList;
