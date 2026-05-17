import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme, useActiveColors } from '../../../theme/Theme';
import { useGlobalState } from '../../../context/GlobalState';
import { horizontalScale, verticalScale, moderateScale } from '../../../utils/responsive';
import { Bell, Calendar, Wrench, Ticket, QrCode, ArrowRight, ChevronRight, Settings, Car } from 'lucide-react-native';
import GlassCard from '../../../components/GlassCard';
import ScalePress from '../../../components/ScalePress';
import CustomBottomSheet from '../../../components/CustomBottomSheet';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { useHome } from './useHome';
import { shortcuts, alerts, vouchers, promoItems, newsItems } from './constants';

const BANNERS = [
  {
    id: 'b1',
    title: 'Showroom Xe Máy Cao Cấp 5 Sao',
    subtitle: 'Đại lý phân phối chính hãng xe tay ga cao cấp & xe phân khối lớn hàng đầu Việt Nam.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070',
    tag: 'ANHEMMOTOR'
  },
  {
    id: 'b2',
    title: 'Đặc Quyền Mua Sắm Tháng 5',
    subtitle: 'Hỗ trợ trả góp 0% lãi suất, tặng ngay gói phụ kiện trị giá 10 triệu đồng cùng bảo hiểm vật chất.',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070',
    tag: 'ĐẶC QUYỀN VIP'
  },
  {
    id: 'b3',
    title: 'Dịch Vụ Bảo Dưỡng Chuyên Nghiệp',
    subtitle: 'Kỹ thuật viên 10 năm kinh nghiệm cùng công nghệ chuẩn đoán lỗi thông minh đạt chuẩn Quốc tế.',
    image: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?q=80&w=2070',
    tag: 'DỊCH VỤ 5 SAO'
  }
];

/**
 * @file HomeScreen.js
 * @framework React Native (Clean Architecture - Presentation Layer)
 */
export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [activeBanner, setActiveBanner] = useState(0);
  const { 
    unreadNotifications, 
    vehicleStatus, 
    selectedVoucher, 
    bottomSheetRef, 
    handleOpenVoucher,
    handleCloseVoucher
  } = useHome();

  const colors = useActiveColors();
  const { themeMode } = useGlobalState();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. HEADER */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.subtext }]}>Xin chào,</Text>
            <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>Anh Khôi</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ScalePress style={[styles.iconBtn, { backgroundColor: colors.card }]} onPress={() => navigation.navigate('Profile', { openSettings: true })}>
              <Settings color={colors.text} size={moderateScale(20)} />
            </ScalePress>
            <ScalePress style={[styles.iconBtn, { backgroundColor: colors.card }]} onPress={() => navigation.navigate('Notification')}>
              <Bell color={colors.text} size={moderateScale(20)} />
              {unreadNotifications > 0 && (
                <View style={[styles.badge, { borderColor: colors.card }]}>
                  <Text style={styles.badgeText}>{unreadNotifications}</Text>
                </View>
              )}
            </ScalePress>
            <ScalePress style={[styles.iconBtn, { backgroundColor: colors.card }]} onPress={() => navigation.navigate('Profile')}>
              <Image source={{ uri: 'https://img.freepik.com/free-vector/cute-cool-boy-with-glasses-hoodie-pixel-art-style_475147-155.jpg' }} style={styles.avatar} />
            </ScalePress>
          </View>
        </Animated.View>

        {/* MY VEHICLE QUICK ACTION WIDGET */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={{ paddingHorizontal: 20, marginBottom: 15 }}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('MyVehicleDetail')}
          >
            <GlassCard 
              style={{ padding: 15, borderRadius: 16, borderColor: colors.glassBorder, backgroundColor: colors.glassBg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              tint={colors.isDark ? 'dark' : 'light'}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: colors.isDark ? 'rgba(46,91,255,0.15)' : 'rgba(46,91,255,0.08)', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                  <Car color={colors.primary} size={24} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: moderateScale(11), fontWeight: 'bold', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 }}>Xe của tôi ➔</Text>
                  <Text style={{ fontSize: moderateScale(15), fontWeight: 'bold', color: colors.text, marginTop: 2 }}>Honda SH 125i</Text>
                  <Text style={{ fontSize: moderateScale(12), color: colors.subtext, marginTop: 1 }}>Biển số: 60-A1 555.55 • ODO: 12.500 km</Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: colors.isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.08)', borderWidth: 1, borderColor: colors.isDark ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.15)' }}>
                <Text style={{ color: '#10B981', fontSize: 10, fontWeight: 'bold' }}>Hoạt động tốt</Text>
              </View>
            </GlassCard>
          </TouchableOpacity>
        </Animated.View>

        {/* 2. STORE BANNERS CAROUSEL */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.vehicleModule}>
          <View style={[styles.carouselContainer, { backgroundColor: colors.background }]}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const offset = e.nativeEvent.contentOffset.x;
                const index = Math.round(offset / width);
                if (index !== activeBanner) {
                  setActiveBanner(index);
                }
              }}
              scrollEventThrottle={16}
              style={styles.carouselScroll}
            >
              {BANNERS.map((banner) => (
                <View key={banner.id} style={[styles.bannerItem, { width: width }]}>
                  <Image source={{ uri: banner.image }} style={styles.bannerImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(15, 23, 42, 0.95)']}
                    style={styles.bannerGradient}
                  >
                    <View style={styles.bannerBadge}>
                      <Text style={styles.bannerBadgeText}>{banner.tag}</Text>
                    </View>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSub}>{banner.subtitle}</Text>
                  </LinearGradient>
                </View>
              ))}
            </ScrollView>

            {/* Carousel Pagination Dots */}
            <View style={styles.paginationDots}>
              {BANNERS.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.dot, 
                    activeBanner === index ? styles.activeDot : styles.inactiveDot
                  ]} 
                  tint={colors.isDark ? 'dark' : 'light'}
                />
              ))}
            </View>
          </View>

          {/* Quick Shortcuts Grid (Moved below Banner and styled elegantly) */}
          <GlassCard 
            style={[styles.shortcutCard, { borderColor: colors.glassBorder, backgroundColor: colors.glassBg }]}
            tint={colors.isDark ? 'dark' : 'light'}
          >
            <View style={styles.shortcutRowContainer}>
              {shortcuts.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.shortcutItem}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <View style={styles.shortcutIconBg}>
                    <item.icon color={colors.primary} size={moderateScale(20)} />
                  </View>
                  <Text style={[styles.shortcutText, { color: colors.text }]}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* 3. ALERTS */}
        {alerts && alerts.length > 0 && (
          <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.alertModule}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Nhắc nhở quan trọng</Text>
            {alerts.map((alert) => {
              const isCritical = alert.type === 'critical';
              const alertColor = isCritical ? colors.error : colors.warning;
              const bgColor = isCritical 
                ? (colors.isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.06)') 
                : (colors.isDark ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.06)');

              return (
                <TouchableOpacity
                  key={alert.id}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('HomeDetail', { type: 'alert', item: alert })}
                >
                  <GlassCard 
                    style={[styles.alertCard, { borderLeftColor: alertColor, backgroundColor: bgColor, borderColor: colors.glassBorder }]} 
                    contentStyle={styles.alertCardInner}
                    intensity={15}
                    tint={colors.isDark ? 'dark' : 'light'}
                  >
                    <alert.icon color={alertColor} size={moderateScale(20)} strokeWidth={1.5} style={styles.alertIcon} />
                    <View style={styles.alertContent}>
                      <Text style={[styles.alertTitle, { color: colors.text }]}>{alert.title}</Text>
                      <Text style={[styles.alertDesc, { color: colors.subtext }]}>{alert.message}</Text>
                      <View style={styles.alertCta}>
                        <Text style={[styles.alertCtaText, { color: alertColor }]}>{alert.cta}</Text>
                        <ArrowRight color={alertColor} size={moderateScale(12)} strokeWidth={2} style={{ marginLeft: 4 }} />
                      </View>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        )}

        {/* 4. VOUCHERS */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.voucherModule}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Voucher dành riêng cho bạn</Text>
          <View style={styles.voucherGrid}>
            {vouchers.map((voucher) => (
              <ScalePress 
                key={voucher.id} 
                style={styles.voucherCardWrapper} 
                onPress={() => navigation.navigate('HomeDetail', { type: 'voucher', item: voucher })}
              >
                <GlassCard 
                  style={[styles.voucherCard, { borderColor: colors.glassBorder, backgroundColor: colors.glassBg }]} 
                  contentStyle={styles.voucherCardInner}
                  tint={colors.isDark ? 'dark' : 'light'}
                >
                  <View style={styles.voucherTop}>
                    <Ticket color={colors.primary} size={moderateScale(20)} />
                    <QrCode color={colors.subtext} size={moderateScale(20)} />
                  </View>
                  <View style={styles.voucherTextContainer}>
                    <Text style={[styles.voucherTitle, { color: colors.text }]} numberOfLines={2}>{voucher.title}</Text>
                    <Text style={[styles.voucherDesc, { color: colors.subtext }]} numberOfLines={2}>{voucher.desc}</Text>
                  </View>
                </GlassCard>
              </ScalePress>
            ))}
          </View>
        </Animated.View>

        {/* 5. EXPLORE / PROMOTIONS */}
        <Animated.View entering={FadeInDown.duration(600).delay(700)} style={styles.exploreModule}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Khám phá ưu đãi</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Catalog')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.exploreGrid}>
            {promoItems.map((item) => (
              <ScalePress 
                key={item.id} 
                style={styles.exploreItem}
                onPress={() => navigation.navigate('HomeDetail', { type: 'promo', item: item })}
              >
                <Image source={{ uri: item.image }} style={styles.exploreImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(15, 23, 42, 0.9)']}
                  style={styles.exploreGradient}
                >
                  <Text style={[styles.exploreCat, { color: colors.primary }]}>{item.category}</Text>
                  <Text style={styles.exploreTitle} numberOfLines={2}>{item.title}</Text>
                </LinearGradient>
              </ScalePress>
            ))}
          </View>
        </Animated.View>

        {/* 6. BLOG / NEWS */}
        <Animated.View entering={FadeInDown.duration(600).delay(800)} style={styles.blogModule}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tin tức & Đời sống xe</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SavedNews')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          {newsItems.map((news) => (
            <ScalePress 
              key={news.id} 
              style={styles.blogItem}
              onPress={() => navigation.navigate('HomeDetail', { type: 'news', item: news })}
            >
              <GlassCard 
                style={[styles.blogCard, { borderColor: colors.glassBorder, backgroundColor: colors.glassBg }]} 
                contentStyle={styles.blogCardInner}
                tint={colors.isDark ? 'dark' : 'light'}
              >
                <Image source={{ uri: news.image }} style={styles.newsImage} />
                <View style={styles.blogInfo}>
                  <Text style={[styles.blogTitle, { color: colors.text }]} numberOfLines={1}>{news.title}</Text>
                  <Text style={[styles.blogDesc, { color: colors.subtext }]} numberOfLines={2}>{news.desc}</Text>
                  <Text style={[styles.blogMeta, { color: colors.primary }]}>{news.author} • {news.date}</Text>
                </View>
                <ChevronRight color={colors.subtext} size={moderateScale(16)} />
              </GlassCard>
            </ScalePress>
          ))}
        </Animated.View>

        <View style={{ height: verticalScale(100) }} />
      </ScrollView>

      {/* VOUCHER BOTTOM SHEET */}
      {selectedVoucher !== null && (
        <CustomBottomSheet 
          ref={bottomSheetRef} 
          title="Chi tiết ưu đãi"
          onClose={handleCloseVoucher}
          themeMode={themeMode}
        >
          <View style={styles.bsContent}>
            <View style={[styles.qrLargeBox, { backgroundColor: '#FFFFFF' }]}>
              <QrCode color="#000" size={moderateScale(150)} />
            </View>
            <Text style={[styles.bsTitle, { color: colors.text }]}>{selectedVoucher.title}</Text>
            <Text style={[styles.bsDesc, { color: colors.subtext }]}>{selectedVoucher.desc}</Text>
            <View style={[styles.bsCodeBox, { 
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', 
              borderColor: colors.border 
            }]}>
              <Text style={[styles.bsCodeLabel, { color: colors.subtext }]}>MÃ ƯU ĐÃI</Text>
              <Text style={[styles.bsCodeValue, { color: colors.primary }]}>{selectedVoucher.code}</Text>
            </View>
          </View>
        </CustomBottomSheet>
      )}
    </SafeAreaView>
  );
}
