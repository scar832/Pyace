import React, { useState, useEffect, useCallback } from 'react';
import { School, Plus, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import ClassCard from '../../components/students/ClassCard';
import CreateClassModal from '../../components/instructor/CreateClassModal';
import { getPremiumBackground } from '../../components/instructor/CreateClassModal';
import { fetchClasses } from '../../api/classes';
import '../../Styles/classes.css';

function normaliseClass(cls) {
  return {
    id: cls.id,
    name: cls.class_name,
    courseCode: cls.class_code,
    lecturer: 'You',            // Instructor is the current user
    status: cls.status,         // 'active' | 'archived'
    coverImage: cls.img_link || null,
    // Supply a stable inline-style gradient when there's no cover image.
    // ClassCard already checks coverImage first, so this is purely a hint.
    _premiumBg: getPremiumBackground(cls.id),
    rawClass: cls,
  };
}

// ---------------------------------------------------------------------------
// ManageClassroom — instructor view
// ---------------------------------------------------------------------------
const ManageClassroom = () => {
  const [classes, setClasses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [fetchErr, setFetchErr] = useState('');
  const [filter, setFilter]     = useState('active');
  const [modalOpen, setModalOpen] = useState(false);

  // ── Load classes from the API ─────────────────────────────────────────────
  const loadClasses = useCallback(async () => {
    setLoading(true);
    setFetchErr('');
    try {
      const data = await fetchClasses();
      setClasses(data.map(normaliseClass));
    } catch (err) {
      setFetchErr(err.message || 'Could not load classes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadClasses(); }, [loadClasses]);

  // ── Handle newly created class ────────────────────────────────────────────
  const handleCreated = (newClass) => {
    setClasses((prev) => [normaliseClass(newClass), ...prev]);
  };

  const filtered = classes.filter((c) => c.status === filter);

  return (
    <>
      <motion.div
        className="classes-container"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {/* ── Page Header ── */}
        <div className="classes-page-header">
          <h1 className="classes-page-title">Manage Classroom</h1>
          <p className="classes-page-subtitle">
            Create and manage your courses, students, and resources.
          </p>
        </div>

        {/* ── Create Class CTA ── */}
        <div className="join-class-section">
          <p className="join-class-label">Start something new</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--color-text-muted)', flex: 1 }}>
              Set up a classroom, share the invite code with your students, and you're ready to go.
            </p>
            <button
              className="join-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
              onClick={() => setModalOpen(true)}
            >
              <Plus size={16} />
              New Class
            </button>
          </div>
        </div>

        {/* ── Classes list ── */}
        <div className="classes-section">
          <div className="classes-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 className="classes-section-title">
                {filter === 'active' ? 'Active Classes' : 'Archived Classes'}
              </h2>
              {!loading && (
                <span className="classes-count">{filtered.length} class{filtered.length !== 1 ? 'es' : ''}</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Refresh button */}
              <button
                onClick={loadClasses}
                disabled={loading}
                title="Refresh"
                style={{
                  width: 34, height: 34, border: '1px solid var(--color-border)',
                  borderRadius: 10, background: 'var(--color-bg)',
                  color: 'var(--color-text-muted)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  transition: 'background 0.15s ease',
                }}
              >
                <RefreshCw size={15} style={loading ? { animation: 'spin 0.7s linear infinite' } : {}} />
              </button>

              <div className="classes-filter-pills">
                <button
                  className={`filter-pill${filter === 'active' ? ' active' : ''}`}
                  onClick={() => setFilter('active')}
                >
                  Active
                </button>
                <button
                  className={`filter-pill past${filter === 'archived' ? ' active' : ''}`}
                  onClick={() => setFilter('archived')}
                >
                  Archived
                </button>
              </div>
            </div>
          </div>

          {/* Error state */}
          {fetchErr && (
            <div className="modal-error-banner" role="alert" style={{ borderRadius: 14 }}>
              <span>{fetchErr}</span>
              <button
                onClick={loadClasses}
                style={{ marginLeft: 'auto', fontWeight: 600, fontSize: '0.82rem',
                  background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="classes-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="class-card" style={{ minHeight: 220, opacity: 0.4,
                  animation: 'pulse 1.5s ease-in-out infinite' }}>
                  <div className="class-card-cover" style={{ background: 'var(--color-border)' }} />
                  <div className="class-card-body" style={{ gap: 10 }}>
                    <div style={{ height: 14, borderRadius: 8, background: 'var(--color-border)', width: '40%' }} />
                    <div style={{ height: 18, borderRadius: 8, background: 'var(--color-border)', width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Class grid */}
          {!loading && !fetchErr && (
            <div className="classes-grid">
              {filtered.length === 0 ? (
                <div className="classes-empty">
                  <div className="classes-empty-icon">
                    <School size={40} />
                  </div>
                  <h3>No {filter} classes</h3>
                  <p>
                    {filter === 'active'
                      ? 'Click "New Class" above to create your first classroom.'
                      : 'Archived classes will appear here.'}
                  </p>
                </div>
              ) : (
                filtered.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    basePath="/instructor/classroom"
                    {...cls}
                    // Pass the premium gradient as a style override for the gradient div
                    accent={cls._premiumBg}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal — rendered outside the motion.div so it's always on top */}
      <CreateClassModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
};

export default ManageClassroom;
