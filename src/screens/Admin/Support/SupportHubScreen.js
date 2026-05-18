import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Image, Modal, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { Theme } from '../../../theme/Theme';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  User, 
  ChevronRight,
  ShieldAlert,
  BarChart3,
  Reply,
  MessageSquare,
  X,
  Phone,
  UserPlus,
  Check,
  AlertCircle,
  ChevronLeft
} from 'lucide-react-native';
import GlassCard from '../../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp, FadeInRight, Layout } from 'react-native-reanimated';
import { useSupportController } from './useSupportController';

export default function SupportHubScreen({ navigation }) {
  const {
    tickets,
    pendingCount,
    staff,
    loading,
    activeTab,
    setActiveTab,
    assignStaff,
    respondToTicket,
    resolveTicket,
    refreshTickets
  } = useSupportController();

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [customReply, setCustomReply] = useState('');

  const templates = [
    'Xin lỗi về trải nghiệm không tốt, chúng tôi sẽ xử lý ngay.',
    'Cảm ơn bạn đã phản hồi tích cực!',
    'Bộ phận kỹ thuật đang kiểm tra và sẽ gọi lại cho bạn.',
  ];

  const openReply = (ticket) => {
    setSelectedTicket(ticket);
    setCustomReply('');
    setShowReplyModal(true);
  };

  const openAssign = (ticket) => {
    setSelectedTicket(ticket);
    setShowAssignModal(true);
  };

  const handleSelectStaff = async (staffId, staffName) => {
    if (selectedTicket) {
      await assignStaff(selectedTicket.id, staffId, staffName);
      setShowAssignModal(false);
      setSelectedTicket(null);
    }
  };

  const handleSendReply = async (replyText) => {
    if (selectedTicket) {
      await respondToTicket(selectedTicket.id, replyText);
      setShowReplyModal(false);
      setSelectedTicket(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Đang đồng bộ trung tâm khiếu nại...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {navigation && navigation.canGoBack && navigation.canGoBack() && (
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <ChevronLeft color={Theme.colors.text} size={20} />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1, marginLeft: (navigation && navigation.canGoBack && navigation.canGoBack()) ? 12 : 0 }}>
            <Text style={styles.title}>Khiếu Nại & Hỗ Trợ 💬</Text>
            <Text style={styles.subtitle}>Trung tâm xử lý SLA & Quản trị CRM</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.statBtn} onPress={refreshTickets}>
          <BarChart3 color={Theme.colors.primary} size={20} />
        </TouchableOpacity>
      </Animated.View>

      {/* SEARCH AND FILTERS */}
      <View style={styles.searchContainer}>
        <Search color={Theme.colors.subtext} size={20} style={{ marginRight: 12 }} />
        <TextInput 
          placeholder="Tìm kiếm khiếu nại, tên khách hàng..." 
          placeholderTextColor={Theme.colors.subtext}
          style={styles.searchInput}
        />
        <Pressable style={styles.filterBtn}>
          <Filter color={Theme.colors.text} size={18} />
        </Pressable>
      </View>

      {/* SLA TABS */}
      <View style={styles.tabContainer}>
        <Pressable 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]} 
          onPress={() => setActiveTab('pending')}
        >
          <Clock color={activeTab === 'pending' ? '#fff' : Theme.colors.subtext} size={18} />
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Chưa xử lý</Text>
          {pendingCount > 0 && (
            <View style={styles.badge}><Text style={styles.badgeText}>{pendingCount}</Text></View>
          )}
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'handled' && styles.activeTab]} 
          onPress={() => setActiveTab('handled')}
        >
          <CheckCircle color={activeTab === 'handled' ? '#fff' : Theme.colors.subtext} size={18} />
          <Text style={[styles.tabText, activeTab === 'handled' && styles.activeTabText]}>Đã xong</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.section}>
          {tickets.length === 0 ? (
            <GlassCard style={styles.emptyCard}>
              <CheckCircle color={Theme.colors.success} size={32} />
              <Text style={styles.emptyText}>Tuyệt vời! Không còn khiếu nại nào tồn đọng.</Text>
            </GlassCard>
          ) : (
            tickets.map((item, index) => {
              // Color helper based on ticket type
              const ticketColor = item.type === 'Khiếu nại' ? Theme.colors.error : (item.type === 'Hỗ trợ' ? Theme.colors.info : Theme.colors.success);
              return (
                <Animated.View key={item.id} entering={FadeInRight.delay(index * 100)} layout={Layout.springify()}>
                  <GlassCard style={styles.ticketCard}>
                    {/* Header: Customer info & status */}
                    <View style={styles.ticketHeader}>
                      <View style={styles.customerRow}>
                        <Image source={{ uri: item.customerAvatar }} style={styles.avatar} />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                          <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.customerName}>{item.customerName}</Text>
                          <View style={styles.tagRow}>
                            <View style={[styles.typeTag, { backgroundColor: ticketColor + '25', borderColor: ticketColor + '66', borderWidth: 1 }]}>
                              <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={[styles.typeText, { color: ticketColor }]}>{item.type}</Text>
                            </View>
                            <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.timeText}>Nhận: {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                          </View>
                        </View>
                      </View>
                      
                      {/* SLA Warning Badges */}
                      <View style={styles.slaBadgeColumn}>
                        {item.status === 'new' && item.slaFirstResponseMinutes > 0 && (
                          <View style={[styles.slaIndicator, styles.slaWarning]}>
                            <Clock color="#F59E0B" size={10} />
                            <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.slaWarningText}>SLA phản hồi: {item.slaFirstResponseMinutes}p</Text>
                          </View>
                        )}
                        {item.status === 'assigned' && item.slaResolveMinutes > 0 && (
                          <View style={[styles.slaIndicator, styles.slaNormal]}>
                            <Clock color="#3B82F6" size={10} />
                            <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.slaNormalText}>SLA xử lý: {Math.round(item.slaResolveMinutes/60)}h</Text>
                          </View>
                        )}
                        {item.status === 'resolved' && (
                          <View style={[styles.slaIndicator, styles.slaSuccess]}>
                            <Check color="#10B981" size={10} />
                            <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.slaSuccessText}>Đạt SLA ✓</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Low Review Warning */}
                    {item.rating !== null && item.rating <= 2 && (
                      <View style={styles.lowRatingAlert}>
                        <ShieldAlert color={Theme.colors.error} size={14} />
                        <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.lowRatingAlertText}>Cảnh báo đánh giá thấp: ⭐ {item.rating}/5 Sao</Text>
                      </View>
                    )}

                    {/* Complaint/Support Content */}
                    <Text style={styles.ticketContent}>{item.content}</Text>

                    {/* Internal Notes / Logs */}
                    {item.internalNotes.trim() !== '' && (
                      <View style={styles.internalLogsContainer}>
                        <Text style={styles.internalLogsHeader}>Nhật ký nghiệp vụ:</Text>
                        <Text style={styles.internalLogsText}>{item.internalNotes}</Text>
                      </View>
                    )}

                    {/* Staff Assigned Details */}
                    <View style={styles.assignedDetailsRow}>
                      <Text style={styles.assignedLabel}>Nhân viên phụ trách:</Text>
                      {item.assignedStaffName ? (
                        <View style={styles.staffBadge}>
                          <User color={Theme.colors.primary} size={10} />
                          <Text style={styles.staffBadgeText}>{item.assignedStaffName}</Text>
                        </View>
                      ) : (
                        <Text style={styles.unassignedText}>Chưa phân công ⚠️</Text>
                      )}
                    </View>

                    {/* Response if sent */}
                    {item.replyContent && (
                      <View style={styles.replyBox}>
                        <Reply color={Theme.colors.primary} size={12} />
                        <Text style={styles.replyText}>Phản hồi đã gửi: "{item.replyContent}"</Text>
                      </View>
                    )}

                    {/* ONE-TOUCH ACTION PANEL */}
                    <View style={styles.ticketFooter}>
                      {/* Sub-action: Call client */}
                      <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL('tel:0901234567')}>
                        <Phone color="#fff" size={16} />
                      </TouchableOpacity>

                      {/* Main contextual action button */}
                      {item.status === 'new' && (
                        <TouchableOpacity style={[styles.mainActionBtn, { backgroundColor: Theme.colors.primary }]} onPress={() => openAssign(item)}>
                          <UserPlus color="#fff" size={16} />
                          <Text style={styles.mainActionBtnText}>Gán nhân viên</Text>
                        </TouchableOpacity>
                      )}

                      {item.status === 'assigned' && (
                        <TouchableOpacity style={[styles.mainActionBtn, { backgroundColor: Theme.colors.secondary }]} onPress={() => openReply(item)}>
                          <Reply color="#fff" size={16} />
                          <Text style={styles.mainActionBtnText}>Phản hồi khách</Text>
                        </TouchableOpacity>
                      )}

                      {item.status === 'replied' && (
                        <TouchableOpacity style={[styles.mainActionBtn, { backgroundColor: Theme.colors.success }]} onPress={() => resolveTicket(item.id)}>
                          <Check color="#fff" size={16} />
                          <Text style={styles.mainActionBtnText}>Duyệt & Đóng Hồ Sơ</Text>
                        </TouchableOpacity>
                      )}

                      {item.status === 'resolved' && (
                        <View style={styles.resolvedLabelBox}>
                          <CheckCircle color={Theme.colors.success} size={14} />
                          <Text style={styles.resolvedLabelText}>Hồ sơ đã khép thành công</Text>
                        </View>
                      )}
                    </View>
                  </GlassCard>
                </Animated.View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* QUICK RESPONSE MODAL */}
      <Modal visible={showReplyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Xử lý Phản hồi Khách hàng</Text>
              <TouchableOpacity onPress={() => setShowReplyModal(false)}>
                <X color={Theme.colors.text} size={24} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.ticketBrief}>
                <Text style={styles.briefCustomer}>Gửi đến: {selectedTicket?.customerName}</Text>
                <Text style={styles.briefContent}>"{selectedTicket?.content}"</Text>
              </View>

              {/* Template List */}
              <View style={styles.templateList}>
                <Text style={styles.templateHeader}>Chọn phản hồi mẫu nhanh:</Text>
                {templates.map((temp, idx) => (
                  <TouchableOpacity key={idx} style={styles.templateItem} onPress={() => handleSendReply(temp)}>
                    <MessageSquare color={Theme.colors.primary} size={16} />
                    <Text style={styles.templateText}>{temp}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Reply Input */}
              <Text style={styles.templateHeader}>Phản hồi tùy chỉnh:</Text>
              <View style={styles.customReplyContainer}>
                <TextInput 
                  placeholder="Nhập nội dung phản hồi tùy chỉnh..."
                  placeholderTextColor={Theme.colors.subtext}
                  value={customReply}
                  onChangeText={setCustomReply}
                  style={styles.customReplyInput}
                  multiline
                />
              </View>

              <TouchableOpacity 
                style={[styles.sendBtn, { backgroundColor: customReply.trim() !== '' ? Theme.colors.primary : 'rgba(255,255,255,0.05)' }]} 
                onPress={() => customReply.trim() !== '' && handleSendReply(customReply)}
                disabled={customReply.trim() === ''}
              >
                <Text style={styles.sendText}>Gửi phản hồi tùy chỉnh</Text>
              </TouchableOpacity>
            </ScrollView>
          </GlassCard>
        </View>
      </Modal>

      {/* ASSIGN STAFF MODAL */}
      <Modal visible={showAssignModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉ định Nhân viên xử lý</Text>
              <TouchableOpacity onPress={() => setShowAssignModal(false)}>
                <X color={Theme.colors.text} size={24} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>Chọn nhân viên có nghiệp vụ tốt nhất để gán khiếu nại này:</Text>
            
            <ScrollView style={styles.staffScroll} showsVerticalScrollIndicator={false}>
              {staff.map((employee) => (
                <TouchableOpacity 
                  key={employee.id} 
                  style={styles.staffItem}
                  onPress={() => handleSelectStaff(employee.id, employee.name)}
                >
                  <View style={styles.staffInfoCol}>
                    <Image source={{ uri: employee.avatar }} style={styles.staffAvatar} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.staffNameText}>{employee.name}</Text>
                      <Text style={styles.staffStatusText}>{employee.status}</Text>
                    </View>
                  </View>
                  <ChevronRight color={Theme.colors.subtext} size={18} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  title: { color: Theme.colors.text, fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: Theme.colors.subtext, fontSize: 13, marginTop: 4 },
  statBtn: { backgroundColor: 'rgba(59, 130, 246, 0.22)', width: 44, height: 44, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.45)', justifyContent: 'center', alignItems: 'center' },

  loadingContainer: { flex: 1, backgroundColor: Theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Theme.colors.subtext, fontSize: 14, marginTop: 12 },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.card, borderRadius: 0, paddingHorizontal: 16, height: 50, marginBottom: Theme.spacing.md, borderWidth: 1, borderColor: Theme.colors.border },
  searchInput: { flex: 1, color: Theme.colors.text },
  filterBtn: { padding: 4 },

  tabContainer: { flexDirection: 'row', backgroundColor: Theme.colors.card, borderRadius: 0, padding: 4, marginBottom: Theme.spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 0 },
  activeTab: { backgroundColor: Theme.colors.secondary },
  tabText: { color: Theme.colors.subtext, fontWeight: '600', marginLeft: 8, fontSize: 13 },
  activeTabText: { color: '#fff' },
  badge: { backgroundColor: Theme.colors.error, minWidth: 18, height: 18, borderRadius: 0, justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  section: { marginTop: Theme.spacing.xs },
  emptyCard: { padding: 40, alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  emptyText: { color: Theme.colors.subtext, fontSize: 14, marginTop: 12, textAlign: 'center' },

  ticketCard: { padding: 18, marginBottom: 16 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  customerRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 0, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  customerName: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold' },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  typeTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 0, marginRight: 8 },
  typeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  timeText: { color: Theme.colors.subtext, fontSize: 11 },

  slaBadgeColumn: { alignItems: 'flex-end', marginLeft: 8 },
  slaIndicator: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 0, marginBottom: 4, borderWidth: 1 },
  slaWarning: { backgroundColor: 'rgba(245, 158, 11, 0.22)', borderColor: 'rgba(245, 158, 11, 0.45)' },
  slaWarningText: { color: '#F59E0B', fontSize: 9, fontWeight: 'bold', marginLeft: 4 },
  slaNormal: { backgroundColor: 'rgba(59, 130, 246, 0.22)', borderColor: 'rgba(59, 130, 246, 0.45)' },
  slaNormalText: { color: '#3B82F6', fontSize: 9, fontWeight: 'bold', marginLeft: 4 },
  slaSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.22)', borderColor: 'rgba(16, 185, 129, 0.45)' },
  slaSuccessText: { color: '#10B981', fontSize: 9, fontWeight: 'bold', marginLeft: 4 },

  lowRatingAlert: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.08)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)', marginTop: 12 },
  lowRatingAlertText: { color: Theme.colors.error, fontSize: 11, fontWeight: 'bold', marginLeft: 6 },

  ticketContent: { color: Theme.colors.text, fontSize: 13, lineHeight: 20, marginTop: 12, opacity: 0.9 },
  
  internalLogsContainer: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 0, marginTop: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' },
  internalLogsHeader: { color: Theme.colors.primary, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
  internalLogsText: { color: Theme.colors.subtext, fontSize: 11, lineHeight: 16, fontStyle: 'italic' },

  assignedDetailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  assignedLabel: { color: Theme.colors.subtext, fontSize: 11 },
  staffBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.22)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 0, marginLeft: 6, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.45)' },
  staffBadgeText: { color: Theme.colors.primary, fontSize: 11, fontWeight: '600', marginLeft: 4 },
  unassignedText: { color: '#EF4444', fontSize: 11, fontWeight: 'bold', marginLeft: 6 },

  replyBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: 10, borderRadius: 0, marginTop: 12, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.1)' },
  replyText: { color: '#10B981', fontSize: 12, fontStyle: 'italic', marginLeft: 8, flex: 1 },

  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  callBtn: { width: 40, height: 40, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center' },
  mainActionBtn: { flex: 1, flexDirection: 'row', height: 40, borderRadius: 0, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  mainActionBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
  
  resolvedLabelBox: { flex: 1, flexDirection: 'row', height: 40, borderRadius: 0, backgroundColor: 'rgba(16, 185, 129, 0.06)', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  resolvedLabelText: { color: Theme.colors.success, fontSize: 12, fontWeight: 'bold', marginLeft: 8 },

  backBtn: { width: 38, height: 38, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { padding: 24, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTopWidth: 2, borderTopColor: Theme.colors.primary, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  modalSubtitle: { color: Theme.colors.subtext, fontSize: 13, marginBottom: 16 },

  ticketBrief: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 20 },
  briefCustomer: { color: Theme.colors.primary, fontSize: 13, fontWeight: 'bold' },
  briefContent: { color: Theme.colors.subtext, fontSize: 12, marginTop: 6, fontStyle: 'italic' },

  templateList: { marginBottom: 20 },
  templateHeader: { color: Theme.colors.text, fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  templateItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 0, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  templateText: { color: Theme.colors.text, fontSize: 13, marginLeft: 10, flex: 1 },

  customReplyContainer: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 0, paddingHorizontal: 12, paddingVertical: 8, minHeight: 80, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  customReplyInput: { color: Theme.colors.text, fontSize: 13, minHeight: 60, textAlignVertical: 'top' },

  sendBtn: { height: 50, borderRadius: 0, justifyContent: 'center', alignItems: 'center' },
  sendText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  staffScroll: { maxHeight: 250 },
  staffItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  staffInfoCol: { flexDirection: 'row', alignItems: 'center' },
  staffAvatar: { width: 40, height: 40, borderRadius: 0, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  staffNameText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  staffStatusText: { color: Theme.colors.subtext, fontSize: 11, marginTop: 2 }
});
