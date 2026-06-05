import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { useTheme } from '../theme/Theme';
import { CheckCircle } from 'lucide-react-native';

const Toast = forwardRef((props, ref) => {
  const [message, setMessage] = useState('');
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const show = (msg) => {
    setMessage(msg);
    translateY.value = withSequence(
      withSpring(50),
      withDelay(2000, withSpring(-100))
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(2000, withTiming(0, { duration: 300 }))
    );
  };

  useImperativeHandle(ref, () => ({
    show
  }));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value
    };
  });

  const theme = useTheme();
  return (
    <Animated.View style={[getStyles(theme).container, animatedStyle]}>
      <CheckCircle color={theme.colors.success} size={20} />
      <Text style={getStyles(theme).text}>{message}</Text>
    </Animated.View>
  );
});

const getStyles = (theme) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.card, // Use theme.colors.card
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
    borderWidth: 1,
    borderColor: theme.colors.success + '33', // Use theme.colors.success
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10
      }
    })
  },
  text: {
    color: theme.colors.text, // Use theme.colors.text
    marginLeft: 12,
    fontWeight: '600',
    fontSize: 14
  }
});

export default Toast;

