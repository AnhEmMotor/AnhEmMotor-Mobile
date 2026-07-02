import React, { useEffect, useRef } from 'react';
import { Animated, Platform } from 'react-native';
import { useActiveColors } from '../theme/Theme';

export default function Skeleton({ width, height, borderRadius = 10 }) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const activeColors = useActiveColors();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: Platform.OS !== 'web' }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={[{ width, height, borderRadius, backgroundColor: activeColors.card, opacity }]} 
    />
  );
}
