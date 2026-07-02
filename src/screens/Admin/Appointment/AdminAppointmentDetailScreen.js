import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../../theme/Theme';
import { ChevronLeft, Calendar, Clock, User, Phone, Motorbike } from 'lucide-react-native';

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: colors.subtext,
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default function AdminAppointmentDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  // Mặc định nạp dữ liệu từ item được truyền qua params
  const { appointment } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết lịch hẹn</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {appointment ? (
          <>
            <View style={styles.card}>
              <View style={styles.row}>
                <User color={colors.primary} size={20} />
                <Text style={styles.label}>Khách hàng</Text>
                <Text style={styles.value}>{appointment.customerName}</Text>
              </View>
              <View style={styles.row}>
                <Phone color={colors.primary} size={20} />
                <Text style={styles.label}>Số điện thoại</Text>
                <Text style={styles.value}>{appointment.customerPhone}</Text>
              </View>
              <View style={styles.row}>
                <Motorbike color={colors.primary} size={20} />
                <Text style={styles.label}>Xe quan tâm</Text>
                <Text style={styles.value}>{appointment.vehicleName}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.row}>
                <Calendar color={colors.primary} size={20} />
                <Text style={styles.label}>Ngày hẹn</Text>
                <Text style={styles.value}>{appointment.date || 'Chưa cập nhật'}</Text>
              </View>
              <View style={styles.row}>
                <Clock color={colors.primary} size={20} />
                <Text style={styles.label}>Giờ hẹn</Text>
                <Text style={styles.value}>{appointment.timeSlot || 'Chưa cập nhật'}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => alert('Chức năng đổi lịch đang được phát triển!')}>
              <Text style={styles.buttonText}>Đổi lịch hẹn</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={{ color: colors.text, textAlign: 'center', marginTop: 20 }}>
            Không tìm thấy thông tin lịch hẹn.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
