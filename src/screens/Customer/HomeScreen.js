import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../theme/Theme';
import { Bell, Calendar, Wrench, AlertTriangle, ShieldAlert, Ticket, QrCode, ArrowRight } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import ScalePress from '../../components/ScalePress';
import CustomBottomSheet from '../../components/CustomBottomSheet';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useGlobalState } from '../../context/GlobalState';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  // Lấy state đếm số thông báo mới từ Context
  const { unreadNotifications } = useGlobalState();
  
  // Trạng thái mô phỏng 2 kịch bản của Dynamic State Module
  // Đổi thành 'waiting_delivery' để test thanh tiến độ nhận xe
  const [vehicleStatus, setVehicleStatus] = useState('has_vehicle'); 

  const bottomSheetRef = useRef(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const alerts = [
    { 
      id: 1, 
      type: 'warning', 
      icon: ShieldAlert, 
      title: 'Hết hạn bảo hiểm',
      message: 'Xe 60-A1 555.55 sắp hết hạn bảo hiểm vào ngày 20/05.',
      cta: 'Gia hạn bảo hiểm'
    },
    { 
      id: 2, 
      type: 'critical', 
      icon: AlertTriangle, 
      title: 'Thay thế phụ tùng',
      message: 'Lọc gió xe SH 125i đã đến kỳ thay thế theo khuyến nghị.',
      cta: 'Đặt lịch sửa chữa'
    }
  ];

  const promos = [
    { id: 1, title: 'Ra mắt Honda SH 2024', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070' },
    { id: 2, title: 'Tuần lễ tri ân khách hàng', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070' }
  ];

  const vouchers = [
    { id: 1, title: 'Giảm 20% Dầu Nhớt', desc: 'Áp dụng tại mọi Showroom', code: 'NHOT20' },
    { id: 2, title: 'Tặng Nón Bảo Hiểm', desc: 'Khi mua phụ kiện trên 1 triệu', code: 'NONBH' }
  ];

  const handleOpenVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    bottomSheetRef.current?.show();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. HEADER (Thanh đầu trang) */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Xin chào,</Text>
            <Text style={styles.userName} numberOfLines={1}>Anh Khôi</Text>
          </View>
          <View style={styles.headerRight}>
            <ScalePress style={styles.iconBtn} onPress={() => navigation.navigate('Notification')}>
              <Bell color={Theme.colors.text} size={22} />
              {unreadNotifications > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadNotifications}</Text>
                </View>
              )}
            </ScalePress>
            <ScalePress style={styles.iconBtn} onPress={() => navigation.navigate('ProfileScreen')}>
              <Image source={{ uri: 'https://img.freepik.com/free-vector/cute-cool-boy-with-glasses-hoodie-pixel-art-style_475147-155.jpg' }} style={styles.avatar} />
            </ScalePress>
          </View>
        </Animated.View>

        {/* 2. DYNAMIC STATE MODULE (Hồ sơ xe / Tiến độ) */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.vehicleModule}>
          {vehicleStatus === 'has_vehicle' ? (
            <GlassCard style={styles.vehicleCard}>
              <View style={styles.vehicleHeader}>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName} numberOfLines={1}>Honda SH 125i</Text>
                  <Text style={styles.vehiclePlate}>60-A1 555.55</Text>
                </View>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070' }} style={styles.vehicleImage} />
              </View>
              
              <View style={styles.vehicleStats}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>ODO Hiện tại</Text>
                  <Text style={styles.statValue}>15,200 km</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Bảo dưỡng sau</Text>
                  <Text style={[styles.statValue, { color: Theme.colors.warning }]}>300 km (15 ngày)</Text>
                </View>
              </View>

              <View style={styles.vehicleActions}>
                <ScalePress style={styles.primaryBtn} onPress={() => navigation.navigate('Booking')}>
                  <Calendar color="#fff" size={18} />
                  <Text style={styles.primaryBtnText}>Đặt lịch ngay</Text>
                </ScalePress>
                <ScalePress style={styles.secondaryBtn} onPress={() => navigation.navigate('Invoice')}>
                  <Wrench color={Theme.colors.primary} size={18} />
                  <Text style={styles.secondaryBtnText}>Lịch sử xe</Text>
                </ScalePress>
              </View>
            </GlassCard>
          ) : (
            <GlassCard style={styles.deliveryCard}>
              <LinearGradient colors={['rgba(59, 130, 246, 0.2)', 'transparent']} style={StyleSheet.absoluteFill} />
              <Text style={styles.deliveryTitle}>Tiến độ nhận xe mới</Text>
              <Text style={styles.deliveryVehicle}>Kawasaki Z1000 - Đen nhám</Text>
              
              <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: '70%' }]} />
              </View>
              <View style={styles.progressStatus}>
                <Text style={styles.progressStep}>Đang làm biển số tại Biên Hòa</Text>
                <Text style={styles.progressEstimate}>Dự kiến giao: 2 ngày nữa</Text>
              </View>
            </GlassCard>
          )}
        </Animated.View>

        {/* 3. PRIORITY ALERTS (Nhắc nhở quan trọng - Tự động ẩn nếu trống) */}
        {alerts && alerts.length > 0 && (
          <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.alertModule}>
            <Text style={styles.sectionTitle}>Nhắc nhở quan trọng</Text>
            {alerts.map((alert) => {
              const isCritical = alert.type === 'critical';
              const alertColor = isCritical ? Theme.colors.error : Theme.colors.warning;
              const bgColor = isCritical ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)';

              return (
                <GlassCard 
                  key={alert.id} 
                  style={[
                    styles.alertCard, 
                    { borderLeftColor: alertColor, backgroundColor: bgColor }
                  ]} 
                  intensity={15}
                >
                  <alert.icon color={alertColor} size={22} strokeWidth={1.5} style={styles.alertIcon} />
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertDesc}>{alert.message}</Text>
                    <ScalePress style={styles.alertCta}>
                      <Text style={[styles.alertCtaText, { color: alertColor }]}>{alert.cta}</Text>
                      <ArrowRight color={alertColor} size={14} strokeWidth={2} />
                    </ScalePress>
                  </View>
                </GlassCard>
              );
            })}
          </Animated.View>
        )}

        {/* 4. PROMOTIONS & VOUCHERS (Khuyến mãi & Voucher dạng lưới 2 cột dọc) */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.promoModule}>
          <Text style={styles.sectionTitle}>Khuyến mãi nổi bật</Text>
          <View style={styles.promoGrid}>
            {promos.map((promo) => (
              <ScalePress key={promo.id} style={styles.promoBanner}>
                <Image source={{ uri: promo.image }} style={styles.promoImage} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.promoGradient}>
                  <Text style={styles.promoTitle} numberOfLines={2}>{promo.title}</Text>
                </LinearGradient>
              </ScalePress>
            ))}
          </View>

          <View style={styles.voucherHeader}>
            <Text style={styles.sectionTitle}>Voucher dành riêng cho bạn</Text>
          </View>
          <View style={styles.voucherGrid}>
            {vouchers.map((voucher) => (
              <ScalePress key={voucher.id} style={styles.voucherCardWrapper} onPress={() => handleOpenVoucher(voucher)}>
                <GlassCard style={styles.voucherCard}>
                  <View style={styles.voucherTop}>
                    <Ticket color={Theme.colors.primary} size={20} />
                    <QrCode color={Theme.colors.subtext} size={20} />
                  </View>
                  <View style={styles.voucherTextContainer}>
                    <Text style={styles.voucherTitle} numberOfLines={2}>{voucher.title}</Text>
                    <Text style={styles.voucherDesc} numberOfLines={2}>{voucher.desc}</Text>
                  </View>
                </GlassCard>
              </ScalePress>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* VOUCHER BOTTOM SHEET */}
      <CustomBottomSheet ref={bottomSheetRef} title="Chi tiết ưu đãi">
        {selectedVoucher && (
          <View style={styles.bsContent}>
            <View style={styles.qrLargeBox}>
              <QrCode color="#000" size={150} />
            </View>
            <Text style={styles.bsTitle}>{selectedVoucher.title}</Text>
            <Text style={styles.bsDesc}>{selectedVoucher.desc}</Text>
            <View style={styles.bsCodeBox}>
              <Text style={styles.bsCodeLabel}>MÃ ƯU ĐÃI</Text>
              <Text style={styles.bsCodeValue}>{selectedVoucher.code}</Text>
            </View>
          </View>
        )}
      </CustomBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerLeft: { flex: 1, paddingRight: 15 },
  greeting: { color: Theme.colors.subtext, fontSize: 14 },
  userName: { color: Theme.colors.text, fontSize: 22, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Theme.colors.card, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: Theme.colors.primary },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: Theme.colors.error, minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Theme.colors.card },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  vehicleModule: { marginBottom: 30 },
  vehicleCard: { padding: 20, borderRadius: 24 },
  vehicleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  vehicleInfo: { flex: 1, paddingRight: 10 },
  vehicleName: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold' },
  vehiclePlate: { color: Theme.colors.primary, fontSize: 16, fontWeight: '600', marginTop: 4 },
  vehicleImage: { width: 100, height: 70, borderRadius: 12, resizeMode: 'cover' },
  vehicleStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, marginBottom: 20 },
  statBox: { flex: 1 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 15 },
  statLabel: { color: Theme.colors.subtext, fontSize: 12, marginBottom: 4 },
  statValue: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold' },
  vehicleActions: { flexDirection: 'row', justifyContent: 'space-between' },
  primaryBtn: { flex: 1, flexDirection: 'row', backgroundColor: Theme.colors.primary, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
  secondaryBtn: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(59, 130, 246, 0.1)', height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  secondaryBtnText: { color: Theme.colors.primary, fontWeight: 'bold', marginLeft: 8 },
  deliveryCard: { padding: 24, borderRadius: 24, overflow: 'hidden' },
  deliveryTitle: { color: Theme.colors.subtext, fontSize: 14, marginBottom: 4 },
  deliveryVehicle: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  progressTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  progressBar: { height: '100%', backgroundColor: Theme.colors.success, borderRadius: 4 },
  progressStatus: { flexDirection: 'row', justifyContent: 'space-between' },
  progressStep: { color: Theme.colors.text, fontSize: 13, flex: 1 },
  progressEstimate: { color: Theme.colors.success, fontSize: 13, fontWeight: 'bold' },
  alertModule: { marginBottom: 30 },
  sectionTitle: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  alertCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, marginBottom: 12, borderLeftWidth: 3 },
  alertIcon: { marginTop: 2 },
  alertContent: { flex: 1, marginLeft: 12 },
  alertTitle: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  alertDesc: { color: Theme.colors.subtext, fontSize: 13, lineHeight: 18, marginBottom: 10 },
  alertCta: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' },
  alertCtaText: { fontSize: 13, fontWeight: 'bold', marginRight: 4 },
  promoModule: { marginBottom: 20 },
  promoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  promoBanner: { width: '48%', height: 140, borderRadius: 16, overflow: 'hidden', marginBottom: 15 },
  promoImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  promoGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, justifyContent: 'flex-end', padding: 12 },
  promoTitle: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  voucherHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 15 },
  voucherGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  voucherCardWrapper: { width: '48%', marginBottom: 15 },
  voucherCard: { padding: 16, borderRadius: 16, height: '100%' },
  voucherTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  voucherTextContainer: { flex: 1 },
  voucherTitle: { color: Theme.colors.text, fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  voucherDesc: { color: Theme.colors.subtext, fontSize: 12, lineHeight: 16 },
  bsContent: { alignItems: 'center', paddingVertical: 20 },
  qrLargeBox: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 20 },
  bsTitle: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  bsDesc: { color: Theme.colors.subtext, fontSize: 14, textAlign: 'center', marginBottom: 30, paddingHorizontal: 20 },
  bsCodeBox: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', width: '100%' },
  bsCodeLabel: { color: Theme.colors.subtext, fontSize: 12, marginBottom: 4, letterSpacing: 1 },
  bsCodeValue: { color: Theme.colors.primary, fontSize: 24, fontWeight: '900', letterSpacing: 2 }
});