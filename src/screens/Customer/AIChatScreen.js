import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TextInput,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { Theme } from '../../theme/Theme';
import { ChevronLeft, Send, Bot, Zap } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import ScalePress from '../../components/ScalePress';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const INITIAL_MESSAGES = [
  {
    id: 1, from: 'bot',
    text: 'Xin chào! Tôi là trợ lý ảo AnhEmMotor 🏍️\nTôi có thể giúp gì cho bạn hôm nay?',
  },
];

const FAQ_SUGGESTIONS = [
  'Thủ tục trả góp cần giấy tờ gì?',
  'Bao lâu thì thay nhớt lần đầu?',
  'Chính sách bảo hành phụ tùng?',
  'Xe tắt máy đột ngột phải làm gì?',
];

const BOT_REPLIES = {
  'trả góp': 'Để mua xe trả góp tại AnhEmMotor, bạn cần: CMND/CCCD, hộ khẩu, 3 tháng sao kê lương. Lãi suất từ 0% cho kỳ hạn 6 tháng. 😊',
  'nhớt': 'Xe mới nên thay nhớt lần đầu sau 500-1000km để xả nhớt chạy roda. Sau đó mỗi 3.000km hoặc 3 tháng thay 1 lần nhé!',
  'bảo hành': 'Phụ tùng chính hãng tại AnhEmMotor được bảo hành 6 tháng hoặc 5.000km. Chỉ áp dụng với lỗi sản xuất, không bao gồm hao mòn tự nhiên.',
  'tắt máy': 'Khi xe tắt máy đột ngột: 1) Dắt xe vào lề, 2) Tắt công tắc ON/OFF 30 giây rồi khởi động lại, 3) Nếu không được hãy liên hệ hotline để được hỗ trợ kỹ thuật!',
};

function getBotReply(input) {
  const lower = input.toLowerCase();
  for (const key of Object.keys(BOT_REPLIES)) {
    if (lower.includes(key)) return BOT_REPLIES[key];
  }
  return 'Cảm ơn câu hỏi của bạn! Để được tư vấn chính xác nhất, nhân viên AnhEmMotor sẽ liên hệ lại trong 5-10 phút. Bạn có muốn để lại số điện thoại không?';
}

export default function AIChatScreen({ navigation }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const sendMessage = (text = input) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, from: 'bot', text: getBotReply(text) };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

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
        <View style={styles.botInfo}>
          <View style={styles.botAvatar}>
            <Bot color="#fff" size={18} />
          </View>
          <View>
            <Text style={styles.botName}>Trợ lý AnhEmMotor AI</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Trả lời ngay lập tức</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Gợi ý nhanh */}
      <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestions}>
          {FAQ_SUGGESTIONS.map((q, i) => (
            <ScalePress key={i} style={styles.suggestionChip} onPress={() => sendMessage(q)}>
              <Zap color={Theme.colors.warning} size={12} />
              <Text style={styles.suggestionText}>{q}</Text>
            </ScalePress>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Danh sách tin nhắn */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <Animated.View
            key={msg.id}
            entering={FadeInDown.duration(400).delay(index * 50)}
            style={[styles.msgWrapper, msg.from === 'user' && styles.msgRight]}
          >
            {msg.from === 'bot' && (
              <View style={styles.botAvatarSmall}>
                <Bot color="#fff" size={12} />
              </View>
            )}
            <View style={[styles.bubble, msg.from === 'user' ? styles.userBubble : styles.botBubble]}>
              <Text style={styles.bubbleText}>{msg.text}</Text>
            </View>
          </Animated.View>
        ))}

        {isTyping && (
          <View style={styles.msgWrapper}>
            <View style={styles.botAvatarSmall}>
              <Bot color="#fff" size={12} />
            </View>
            <GlassCard style={styles.typingBubble} intensity={15}>
              <Text style={styles.typingDots}>● ● ●</Text>
            </GlassCard>
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Input */}
      <View style={styles.inputBar}>
        <GlassCard style={styles.inputCard} intensity={20}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Nhập câu hỏi..."
            placeholderTextColor={Theme.colors.subtext}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
          />
          <ScalePress style={styles.sendBtn} onPress={() => sendMessage()}>
            <Send color="#fff" size={18} />
          </ScalePress>
        </GlassCard>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Theme.spacing.md, marginTop: Theme.spacing.xl, marginBottom: Theme.spacing.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.card, justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  botInfo: { flexDirection: 'row', alignItems: 'center' },
  botAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  botName: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Theme.colors.success, marginRight: 5 },
  onlineText: { color: Theme.colors.success, fontSize: 11 },

  suggestions: { paddingHorizontal: Theme.spacing.md, marginBottom: Theme.spacing.sm },
  suggestionChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.card, borderRadius: Theme.radius.full, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, borderWidth: 1, borderColor: Theme.colors.border },
  suggestionText: { color: Theme.colors.subtext, fontSize: 12, marginLeft: 4 },

  messageList: { paddingHorizontal: Theme.spacing.md, paddingTop: Theme.spacing.sm },
  msgWrapper: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: Theme.spacing.sm },
  msgRight: { flexDirection: 'row-reverse' },

  botAvatarSmall: { width: 26, height: 26, borderRadius: 13, backgroundColor: Theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  bubble: { maxWidth: '78%', borderRadius: 18, padding: Theme.spacing.md },
  botBubble: { backgroundColor: Theme.colors.card, borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: Theme.colors.primary, borderBottomRightRadius: 4, marginRight: 0 },
  bubbleText: { color: '#fff', fontSize: 14, lineHeight: 20 },

  typingBubble: { padding: Theme.spacing.sm, borderRadius: Theme.radius.lg },
  typingDots: { color: Theme.colors.subtext, fontSize: 14, letterSpacing: 4 },

  inputBar: { paddingHorizontal: Theme.spacing.md, paddingBottom: 24, paddingTop: 8 },
  inputCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Theme.spacing.md, paddingVertical: 8 },
  textInput: { flex: 1, color: Theme.colors.text, fontSize: 14, paddingVertical: 8 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
});
