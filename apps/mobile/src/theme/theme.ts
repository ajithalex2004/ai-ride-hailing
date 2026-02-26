export const theme = {
    colors: {
        background: '#0A0A0A',
        surface: '#1A1A1A',
        primary: '#00F0FF', // Neon Blue
        secondary: '#FF8A00', // Pulse Orange
        textPrimary: '#FFFFFF',
        textSecondary: '#A3A3A3',
        border: 'rgba(255, 255, 255, 0.1)',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 20,
        pill: 999,
    },
    typography: {
        fontFamily: 'System', // Will use Inter/Outfit if linked
        h1: 32,
        h2: 24,
        body: 16,
        caption: 12,
    },
    effects: {
        glass: {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
        },
        neonShadow: {
            shadowColor: '#00F0FF',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 5,
        }
    }
};
