import React, { useState } from 'react';
import { FileText, Download, Clock } from 'lucide-react';

const AssignmentCard = ({ assignment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const isOverdue = new Date(assignment.due_date) < new Date();

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
        margin: '12px 0',
      }}
      className="assignment-card-hover"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0, 97, 255, 0.12)',
              border: '1px solid rgba(0, 97, 255, 0.2)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={18} />
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--color-text-main)',
              }}
            >
              {assignment.title}
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                color: isOverdue ? '#f87171' : 'var(--color-text-muted)',
                marginTop: '4px',
                fontWeight: 500,
              }}
            >
              <Clock size={12} />
              <span>Due: {formatDate(assignment.due_date)}</span>
              {isOverdue && (
                <span
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                >
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              background: 'rgba(0, 97, 255, 0.08)',
              padding: '4px 10px',
              borderRadius: '20px',
            }}
          >
            Max: {assignment.max_score} XP
          </span>
          {!assignment.is_published && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.08)',
                padding: '4px 10px',
                borderRadius: '20px',
              }}
            >
              Draft
            </span>
          )}
        </div>
      </div>

      {assignment.description && (
        <div>
          <div
            style={{
              display: '-webkit-box',
              WebkitLineClamp: isExpanded ? 'unset' : 15,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.88rem',
                color: 'var(--color-text-muted)',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
              }}
            >
              {assignment.description}
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-400 text-sm mt-2 font-medium"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#0061ff',
              cursor: 'pointer',
            }}
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        </div>
      )}

      {assignment.resource_url && (
        <div style={{ marginTop: '4px' }}>
          <a
            href={assignment.resource_url}
            target="_blank"
            rel="noopener noreferrer"
            download
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              color: 'var(--color-text-main)',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background-color 0.2s ease',
              cursor: 'pointer',
            }}
            className="assignment-download-btn"
          >
            <Download size={13} />
            <span>Download Attachment</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;
