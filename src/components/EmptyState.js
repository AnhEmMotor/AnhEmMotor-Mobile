import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme/Theme';
import { Inbox, PackageOpen } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = 'Không có dữ liệu', 
  message = 'Hiện tại chưa có dữ liệu để hiển thị.',
  style
}) {
  return (
    <Animated.View entering={FadeInDown.duration(600)} style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Icon color={Theme.colors.primary} size={48} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
    minHeight: 300,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  title: {
    color: Theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    color: Theme.colors.subtext,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  }
});
