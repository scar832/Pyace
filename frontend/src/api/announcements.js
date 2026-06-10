// ---------------------------------------------------------------------------
// API layer — Announcements endpoints
// ---------------------------------------------------------------------------
// Uses standard fetch with authorization headers.
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/** Return the Authorization header value from the stored JWT. */
function authHeader() {
  const token = localStorage.getItem('pyace_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Extract a human-readable message from a FastAPI error response.
 */
function parseApiError(err, fallback) {
  if (!err || !err.detail) return fallback;
  if (typeof err.detail === 'string') return err.detail;
  if (Array.isArray(err.detail)) {
    return err.detail
      .map((e) => {
        const field = e.loc ? e.loc.filter((s) => s !== 'body').join('.') : '';
        return field ? `${field}: ${e.msg}` : e.msg;
      })
      .join(' · ');
  }
  return fallback;
}

/**
 * Fetches all announcements for a class, automatically sorted.
 * Sends a GET request to /classes/${classId}/announcements/.
 *
 * @param {string} classId
 * @returns {Promise<object[]>} List of announcements
 */
export async function fetchAnnouncements(classId) {
  const res = await fetch(`${API_BASE}/classes/${classId}/announcements/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch announcements');
  }

  return res.json();
}

/**
 * Creates a new announcement for a class.
 * Sends a POST request to /classes/${classId}/announcements/.
 *
 * @param {string} classId
 * @param {object} announcementData
 * @returns {Promise<object>} Created announcement details
 */
export async function createAnnouncement(classId, announcementData) {
  const res = await fetch(`${API_BASE}/classes/${classId}/announcements/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify(announcementData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(parseApiError(err, 'Failed to create announcement'));
  }

  return res.json();
}

/**
 * Deletes an announcement from a class.
 * Sends a DELETE request to /classes/${classId}/announcements/${announcementId}.
 *
 * @param {string} classId
 * @param {string} announcementId
 * @returns {Promise<void>}
 */
export async function deleteAnnouncement(classId, announcementId) {
  const res = await fetch(`${API_BASE}/classes/${classId}/announcements/${announcementId}`, {
    method: 'DELETE',
    headers: {
      ...authHeader(),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to delete announcement');
  }
}
