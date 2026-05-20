import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/Theme'; // Import useTheme
import { Inbox, PackageOpen } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = 'Không có dữ liệu', 
  message = 'Hiện tại chưa có dữ liệu để hiển thị.',
  style
}) {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInDown.duration(600)} style={[getStyles(theme).container, style]}>
      <View style={[getStyles(theme).iconCircle, { backgroundColor: theme.colors.primary + '1A' }]}>
        <Icon color={theme.colors.primary} size={48} strokeWidth={1.5} />
      </View>
      <Text style={[getStyles(theme).title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[getStyles(theme).message, { color: theme.colors.subtext }]}>{message}</Text>
    </Animated.View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    minHeight: 300,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    // backgroundColor: 'rgba(59, 130, 246, 0.1)', // Set inline
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    // color: Theme.colors.text, // Set inline
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    // color: Theme.colors.subtext, // Set inline
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  }
});
