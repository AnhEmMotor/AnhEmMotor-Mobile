import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image, Linking, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Theme, useActiveColors } from '../../../theme/Theme';
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
  ChevronLeft
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
    backgroundColor: colors.card, 
    borderRadius: 0, 
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
    paddingVertical: 12, 
    borderRadius: 0 
  },
  activeTab: { backgroundColor: colors.primary },
  tabText: { color: colors.subtext, fontWeight: '600', marginLeft: 8, fontSize: 14 },
  activeTabText: { color: '#fff' },

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
  bikeText: { color: colors.subtext, fontSize: 13, marginLeft: 8 },
  bikeBold: { color: colors.text, fontWeight: '600' },

  assignedSaleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, backgroundColor: colors.primary + '0D', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 0, borderWidth: 1, borderColor: colors.primary + '1A' },
  assignedSaleText: { color: colors.subtext, fontSize: 12, marginLeft: 8 },

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
  infoText: { color: colors.subtext, fontSize: 12, marginLeft: 8, flex: 1 },

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
  staffStatusText: { color: colors.subtext, fontSize: 11, marginTop: 2 },

  workshopStepperContainer: { marginVertical: 12, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  workshopStepperTitle: { color: colors.text, fontSize: 13, fontWeight: '600', marginBottom: 12 },
  workshopStepsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  workshopStepItem: { flex: 1, alignItems: 'center' },
  workshopStepCircle: { width: 18, height: 18, borderRadius: 0, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  workshopStepNum: { color: colors.subtext, fontSize: 9, fontWeight: 'bold' },
  workshopStepLine: { height: 2, backgroundColor: colors.border, flex: 1, position: 'absolute', left: '50%', right: '-50%', top: 8, zIndex: 0 },
  workshopStepLabel: { color: colors.subtext, fontSize: 10, marginTop: 6, textAlign: 'center' },
});

export default function AppointmentManageScreen({ navigation }) {
  const colors = useActiveColors();
  const styles = getStyles(colors);

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
          <Text style={[styles.title, (navigation && navigation.canGoBack && navigation.canGoBack()) && { marginLeft: 10 }]}>Lịch Showroom 📅</Text>
        </View>
        
        <View style={styles.tabContainer}>
          <Pressable 
            style={[styles.tab, activeTab === 'test_drive' && styles.activeTab]} 
            onPress={() => setActiveTab('test_drive')}
          >
            <Bike color={activeTab === 'test_drive' ? '#fff' : colors.subtext} size={18} />
            <Text style={[styles.tabText, activeTab === 'test_drive' && styles.activeTabText]}>Lịch Lái Thử</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'service' && styles.activeTab]} 
            onPress={() => setActiveTab('service')}
          >
            <CalendarIcon color={activeTab === 'service' ? '#fff' : colors.subtext} size={18} />
            <Text style={[styles.tabText, activeTab === 'service' && styles.activeTabText]}>Lịch Dịch Vụ</Text>
          </Pressable>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {activeTab === 'test_drive' ? (
          
          /* 🏎️ LỊCH LÁI THỬ (100% CHIỀU DỌC - QUY TẮC 3 GIÂY) */
          <View>
            <View style={styles.dateSelector}>
              <Text style={styles.dateLabel}>Tiếp nhận khách mới</Text>
              <Pressable style={styles.calendarBtn} onPress={refreshAppointments}>
                <Clock color={colors.primary} size={18} />
              </Pressable>
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
                  <GlassCard style={styles.appointmentCard}>
                    {/* Dòng 1: Trạng thái & Giờ */}
                    <View style={styles.cardRow1}>
                      <Text style={styles.timeText}>{item.timeSlot}</Text>
                      {item.status === 'pending' ? (
                        <View style={[styles.badge, styles.badgePending]}>
                          <View style={[styles.badgeDot, { backgroundColor: colors.error }]} />
                          <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={[styles.badgeText, { color: colors.error }]}>Chờ phân bổ</Text>
                        </View>
                      ) : (
                        <View style={[styles.badge, styles.badgeSuccess]}>
                          <View style={[styles.badgeDot, { backgroundColor: colors.success }]} />
                          <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={[styles.badgeText, { color: colors.success }]}>Đã chỉ định</Text>
                        </View>
                      )}
                    </View>

                    {/* Dòng 2: Tên Khách Hàng (VIẾT HOA, CỠ LỚN) */}
                    <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.customerName}>{item.customerName}</Text>

                    {/* Dòng 3: Chi Tiết Xe */}
                    <View style={styles.bikeInfoRow}>
                      <Bike color={colors.subtext} size={16} />
                      <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.bikeText}>Xe lái thử: <Text style={styles.bikeBold}>{item.vehicleName}</Text></Text>
                    </View>

                    {/* Hiển thị nhân viên được chỉ định nếu đã có */}
                    {item.assignedSaleName && (
                      <View style={styles.assignedSaleRow}>
                        <Users color={colors.primary} size={14} />
                        <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.assignedSaleText}>Sale phụ trách: <Text style={{ color: colors.text, fontWeight: '600' }}>{item.assignedSaleName}</Text></Text>
                      </View>
                    )}

                    {/* Dòng 4: Cụm Nút Hành Động 1-Chạm (One-Touch) */}
                    <View style={styles.actionRow}>
                      {/* Nút phụ: Gọi điện */}
                      <TouchableOpacity 
                        style={styles.callIconBtn} 
                        onPress={() => Linking.openURL(`tel:${item.customerPhone}`)}
                      >
                        <Phone color={colors.text} size={18} />
                      </TouchableOpacity>

                      {/* Nút chính: Chỉ định Sale */}
                      <TouchableOpacity 
                        style={[styles.mainActionBtn, { backgroundColor: item.status === 'pending' ? colors.primary : colors.primary + '38', borderColor: item.status === 'pending' ? colors.primary : colors.primary + '66', borderWidth: 1 }]}
                        onPress={() => openAssignModal(item.id)}
                      >
                        <Users color={item.status === 'pending' ? '#fff' : colors.primary} size={18} />
                        <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={[styles.mainActionBtnText, { color: item.status === 'pending' ? '#fff' : colors.primary, marginLeft: 8 }]}>
                          {item.status === 'pending' ? 'Chỉ định Sale' : 'Đổi nhân viên'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                  </GlassCard>
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
                  <GlassCard style={styles.appointmentCard}>
                    {/* Dòng 1: Giờ & Biển Số Viết Hoa Nổi Bật */}
                    <View style={styles.cardRow1}>
                      <Text style={styles.timeText}>{item.timeSlot}</Text>
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
          <GlassCard style={styles.modalContent} intensity={40}>
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
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
}
