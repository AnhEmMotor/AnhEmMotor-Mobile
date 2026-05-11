import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, TextInput } from 'react-native';
import { Theme } from '../../theme/Theme';
import { LifeBuoy, MessageSquare, PhoneCall, Zap, ShieldAlert, ChevronRight, PenLine, Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';

export default function SupportScreen({ navigation }) {
  const [feedbackType, setFeedbackType] = React.useState('Service');
  const [sosSent, setSosSent] = React.useState(false);

  const callEmergency = () => {
    setSosSent(true);
    setTimeout(() => {
      setSosSent(false);
      alert('Tín hiệu SOS đã được gửi! Kỹ thuật viên sẽ liên hệ bạn ngay lập tức.');
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* I.6 SOS SIGNAL (RAPID RESPONSE) */}
      <Animated.View entering={FadeInUp.duration(600).delay(100)}>
        <Text style={styles.title}>Hỗ trợ & Cứu hộ 🚨</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(800).delay(200)}>
        <ScalePress onPress={callEmergency}>
          <LinearGradient
            colors={sosSent ? ['#10B981', '#064E3B'] : [Theme.colors.secondary, '#7F1D1D']}
            style={styles.sosGradient}
          >
            <View style={styles.sosInner}>
              <ShieldAlert color="#fff" size={48} />
              <Text style={styles.sosText}>{sosSent ? 'ĐANG GỬI...' : 'YÊU CẦU CỨU HỘ'}</Text>
              <Text style={styles.sosDesc}>Tọa độ của bạn sẽ được gửi tới showroom</Text>
            </View>
          </LinearGradient>
        </ScalePress>
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
          <ScalePress style={{ width: '100%' }}>
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
            />
          </View>
          
          <View style={styles.feedbackActions}>
            <TouchableOpacity style={styles.mediaBtn}>
              <Camera color={Theme.colors.subtext} size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={() => alert('Cảm ơn bạn đã phản hồi!')}>
              <Text style={styles.submitText}>Gửi phản hồi</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </Animated.View>
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: 20 },
  title: { color: Theme.colors.text, fontSize: 28, fontWeight: 'bold', marginTop: Theme.spacing.xl + 20, marginBottom: 20 },
  
  sosGradient: { borderRadius: 25, padding: 30, elevation: 15, boxShadow: `0 10px 20px rgba(220, 38, 38, 0.5)` },
  sosInner: { alignItems: 'center' },
  sosText: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 15, letterSpacing: 1.5 },
  sosDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 5, textAlign: 'center' },
  
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
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
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});