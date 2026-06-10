import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Calendar, Award, UploadCloud, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { createAssignment, uploadAssignmentResource } from '../api/assignments';

const INITIAL_FORM = {
  title: '',
  description: '',
  dueDate: '',
  maxScore: '100',
  isPublished: true,
};

const CreateAssignmentModal = ({ isOpen, onClose, classId, onCreated }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Resource Upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [resourcePreview, setResourcePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const firstInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Set default datetime to tomorrow at 23:59 local
  const getDefaultDueDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 0, 0);
    // Format to yyyy-MM-ddThh:mm
    const tzOffset = tomorrow.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(tomorrow - tzOffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  useEffect(() => {
    if (isOpen) {
      setForm({
        ...INITIAL_FORM,
        dueDate: getDefaultDueDate(),
      });
      setError('');
      setSelectedFile(null);
      setResourcePreview(null);
      setUploadedUrl('');
      setUploadError('');
      setLoading(false);
      setUploading(false);
      setTimeout(() => firstInputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Handle ESC close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleFile = async (file) => {
    setSelectedFile(file);
    setResourcePreview(file.name);
    setUploadError('');
    setUploading(true);

    try {
      const url = await uploadAssignmentResource(file);
      setUploadedUrl(url);
    } catch (err) {
      setUploadError(err.message || 'File upload failed. Please try again.');
      setSelectedFile(null);
      setResourcePreview(null);
      setUploadedUrl('');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearResource = () => {
    setSelectedFile(null);
    setResourcePreview(null);
    setUploadedUrl('');
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Assignment Title is required.');
      return;
    }
    if (!form.dueDate) {
      setError('Due Date is required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        due_date: new Date(form.dueDate).toISOString(),
        max_score: form.maxScore ? parseInt(form.maxScore, 10) : 100,
        resource_url: uploadedUrl || null,
        is_published: form.isPublished,
      };

      const newAssignment = await createAssignment(classId, payload);
      if (onCreated) onCreated(newAssignment);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create assignment. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className="create-class-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-modal-title"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon-wrap">
              <FileText size={18} />
            </div>
            <div>
              <h2 id="assignment-modal-title" className="modal-title">Create Assignment</h2>
              <p className="modal-subtitle">Publish homework, labs, or tasks to this class.</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="modal-error-banner" role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="modal-field">
            <label className="modal-label" htmlFor="title">
              Assignment Title <span className="modal-required">*</span>
            </label>
            <div className="modal-input-wrap">
              <FileText size={15} className="modal-input-icon" />
              <input
                ref={firstInputRef}
                id="title"
                name="title"
                type="text"
                className="modal-input"
                placeholder="e.g. Lab 3: Binary Search Trees"
                value={form.title}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="modal-field">
            <label className="modal-label" htmlFor="description">
              Instructions / Description <span className="modal-optional">(optional)</span>
            </label>
            <div className="modal-textarea-wrap">
              <FileText size={15} className="modal-input-icon modal-input-icon--textarea" />
              <textarea
                id="description"
                name="description"
                className="modal-textarea"
                placeholder="Write clear instructions for students here…"
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          {/* Due Date & Max Score Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
            {/* Due Date */}
            <div className="modal-field">
              <label className="modal-label" htmlFor="dueDate">
                Due Date <span className="modal-required">*</span>
              </label>
              <div className="modal-input-wrap">
                <Calendar size={15} className="modal-input-icon" />
                <input
                  id="dueDate"
                  name="dueDate"
                  type="datetime-local"
                  className="modal-input"
                  value={form.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Max Score */}
            <div className="modal-field">
              <label className="modal-label" htmlFor="maxScore">
                Max Score (XP)
              </label>
              <div className="modal-input-wrap">
                <Award size={15} className="modal-input-icon" />
                <input
                  id="maxScore"
                  name="maxScore"
                  type="number"
                  min="0"
                  className="modal-input"
                  placeholder="100"
                  value={form.maxScore}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* File upload zone for attachment resource */}
          <div className="modal-field">
            <label className="modal-label">
              Assignment File Attachment <span className="modal-optional">(optional)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.zip,.py,.docx,.doc,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            {resourcePreview ? (
              <div className="modal-image-preview" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: 'var(--color-bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                  <FileText size={18} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
                    {resourcePreview}
                  </span>
                  {uploading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginLeft: '8px' }}>
                      <Loader2 size={12} className="modal-spinner" />
                      <span>Uploading…</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#4ade80', marginLeft: '8px' }}>
                      <CheckCircle2 size={12} />
                      <span>Uploaded</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="modal-image-remove"
                  onClick={clearResource}
                  aria-label="Remove file"
                  style={{ position: 'relative', top: 'auto', right: 'auto' }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={`modal-upload-zone ${dragActive ? 'drag-active' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                style={{
                  borderColor: dragActive ? 'var(--color-primary)' : 'var(--color-border)',
                  background: dragActive ? 'rgba(0, 97, 255, 0.08)' : 'var(--color-bg)',
                }}
              >
                <UploadCloud size={20} className="modal-upload-icon" />
                <span className="modal-upload-label" style={{ fontSize: '0.85rem' }}>
                  Drag & drop or click to upload resource file
                </span>
                <span className="modal-upload-hint">PDF, DOCX, ZIP, Images &nbsp;·&nbsp; max 8 MB</span>
              </button>
            )}

            {uploadError && (
              <div className="modal-error-banner modal-error-banner--sm" role="alert" style={{ marginTop: '4px' }}>
                <AlertCircle size={13} />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Draft Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
            <input
              id="isPublished"
              name="isPublished"
              type="checkbox"
              checked={form.isPublished}
              onChange={handleChange}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                accentColor: 'var(--color-primary)',
                cursor: 'pointer',
              }}
            />
            <label htmlFor="isPublished" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', cursor: 'pointer' }}>
              Publish immediately (uncheck to save as draft)
            </label>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn--ghost"
              onClick={onClose}
              disabled={loading || uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn--primary"
              disabled={loading || uploading}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="modal-spinner" />
                  Saving…
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  Save Assignment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateAssignmentModal;
