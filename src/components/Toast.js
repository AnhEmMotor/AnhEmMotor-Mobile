import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { Theme } from '../theme/Theme';
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

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <CheckCircle color={Theme.colors.success} size={20} />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
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
    color: '#fff',
    marginLeft: 12,
    fontWeight: '600',
    fontSize: 14
  }
});

export default Toast;
