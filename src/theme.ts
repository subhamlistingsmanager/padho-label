export const Colors = {
    // Brand
    primary: '#00b894',
    primaryDark: '#00916a',
    primaryLight: '#e8f8f4',

    // Grades
    gradeA: '#1b5e20',
    gradeB: '#4caf50',
    gradeC: '#fbc02d',
    gradeD: '#f57c00',
    gradeE: '#d32f2f',

    // Neutrals
    background: '#f8f9fa',
    card: '#ffffff',
    border: '#f1f2f6',
    divider: '#e9ecef',

    // Text
    textPrimary: '#2d3436',
    textSecondary: '#636e72',
    textMuted: '#b2bec3',

    // Semantic
    danger: '#d32f2f',
    success: '#1b5e20',
    warning: '#f57c00',
    info: '#0984e3',
};

export const Typography = {
    h1: { fontSize: 32, fontWeight: '800' as const, color: Colors.textPrimary },
    h2: { fontSize: 24, fontWeight: '700' as const, color: Colors.textPrimary },
    h3: { fontSize: 20, fontWeight: '600' as const, color: Colors.textPrimary },
    body: { fontSize: 16, color: Colors.textPrimary },
    bodySmall: { fontSize: 14, color: Colors.textSecondary },
    caption: { fontSize: 12, color: Colors.textMuted },
    label: {
        fontSize: 12,
        fontWeight: '700' as const,
        color: Colors.textMuted,
        textTransform: 'uppercase' as const,
        letterSpacing: 1,
    },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const Radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
};

export const Shadow = {
    sm: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    md: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    lg: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
};

export const APP_VERSION = '1.0.5';
