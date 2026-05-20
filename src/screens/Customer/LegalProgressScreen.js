import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useTheme } from '../../theme/Theme'; // Import useTheme
import { CheckCircle2, Circle, Clock, FileText } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function LegalProgressScreen() {
  const steps = [
    { id: 1, title: 'Đã hoàn tất thanh toán', date: '01/05/2026', completed: true, icon: CheckCircle2, iconColor: 'success' },
    { id: 2, title: 'Đang chuẩn bị hồ sơ gốc', date: '03/05/2026', completed: true, icon: CheckCircle2, iconColor: 'success' },
    { id: 3, title: 'Đang làm thủ tục đóng thuế', date: '05/05/2026', completed: true, icon: CheckCircle2, iconColor: 'success' },
    { id: 4, title: 'Đợi bấm biển số', date: 'Dự kiến: 10/05/2026', completed: false, icon: Clock, iconColor: 'subtext' },
    { id: 5, title: 'Bàn giao xe & Giấy tờ', date: 'Dự kiến: 12/05/2026', completed: false, icon: Clock, iconColor: 'subtext' },
  ];
  const theme = useTheme(); // Use the useTheme hook

  return (
    <ScrollView style={getStyles(theme).container} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInUp.duration(600).delay(100)}>
        <Text style={[getStyles(theme).title, { color: theme.colors.text }]}>Tiến độ Pháp lý</Text>
        <View style={getStyles(theme).headerInfo}>
          <Text style={[getStyles(theme).bikeName, { color: theme.colors.primary }]}>Kawasaki Z1000</Text>
          <Text style={[getStyles(theme).bikePlate, { color: theme.colors.subtext }]}>Biển số: 59-A3 123.45</Text>
        </View>
      </Animated.View>

      <View style={getStyles(theme).timelineContainer}>
        {steps.map((step, index) => (
          <Animated.View
            key={step.id}
            entering={FadeInDown.duration(600).delay(200 + index * 100)}
            style={getStyles(theme).stepRow}
          >
            <View style={getStyles(theme).leftLine}>
              <View style={[getStyles(theme).iconWrapper, { backgroundColor: theme.colors[step.iconColor] + '20', borderColor: theme.colors.border }]}>
                {React.createElement(step.icon, { color: theme.colors[step.iconColor], size: 20 })}
              </View>
              {index !== steps.length - 1 && (
                <View style={[getStyles(theme).line, { backgroundColor: step.completed ? theme.colors.success : theme.colors.border }]} />
              )}
            </View>
            <View style={getStyles(theme).rightContent}>
              <GlassCard
                style={[getStyles(theme).contentCard, { borderColor: step.completed ? theme.colors.success + '40' : theme.colors.border, backgroundColor: theme.colors.card }]}
                intensity={step.completed ? 15 : 5}
              >
                <Text style={[getStyles(theme).stepTitle, { color: step.completed ? theme.colors.text : theme.colors.subtext }]}>{step.title}</Text>
                <View style={getStyles(theme).dateRow}>
                  <FileText color={theme.colors.subtext} size={12} />
                  <Text style={[getStyles(theme).stepDate, { color: theme.colors.subtext }]}>{step.date}</Text>
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

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: theme.spacing.lg },
  title: { fontSize: 32, fontWeight: 'bold', marginTop: theme.spacing.xl, marginBottom: theme.spacing.sm },
  headerInfo: { marginBottom: theme.spacing.xl },
  bikeName: { fontSize: 20, fontWeight: 'bold' },
  bikePlate: { fontSize: 14, marginTop: 4 },

  timelineContainer: { paddingLeft: 5 }, // This is fine
  stepRow: { flexDirection: 'row', minHeight: 100 },
  leftLine: { alignItems: 'center', marginRight: theme.spacing.md },
  iconWrapper: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', zIndex: 1, borderWidth: 1 },
  line: { width: 2, flex: 1, marginVertical: 4 },

  rightContent: { flex: 1, paddingBottom: theme.spacing.lg },
  contentCard: { padding: theme.spacing.md, borderRadius: theme.radius.lg },
  stepTitle: { fontSize: 16, fontWeight: 'bold' },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  stepDate: { fontSize: 12, marginLeft: 6 },

  infoCard: { padding: theme.spacing.lg, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: 'rgba(0,122,255,0.2)', marginTop: theme.spacing.md },
  infoText: { color: theme.colors.text, fontSize: 13, lineHeight: 20, textAlign: 'center', fontStyle: 'italic' } // This is fine
});

