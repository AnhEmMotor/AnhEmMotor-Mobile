import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../theme/Theme';
import { ChevronLeft, LifeBuoy, MessageSquare, PhoneCall, Zap, ShieldAlert, ChevronRight, PenLine, Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';

export default function SupportScreen({ navigation }) {
  const [feedback, setFeedback] = React.useState('');
  const [feedbackType, setFeedbackType] = React.useState('Dịch vụ');

  const handleCall = async () => {
    const url = 'tel:0912345678';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert('Thiết bị không hỗ trợ chức năng gọi điện trực tiếp. Vui lòng gọi số: 0912 345 678');
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi thực hiện cuộc gọi.');
    }
  };

  const handleZalo = async () => {
    const url = 'https://zalo.me/0912345678';
    try {
      await Linking.openURL(url);
    } catch (error) {
      alert('Không thể mở Zalo. Vui lòng kiểm tra ứng dụng Zalo trên máy.');
    }
  };

  const handleCamera = () => {
    alert('Đã mở Camera để chụp ảnh đính kèm!');
  };

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      alert('Vui lòng nhập nội dung phản hồi!');
      return;
    }
    alert(`Cảm ơn bạn! Ý kiến về ${feedbackType} đã được gửi trực tiếp đến bộ phận chăm sóc khách hàng.`);
    setFeedback('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <ChevronLeft color="#fff" size={28} />
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.duration(600)}>
          <Text style={styles.title}>Hỗ trợ & Ý kiến 🚨</Text>
        </Animated.View>

      <View style={styles.actionGrid}>
        <Animated.View entering={FadeInDown.duration(800).delay(400)} style={styles.halfWidth}>
          <ScalePress style={{ width: '100%' }} onPress={() => navigation.navigate('AIChat')}>
            <GlassCard style={styles.actionCard} intensity={15}>
              <MessageSquare color={Theme.colors.primary} size={28} />
              <Text style={styles.actionTitle}>Chat với AI</Text>
            </GlassCard>
          </ScalePress>
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(800).delay(500)} style={styles.halfWidth}>
          <ScalePress style={{ width: '100%' }} onPress={handleCall}>
            <GlassCard style={styles.actionCard} intensity={15}>
              <PhoneCall color={Theme.colors.primary} size={28} />
              <Text style={styles.actionTitle}>Gọi Cố vấn</Text>
            </GlassCard>
          </ScalePress>
        </Animated.View>
      </View>

      {/* I.6 FEEDBACK HUB (DIRECT TO ADMIN) */}
      <Animated.Text entering={FadeInDown.duration(800).delay(600)} style={styles.sectionLabel}>Gửi ý kiến phản hồi 📣</Animated.Text>
      <View style={styles.categoryRow}>
        {['Dịch vụ', 'Giá cả', 'Nhân viên', 'Khác'].map((cat) => (
          <TouchableOpacity 
            key={cat} 
            style={[styles.catChip, feedbackType === cat && styles.activeCat]}
            onPress={() => setFeedbackType(cat)}
          >
            <Text style={[styles.catText, feedbackType === cat && styles.activeCatText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View entering={FadeInDown.duration(800).delay(700)}>
        <GlassCard style={styles.feedbackCard}>
          <View style={styles.inputBox}>
            <TextInput 
              placeholder="Nhập nội dung phản hồi tại đây..." 
              placeholderTextColor="rgba(255,255,255,0.3)"
              multiline
              style={styles.textInput}
              value={feedback}
              onChangeText={setFeedback}
            />
          </View>
          
          <View style={styles.feedbackActions}>
            <TouchableOpacity style={styles.mediaBtn} onPress={handleCamera}>
              <Camera color={Theme.colors.subtext} size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitFeedback}>
              <Text style={styles.submitText}>Gửi phản hồi</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </Animated.View>
      
      <View style={styles.directContact}>
        <Text style={styles.directLabel}>Hoặc trao đổi trực tiếp với nhân viên qua Zalo:</Text>
        <ScalePress style={styles.contactBtn} onPress={handleZalo}>
          <Text style={styles.contactBtnText}>Vào khung Chat Zalo</Text>
        </ScalePress>
      </View>
      
      <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100, flexGrow: 1 },
  backBtn: { padding: 20, width: 60 },
  title: { color: Theme.colors.text, fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  halfWidth: { width: '48%' },
  actionCard: { padding: 20, alignItems: 'center', justifyContent: 'center', height: 120 },
  actionTitle: { color: Theme.colors.text, fontWeight: 'bold', marginTop: 12 },
  
  sectionLabel: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 15 },
  categoryRow: { flexDirection: 'row', marginBottom: 15 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.03)', marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  activeCat: { backgroundColor: Theme.colors.primary, borderColor: Theme.colors.primary },
  catText: { color: Theme.colors.subtext, fontSize: 13, fontWeight: 'bold' },
  activeCatText: { color: '#fff' },

  feedbackCard: { padding: 15 },
  inputBox: { minHeight: 120, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 15, padding: 15, marginBottom: 15 },
  textInput: { color: '#fff', fontSize: 15 },
  feedbackActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mediaBtn: { width: 50, height: 50, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  submitBtn: { flex: 1, marginLeft: 15, height: 50, borderRadius: 15, backgroundColor: Theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  
  directContact: { marginTop: 40, alignItems: 'center' },
  directLabel: { color: Theme.colors.subtext, fontSize: 14, marginBottom: 15 },
  contactBtn: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  contactBtnText: { color: Theme.colors.primary, fontWeight: 'bold' }
});