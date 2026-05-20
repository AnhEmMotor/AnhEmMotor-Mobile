import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { Theme, useActiveColors } from '../../theme/Theme';

export default function SuccessScreen({ navigation, route }) {
  const { title, message, target } = route.params || { 
    title: 'Thành công!', 
    message: 'Hệ thống đã ghi nhận yêu cầu của bạn.',
    target: 'Hub'
  };
  const activeColors = useActiveColors();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <CheckCircle2 color={Theme.staticColors.success} size={100} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate(target)}
      >
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}

const DEFAULT_BG = '#0B0F19';
const DEFAULT_CARD = '#1E293B';
const DEFAULT_TEXT = '#F8FAFC';
const DEFAULT_SUBTEXT = '#94A3B8';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DEFAULT_BG, justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.xl },
  iconContainer: { marginBottom: Theme.spacing.lg },
  title: { color: DEFAULT_TEXT, fontSize: 32, fontWeight: 'bold', marginBottom: Theme.spacing.md },
  message: { color: DEFAULT_SUBTEXT, textAlign: 'center', fontSize: 16, lineHeight: 26, marginBottom: 50 },
  button: { backgroundColor: Theme.staticColors.primary, width: '100%', height: 60, borderRadius: Theme.radius.lg, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});