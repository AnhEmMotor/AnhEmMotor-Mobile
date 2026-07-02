import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Pressable, Modal } from 'react-native';
import { Theme, useActiveColors } from '../../../theme/Theme';
import { Phone, MessageSquare, MoreVertical, Flame, Calendar, ChevronRight, Bike, Plus, X, Clock, User } from 'lucide-react-native';
import GlassCard from '../../../components/GlassCard';
import LeadCard from '../../../components/LeadCard';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  title: { color: colors.text, fontSize: 28, fontWeight: 'bold' },
  subTitle: { color: colors.subtext, fontSize: 13, marginTop: 4 },
  filterBtn: { backgroundColor: colors.card, padding: 12, borderRadius: 0, borderWidth: 1, borderColor: colors.border },

  leadCard: { padding: 20, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  nameSection: { flex: 1 },
  leadName: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  moreBtn: { padding: 4 },
  
  priorityBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 0, marginTop: 8 },
  priorityText: { fontSize: 10, fontWeight: '900', marginLeft: 6, letterSpacing: 1 },
  
  interestBox: { backgroundColor: colors.surface, padding: 16, borderRadius: 0, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  interestRow: { flexDirection: 'row', alignItems: 'center' },
  interestLabel: { color: colors.text, fontSize: 13, marginLeft: 8 },
  interestValue: { color: colors.text, fontSize: 14, fontWeight: 'bold' },
  timeLabel: { color: colors.text, fontSize: 11, marginTop: 8 },

  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16 },
  actionGroup: { flexDirection: 'row' },
  actionBtn: { width: 40, height: 40, borderRadius: 0, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  
  detailBtn: { flexDirection: 'row', alignItems: 'center' },
  detailText: { color: colors.primary, fontWeight: 'bold', fontSize: 13, marginRight: 6 },

  fab: { position: 'absolute', bottom: 30, right: 24, width: 56, height: 56, borderRadius: 0, elevation: 8 },
  fabGradient: { flex: 1, borderRadius: 0, justifyContent: 'center', alignItems: 'center' },

  // Modal styles for 360 customer profile
  modalOverlay: { flex: 1, backgroundColor: colors.modalOverlay, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: 24, maxHeight: '92%', borderTopWidth: 2, borderTopColor: colors.primary, backgroundColor: colors.card },
  dragIndicator: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 0, alignSelf: 'center', marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: 'bold' },
  modalSubtitle: { color: colors.subtext, fontSize: 12, marginTop: 2 },
  closeBtn: { padding: 4 },

  customerSummaryCard: { backgroundColor: colors.glassBg, padding: 16, borderRadius: 0, borderWidth: 1.5, borderColor: colors.border, marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  customerMainInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarCircle: { width: 48, height: 48, borderRadius: 0, borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  customerNameBig: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  customerSubRow: { flexDirection: 'row', alignItems: 'center' },
  timeTagText: { color: colors.subtext, fontSize: 11, marginTop: 4 },
  summaryActions: { flexDirection: 'row', marginLeft: 8 },

  linearStepper: { paddingLeft: 4, marginBottom: 24 },
  stepperItem: { flexDirection: 'row', marginBottom: 20 },
  stepperLeft: { alignItems: 'center', width: 30, marginRight: 14 },
  stepperDot: { width: 22, height: 22, borderRadius: 0, borderWidth: 1, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  stepperNum: { color: colors.text, fontSize: 11, fontWeight: 'bold' },
  stepperLine: { flex: 1, width: 2, backgroundColor: colors.border, marginTop: 4 },
  stepperRight: { flex: 1 },
  stepperHeader: { color: colors.text, fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  stepperContentBox: { backgroundColor: colors.glassBg, padding: 12, borderRadius: 0, borderWidth: 1, borderColor: colors.border },
  stepperText: { color: colors.subtext, fontSize: 13, marginBottom: 4 },
  logItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  logText: { color: colors.subtext, fontSize: 12, flex: 1 },

  modalActionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  closeModalBtn: { flex: 1, height: 48, borderRadius: 0, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  closeModalText: { color: colors.subtext, fontSize: 14, fontWeight: 'bold' },
  confirmBtn: { flex: 2, height: 48, borderRadius: 0, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});

export default function LeadScreen() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const colors = useActiveColors();
  const styles = getStyles(colors);

  const leads = [
    { 
      id: '1', 
      name: 'Nguyễn Văn Khôi', 
      interest: 'Honda SH 160i Thể Thao', 
      status: 'Hot', 
      color: '#EF4444', 
      time: 'Vừa xong',
      phone: '090.876.5432',
      email: 'khoi.nguyenvan@gmail.com',
      notes: 'Khách hàng cực kỳ tiềm năng ở Biên Hòa. Đang muốn đổi xe SH 160i màu Đỏ, mong muốn nhận ưu đãi phí trước bạ. Hẹn xem xe chiều nay lúc 15h30.'
    },
    { 
      id: '2', 
      name: 'Trần Minh Nam', 
      interest: 'Yamaha Exciter 155 VVA', 
      status: 'Warm', 
      color: '#F59E0B', 
      time: '2 giờ trước',
      phone: '091.234.5678',
      email: 'nam.tranminh@gmail.com',
      notes: 'Thích bản Exciter GP màu xanh GP. Đang băn khoăn về lãi suất góp của HD Saison. Sale Nam đang hỗ trợ gửi bảng kê tạm tính.'
    },
    { 
      id: '3', 
      name: 'Lê Thảo Nhi', 
      interest: 'VinFast Klara S', 
      status: 'Cold', 
      color: '#E31B23', 
      time: '1 ngày trước',
      phone: '093.456.7890',
      email: 'nhi.lethao@gmail.com',
      notes: 'Khách đăng ký lái thử xe klara S. Đang tìm hiểu dung lượng pin và chính sách thuê pin mới của VinFast.'
    }
  ];

  const handleOpenLead = (lead) => {
    setSelectedLead(lead);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* II.1 QUICK STATS - LEADS SECTION */}
      <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
        <View>
          <Text style={styles.title}>Quản Lý Lead 🎯</Text>
          <Text style={styles.subTitle}>{leads.length} khách hàng đang quan tâm</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Calendar color={colors.text} size={20} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {leads.map((item, index) => (
          <Animated.View 
            key={item.id} 
            entering={FadeInDown.duration(800).delay(200 + index * 100)}
            layout={Layout.springify()}
          >
            <LeadCard lead={item} onPress={() => handleOpenLead(item)} />
          </Animated.View>
        ))}
      </ScrollView>

      {/* 360° CUSTOMER PROFILE MODAL */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent} intensity={40}>
            {/* Modal Drag Line */}
            <View style={styles.dragIndicator} />

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Hồ Sơ 360° Khách Hàng 🎯</Text>
                <Text style={styles.modalSubtitle}>Đơn vị quản trị CRM • AnhEmMotor Biên Hòa</Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <X color={colors.text} size={24} />
              </TouchableOpacity>
            </View>

            {selectedLead && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} style={{ maxHeight: '85%' }}>
                {/* Customer summary card */}
                <View style={styles.customerSummaryCard}>
                  <View style={styles.customerMainInfo}>
                    <View style={styles.avatarCircle}>
                      <User color={colors.text} size={24} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                      <Text style={styles.customerNameBig}>{selectedLead.name}</Text>
                      <View style={styles.customerSubRow}>
                        <View style={[styles.priorityBadge, { backgroundColor: selectedLead.color + '15', marginTop: 4, marginRight: 8 }]}>
                          <Flame color={selectedLead.color} size={10} strokeWidth={3} />
                          <Text style={[styles.priorityText, { color: selectedLead.color }]}>{selectedLead.status.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.timeTagText}>Đăng ký: {selectedLead.time}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.summaryActions}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary + '1A', borderColor: colors.primary, borderWidth: 1 }]} onPress={() => Linking.openURL(`tel:${selectedLead.phone}`)}>
                      <Phone color={colors.primary} size={18} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.success + '1A', borderColor: colors.success, borderWidth: 1 }]} onPress={() => Linking.openURL('https://zalo.me')}>
                      <MessageSquare color={colors.success} size={18} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 360° LINEAR TIMELINE STEPS (AS DESCRIBED IN SPECS) */}
                <View style={styles.linearStepper}>
                  
                  {/* Step 1: Thông tin liên hệ */}
                  <View style={styles.stepperItem}>
                    <View style={styles.stepperLeft}>
                      <View style={[styles.stepperDot, { backgroundColor: colors.primary }]}>
                        <Text style={styles.stepperNum}>1</Text>
                      </View>
                      <View style={styles.stepperLine} />
                    </View>
                    <View style={styles.stepperRight}>
                      <Text style={styles.stepperHeader}>Thông tin CRM cốt lõi</Text>
                      <View style={styles.stepperContentBox}>
                        <Text style={styles.stepperText}>📞 SĐT: <Text style={{ color: colors.text, fontWeight: 'bold' }}>{selectedLead.phone}</Text></Text>
                        <Text style={styles.stepperText}>✉️ Email: <Text style={{ color: colors.text }}>{selectedLead.email}</Text></Text>
                        <Text style={styles.stepperText}>📍 Nguồn: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Website & App Khách hàng</Text></Text>
                      </View>
                    </View>
                  </View>

                  {/* Step 2: Timeline liên hệ */}
                  <View style={styles.stepperItem}>
                    <View style={styles.stepperLeft}>
                      <View style={[styles.stepperDot, { backgroundColor: '#F59E0B' }]}>
                        <Text style={styles.stepperNum}>2</Text>
                      </View>
                      <View style={styles.stepperLine} />
                    </View>
                    <View style={styles.stepperRight}>
                      <Text style={styles.stepperHeader}>Timeline Liên Hệ & Chăm Sóc</Text>
                      <View style={styles.stepperContentBox}>
                        <View style={styles.logItem}>
                          <Clock color={colors.subtext} size={10} style={{ marginRight: 6 }} />
                          <Text style={styles.logText}><Text style={{ color: '#F59E0B', fontWeight: 'bold' }}>09:30</Text> - Đăng ký nhận báo giá lăn bánh Biên Hòa.</Text>
                        </View>
                        <View style={styles.logItem}>
                          <Clock color={colors.subtext} size={10} style={{ marginRight: 6 }} />
                          <Text style={styles.logText}><Text style={{ color: '#F59E0B', fontWeight: 'bold' }}>10:15</Text> - Sale gọi điện tư vấn thông số {selectedLead.interest}.</Text>
                        </View>
                        <View style={styles.logItem}>
                          <Clock color={colors.subtext} size={10} style={{ marginRight: 6 }} />
                          <Text style={styles.logText}><Text style={{ color: '#F59E0B', fontWeight: 'bold' }}>14:00</Text> - Gửi bảng kê góp qua Zalo. Khách đang cân nhắc.</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Step 3: Xe quan tâm / Đang đi */}
                  <View style={styles.stepperItem}>
                    <View style={styles.stepperLeft}>
                      <View style={[styles.stepperDot, { backgroundColor: '#10B981' }]}>
                        <Text style={styles.stepperNum}>3</Text>
                      </View>
                      <View style={styles.stepperLine} />
                    </View>
                    <View style={styles.stepperRight}>
                      <Text style={styles.stepperHeader}>Xe Quan Tâm & Xe Hiện Có</Text>
                      <View style={styles.stepperContentBox}>
                        <Text style={styles.stepperText}>🏍️ Đang quan tâm: <Text style={{ color: '#22D3EE', fontWeight: 'bold' }}>{selectedLead.interest}</Text></Text>
                        <Text style={styles.stepperText}>🚗 Xe đang đi: <Text style={{ color: colors.subtext }}>Honda Winner X 2021 (Thu cũ đổi mới)</Text></Text>
                      </View>
                    </View>
                  </View>

                  {/* Step 4: Ghi chú nội bộ */}
                  <View style={styles.stepperItem}>
                    <View style={styles.stepperLeft}>
                      <View style={[styles.stepperDot, { backgroundColor: '#EC4899' }]}>
                        <Text style={styles.stepperNum}>4</Text>
                      </View>
                    </View>
                    <View style={styles.stepperRight}>
                      <Text style={styles.stepperHeader}>Ghi Chú Nội Bộ (Internal notes)</Text>
                      <View style={[styles.stepperContentBox, { borderLeftWidth: 2, borderLeftColor: '#EC4899', paddingLeft: 12 }]}>
                        <Text style={[styles.stepperText, { fontStyle: 'italic', color: colors.text, lineHeight: 18 }]}>
                          "{selectedLead.notes}"
                        </Text>
                      </View>
                    </View>
                  </View>

                </View>

                {/* Confirm actions */}
                <View style={styles.modalActionsRow}>
                  <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeModalText}>Bỏ qua</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.confirmBtn} 
                    onPress={() => {
                      alert('Đã chốt hợp đồng và chuyển Lead thành đơn hàng thành công! 🎉');
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.confirmBtnText}>Chốt hợp đồng ✓</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </GlassCard>
        </View>
      </Modal>

      {/* FAB - ADD NEW LEAD (II.1 RULE) */}
      <Pressable style={styles.fab}>
        <LinearGradient colors={[colors.secondary, '#991B1B']} style={styles.fabGradient}>
          <Plus color="#fff" size={24} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

