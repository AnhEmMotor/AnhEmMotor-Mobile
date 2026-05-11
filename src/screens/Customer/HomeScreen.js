import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Theme } from '../../theme/Theme';
import { Bell, Zap, Calendar, Gauge, AlertCircle, ChevronRight } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';
import PulseView from '../../components/PulseView';
import { useGlobalState } from '../../context/GlobalState';

export default function HomeScreen({ navigation }) {
  const { unreadNotifications } = useGlobalState();
  
  const vouchers = [
    { id: '1', title: 'Giảm 10% Thay Nhớt', code: 'AE-OIL10', type: 'Service' },
    { id: '2', title: 'Tặng Voucher 500k', code: 'AE-NEW500', type: 'Purchase' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* I.1 HEADER (STRATEGY: PERSONALIZED HUB) */}
      <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Chào Anh Em! 👋</Text>
          <Text style={styles.userName}>Nguyễn Khôi</Text>
        </View>
        <ScalePress 
          style={styles.profileIcon}
          onPress={() => navigation.navigate('ProfileEdit')}
        >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080' }} 
              style={styles.avatar} 
              resizeMode="cover"
            />
        </ScalePress>
      </Animated.View>

      {/* I.1 PRIORITY ALERTS (GHIM TẠI TRANG CHỦ) */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.alertBox}>
        <PulseView>
          <LinearGradient
            colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
            style={styles.priorityAlert}
          >
            <AlertCircle color={Theme.colors.secondary} size={20} />
            <Text style={styles.alertText}>Bảo hiểm xe Z1000 sẽ hết hạn trong 5 ngày tới!</Text>
          </LinearGradient>
        </PulseView>
      </Animated.View>

      {/* I.1 MODULE HỒ SƠ XE (SỨC KHỎE XE) */}
      <Animated.View entering={FadeInDown.delay(300)} style={styles.healthModule}>
        <GlassCard style={styles.healthCard} intensity={20}>
          <View style={styles.healthHeader}>
            <View>
              <Text style={styles.bikeName}>Kawasaki Z1000</Text>
              <Text style={styles.bikePlate}>59-A3 123.45</Text>
            </View>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070' }} 
              style={styles.bikeThumb} 
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.healthStats}>
            <View style={styles.statItem}>
              <Gauge color={Theme.colors.primary} size={18} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.statValue}>12,500 <Text style={styles.statUnit}>km</Text></Text>
                <Text style={styles.statLabel}>ODO hiện tại</Text>
              </View>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statItem}>
              <Calendar color={Theme.colors.warning} size={18} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.statValue}>12 <Text style={styles.statUnit}>ngày</Text></Text>
                <Text style={styles.statLabel}>Đến kỳ bảo dưỡng</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.bookingBtn}
            onPress={() => navigation.navigate('Booking')}
          >
            <LinearGradient
              colors={[Theme.colors.primary, '#1E3A8A']}
              style={styles.bookingGradient}
            >
              <Text style={styles.bookingText}>Đặt lịch bảo trì ngay</Text>
              <ChevronRight color="#fff" size={18} />
            </LinearGradient>
          </TouchableOpacity>
        </GlassCard>
      </Animated.View>

      {/* I.1 KHUYẾN MÃI & VOUCHER SLIDER */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ưu đãi độc quyền 🎁</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoSlider}>
          <GlassCard style={styles.promoBanner}>
            <LinearGradient
              colors={['#1E293B', '#0F172A']}
              style={styles.bannerContent}
            >
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>THÁNG VÀNG GIẢM GIÁ</Text>
                <Text style={styles.bannerDesc}>Giảm 50% tiền công sửa chữa cho xe phân phối lớn.</Text>
              </View>
              <Zap color={Theme.colors.secondary} size={40} style={styles.bannerIcon} />
            </LinearGradient>
          </GlassCard>
          
          {vouchers.map((v) => (
            <TouchableOpacity key={v.id} style={styles.voucherCard}>
              <View style={styles.voucherIcon}>
                <Zap color={Theme.colors.warning} size={20} />
              </View>
              <View style={styles.voucherInfo}>
                <Text style={styles.voucherTitle}>{v.title}</Text>
                <Text style={styles.voucherCode}>{v.code}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  welcomeText: { color: Theme.colors.subtext, fontSize: 16 },
  userName: { color: Theme.colors.text, fontSize: 28, fontWeight: 'bold' },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: Theme.colors.primary },

  alertBox: { marginBottom: Theme.spacing.lg },
  priorityAlert: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  alertText: { color: Theme.colors.text, fontSize: 13, marginLeft: 12, fontWeight: '500' },

  healthModule: { marginBottom: Theme.spacing.xl },
  healthCard: { padding: 20 },
  healthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  bikeName: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold' },
  bikePlate: { color: Theme.colors.subtext, fontSize: 14, marginTop: 4 },
  bikeThumb: { width: 100, height: 60 },
  
  healthStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24, backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16 },
  statItem: { flexDirection: 'row', alignItems: 'center' },
  statValue: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  statUnit: { fontSize: 12, fontWeight: 'normal', color: Theme.colors.subtext },
  statLabel: { color: Theme.colors.subtext, fontSize: 10, marginTop: 2 },
  verticalDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.1)' },

  bookingBtn: { height: 56, borderRadius: 16, overflow: 'hidden' },
  bookingGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  bookingText: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginRight: 8 },

  section: { marginTop: Theme.spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold' },
  seeAll: { color: Theme.colors.primary, fontSize: 14 },

  promoSlider: { marginBottom: Theme.spacing.lg },
  promoBanner: { width: 300, height: 160, padding: 0, marginRight: 16, overflow: 'hidden' },
  bannerContent: { flex: 1, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerText: { flex: 1 },
  bannerTitle: { color: Theme.colors.secondary, fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  bannerDesc: { color: '#fff', fontSize: 13, marginTop: 8, opacity: 0.8 },
  bannerIcon: { opacity: 0.2 },

  voucherCard: { width: 180, height: 160, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  voucherIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(245, 158, 11, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  voucherTitle: { color: Theme.colors.text, fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  voucherCode: { color: Theme.colors.subtext, fontSize: 11, marginTop: 4 }
});


