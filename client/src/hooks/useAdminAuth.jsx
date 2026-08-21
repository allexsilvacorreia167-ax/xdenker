import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('xdenker_admin_token');
        const savedAdmin = localStorage.getItem('xdenker_admin');
        if (savedToken && savedAdmin) {
            try {
                setToken(savedToken);
                setAdmin(JSON.parse(savedAdmin));
            } catch {
                localStorage.removeItem('xdenker_admin_token');
                localStorage.removeItem('xdenker_admin');
            }
        }
        setLoading(false);
    }, []);

    const login = (newToken, adminData) => {
        setToken(newToken);
        setAdmin(adminData);
        localStorage.setItem('xdenker_admin_token', newToken);
        localStorage.setItem('xdenker_admin', JSON.stringify(adminData));
    };

    const logout = () => {
        setToken(null);
        setAdmin(null);
        localStorage.removeItem('xdenker_admin_token');
        localStorage.removeItem('xdenker_admin');
    };

    return (
        <AdminAuthContext.Provider
            value={{ admin, token, login, logout, loading, isAuthenticated: !!token }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth deve ser usado dentro de AdminAuthProvider');
    }
    return context;
}