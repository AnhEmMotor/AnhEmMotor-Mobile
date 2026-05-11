import React, { useEffect } from 'react';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate
} from 'react-native-reanimated';

export default function PulseView({ children, style, pulseScale = 1.05, duration = 1500 }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(pulseScale, { duration: duration / 2 }),
        withTiming(1, { duration: duration / 2 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
