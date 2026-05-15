import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Theme } from '../../theme/Theme';
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

export default function FinancialHubScreen({ navigation }) {
  const assets = [
    { id: '1', name: 'Kawasaki Z1000', value: 420000000, trend: '+2%' },
    { id: '2', name: 'Honda CBR150R', value: 65000000, trend: '-5%' },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <Text style={styles.title}>Tài chính của tôi 💰</Text>
          <Text style={styles.subtitle}>Quản lý tài sản & Giá trị thị trường</Text>
        </Animated.View>

        {/* TOTAL ASSET CARD */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.totalCard}>
            <View style={styles.totalHeader}>
                <Wallet color={Theme.colors.primary} size={20} />
                <Text style={styles.totalLabel}>Ước tính tổng giá trị tài sản</Text>
            </View>
            <Text style={styles.totalValue}>{formatCurrency(485000000)}</Text>
            <View style={styles.trendRow}>
                <TrendingUp color={Theme.colors.success} size={16} />
                <Text style={styles.trendText}>+12.5% so với năm ngoái</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ASSET LIST */}
        <Text style={styles.sectionTitle}>Danh mục tài sản 🏍️</Text>
        {assets.map((asset, index) => (
          <Animated.View key={asset.id} entering={FadeInDown.delay(300 + index * 100)}>
            <GlassCard style={styles.assetCard}>
              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>{asset.name}</Text>
                <Text style={styles.assetValue}>{formatCurrency(asset.value)}</Text>
              </View>
              <View style={[styles.trendBadge, { backgroundColor: asset.trend.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                {asset.trend.startsWith('+') ? <ArrowUpRight size={12} color={Theme.colors.success} /> : <ArrowDownRight size={12} color={Theme.colors.secondary} />}
                <Text style={[styles.trendValue, { color: asset.trend.startsWith('+') ? Theme.colors.success : Theme.colors.secondary }]}>{asset.trend}</Text>
              </View>
            </GlassCard>
          </Animated.View>
        ))}

        {/* MARKET CHART */}
        <Text style={styles.sectionTitle}>Biến động giá trị xe 📈</Text>
        <GlassCard style={styles.chartCard}>
            <LineChart
                data={{
                    labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
                    datasets: [{
                        data: [450, 445, 440, 435, 430, 420]
                    }]
                }}
                width={screenWidth - 80}
                height={200}
                chartConfig={{
                    backgroundColor: "#1e293b",
                    backgroundGradientFrom: "#1e293b",
                    backgroundGradientTo: "#0f172a",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: { r: "6", strokeWidth: "2", stroke: "#007aff" }
                }}
                bezier
                style={{ marginVertical: 8, borderRadius: 16 }}
            />
            <Text style={styles.chartHint}>Số liệu ước tính dựa trên thị trường xe cũ (Đơn vị: Triệu VNĐ)</Text>
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scrollContent: { padding: 20 },
  header: { marginTop: Theme.spacing.xl + 20, marginBottom: 25 },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  subtitle: { color: Theme.colors.subtext, fontSize: 14, marginTop: 4 },
  
  totalCard: { padding: 25, borderRadius: 25, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  totalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  totalLabel: { color: Theme.colors.subtext, fontSize: 13, marginLeft: 10 },
  totalValue: { color: '#fff', fontSize: 32, fontWeight: '900' },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  trendText: { color: Theme.colors.success, fontSize: 12, fontWeight: 'bold', marginLeft: 8 },

  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
  assetCard: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  assetName: { color: Theme.colors.subtext, fontSize: 13 },
  assetValue: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  trendValue: { fontSize: 12, fontWeight: 'bold', marginLeft: 4 },

  chartCard: { padding: 15, alignItems: 'center' },
  chartHint: { color: Theme.colors.subtext, fontSize: 10, marginTop: 10, textAlign: 'center' }
});
