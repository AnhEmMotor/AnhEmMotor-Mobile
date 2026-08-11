import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActiveColors } from '../../theme/Theme';
import { CheckCircle } from 'lucide-react-native';

export default function OrderSuccessScreen({ navigation }) {
  const activeColors = useActiveColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]}>
      <View style={styles.content}>
        <CheckCircle color={activeColors.primary} size={80} />
        <Text style={[styles.title, { color: activeColors.text }]}>Đặt hàng thành công!</Text>
        <Text style={[styles.subtitle, { color: activeColors.subtext }]}>
          Cảm ơn bạn đã mua sắm tại AnhEmMotor. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: activeColors.primary }]}
          onPress={() => navigation.navigate('Catalog')}
        >
          <Text style={styles.btnText}>Tiếp tục mua sắm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnOutline, { borderColor: activeColors.border }]}
          onPress={() => navigation.navigate('CustomerHome', { screen: 'Profile' })}
        >
          <Text style={[styles.btnOutlineText, { color: activeColors.text }]}>Về trang cá nhân</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    padding: 24,
  },
  btn: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  btnOutline: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOutlineText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
