import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Dimensions, Image, Linking, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Theme } from '../../theme/Theme';
import { 
  ChevronLeft, 
  MapPin, 
  Truck, 
  Phone, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  ShieldAlert,
  Layers,
  Sparkles,
  ClipboardList
} from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import PulseView from '../../components/PulseView';
import Animated, { FadeInDown, FadeInUp, SlideInDown, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, G, Line, Rect } from 'react-native-svg';
import { useOrderController } from './hooks/useOrderController';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function OrderManageScreen({ navigation }) {
  const { 
    orders, 
    loading, 
    selectedOrder, 
    sheetVisible, 
    openLogistics, 
    closeLogistics 
  } = useOrderController();

  const [showSpareParts, setShowSpareParts] = useState(false);

  const sparePartsList = [
    { name: "Cặp gương chiếu hậu chính hãng", checked: true },
    { name: "Sổ bảo hành và HDSD", checked: true },
    { name: "2 Chìa khóa thông minh (Smartkey)", checked: true },
    { name: "Bộ dụng cụ tháo lắp mini", checked: true },
    { name: "Mũ bảo hiểm AnhEm Motor cao cấp", checked: true },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Đang đồng bộ hồ sơ đơn hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* HEADER BAR */}
      <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={Theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Đơn Hàng & Hồ Sơ 🗺️</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* PIPELINE OVERVIEW BADGE */}
        <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.infoBox}>
          <Layers color={Theme.colors.primary} size={16} />
          <Text style={styles.infoText}>
            Giám sát dòng tiền, hồ sơ hành chính làm biển số và vận chuyển thực tế từ Kho tổng về Biên Hòa.
          </Text>
        </Animated.View>

        {/* ORDERS LIST */}
        {orders.map((order, index) => {
          // Determine status color based on bottleneck
          const cardBorderColor = order.isBottlenecked ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255,255,255,0.06)';

          return (
            <Animated.View 
              key={order.id} 
              entering={FadeInDown.delay(200 + index * 100)} 
              layout={Layout.springify()}
            >
              {order.isBottlenecked ? (
                // Pulse wrapper if bottlenecked
                <PulseView pulseScale={1.01} duration={1500}>
                  <GlassCard style={[styles.orderCard, { borderColor: cardBorderColor, borderWidth: 1 }]} intensity={25}>
                    {renderOrderCardContent(order, openLogistics)}
                  </GlassCard>
                </PulseView>
              ) : (
                <GlassCard style={[styles.orderCard, { borderColor: cardBorderColor }]} intensity={20}>
                  {renderOrderCardContent(order, openLogistics)}
                </GlassCard>
              )}
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* 💻 80% SCREEN HEIGHT BOTTOM SHEET (MÀN HÌNH THEO DÕI LOGISTICS GPS NATIVE) */}
      <Modal
        visible={sheetVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeLogistics}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={styles.bottomSheetContainer}>
            <GlassCard style={styles.sheetCard} intensity={45}>
              
              {/* Sheet Drag Indicator */}
              <View style={styles.dragIndicator} />

              {/* Sheet Header */}
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>Bản Đồ Logistics Real-time 📍</Text>
                  <Text style={styles.sheetSubtitle}>Đơn {selectedOrder?.orderCode} • Tuyến đường Biên Hòa</Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={closeLogistics}>
                  <Text style={{ color: Theme.colors.subtext, fontWeight: 'bold' }}>Đóng</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                {/* FULL-SIZE PREMIUM DARK GPS MAP (SVG VECTOR ILLUSTRATED) */}
                <View style={styles.fullMapWrapper}>
                  <Svg width="100%" height={100} viewBox="0 0 400 300" style={{ height: 260 }}>
                    {/* Grid map lines representing dark theme mapping */}
                    <Line x1="20" y1="50" x2="380" y2="50" stroke="#1E293B" strokeWidth="1" strokeDasharray="5,5" />
                    <Line x1="20" y1="150" x2="380" y2="150" stroke="#1E293B" strokeWidth="1" strokeDasharray="5,5" />
                    <Line x1="20" y1="250" x2="380" y2="250" stroke="#1E293B" strokeWidth="1" strokeDasharray="5,5" />
                    <Line x1="100" y1="10" x2="100" y2="290" stroke="#1E293B" strokeWidth="1" strokeDasharray="5,5" />
                    <Line x1="200" y1="10" x2="200" y2="290" stroke="#1E293B" strokeWidth="1" strokeDasharray="5,5" />
                    <Line x1="300" y1="10" x2="300" y2="290" stroke="#1E293B" strokeWidth="1" strokeDasharray="5,5" />

                    {/* Main Road/Highway Polyline - NEON BLUE GLOW PATH */}
                    <Path 
                      d="M 50 250 Q 150 210 200 130 T 350 50" 
                      fill="none" 
                      stroke="rgba(6, 182, 212, 0.2)" 
                      strokeWidth="8" 
                      strokeLinecap="round" 
                    />
                    <Path 
                      d="M 50 250 Q 150 210 200 130 T 350 50" 
                      fill="none" 
                      stroke="#22D3EE" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                    />

                    {/* Start Point: Kho Tổng (Thu Duc) */}
                    <Circle cx="50" cy="250" r="8" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                    <Circle cx="50" cy="250" r="4" fill="#3B82F6" />
                    
                    {/* End Point: Showroom Biên Hòa */}
                    <Circle cx="350" cy="50" r="10" fill="#06B6D4" fillOpacity="0.2" />
                    <Circle cx="350" cy="50" r="6" fill="#0891B2" stroke="#22D3EE" strokeWidth="2" />
                    
                    {/* Map Text Labels */}
                    <G>
                      <Rect x="20" y="265" width="70" height="18" rx="4" fill="#1E293B" />
                      <Text style={{ fill: '#94A3B8', fontSize: 9, fontWeight: 'bold' }} x="25" y="277">KHO TỔNG</Text>
                    </G>
                    <G>
                      <Rect x="290" y="20" width="90" height="18" rx="4" fill="#0B132B" />
                      <Text style={{ fill: '#22D3EE', fontSize: 9, fontWeight: 'bold' }} x="295" y="32">SHOWROOM BH 🏁</Text>
                    </G>

                    {/* Live driver coordinates moving truck - Pulsing green truck */}
                    <G>
                      {/* Ring glow */}
                      <Circle cx="160" cy="180" r="16" fill="rgba(16, 185, 129, 0.15)" />
                      <Circle cx="160" cy="180" r="10" fill="rgba(16, 185, 129, 0.3)" />
                      {/* Truck core dot */}
                      <Circle cx="160" cy="180" r="5" fill="#10B981" />
                      
                      <Rect x="135" y="198" width="60" height="16" rx="4" fill="#10B981" />
                      <Text style={{ fill: '#fff', fontSize: 8, fontWeight: 'bold' }} x="141" y="209">Tài xế H. Đang đi</Text>
                    </G>

                  </Svg>
                </View>

                {/* Driver info block */}
                <View style={styles.driverCard}>
                  <View style={styles.driverInfoRow}>
                    <View style={styles.truckIconCircle}>
                      <Truck color="#10B981" size={24} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.driverName}>Tài xế: {selectedOrder?.driverName}</Text>
                      <Text style={styles.driverStatus}>Đang lái xe lồng trung chuyển • 60C-999.88</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.callIconBtn}
                      onPress={() => Linking.openURL(`tel:${selectedOrder?.driverPhone}`)}
                    >
                      <Phone color="#fff" size={18} />
                    </TouchableOpacity>
                  </View>

                  {/* ETA Countdown bar */}
                  <View style={styles.etaBar}>
                    <Sparkles color="#F59E0B" size={16} />
                    <Text style={styles.etaText}>
                      Dự kiến cập bến Showroom sau <Text style={{ color: '#F59E0B', fontWeight: 'bold' }}>{selectedOrder?.etaMinutes} phút</Text> (Theo lộ trình QL1A)
                    </Text>
                  </View>
                </View>

                {/* SPARE PARTS CHECKLIST ACCORDION */}
                <TouchableOpacity 
                  style={styles.partsAccordionHeader}
                  onPress={() => setShowSpareParts(!showSpareParts)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ClipboardList color={Theme.colors.primary} size={18} />
                    <Text style={styles.partsAccordionTitle}>Danh sách phụ tùng đi kèm xe</Text>
                  </View>
                  <ChevronRight 
                    color={Theme.colors.subtext} 
                    size={18} 
                    style={{ transform: [{ rotate: showSpareParts ? '90deg' : '0deg' }] }} 
                  />
                </TouchableOpacity>

                {showSpareParts && (
                  <View style={styles.partsListContainer}>
                    {sparePartsList.map((part, idx) => (
                      <View key={idx} style={styles.partItem}>
                        <CheckCircle2 color={Theme.colors.success} size={16} />
                        <Text style={styles.partName}>{part.name}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>

            </GlassCard>
          </Animated.View>
        </View>
      </Modal>

    </View>
  );
}

// RENDER ORDER CARD CONTENT
function renderOrderCardContent(order, openLogistics) {
  return (
    <View>
      
      {/* PHẦN 1: KHỐI THÔNG TIN CỐT LÕI (ORDER OVERVIEW) */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderCodeText}>{order.orderCode}</Text>
          <Text style={styles.vehicleText}>{order.vehicleName}</Text>
        </View>
        
        <View style={[styles.financeBadge, { backgroundColor: order.financialStatus.startsWith('✓') ? 'rgba(5, 150, 105, 0.1)' : 'rgba(59, 130, 246, 0.1)' }]}>
          <Text style={[styles.financeText, { color: order.financialStatus.startsWith('✓') ? Theme.colors.success : Theme.colors.primary }]}>
            {order.financialStatus}
          </Text>
        </View>
      </View>

      {/* PHẦN 2: TIẾN ĐỘ THỦ TỤC & CẢNH BÁO TẮC NGHẼN (HÀNH CHÍNH) */}
      <View style={styles.stagesWrapper}>
        <Text style={styles.stageTitle}>Trạng thái xử lý hồ sơ:</Text>
        
        {/* LINEAR PROGRESS STEPS */}
        <View style={styles.stepsRow}>
          {order.stagesData.map((stage, idx) => {
            const isCompleted = idx < order.currentStage;
            const isCurrent = idx + 1 === order.currentStage;
            
            return (
              <View key={idx} style={styles.stepItem}>
                <View style={styles.stepIndicatorRow}>
                  {/* Step node */}
                  <View style={[
                    styles.stepCircle, 
                    isCompleted && { backgroundColor: Theme.colors.success, borderColor: Theme.colors.success },
                    isCurrent && { backgroundColor: '#3B82F6', borderColor: '#3B82F6' }
                  ]}>
                    {isCompleted ? (
                      <CheckCircle2 color="#fff" size={10} />
                    ) : (
                      <Text style={styles.stepNum}>{idx + 1}</Text>
                    )}
                  </View>
                  {/* Step connector */}
                  {idx < order.stagesData.length - 1 && (
                    <View style={[
                      styles.stepLine,
                      idx + 1 < order.currentStage && { backgroundColor: Theme.colors.success }
                    ]} />
                  )}
                </View>
                <Text style={[styles.stepName, isCurrent && { color: Theme.colors.text, fontWeight: 'bold' }]}>
                  {stage.name}
                </Text>
                <Text style={styles.stepTime}>{stage.time}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* BOTTLE-NECK CORAL RED ALERT PREVIEWS */}
      {order.isBottlenecked && (
        <View style={styles.bottleneckAlertBox}>
          <AlertCircle color="#EF4444" size={16} />
          <Text style={styles.bottleneckAlertText}>{order.bottleneckMessage}</Text>
        </View>
      )}

      {/* PHẦN 3: TÍCH HỢP BẢN ĐỒ VẬN CHUYỂN LOGISTICS PREVIEWS */}
      {order.isTransporting && (
        <View style={styles.logisticsContainer}>
          <Text style={styles.logisticsTitle}>Bản đồ vận tải (Kho tổng ➔ Showroom):</Text>
          
          {/* MINI MAP PREVIEW (DARK MODE MAP API MOCKUP) */}
          <Pressable style={styles.miniMapPressable} onPress={() => openLogistics(order)}>
            <View style={styles.miniMapOverlayContainer}>
              <Svg width="100%" height={100} viewBox="0 0 350 100">
                {/* Dark grids */}
                <Line x1="10" y1="30" x2="340" y2="30" stroke="#1E293B" strokeWidth="1" strokeDasharray="3,3" />
                <Line x1="10" y1="70" x2="340" y2="70" stroke="#1E293B" strokeWidth="1" strokeDasharray="3,3" />
                
                {/* Route path */}
                <Path d="M 30 80 C 120 70, 200 30, 310 20" fill="none" stroke="#22D3EE" strokeWidth="2.5" />
                
                {/* Truck marker */}
                <G>
                  <Circle cx="160" cy="50" r="10" fill="rgba(16, 185, 129, 0.2)" />
                  <Circle cx="160" cy="50" r="4" fill="#10B981" />
                </G>
                
                {/* Start/End marker */}
                <Circle cx="30" cy="80" r="4" fill="#3B82F6" />
                <Circle cx="310" cy="20" r="4" fill="#06B6D4" />
              </Svg>

              <View style={styles.mapTip}>
                <Truck color="#22D3EE" size={12} />
                <Text style={styles.mapTipText}>Chạm để bung bản đồ GPS real-time (80%)</Text>
              </View>
            </View>
          </Pressable>

          {/* Logistics stats bar */}
          <View style={styles.logisticsFooter}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Truck color="#10B981" size={16} />
              <Text style={styles.logisticsDriverText}>
                Tài xế: {order.driverName} • ETA: {order.etaMinutes} phút
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.smallCallBtn}
              onPress={() => Linking.openURL(`tel:${order.driverPhone}`)}
            >
              <Phone color="#fff" size={12} />
              <Text style={styles.smallCallText}>Gọi tài xế</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090E17', paddingHorizontal: Theme.spacing.lg },
  loadingContainer: { flex: 1, backgroundColor: '#090E17', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Theme.colors.subtext, fontSize: 14, marginTop: 16 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: Theme.spacing.xl + 20, 
    marginBottom: Theme.spacing.lg 
  },
  backBtn: { width: 40, height: 40, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center' },
  title: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold' },

  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: 12, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)', marginBottom: 16 },
  infoText: { color: Theme.colors.subtext, fontSize: 12, marginLeft: 8, flex: 1 },

  orderCard: { padding: 18, marginBottom: 16, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  orderCodeText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  vehicleText: { color: Theme.colors.subtext, fontSize: 13, marginTop: 2 },
  
  financeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 0 },
  financeText: { fontSize: 11, fontWeight: 'bold' },

  stagesWrapper: { marginVertical: 12 },
  stageTitle: { color: Theme.colors.text, fontSize: 13, fontWeight: '600', marginBottom: 12 },
  
  stepsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  stepItem: { flex: 1, alignItems: 'center' },
  stepIndicatorRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' },
  stepCircle: { width: 20, height: 20, borderRadius: 0, borderWidth: 2, borderColor: '#1E293B', backgroundColor: '#090E17', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  stepNum: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
  stepLine: { height: 2, backgroundColor: '#1E293B', flex: 1, position: 'absolute', left: '50%', right: '-50%', top: 9, zIndex: 0 },
  
  stepName: { color: Theme.colors.subtext, fontSize: 10, marginTop: 8, textAlign: 'center' },
  stepTime: { color: Theme.colors.subtext, fontSize: 8, opacity: 0.5, marginTop: 2, textAlign: 'center' },

  bottleneckAlertBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 10, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)', marginVertical: 8 },
  bottleneckAlertText: { color: '#EF4444', fontSize: 11, fontWeight: 'bold', marginLeft: 8 },

  logisticsContainer: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 14, marginTop: 12 },
  logisticsTitle: { color: Theme.colors.text, fontSize: 13, fontWeight: '600', marginBottom: 10 },
  
  miniMapPressable: { borderRadius: 0, overflow: 'hidden', borderWidth: 1, borderColor: '#1E293B', backgroundColor: '#0B0F19' },
  miniMapOverlayContainer: { position: 'relative', height: 100 },
  mapTip: { position: 'absolute', bottom: 6, right: 6, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(11, 15, 25, 0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 0 },
  mapTipText: { color: '#22D3EE', fontSize: 9, fontWeight: 'bold', marginLeft: 4 },

  logisticsFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  logisticsDriverText: { color: Theme.colors.subtext, fontSize: 11, marginLeft: 8 },
  smallCallBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 0 },
  smallCallText: { color: '#fff', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },

  // Bottom Sheet modal style
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  bottomSheetContainer: { height: screenHeight * 0.8, borderTopLeftRadius: 0, borderTopRightRadius: 0, overflow: 'hidden' },
  sheetCard: { flex: 1, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTopWidth: 2, borderTopColor: Theme.colors.primary, padding: 24 },
  
  dragIndicator: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 0, alignSelf: 'center', marginBottom: 16 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  sheetTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  sheetSubtitle: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2 },
  closeBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 0, backgroundColor: 'rgba(255,255,255,0.06)' },

  fullMapWrapper: { flex: 1, backgroundColor: '#050B14', borderRadius: 0, borderWidth: 1, borderColor: '#1E293B', overflow: 'hidden', marginBottom: 20 },

  driverCard: { padding: 16, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 20 },
  driverInfoRow: { flexDirection: 'row', alignItems: 'center' },
  truckIconCircle: { width: 44, height: 44, borderRadius: 0, backgroundColor: 'rgba(16, 185, 129, 0.12)', justifyContent: 'center', alignItems: 'center' },
  driverName: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  driverStatus: { color: Theme.colors.subtext, fontSize: 11, marginTop: 2 },
  callIconBtn: { width: 40, height: 40, borderRadius: 0, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },

  etaBar: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)', paddingTop: 12, marginTop: 12 },
  etaText: { color: Theme.colors.subtext, fontSize: 12, marginLeft: 8 },

  partsAccordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 4 },
  partsAccordionTitle: { color: '#fff', fontSize: 14, fontWeight: '600', marginLeft: 8 },
  
  partsListContainer: { paddingVertical: 12, paddingHorizontal: 12 },
  partItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  partName: { color: Theme.colors.subtext, fontSize: 13, marginLeft: 8 }
});
