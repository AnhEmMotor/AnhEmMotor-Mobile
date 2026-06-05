import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { Theme, useActiveColors, useTheme } from '../../theme/Theme';

export default function SuccessScreen({ navigation, route }) {
  const { title, message, target } = route.params || { 
    title: 'Thành công!', 
    message: 'Hệ thống đã ghi nhận yêu cầu của bạn.',
    target: 'Hub'
  };
  const activeColors = useActiveColors();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }] }>
      <View style={styles.iconContainer}>
        <CheckCircle2 color={theme.colors.success} size={100} strokeWidth={1.5} />
      </View>
      <Text style={[styles.title, { color: activeColors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: activeColors.subtext }]}>{message}</Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate(target)}
      >
        <Text style={[styles.buttonText, { color: theme.colors.secondary }]}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.xl },
  iconContainer: { marginBottom: Theme.spacing.lg },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: Theme.spacing.md },
  message: { textAlign: 'center', fontSize: 16, lineHeight: 26, marginBottom: 50 },
  button: { width: '100%', height: 60, borderRadius: Theme.radius.lg, justifyContent: 'center', alignItems: 'center' },
  buttonText: { fontSize: 18, fontWeight: 'bold' }
});

