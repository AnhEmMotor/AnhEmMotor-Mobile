import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Theme } from '../../theme/Theme';
import { CheckCircle2, Circle, Clock, FileText } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function LegalProgressScreen() {
  const steps = [
    { id: 1, title: 'Đã hoàn tất thanh toán', date: '01/05/2026', completed: true },
    { id: 2, title: 'Đang chuẩn bị hồ sơ gốc', date: '03/05/2026', completed: true },
    { id: 3, title: 'Đang làm thủ tục đóng thuế', date: '05/05/2026', completed: true },
    { id: 4, title: 'Đợi bấm biển số', date: 'Dự kiến: 10/05/2026', completed: false },
    { id: 5, title: 'Bàn giao xe & Giấy tờ', date: 'Dự kiến: 12/05/2026', completed: false },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInUp.duration(600).delay(100)}>
        <Text style={styles.title}>Tiến độ Pháp lý</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.bikeName}>Kawasaki Z1000</Text>
          <Text style={styles.bikePlate}>Biển số: 59-A3 123.45</Text>
        </View>
      </Animated.View>

      <View style={styles.timelineContainer}>
        {steps.map((step, index) => (
          <Animated.View 
            key={step.id} 
            entering={FadeInDown.duration(600).delay(200 + index * 100)}
            style={styles.stepRow}
          >
            <View style={styles.leftLine}>
              <View style={[styles.iconWrapper, { backgroundColor: step.completed ? Theme.colors.success + '20' : 'rgba(255,255,255,0.05)' }]}>
                {step.completed ? 
                  <CheckCircle2 color={Theme.colors.success} size={20} /> : 
                  <Clock color={Theme.colors.subtext} size={20} />
                }
              </View>
              {index !== steps.length - 1 && (
                <View style={[styles.line, { backgroundColor: step.completed ? Theme.colors.success : 'rgba(255,255,255,0.1)' }]} />
              )}
            </View>
            <View style={styles.rightContent}>
              <GlassCard 
                style={[styles.contentCard, { borderColor: step.completed ? Theme.colors.success + '40' : 'rgba(255,255,255,0.1)' }]}
                intensity={step.completed ? 15 : 5}
              >
                <Text style={[styles.stepTitle, { color: step.completed ? Theme.colors.text : Theme.colors.subtext }]}>{step.title}</Text>
                <View style={styles.dateRow}>
                  <FileText color={Theme.colors.subtext} size={12} />
                  <Text style={styles.stepDate}>{step.date}</Text>
                </View>
              </GlassCard>
            </View>
          </Animated.View>
        ))}
      </View>
      
      <Animated.View entering={FadeInUp.duration(800).delay(1000)}>
        <LinearGradient
          colors={['rgba(0, 122, 255, 0.1)', 'rgba(0, 122, 255, 0.05)']}
          style={styles.infoCard}
        >
          <Text style={styles.infoText}>Hồ sơ của bạn đang được xử lý ưu tiên. Vui lòng chuẩn bị CCCD bản gốc khi đi bấm biển.</Text>
        </LinearGradient>
      </Animated.View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: Theme.spacing.lg },
  title: { color: Theme.colors.text, fontSize: 32, fontWeight: 'bold', marginTop: Theme.spacing.xl, marginBottom: Theme.spacing.sm },
  headerInfo: { marginBottom: Theme.spacing.xl },
  bikeName: { color: Theme.colors.primary, fontSize: 20, fontWeight: 'bold' },
  bikePlate: { color: Theme.colors.subtext, fontSize: 14, marginTop: 4 },
  
  timelineContainer: { paddingLeft: 5 },
  stepRow: { flexDirection: 'row', minHeight: 100 },
  leftLine: { alignItems: 'center', marginRight: Theme.spacing.md },
  iconWrapper: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', zIndex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  line: { width: 2, flex: 1, marginVertical: 4 },
  
  rightContent: { flex: 1, paddingBottom: Theme.spacing.lg },
  contentCard: { padding: Theme.spacing.md, borderRadius: Theme.radius.lg },
  stepTitle: { fontSize: 16, fontWeight: 'bold' },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  stepDate: { color: Theme.colors.subtext, fontSize: 12, marginLeft: 6 },

  infoCard: { padding: Theme.spacing.lg, borderRadius: Theme.radius.lg, borderWidth: 1, borderColor: 'rgba(0,122,255,0.2)', marginTop: Theme.spacing.md },
  infoText: { color: Theme.colors.text, fontSize: 13, lineHeight: 20, textAlign: 'center', fontStyle: 'italic' }
});
