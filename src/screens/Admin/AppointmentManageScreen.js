import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image, Linking, TouchableOpacity } from 'react-native';
import { Theme } from '../../theme/Theme';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  X, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Bike,
  ChevronRight,
  Info,
  Plus
} from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function AppointmentManageScreen() {
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' or 'demo'

  const testDrives = [
    { 
      id: '1', 
      customer: 'Nguyễn Khôi', 
      phone: '0901234567',
      bike: 'Kawasaki Z1000', 
      time: '09:00 - 10:00', 
      date: 'Hôm nay',
      status: 'Pending',
      img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=200'
    },
    { 
      id: '2', 
      customer: 'Trần Nam', 
      phone: '0988776655',
      bike: 'Honda CBR150R', 
      time: '14:30 - 15:30', 
      date: 'Hôm nay',
      status: 'Confirmed',
      img: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=200'
    },
  ];

  const demoBikes = [
    { id: '1', name: 'Z1000 Demo', status: 'Sẵn sàng', color: Theme.colors.success, count: 1 },
    { id: '2', name: 'CBR150R Demo', status: 'Đang lái thử', color: Theme.colors.warning, count: 0 },
    { id: '3', name: 'Panigale V4 Demo', status: 'Bảo trì', color: Theme.colors.error, count: 0 },
  ];

  return (
    <View style={styles.container}>
      {/* II.3 HEADER & TABS */}
      <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
        <Text style={styles.title}>Lịch Showroom 📅</Text>
        <View style={styles.tabContainer}>
          <Pressable 
            style={[styles.tab, activeTab === 'calendar' && styles.activeTab]} 
            onPress={() => setActiveTab('calendar')}
          >
            <CalendarIcon color={activeTab === 'calendar' ? '#fff' : Theme.colors.subtext} size={20} />
            <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>Lịch Lái Thử</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'demo' && styles.activeTab]} 
            onPress={() => setActiveTab('demo')}
          >
            <Bike color={activeTab === 'demo' ? '#fff' : Theme.colors.subtext} size={20} />
            <Text style={[styles.tabText, activeTab === 'demo' && styles.activeTabText]}>Xe Demo</Text>
          </Pressable>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {activeTab === 'calendar' ? (
          /* II.3 TEST-DRIVE CALENDAR (3-SECOND RULE) */
          <View>
            <View style={styles.dateSelector}>
              <Text style={styles.dateLabel}>Tiếp nhận khách mới</Text>
              <Pressable style={styles.calendarBtn}>
                <CalendarIcon color={Theme.colors.primary} size={18} />
              </Pressable>
            </View>

            {testDrives.map((item, index) => (
              <Animated.View 
                key={item.id} 
                entering={FadeInDown.delay(index * 100)} 
                layout={Layout.springify()}
              >
                <GlassCard style={styles.appointmentCard}>
                  <View style={styles.cardMain}>
                    <View style={styles.timeColumn}>
                      <Text style={styles.startTime}>{item.time.split(' - ')[0]}</Text>
                      <View style={styles.timeLine} />
                      <Text style={styles.endTime}>{item.time.split(' - ')[1]}</Text>
                    </View>
                    
                    <View style={styles.contentColumn}>
                      <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.customerName}>{item.customer}</Text>
                          <Text style={styles.phoneText}>{item.phone}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Confirmed' ? Theme.colors.success + '20' : Theme.colors.warning + '20' }]}>
                          <Text style={[styles.statusText, { color: item.status === 'Confirmed' ? Theme.colors.success : Theme.colors.warning }]}>
                            {item.status === 'Confirmed' ? 'Đã xác nhận' : 'Chờ duyệt'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.bikeInfo}>
                        <Image source={{ uri: item.img }} style={styles.bikeThumb} />
                        <View style={{ marginLeft: 12 }}>
                          <Text style={styles.bikeLabel}>Xe lái thử:</Text>
                          <Text style={styles.bikeName}>{item.bike}</Text>
                        </View>
                      </View>

                      {/* II.3 XÁC NHẬN LỊCH (ZALO/MAP) */}
                      <View style={styles.actionRow}>
                        {item.status === 'Pending' ? (
                          <>
                            <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]}>
                              <X color={Theme.colors.secondary} size={18} />
                              <Text style={styles.rejectText}>Dời lịch</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]}>
                              <Check color="#fff" size={18} />
                              <Text style={styles.approveText}>Duyệt ngay</Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <View style={styles.confirmedActions}>
                            <TouchableOpacity style={styles.iconAction} onPress={() => Linking.openURL('https://zalo.me')}>
                              <MessageSquare color={Theme.colors.success} size={20} />
                              <Text style={styles.iconLabel}>Zalo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconAction} onPress={() => Linking.openURL('https://maps.google.com')}>
                              <MapPin color={Theme.colors.info} size={20} />
                              <Text style={styles.iconLabel}>Maps</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconAction} onPress={() => Linking.openURL(`tel:${item.phone}`)}>
                              <Phone color={Theme.colors.primary} size={20} />
                              <Text style={styles.iconLabel}>Gọi khách</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </GlassCard>
              </Animated.View>
            ))}
          </View>
        ) : (
          /* II.3 TÌNH TRẠNG XE DEMO */
          <View style={styles.demoContainer}>
            <View style={styles.infoBox}>
              <Info color={Theme.colors.subtext} size={16} />
              <Text style={styles.infoText}>Kiểm tra xe sẵn sàng trước khi xác nhận lịch cho khách.</Text>
            </View>
            
            <View style={styles.demoGrid}>
              {demoBikes.map((bike, index) => (
                <Animated.View key={bike.id} entering={FadeInDown.delay(index * 100)} style={{ width: '48%' }}>
                  <GlassCard style={styles.demoCard}>
                    <View style={[styles.demoStatusDot, { backgroundColor: bike.color }]} />
                    <Bike color={Theme.colors.text} size={32} opacity={0.5} style={styles.demoIcon} />
                    <Text style={styles.demoBikeName}>{bike.name}</Text>
                    <Text style={[styles.demoStatusText, { color: bike.color }]}>{bike.status}</Text>
                    <View style={styles.demoFooter}>
                      <Text style={styles.demoCount}>Sẵn sàng: {bike.count}</Text>
                      <Pressable>
                        <ChevronRight color={Theme.colors.subtext} size={16} />
                      </Pressable>
                    </View>
                  </GlassCard>
                </Animated.View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* QUICK ADD APPOINTMENT */}
      <Pressable style={styles.fab}>
        <LinearGradient colors={[Theme.colors.secondary, '#991B1B']} style={styles.fabGradient}>
          <CalendarIcon color="#fff" size={24} />
          <Plus color="#fff" size={16} style={{ position: 'absolute', right: 12, top: 12 }} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  title: { color: Theme.colors.text, fontSize: 28, fontWeight: 'bold' },
  
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: Theme.colors.card, 
    borderRadius: Theme.radius.lg, 
    padding: 4, 
    marginTop: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 12, 
    borderRadius: Theme.radius.md 
  },
  activeTab: { backgroundColor: Theme.colors.secondary },
  tabText: { color: Theme.colors.subtext, fontWeight: '600', marginLeft: 8, fontSize: 14 },
  activeTabText: { color: '#fff' },

  dateSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.spacing.md },
  dateLabel: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  calendarBtn: { backgroundColor: Theme.colors.card, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },

  appointmentCard: { marginBottom: Theme.spacing.md, padding: 0, overflow: 'hidden' },
  cardMain: { flexDirection: 'row' },
  timeColumn: { 
    width: 75, 
    paddingVertical: 20, 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.05)'
  },
  startTime: { color: Theme.colors.text, fontSize: 14, fontWeight: 'bold' },
  endTime: { color: Theme.colors.subtext, fontSize: 11, marginTop: 4 },
  timeLine: { width: 2, height: 40, backgroundColor: Theme.colors.secondary + '40', marginVertical: 6 },

  contentColumn: { flex: 1, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  customerName: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  phoneText: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold' },

  bikeInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 16, backgroundColor: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 12 },
  bikeThumb: { width: 44, height: 44, borderRadius: 8 },
  bikeLabel: { color: Theme.colors.subtext, fontSize: 10 },
  bikeName: { color: Theme.colors.text, fontSize: 14, fontWeight: 'bold' },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 },
  actionBtn: { flex: 0.48, flexDirection: 'row', height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  rejectBtn: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  approveBtn: { backgroundColor: Theme.colors.secondary },
  rejectText: { color: Theme.colors.secondary, fontWeight: 'bold', fontSize: 13, marginLeft: 6 },
  approveText: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginLeft: 6 },

  confirmedActions: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
  iconAction: { alignItems: 'center' },
  iconLabel: { color: Theme.colors.subtext, fontSize: 10, marginTop: 4 },

  demoContainer: { marginTop: Theme.spacing.md },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: 12, borderRadius: 12, marginBottom: 16 },
  infoText: { color: Theme.colors.subtext, fontSize: 12, marginLeft: 8, flex: 1 },
  demoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  demoCard: { padding: 16, marginBottom: 16 },
  demoStatusDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4 },
  demoIcon: { marginBottom: 12 },
  demoBikeName: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold' },
  demoStatusText: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  demoFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 8 },
  demoCount: { color: Theme.colors.subtext, fontSize: 10 },

  fab: { position: 'absolute', bottom: 30, right: 24, width: 56, height: 56, borderRadius: 28, elevation: 8, shadowColor: Theme.colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  fabGradient: { flex: 1, borderRadius: 28, justifyContent: 'center', alignItems: 'center' }
});