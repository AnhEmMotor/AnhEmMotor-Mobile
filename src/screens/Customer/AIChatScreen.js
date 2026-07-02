import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TextInput,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { Theme, useTheme } from '../../theme/Theme';
import { ChevronLeft, Send, Bot, Zap, Settings } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import ScalePress from '../../components/ScalePress';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const DEFAULT_BG = '#0B0F19';
const DEFAULT_SUBTEXT = '#94A3B8';

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
  const theme = useTheme();

  const sendMessage = (text = input) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (text !== input) setIsTyping(true);
    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, from: 'bot', text: getBotReply(text) };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View entering={FadeInUp.duration(500)} style={[styles.header, { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.xl, marginBottom: theme.spacing.sm, justifyContent: 'space-between', width: '100%', paddingRight: theme.spacing.md }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ScalePress style={[styles.backBtn, { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.card, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md }]} onPress={() => navigation.goBack()}>
            <ChevronLeft color={theme.colors.text} size={24} />
          </ScalePress>
          <View style={[styles.botInfo, { flexDirection: 'row', alignItems: 'center' }]}>
            <View style={[styles.botAvatar, { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: theme.colors.primary }]}>
              <Bot color="#fff" size={18} />
            </View>
            <View>
              <Text style={[styles.botName, { fontSize: 16, fontWeight: 'bold', color: theme.colors.text }]}>Trợ lý AnhEmMotor AI</Text>
              <View style={[styles.onlineRow, { flexDirection: 'row', alignItems: 'center', marginTop: 2 }]}>
                <View style={[styles.onlineDot, { width: 6, height: 6, borderRadius: 3, marginRight: 5, backgroundColor: theme.colors.success }]} />
                <Text style={[styles.onlineText, { fontSize: 11, color: theme.colors.success }]}>Trả lời ngay lập tức</Text>
              </View>
            </View>
          </View>
        </View>
        <ScalePress
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.card, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigation.navigate('CustomerHome', { screen: 'Profile', params: { openSettings: true } })}
        >
          <Settings color={theme.colors.text} size={22} />
        </ScalePress>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={[styles.suggestions, { paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.sm }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FAQ_SUGGESTIONS.map((q, i) => (
            <ScalePress key={i} style={[styles.suggestionChip, { flexDirection: 'row', alignItems: 'center', borderRadius: theme.radius.full, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, borderWidth: 1, backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} onPress={() => sendMessage(q)}>
              <Zap color={theme.colors.warning} size={12} />
              <Text style={[styles.suggestionText, { fontSize: 12, marginLeft: 4, color: theme.colors.subtext }]}>{q}</Text>
            </ScalePress>
          ))}
        </ScrollView>
      </Animated.View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.messageList, { paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.sm }]}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <Animated.View
            key={msg.id}
            entering={FadeInDown.duration(400).delay(index * 50)}
            style={[styles.msgWrapper, { flexDirection: 'row', alignItems: 'flex-end', marginBottom: theme.spacing.sm }, msg.from === 'user' && styles.msgRight]}
          >
            {msg.from === 'bot' && (
              <View style={[styles.botAvatarSmall, { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginRight: 8, backgroundColor: theme.colors.primary }]}>
                <Bot color="#fff" size={12} />
              </View>
            )}
            <View style={[styles.bubble, { maxWidth: '78%', borderRadius: 18, padding: theme.spacing.md }, msg.from === 'user' ? [styles.userBubble, { borderBottomRightRadius: 4, marginRight: 0, backgroundColor: theme.colors.primary }] : [styles.botBubble, { borderBottomLeftRadius: 4, backgroundColor: theme.colors.card }]]}>
              <Text style={[styles.bubbleText, { fontSize: 14, lineHeight: 20, color: msg.from === 'user' ? '#fff' : theme.colors.text }]}>{msg.text}</Text>
            </View>
          </Animated.View>
        ))}

        {isTyping && (
          <View style={styles.msgWrapper}>
            <View style={[styles.botAvatarSmall, { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginRight: 8, backgroundColor: theme.colors.primary }]}>
              <Bot color="#fff" size={12} />
            </View>
            <GlassCard style={[styles.typingBubble, { padding: theme.spacing.sm, borderRadius: theme.radius.lg }]} intensity={15}>
              <Text style={[styles.typingDots, { fontSize: 14, letterSpacing: 4, color: theme.colors.subtext }]}>● ● ●</Text>
            </GlassCard>
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={[styles.inputBar, { paddingHorizontal: theme.spacing.md, paddingBottom: 24, paddingTop: 8 }]}>
        <GlassCard style={[styles.inputCard, { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: 8 }]} intensity={20}>
          <TextInput
            style={[styles.textInput, { flex: 1, color: theme.colors.text, fontSize: 14, paddingVertical: 8 }]}
            value={input}
            onChangeText={setInput}
            placeholder="Nhập câu hỏi..."
            placeholderTextColor={DEFAULT_SUBTEXT}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
          />
          <ScalePress style={[styles.sendBtn, { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 8 }]} onPress={() => sendMessage()}>
            <Send color="#fff" size={18} />
          </ScalePress>
        </GlassCard>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DEFAULT_BG },

  header: {},
  backBtn: {},
  botInfo: {},
  botAvatar: {},
  botName: {},
  onlineRow: {},
  onlineDot: {},
  onlineText: {},

  suggestions: {},
  suggestionChip: {},
  suggestionText: {},

  messageList: {},
  msgWrapper: {},
  msgRight: { flexDirection: 'row-reverse' },

  botAvatarSmall: {},
  bubble: {},
  botBubble: {},
  userBubble: {},
  bubbleText: { color: '#fff' },

  typingBubble: {},
  typingDots: {},

  inputBar: {},
  inputCard: {},
  textInput: {},
  sendBtn: {},
});
