import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActiveColors } from '../../../theme/Theme';
import { useGlobalState } from '../../../context/GlobalState';
import { verticalScale, moderateScale } from '../../../utils/responsive';
import { Bell, AlertTriangle, ShieldAlert, Settings,
  Ticket, QrCode, ArrowRight,
  HelpCircle, ChevronRight, Book, List, Droplets
} from 'lucide-react-native';
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
  },
  {
    id: 'b4',
    title: 'Xe Máy Điện - Xanh Cho Tương Lai',
    subtitle: 'Bộ sưu tập xe máy điện thông minh với công nghệ pin tiên tiến, thân thiện môi trường và tiết kiệm chi phí.',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=2070',
    tag: 'XE ĐIỆN'
  },
  {
    id: 'b5',
    title: 'Phụ Kiện Chính Hãng Giá Tốt',
    subtitle: 'Đa dạng phụ kiện chính hãng: nắp bình xăng, yên xe, gương, phuộc, và đồ chơi xe cao cấp.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070',
    tag: 'PHỤ KIỆN'
  },
  {
    id: 'b6',
    title: 'Ưu Đãi Đặc Biệt Cuối Tuần',
    subtitle: 'Giảm ngay lên đến 15% cho 50 khách hàng đầu tiên - Áp dụng cho mọi dòng xe trong showroom.',
    image: 'https://images.unsplash.com/photo-1568772585407-e3b87e6104c9?q=80&w=2070',
    tag: 'ƯU ĐÃI'
  },
  {
    id: 'b7',
    title: 'Xe Ga Động Cơ Mới - Công Nghệ 2025',
    subtitle: 'Tương lai di chuyển bắt đầu từ đây với động cơ mạnh mẽ, tiết kiệm nhiên liệu và thân thiện môi trường.',
    image: 'https://images.unsplash.com/photo-1568772585407-e3b87e6104c9?q=80&w=2070',
    tag: 'CÔNG NGHỆ MỚI'
  },
  {
    id: 'b8',
    title: 'Bảo Hiểm Xe Máy Toàn Diện',
    subtitle: 'Bảo vệ xe của bạn với gói bảo hiểm toàn diện, hỗ trợ 24/7, quy trình bồi thường nhanh chóng.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070',
    tag: 'BẢO HIỂM'
  },
  {
    id: 'b9',
    title: 'Thuê Xe Máy Dịch Vụ Cao Cấp',
    subtitle: 'Dịch vụ thuê xe máy linh hoạt - giá tốt, xe mới, bảo dưỡng đầy đủ, giao xe tận nơi.',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070',
    tag: 'THUÊ XE'
  },
  {
    id: 'b10',
    title: 'Đồng Hồ Thông Minh Cho Xe Máy',
    subtitle: 'Công nghệ theo dõi sức khỏe xe, định vị thời gian thực, cảnh báo va chạm và lịch sử hành trình chi tiết.',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=2070',
    tag: 'SMART DEVICE'
  }
];

/**
 * @file HomeScreen.js
 * @framework React Native (Clean Architecture - Presentation Layer)
 */
export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [activeBanner, setActiveBanner] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { 
    unreadNotifications, 
// eslint-disable-next-line no-unused-vars
    _vehicleStatus, 
    selectedVoucher, 
    bottomSheetRef, 
// eslint-disable-next-line no-unused-vars
    _handleOpenVoucher,
    handleCloseVoucher,
    userName,
    newsList
  } = useHome();

  const colors = useActiveColors();
  const { themeMode, setSettingsOpen } = useGlobalState();

  // Carousel configuration - show 2-3 images with peek effect
  const BANNER_WIDTH = width * 0.78; // Each banner takes 78% of screen width
  const BANNER_SPACING = 12; // Spacing between banners
  const BANNER_PADDING = (width - BANNER_WIDTH) / 2; // Center the first banner

  const scrollViewRef = useRef(null);
  const intervalRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
  const isSnappingRef = useRef(false);
  const isUserInitiatedRef = useRef(false);

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveBanner((prev) => (prev + 1) % BANNERS.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying]);

  // Snap to nearest banner after momentum scroll ends
  const handleMomentumEnd = (e) => {
    if (isSnappingRef.current) return;
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / (BANNER_WIDTH + BANNER_SPACING));
    const clampedIndex = Math.min(Math.max(index, 0), BANNERS.length - 1);
    setActiveBanner(clampedIndex);
    // Snap to exact position (only if not already aligned)
    const targetX = clampedIndex * (BANNER_WIDTH + BANNER_SPACING);
    if (Math.abs(offset - targetX) > 1) {
      isSnappingRef.current = true;
      const scrollView = scrollViewRef.current;
      if (scrollView) {
        scrollView.scrollTo({ x: targetX, animated: true });
      }
      setTimeout(() => { isSnappingRef.current = false; }, 400);
    }
  };

  // Pause auto-play when user starts dragging
  const handleScrollBeginDrag = () => {
    setIsAutoPlaying(false);
  };

  // Resume auto-play after user stops dragging
  const handleScrollEndDrag = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
      resumeTimeoutRef.current = null;
    }, 2000);
  };

  // Cleanup resume timeout
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // Scroll to specific banner
  const scrollToBanner = useCallback((index) => {
    const scrollView = scrollViewRef.current;
    if (scrollView) {
      scrollView.scrollTo({
        x: index * (BANNER_WIDTH + BANNER_SPACING),
        animated: true
      });
    }
  }, [BANNER_WIDTH, BANNER_SPACING]);

  // Sync scroll position when activeBanner changes from user interaction
  useEffect(() => {
    if (isUserInitiatedRef.current) {
      scrollToBanner(activeBanner);
      isUserInitiatedRef.current = false;
    }
  }, [activeBanner, scrollToBanner]);

  const handleDotPress = (index) => {
    isUserInitiatedRef.current = true;
    setIsAutoPlaying(false);
    setActiveBanner(index);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
      resumeTimeoutRef.current = null;
    }, 4000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. HEADER */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.subtext }]}>Xin chào,</Text>
            <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>{userName || 'Khách hàng'}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ScalePress style={[styles.iconBtn, { backgroundColor: colors.surface }]} onPress={() => setSettingsOpen(true)}>
              <Settings color={colors.text} size={moderateScale(20)} />
            </ScalePress>
            <ScalePress style={[styles.iconBtn, { backgroundColor: colors.surface }]} onPress={() => navigation.navigate('Notification')}>
              <Bell color={colors.text} size={moderateScale(20)} />
              {unreadNotifications > 0 && (
                <View style={[styles.badge, { borderColor: colors.card }]}>
                  <Text style={styles.badgeText}>{unreadNotifications}</Text>
                </View>
              )}
            </ScalePress>
            <ScalePress style={[styles.iconBtn, { backgroundColor: colors.card }]} onPress={() => navigation.navigate('CustomerHome', { screen: 'Profile' })}>
              <Image source={{ uri: 'https://img.freepik.com/free-vector/cute-cool-boy-with-glasses-hoodie-pixel-art-style_475147-155.jpg' }} style={styles.avatar} />
            </ScalePress>
          </View>
        </Animated.View>

        {/* 2. STORE BANNERS CAROUSEL */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.vehicleModule}>
          <View style={[styles.carouselContainer, { backgroundColor: colors.background }]}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleMomentumEnd}
              onScrollBeginDrag={handleScrollBeginDrag}
              onScrollEndDrag={handleScrollEndDrag}
              scrollEventThrottle={16}
              contentContainerStyle={{
                paddingHorizontal: BANNER_PADDING
              }}
              style={styles.carouselScroll}
              decelerationRate="fast"
            >
              {BANNERS.map((banner) => (
                <View key={banner.id} style={[styles.bannerItem, { width: BANNER_WIDTH, marginHorizontal: BANNER_SPACING / 2 }]}>
                  <Image source={{ uri: banner.image }} style={styles.bannerImage} resizeMode="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(5, 5, 5, 0.95)']}
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
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDotPress(index)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.dot,
                      activeBanner === index ? styles.activeDot : styles.inactiveDot
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Shortcuts Grid (Moved below Banner and styled elegantly) */}
          <GlassCard 
            style={[styles.shortcutCard, { borderColor: colors.glassBorder, backgroundColor: colors.glassBg }]}
            tint={colors.isDark ? 'dark' : 'light'}
          >
            <View style={styles.shortcutRowContainer}>
              {shortcuts.map((item) => {
                const iconMap = {
                  'ServiceHistory': Book,
                  'Catalog': List,
                  'FinancialHub': Droplets,
                  'Support': HelpCircle
                };
                const IconComponent = iconMap[item.screen] || HelpCircle;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.shortcutItem}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <View style={[styles.shortcutIconBg, { backgroundColor: colors.primary + (colors.isDark ? '22' : '18') }] }>
                      <IconComponent color= {colors.text} size={moderateScale(20)} />
                    </View>
                    <Text style={[styles.shortcutText, { color: colors.text }]}>{item.title}</Text>
                  </TouchableOpacity>
                );
              })}
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
                ? 'rgba(239, 68, 68, 0.12)'
                : 'rgba(245, 158, 11, 0.12)';

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
                    {isCritical ? <AlertTriangle color={colors.text} size={moderateScale(20)} strokeWidth={1.5} style={styles.alertIcon} /> : <ShieldAlert color={colors.text} size={moderateScale(20)} strokeWidth={1.5} style={styles.alertIcon} />}
                    <View style={styles.alertContent}>
                      <Text style={[styles.alertTitle, { color: colors.text }]}>{alert.title}</Text>
                      <Text style={[styles.alertDesc, { color: colors.subtext }]}>{alert.message}</Text>
                      <View style={styles.alertCta}>
                        <Text style={[styles.alertCtaText, { color: colors.text }]}>{alert.cta}</Text>
                        <ArrowRight color={colors.text} size={moderateScale(12)} strokeWidth={2} style={{ marginLeft: 4 }} />
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
                    <Ticket color={colors.text} size={moderateScale(20)} />
                    <QrCode color={colors.text} size={moderateScale(20)} />
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
                <Image source={{ uri: item.image }} style={styles.exploreImage} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(5, 5, 5, 0.9)']}
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
          {(newsList?.length > 0 ? newsList : newsItems).slice(0, 3).map((news) => (
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
                <ChevronRight color={colors.text} size={moderateScale(16)} />
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
              backgroundColor: colors.isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0,0,0,0.02)', 
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

