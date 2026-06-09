import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Image, BookOpen, FileText, Loader2, AlertCircle, UploadCloud, CheckCircle2 } from 'lucide-react';
import { createClass, uploadImage } from '../../api/classes';

// ---------------------------------------------------------------------------
// Premium matte fallback backgrounds (used when no img_link is provided).
// Pass a class id (or any stable integer seed) to getPremiumBackground()
// to get a consistent gradient per card.
// ---------------------------------------------------------------------------
export const premiumBackgrounds = [
  'linear-gradient(135deg, #0a0a0a 0%, #171717 100%)',
  'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
  'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
  'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
  'linear-gradient(135deg, #111827 0%, #030712 100%)',
  'linear-gradient(135deg, #13111c 0%, #0d0d17 100%)',
];

/**
 * Deterministically pick a premium background for a given class ID.
 * Uses the sum of char codes so the same class always maps to the same gradient.
 *
 * @param {string} classId
 * @returns {string} CSS `background` value
 */
export function getPremiumBackground(classId = '') {
  const seed = String(classId)
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return premiumBackgrounds[seed % premiumBackgrounds.length];
}

// ---------------------------------------------------------------------------
// CreateClassModal
// ---------------------------------------------------------------------------

const INITIAL_FORM = {
  class_name: '',
  description: '',
  img_link: '',
};

/**
 * @param {{ isOpen: boolean, onClose: () => void, onCreated: (cls: object) => void }} props
 */
const CreateClassModal = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Image upload state
  const [imagePreview, setImagePreview] = useState(null);  // local blob URL for thumbnail
  const [uploading, setUploading] = useState(false);        // Cloudinary upload in-flight
  const [uploadError, setUploadError] = useState('');

  const firstInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Focus first input when modal opens; reset state when it closes
  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setError('');
      setImagePreview(null);
      setUploadError('');
      setTimeout(() => firstInputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // ── File pick → instant Cloudinary upload ──────────────────────────────
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    setImagePreview(URL.createObjectURL(file));
    setUploadError('');
    setUploading(true);

    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, img_link: url }));
    } catch (err) {
      setUploadError(err.message || 'Upload failed — try again.');
      setImagePreview(null);
      setForm((prev) => ({ ...prev, img_link: '' }));
    } finally {
      setUploading(false);
      // Reset the file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setUploadError('');
    setForm((prev) => ({ ...prev, img_link: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.class_name.trim()) {
      setError('Class name is required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        class_name: form.class_name.trim(),
        description: form.description.trim() || null,
        img_link: form.img_link.trim() || null,
      };

      const newClass = await createClass(payload);
      onCreated(newClass);
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Modal panel */}
      <div
        className="create-class-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon-wrap">
              <BookOpen size={18} />
            </div>
            <div>
              <h2 id="modal-title" className="modal-title">Create a Class</h2>
              <p className="modal-subtitle">Fill in the details to set up your new classroom.</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          {/* Error banner */}
          {error && (
            <div className="modal-error-banner" role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Class Name */}
          <div className="modal-field">
            <label className="modal-label" htmlFor="class_name">
              Class Name <span className="modal-required">*</span>
            </label>
            <div className="modal-input-wrap">
              <BookOpen size={15} className="modal-input-icon" />
              <input
                ref={firstInputRef}
                id="class_name"
                name="class_name"
                type="text"
                className="modal-input"
                placeholder="e.g. Advanced Data Structures"
                value={form.class_name}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="modal-field">
            <label className="modal-label" htmlFor="description">
              Description <span className="modal-optional">(optional)</span>
            </label>
            <div className="modal-textarea-wrap">
              <FileText size={15} className="modal-input-icon modal-input-icon--textarea" />
              <textarea
                id="description"
                name="description"
                className="modal-textarea"
                placeholder="A brief overview of what this class covers…"
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          {/* Cover Image — file upload */}
          <div className="modal-field">
            <label className="modal-label">
              Cover Image <span className="modal-optional">(optional)</span>
            </label>

            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              id="cover_image_file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            {imagePreview ? (
              /* Preview card */
              <div className="modal-image-preview">
                <img src={imagePreview} alt="Cover preview" className="modal-image-thumb" />
                <div className="modal-image-overlay">
                  {uploading ? (
                    <div className="modal-image-status">
                      <Loader2 size={18} className="modal-spinner" />
                      <span>Uploading…</span>
                    </div>
                  ) : (
                    <div className="modal-image-status modal-image-status--done">
                      <CheckCircle2 size={18} />
                      <span>Uploaded</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="modal-image-remove"
                  onClick={clearImage}
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              /* Drop-zone / upload button */
              <button
                type="button"
                className="modal-upload-zone"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <UploadCloud size={22} className="modal-upload-icon" />
                <span className="modal-upload-label">Click to upload a cover image</span>
                <span className="modal-upload-hint">JPEG · PNG · WebP · GIF &nbsp;·&nbsp; max 8 MB</span>
              </button>
            )}

            {/* Per-field upload error */}
            {uploadError && (
              <div className="modal-error-banner modal-error-banner--sm" role="alert">
                <AlertCircle size={13} />
                <span>{uploadError}</span>
                <button
                  type="button"
                  onClick={() => { setUploadError(''); fileInputRef.current?.click(); }}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none',
                    color: '#f87171', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Retry
                </button>
              </div>
            )}

            <p className="modal-hint">Leave blank for a sleek matte gradient cover.</p>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn--ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn--primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="modal-spinner" />
                  Creating…
                </>
              ) : (
                <>
                  <Plus size={15} />
                  Create Class
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateClassModal;
