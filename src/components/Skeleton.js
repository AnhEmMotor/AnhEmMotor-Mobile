import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function Skeleton({ width, height, borderRadius = 10 }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={[{ width, height, borderRadius, backgroundColor: '#334155', opacity }]} 
    />
  );
}