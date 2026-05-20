import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import { useColorScheme } from 'react-native';
import { useGlobalState } from '../context/GlobalState';

export const Theme = {
  // Static colors that are consistent across themes (e.g., brand colors, status colors)
  staticColors: {
    primary: '#3B82F6',      // Luxury Blue
    secondary: '#DC2626',    // Deep Crimson
    // Status colors
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
  },

  spacing: {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(16),
    lg: moderateScale(24),
    xl: moderateScale(32),
    xxl: moderateScale(40),
  },
  radius: {
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(20),
    xl: moderateScale(30),
    full: 999,
  },

  typography: {
    h1: {
      fontSize: moderateScale(32),
      fontWeight: 'bold',
      lineHeight: moderateScale(40),
    },
    h2: {
      fontSize: moderateScale(24),
      fontWeight: 'bold',
      lineHeight: moderateScale(32),
    },
    h3: {
      fontSize: moderateScale(20),
      fontWeight: '600',
      lineHeight: moderateScale(28),
    },
    bodyLarge: {
      fontSize: moderateScale(18),
      lineHeight: moderateScale(26),
    },
    body: {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(24),
    },
    bodySmall: {
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
    },
    caption: {
      fontSize: moderateScale(12),
      lineHeight: moderateScale(16),
    },
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

// Define palettes as plain objects, logic for selecting them will be in useActiveColors
const darkPalette = {
  background: '#0B0F19',
  card: '#1E293B',
  surface: '#1E293B',
  text: '#F8FAFC',
  subtext: '#94A3B8',
  border: 'rgba(255, 255, 255, 0.06)',
  glassBg: 'rgba(17, 24, 39, 0.65)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  inputBg: 'rgba(255, 255, 255, 0.05)',
  modalOverlay: 'rgba(0, 0, 0, 0.8)',
};

const lightPalette = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#0F172A',
  subtext: '#64748B',
  border: 'rgba(0, 0, 0, 0.08)',
  glassBg: 'rgba(255, 255, 255, 0.8)',
  glassBorder: 'rgba(0, 0, 0, 0.05)',
  inputBg: 'rgba(0, 0, 0, 0.03)',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
};

// Hook to get active colors based on theme mode
export const useActiveColors = () => {
  const globalState = useGlobalState();
  const themeMode = globalState?.themeMode || 'dark';
  const systemScheme = useColorScheme();
  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  const activePalette = isDark ? darkPalette : lightPalette;

  return {
    isDark,
    ...activePalette,
  };
};

// New hook to get the full theme (static + dynamic colors)
export const useTheme = () => {
  const activeDynamicColors = useActiveColors();

  return {
    ...Theme, // Static spacing, radius, typography, shadows, staticColors
    colors: { ...Theme.staticColors, ...activeDynamicColors }, // Combined colors
    isDark: activeDynamicColors.isDark, // Expose isDark directly from useTheme
  };
};
