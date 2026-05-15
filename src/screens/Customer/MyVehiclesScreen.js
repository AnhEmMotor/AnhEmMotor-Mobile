import React, { useState, useRef } from 'react';
import { BlurView } from 'expo-blur';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, Dimensions, Clipboard } from 'react-native';
import { Theme } from '../../theme/Theme';
import { 
  QrCode, Wrench, ChevronRight, History, Plus, AlertCircle, 
  ShieldCheck, Info, Copy, Clock, CheckCircle2
} from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';
import PredictiveHealth from '../../components/PredictiveHealth';
import Toast from '../../components/Toast';

const { width } = Dimensions.get('window');

export default function MyVehiclesScreen({ navigation }) {
  const toastRef = useRef(null);
  const [showQR, setShowQR] = useState(false);
  const [activeBikeIndex, setActiveBikeIndex] = useState(0);

  const myBikes = [
    { 
      id: '1', 
      name: 'Kawasaki Z1000', 
      plate: '59-A3 123.45', 
      vin: 'KWAZ1000-2024-8888',
      engine: 'Z1000E-9999',
      status: 'Hoạt động tốt',
      odo: '12,500 km',
      warrantyUntil: '2026-12-15',
      health: {
        tires: [95, 92, 88, 85, 82, 80],
        brakes: [98, 95, 90, 85, 80, 75],
        oil: [100, 80, 60, 40, 20, 10]
      },
      timeline: [
        { id: 't1', date: '15/03/2026', type: 'Bảo dưỡng', desc: 'Thay nhớt & lọc gió', km: '12,000 km', price: '1,250,000đ' },
        { id: 't2', date: '20/01/2026', type: 'Sửa chữa', desc: 'Thay má phanh trước', km: '10,500 km', price: '850,000đ' },
      ]
    },
  ];

  const activeBike = myBikes[activeBikeIndex];

  const copyToClipboard = (text, label) => {
    Clipboard.setString(text);
    toastRef.current?.show(`Đã sao chép ${label}!`);
  };

  const calculateWarrantyDays = (dateStr) => {
    const end = new Date(dateStr);
    const now = new Date();
    const diff = end - now;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <Text style={styles.title}>Nhà xe của bạn 🏠</Text>
          <Text style={styles.subtitle}>Số hóa tài sản & Theo dõi sức khỏe xe</Text>
        </Animated.View>
        
        {/* VEHICLE SELECTOR / MAIN CARD */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <GlassCard style={styles.bikeCard} intensity={20}>
            <View style={styles.bikeHeader}>
              <View style={styles.imageWrapper}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070' }} 
                  style={styles.bikeThumb} 
                  resizeMode="cover"
                />
              </View>
              <View style={styles.bikeInfo}>
                <Text style={styles.bikeName}>{activeBike.name}</Text>
                <Text style={styles.bikePlate}>{activeBike.plate}</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>{activeBike.status}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowQR(true)}>
                <QrCode color={Theme.colors.primary} size={28} />
              </TouchableOpacity>
            </View>

            <View style={styles.detailGrid}>
              <TouchableOpacity style={styles.detailItem} onPress={() => copyToClipboard(activeBike.vin, 'số khung')}>
                <Text style={styles.detailLabel}>Số khung</Text>
                <View style={styles.detailValueRow}>
                  <Text style={styles.detailValue}>{activeBike.vin}</Text>
                  <Copy color={Theme.colors.subtext} size={12} style={{ marginLeft: 5 }} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailItem} onPress={() => copyToClipboard(activeBike.engine, 'số máy')}>
                <Text style={styles.detailLabel}>Số máy</Text>
                <View style={styles.detailValueRow}>
                  <Text style={styles.detailValue}>{activeBike.engine}</Text>
                  <Copy color={Theme.colors.subtext} size={12} style={{ marginLeft: 5 }} />
                </View>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </Animated.View>

        {/* SMART WARRANTY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bảo hành điện tử 🛡️</Text>
          <GlassCard style={styles.warrantyCard} intensity={15}>
            <View style={styles.warrantyInfo}>
              <View>
                <Text style={styles.warrantyLabel}>Thời gian bảo hành còn lại</Text>
                <Text style={styles.warrantyDays}>{calculateWarrantyDays(activeBike.warrantyUntil)} <Text style={styles.daysUnit}>ngày</Text></Text>
              </View>
              <ShieldCheck color={Theme.colors.success} size={48} opacity={0.5} />
            </View>
            <TouchableOpacity style={styles.warrantyLink}>
              <Text style={styles.warrantyLinkText}>Xem danh mục bộ phận bảo hành</Text>
              <Info color={Theme.colors.primary} size={16} />
            </TouchableOpacity>
          </GlassCard>
        </View>

        {/* PREDICTIVE HEALTH */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dự báo hao mòn 📊</Text>
          <PredictiveHealth title="Tình trạng Lốp" data={activeBike.health.tires} color="#22d3ee" />
          <PredictiveHealth title="Hệ thống Phanh" data={activeBike.health.brakes} color="#f472b6" />
          <PredictiveHealth title="Dầu nhớt" data={activeBike.health.oil} color="#fbbf24" />
        </View>

        {/* MAINTENANCE TIMELINE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nhật ký bảo trì 📅</Text>
          <View style={styles.timelineContainer}>
            {activeBike.timeline.map((item, idx) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineDot}>
                    <CheckCircle2 color={Theme.colors.primary} size={16} />
                  </View>
                  {idx !== activeBike.timeline.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineRight}>
                  <GlassCard style={styles.timelineCard} intensity={10}>
                    <View style={styles.timelineHeader}>
                      <Text style={styles.timelineDate}>{item.date}</Text>
                      <Text style={styles.timelineType}>{item.type}</Text>
                    </View>
                    <Text style={styles.timelineDesc}>{item.desc}</Text>
                    <View style={styles.timelineFooter}>
                      <View style={styles.timelineTag}>
                        <Clock size={12} color={Theme.colors.subtext} />
                        <Text style={styles.timelineTagText}>{item.km}</Text>
                      </View>
                      <Text style={styles.timelinePrice}>{item.price}</Text>
                    </View>
                  </GlassCard>
                </View>
              </View>
            ))}
          </View>
        </View>

        <ScalePress style={styles.addBikeBtn}>
          <LinearGradient
            colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
            style={styles.addBikeGradient}
          >
            <Plus color={Theme.colors.subtext} size={24} />
            <Text style={styles.addBikeText}>Thêm xe khác vào Digital Garage</Text>
          </LinearGradient>
        </ScalePress>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* QR Modal Overlay */}
      <Modal visible={showQR} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
          <TouchableOpacity 
            style={styles.closeArea} 
            activeOpacity={1} 
            onPress={() => setShowQR(false)} 
          />
          
          <GlassCard style={styles.qrCard} intensity={40}>
            <View style={styles.qrHeader}>
              <QrCode color={Theme.colors.primary} size={24} />
              <Text style={styles.qrTitle}>MÃ ĐỊNH DANH XE</Text>
            </View>

            <View style={styles.qrContent}>
              <View style={styles.qrBackground}>
                <QrCode color="#000" size={200} />
              </View>
              <Text style={styles.qrBikeName}>{activeBike.name}</Text>
              <Text style={styles.qrPlate}>{activeBike.plate}</Text>
            </View>
          </GlassCard>

          <ScalePress 
            style={styles.closeBtn} 
            onPress={() => setShowQR(false)}
          >
            <Text style={styles.closeBtnText}>Đóng</Text>
          </ScalePress>
        </View>
      </Modal>

      <Toast ref={toastRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scrollContent: { padding: Theme.spacing.lg },
  header: { marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  title: { color: Theme.colors.text, fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: Theme.colors.subtext, fontSize: 14, marginTop: 4 },
  
  bikeCard: { marginBottom: Theme.spacing.lg, padding: Theme.spacing.md },
  bikeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  imageWrapper: { width: 80, height: 80, borderRadius: 16, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' },
  bikeThumb: { width: '100%', height: '100%' },
  bikeInfo: { flex: 1, marginLeft: Theme.spacing.md },
  bikeName: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  bikePlate: { color: Theme.colors.subtext, fontSize: 14, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Theme.colors.success, marginRight: 6 },
  statusText: { color: Theme.colors.success, fontSize: 10, fontWeight: 'bold' },

  detailGrid: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 16, marginTop: 16 },
  detailItem: { flex: 1 },
  detailLabel: { color: Theme.colors.subtext, fontSize: 10, marginBottom: 4 },
  detailValueRow: { flexDirection: 'row', alignItems: 'center' },
  detailValue: { color: Theme.colors.text, fontSize: 12, fontWeight: '600' },

  section: { marginTop: Theme.spacing.xl },
  sectionTitle: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 },

  warrantyCard: { padding: 20 },
  warrantyInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  warrantyLabel: { color: Theme.colors.subtext, fontSize: 12 },
  warrantyDays: { color: Theme.colors.text, fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  daysUnit: { fontSize: 14, fontWeight: 'normal', color: Theme.colors.subtext },
  warrantyLink: { flexDirection: 'row', alignItems: 'center', marginTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 15 },
  warrantyLinkText: { color: Theme.colors.primary, fontSize: 13, marginRight: 8 },

  timelineContainer: { marginLeft: 5 },
  timelineItem: { flexDirection: 'row' },
  timelineLeft: { alignItems: 'center', marginRight: 15 },
  timelineDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,122,255,0.1)', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  timelineLine: { width: 2, flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: -5 },
  timelineRight: { flex: 1, paddingBottom: 25 },
  timelineCard: { padding: 15 },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  timelineDate: { color: Theme.colors.text, fontSize: 12, fontWeight: 'bold' },
  timelineType: { color: Theme.colors.primary, fontSize: 10, fontWeight: '900' },
  timelineDesc: { color: Theme.colors.subtext, fontSize: 14, marginBottom: 12 },
  timelineFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timelineTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  timelineTagText: { color: Theme.colors.subtext, fontSize: 10, marginLeft: 4 },
  timelinePrice: { color: Theme.colors.text, fontSize: 13, fontWeight: 'bold' },

  addBikeBtn: { marginTop: 20, borderRadius: Theme.radius.lg, overflow: 'hidden', borderStyle: 'dashed', borderWidth: 1, borderColor: Theme.colors.border },
  addBikeGradient: { height: 70, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  addBikeText: { color: Theme.colors.subtext, fontWeight: 'bold', marginLeft: 10 },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.xl },
  closeArea: { ...StyleSheet.absoluteFillObject },
  qrCard: { width: '100%', padding: Theme.spacing.xl },
  qrHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.xl },
  qrTitle: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold', letterSpacing: 1, marginLeft: 10 },
  qrContent: { alignItems: 'center' },
  qrBackground: { backgroundColor: '#fff', padding: 20, borderRadius: 25, marginBottom: Theme.spacing.lg },
  qrBikeName: { color: Theme.colors.text, fontSize: 22, fontWeight: 'bold' },
  qrPlate: { color: Theme.colors.subtext, fontSize: 16, marginTop: 4 },
  closeBtn: { marginTop: Theme.spacing.xl, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 40, paddingVertical: 15, borderRadius: Theme.radius.full },
  closeBtnText: { color: '#fff', fontWeight: 'bold' }
});