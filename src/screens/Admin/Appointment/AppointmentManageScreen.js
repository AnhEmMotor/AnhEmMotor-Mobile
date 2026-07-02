import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image, Linking, TouchableOpacity, Modal, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { Theme, useTheme } from '../../../theme/Theme';
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
  Users,
  Award,
  AlertCircle,
  ChevronLeft,
  Search,
  Plus
} from 'lucide-react-native';
import GlassCard from '../../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppointmentController } from './useAppointmentController';

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: Theme.spacing.lg },
  loadingContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: colors.subtext, fontSize: 14, marginTop: 16 },
  header: { marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  backBtn: { width: 38, height: 38, borderRadius: 0, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center' },
  title: { color: colors.text, fontSize: 28, fontWeight: 'bold' },
  
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: colors.surface, 
    borderRadius: 8, 
    padding: 4, 
    marginTop: Theme.spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10, 
    borderRadius: 6 
  },
  activeTab: { backgroundColor: colors.primary },
  tabText: { color: colors.subtext, fontWeight: '600', fontSize: 14 },
  activeTabText: { color: '#fff' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 8, paddingHorizontal: 12, marginTop: 16, height: 44, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, marginLeft: 8, color: colors.text, fontSize: 14 },
  
  filterContainer: { flexDirection: 'row', marginTop: 12, marginBottom: 4 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  filterChipActive: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.primary + '1A', borderWidth: 1, borderColor: colors.primary, marginRight: 8 },
  filterText: { color: colors.subtext, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: colors.primary, fontSize: 13, fontWeight: '600' },

  overviewContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surface, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginVertical: 12 },
  overviewItem: { alignItems: 'center', flex: 1 },
  overviewValue: { fontSize: 18, fontWeight: 'bold', marginTop: 4, color: colors.text },
  overviewLabel: { fontSize: 12, color: colors.subtext, marginTop: 2, textAlign: 'center' },

  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },

  dateSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: Theme.spacing.md },
  dateLabel: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  calendarBtn: { backgroundColor: colors.card, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border },

  emptyCard: { padding: 30, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.subtext, fontSize: 14, marginTop: 8 },

  appointmentCard: { marginBottom: Theme.spacing.md, padding: 16, overflow: 'hidden' },
  
  cardRow1: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  timeText: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 0 },
  badgePending: { backgroundColor: colors.error + '1A' },
  badgeSuccess: { backgroundColor: colors.success + '1A' },
  badgeDot: { width: 6, height: 6, borderRadius: 0, marginRight: 6 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },

  customerName: { color: colors.text, fontSize: 16, fontWeight: '900', textTransform: 'uppercase', marginBottom: 8 },
  
  bikeInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bikeText: { color: colors.text, fontSize: 13, marginLeft: 8 },
  bikeBold: { color: colors.text, fontWeight: '600' },

  assignedSaleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, backgroundColor: colors.primary + '0D', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 0, borderWidth: 1, borderColor: colors.primary + '1A' },
  assignedSaleText: { color: colors.text, fontSize: 12, marginLeft: 8 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  callIconBtn: { width: 44, height: 44, borderRadius: 0, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  mainActionBtn: { flex: 1, flexDirection: 'row', height: 44, borderRadius: 0, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  mainActionBtnText: { fontSize: 14, fontWeight: 'bold' },

  plateContainer: { backgroundColor: colors.surface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 0, borderWidth: 1, borderColor: colors.border },
  plateText: { color: colors.text, fontSize: 14, fontWeight: 'bold', letterSpacing: 0.5 },
  
  ownerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  ownerName: { color: colors.text, fontSize: 15, fontWeight: '700', textTransform: 'uppercase' },
  rankBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 0 },
  rankText: { fontSize: 11, fontWeight: 'bold', marginLeft: 4 },

  serviceRequestBox: { backgroundColor: colors.surface, padding: 10, borderRadius: 0, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  requestLabel: { color: colors.subtext, fontSize: 11, fontWeight: 'bold' },
  requestContent: { color: colors.text, fontSize: 13, marginTop: 2 },

  statusIndicatorBox: { flex: 1, flexDirection: 'row', height: 44, borderRadius: 0, borderWidth: 1, borderColor: colors.success + '33', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  statusIndicatorText: { color: '#10B981', fontSize: 13, fontWeight: 'bold', marginLeft: 8 },

  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '1A', padding: 12, borderRadius: 0, borderWidth: 1, borderColor: colors.primary + '33', marginBottom: 16 },
  infoText: { color: colors.text, fontSize: 12, marginLeft: 8, flex: 1 },

  modalOverlay: { flex: 1, backgroundColor: colors.modalOverlay, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: 24, maxHeight: '60%', borderTopWidth: 2, borderTopColor: colors.primary },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: 'bold' },
  closeBtn: { padding: 4 },
  modalSubtitle: { color: colors.subtext, fontSize: 13, marginBottom: 16 },
  
  staffList: { marginTop: 8 },
  staffItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  staffInfoCol: { flexDirection: 'row', alignItems: 'center' },
  staffAvatar: { width: 44, height: 44, borderRadius: 0, borderWidth: 1.5, borderColor: colors.border },
  staffOnlineDot: { width: 12, height: 12, borderRadius: 0, backgroundColor: colors.success, position: 'absolute', right: 0, bottom: 0, borderWidth: 2, borderColor: colors.background },
  staffOnlineDotInactive: { backgroundColor: '#64748B' },
  staffNameText: { color: colors.text, fontSize: 15, fontWeight: 'bold' },
  staffStatusText: { color: colors.text, fontSize: 11, marginTop: 2 },

  workshopStepperContainer: { marginVertical: 12, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  workshopStepperTitle: { color: colors.text, fontSize: 13, fontWeight: '600', marginBottom: 12 },
  workshopStepsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  workshopStepItem: { flex: 1, alignItems: 'center' },
  workshopStepCircle: { width: 18, height: 18, borderRadius: 0, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  workshopStepNum: { color: colors.text, fontSize: 9, fontWeight: 'bold' },
  workshopStepLine: { height: 2, backgroundColor: colors.border, flex: 1, position: 'absolute', left: '50%', right: '-50%', top: 8, zIndex: 0 },
  workshopStepLabel: { color: colors.text, fontSize: 10, marginTop: 6, textAlign: 'center' },
});

export default function AppointmentManageScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const primaryColor = colors.primary || Theme.staticColors.primary;
  const pendingTextColor = colors.isDark ? '#fff' : colors.text;
  const actionContentColor = colors.isDark ? '#fff' : primaryColor;

  const { 
    appointments, 
    staff, 
    loading, 
    activeTab, 
    setActiveTab, 
    assignSale, 
    startService, 
    advanceStage,
    refreshAppointments 
  } = useAppointmentController();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const openAssignModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setModalVisible(true);
  };

  const handleSelectStaff = async (saleId, saleName) => {
    if (selectedAppointmentId) {
      try {
        await assignSale(selectedAppointmentId, saleId, saleName);
        setModalVisible(false);
        setSelectedAppointmentId(null);
      } catch (error) {
        console.error("Lỗi khi gán Sale:", error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Đang đồng bộ lịch hẹn...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* HEADER & TABS */}
      <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {navigation && navigation.canGoBack && navigation.canGoBack() && (
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <ChevronLeft color={colors.text} size={20} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, (navigation && navigation.canGoBack && navigation.canGoBack()) && { marginLeft: 10 }]}>LỊCH SHOWROOM</Text>
        </View>
        <Text style={{ color: colors.text, fontSize: 16, marginTop: 8, fontWeight: '600' }}>Hôm nay, 06/06/2026</Text>
        <Text style={{ color: colors.subtext, fontSize: 14, marginTop: 4 }}>12 lịch lái thử • 4 lịch dịch vụ</Text>
        
        <View style={styles.tabContainer}>
          <Pressable 
            style={[styles.tab, activeTab === 'test_drive' && styles.activeTab]} 
            onPress={() => setActiveTab('test_drive')}
          >
            <Text style={[styles.tabText, activeTab === 'test_drive' && styles.activeTabText]}>Lái thử (12)</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'service' && styles.activeTab]} 
            onPress={() => setActiveTab('service')}
          >
            <Text style={[styles.tabText, activeTab === 'service' && styles.activeTabText]}>Dịch vụ (4)</Text>
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <Search color={colors.subtext} size={18} />
          <TextInput placeholder="Tìm khách hàng..." style={styles.searchInput} placeholderTextColor={colors.subtext} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterChipActive}>
            <Text style={styles.filterTextActive}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Chờ phân bổ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Đã phân công</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Đã xác nhận</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {activeTab === 'test_drive' ? (
          
          /* 🏎️ LỊCH LÁI THỬ (100% CHIỀU DỌC - QUY TẮC 3 GIÂY) */
          <View>
            {/* TỔNG QUAN */}
            <View style={styles.overviewContainer}>
              <View style={styles.overviewItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error, marginRight: 6 }} />
                  <Text style={styles.overviewValue}>4</Text>
                </View>
                <Text style={styles.overviewLabel}>Chờ phân bổ</Text>
              </View>
              <View style={styles.overviewItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success, marginRight: 6 }} />
                  <Text style={styles.overviewValue}>6</Text>
                </View>
                <Text style={styles.overviewLabel}>Đã phân công</Text>
              </View>
              <View style={styles.overviewItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginRight: 6 }} />
                  <Text style={styles.overviewValue}>2</Text>
                </View>
                <Text style={styles.overviewLabel}>Xác nhận</Text>
              </View>
            </View>

            {appointments.length === 0 ? (
              <GlassCard style={styles.emptyCard}>
                <Info color={colors.subtext} size={24} />
                <Text style={styles.emptyText}>Hôm nay chưa có lịch lái thử</Text>
              </GlassCard>
            ) : (
              appointments.map((item, index) => (
                <Animated.View 
                  key={item.id} 
                  entering={FadeInDown.delay(index * 100)} 
                  layout={Layout.springify()}
                >
                  <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('AdminAppointmentDetail', { appointment: item })}>
                    <GlassCard style={[styles.appointmentCard, { padding: 12 }]}>
                      {/* Dòng 1: Giờ & Trạng thái nằm ngang */}
                      <View style={[styles.cardRow1, { marginBottom: 8 }]}>
                        <Text style={styles.timeText}>{item.timeSlot}{item.date ? ` - ${item.date}` : ''}</Text>
                      {item.status === 'pending' ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error, marginRight: 6 }} />
                          <Text style={{ fontSize: 13, color: colors.error, fontWeight: 'bold' }}>Chờ phân bổ</Text>
                        </View>
                      ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success, marginRight: 6 }} />
                          <Text style={{ fontSize: 13, color: colors.success, fontWeight: 'bold' }}>Đã phân công</Text>
                        </View>
                      )}
                    </View>

                    {/* Dòng 2: Tên Khách Hàng */}
                    <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={[styles.customerName, { marginBottom: 4 }]}>{item.customerName}</Text>

                    {/* Dòng 3: Chi Tiết Xe */}
                    <View style={[styles.bikeInfoRow, { marginBottom: 4 }]}>
                      <Text style={{ fontSize: 14, color: colors.text }}>🏍</Text>
                      <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={[styles.bikeText, { marginLeft: 6 }]}>{item.vehicleName}</Text>
                    </View>

                    {/* Hiển thị nhân viên được chỉ định nếu đã có */}
                    {item.assignedSaleName && (
                      <View style={[styles.bikeInfoRow, { marginBottom: 4 }]}>
                        <Text style={{ fontSize: 14, color: colors.text }}>👤</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={[styles.bikeText, { marginLeft: 6, fontWeight: '600' }]}>{item.assignedSaleName}</Text>
                      </View>
                    )}

                    {/* Dòng 4: Cụm Nút Hành Động Ngắn Gọn */}
                    <View style={[styles.actionRow, { marginTop: 8, paddingTop: 8 }]}>
                      <TouchableOpacity 
                        style={[styles.callIconBtn, { width: 36, height: 36, borderRadius: 18 }]} 
                        onPress={() => Linking.openURL(`tel:${item.customerPhone}`)}
                      >
                        <Phone color={colors.text} size={16} />
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={[
                          styles.mainActionBtn,
                          {
                            height: 36, borderRadius: 6, backgroundColor: 'transparent',
                            justifyContent: 'flex-start', marginLeft: 16, flex: 1, borderWidth: 0
                          }
                        ]}
                        onPress={() => openAssignModal(item.id)}
                      >
                        <Text style={{ fontSize: 14, color: colors.text }}>{item.status === 'pending' ? '👤' : '🔄'}</Text>
                        <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={[styles.mainActionBtnText, { color: actionContentColor, marginLeft: 8, fontSize: 14 }]}>
                          {item.status === 'pending' ? 'Chỉ định Sale' : 'Đổi nhân viên'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    </GlassCard>
                  </TouchableOpacity>
                </Animated.View>
              ))
            )}
          </View>
        ) : (
          
          /* 🛠️ LỊCH DỊCH VỤ (BẢO DƯỠNG/SỬA CHỮA) */
          <View>
            <View style={styles.infoBox}>
              <Info color={colors.primary} size={16} />
              <Text style={styles.infoText}>Điều phối Kỹ thuật viên bảo dưỡng xe của khách hàng theo biển số.</Text>
            </View>

            {appointments.length === 0 ? (
              <GlassCard style={styles.emptyCard}>
                <Info color={colors.subtext} size={24} />
                <Text style={styles.emptyText}>Hôm nay chưa có xe bảo dưỡng</Text>
              </GlassCard>
            ) : (
              appointments.map((item, index) => (
                <Animated.View 
                  key={item.id} 
                  entering={FadeInDown.delay(index * 100)}
                  layout={Layout.springify()}
                >
                  <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('AdminAppointmentDetail', { appointment: item })}>
                    <GlassCard style={styles.appointmentCard}>
                      {/* Dòng 1: Giờ & Biển Số Viết Hoa Nổi Bật */}
                      <View style={styles.cardRow1}>
                        <Text style={styles.timeText}>{item.timeSlot}{item.date ? ` - ${item.date}` : ''}</Text>
                      <View style={styles.plateContainer}>
                        <Text style={styles.plateText}>{item.licensePlate}</Text>
                      </View>
                    </View>

                    {/* Dòng 2: Tên Chủ Xe & Hạng Thành Viên */}
                    <View style={styles.ownerRow}>
                      <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.ownerName}>{item.customerName}</Text>
                      <View style={[styles.rankBadge, { backgroundColor: item.customerRank === 'Gold' ? 'rgba(217, 119, 6, 0.25)' : 'rgba(148, 163, 184, 0.25)', borderColor: item.customerRank === 'Gold' ? '#D9770666' : '#94A3B866', borderWidth: 1 }]}>
                        <Award color={item.customerRank === 'Gold' ? '#D97706' : '#94A3B8'} size={12} />
                        <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={[styles.rankText, { color: item.customerRank === 'Gold' ? '#D97706' : '#94A3B8' }]}>
                          Hạng {item.customerRank}
                        </Text>
                      </View>
                    </View>

                    {/* Dòng 3: Yêu Cầu Sửa Chữa (Gói bệnh xe) */}
                    <View style={styles.serviceRequestBox}>
                      <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.requestLabel}>Yêu cầu:</Text>
                      <Text numberOfLines={2} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.requestContent}>{item.serviceRequest}</Text>
                    </View>

                    {/* HÀNG ĐỢI SỬA CHỮA REAL-TIME (LIVE WORKSHOP QUEUE) */}
                    {item.status === 'in_garage' && (
                      <View style={styles.workshopStepperContainer}>
                        <Text style={styles.workshopStepperTitle}>Hàng đợi sửa chữa (Service Queue):</Text>
                        <View style={styles.workshopStepsRow}>
                          {['Kiểm tra', 'Sửa chữa', 'Rửa xe', 'Sẵn sàng'].map((stageName, idx) => {
                            const stepNum = idx + 1;
                            const isCompleted = stepNum < item.serviceStage;
                            const isCurrent = stepNum === item.serviceStage;
                            return (
                              <View key={idx} style={styles.workshopStepItem}>
                                <View style={styles.stepIndicatorRow}>
                                  <View style={[
                                    styles.workshopStepCircle,
                                    isCompleted && { backgroundColor: colors.success, borderColor: colors.success },
                                    isCurrent && { backgroundColor: colors.primary, borderColor: colors.primary }
                                  ]}>
                                    {isCompleted ? (
                                      <Check color="#fff" size={8} />
                                    ) : (
                                      <Text style={[styles.workshopStepNum, isCurrent && { color: '#fff' }]}>{stepNum}</Text>
                                    )}
                                  </View>
                                  {idx < 3 && (
                                    <View style={[
                                      styles.workshopStepLine,
                                      stepNum < item.serviceStage && { backgroundColor: colors.success }
                                    ]} />
                                  )}
                                </View>
                                <Text style={[styles.workshopStepLabel, isCurrent && { color: colors.text, fontWeight: 'bold' }]}>
                                  {stageName}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    )}

                    {/* Dòng 4: Cụm Nút Hành Động 1-Chạm */}
                    <View style={styles.actionRow}>
                      {/* Nút phụ: Gọi điện */}
                      <TouchableOpacity 
                        style={styles.callIconBtn} 
                        onPress={() => Linking.openURL(`tel:${item.customerPhone}`)}
                      >
                        <Phone color={colors.text} size={18} />
                      </TouchableOpacity>

                      {/* Nút chính: Cho xe vào xưởng hoặc cập nhật tiến độ */}
                      {item.status === 'pending' && (
                        <TouchableOpacity 
                          style={[styles.mainActionBtn, { backgroundColor: colors.success }]}
                          onPress={() => startService(item.id)}
                        >
                          <Check color="#fff" size={18} />
                          <Text style={[styles.mainActionBtnText, { color: '#fff', marginLeft: 8 }]}>
                            Cho xe vào xưởng
                          </Text>
                        </TouchableOpacity>
                      )}

                      {item.status === 'in_garage' && (
                        <TouchableOpacity 
                          style={[
                            styles.mainActionBtn, 
                            { backgroundColor: item.serviceStage === 4 ? '#10B981' : colors.primary + '25' }
                          ]}
                          onPress={() => advanceStage(item.id, item.serviceStage)}
                        >
                          <Check color={item.serviceStage === 4 ? '#fff' : colors.primary} size={18} />
                          <Text style={[
                            styles.mainActionBtnText, 
                            { color: item.serviceStage === 4 ? '#fff' : colors.primary, marginLeft: 8 }
                          ]}>
                            {item.serviceStage === 4 ? 'Bàn giao xe ✓' : 'Tiến cấp chặng ➔'}
                          </Text>
                        </TouchableOpacity>
                      )}

                      {item.status === 'done' && (
                        <View style={[styles.statusIndicatorBox, { backgroundColor: colors.success + '25' }]}>
                          <Check color={colors.success} size={16} />
                          <Text style={styles.statusIndicatorText}>Đã hoàn tất & Giao xe ✓</Text>
                        </View>
                      )}
                    </View>

                    </GlassCard>
                  </TouchableOpacity>
                </Animated.View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* MODAL CHỈ ĐỊNH SALE (STAFF LEADERBOARD VIEW) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.isDark ? '#000' : '#fff' }]}> 
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉ định Sale phụ trách 👥</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <X color={colors.text} size={20} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Chọn nhân viên tư vấn lái thử cho khách hàng:</Text>

            <FlatList
              data={staff}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.staffItem}
                  onPress={() => handleSelectStaff(item.id, item.name)}
                >
                  <View style={styles.staffInfoCol}>
                    <View>
                      <Image source={{ uri: item.avatar }} style={styles.staffAvatar} />
                      {item.active && <View style={styles.staffOnlineDot} />}
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.staffNameText}>{item.name}</Text>
                      <Text style={styles.staffStatusText}>{item.status}</Text>
                    </View>
                  </View>
                  <ChevronRight color={colors.subtext} size={20} />
                </TouchableOpacity>
              )}
              style={styles.staffList}
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab}>
        <Plus color="#fff" size={24} />
      </TouchableOpacity>
    </View>
  );
}
