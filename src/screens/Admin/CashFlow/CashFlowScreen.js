import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import { Theme, useActiveColors } from '../../../theme/Theme';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Bike, 
  Package, 
  FileText,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  Check,
  X,
  RefreshCcw,
  ChevronLeft
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp, FadeInRight, Layout } from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  backBtn: { width: 38, height: 38, borderRadius: 0, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  title: { color: colors.text, fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: colors.subtext, fontSize: 13, marginTop: 4 },

  goldenNumbers: { marginBottom: Theme.spacing.lg },
  mainBalanceCard: { borderRadius: 0, padding: 24, borderWidth: 1, borderColor: colors.border },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  goldLabel: { color: colors.subtext, fontSize: 13 },
  goldValue: { color: colors.text, fontSize: 28, fontWeight: 'bold', marginTop: 8 },
  growthBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.success + '25', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 0 },
  growthText: { color: colors.success, fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  
  pendingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 24, backgroundColor: colors.surface, borderRadius: 0, borderWidth: 1, borderColor: colors.border, padding: 16 },
  pendingBox: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  verticalDivider: { width: 1, height: 30, backgroundColor: colors.border, marginHorizontal: 16 },
  pendingLabel: { color: colors.subtext, fontSize: 10 },
  pendingValue: { color: colors.text, fontSize: 14, fontWeight: 'bold', marginTop: 2 },

  section: { marginTop: Theme.spacing.xl },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  badge: { backgroundColor: colors.error, minWidth: 20, height: 20, borderRadius: 0, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  categoryGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  categoryCard: { width: (screenWidth - 48 - 24) / 3, padding: 16, alignItems: 'center' },
  catLabel: { color: colors.subtext, fontSize: 10, marginTop: 8 },
  catValue: { color: colors.text, fontSize: 15, fontWeight: 'bold', marginTop: 4 },

  approvalCard: { padding: 0, overflow: 'hidden' },
  pendingAction: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  actionIconBox: { width: 48, height: 48, borderRadius: 0, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  actionMain: { color: colors.text, fontSize: 14, fontWeight: '600' },
  actionSub: { color: colors.subtext, fontSize: 11, marginTop: 2 },
  actionButtons: { flexDirection: 'row' },
  rejectSmall: { width: 36, height: 36, borderRadius: 0, borderWidth: 1, borderColor: colors.error + '33', backgroundColor: colors.error + '10', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  approveSmall: { width: 36, height: 36, borderRadius: 0, backgroundColor: colors.success, justifyContent: 'center', alignItems: 'center' },

  exportBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '1A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 0 },
  exportText: { color: colors.primary, fontSize: 12, fontWeight: 'bold', marginLeft: 6 },

  transCard: { flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 12 },
  transIconBox: { width: 44, height: 44, borderRadius: 0, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  transMain: { flex: 1, marginLeft: 16 },
  transTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  transTitle: { color: colors.text, fontSize: 15, fontWeight: 'bold' },
  transAmount: { fontSize: 15, fontWeight: 'bold' },
  transBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  transMeta: { color: colors.subtext, fontSize: 11 },
  pendingBadge: { backgroundColor: colors.warning + '1A', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 0 },
  pendingBadgeText: { color: colors.warning, fontSize: 10, fontWeight: 'bold' }
});

export default function CashFlowScreen({ navigation }) {
  const colors = useActiveColors();
  const styles = getStyles(colors);

  const [approving, setApproving] = useState(false);
  const transactions = [
    { id: '1', title: 'Khách A cọc Winner X', amount: '+2.000.000đ', time: '14:30', performer: 'NV Lan', method: 'Chuyển khoản', methodIcon: Smartphone, status: 'Completed' },
    { id: '2', title: 'Bán nón fullface AGV', amount: '+4.500.000đ', time: '13:15', performer: 'NV Minh', method: 'Tiền mặt', methodIcon: Banknote, status: 'Completed' },
    { id: '3', title: 'Chi tiền xăng giao xe', amount: '-200.000đ', time: '11:00', performer: 'Admin', method: 'Tiền mặt', methodIcon: Banknote, status: 'Pending' },
  ];

  const handleApprove = () => {
    setApproving(true);
    setTimeout(() => setApproving(false), 1500);
  };

  return (
    <View style={styles.container}>
      {/* II.5 HEADER (STRATEGY: CORPORATE WALLET) */}
      <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
        {navigation && navigation.canGoBack && navigation.canGoBack() && (
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft color={colors.text} size={20} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1, marginLeft: (navigation && navigation.canGoBack && navigation.canGoBack()) ? 12 : 0 }}>
          <Text style={styles.title}>Dòng Tiền Hệ Thống 💰</Text>
          <Text style={styles.subtitle}>Quản trị minh bạch & phê duyệt tức thời</Text>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* II.5.A CHỈ SỐ DOANH THU (GOLDEN NUMBERS) */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.goldenNumbers}>
          <LinearGradient colors={['#111111', '#050505']} style={styles.mainBalanceCard}>
            <View style={styles.balanceHeader}>
              <View>
                <Text style={styles.goldLabel}>Doanh thu thực tế (Net)</Text>
                <Text style={styles.goldValue}>1.250.850.000đ</Text>
              </View>
              <View style={styles.growthBadge}>
                <TrendingUp color={colors.success} size={14} />
                <Text style={styles.growthText}>+12.5%</Text>
              </View>
            </View>
            
            <View style={styles.pendingRow}>
              <View style={styles.pendingBox}>
                <Clock color={colors.warning} size={16} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.pendingLabel}>Tiền đang treo (Pending)</Text>
                  <Text style={styles.pendingValue}>150.000.000đ</Text>
                </View>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.pendingBox}>
                <ShieldCheck color={colors.info} size={16} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.pendingLabel}>Tốc độ tăng trưởng</Text>
                  <Text style={styles.pendingValue}>2.4x</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* II.5.B PHÂN LOẠI NGUỒN THU */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cấu trúc Nguồn thu</Text>
          <View style={styles.categoryGrid}>
            <GlassCard style={styles.categoryCard}>
              <Bike color={colors.primary} size={24} />
              <Text style={styles.catLabel}>Xe máy</Text>
              <Text style={styles.catValue}>980M</Text>
            </GlassCard>
            <GlassCard style={styles.categoryCard}>
              <Package color={colors.warning} size={24} />
              <Text style={styles.catLabel}>Phụ kiện</Text>
              <Text style={styles.catValue}>125M</Text>
            </GlassCard>
            <GlassCard style={styles.categoryCard}>
              <FileText color={colors.success} size={24} />
              <Text style={styles.catLabel}>VAT & DV</Text>
              <Text style={styles.catValue}>45.8M</Text>
            </GlassCard>
          </View>
        </View>

        {/* II.5.D PHÊ DUYỆT & ĐỐI SOÁT (ACTION CENTER) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trung tâm Phê duyệt</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
          </View>
          
          <GlassCard style={styles.approvalCard}>
            <View style={styles.pendingAction}>
              <View style={[styles.actionIconBox, { backgroundColor: colors.success + '25', borderColor: colors.success + '55' }]}>
                <ShieldCheck color={colors.success} size={24} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.actionMain}>Xác nhận cọc: Winner X</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.actionSub}>Khách: Anh Quân • 2.000.000đ</Text>
              </View>
              <View style={styles.actionButtons}>
                <Pressable style={styles.approveSmall} onPress={handleApprove}>
                  {approving ? <RefreshCcw color="#fff" size={20} /> : <Check color="#fff" size={20} />}
                </Pressable>
              </View>
            </View>
            
            <View style={[styles.pendingAction, { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <View style={[styles.actionIconBox, { backgroundColor: colors.warning + '25', borderColor: colors.warning + '55' }]}>
                <Banknote color={colors.warning} size={24} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.actionMain}>Duyệt chi xăng xe giao khách</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.actionSub}>Yêu cầu: NV Nam • 200.000đ</Text>
              </View>
              <View style={styles.actionButtons}>
                <Pressable style={styles.rejectSmall}>
                  <X color={colors.error} size={20} />
                </Pressable>
                <Pressable style={styles.approveSmall} onPress={handleApprove}>
                  {approving ? <RefreshCcw color="#fff" size={20} /> : <Check color="#fff" size={20} />}
                </Pressable>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* II.5.C MINH BẠCH HÓA DÒNG TIỀN (TRANSPARENCY LOG) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nhật ký Real-time</Text>
            <Pressable style={styles.exportBtn}>
              <FileText color={colors.primary} size={14} />
              <Text style={styles.exportText}>Xuất báo cáo</Text>
            </Pressable>
          </View>
          
          {transactions.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInRight.delay(300 + index * 100)} layout={Layout.springify()}>
              <GlassCard style={styles.transCard}>
                <View style={styles.transIconBox}>
                  <item.methodIcon color={colors.text} size={20} />
                </View>
                <View style={styles.transMain}>
                  <View style={styles.transTop}>
                    <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.transTitle}>{item.title}</Text>
                    <Text numberOfLines={1} style={[styles.transAmount, { color: item.amount.startsWith('+') ? colors.success : colors.error }]}>
                      {item.amount}
                    </Text>
                  </View>
                  <View style={styles.transBottom}>
                    <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.8} style={styles.transMeta}>{item.time} • {item.performer} • {item.method}</Text>
                    {item.status === 'Pending' && (
                      <View style={styles.pendingBadge}>
                        <Text numberOfLines={1} style={styles.pendingBadgeText}>Đợi duyệt</Text>
                      </View>
                    )}
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

