// ─── API Client ────────────────────────────────────────────────────────────────
// Centralized API calls to the backend

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetch all snippets with optional search + pagination
 */
export async function fetchSnippets({ search = '', page = 1, limit = 12 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (search.trim()) params.set('search', search.trim());

  const res = await fetch(`${BASE_URL}/snippets?${params}`);
  if (!res.ok) throw new Error('Failed to fetch snippets');
  return res.json();
}

/**
 * Fetch a single snippet by shortId
 */
export async function fetchSnippet(shortId) {
  const res = await fetch(`${BASE_URL}/snippets/${shortId}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Snippet not found');
    throw new Error('Failed to fetch snippet');
  }
  return res.json();
}

/**
 * Create a new snippet
 */
export async function createSnippet({ title, content }) {
  const res = await fetch(`${BASE_URL}/snippets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create snippet');
  }
  return res.json();
}

/**
 * Delete a snippet by shortId
 */
export async function deleteSnippet(shortId) {
  const res = await fetch(`${BASE_URL}/snippets/${shortId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete snippet');
  return res.json();
}
