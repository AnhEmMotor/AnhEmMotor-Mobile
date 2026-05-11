import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Dimensions, Image, Modal } from 'react-native';
import { Theme } from '../../theme/Theme';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Plus, 
  AlertCircle, 
  Zap, 
  Hand,
  MessageCircle,
  CheckCircle,
  ChevronRight,
  X,
  Phone,
  ShieldAlert
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../components/GlassCard';
import PulseView from '../../components/PulseView';
import Animated, { FadeInDown, FadeInUp, FadeInRight, Layout } from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen({ navigation }) {
  const [sosVisible, setSosVisible] = useState(false);
  const [urgentAlerts, setUrgentAlerts] = useState([
    { id: '1', type: 'SOS', title: 'Hỗ trợ cứu hộ khẩn cấp', detail: 'Hầm Thủ Thiêm - Honda SH', time: 'Vừa xong', color: Theme.colors.error },
    { id: '2', type: 'HOT', title: 'Khách "Siêu nóng"', detail: 'Anh Khôi chốt Panigale V4', time: '5p trước', color: Theme.colors.warning },
  ]);

  const staffStatus = [
    { id: '1', name: 'Minh Tuấn', status: 'Đang tiếp khách', avatar: 'https://i.pravatar.cc/150?u=1', active: true },
    { id: '2', name: 'Thanh Hằng', status: 'Showroom', avatar: 'https://i.pravatar.cc/150?u=2', active: true },
    { id: '3', name: 'Quốc Bảo', status: 'Lái thử', avatar: 'https://i.pravatar.cc/150?u=3', active: false },
  ];

  // Simulate SOS Incoming
  useEffect(() => {
    const timer = setTimeout(() => setSosVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const resolveAlert = (id) => {
    setUrgentAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>Command Center ⚡</Text>
            <Text style={styles.dateText}>Nhịp thở Showroom hôm nay</Text>
          </View>
          <Pressable style={styles.profileIcon} onPress={() => navigation.navigate('AdminProfile')}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=admin' }} style={styles.avatar} resizeMode="cover" />
          </Pressable>
        </Animated.View>

        {/* II.1 QUICK STATS (QUY TẮC 3 GIÂY) */}
        <View style={styles.quickStatsContainer}>
          <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.statsRow}>
            <GlassCard style={styles.statCard}>
              <View style={[styles.iconCircle, { backgroundColor: Theme.colors.info + '20' }]}>
                <Users color={Theme.colors.info} size={20} />
              </View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Leads mới</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <View style={[styles.iconCircle, { backgroundColor: Theme.colors.warning + '20' }]}>
                <Clock color={Theme.colors.warning} size={20} />
              </View>
              <Text style={styles.statValue}>05</Text>
              <Text style={styles.statLabel}>Lịch hẹn</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <View style={[styles.iconCircle, { backgroundColor: Theme.colors.success + '20' }]}>
                <TrendingUp color={Theme.colors.success} size={20} />
              </View>
              <Text style={styles.statValue}>85M</Text>
              <Text style={styles.statLabel}>Tiền cọc</Text>
            </GlassCard>
          </Animated.View>
        </View>

        {/* II.1 URGENT ALERTS (3-TAP RULE: ACTION BUTTONS IN CARD) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông báo khẩn (Urgent)</Text>
            {urgentAlerts.length > 0 && <View style={styles.alertCount}><Text style={styles.alertCountText}>{urgentAlerts.length}</Text></View>}
          </View>
          
          {urgentAlerts.length === 0 ? (
            <GlassCard style={styles.emptyAlert}>
              <CheckCircle color={Theme.colors.success} size={24} />
              <Text style={styles.emptyText}>Mọi thứ đều trong tầm kiểm soát</Text>
            </GlassCard>
          ) : (
            urgentAlerts.map((alert, index) => (
              <Animated.View key={alert.id} entering={FadeInRight.delay(200 + index * 100)} layout={Layout.springify()}>
                <PulseView pulseScale={alert.type === 'SOS' ? 1.02 : 1}>
                  <GlassCard style={styles.alertCard} intensity={20}>
                    <View style={[styles.alertIndicator, { backgroundColor: alert.color }]} />
                    <View style={styles.alertIcon}>
                      {alert.type === 'SOS' ? <AlertCircle color={alert.color} size={24} /> : <Zap color={alert.color} size={24} />}
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={styles.alertHeader}>
                        <Text style={[styles.alertTypeText, { color: alert.color }]}>{alert.type}</Text>
                        <Text style={styles.alertTime}>{alert.time}</Text>
                      </View>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      <Text style={styles.alertDetail}>{alert.detail}</Text>
                    </View>
                    
                    {/* QUICK ACTIONS (3-TAP RULE) */}
                    <View style={styles.cardActions}>
                      <Pressable style={styles.rejectBtn} onPress={() => resolveAlert(alert.id)}>
                        <X color={Theme.colors.error} size={18} />
                      </Pressable>
                      <Pressable style={styles.approveBtn} onPress={() => resolveAlert(alert.id)}>
                        <CheckCircle color={Theme.colors.success} size={18} />
                      </Pressable>
                    </View>
                  </GlassCard>
                </PulseView>
              </Animated.View>
            ))
          )}
        </View>

        {/* II.1 STAFF STATUS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trạng thái Nhân viên</Text>
            <Text style={styles.activeCount}>2 đang trực</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.staffScroll}>
            {staffStatus.map((staff, index) => (
              <Animated.View key={staff.id} entering={FadeInDown.delay(400 + index * 100)}>
                <GlassCard style={styles.staffCard}>
                  <View>
                    <Image source={{ uri: staff.avatar }} style={styles.staffAvatar} resizeMode="cover" />
                    {staff.active && <View style={styles.onlineDot} />}
                  </View>
                  <Text style={styles.staffName}>{staff.name}</Text>
                  <Text style={styles.staffState}>{staff.status}</Text>
                </GlassCard>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* NAVIGATION SHORTCUTS */}
        <View style={styles.shortcutGrid}>
          <Animated.View entering={FadeInDown.delay(600)} style={styles.shortcutItem}>
            <Pressable style={styles.shortcutBtn} onPress={() => navigation.navigate('AdminAppointments')}>
              <LinearGradient colors={['#4F46E5', '#3730A3']} style={styles.shortcutIcon}>
                <Clock color="#fff" size={24} />
              </LinearGradient>
              <Text style={styles.shortcutLabel}>Lịch hẹn</Text>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700)} style={styles.shortcutItem}>
            <Pressable style={styles.shortcutBtn} onPress={() => navigation.navigate('AdminInventory')}>
              <LinearGradient colors={['#10B981', '#065F46']} style={styles.shortcutIcon}>
                <CheckCircle color="#fff" size={24} />
              </LinearGradient>
              <Text style={styles.shortcutLabel}>Kho xe</Text>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800)} style={styles.shortcutItem}>
            <Pressable style={styles.shortcutBtn} onPress={() => navigation.navigate('CashFlow')}>
              <LinearGradient colors={['#F59E0B', '#B45309']} style={styles.shortcutIcon}>
                <TrendingUp color="#fff" size={24} />
              </LinearGradient>
              <Text style={styles.shortcutLabel}>Dòng tiền</Text>
            </Pressable>
          </Animated.View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* II.1 SOS OVERLAY MODAL */}
      <Modal visible={sosVisible} transparent animationType="fade">
        <View style={styles.sosOverlay}>
          <Animated.View entering={FadeInUp} style={styles.sosModal}>
            <PulseView pulseScale={1.1}>
              <View style={styles.sosIconCircle}>
                <ShieldAlert color="#fff" size={48} />
              </View>
            </PulseView>
            <Text style={styles.sosTitle}>YÊU CẦU SOS!</Text>
            <Text style={styles.sosDetail}>Khách hàng: Anh Minh Quân</Text>
            <Text style={styles.sosLocation}>Vị trí: Hầm Thủ Thiêm - Q.2</Text>
            
            <View style={styles.sosActions}>
              <Pressable style={styles.sosCloseBtn} onPress={() => setSosVisible(false)}>
                <Text style={styles.sosCloseText}>Bỏ qua</Text>
              </Pressable>
              <Pressable style={styles.sosCallBtn}>
                <Phone color="#fff" size={20} />
                <Text style={styles.sosCallText}>Gọi cứu hộ</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* FAB - QUICK CREATE */}
      <Animated.View entering={FadeInDown.delay(1000)} style={styles.fabContainer}>
        <Pressable style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.9 }] }]}>
          <LinearGradient colors={[Theme.colors.secondary, '#991B1B']} style={styles.fabGradient}>
            <Plus color="#fff" size={32} />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: Theme.spacing.xl + 20, 
    marginBottom: Theme.spacing.lg 
  },
  greeting: { color: Theme.colors.text, fontSize: 22, fontWeight: 'bold' },
  dateText: { color: Theme.colors.subtext, fontSize: 13, marginTop: 4 },
  profileIcon: { width: 45, height: 45, borderRadius: 22.5, overflow: 'hidden', borderWidth: 2, borderColor: Theme.colors.secondary },
  avatar: { width: '100%', height: '100%' },

  quickStatsContainer: { marginVertical: Theme.spacing.md },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { width: (screenWidth - 48 - 24) / 3, padding: 12, alignItems: 'center' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: Theme.colors.subtext, fontSize: 10, textAlign: 'center', marginTop: 2 },

  section: { marginTop: Theme.spacing.lg },
  sectionTitle: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  activeCount: { color: Theme.colors.success, fontSize: 12, fontWeight: '600' },

  alertCount: { backgroundColor: Theme.colors.error, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  alertCountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  emptyAlert: { flexDirection: 'row', alignItems: 'center', padding: 20, justifyContent: 'center' },
  emptyText: { color: Theme.colors.subtext, fontSize: 14, marginLeft: 12 },

  alertCard: { flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 12, overflow: 'hidden' },
  alertIndicator: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  alertIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alertTypeText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  alertTime: { color: Theme.colors.subtext, fontSize: 11 },
  alertTitle: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  alertDetail: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2 },
  
  cardActions: { flexDirection: 'row', marginLeft: 12 },
  rejectBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(239, 68, 68, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  approveBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center' },

  staffScroll: { paddingBottom: 8 },
  staffCard: { width: 130, padding: 16, alignItems: 'center', marginRight: 12 },
  staffAvatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 8 },
  onlineDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: Theme.colors.success, position: 'absolute', right: 0, bottom: 10, borderWidth: 3, borderColor: Theme.colors.card },
  staffName: { color: Theme.colors.text, fontSize: 14, fontWeight: 'bold' },
  staffState: { color: Theme.colors.subtext, fontSize: 10, marginTop: 4, textAlign: 'center' },

  shortcutGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: Theme.spacing.lg },
  shortcutItem: { width: '31%', marginBottom: Theme.spacing.md },
  shortcutBtn: { alignItems: 'center' },
  shortcutIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  shortcutLabel: { color: Theme.colors.text, fontSize: 12, fontWeight: '500', textAlign: 'center' },

  sosOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  sosModal: { width: '100%', backgroundColor: Theme.colors.card, borderRadius: 30, padding: 32, alignItems: 'center', borderWidth: 2, borderColor: Theme.colors.error },
  sosIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: Theme.colors.error, justifyContent: 'center', alignItems: 'center', marginBottom: 24, elevation: 20, boxShadow: `0 10px 20px rgba(220, 38, 38, 0.5)` },
  sosTitle: { color: Theme.colors.error, fontSize: 28, fontWeight: '900', letterSpacing: 2 },
  sosDetail: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  sosLocation: { color: Theme.colors.subtext, fontSize: 14, marginTop: 8 },
  sosActions: { flexDirection: 'row', marginTop: 32, width: '100%' },
  sosCloseBtn: { flex: 1, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
  sosCloseText: { color: Theme.colors.subtext, fontWeight: 'bold' },
  sosCallBtn: { flex: 2, height: 56, borderRadius: 16, flexDirection: 'row', backgroundColor: Theme.colors.error, justifyContent: 'center', alignItems: 'center' },
  sosCallText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },

  fabContainer: { position: 'absolute', bottom: 30, right: 24, alignItems: 'center' },
  fab: { width: 64, height: 64, borderRadius: 32, elevation: 8, boxShadow: `0 4px 8px rgba(220, 38, 38, 0.3)` },
  fabGradient: { flex: 1, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  fabLabel: { color: Theme.colors.secondary, fontSize: 12, fontWeight: 'bold', marginTop: 4 }
});