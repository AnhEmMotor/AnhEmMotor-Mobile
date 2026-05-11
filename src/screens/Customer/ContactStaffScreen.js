import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TextInput,
  KeyboardAvoidingView, Platform, Alert, Linking
} from 'react-native';
import { Theme } from '../../theme/Theme';
import { ChevronLeft, Send, Mail, Phone, Clock, CheckCircle } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import ScalePress from '../../components/ScalePress';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const STAFF_EMAIL = 'support@anhemmotor.vn';

const THREAD_HISTORY = [
  {
    id: 1,
    from: 'staff',
    name: 'Kỹ thuật viên Minh',
    message: 'Xin chào anh Khôi! Xe của anh đã được kiểm tra xong. Bộ lọc gió cần thay mới, chi phí dự kiến ~150.000đ. Anh xác nhận để tụi em tiến hành nhé.',
    time: '10:30 - 08/05/2026',
    isRead: true,
  },
  {
    id: 2,
    from: 'customer',
    name: 'Nguyễn Khôi',
    message: 'Ok bạn, cứ tiến hành đi nhé. Xe mình để lại đến 5h chiều.',
    time: '10:45 - 08/05/2026',
    isRead: true,
  },
  {
    id: 3,
    from: 'staff',
    name: 'Kỹ thuật viên Minh',
    message: 'Dạ em đã thay xong. Xe anh đã sẵn sàng. Hóa đơn sẽ được gửi qua email.',
    time: '16:20 - 08/05/2026',
    isRead: false,
  },
];

export default function ContactStaffScreen({ navigation }) {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('thread');

  const handleSendEmail = () => {
    if (!message.trim()) {
      Alert.alert('Thông báo', 'Bạn chưa nhập nội dung tin nhắn.');
      return;
    }
    const subject = encodeURIComponent('[AnhEmMotor] Yêu cầu hỗ trợ từ Nguyễn Khôi');
    const body = encodeURIComponent(message);
    Linking.openURL(`mailto:${STAFF_EMAIL}?subject=${subject}&body=${body}`);
    setMessage('');
  };

  const quickTemplates = [
    'Tôi muốn hỏi về tình trạng xe đang bảo dưỡng.',
    'Cho tôi biết chi phí ước tính sửa chữa.',
    'Tôi cần đặt lịch cứu hộ khẩn cấp.',
    'Tôi muốn tư vấn về mua xe mới.',
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
        <ScalePress style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={Theme.colors.text} size={24} />
        </ScalePress>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Liên hệ nhân viên</Text>
          <View style={styles.onlineDot}>
            <View style={styles.dot} />
            <Text style={styles.onlineText}>Đang hoạt động</Text>
          </View>
        </View>
        <ScalePress style={styles.callBtn} onPress={() => Linking.openURL('tel:19001234')}>
          <Phone color={Theme.colors.primary} size={20} />
        </ScalePress>
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <ScalePress
          style={[styles.tab, activeTab === 'thread' && styles.activeTab]}
          onPress={() => setActiveTab('thread')}
        >
          <Text style={[styles.tabText, activeTab === 'thread' && styles.activeTabText]}>Lịch sử trao đổi</Text>
        </ScalePress>
        <ScalePress
          style={[styles.tab, activeTab === 'compose' && styles.activeTab]}
          onPress={() => setActiveTab('compose')}
        >
          <Text style={[styles.tabText, activeTab === 'compose' && styles.activeTabText]}>Gửi Email mới</Text>
        </ScalePress>
      </View>

      {activeTab === 'thread' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.threadList}>
          <Text style={styles.sectionHint}>Trao đổi về: Kawasaki Z1000 - Bảo dưỡng 08/05</Text>
          {THREAD_HISTORY.map((msg, index) => (
            <Animated.View
              key={msg.id}
              entering={FadeInDown.duration(500).delay(index * 100)}
              style={[styles.bubbleWrapper, msg.from === 'customer' && styles.bubbleRight]}
            >
              {msg.from === 'staff' && (
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>AE</Text>
                </View>
              )}
              <View style={[styles.bubble, msg.from === 'customer' ? styles.customerBubble : styles.staffBubble]}>
                <Text style={styles.bubbleName}>{msg.name}</Text>
                <Text style={styles.bubbleText}>{msg.message}</Text>
                <View style={styles.bubbleMeta}>
                  <Clock size={10} color="rgba(255,255,255,0.5)" />
                  <Text style={styles.bubbleTime}>{msg.time}</Text>
                  {msg.from === 'customer' && <CheckCircle size={10} color={msg.isRead ? Theme.colors.success : 'rgba(255,255,255,0.3)'} style={{ marginLeft: 4 }} />}
                </View>
              </View>
            </Animated.View>
          ))}
          <View style={{ height: 80 }} />
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.composeContainer}>
          <Animated.View entering={FadeInDown.duration(500)}>
            <GlassCard style={styles.recipientCard}>
              <Mail color={Theme.colors.primary} size={18} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.recipientLabel}>Gửi đến</Text>
                <Text style={styles.recipientEmail}>{STAFF_EMAIL}</Text>
              </View>
            </GlassCard>

            <Text style={styles.composeLabel}>Nội dung</Text>
            <GlassCard style={styles.textAreaCard}>
              <TextInput
                style={styles.textArea}
                value={message}
                onChangeText={setMessage}
                placeholder="Nhập nội dung cần trao đổi với nhân viên AnhEmMotor..."
                placeholderTextColor={Theme.colors.subtext}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </GlassCard>

            <Text style={styles.composeLabel}>Mẫu câu hỏi nhanh</Text>
            {quickTemplates.map((tmpl, i) => (
              <ScalePress key={i} onPress={() => setMessage(tmpl)}>
                <GlassCard style={styles.templateCard}>
                  <Text style={styles.templateText}>{tmpl}</Text>
                </GlassCard>
              </ScalePress>
            ))}

            <ScalePress style={styles.sendBtn} onPress={handleSendEmail}>
              <Send color="#fff" size={18} />
              <Text style={styles.sendBtnText}>Mở ứng dụng Email & Gửi</Text>
            </ScalePress>
          </Animated.View>
          <View style={{ height: 60 }} />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Theme.spacing.md, marginTop: Theme.spacing.xl, marginBottom: Theme.spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.card, justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  headerCenter: { flex: 1 },
  headerTitle: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  onlineDot: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Theme.colors.success, marginRight: 5 },
  onlineText: { color: Theme.colors.success, fontSize: 11 },
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(59,130,246,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)' },

  tabs: { flexDirection: 'row', paddingHorizontal: Theme.spacing.md, marginBottom: Theme.spacing.md },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: Theme.colors.primary },
  tabText: { color: Theme.colors.subtext, fontSize: 14, fontWeight: '600' },
  activeTabText: { color: Theme.colors.primary },

  threadList: { paddingHorizontal: Theme.spacing.md },
  sectionHint: { color: Theme.colors.subtext, fontSize: 12, textAlign: 'center', marginBottom: Theme.spacing.lg, fontStyle: 'italic' },

  bubbleWrapper: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: Theme.spacing.md },
  bubbleRight: { flexDirection: 'row-reverse' },
  avatarCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  avatarText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  bubble: { maxWidth: '78%', borderRadius: 18, padding: Theme.spacing.md },
  staffBubble: { backgroundColor: Theme.colors.card, borderBottomLeftRadius: 4 },
  customerBubble: { backgroundColor: Theme.colors.primary, borderBottomRightRadius: 4 },
  bubbleName: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  bubbleText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  bubbleTime: { color: 'rgba(255,255,255,0.4)', fontSize: 10, marginLeft: 4 },

  composeContainer: { paddingHorizontal: Theme.spacing.md },
  recipientCard: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.md, marginBottom: Theme.spacing.md },
  recipientLabel: { color: Theme.colors.subtext, fontSize: 11 },
  recipientEmail: { color: Theme.colors.primary, fontSize: 14, fontWeight: 'bold' },
  composeLabel: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold', marginVertical: Theme.spacing.sm },
  textAreaCard: { padding: Theme.spacing.md, marginBottom: Theme.spacing.lg },
  textArea: { color: Theme.colors.text, fontSize: 14, minHeight: 120, lineHeight: 22 },
  templateCard: { padding: Theme.spacing.md, marginBottom: Theme.spacing.sm, flexDirection: 'row', alignItems: 'center' },
  templateText: { color: Theme.colors.subtext, fontSize: 13, flex: 1 },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Theme.colors.primary, padding: 16, borderRadius: Theme.radius.md, marginTop: Theme.spacing.xl },
  sendBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
});
