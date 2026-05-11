import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Theme } from '../../theme/Theme';
import { ChevronLeft, Wrench, CheckCircle2, Circle, Clock } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import ScalePress from '../../components/ScalePress';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const SERVICE_HISTORY = [
  {
    id: 1,
    date: '08/05/2026',
    title: 'Bảo dưỡng định kỳ 15.000km',
    items: ['Thay nhớt động cơ 10W-40', 'Thay lọc nhớt', 'Thay lọc gió', 'Kiểm tra phanh'],
    cost: '1.250.000đ',
    technician: 'Minh Kỹ thuật',
    status: 'done',
  },
  {
    id: 2,
    date: '15/02/2026',
    title: 'Thay lốp & Căng xích',
    items: ['Thay lốp trước Michelin', 'Căng xích truyền động', 'Bơm lốp chuẩn áp suất'],
    cost: '2.100.000đ',
    technician: 'Hùng Kỹ thuật',
    status: 'done',
  },
  {
    id: 3,
    date: '10/01/2026',
    title: 'Kiểm tra khi mua xe',
    items: ['Kiểm tra tổng thể 24 hạng mục', 'Cân bằng bánh xe', 'Kiểm tra hệ thống điện'],
    cost: 'Miễn phí',
    technician: 'Đội kỹ thuật AnhEmMotor',
    status: 'done',
  },
];

const UPCOMING_REMINDERS = [
  { km: '20.000km', task: 'Thay nhớt & Lọc nhớt', dueDate: 'Dự kiến: Tháng 8/2026' },
  { km: '25.000km', task: 'Thay bugi', dueDate: 'Dự kiến: Tháng 11/2026' },
  { km: 'Mỗi năm', task: 'Gia hạn bảo hiểm xe', dueDate: 'Hết hạn: 01/01/2027' },
];

export default function ServiceHistoryScreen({ navigation, route }) {
  const vehicle = route?.params?.vehicle || { name: 'Kawasaki Z1000', plate: '59-A3 123.45' };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
        <ScalePress style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={Theme.colors.text} size={24} />
        </ScalePress>
        <View>
          <Text style={styles.headerTitle}>Lịch sử bảo trì</Text>
          <Text style={styles.headerSub}>{vehicle.name} · {vehicle.plate}</Text>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Nhắc nhở sắp tới */}
        <Animated.Text entering={FadeInDown.duration(500).delay(100)} style={styles.sectionTitle}>
          Nhắc nhở sắp tới
        </Animated.Text>
        {UPCOMING_REMINDERS.map((item, i) => (
          <Animated.View key={i} entering={FadeInDown.duration(500).delay(100 + i * 80)}>
            <GlassCard style={styles.reminderCard}>
              <View style={styles.kmBadge}>
                <Text style={styles.kmText}>{item.km}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.reminderTask}>{item.task}</Text>
                <Text style={styles.reminderDue}>{item.dueDate}</Text>
              </View>
            </GlassCard>
          </Animated.View>
        ))}

        {/* Dòng thời gian lịch sử */}
        <Animated.Text entering={FadeInDown.duration(500).delay(400)} style={[styles.sectionTitle, { marginTop: Theme.spacing.xl }]}>
          Lịch sử sửa chữa
        </Animated.Text>

        <View style={styles.timeline}>
          {SERVICE_HISTORY.map((entry, index) => (
            <Animated.View
              key={entry.id}
              entering={FadeInDown.duration(500).delay(400 + index * 120)}
              style={styles.timelineItem}
            >
              {/* Đường kẻ + Icon */}
              <View style={styles.timelineSide}>
                <View style={styles.timelineDot}>
                  <CheckCircle2 color={Theme.colors.success} size={20} />
                </View>
                {index < SERVICE_HISTORY.length - 1 && <View style={styles.timelineLine} />}
              </View>

              {/* Nội dung */}
              <GlassCard style={styles.timelineCard} intensity={12}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardDate}>{entry.date}</Text>
                  <Text style={styles.cardCost}>{entry.cost}</Text>
                </View>
                <Text style={styles.cardTitle}>{entry.title}</Text>
                <View style={styles.itemList}>
                  {entry.items.map((item, i) => (
                    <View key={i} style={styles.itemRow}>
                      <View style={styles.itemDot} />
                      <Text style={styles.itemText}>{item}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.techRow}>
                  <Wrench color={Theme.colors.subtext} size={12} />
                  <Text style={styles.techText}>{entry.technician}</Text>
                </View>
              </GlassCard>
            </Animated.View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Theme.spacing.md, marginTop: Theme.spacing.xl, marginBottom: Theme.spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.card, justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  headerTitle: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: Theme.colors.subtext, fontSize: 13, marginTop: 2 },

  content: { paddingHorizontal: Theme.spacing.md },
  sectionTitle: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: Theme.spacing.md },

  reminderCard: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.md, marginBottom: Theme.spacing.sm },
  kmBadge: { backgroundColor: 'rgba(245,158,11,0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: Theme.radius.sm, borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  kmText: { color: Theme.colors.warning, fontSize: 12, fontWeight: 'bold' },
  reminderTask: { color: Theme.colors.text, fontSize: 14, fontWeight: 'bold' },
  reminderDue: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2 },

  timeline: { paddingLeft: 4 },
  timelineItem: { flexDirection: 'row', marginBottom: Theme.spacing.md },
  timelineSide: { alignItems: 'center', width: 36 },
  timelineDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(16,185,129,0.1)', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  timelineLine: { width: 2, flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginTop: 4 },

  timelineCard: { flex: 1, marginLeft: Theme.spacing.sm, padding: Theme.spacing.md, borderRadius: Theme.radius.lg },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  cardDate: { color: Theme.colors.subtext, fontSize: 12 },
  cardCost: { color: Theme.colors.primary, fontSize: 13, fontWeight: 'bold' },
  cardTitle: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold', marginBottom: Theme.spacing.sm },

  itemList: { marginBottom: Theme.spacing.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  itemDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Theme.colors.primary, marginRight: 8 },
  itemText: { color: Theme.colors.subtext, fontSize: 13 },

  techRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: Theme.spacing.sm },
  techText: { color: Theme.colors.subtext, fontSize: 11, marginLeft: 6 },
});
