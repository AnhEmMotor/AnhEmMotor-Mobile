import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Pressable } from 'react-native';
import { Theme } from '../../theme/Theme';
import { Phone, MessageSquare, MoreVertical, Flame, Calendar, ChevronRight, Bike, Plus } from 'lucide-react-native';
import { MOCK_LEADS } from '../../constants/MockData';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function LeadScreen() {
  const leads = MOCK_LEADS;

  return (
    <View style={styles.container}>
      {/* II.1 QUICK STATS - LEADS SECTION */}
      <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
        <View>
          <Text style={styles.title}>Quản Lý Lead 🎯</Text>
          <Text style={styles.subTitle}>{leads.length} khách hàng đang quan tâm</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Calendar color={Theme.colors.text} size={20} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {leads.map((item, index) => (
          <Animated.View 
            key={item.id} 
            entering={FadeInDown.duration(800).delay(200 + index * 100)}
            layout={Layout.springify()}
          >
            <GlassCard style={styles.leadCard} intensity={15}>
              <View style={styles.cardHeader}>
                <View style={styles.nameSection}>
                  <Text style={styles.leadName}>{item.name}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: item.color + '15' }]}>
                    <Flame color={item.color} size={12} strokeWidth={3} />
                    <Text style={[styles.priorityText, { color: item.color }]}>{item.status.toUpperCase()}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.moreBtn}>
                  <MoreVertical color={Theme.colors.subtext} size={20} />
                </TouchableOpacity>
              </View>

              <View style={styles.interestBox}>
                <View style={styles.interestRow}>
                  <Bike color={Theme.colors.primary} size={14} />
                  <Text style={styles.interestLabel}>Quan tâm: </Text>
                  <Text style={styles.interestValue}>{item.interest}</Text>
                </View>
                <Text style={styles.timeLabel}>{item.time}</Text>
              </View>
              
              <View style={styles.footerRow}>
                <View style={styles.actionGroup}>
                  <TouchableOpacity activeOpacity={0.7} style={[styles.actionBtn, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]} onPress={() => Linking.openURL('tel:0901234567')}>
                    <Phone color={Theme.colors.primary} size={18} />
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} style={[styles.actionBtn, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]} onPress={() => Linking.openURL('https://zalo.me')}>
                    <MessageSquare color={Theme.colors.success} size={18} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.detailBtn}>
                  <Text style={styles.detailText}>Xử lý Lead</Text>
                  <ChevronRight color={Theme.colors.primary} size={16} />
                </TouchableOpacity>
              </View>
            </GlassCard>
          </Animated.View>
        ))}
      </ScrollView>

      {/* FAB - ADD NEW LEAD (II.1 RULE) */}
      <Pressable style={styles.fab}>
        <LinearGradient colors={[Theme.colors.secondary, '#991B1B']} style={styles.fabGradient}>
          <Plus color="#fff" size={24} />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  title: { color: Theme.colors.text, fontSize: 28, fontWeight: 'bold' },
  subTitle: { color: Theme.colors.subtext, fontSize: 13, marginTop: 4 },
  filterBtn: { backgroundColor: Theme.colors.card, padding: 12, borderRadius: Theme.radius.md, borderWidth: 1, borderColor: Theme.colors.border },

  leadCard: { padding: 20, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  nameSection: { flex: 1 },
  leadName: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  moreBtn: { padding: 4 },
  
  priorityBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  priorityText: { fontSize: 10, fontWeight: '900', marginLeft: 6, letterSpacing: 1 },
  
  interestBox: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, marginBottom: 20 },
  interestRow: { flexDirection: 'row', alignItems: 'center' },
  interestLabel: { color: Theme.colors.subtext, fontSize: 13, marginLeft: 8 },
  interestValue: { color: Theme.colors.text, fontSize: 14, fontWeight: 'bold' },
  timeLabel: { color: Theme.colors.subtext, fontSize: 11, marginTop: 8 },

  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 16 },
  actionGroup: { flexDirection: 'row' },
  actionBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  
  detailBtn: { flexDirection: 'row', alignItems: 'center' },
  detailText: { color: Theme.colors.primary, fontWeight: 'bold', fontSize: 13, marginRight: 6 },

  fab: { position: 'absolute', bottom: 30, right: 24, width: 56, height: 56, borderRadius: 28, elevation: 8, boxShadow: `0 4px 8px rgba(220, 38, 38, 0.3)` },
  fabGradient: { flex: 1, borderRadius: 28, justifyContent: 'center', alignItems: 'center' }
});