import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Theme, useTheme } from '../../theme/Theme';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  DollarSign,
  Calendar,
  ChevronRight,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';
import { LineChart } from 'react-native-chart-kit';

const DEFAULT_BG = '#0B0F19';

export default function FinancialHubScreen({ navigation }) {
  const theme = useTheme();
  
  const assets = [
    { id: '1', name: 'Kawasaki Z1000', value: 420000000, trend: '+2%' },
    { id: '2', name: 'Honda CBR150R', value: 65000000, trend: '-5%' },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { padding: theme.spacing.md }]}>
        <Animated.View entering={FadeInUp.duration(800)} style={[styles.header, { marginTop: theme.spacing.xl + 20, marginBottom: 25 }]}>
          <Text style={[styles.title, { color: theme.colors.text, fontSize: 26, fontWeight: 'bold' }]}>Tài chính của tôi 💰</Text>
          <Text style={[styles.subtitle, { color: theme.colors.subtext, fontSize: 14, marginTop: 4 }]}>Quản lý tài sản & Giá trị thị trường</Text>
        </Animated.View>

        {/* TOTAL ASSET CARD */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <LinearGradient colors={[theme.colors.card, theme.colors.background]} style={[styles.totalCard, { padding: 25, borderRadius: 25, marginBottom: 30, borderWidth: 1, borderColor: theme.colors.border }]}>
            <View style={styles.totalHeader}>
              <Wallet color={theme.colors.primary} size={20} />
              <Text style={[styles.totalLabel, { color: theme.colors.subtext, fontSize: 13, marginLeft: 10 }]}>Ước tính tổng giá trị tài sản</Text>
            </View>
            <Text style={[styles.totalValue, { color: theme.colors.text, fontSize: 32, fontWeight: '900' }]}>{formatCurrency(485000000)}</Text>
            <View style={styles.trendRow}>
              <TrendingUp color={theme.colors.success} size={16} />
              <Text style={[styles.trendText, { color: theme.colors.success, fontSize: 12, fontWeight: 'bold', marginLeft: 8 }]}>+12.5% so với năm ngoái</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ASSET LIST */}
        <Text style={[styles.sectionTitle, { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10, color: theme.colors.text }]}>Danh mục tài sản 🏍️</Text>
        {assets.map((asset, index) => (
          <Animated.View key={asset.id} entering={FadeInDown.delay(300 + index * 100)}>
            <GlassCard style={[styles.assetCard, { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderRadius: theme.radius.lg, backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }]}>
              <View style={styles.assetInfo}>
                <Text style={[styles.assetName, { color: theme.colors.subtext, fontSize: 13 }]}>{asset.name}</Text>
                <Text style={[styles.assetValue, { color: theme.colors.text, fontSize: 16, fontWeight: 'bold', marginTop: 4 }]}>{formatCurrency(asset.value)}</Text>
              </View>
              <View style={[styles.trendBadge, { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: asset.trend.startsWith('+') ? theme.colors.success + '1A' : theme.colors.secondary + '1A' }]}>
                {asset.trend.startsWith('+') ? <ArrowUpRight size={12} color={theme.colors.success} /> : <ArrowDownRight size={12} color={theme.colors.secondary} />}
                <Text style={[styles.trendValue, { fontSize: 12, fontWeight: 'bold', marginLeft: 4, color: asset.trend.startsWith('+') ? Theme.staticColors.success : Theme.staticColors.secondary }]}>{asset.trend}</Text>
              </View>
            </GlassCard>
          </Animated.View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DEFAULT_BG },
  scrollContent: {},
  header: {},
  title: {},
  subtitle: {},

  totalCard: {},
  totalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  totalLabel: {},
  totalValue: {},
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  trendText: {},

  sectionTitle: {},
  assetCard: {},
  assetInfo: { flexDirection: 'column' },
  assetName: {},
  assetValue: {},
  trendBadge: {},
  trendValue: {},

  chartCard: { padding: 15, alignItems: 'center', borderRadius: Theme.radius.lg, backgroundColor: DEFAULT_BG },
  chartHint: { color: '#94A3B8', fontSize: 10, marginTop: 10, textAlign: 'center' }
});
