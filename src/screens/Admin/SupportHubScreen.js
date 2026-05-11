import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Image, Modal, TouchableOpacity } from 'react-native';
import { Theme } from '../../theme/Theme';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  User, 
  MoreVertical,
  ChevronRight,
  ShieldAlert,
  BarChart3,
  Reply,
  MessageSquare,
  X
} from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp, FadeInRight, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function SupportHubScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const tickets = [
    { id: '1', customer: 'Lê Thảo Nhi', type: 'Khiếu nại', content: 'Thái độ nhân viên chưa tốt khi tư vấn trả góp.', time: '10:15', status: 'Pending', color: Theme.colors.error, avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: '2', customer: 'Trần Minh Nam', type: 'Hỗ trợ', content: 'Cần hướng dẫn kích hoạt bảo hành điện tử.', time: '09:45', status: 'In Progress', color: Theme.colors.info, avatar: 'https://i.pravatar.cc/150?u=5' },
    { id: '3', customer: 'Nguyễn Văn Khôi', type: 'Phản hồi', content: 'Xe chạy rất êm, dịch vụ giao xe nhanh.', time: 'Hôm qua', status: 'Resolved', color: Theme.colors.success, avatar: 'https://i.pravatar.cc/150?u=1' },
  ];

  const templates = [
    'Xin lỗi về trải nghiệm không tốt, chúng tôi sẽ xử lý ngay.',
    'Cảm ơn bạn đã phản hồi tích cực!',
    'Bộ phận kỹ thuật đang kiểm tra và sẽ gọi lại cho bạn.',
  ];

  const openReply = (ticket) => {
    setSelectedTicket(ticket);
    setShowReplyModal(true);
  };

  return (
    <View style={styles.container}>
      {/* II.6 HEADER */}
      <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
        <View>
          <Text style={styles.title}>Hỗ Trợ & Phản Hồi 💬</Text>
          <Text style={styles.subtitle}>Quản trị minh bạch & xử lý khiếu nại</Text>
        </View>
        <TouchableOpacity style={styles.statBtn}>
          <BarChart3 color={Theme.colors.primary} size={20} />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.searchContainer}>
        <Search color={Theme.colors.subtext} size={20} style={{ marginRight: 12 }} />
        <TextInput 
          placeholder="Tìm kiếm yêu cầu hỗ trợ..." 
          placeholderTextColor={Theme.colors.subtext}
          style={styles.searchInput}
        />
        <Pressable style={styles.filterBtn}>
          <Filter color={Theme.colors.text} size={18} />
        </Pressable>
      </View>

      {/* TABS */}
      <View style={styles.tabContainer}>
        <Pressable 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]} 
          onPress={() => setActiveTab('pending')}
        >
          <Clock color={activeTab === 'pending' ? '#fff' : Theme.colors.subtext} size={18} />
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Chưa xử lý</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'handled' && styles.activeTab]} 
          onPress={() => setActiveTab('handled')}
        >
          <CheckCircle color={activeTab === 'handled' ? '#fff' : Theme.colors.subtext} size={18} />
          <Text style={[styles.tabText, activeTab === 'handled' && styles.activeTabText]}>Đã xong</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* II.6 COMPLAINT BOX */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hộp thư yêu cầu</Text>
            <View style={styles.filterRow}>
              <Text style={styles.filterText}>Tất cả</Text>
              <ChevronRight color={Theme.colors.subtext} size={14} />
            </View>
          </View>
          
          {tickets.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInRight.delay(300 + index * 100)} layout={Layout.springify()}>
              <GlassCard style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <View style={styles.customerRow}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.customerName}>{item.customer}</Text>
                      <View style={styles.tagRow}>
                        <View style={[styles.typeTag, { backgroundColor: item.color + '15' }]}>
                          <Text style={[styles.typeText, { color: item.color }]}>{item.type}</Text>
                        </View>
                        <Text style={styles.timeText}>{item.time}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.statusDot, { backgroundColor: item.color }]} />
                </View>
                
                <Text style={styles.ticketContent} numberOfLines={2}>{item.content}</Text>
                
                <View style={styles.ticketFooter}>
                  <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('AdminLeads')}>
                    <User color={Theme.colors.primary} size={14} />
                    <Text style={styles.profileBtnText}>Hồ sơ khách</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.replyBtn} onPress={() => openReply(item)}>
                    <Reply color="#fff" size={14} />
                    <Text style={styles.replyBtnText}>Phản hồi</Text>
                  </TouchableOpacity>
                </View>
              </GlassCard>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* RESPONSE TEMPLATE MODAL */}
      <Modal visible={showReplyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Phản hồi nhanh</Text>
              <TouchableOpacity onPress={() => setShowReplyModal(false)}>
                <X color={Theme.colors.text} size={24} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.ticketBrief}>
              <Text style={styles.briefCustomer}>Gửi đến: {selectedTicket?.customer}</Text>
              <Text style={styles.briefContent}>"{selectedTicket?.content}"</Text>
            </View>

            <View style={styles.templateList}>
              <Text style={styles.templateHeader}>Mẫu câu trả lời:</Text>
              {templates.map((temp, idx) => (
                <TouchableOpacity key={idx} style={styles.templateItem} onPress={() => setShowReplyModal(false)}>
                  <MessageSquare color={Theme.colors.primary} size={16} />
                  <Text style={styles.templateText}>{temp}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.sendBtn} onPress={() => setShowReplyModal(false)}>
              <Text style={styles.sendText}>Gửi phản hồi tùy chỉnh</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  title: { color: Theme.colors.text, fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: Theme.colors.subtext, fontSize: 13, marginTop: 4 },
  statBtn: { backgroundColor: 'rgba(59, 130, 246, 0.1)', width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.card, borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: Theme.spacing.md, borderWidth: 1, borderColor: Theme.colors.border },
  searchInput: { flex: 1, color: Theme.colors.text },
  filterBtn: { padding: 4 },

  tabContainer: { flexDirection: 'row', backgroundColor: Theme.colors.card, borderRadius: Theme.radius.lg, padding: 4, marginBottom: Theme.spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: Theme.radius.md },
  activeTab: { backgroundColor: Theme.colors.secondary },
  tabText: { color: Theme.colors.subtext, fontWeight: '600', marginLeft: 8, fontSize: 13 },
  activeTabText: { color: '#fff' },
  badge: { backgroundColor: Theme.colors.error, minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  section: { marginTop: Theme.spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  filterRow: { flexDirection: 'row', alignItems: 'center' },
  filterText: { color: Theme.colors.subtext, fontSize: 13, marginRight: 4 },

  ticketCard: { padding: 20, marginBottom: 16 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  customerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: 'rgba(255,255,255,0.05)' },
  customerName: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  typeTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginRight: 8 },
  typeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  timeText: { color: Theme.colors.subtext, fontSize: 11 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },

  ticketContent: { color: Theme.colors.text, fontSize: 14, lineHeight: 22, marginTop: 16, opacity: 0.8 },
  
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  profileBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  profileBtnText: { color: Theme.colors.primary, fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
  replyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.secondary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  replyBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 6 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { padding: 24, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold' },
  ticketBrief: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, marginBottom: 24 },
  briefCustomer: { color: Theme.colors.primary, fontSize: 14, fontWeight: 'bold' },
  briefContent: { color: Theme.colors.subtext, fontSize: 13, marginTop: 8, fontStyle: 'italic' },

  templateList: { marginBottom: 32 },
  templateHeader: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold', marginBottom: 16 },
  templateItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  templateText: { color: Theme.colors.text, fontSize: 14, marginLeft: 12, flex: 1 },

  sendBtn: { backgroundColor: 'rgba(255,255,255,0.05)', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  sendText: { color: Theme.colors.text, fontWeight: 'bold' }
});
