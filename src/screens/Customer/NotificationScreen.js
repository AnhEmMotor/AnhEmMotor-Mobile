import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../theme/Theme';
import { Bell, Wrench, FileText, ChevronLeft, CalendarClock } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import ScalePress from '../../components/ScalePress';
import EmptyState from '../../components/EmptyState';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useGlobalState } from '../../context/GlobalState';

export default function NotificationScreen({ navigation }) {
  const { unreadNotifications, markAllAsRead } = useGlobalState();
  const [activeTab, setActiveTab] = useState('all');

  const notifications = [
    { id: 1, type: 'maintenance', title: 'Nhắc nhở bảo dưỡng', desc: 'Đã đến hạn thay nhớt cho xe Honda CBR150R (ODO 15,000km).', time: '2 giờ trước', isRead: false },
    { id: 2, type: 'invoice', title: 'Hóa đơn dịch vụ mới', desc: 'Hóa đơn #HD-10924 cho dịch vụ Bảo dưỡng định kỳ đã được phát hành.', time: '1 ngày trước', isRead: false },
    { id: 3, type: 'booking', title: 'Xác nhận đặt lịch', desc: 'Lịch hẹn bảo dưỡng ngày 12/05 lúc 14:00 đã được xác nhận.', time: '2 ngày trước', isRead: false },
    { id: 4, type: 'system', title: 'Cập nhật hạng thành viên', desc: 'Chúc mừng! Bạn đã được thăng hạng Vàng.', time: '1 tuần trước', isRead: true },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'maintenance': return <Wrench color={Theme.colors.warning} size={20} />;
      case 'invoice': return <FileText color={Theme.colors.info} size={20} />;
      case 'booking': return <CalendarClock color={Theme.colors.success} size={20} />;
      default: return <Bell color={Theme.colors.primary} size={20} />;
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (activeTab === 'unread') return !n.isRead;
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.header}>
        <ScalePress style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={Theme.colors.text} size={24} />
        </ScalePress>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <ScalePress onPress={markAllAsRead}>
          <Text style={styles.markReadText}>Đã đọc</Text>
        </ScalePress>
      </Animated.View>

      <View style={styles.tabs}>
        <ScalePress style={[styles.tab, activeTab === 'all' && styles.activeTab]} onPress={() => setActiveTab('all')}>
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Tất cả</Text>
        </ScalePress>
        <ScalePress style={[styles.tab, activeTab === 'unread' && styles.activeTab]} onPress={() => setActiveTab('unread')}>
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>
            Chưa đọc {unreadNotifications > 0 ? `(${unreadNotifications})` : ''}
          </Text>
        </ScalePress>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filteredNotifs.length === 0 ? (
          <EmptyState 
            icon={Bell} 
            title="Không có thông báo mới" 
            message="Bạn đã xem hết tất cả thông báo hiện có." 
          />
        ) : (
          filteredNotifs.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInDown.duration(600).delay(index * 100)}>
              <ScalePress onPress={() => {
                if (item.type === 'invoice') navigation.navigate('Invoice');
                if (item.type === 'booking') navigation.navigate('Booking');
              }}>
                <GlassCard style={[styles.card, !item.isRead && styles.unreadCard]} intensity={item.isRead ? 10 : 20}>
                  {!item.isRead && <View style={styles.unreadDot} />}
                  <View style={styles.iconBox}>
                    {getIcon(item.type)}
                  </View>
                  <View style={styles.contentBox}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.desc}>{item.desc}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>
                </GlassCard>
              </ScalePress>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Theme.spacing.md, marginTop: 10, marginBottom: Theme.spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.card, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold' },
  markReadText: { color: Theme.colors.primary, fontSize: 14, fontWeight: 'bold' },
  
  tabs: { flexDirection: 'row', paddingHorizontal: Theme.spacing.md, marginBottom: Theme.spacing.md },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: Theme.radius.full, marginRight: 10, backgroundColor: Theme.colors.card },
  activeTab: { backgroundColor: Theme.colors.primary },
  tabText: { color: Theme.colors.subtext, fontSize: 14, fontWeight: '600' },
  activeTabText: { color: '#fff' },
  
  list: { paddingHorizontal: Theme.spacing.md, paddingBottom: 100 },
  card: { flexDirection: 'row', padding: Theme.spacing.md, marginBottom: Theme.spacing.sm, borderRadius: Theme.radius.lg, overflow: 'hidden' },
  unreadCard: { borderColor: 'rgba(59, 130, 246, 0.3)', borderWidth: 1 },
  unreadDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.colors.primary },
  
  iconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  contentBox: { flex: 1 },
  title: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  desc: { color: Theme.colors.subtext, fontSize: 13, lineHeight: 18 },
  time: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 8 }
});
