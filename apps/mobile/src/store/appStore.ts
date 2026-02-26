import { useState } from 'react';

export type Role = 'passenger' | 'driver';

export const useAppStore = () => {
    const [role, setRole] = useState<Role>('passenger');
    const [activeScreen, setActiveScreen] = useState<string>('HOME');

    const switchRole = () => {
        const nextRole = role === 'passenger' ? 'driver' : 'passenger';
        setRole(nextRole);
        setActiveScreen('HOME');
    };

    return { role, setRole, activeScreen, setActiveScreen, switchRole };
};
