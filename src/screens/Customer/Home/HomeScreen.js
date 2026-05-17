import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../../theme/Theme';
import { horizontalScale, verticalScale, moderateScale } from '../../../utils/responsive';
import { Bell, Calendar, Wrench, Ticket, QrCode, ArrowRight, ChevronRight } from 'lucide-react-native';
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. HEADER */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Xin chào,</Text>
            <Text style={styles.userName} numberOfLines={1}>Anh Khôi</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ScalePress style={styles.iconBtn} onPress={() => navigation.navigate('Notification')}>
              <Bell color={Theme.colors.text} size={moderateScale(22)} />
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

        {/* 2. STORE BANNERS CAROUSEL */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.vehicleModule}>
          <View style={styles.carouselContainer}>
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
                />
              ))}
            </View>
          </View>

          {/* Quick Shortcuts Grid (Moved below Banner and styled elegantly) */}
          <GlassCard style={styles.shortcutCard}>
            <View style={styles.shortcutRowContainer}>
              {shortcuts.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.shortcutItem}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <View style={styles.shortcutIconBg}>
                    <item.icon color={Theme.colors.primary} size={moderateScale(20)} />
                  </View>
                  <Text style={styles.shortcutText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* 3. ALERTS */}
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
                  style={[styles.alertCard, { borderLeftColor: alertColor, backgroundColor: bgColor }]} 
                  contentStyle={styles.alertCardInner}
                  intensity={15}
                >
                  <alert.icon color={alertColor} size={moderateScale(20)} strokeWidth={1.5} style={styles.alertIcon} />
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertDesc}>{alert.message}</Text>
                    <ScalePress style={styles.alertCta}>
                      <Text style={[styles.alertCtaText, { color: alertColor }]}>{alert.cta}</Text>
                      <ArrowRight color={alertColor} size={moderateScale(12)} strokeWidth={2} />
                    </ScalePress>
                  </View>
                </GlassCard>
              );
            })}
          </Animated.View>
        )}

        {/* 4. VOUCHERS */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.voucherModule}>
          <Text style={styles.sectionTitle}>Voucher dành riêng cho bạn</Text>
          <View style={styles.voucherGrid}>
            {vouchers.map((voucher) => (
              <ScalePress key={voucher.id} style={styles.voucherCardWrapper} onPress={() => handleOpenVoucher(voucher)}>
                <GlassCard style={styles.voucherCard} contentStyle={styles.voucherCardInner}>
                  <View style={styles.voucherTop}>
                    <Ticket color={Theme.colors.primary} size={moderateScale(20)} />
                    <QrCode color={Theme.colors.subtext} size={moderateScale(20)} />
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

        {/* 5. EXPLORE / PROMOTIONS */}
        <Animated.View entering={FadeInDown.duration(600).delay(700)} style={styles.exploreModule}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Khám phá ưu đãi</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Catalog')}>
              <Text style={styles.viewAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.exploreGrid}>
            {promoItems.map((item) => (
              <ScalePress key={item.id} style={styles.exploreItem}>
                <Image source={{ uri: item.image }} style={styles.exploreImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(15, 23, 42, 0.9)']}
                  style={styles.exploreGradient}
                >
                  <Text style={styles.exploreCat}>{item.category}</Text>
                  <Text style={styles.exploreTitle} numberOfLines={2}>{item.title}</Text>
                </LinearGradient>
              </ScalePress>
            ))}
          </View>
        </Animated.View>

        {/* 6. BLOG / NEWS */}
        <Animated.View entering={FadeInDown.duration(600).delay(800)} style={styles.blogModule}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tin tức & Đời sống xe</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          {newsItems.map((news) => (
            <ScalePress key={news.id} style={styles.blogItem}>
              <GlassCard style={styles.blogCard} contentStyle={styles.blogCardInner}>
                <Image source={{ uri: news.image }} style={styles.newsImage} />
                <View style={styles.blogInfo}>
                  <Text style={styles.blogTitle} numberOfLines={1}>{news.title}</Text>
                  <Text style={styles.blogDesc} numberOfLines={2}>{news.desc}</Text>
                  <Text style={styles.blogMeta}>{news.author} • {news.date}</Text>
                </View>
                <ChevronRight color={Theme.colors.subtext} size={moderateScale(16)} />
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
        >
          <View style={styles.bsContent}>
            <View style={styles.qrLargeBox}>
              <QrCode color="#000" size={moderateScale(150)} />
            </View>
            <Text style={styles.bsTitle}>{selectedVoucher.title}</Text>
            <Text style={styles.bsDesc}>{selectedVoucher.desc}</Text>
            <View style={styles.bsCodeBox}>
              <Text style={styles.bsCodeLabel}>MÃ ƯU ĐÃI</Text>
              <Text style={styles.bsCodeValue}>{selectedVoucher.code}</Text>
            </View>
          </View>
        </CustomBottomSheet>
      )}
    </SafeAreaView>
  );
}
