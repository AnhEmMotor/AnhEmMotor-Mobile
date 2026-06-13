import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import { useColorScheme } from 'react-native';
import { useGlobalState } from '../context/GlobalState';

export const Theme = {
  // Static colors that are consistent across themes (e.g., brand colors, status colors)
  staticColors: {
    primary: '#E31B23',      // AnhEmMotor Red
    secondary: '#FFFFFF',    // White accent for brand
    // Status colors
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#F8FAFC',
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
      boxShadow: '0px 10px 20px rgba(227, 27, 35, 0.4)',
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
  background: '#050505', // Deep black brand background
  card: '#111111',
  surface: '#1C1C1C',
  text: '#F8FAFC',
  subtext: '#E5E7EB',
  border: 'rgba(255, 255, 255, 0.14)',
  glassBg: 'rgba(20, 20, 20, 0.78)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  inputBg: 'rgba(255, 255, 255, 0.08)',
  modalOverlay: 'rgba(0, 0, 0, 0.92)',
};

const lightPalette = {
  background: '#FFFFFF', // Clean white theme
  card: '#F8FAFC',
  surface: '#E5E7EB',
  text: '#111827',
  subtext: '#475569',
  border: 'rgba(0, 0, 0, 0.12)',
  glassBg: 'rgba(255, 255, 255, 0.92)',
  glassBorder: 'rgba(0, 0, 0, 0.08)',
  inputBg: 'rgba(0, 0, 0, 0.05)',
  modalOverlay: 'rgba(0, 0, 0, 0.6)',
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
    ...Theme.staticColors,
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
