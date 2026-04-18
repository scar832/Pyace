import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Users,
  GitBranch,
  Play,
  CheckCircle,
  FileText,
  Clock,
  Calendar,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award,
  CircleDashed,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { mockAssignments } from '../../data/mockAssignments';
import '../../Styles/assignmentDetail.css';

const AssignmentDetail = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [rubricOpen, setRubricOpen] = useState(false);

  useEffect(() => {
    // Find matching data based on id with robust string comparison
    const found = mockAssignments?.find(a => String(a.id) === String(id));
    if (found) {
      setAssignment(found);
      setObjectives(found.objectives || []);
    }
  }, [id]);

  const toggleObjective = (objId) => {
    setObjectives(prev => prev.map(obj =>
      obj.id === objId ? { ...obj, completed: !obj.completed } : obj
    ));
  };

  if (!assignment) {
    return <div className="p-8 text-white">Assignment not found or loading...</div>;
  }

  const allCompleted = objectives.length > 0 && objectives.every(obj => obj.completed);

  return (
    <div className="assignment-detail-container layout-content">
      {/* HEADER SECTION */}
      <div className="detail-header-panel">
        <Link to="/student/assignments" className="btn-back">
          <ArrowLeft size={16} /> <span>Back to Assignments</span>
        </Link>
        <div className="header-title-row">
          <h1 className="header-title">{assignment.title}</h1>
          <span className={`status-badge status-${assignment.status}`}>
            {assignment.status.toUpperCase()}
          </span>
        </div>
        
        <div className="header-pills">
          <div className="pill pill-class" style={{ '--pill-accent': assignment.accent }}>
            <BookOpen size={14} />
            <span>{assignment.className} ({assignment.courseCode})</span>
          </div>
          <div className="pill pill-time">
            <Clock size={14} />
            <span>Est. {assignment.estimatedTime}</span>
          </div>
          <div className="pill pill-due">
            <Calendar size={14} />
            <span>Due {new Date(assignment.dueDate).toLocaleDateString(undefined, {
              month: 'short', day: 'numeric', year: 'numeric'
            })}</span>
          </div>
        </div>

        {/* VISUAL TIMELINE */}
        {assignment.timeline && (
          <div className="timeline-stepper">
            {assignment.timeline.map((step, idx) => {
              const isLast = idx === assignment.timeline.length - 1;
              return (
                <div key={idx} className={`timeline-step ${step.status}`}>
                  <div className="step-icon-container">
                    {step.status === 'complete' ? <CheckCircle2 size={18} /> : 
                     step.status === 'active' ? <CircleDashed size={18} className="spin-slow" /> : 
                     <CircleDashed size={18} />}
                  </div>
                  <span className="step-label">{step.step}</span>
                  {!isLast && <div className="step-connector"></div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="detail-grid">
        {/* LEFT COLUMN: The Brief */}
        <div className="detail-main-column">
          
          <div className="matte-card">
            <div className="card-header">
              <div className="card-icon"><FileText size={18} /></div>
              <h3>Project Brief</h3>
            </div>
            <div className="card-body">
              <p className="brief-text">{assignment.description}</p>
            </div>
          </div>

          <div className="matte-card">
            <div className="card-header">
              <div className="card-icon"><CheckCircle size={18} /></div>
              <h3>Actionable Objectives</h3>
            </div>
            <div className="card-body">
              <div className="task-list">
                {objectives.map((obj) => (
                  <div
                    key={obj.id}
                    className={`task-row ${obj.completed ? 'completed' : ''}`}
                    onClick={() => toggleObjective(obj.id)}
                  >
                    <div className="task-checkbox">
                      {obj.completed && <Check size={14} />}
                    </div>
                    <span className="task-text">{obj.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RUBRIC ACCORDION */}
          {assignment.rubric && (
            <div className="matte-card rubric-card">
              <div 
                className="card-header clickable" 
                onClick={() => setRubricOpen(!rubricOpen)}
              >
                <div className="card-header-left">
                  <div className="card-icon"><Award size={18} /></div>
                  <h3>Grading Criteria</h3>
                </div>
                <div className="accordion-icon">
                  {rubricOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              
              <div className={`rubric-content ${rubricOpen ? 'open' : ''}`}>
                <div className="rubric-table">
                  <div className="rubric-header">
                    <div>Criteria</div>
                    <div className="points-col">Points</div>
                  </div>
                  {assignment.rubric.map((item, idx) => (
                    <div key={idx} className="rubric-row">
                      <div className="rubric-criteria">{item.criteria}</div>
                      <div className="rubric-points">{item.points} pts</div>
                    </div>
                  ))}
                  <div className="rubric-row total-row">
                    <div className="rubric-criteria">Total Possible</div>
                    <div className="rubric-points text-accent">
                      {assignment.rubric.reduce((acc, curr) => acc + curr.points, 0)} pts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Action Sidebar */}
        <div className="detail-side-column">

          {/* GROUP INFO */}
          {assignment.isGroup && assignment.groupDetails && (
            <div className="matte-card side-card">
              <div className="card-header compact">
                <Users size={16} /> <h4>Team: {assignment.groupDetails.teamName}</h4>
              </div>
              <div className="team-members">
                {assignment.groupDetails.members.map((member, idx) => (
                  <div key={idx} className="team-member">
                    <div className="member-initials">
                      {member.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <span>{member}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBMISSION PORTAL */}
          <div className="matte-card side-card submission-card">
            <div className="card-header compact">
              <h4>Submission Portal</h4>
            </div>
            
            <div className="submission-body">
              {assignment.type === 'code' ? (
                <>
                  <div className="input-group">
                    <label htmlFor="githubUrl">GitHub Repository</label>
                    <div className="input-icon-wrapper">
                      <GitBranch size={16} className="input-icon" />
                      <input
                        id="githubUrl"
                        type="url"
                        className="luxury-input"
                        placeholder="https://github.com/..."
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <button className="hardware-btn btn-action" disabled={!allCompleted && objectives.length > 0}>
                    <Play size={16} className="btn-icon" /> 
                    <span>Launch in Sandbox</span>
                  </button>
                </>
              ) : (
                <div className="action-wrapper">
                  <button className="hardware-btn btn-success" disabled={!allCompleted && objectives.length > 0}>
                    <Check size={16} className="btn-icon" /> 
                    <span>Submit Assignment</span>
                  </button>
                </div>
              )}
              
              {(objectives.length > 0 && !allCompleted) && (
                <div className="submission-warning">
                  <AlertCircle size={14} />
                  Complete all objectives to unlock submission.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;
