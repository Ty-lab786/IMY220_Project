// One place for every backend call, so URLs and the token are never wrong.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getToken = () => localStorage.getItem('token');
export const isLoggedIn = () => Boolean(getToken());

export function saveSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user._id);
}

export function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
}

export const myId = () => localStorage.getItem('userId');

// Images: seeded ones are full URLs, uploaded ones are "/uploads/..." on the backend
export const imgUrl = (path) => (!path ? '' : path.startsWith('http') ? path : `${API_URL}${path}`);

export async function api(path, { method = 'GET', body, form } = {}) {
    const headers = {};
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body) headers['Content-Type'] = 'application/json';

    const res = await fetch(`${API_URL}/api${path}`, {
        method,
        headers,
        credentials: 'include',
        body: form || (body ? JSON.stringify(body) : undefined),
    });

    const data = await res.json().catch(() => ({}));
    if (res.status === 401) clearSession();
    if (!res.ok) throw new Error(data.message || data.error || `Request failed (${res.status})`);
    return data;
}

// likes must be an array of user ids; old data sometimes has a number instead
export const likeList = (post) => (Array.isArray(post?.likes) ? post.likes : []);

export function timeAgo(date) {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)} min ago`;
    if (s < 86400) return `${Math.floor(s / 3600)} hrs ago`;
    return `${Math.floor(s / 86400)} days ago`;
}