import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, MessageSquare, Play, Github, CheckCircle, Circle } from 'lucide-react';
import '../../styles/assignmentDetail.css';

const MOCK_DB = {
  '1': {
    id: '1',
    title: 'Graph Traversal Implementation',
    className: 'Advanced Data Structures',
    courseCode: 'CS 301',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'pending',
    type: 'code',
    isGroup: true,
    groupDetails: {
      groupName: 'Alpha Team',
      members: ['Kwame Asante', 'Priya Nair', 'Luca Ferrari']
    },
    description: 'In this assignment, you will implement Breadth-First Search (BFS) and Depth-First Search (DFS) algorithms to find the shortest path in an unweighted graph. The graph will be represented using an adjacency list. Ensure your algorithms map cleanly to the provided starter code interfaces, and account for potential cycles gracefully without triggering stack overflows.',
    objectives: [
      { id: 'o1', text: 'Implement BFS traversal method', completed: false },
      { id: 'o2', text: 'Implement DFS iterative traversal method', completed: false },
      { id: 'o3', text: 'Provide unit tests for cyclical graphs', completed: false },
      { id: 'o4', text: 'Document time and space complexities', completed: false }
    ]
  },
  '2': {
    id: '2',
    title: 'Accessibility Audit Report',
    className: 'User Interface Engineering',
    courseCode: 'SE 210',
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'overdue',
    type: 'objective',
    isGroup: false,
    groupDetails: null,
    description: 'Perform a full WSAG accessibility audit on the provided e-commerce mockup. Identify at least 5 major compliance issues across contrast ratios, semantic HTML structuring, ARIA labeling, and keyboard navigation. Fill out the corresponding checklists below as you address them.',
    objectives: [
      { id: 'o1', text: 'Identify 2 contrast violations', completed: true },
      { id: 'o2', text: 'Fix missing alt attributes in media', completed: false },
      { id: 'o3', text: 'Ensure full keyboard accessibility through modal', completed: false }
    ]
  }
};

const AssignmentDetail = () => {
  const { id } = useParams();
  const assignment = MOCK_DB[id] || MOCK_DB['1']; // Fallback to '1' for mock testing
  const [objectives, setObjectives] = useState(assignment.objectives);
  const [githubUrl, setGithubUrl] = useState('');

  const toggleObjective = (objId) => {
    if (assignment.type !== 'objective') return;
    setObjectives(prev => prev.map(o => o.id === objId ? { ...o, completed: !o.completed } : o));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#0061ff';
      case 'overdue': return '#ef4444';
      case 'submitted': 
      case 'graded': return '#10b981';
      default: return '#888';
    }
  };

  const initials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="assignment-detail-container layout-content">
       <Link to="/student/assignments" className="back-link">
          <ArrowLeft size={16}/> Back to Assignments
       </Link>
       
       <div className="assignment-detail-grid">
          {/* LEFT COLUMN: Main Content */}
          <div className="detail-main-col">
             <div className="detail-header">
                <div className="detail-meta">
                   <span className="detail-course">{assignment.courseCode} — {assignment.className}</span>
                   <span className="detail-due" style={{ color: assignment.status === 'overdue' ? '#ef4444' : undefined }}>
                      Due: {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                   </span>
                </div>
                <h1 className="detail-title">{assignment.title}</h1>
                <div className="detail-badges">
                   <span className="detail-badge">{assignment.isGroup ? 'Group Project' : 'Individual'}</span>
                   <span className="detail-badge type">{assignment.type === 'code' ? 'Code Submission' : 'Objective Task'}</span>
                </div>
             </div>

             <div className="detail-section">
                <h2>Description</h2>
                <p className="detail-desc">{assignment.description}</p>
             </div>

             <div className="detail-section">
                <h2>{assignment.type === 'objective' ? 'Task Checklist' : 'Requirements'}</h2>
                <div className={`objectives-list ${assignment.type}`}>
                   {objectives.map(obj => (
                     <div 
                       key={obj.id} 
                       className={`objective-item ${obj.completed ? 'completed' : ''}`}
                       onClick={() => toggleObjective(obj.id)}
                     >
                       {assignment.type === 'objective' ? (
                          obj.completed ? <CheckCircle className="check-icon done" size={20}/> : <Circle className="check-icon" size={20}/>
                       ) : (
                          <div className="bullet-point"></div>
                       )}
                       <span className="objective-text">{obj.text}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="detail-sidebar-col">
             
             {/* Status Card */}
             <div className="sidebar-card status-card" style={{ '--status-color': getStatusColor(assignment.status) }}>
                <span className="status-label">Current Status</span>
                <div className="status-value">
                   <span className="status-indicator"></span>
                   {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </div>
             </div>

             {/* Group Card (Conditional) */}
             {assignment.isGroup && assignment.groupDetails && (
               <div className="sidebar-card group-card">
                  <div className="group-card-header">
                     <Users size={18} className="group-icon"/>
                     <h3>{assignment.groupDetails.groupName}</h3>
                  </div>
                  <div className="group-members-list">
                     {assignment.groupDetails.members.map(m => (
                       <div key={m} className="group-member-item">
                          <div className="member-avatar">{initials(m)}</div>
                          <span className="member-name">{m}</span>
                       </div>
                     ))}
                  </div>
                  <button className="open-chat-btn"><MessageSquare size={16}/> Open Group Chat</button>
               </div>
             )}

             {/* Submission Card (Conditional base on type) */}
             <div className="sidebar-card submission-card">
                <h3>Submission</h3>
                {assignment.type === 'code' ? (
                  <div className="code-submission">
                     <div className="input-group">
                        <Github size={16} className="input-icon"/>
                        <input 
                           type="url" 
                           placeholder="GitHub Repository URL" 
                           value={githubUrl}
                           onChange={(e) => setGithubUrl(e.target.value)}
                        />
                     </div>
                     <button className="submit-btn primary">Submit Repo</button>
                     
                     <div className="divider"><span>OR</span></div>
                     
                     <Link to="/student/sandbox" className="sandbox-btn secondary">
                        <Play size={16} className="play-icon" /> Launch in Sandbox
                     </Link>
                  </div>
                ) : (
                  <div className="objective-submission">
                     <p className="submission-hint">Complete all checklist items on the left before submitting.</p>
                     <button className="submit-btn primary">Mark as Complete & Submit</button>
                  </div>
                )}
             </div>

          </div>
       </div>
    </div>
  );
};

export default AssignmentDetail;
