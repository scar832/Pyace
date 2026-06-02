import os

css_path = '/Users/sedem/Downloads/Development/School/Pyace/frontend/src/Styles/classDetail.css'

new_css = """

/* =========================================
   ENHANCEMENTS & NEW FEATURES
   ========================================= */

/* ── Assignments Accordion ── */
.assignment-accordion {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.assignment-accordion:hover {
  border-color: rgba(0, 97, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.assignment-accordion .assignment-row {
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  cursor: pointer;
  padding: 18px 20px;
}

.assignment-chevron {
  color: var(--color-text-muted);
  transition: transform 0.3s ease;
}

.assignment-chevron.rotated {
  transform: rotate(180deg);
}

.assignment-details {
  border-top: 1px solid var(--color-border);
  background: rgba(0, 0, 0, 0.02);
}

.assignment-details-content {
  padding: 16px 20px 24px 76px; /* Align with info column */
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.assignment-details-content p {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

.assignment-view-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 97, 255, 0.1);
  color: var(--color-primary);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  width: fit-content;
  transition: background-color 0.2s ease;
}

.assignment-view-btn:hover {
  background: rgba(0, 97, 255, 0.18);
}

/* ── Mates Tab: General Chat Button ── */
.general-chat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--color-primary), #4318FF);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 97, 255, 0.25);
}

.general-chat-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 97, 255, 0.35);
}

/* ── Mates Grid Fix & Enhancements ── */
.mate-card {
  position: relative;
  flex-direction: row; /* Overriding previous flex-direction: column */
  text-align: left;
  align-items: center;
  padding: 16px;
  gap: 14px;
}

.mate-avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  font-size: 0.95rem;
}

.mate-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.mate-name {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.leader-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 12px;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.mate-message-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  /* Make sure it sits properly if text grows */
  flex-shrink: 0;
}

.mate-message-btn:hover {
  background: rgba(0, 97, 255, 0.1);
  color: var(--color-primary);
  border-color: rgba(0, 97, 255, 0.3);
}

/* ── Pinned Announcements ── */
.announcement-card.pinned {
  border-color: rgba(245, 158, 11, 0.4);
  background: linear-gradient(to right, rgba(245, 158, 11, 0.03), transparent);
}

.pin-icon {
  color: #f59e0b;
  margin-right: 6px;
}

.announcement-badge.pinned {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.15);
}

/* ── Groups Tab ── */
.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.group-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px dashed var(--color-border);
}

.group-icon-wrapper {
  width: 36px;
  height: 36px;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.group-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0;
}

.group-members {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-member {
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-member-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.group-member-name {
  font-size: 0.88rem;
  color: var(--color-text-main);
  font-weight: 500;
}

/* ── Resource Modal Overlay ── */
.resource-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.resource-modal-card {
  background: var(--color-bg); /* Use deeply matte background, usually var(--color-bg) or var(--color-surface) */
  border: 1px solid var(--color-border);
  border-radius: 20px;
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 60px rgba(0,0,0,0.4);
  position: relative;
  overflow: hidden;
}

.resource-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.resource-modal-close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.resource-modal-preview {
  height: 180px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--color-border);
}

.resource-modal-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resource-modal-icon-lg {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  font-size: 2rem;
}

.resource-modal-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resource-modal-type {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary);
  background: rgba(0, 97, 255, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
  width: fit-content;
}

.resource-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0;
  line-height: 1.3;
}

.resource-modal-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

.resource-modal-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
}

.resource-modal-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.resource-modal-btn:hover {
  background: #004ecc;
  transform: translateY(-1px);
}

/* Ensure Resource Icon mapping handles generic classes correctly */
.resource-icon.document { background: rgba(0, 97, 255, 0.1); color: var(--color-primary); }

"""

with open(css_path, 'a') as f:
    f.write(new_css)
