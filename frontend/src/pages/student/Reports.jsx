import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Download, 
  BrainCircuit, 
  TerminalSquare, 
  RefreshCcw,
  ChevronDown,
  MessageSquare,
  Clock
} from 'lucide-react';
import { mockReports } from '../../data/mockReports';
import '../../Styles/reports.css';

export default function Reports() {
  const [activeTabId, setActiveTabId] = useState(mockReports.classReports[0]?.id || '');
  const [subTab, setSubTab] = useState('graded'); // 'graded' or 'pending'
  const [expandedNotes, setExpandedNotes] = useState({});
  const [animatedSkills, setAnimatedSkills] = useState(false);

  useEffect(() => {
    // Trigger CSS width transition for skill progress bars
    const timer = setTimeout(() => {
      setAnimatedSkills(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleNote = (reportId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  const activeClass = mockReports.classReports.find(c => c.id === activeTabId);

  return (
    <div className="reports-dashboard">
      <div className="reports-header">
        <div>
          <h1>Analytics & Feedback</h1>
          <p>Monitor your performance, skills, and AI-driven insights.</p>
        </div>
        <button className="reports-btn">
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="reports-section-label">Performance Overview</div>

      {/* TOP ROW: Stats & Skills */}
      <div className="reports-grid-top">
        {/* Executive Summary */}
        <div className="reports-card">
          <div className="reports-card-title">Executive Summary</div>
          <div className="reports-stat-grid">
            <div className="reports-stat-item">
              <span className="reports-stat-label">Current GPA</span>
              <span className="reports-stat-value">{mockReports.overallStats.gpa}</span>
            </div>
            <div className="reports-stat-item">
              <span className="reports-stat-label">Class Rank</span>
              <span className="reports-stat-value" style={{ color: '#10B981' }}>{mockReports.overallStats.classRank}</span>
            </div>
            <div className="reports-stat-item">
              <span className="reports-stat-label">Assigned</span>
              <span className="reports-stat-value">{mockReports.overallStats.totalAssignments}</span>
            </div>
            <div className="reports-stat-item">
              <span className="reports-stat-label">Pending</span>
              <span className="reports-stat-value" style={{ color: '#F59E0B' }}>{mockReports.overallStats.pendingGrades}</span>
            </div>
          </div>
        </div>

        {/* Skill Analytics */}
        <div className="reports-card">
          <div className="reports-card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={18} color="#3B82F6"/>
              Skill Analytics
            </div>
          </div>
          <div className="reports-skills-container">
            {mockReports.skillBreakdown.map((skill, idx) => {
              let colorClass = '';
              if (skill.score >= 90) colorClass = 'high';
              else if (skill.score >= 70) colorClass = 'medium';

              return (
                <div key={idx} className="reports-skill-row">
                  <div className="reports-skill-info">
                    <span className="reports-skill-name" title={skill.topic}>{skill.topic}</span>
                    <span className="reports-skill-score">{skill.score}%</span>
                  </div>
                  <div className="reports-skill-track">
                    <div 
                      className={`reports-skill-fill ${colorClass}`} 
                      style={{ width: animatedSkills ? `${skill.score}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="reports-section-label">AI Mentor Guidance</div>

      {/* MIDDLE ROW: AI Mentor View */}
      <div className="reports-ai-card">
        <div className="reports-ai-header">
          <div className="reports-ai-icon">
            <BrainCircuit size={24} />
          </div>
          <h2 className="reports-ai-title">AI Mentor Insights</h2>
        </div>
        
        <div className="reports-ai-grid">
          <div className="reports-ai-box">
            <div className="reports-ai-label">Identified Weakness</div>
            <p className="reports-ai-text">{mockReports.aiInsights.identifiedWeakness}</p>
          </div>
          <div className="reports-ai-box">
            <div className="reports-ai-label">Recommended Improvement</div>
            <p className="reports-ai-text">{mockReports.aiInsights.recommendedImprovement}</p>
          </div>
        </div>

        <div className="reports-ai-actions">
          <button className="reports-btn">
            <RefreshCcw size={16} />
            Generate Fresh Review
          </button>
          <button className="reports-btn reports-btn-primary">
            <TerminalSquare size={16} />
            Practice: {mockReports.aiInsights.suggestedChallenge}
          </button>
        </div>
      </div>

      <div className="reports-section-label">Detailed Course History</div>

      {/* BOTTOM ROW: Detailed Class History */}
      <div className="reports-classes-container">
        <div className="reports-tabs-header">
          {mockReports.classReports.map(c => (
            <button 
              key={c.id} 
              className={`reports-tab-btn ${activeTabId === c.id ? 'active' : ''}`}
              onClick={() => { setActiveTabId(c.id); setSubTab('graded'); }}
            >
              {c.className}
            </button>
          ))}
        </div>

        {activeClass && (
          <div className="reports-tab-content">
            <div className="reports-class-header">
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Class History</h3>
              <div className="reports-class-grade">
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#6B7280' }}>Overall Grade</span>
                <span className="reports-grade-badge">{activeClass.overallGrade}</span>
              </div>
            </div>

            <div className="reports-sub-tabs">
              <button 
                className={`reports-sub-btn ${subTab === 'graded' ? 'active' : ''}`}
                onClick={() => setSubTab('graded')}
              >
                Graded History
              </button>
              <button 
                className={`reports-sub-btn ${subTab === 'pending' ? 'active' : ''}`}
                onClick={() => setSubTab('pending')}
              >
                Pending Grades ({activeClass.pendingReports.length})
              </button>
            </div>

            {subTab === 'graded' && (
              <div className="reports-history-list">
                {activeClass.pastReports.length === 0 && (
                  <div className="reports-empty">No graded reports available.</div>
                )}
                {activeClass.pastReports.map(report => {
                  const isOpen = expandedNotes[report.id];
                  const percent = (report.score / report.maxScore) * 100;
                  const scoreClass = percent >= 90 ? 'good' : percent >= 75 ? 'warn' : '';

                  return (
                    <div key={report.id} className="reports-history-item">
                      <div className="reports-history-main" onClick={() => handleToggleNote(report.id)}>
                        <div className="reports-history-info">
                          <span className="reports-history-title">{report.title}</span>
                          <span className="reports-history-date">Submitted: {new Date(report.date).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}</span>
                        </div>
                        <div className="reports-history-score-area">
                          <span className={`reports-score-pill ${scoreClass}`}>
                            {report.score}/{report.maxScore}
                          </span>
                          <ChevronDown size={18} className={`reports-expand-icon ${isOpen ? 'open' : ''}`} />
                        </div>
                      </div>
                      <div className={`reports-history-notes ${isOpen ? 'open' : ''}`}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <MessageSquare size={16} style={{ color: '#8B5CF6', flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <div style={{ fontSize: '13px', color: '#8B5CF6', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '800' }}>Teacher Notes</div>
                            {report.teacherNotes}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {subTab === 'pending' && (
              <div className="reports-history-list">
                {activeClass.pendingReports.length === 0 && (
                  <div className="reports-empty">No pending grades. All caught up!</div>
                )}
                {activeClass.pendingReports.map(report => (
                  <div key={report.id} className="reports-history-item pending">
                    <div className="reports-history-main">
                      <div className="reports-history-info">
                        <span className="reports-history-title">{report.title}</span>
                        <span className="reports-history-date">Submitted: {new Date(report.submittedDate).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}</span>
                      </div>
                      <div className="reports-pending-badge">
                        <Clock size={16} /> Awaiting Grade
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}