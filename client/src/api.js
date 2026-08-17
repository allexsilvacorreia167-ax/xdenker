const API_URL = import.meta.env.VITE_API_URL || 'https://xdenker.onrender.com';

export async function apiFetch(endpoint, options = {}) {
    // Se o endpoint já começa com http, usa ele direto; senão, junta com o API_URL
    const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include',
    });
}