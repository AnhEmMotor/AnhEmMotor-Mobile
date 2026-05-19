import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Theme, useActiveColors } from '../../../theme/Theme';
import { 
  Layers, 
  Wrench, 
  MessageSquare, 
  Truck, 
  DollarSign, 
  User, 
  ChevronRight,
  LayoutGrid
} from 'lucide-react-native';
import GlassCard from '../../../components/GlassCard';
import Animated, { FadeInUp, FadeInDown, FadeInRight } from 'react-native-reanimated';

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  title: { color: colors.text, fontSize: 26, fontWeight: 'bold' },
  subtitle: { color: colors.subtext, fontSize: 13, marginTop: 4 },
  iconBox: { backgroundColor: colors.primary + '1A', width: 44, height: 44, borderRadius: 0, borderWidth: 1, borderColor: colors.primary + '4D', justifyContent: 'center', alignItems: 'center' },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: Theme.spacing.md },
  gridItemWrapper: { width: '48%', marginBottom: 16 },
  gridItemClickable: { flex: 1 },
  menuCard: { padding: 16, height: 165, justifyContent: 'space-between' },
  iconWrapper: { width: 40, height: 40, borderRadius: 0, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  menuTitle: { color: colors.text, fontSize: 14, fontWeight: 'bold' },
  menuDesc: { color: colors.subtext, fontSize: 11, lineHeight: 16, marginTop: 4, opacity: 0.8 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  actionText: { fontSize: 10, fontWeight: 'bold', marginRight: 4, textTransform: 'uppercase' }
});

export default function HubScreen({ navigation }) {
  const colors = useActiveColors();
  const styles = getStyles(colors);

  const menuItems = [
    {
      id: 'inventory',
      title: 'Kho Xe & Phụ Tùng',
      desc: 'Tra cứu ma trận tồn kho, phụ tùng dưới hạn mức.',
      icon: Layers,
      color: '#3B82F6', // Blue
      screen: 'AdminInventory'
    },
    {
      id: 'support',
      title: 'Trung Tâm Khiếu Nại',
      desc: 'Theo dõi SLA phản hồi 2h & đóng hồ sơ 24h.',
      icon: MessageSquare,
      color: '#EF4444', // Red
      screen: 'SupportHub'
    },
    {
      id: 'workshop',
      title: 'Điều Phối Xưởng Dịch Vụ',
      desc: 'Tiến độ sửa chữa 4 chặng của xe thời gian thực.',
      icon: Wrench,
      color: '#10B981', // Green
      screen: 'AdminAppointments'
    },
    {
      id: 'orders',
      title: 'Tiến Độ Đơn Hàng',
      desc: 'Theo dõi hành chính, định vị xe vận chuyển.',
      icon: Truck,
      color: '#8B5CF6', // Purple
      screen: 'AdminOrders'
    },
    {
      id: 'cashflow',
      title: 'Dòng Tiền Showroom',
      desc: 'Theo dõi doanh thu, chi phí & lợi nhuận dòng.',
      icon: DollarSign,
      color: '#F59E0B', // Amber
      screen: 'CashFlow'
    },
    {
      id: 'profile',
      title: 'Trang Cá Nhân Admin',
      desc: 'Thông tin tài khoản quản trị viên và cài đặt.',
      icon: User,
      color: '#EC4899', // Pink
      screen: 'AdminProfile'
    }
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
        <View>
          <Text style={styles.title}>Menu Tiện Ích 🎛️</Text>
          <Text style={styles.subtitle}>Phím tắt điều hành & giám sát showroom</Text>
        </View>
        <View style={styles.iconBox}>
          <LayoutGrid color={colors.primary} size={22} />
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.gridContainer}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Animated.View 
                key={item.id} 
                entering={FadeInRight.delay(index * 80)}
                style={styles.gridItemWrapper}
              >
                <TouchableOpacity 
                  activeOpacity={0.8}
                  style={styles.gridItemClickable}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <GlassCard style={styles.menuCard} intensity={12}>
                    <View style={[styles.iconWrapper, { backgroundColor: item.color + '25', borderColor: item.color + '66' }]}>
                      <IconComponent color={item.color} size={22} />
                    </View>
                    <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuDesc} numberOfLines={2}>{item.desc}</Text>
                    <View style={styles.cardFooter}>
                      <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={[styles.actionText, { color: item.color }]}>Truy cập nhanh</Text>
                      <ChevronRight color={item.color} size={12} />
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
