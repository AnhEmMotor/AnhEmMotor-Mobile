import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/Theme';
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react-native';

const Toast = forwardRef((props, ref) => {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const translateY = useSharedValue(-150);
  const opacity = useSharedValue(0);

  const topOffset = Math.max(insets.top, 20) + 10;

  const show = (msg, type = 'success', duration = 3500) => {
    let displayMsg = msg;
    if (typeof msg === 'object' && msg !== null) {
      displayMsg = msg.message || msg.error || msg.detail || JSON.stringify(msg);
    } else {
      displayMsg = String(msg || '');
    }
    setMessage(displayMsg);
    setToastType(type);
    translateY.value = withSequence(
      withTiming(topOffset, { duration: 300 }),
      withDelay(duration, withTiming(-150, { duration: 300 }))
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(duration, withTiming(0, { duration: 300 }))
    );
  };

  useImperativeHandle(ref, () => ({
    show,
  }));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const theme = useTheme();

  const getColorAndIcon = () => {
    switch (toastType) {
      case 'error':
        return {
          color: theme.colors.error || '#EF4444',
          borderColor: (theme.colors.error || '#EF4444') + '55',
          bgColor: theme.isDark ? 'rgba(30, 15, 15, 0.95)' : 'rgba(254, 242, 242, 0.98)',
          Icon: AlertCircle,
        };
      case 'warning':
        return {
          color: theme.colors.warning || '#F59E0B',
          borderColor: (theme.colors.warning || '#F59E0B') + '55',
          bgColor: theme.isDark ? 'rgba(30, 25, 10, 0.95)' : 'rgba(254, 252, 232, 0.98)',
          Icon: AlertTriangle,
        };
      case 'info':
        return {
          color: '#3B82F6',
          borderColor: '#3B82F655',
          bgColor: theme.isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(239, 246, 255, 0.98)',
          Icon: Info,
        };
      case 'success':
      default:
        return {
          color: theme.colors.success || '#10B981',
          borderColor: (theme.colors.success || '#10B981') + '55',
          bgColor: theme.isDark ? 'rgba(15, 28, 20, 0.95)' : 'rgba(240, 253, 244, 0.98)',
          Icon: CheckCircle,
        };
    }
  };

  const { color, borderColor, bgColor, Icon } = getColorAndIcon();
  const styles = getStyles(theme);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
        },
        animatedStyle,
      ]}
    >
      <Icon color={color} size={22} style={{ flexShrink: 0 }} />
      <Text style={[styles.text, { color: theme.colors.text }]}>{message}</Text>
    </Animated.View>
  );
});

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 16,
      right: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 9999,
      elevation: 9999,
      borderWidth: 1.5,
      ...Platform.select({
        web: {
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.35)',
        },
        default: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
        },
      }),
    },
    text: {
      marginLeft: 12,
      fontWeight: '600',
      fontSize: 14,
      flex: 1,
      lineHeight: 20,
    },
  });

Toast.displayName = 'Toast';
export default Toast;
