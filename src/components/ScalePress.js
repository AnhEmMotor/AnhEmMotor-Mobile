import React from 'react';
import { Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const setScaleValue = (sharedValue, val) => {
  sharedValue.value = val;
};

export default function ScalePress({ children, onPress, style, activeScale = 0.95 }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScaleValue(scale, withSpring(activeScale, { damping: 10, stiffness: 200 }));
  };

  const onPressOut = () => {
    setScaleValue(scale, withSpring(1, { damping: 10, stiffness: 200 }));
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

