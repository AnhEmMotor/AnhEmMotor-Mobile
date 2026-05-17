import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme, useActiveColors } from '../theme/Theme';

export default function GlassCard({ children, style, contentStyle, intensity = 20, tint }) {
  const activeColors = useActiveColors();
  const isDark = activeColors.isDark;
  
  const evaluatedTint = tint || (isDark ? 'dark' : 'light');
  const fallbackBg = isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.85)';
  const borderCol = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <View style={[styles.container, { backgroundColor: fallbackBg, borderColor: borderCol }, style]}>
      <BlurView intensity={intensity} tint={evaluatedTint} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={isDark ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0)'] : ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  content: {
    padding: Theme.spacing.md,
  },
});

