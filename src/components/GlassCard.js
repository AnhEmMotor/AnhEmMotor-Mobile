import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme, useActiveColors } from '../theme/Theme'; // Keep Theme and useActiveColors
import { useRoute } from '@react-navigation/native';

export default function GlassCard({ children, style, contentStyle, intensity = 20, tint }) {
  const activeColors = useActiveColors();

  const evaluatedTint = tint || (activeColors.isDark ? 'dark' : 'light');

  let isNoFrame = false;
  try {
    const route = useRoute();
    if (route && route.name) {
      const adminRoutes = [
        'AdminDashboard',
        'AdminAppointments',
        'AdminOrders',
        'AdminLeads',
        'AdminHub',
        'AdminProfile',
        'AdminInventory',
        'CashFlow',
        'SupportHub'
      ];
      if (adminRoutes.includes(route.name)) {
        isNoFrame = true;
      }
    }
  } catch (e) {
    // Suppress route context error if rendered outside navigation hierarchy
  }

  const flattened = StyleSheet.flatten(style) || {};
  const layoutStyle = {};
  if (flattened.flexDirection) layoutStyle.flexDirection = flattened.flexDirection;
  if (flattened.alignItems) layoutStyle.alignItems = flattened.alignItems;
  if (flattened.justifyContent) layoutStyle.justifyContent = flattened.justifyContent;
  if (flattened.flexWrap) layoutStyle.flexWrap = flattened.flexWrap;

  if (isNoFrame) {
    return (
      <View style={[styles.borderlessContainer, style]}>
        <View style={[styles.borderlessContent, contentStyle, layoutStyle]}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: activeColors.isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.85)', borderColor: activeColors.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }, style]}>
      <BlurView intensity={intensity} tint={tint || (activeColors.isDark ? 'dark' : 'light')} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={activeColors.isDark ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0)'] : ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.content, contentStyle, layoutStyle]}>
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
    width: '100%',
  },
  borderlessContainer: {
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  borderlessContent: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: 0, // Expand content edge-to-edge
    width: '100%',
  },
});
