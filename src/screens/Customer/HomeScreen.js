import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Share } from 'react-native';
import { Theme } from '../../theme/Theme';
import { 
  Bell, Zap, Calendar, Gauge, AlertCircle, ChevronRight, 
  ShoppingBag, QrCode, Headset, Heart, Share2, Filter, Bookmark
} from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';
import PulseView from '../../components/PulseView';
import { useGlobalState } from '../../context/GlobalState';
import CustomBottomSheet from '../../components/CustomBottomSheet';
import Toast from '../../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const { unreadNotifications } = useGlobalState();
  const maintenanceSheetRef = useRef(null);
  const toastRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('News');
  const [savedNews, setSavedNews] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadSavedNews();
    }, [])
  );

  const loadSavedNews = async () => {
    try {
      const stored = await AsyncStorage.getItem('saved_news');
      if (stored) {
        setSavedNews(JSON.parse(stored).map(item => item.id));
      }
    } catch (e) {
      console.log('Failed to load saved news', e);
    }
  };

  const maintenanceTasks = [
    { id: '1', title: 'Thay nhớt máy', due: '200km', urgent: false },
    { id: '2', title: 'Kiểm tra xích tải', due: 'Ngay bây giờ', urgent: true },
    { id: '3', title: 'Thay lọc gió', due: '1,500km', urgent: false },
  ];

  const newsFeed = [
    { 
      id: '1', 
      title: 'Ra mắt Kawasaki Ninja ZX-4RR 2024', 
      desc: 'Mẫu sportbike 400cc mạnh nhất phân khúc đã về tới AnhEmMotor...',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070',
      tag: 'New Arrival'
    },
    { 
      id: '2', 
      title: 'Kỹ thuật vào cua an toàn cho xe PXL', 
      desc: 'Cùng chuyên gia AnhEmMotor tìm hiểu các kỹ thuật tối ưu...',
      image: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?q=80&w=1974',
      tag: 'Tips'
    },
  ];

  const toggleSaveNews = async (newsItem) => {
    try {
      const stored = await AsyncStorage.getItem('saved_news');
      let currentSaved = stored ? JSON.parse(stored) : [];
      const isSaved = currentSaved.some(item => item.id === newsItem.id);
      
      let newSaved;
      if (isSaved) {
        newSaved = currentSaved.filter(item => item.id !== newsItem.id);
        toastRef.current?.show('Đã bỏ lưu tin tức');
      } else {
        newSaved = [...currentSaved, newsItem];
        toastRef.current?.show('Đã lưu tin tức!');
      }
      
      await AsyncStorage.setItem('saved_news', JSON.stringify(newSaved));
      setSavedNews(newSaved.map(item => item.id));
    } catch (e) {
      console.log('Failed to save news', e);
    }
  };

  const handleShare = async (title) => {
    try {
      await Share.share({ message: `Check out this news from AnhEmMotor: ${title}` });
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderMaintenanceStatus = (remainingKm) => {
    let color = '#10B981'; // Green
    let statusText = 'Hoạt động tốt';
    let progress = 0.8;

    if (remainingKm <= 200) {
      color = '#F59E0B'; // Yellow
      statusText = 'Sắp đến hạn bảo trì';
      progress = 0.4;
    }
    if (remainingKm <= 50) {
      color = '#EF4444'; // Red
      statusText = 'Cần bảo trì gấp!';
      progress = 0.15;
    }

    return (
      <TouchableOpacity 
        style={styles.statusContainer} 
        onPress={() => maintenanceSheetRef.current?.show()}
      >
        <View style={styles.statusLabelRow}>
          <Text style={[styles.statusText, { color }]}>{statusText}</Text>
          <Text style={styles.statusKm}>{remainingKm}km nữa</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View 
            style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* I.1 HEADER (PERSONALIZED HUB) */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Chào Anh Em! 👋</Text>
            <Text style={styles.userName}>Nguyễn Khôi</Text>
          </View>
          <View style={styles.headerActions}>
            <ScalePress style={styles.notiBtn} onPress={() => navigation.navigate('Notification')}>
              <Bell color={Theme.colors.text} size={22} />
              {unreadNotifications > 0 && <View style={styles.badge} />}
            </ScalePress>
            <ScalePress style={styles.notiBtn} onPress={() => navigation.navigate('SavedNews')}>
              <Bookmark color={Theme.colors.text} size={22} />
            </ScalePress>
            <ScalePress 
              style={styles.profileIcon}
              onPress={() => navigation.navigate('Profile')}
            >
                <Image 
                  source={{ uri: 'https://img.freepik.com/free-vector/cute-cool-boy-with-glasses-hoodie-pixel-art-style_475147-155.jpg' }} 
                  style={styles.avatar} 
                />
            </ScalePress>
          </View>
        </Animated.View>

        {/* ACTIVE VEHICLE CARD */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.activeVehicleModule}>
          <GlassCard style={styles.activeVehicleCard} intensity={20}>
            <View style={styles.activeVehicleHeader}>
              <View>
                <Text style={styles.bikeName}>Kawasaki Z1000</Text>
                <Text style={styles.bikePlate}>59-A3 123.45</Text>
              </View>
              <View style={styles.activeIconContainer}>
                <PulseView pulseScale={1.1}>
                  <View style={styles.activeIcon}>
                    <Zap color={Theme.colors.primary} size={16} />
                  </View>
                </PulseView>
              </View>
            </View>

            <View style={styles.activeVehicleStats}>
                <View style={styles.miniStat}>
                  <Gauge color={Theme.colors.subtext} size={14} />
                  <Text style={styles.miniStatText}>12,500 km</Text>
                </View>
                <View style={styles.miniStat}>
                  <Calendar color={Theme.colors.subtext} size={14} />
                  <Text style={styles.miniStatText}>Hạn BH: 12/2026</Text>
                </View>
            </View>

            {renderMaintenanceStatus(200)}
          </GlassCard>
        </Animated.View>

        {/* QUICK ACTIONS (GLASSMORPHISM) */}
        <View style={styles.quickActionsGrid}>
          <ScalePress style={styles.actionItem} onPress={() => navigation.navigate('Booking')}>
            <GlassCard style={styles.actionGlass} intensity={25}>
              <Calendar color={Theme.colors.primary} size={24} />
              <Text style={styles.actionLabel}>Đặt lịch</Text>
            </GlassCard>
          </ScalePress>

          <ScalePress style={styles.actionItem} onPress={() => navigation.navigate('Catalog')}>
            <GlassCard style={styles.actionGlass} intensity={25}>
              <ShoppingBag color={Theme.colors.secondary} size={24} />
              <Text style={styles.actionLabel}>Mua sắm</Text>
            </GlassCard>
          </ScalePress>

          <ScalePress style={styles.actionItem} onPress={() => navigation.navigate('QRScan')}>
            <GlassCard style={styles.actionGlass} intensity={25}>
              <QrCode color={Theme.colors.success} size={24} />
              <Text style={styles.actionLabel}>Quét QR</Text>
            </GlassCard>
          </ScalePress>

          <ScalePress style={styles.actionItem} onPress={() => navigation.navigate('Support')}>
            <GlassCard style={styles.actionGlass} intensity={25}>
              <Headset color={Theme.colors.warning} size={24} />
              <Text style={styles.actionLabel}>Hỗ trợ</Text>
            </GlassCard>
          </ScalePress>
        </View>

        {/* NEWS FEED & NOTIFICATIONS TABS */}
        <View style={styles.tabSection}>
          <View style={styles.tabBar}>
            <TouchableOpacity onPress={() => setActiveTab('News')} style={[styles.tab, activeTab === 'News' && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === 'News' && styles.activeTabText]}>Tin tức</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('Noti')} style={[styles.tab, activeTab === 'Noti' && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === 'Noti' && styles.activeTabText]}>Thông báo</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'News' ? (
            <Animated.View entering={FadeInUp}>
                  {newsFeed.map((news) => (
                <GlassCard key={news.id} style={styles.newsCard} intensity={10}>
                  <Image source={{ uri: news.image }} style={styles.newsImage} />
                  <View style={styles.newsContent}>
                    <View style={styles.newsTag}>
                      <Text style={styles.newsTagText}>{news.tag}</Text>
                    </View>
                    <Text style={styles.newsTitle}>{news.title}</Text>
                    <Text style={styles.newsDesc} numberOfLines={2}>{news.desc}</Text>
                    <View style={styles.newsFooter}>
                      <ScalePress onPress={() => toggleSaveNews(news)}>
                        <Heart 
                          color={savedNews.includes(news.id) ? Theme.colors.secondary : Theme.colors.subtext} 
                          fill={savedNews.includes(news.id) ? Theme.colors.secondary : 'transparent'}
                          size={20} 
                        />
                      </ScalePress>
                      <ScalePress onPress={() => handleShare(news.title)}>
                        <Share2 color={Theme.colors.subtext} size={20} style={{ marginLeft: 20 }} />
                      </ScalePress>
                    </View>
                  </View>
                </GlassCard>
              ))}
            </Animated.View>
          ) : (
            <View style={styles.notificationCategories}>
              <View style={styles.notiCategory}>
                <View style={[styles.catIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                  <Zap color={Theme.colors.primary} size={20} />
                </View>
                <View style={styles.catInfo}>
                  <Text style={styles.catTitle}>Hệ thống</Text>
                  <Text style={styles.catDesc}>Cập nhật trạng thái đơn hàng & bảo trì</Text>
                </View>
                <ChevronRight color={Theme.colors.subtext} size={16} />
              </View>
              <View style={styles.notiCategory}>
                <View style={[styles.catIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                  <AlertCircle color={Theme.colors.secondary} size={20} />
                </View>
                <View style={styles.catInfo}>
                  <Text style={styles.catTitle}>Khuyến mãi</Text>
                  <Text style={styles.catDesc}>Voucher độc quyền dành riêng cho bạn</Text>
                </View>
                <ChevronRight color={Theme.colors.subtext} size={16} />
              </View>
            </View>
          )}
        </View>

        {/* Removed height: 100 spacer, using paddingBottom in scrollContent */}
      </ScrollView>

      {/* BOTTOM SHEETS & TOASTS */}
      <CustomBottomSheet ref={maintenanceSheetRef} title="Hạng mục bảo trì">
        <Text style={styles.sheetSubtitle}>Dựa trên ODO 12,500km của Kawasaki Z1000</Text>
        {maintenanceTasks.map(task => (
          <View key={task.id} style={styles.taskItem}>
            <View style={[styles.taskIndicator, { backgroundColor: task.urgent ? Theme.colors.secondary : Theme.colors.primary }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDue}>Dự kiến: {task.due}</Text>
            </View>
            {task.urgent && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>GẤP</Text>
              </View>
            )}
          </View>
        ))}
        <TouchableOpacity 
          style={styles.sheetActionBtn}
          onPress={() => {
            maintenanceSheetRef.current?.hide();
            navigation.navigate('Booking');
          }}
        >
          <Text style={styles.sheetActionText}>Đặt lịch kiểm tra ngay</Text>
        </TouchableOpacity>
      </CustomBottomSheet>

      <Toast ref={toastRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: Theme.spacing.lg, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  welcomeText: { color: Theme.colors.subtext, fontSize: 16 },
  userName: { color: Theme.colors.text, fontSize: 28, fontWeight: 'bold' },
  notiBtn: { marginRight: 15, position: 'relative' },
  badge: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.colors.secondary, borderWidth: 1, borderColor: Theme.colors.background },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: Theme.colors.primary },

  activeVehicleModule: { marginBottom: Theme.spacing.lg },
  activeVehicleCard: { padding: 20 },
  activeVehicleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bikeName: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold' },
  bikePlate: { color: Theme.colors.subtext, fontSize: 13, marginTop: 2 },
  activeIconContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,122,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  
  activeVehicleStats: { flexDirection: 'row', marginTop: 15, marginBottom: 20 },
  miniStat: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  miniStatText: { color: Theme.colors.subtext, fontSize: 12, marginLeft: 6 },

  statusContainer: { marginTop: 5 },
  statusLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statusText: { fontSize: 13, fontWeight: 'bold' },
  statusKm: { color: Theme.colors.subtext, fontSize: 11 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },

  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: Theme.spacing.xl },
  actionItem: { width: '48%', marginBottom: 15 },
  actionGlass: { height: 90, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { color: Theme.colors.text, fontSize: 14, fontWeight: '600', marginTop: 8 },

  tabSection: { marginTop: 10 },
  tabBar: { flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  tab: { paddingVertical: 10, marginRight: 30, position: 'relative' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: Theme.colors.primary },
  tabText: { color: Theme.colors.subtext, fontSize: 16, fontWeight: '600' },
  activeTabText: { color: Theme.colors.text },

  newsCard: { marginBottom: 20, overflow: 'hidden', padding: 0 },
  newsImage: { width: '100%', height: 180 },
  newsContent: { padding: 16 },
  newsTag: { backgroundColor: 'rgba(0,122,255,0.1)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 8 },
  newsTagText: { color: Theme.colors.primary, fontSize: 10, fontWeight: 'bold' },
  newsTitle: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  newsDesc: { color: Theme.colors.subtext, fontSize: 13, lineHeight: 20, marginBottom: 15 },
  newsFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 },

  notificationCategories: { paddingHorizontal: 5 },
  notiCategory: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  catIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  catInfo: { flex: 1 },
  catTitle: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold' },
  catDesc: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2 },

  sheetTitle: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  sheetSubtitle: { color: Theme.colors.subtext, fontSize: 13, marginBottom: 20 },
  taskItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 12 },
  taskIndicator: { width: 4, height: 30, borderRadius: 2, marginRight: 12 },
  taskTitle: { color: Theme.colors.text, fontSize: 15, fontWeight: '600' },
  taskDue: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2 },
  urgentBadge: { backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  urgentText: { color: Theme.colors.secondary, fontSize: 10, fontWeight: '900' },
  sheetActionBtn: { backgroundColor: Theme.colors.primary, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  sheetActionText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});



