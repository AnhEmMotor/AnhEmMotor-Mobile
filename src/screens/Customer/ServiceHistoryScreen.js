import React from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { ChevronLeft, Wrench, CheckCircle2 } from 'lucide-react-native'; // Import useTheme
import { useTheme } from '../../theme/Theme';
import GlassCard from '../../components/GlassCard';
import ScalePress from '../../components/ScalePress';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useServiceHistoryController } from './hooks/useServiceHistoryController';


export default function ServiceHistoryScreen({ navigation, route }) {
  const vehicle = route?.params?.vehicle || { id: '1', name: 'Kawasaki Z1000', plate: '59-A3 123.45' };
  const theme = useTheme();
  
  const { history, reminders, loading } = useServiceHistoryController(vehicle.id || '1');

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
        <ScalePress style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={theme.colors.text} size={24} />
        </ScalePress>
        <View>
          <Text style={styles.headerTitle}>Lịch sử bảo trì</Text>
          <Text style={styles.headerSub}>{vehicle.name} · {vehicle.plate}</Text>
        </View>
      </Animated.View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          {/* Nhắc nhở sắp tới */}
          <Animated.Text entering={FadeInDown.duration(500).delay(100)} style={styles.sectionTitle}>
            Nhắc nhở sắp tới
          </Animated.Text> {/* Use getStyles for sectionTitle */}
          {reminders.map((item, i) => (
            <Animated.View key={i} entering={FadeInDown.duration(500).delay(100 + i * 80)}>
              <GlassCard style={[getStyles(theme).reminderCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]} intensity={15}>
                <View style={[getStyles(theme).kmBadge, { borderColor: theme.colors.warning + '33', backgroundColor: theme.colors.warning + '26' }]}>
                  <Text style={[getStyles(theme).kmText, { color: theme.colors.warning }]}>{item.km}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[getStyles(theme).reminderTask, { color: theme.colors.text }]}>{item.task}</Text>
                  <Text style={[getStyles(theme).reminderDue, { color: theme.colors.subtext }]}>{item.dueDate}</Text>
                </View>
              </GlassCard>
            </Animated.View>
          ))}

          {/* Dòng thời gian lịch sử */}
          <Animated.Text entering={FadeInDown.duration(500).delay(400)} style={[styles.sectionTitle, { marginTop: Theme.spacing.xl }]}>
            Lịch sử sửa chữa {/* Use getStyles for sectionTitle */}
          </Animated.Text>

          <View style={getStyles(theme).timeline}>
            {history.map((entry, index) => (
              <Animated.View
                key={entry.id}
                entering={FadeInDown.duration(500).delay(400 + index * 120)}
                style={getStyles(theme).timelineItem}
              >
                {/* Đường kẻ + Icon */}
                <View style={getStyles(theme).timelineSide}>
                  <View style={[getStyles(theme).timelineDot, { backgroundColor: theme.colors.success + '1A' }]}>
                    <CheckCircle2 color={theme.colors.success} size={20} />
                  </View>
                  {index < history.length - 1 && <View style={[getStyles(theme).timelineLine, { backgroundColor: theme.colors.border }]} />}
                </View>

                {/* Nội dung */}
                <GlassCard style={[getStyles(theme).timelineCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]} intensity={12}>
                  <View style={getStyles(theme).cardHeader}>
                    <Text style={[getStyles(theme).cardDate, { color: theme.colors.subtext }]}>{entry.date}</Text>
                    <Text style={[getStyles(theme).cardCost, { color: theme.colors.primary }]}>{entry.cost}</Text>
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
                  <View style={[getStyles(theme).techRow, { borderTopColor: theme.colors.border }]}>
                    <Wrench color={theme.colors.subtext} size={12} />
                    <Text style={styles.techText}>{entry.technician}</Text>
                  </View>
                </GlassCard>
              </Animated.View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.xl, marginBottom: theme.spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.card, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerSub: { fontSize: 13, marginTop: 2 },

  content: { paddingHorizontal: theme.spacing.md },
  sectionTitle: { color: theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: theme.spacing.md },

  reminderCard: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md, marginBottom: theme.spacing.sm, borderRadius: theme.radius.lg },
  kmBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: theme.radius.sm, borderWidth: 1 },
  kmText: { fontSize: 12, fontWeight: 'bold' },
  reminderTask: { fontSize: 14, fontWeight: 'bold' },
  reminderDue: { fontSize: 12, marginTop: 2 },

  timeline: { paddingLeft: 4 }, // This is fine
  timelineItem: { flexDirection: 'row', marginBottom: theme.spacing.md },
  timelineSide: { alignItems: 'center', width: 36 },
  timelineDot: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  timelineLine: { width: 2, flex: 1, marginTop: 4 },

  timelineCard: { flex: 1, marginLeft: theme.spacing.sm, padding: theme.spacing.md, borderRadius: theme.radius.lg },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  cardDate: { fontSize: 12 },
  cardCost: { fontSize: 13, fontWeight: 'bold' },
  cardTitle: { color: theme.colors.text, fontSize: 15, fontWeight: 'bold', marginBottom: theme.spacing.sm },

  itemList: { marginBottom: theme.spacing.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  itemDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: theme.colors.primary, marginRight: 8 },
  itemText: { color: theme.colors.subtext, fontSize: 13 },

  techRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, paddingTop: theme.spacing.sm },
  techText: { color: theme.colors.subtext, fontSize: 11, marginLeft: 6 },
});
