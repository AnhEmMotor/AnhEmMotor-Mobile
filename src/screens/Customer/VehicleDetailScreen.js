import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Theme } from '../../theme/Theme';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Zap, 
  Info, 
  History, 
  Activity, 
  AlertCircle,
  Settings,
  Tool
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';

const { width: screenWidth } = Dimensions.get('window');

export default function VehicleDetailScreen({ navigation, route }) {
  const { motor, isOwned } = route.params || {};
  const [activeTab, setActiveTab] = useState('overview');

  const history = [
    { id: '1', date: '10/04/2024', type: 'Bảo dưỡng định kỳ', cost: '1.200.000đ', km: '12,000km' },
    { id: '2', date: '15/01/2024', type: 'Thay lốp sau', cost: '3.500.000đ', km: '10,500km' },
  ];

  const milestones = [
    { km: '1.000km', status: 'Done', label: 'Kiểm tra lần đầu' },
    { km: '5.000km', status: 'Done', label: 'Thay nhớt & Lọc' },
    { km: '15.000km', status: 'Upcoming', label: 'Bảo dưỡng lớn' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* I.2 HEADER & IMAGE */}
        <Animated.View entering={FadeIn.duration(1000)} style={styles.imageContainer}>
            <Image 
              source={{ uri: motor?.img || 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070' }} 
              style={styles.mainImage} 
              resizeMode="cover"
            />
          <LinearGradient
            colors={['rgba(15, 23, 42, 0.4)', 'transparent', 'rgba(15, 23, 42, 0.9)']}
            style={StyleSheet.absoluteFill}
          />
          
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
          >
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <ChevronLeft color="#fff" size={24} />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.motorName}>{motor?.name || 'Kawasaki Z1000'}</Text>
            {isOwned && <Text style={styles.plateText}>{motor?.plate || '59-A3 123.45'}</Text>}
          </View>

          {/* I.2 TABS (DEEP DIVE) */}
          <View style={styles.tabContainer}>
            {['overview', 'history', 'specs'].map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab === 'overview' ? 'Tổng quan' : tab === 'history' ? 'Lịch sử' : 'Thông số'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'overview' && (
            <Animated.View entering={FadeInDown.duration(600)}>
              {/* SMART REMINDERS */}
              <Text style={styles.sectionTitle}>Nhắc nhở bảo trì 🛠️</Text>
              <View style={styles.milestoneRow}>
                {milestones.map((m, i) => (
                  <View key={i} style={styles.milestoneItem}>
                    <View style={[styles.milestoneDot, m.status === 'Done' ? styles.dotDone : styles.dotUpcoming]} />
                    <Text style={styles.milestoneKm}>{m.km}</Text>
                    <Text style={styles.milestoneLabel}>{m.label}</Text>
                  </View>
                ))}
              </View>

              <GlassCard style={styles.partCard}>
                <View style={styles.partHeader}>
                  <Activity color={Theme.colors.primary} size={20} />
                  <Text style={styles.partTitle}>Tình trạng phụ tùng</Text>
                </View>
                <View style={styles.partGrid}>
                  <View style={styles.partItem}>
                    <Text style={styles.partLabel}>Lọc gió</Text>
                    <Text style={[styles.partStatus, { color: Theme.colors.success }]}>Tốt</Text>
                  </View>
                  <View style={styles.partItem}>
                    <Text style={styles.partLabel}>Má phanh</Text>
                    <Text style={[styles.partStatus, { color: Theme.colors.warning }]}>Cần thay</Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          )}

          {activeTab === 'history' && (
            <Animated.View entering={FadeInDown.duration(600)}>
              <Text style={styles.sectionTitle}>Lịch sử sửa chữa 📝</Text>
              {history.map(item => (
                <GlassCard key={item.id} style={styles.historyCard}>
                  <View style={styles.historyTop}>
                    <Text style={styles.historyDate}>{item.date}</Text>
                    <Text style={styles.historyKm}>{item.km}</Text>
                  </View>
                  <Text style={styles.historyType}>{item.type}</Text>
                  <View style={styles.historyFooter}>
                    <Text style={styles.historyCost}>{item.cost}</Text>
                    <TouchableOpacity style={styles.invoiceLink}>
                      <Text style={styles.invoiceText}>Xem hóa đơn</Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              ))}
            </Animated.View>
          )}

          {activeTab === 'specs' && (
            <Animated.View entering={FadeInDown.duration(600)}>
              <Text style={styles.sectionTitle}>Chi tiết kỹ thuật 🔍</Text>
              <View style={styles.specList}>
                <View style={styles.specRow}>
                  <Text style={styles.specKey}>Dung tích nhớt</Text>
                  <Text style={styles.specVal}>4.0 Lít</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specKey}>Kích thước lốp</Text>
                  <Text style={styles.specVal}>120/70 - 190/50</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specKey}>Loại Bugi</Text>
                  <Text style={styles.specVal}>NGK Iridium</Text>
                </View>
              </View>
            </Animated.View>
          )}

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* I.2 BOOKING ACTION */}
      <Animated.View entering={FadeInDown.delay(800)} style={styles.footer}>
        <ScalePress style={styles.bookingBtn} onPress={() => navigation.navigate('Booking')}>
          <LinearGradient
            colors={[Theme.colors.primary, '#1E3A8A']}
            style={styles.bookingGradient}
          >
            <Zap color="#fff" size={20} />
            <Text style={styles.bookingActionText}>Đặt lịch bảo dưỡng</Text>
          </LinearGradient>
        </ScalePress>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  imageContainer: { width: '100%', height: 350 },
  mainImage: { width: '100%', height: '100%' },
  backBtn: { position: 'absolute', top: 50, left: 20, width: 45, height: 45, borderRadius: 23, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  
  content: { padding: 20, marginTop: -30, backgroundColor: Theme.colors.background, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  titleSection: { marginBottom: 20 },
  motorName: { color: Theme.colors.text, fontSize: 28, fontWeight: 'bold' },
  plateText: { color: Theme.colors.subtext, fontSize: 16, marginTop: 4 },

  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 15, padding: 4, marginBottom: 25 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: Theme.colors.primary },
  tabText: { color: Theme.colors.subtext, fontWeight: 'bold' },
  activeTabText: { color: '#fff' },

  sectionTitle: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  
  milestoneRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  milestoneItem: { flex: 1, alignItems: 'center' },
  milestoneDot: { width: 12, height: 12, borderRadius: 6, marginBottom: 8 },
  dotDone: { backgroundColor: Theme.colors.success },
  dotUpcoming: { backgroundColor: 'rgba(255,255,255,0.2)' },
  milestoneKm: { color: Theme.colors.text, fontSize: 12, fontWeight: 'bold' },
  milestoneLabel: { color: Theme.colors.subtext, fontSize: 10, textAlign: 'center', marginTop: 2 },

  partCard: { padding: 20 },
  partHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  partTitle: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold', marginLeft: 10 },
  partGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  partItem: { flex: 1 },
  partLabel: { color: Theme.colors.subtext, fontSize: 12 },
  partStatus: { fontSize: 14, fontWeight: 'bold', marginTop: 4 },

  historyCard: { padding: 16, marginBottom: 12 },
  historyTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  historyDate: { color: Theme.colors.subtext, fontSize: 12 },
  historyKm: { color: Theme.colors.primary, fontSize: 12, fontWeight: 'bold' },
  historyType: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  historyFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 10 },
  historyCost: { color: Theme.colors.text, fontSize: 14, fontWeight: 'bold' },
  invoiceLink: { borderBottomWidth: 1, borderBottomColor: Theme.colors.primary },
  invoiceText: { color: Theme.colors.primary, fontSize: 12 },

  specList: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 16 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  specKey: { color: Theme.colors.subtext, fontSize: 14 },
  specVal: { color: Theme.colors.text, fontSize: 14, fontWeight: 'bold' },

  footer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  bookingBtn: { height: 60, borderRadius: 18, overflow: 'hidden' },
  bookingGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  bookingActionText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 12 }
});
