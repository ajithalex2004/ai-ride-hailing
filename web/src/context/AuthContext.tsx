'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole =
    | 'SUPER_ADMIN'
    | 'ADMIN'
    | 'PASSENGER'
    | 'CORPORATE'
    | 'EMS_OPERATOR'
    | 'GOVT_EMS'
    | 'FLEET_ADMIN';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    tenantSlug: string;
    tenantName: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
    role: UserRole;
    tenantSlug: string;
}

// Mock user database — no real backend needed for demo
const MOCK_USERS: Record<string, AuthUser> = {
    'superadmin@exl.com': { id: '1', name: 'Super Admin', email: 'superadmin@exl.com', role: 'SUPER_ADMIN', tenantSlug: 'exl-global', tenantName: 'EXL Solutions HQ' },
    'admin@dubai.gov': { id: '2', name: 'Dubai Admin', email: 'admin@dubai.gov', role: 'ADMIN', tenantSlug: 'dubai-ops', tenantName: 'Dubai Municipality' },
    'passenger@test.com': { id: '3', name: 'John Passenger', email: 'passenger@test.com', role: 'PASSENGER', tenantSlug: 'dubai-ops', tenantName: 'Dubai Municipality' },
    'corporate@acme.com': { id: '4', name: 'Corporate Manager', email: 'corporate@acme.com', role: 'CORPORATE', tenantSlug: 'acme-corp', tenantName: 'ACME Corporation' },
    'ems@dha.gov': { id: '5', name: 'EMS Dispatcher', email: 'ems@dha.gov', role: 'EMS_OPERATOR', tenantSlug: 'dha-ems', tenantName: 'Dubai Health Authority' },
    'fleet@rta.gov': { id: '6', name: 'Fleet Manager', email: 'fleet@rta.gov', role: 'FLEET_ADMIN', tenantSlug: 'rta-traffic', tenantName: 'RTA' },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SESSION_KEY = 'ai_os_session';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem(SESSION_KEY); }
        }
        setIsLoading(false);
    }, []);

    const login = async ({ email, password, role }: LoginCredentials) => {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));

        // Accept any password in demo mode; match by email
        const mockUser = MOCK_USERS[email.toLowerCase()];
        const finalUser: AuthUser = mockUser ?? {
            id: Date.now().toString(),
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            email,
            role,
            tenantSlug: 'dubai-ops',
            tenantName: 'Dubai Municipality',
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(finalUser));
        setUser(finalUser);
    };

    const logout = () => {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

// Role → redirect destination after login
export const ROLE_HOME: Record<UserRole, string> = {
    SUPER_ADMIN: '/admin/governance',
    ADMIN: '/admin',
    PASSENGER: '/',
    CORPORATE: '/',
    EMS_OPERATOR: '/admin/emergency',
    GOVT_EMS: '/admin/emergency',
    FLEET_ADMIN: '/admin/fleet',
};
