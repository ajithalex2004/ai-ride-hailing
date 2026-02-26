import { useState } from 'react';

// Simplified Store Mock
export const useAuthStore = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const setAuthData = (userData: any, jwtToken: string) => {
        setUser(userData);
        setToken(jwtToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    return { user, token, setAuthData, logout };
};
