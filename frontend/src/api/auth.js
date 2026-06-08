// ---------------------------------------------------------------------------
// API layer — Authentication endpoints
// ---------------------------------------------------------------------------
// Talks to the FastAPI backend at /auth/*
// All functions return { access_token, token_type, role } on success,
// and throw on network / auth errors.
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ── Register with email + password ─────────────────────────────────────────
export async function registerWithEmail(fullName, email, password, role) {
  // The backend UserCreate schema expects { email, full_name, password, role }.
  // Map the frontend "instructor" label to the backend enum value "teacher".
  const backendRole = role === 'instructor' ? 'teacher' : 'student';

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      full_name: fullName,
      password,
      role: backendRole,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Registration failed');
  }

  // After successful registration, immediately log the user in so we get a
  // JWT token + role back without an extra round-trip.
  return loginWithEmail(email, password);
}

// ── Login with email + password ────────────────────────────────────────────
export async function loginWithEmail(email, password) {
  // FastAPI's OAuth2PasswordRequestForm expects x-www-form-urlencoded
  const body = new URLSearchParams();
  body.append('username', email);    // OAuth2 spec field name
  body.append('password', password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Login failed');
  }

  const data = await res.json();
  // data: { access_token, token_type, role }
  return data;
}

// ── Login / register with Google credential ────────────────────────────────
export async function loginWithGoogle(credential, role) {
  // Map the frontend "instructor" label to the backend enum value "teacher".
  const backendRole = role === 'instructor' ? 'teacher' : 'student';

  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      credential,
      role: backendRole,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Google authentication failed');
  }

  const data = await res.json();
  // data: { access_token, token_type, role }
  return data;
}
