// ---------------------------------------------------------------------------
// API layer — Assignments endpoints
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
 * Uploads an assignment resource (file/image) to the backend.
 * Sends a POST request to /uploads/image with FormData containing the file.
 * Returns the url string from the backend response.
 *
 * @param {File} file The file to upload
 * @returns {Promise<string>} Cloudinary file URL
 */
export async function uploadAssignmentResource(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/uploads/file`, {
    method: 'POST',
    headers: {
      ...authHeader(),
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Resource upload failed');
  }

  const data = await res.json();
  return data.url;
}

/**
 * Creates a new assignment for a class.
 * Sends a POST request to /classes/${classId}/assignments with the JSON payload.
 *
 * @param {string} classId
 * @param {object} assignmentData
 * @returns {Promise<object>} Created assignment details
 */
export async function createAssignment(classId, assignmentData) {
  const res = await fetch(`${API_BASE}/classes/${classId}/assignments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify(assignmentData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(parseApiError(err, 'Failed to create assignment'));
  }

  return res.json();
}

/**
 * Fetches all assignments for a class.
 * Sends a GET request to /classes/${classId}/assignments.
 *
 * @param {string} classId
 * @returns {Promise<object[]>} List of assignments
 */
export async function fetchAssignments(classId) {
  const res = await fetch(`${API_BASE}/classes/${classId}/assignments/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch assignments');
  }

  return res.json();
}
