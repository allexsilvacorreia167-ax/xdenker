const API_URL = import.meta.env.VITE_API_URL || 'https://xdenker.onrender.com';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'xdenker-admin-dev';

export async function apiFetch(endpoint, options = {}) {
    // Se o endpoint já começa com http, usa ele direto; senão, junta com o API_URL
    const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const isAdmin = endpoint.includes('/api/admin');

    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(isAdmin ? { 'x-admin-key': ADMIN_KEY } : {}),
            ...options.headers,
        },
        credentials: 'include',
    });
}