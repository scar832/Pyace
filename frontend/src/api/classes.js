// ---------------------------------------------------------------------------
// API layer — Classes endpoints
// ---------------------------------------------------------------------------
// Uses raw fetch with the token stored in localStorage so this file has
// zero extra dependencies (matches the existing auth.js pattern in this repo).
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/** Return the Authorization header value from the stored JWT. */
function authHeader() {
  const token = localStorage.getItem('pyace_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Create a new class (instructor only) ────────────────────────────────────
/**
 * @param {{ class_name: string, class_code: string, description?: string, img_link?: string }} classData
 * @returns {Promise<object>} ClassResponse from the backend
/**
 * Extract a human-readable message from a FastAPI error response.
 *
 * FastAPI validation errors (422) return:
 *   { detail: [ { loc, msg, type }, … ] }
 *
 * Application errors return:
 *   { detail: "some string" }
 *
 * This helper handles both cases.
 */
function parseApiError(err, fallback) {
  if (!err || !err.detail) return fallback;
  if (typeof err.detail === 'string') return err.detail;
  if (Array.isArray(err.detail)) {
    // Join all validation messages into one readable string
    return err.detail
      .map((e) => {
        const field = e.loc ? e.loc.filter((s) => s !== 'body').join('.') : '';
        return field ? `${field}: ${e.msg}` : e.msg;
      })
      .join(' · ');
  }
  return fallback;
}

export async function createClass(classData) {
  const res = await fetch(`${API_BASE}/classes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify(classData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(parseApiError(err, 'Failed to create class'));
  }

  return res.json();
}


// ── Fetch all classes for the current user ───────────────────────────────────
/**
 * Returns the instructor's classes OR the student's enrolled classes,
 * depending on the JWT identity resolved server-side.
 *
 * @returns {Promise<object[]>} Array of ClassResponse objects
 */
export async function fetchClasses() {
  const res = await fetch(`${API_BASE}/classes/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch classes');
  }

  return res.json();
}

// ── Student: join a class by invite code ────────────────────────────────────
/**
 * @param {string} classCode  The 6-character alphanumeric invite code
 * @returns {Promise<object>} The joined ClassResponse
 */
export async function joinClass(classCode) {
  const res = await fetch(`${API_BASE}/classes/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify({ class_code: classCode }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(parseApiError(err, 'Failed to join class'));
  }

  return res.json();
}

// ── Upload a cover image to Cloudinary via the backend ───────────────────────
/**
 * Uploads a File object to POST /upload/image (multipart/form-data).
 * The backend proxies it to Cloudinary and returns the secure CDN URL.
 *
 * @param {File} file  The image file selected by the user
 * @returns {Promise<string>} The Cloudinary secure_url
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/uploads/image`, {
    method: 'POST',
    headers: {
      // No Content-Type here — the browser sets it automatically with
      // the correct boundary when the body is FormData.
      ...authHeader(),
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Image upload failed');
  }

  const data = await res.json();
  return data.url; // Cloudinary secure_url
}

