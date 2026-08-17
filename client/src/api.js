const API_URL = import.meta.env.VITE_API_URL || 'https://xdenker.onrender.com';

export async function apiFetch(endpoint, options = {}) {
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include',
    });
}