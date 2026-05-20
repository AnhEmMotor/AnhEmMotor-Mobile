import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TextInput,
  KeyboardAvoidingView, Platform, Alert, Linking
} from 'react-native';
import { useActiveColors, useTheme } from '../../theme/Theme'; // Import useTheme
import { ChevronLeft, Send, Mail, Phone, Clock, CheckCircle, Settings } from 'lucide-react-native';
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
  const theme = useTheme(); // Use the useTheme hook
  const activeColors = useActiveColors();

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
      style={[styles.container, { backgroundColor: activeColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(500)} style={getStyles(activeColors).header}>
        <ScalePress style={[getStyles(activeColors).backBtn, { backgroundColor: activeColors.card }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={activeColors.text} size={24} />
        </ScalePress>
        <View style={getStyles(activeColors).headerCenter}>
          <Text style={[getStyles(activeColors).headerTitle, { color: activeColors.text }]}>Liên hệ nhân viên</Text>
          <View style={getStyles(activeColors).onlineDot}>
            <View style={[getStyles(activeColors).dot, { backgroundColor: theme.colors.success }]} />
            <Text style={[getStyles(activeColors).onlineText, { color: theme.colors.success }]}>Đang hoạt động</Text>
          </View>
        </View>
        <View style={getStyles(activeColors).headerRight}>
          <ScalePress style={[getStyles(activeColors).callBtn, { borderColor: activeColors.isDark ? theme.colors.primary + '4D' : theme.colors.primary + '26' }]} onPress={() => Linking.openURL('tel:19001234')}>
            <Phone color={activeColors.primary} size={20} />
          </ScalePress>
          <ScalePress
            style={[styles.callBtn, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}
            onPress={() => navigation.navigate('CustomerHome', { screen: 'Profile', params: { openSettings: true } })}
          >
            <Settings color={activeColors.text} size={20} />
          </ScalePress>
        </View>
      </Animated.View>

      {/* Tabs */}
      <View style={getStyles(activeColors).tabs}>
        <ScalePress
          style={[getStyles(activeColors).tab, activeTab === 'thread' && { borderBottomColor: activeColors.primary }]}
          onPress={() => setActiveTab('thread')}
        >
          <Text style={[getStyles(activeColors).tabText, { color: activeColors.subtext }, activeTab === 'thread' && { color: activeColors.primary }]}>Lịch sử trao đổi</Text>
        </ScalePress>
        <ScalePress
          style={[getStyles(activeColors).tab, activeTab === 'compose' && { borderBottomColor: activeColors.primary }]}
          onPress={() => setActiveTab('compose')}
        >
          <Text style={[getStyles(activeColors).tabText, { color: activeColors.subtext }, activeTab === 'compose' && { color: activeColors.primary }]}>Gửi Email mới</Text>
        </ScalePress>
      </View>

      {activeTab === 'thread' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.threadList}>
          <Text style={[styles.sectionHint, { color: activeColors.subtext }]}>Trao đổi về: Kawasaki Z1000 - Bảo dưỡng 08/05</Text>
          {THREAD_HISTORY.map((msg, index) => {
            const isCustomer = msg.from === 'customer';
            return (
              <Animated.View
                key={msg.id}
                entering={FadeInDown.duration(500).delay(index * 100)}
                style={[getStyles(activeColors).bubbleWrapper, isCustomer && getStyles(activeColors).bubbleRight]}
              >
                {!isCustomer && (
                  <View style={[styles.avatarCircle, { backgroundColor: activeColors.primary }]}>
                    <Text style={styles.avatarText}>AE</Text>
                  </View>
                )}
                <View style={[
                  getStyles(activeColors).bubble,
                  isCustomer
                    ? [getStyles(activeColors).customerBubble, { backgroundColor: activeColors.primary }]
                    : [getStyles(activeColors).staffBubble, { backgroundColor: activeColors.card }]
                ]}>
                  <Text style={[
                    styles.bubbleName,
                    { color: isCustomer ? 'rgba(255,255,255,0.7)' : activeColors.subtext }
                  ]}>
                    {msg.name}
                  </Text>
                  <Text style={[
                    styles.bubbleText,
                    { color: isCustomer ? '#FFFFFF' : activeColors.text }
                  ]}>
                    {msg.message}
                  </Text>
                  <View style={styles.bubbleMeta}>
                    <Clock size={10} color={isCustomer ? 'rgba(255,255,255,0.6)' : activeColors.subtext} />
                    <Text style={[
                      styles.bubbleTime,
                      { color: isCustomer ? 'rgba(255,255,255,0.5)' : activeColors.subtext }
                    ]}>
                      {msg.time}
                    </Text>
                    {isCustomer && (
                      <CheckCircle
                        size={10}
                        color={msg.isRead ? '#10B981' : 'rgba(255,255,255,0.4)'}
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </View>
                </View>
              </Animated.View>
            );
          })}
          <View style={{ height: 80 }} />
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.composeContainer}>
          <Animated.View entering={FadeInDown.duration(500)}> {/* This is fine */}
            <GlassCard
              style={[getStyles(activeColors).recipientCard, { borderColor: activeColors.border, backgroundColor: activeColors.card }]}
              tint={activeColors.isDark ? 'dark' : 'light'} // This is fine
            >
              <Mail color={activeColors.primary} size={18} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.recipientLabel, { color: activeColors.subtext }]}>Gửi đến</Text>
                <Text style={[styles.recipientEmail, { color: activeColors.primary }]}>{STAFF_EMAIL}</Text>
              </View>
            </GlassCard>

            <Text style={[getStyles(activeColors).composeLabel, { color: activeColors.text }]}>Nội dung</Text>
            <GlassCard
              style={[styles.textAreaCard, { borderColor: activeColors.border, backgroundColor: activeColors.card }]}
              tint={activeColors.isDark ? 'dark' : 'light'}
            >
              <TextInput
                style={[styles.textArea, { color: activeColors.text }]}
                value={message}
                onChangeText={setMessage}
                placeholder="Nhập nội dung cần trao đổi với nhân viên AnhEmMotor..."
                placeholderTextColor={activeColors.subtext}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </GlassCard>

            <Text style={[getStyles(activeColors).composeLabel, { color: activeColors.text }]}>Mẫu câu hỏi nhanh</Text>
            {quickTemplates.map((tmpl, i) => (
              <ScalePress key={i} onPress={() => setMessage(tmpl)}>
                <GlassCard
                  style={[styles.templateCard, { borderColor: activeColors.border, backgroundColor: activeColors.card }]}
                  tint={activeColors.isDark ? 'dark' : 'light'}
                >
                  <Text style={[styles.templateText, { color: activeColors.subtext }]}>{tmpl}</Text>
                </GlassCard>
              </ScalePress>
            ))}

            <ScalePress
              style={[getStyles(activeColors).sendBtn, { backgroundColor: activeColors.primary }]}
              onPress={handleSendEmail}
            >
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

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1 },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: colors.spacing.md, marginTop: colors.spacing.xl, marginBottom: colors.spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: colors.spacing.md },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  onlineDot: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  onlineText: { fontSize: 11 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 }, // Added for headerRight
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + '1A', justifyContent: 'center', alignItems: 'center', borderWidth: 1 },

  tabs: { flexDirection: 'row', paddingHorizontal: colors.spacing.md, marginBottom: colors.spacing.md },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: 14, fontWeight: '600' },

  threadList: { paddingHorizontal: colors.spacing.md }, // This is fine
  sectionHint: { fontSize: 12, textAlign: 'center', marginBottom: colors.spacing.lg, fontStyle: 'italic' }, // This is fine

  bubbleWrapper: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: colors.spacing.md },
  bubbleRight: { flexDirection: 'row-reverse' },
  avatarCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  avatarText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  bubble: { maxWidth: '78%', borderRadius: 18, padding: colors.spacing.md },
  staffBubble: { borderBottomLeftRadius: 4 },
  customerBubble: { borderBottomRightRadius: 4 },
  bubbleName: { fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  bubbleTime: { fontSize: 10, marginLeft: 4 },
  // This is fine

  composeContainer: { paddingHorizontal: colors.spacing.md }, // This is fine
  recipientCard: { flexDirection: 'row', alignItems: 'center', padding: colors.spacing.md, marginBottom: colors.spacing.md, borderRadius: colors.radius.lg, borderWidth: 1 },
  recipientLabel: { fontSize: 11 },
  recipientEmail: { fontSize: 14, fontWeight: 'bold' },
  composeLabel: { fontSize: 16, fontWeight: 'bold', marginVertical: colors.spacing.sm },
  textAreaCard: { padding: colors.spacing.md, marginBottom: colors.spacing.lg, borderRadius: colors.radius.lg, borderWidth: 1 },
  textArea: { fontSize: 14, minHeight: 120, lineHeight: 22 },
  templateCard: { padding: colors.spacing.md, marginBottom: colors.spacing.sm, flexDirection: 'row', alignItems: 'center', borderRadius: colors.radius.lg, borderWidth: 1 },
  templateText: { fontSize: 13, flex: 1 },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: colors.radius.md, marginTop: colors.spacing.xl },
  sendBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
});
