export const Theme = {
  colors: {
    primary: '#3B82F6',      // Luxury Blue
    secondary: '#DC2626',    // Deep Crimson
    background: '#090E17',   // Vantablack/Deepest Blue
    card: '#111827',         // Subtle Slate
    surface: '#111827',
    text: '#F8FAFC',         // Ghost White
    subtext: '#94A3B8',      // Slate Gray
    border: 'rgba(255, 255, 255, 0.08)',
    
    // Status colors
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',

    // Glass effects
    glassBg: 'rgba(17, 24, 39, 0.65)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 30,
    full: 999,
  },
  
  shadows: {
    light: {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 2,
    },
    medium: {
      boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.3)',
      elevation: 8,
    },
    heavy: {
      boxShadow: '0px 20px 30px rgba(0, 0, 0, 0.5)',
      elevation: 15,
    },
    primary: {
      boxShadow: '0px 10px 20px rgba(0, 122, 255, 0.4)',
      elevation: 10,
    },
    secondary: {
      boxShadow: '0px 10px 20px rgba(227, 27, 35, 0.4)',
      elevation: 10,
    },
  }
};
