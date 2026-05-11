import React, { useState } from 'react';
import { BlurView } from 'expo-blur';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import { Theme } from '../../theme/Theme';
import { QrCode, Wrench, ChevronRight, History, Plus, AlertCircle } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';

const { width } = Dimensions.get('window');

export default function MyVehiclesScreen({ navigation }) {
  const myBikes = [
    { 
      id: '1', 
      name: 'Kawasaki Z1000', 
      plate: '59-A3 123.45', 
      status: 'Hoạt động tốt',
      odo: '12,500 km',
      nextMaintenance: '13,000 km',
      reminders: [
        { id: 'r1', type: 'Oil', label: 'Thay nhớt sau 500km', color: Theme.colors.warning },
        { id: 'r2', type: 'Insurance', label: 'Bảo hiểm hết hạn sau 5 ngày', color: Theme.colors.error }
      ]
    },
  ];
  const [showQR, setShowQR] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* I.2 HEADER (STRATEGY: VEHICLE PORTFOLIO) */}
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <Text style={styles.title}>Nhà xe của bạn 🏠</Text>
          <Text style={styles.subtitle}>Quản lý lịch sử & Chứng nhận điện tử</Text>
        </Animated.View>
        
        {myBikes.map((bike, index) => (
          <Animated.View key={bike.id} entering={FadeInDown.delay(200 + index * 100)}>
            <GlassCard style={styles.bikeCard} intensity={15}>
              <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => navigation.navigate('VehicleDetail', { motor: bike, isOwned: true })}
              >
                <View style={styles.bikeHeader}>
                  <View style={styles.imageWrapper}>
                    <Image 
                      source={{ uri: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070' }} 
                      style={styles.bikeThumb} 
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.bikeInfo}>
                    <Text style={styles.bikeName}>{bike.name}</Text>
                    <Text style={styles.bikePlate}>{bike.plate}</Text>
                    <View style={styles.statusBadge}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>{bike.status}</Text>
                    </View>
                  </View>
                  <ChevronRight color={Theme.colors.subtext} size={20} />
                </View>

                {/* SMART REMINDERS (NHẮC NHỞ THÔNG MINH) */}
                <View style={styles.remindersRow}>
                  {bike.reminders.map(r => (
                    <View key={r.id} style={[styles.reminderTag, { backgroundColor: r.color + '15' }]}>
                      <AlertCircle color={r.color} size={12} />
                      <Text style={[styles.reminderText, { color: r.color }]}>{r.label}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>

              <View style={styles.actionGrid}>
                <ScalePress style={styles.actionItem} onPress={() => setShowQR(true)}>
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                    <QrCode color={Theme.colors.primary} size={20} />
                  </View>
                  <Text style={styles.actionLabel}>Chứng nhận</Text>
                </ScalePress>
                
                <ScalePress style={styles.actionItem} onPress={() => navigation.navigate('ServiceHistory', { vehicle: bike })}>
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                    <History color="#F59E0B" size={20} />
                  </View>
                  <Text style={styles.actionLabel}>Lịch sử</Text>
                </ScalePress>

                <ScalePress 
                  style={styles.actionItem}
                  onPress={() => navigation.navigate('Booking', { vehicle: bike })}
                >
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                    <Wrench color="#10B981" size={20} />
                  </View>
                  <Text style={styles.actionLabel}>Đặt lịch</Text>
                </ScalePress>
              </View>
            </GlassCard>
          </Animated.View>
        ))}

        <ScalePress style={styles.addBikeBtn}>
          <LinearGradient
            colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
            style={styles.addBikeGradient}
          >
            <Plus color={Theme.colors.subtext} size={24} />
            <Text style={styles.addBikeText}>Mua xe mới tại AnhEmMotor</Text>
          </LinearGradient>
        </ScalePress>
      </ScrollView>

      {/* QR Modal Overlay */}
      <Modal visible={showQR} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
          <TouchableOpacity 
            style={styles.closeArea} 
            activeOpacity={1} 
            onPress={() => setShowQR(false)} 
          />
          
          <GlassCard style={styles.qrCard} intensity={40}>
            <View style={styles.qrHeader}>
              <View style={styles.qrIconBox}>
                <QrCode color={Theme.colors.primary} size={24} />
              </View>
              <Text style={styles.qrTitle}>CHỨNG NHẬN BẢO HÀNH</Text>
            </View>

            <View style={styles.qrContent}>
              <View style={styles.qrBackground}>
                <QrCode color="#000" size={200} />
              </View>
              <Text style={styles.qrBikeName}>{myBikes[0].name}</Text>
              <Text style={styles.qrPlate}>{myBikes[0].plate}</Text>
            </View>

            <View style={styles.qrFooter}>
              <Text style={styles.qrHint}>Dùng để đối soát khi đi bảo trì định kỳ</Text>
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
  imageWrapper: { width: 90, height: 60, borderRadius: Theme.radius.md, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' },
  bikeThumb: { width: '100%', height: '100%' },
  bikeInfo: { flex: 1, marginLeft: Theme.spacing.md },
  bikeName: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  bikePlate: { color: Theme.colors.subtext, fontSize: 14, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Theme.radius.sm, marginTop: Theme.spacing.xs },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Theme.colors.success, marginRight: 6 },
  statusText: { color: Theme.colors.success, fontSize: 10, fontWeight: 'bold' },

  remindersRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  reminderTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8, marginTop: 4 },
  reminderText: { fontSize: 10, fontWeight: 'bold', marginLeft: 6 },
  
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: Theme.spacing.md },
  actionItem: { alignItems: 'center', flex: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  actionLabel: { color: Theme.colors.text, fontSize: 11, fontWeight: '500' },
  
  addBikeBtn: { borderRadius: Theme.radius.lg, overflow: 'hidden', borderStyle: 'dashed', borderWidth: 1, borderColor: Theme.colors.border },
  addBikeGradient: { height: 70, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  addBikeText: { color: Theme.colors.subtext, fontWeight: 'bold', marginLeft: 10 },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.xl },
  closeArea: { ...StyleSheet.absoluteFillObject },
  qrCard: { width: '100%', padding: Theme.spacing.xl },
  qrHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.xl },
  qrIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(59, 130, 246, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  qrTitle: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  qrContent: { alignItems: 'center' },
  qrBackground: { backgroundColor: '#fff', padding: 20, borderRadius: 25, marginBottom: Theme.spacing.lg },
  qrBikeName: { color: Theme.colors.text, fontSize: 22, fontWeight: 'bold' },
  qrPlate: { color: Theme.colors.subtext, fontSize: 16, marginTop: 4 },
  qrFooter: { marginTop: Theme.spacing.xl, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: Theme.spacing.md, width: '100%', alignItems: 'center' },
  qrHint: { color: Theme.colors.subtext, fontSize: 12 },
  
  closeBtn: { marginTop: Theme.spacing.xl, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 40, paddingVertical: 15, borderRadius: Theme.radius.full },
  closeBtnText: { color: '#fff', fontWeight: 'bold' }
});