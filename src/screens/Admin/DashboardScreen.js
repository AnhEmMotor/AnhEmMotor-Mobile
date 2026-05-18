import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Dimensions, Image, ActivityIndicator, Platform, Alert } from 'react-native';
import { Theme } from '../../theme/Theme';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Zap, 
  CheckCircle, 
  X, 
  Award,
  DollarSign,
  Truck,
  ChevronRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../components/GlassCard';
import PulseView from '../../components/PulseView';
import Animated, { FadeInDown, FadeInUp, FadeInRight, Layout } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useDashboardController } from './hooks/useDashboardController';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen({ navigation }) {
  const { stats, staff, loading, refreshData } = useDashboardController();
  const [urgentAlerts, setUrgentAlerts] = useState([
    { id: '2', type: 'HOT', title: 'Khách "Siêu nóng"', detail: 'Anh Khôi chốt Panigale V4', time: '5p trước', color: Theme.colors.warning },
    { id: '3', type: 'SOS', title: 'Yêu cầu cứu hộ khẩn', detail: 'Anh Minh Quân - Hầm Thủ Thiêm', time: '10p trước', color: '#EF4444' },
    { id: '4', type: 'LATE', title: 'Đơn hàng quá hạn', detail: 'Đơn xe VF9 chậm giao 48h', time: '20p trước', color: '#EF4444' },
    { id: '5', type: 'VIP', title: 'Lịch hẹn chăm sóc VIP', detail: 'Chủ xe Harley Davidson bảo dưỡng', time: '1h trước', color: '#3B82F6' },
  ]);

  const resolveAlert = (id) => {
    setUrgentAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleViewDetail = (alert) => {
    if (alert.type === 'HOT') {
      navigation.navigate('AdminLeads');
    } else if (alert.type === 'SOS') {
      Alert.alert(
        "🚨 YÊU CẦU CỨU HỘ KHẨN (SOS)!",
        "Khách hàng: Anh Minh Quân\nVị trí: Hầm Thủ Thiêm - Q.2\nTrạng thái: Xe thủng lốp cần vá khẩn cấp\n\nBạn có muốn chỉ định đội cứu hộ gần nhất?",
        [
          { text: "Bỏ qua", style: "cancel" },
          { text: "Chỉ định ngay", onPress: () => {
            Alert.alert("Thành công", "Đã gửi thông báo chỉ định cho kỹ thuật viên cứu hộ.");
            resolveAlert(alert.id);
          }}
        ]
      );
    } else if (alert.type === 'LATE') {
      navigation.navigate('AdminOrders');
    } else if (alert.type === 'VIP') {
      navigation.navigate('AdminAppointments');
    }
  };

  if (loading || !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Đang đồng bộ dữ liệu chỉ số...</Text>
      </View>
    );
  }

  // Calculate target progress percentage
  const targetProgress = stats.getTargetProgress();

  // Doughnut Chart parameters (Size & Circumference)
  const size = 150;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Doughnut segments (Cyan 58%, Orange 22%, Purple 12%, Green 8%)
  const segment1Offset = circumference;
  const segment1Stroke = circumference * 0.58;
  const segment2Offset = circumference - segment1Stroke;
  const segment2Stroke = circumference * 0.22;
  const segment3Offset = circumference - segment1Stroke - segment2Stroke;
  const segment3Stroke = circumference * 0.12;
  const segment4Offset = circumference - segment1Stroke - segment2Stroke - segment3Stroke;
  const segment4Stroke = circumference * 0.08;

  return (
    <View style={{ flex: 1, backgroundColor: '#090E17' }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* HEADER SECTION */}
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>Command Center ⚡</Text>
            <Text style={styles.dateText}>Nhịp thở Showroom • Biên Hòa</Text>
          </View>
          <Pressable style={styles.profileIcon} onPress={() => navigation.navigate('AdminProfile')}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=admin' }} style={styles.avatar} resizeMode="cover" />
          </Pressable>
        </Animated.View>

        {/* QUICK NAVIGATION TO LOGISTICS & ORDER PROCEDURES */}
        <Animated.View entering={FadeInDown.delay(50).duration(800)} style={styles.quickNavRow}>
          <Pressable 
            style={styles.quickNavBtn} 
            onPress={() => navigation.navigate('AdminOrders')}
          >
            <LinearGradient 
              colors={['rgba(6, 182, 212, 0.15)', 'rgba(59, 130, 246, 0.15)']} 
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              style={styles.quickNavGradient}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Truck color="#22D3EE" size={16} />
                <Text style={styles.quickNavText}>Theo dõi Đơn Hàng & Vận Chuyển 🗺️</Text>
              </View>
              <ChevronRight color="#22D3EE" size={16} />
            </LinearGradient>
          </Pressable>
        </Animated.View>


        {/* II.1.1 CÁC CHỈ SỐ SINH MỆNH (4 CARDS 2x2 - ĐỦ 100% YÊU CẦU FILE PDF) */}
        <View style={styles.quickStatsContainer}>
          <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.statsRow}>
            
            {/* KPI 1: Doanh thu & Số xe đã bán (Sales & Revenue) */}
            <GlassCard style={styles.statCard}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.25)', borderColor: 'rgba(16, 185, 129, 0.45)' }]}>
                <TrendingUp color="#10B981" size={18} />
              </View>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75} style={styles.statValue}>{stats.salesRevenue} / {stats.salesCount} Xe</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75} style={styles.statLabel}>Doanh Thu & Số Xe</Text>
              <View style={styles.growthBadge}>
                <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75} style={styles.growthText}>+{stats.salesGrowth}% tháng trước</Text>
              </View>
            </GlassCard>

            {/* KPI 2: Trạng thái Lead (Khách tiềm năng mới trong ngày) */}
            <GlassCard style={styles.statCard}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.25)', borderColor: 'rgba(59, 130, 246, 0.45)' }]}>
                <Users color="#3B82F6" size={18} />
              </View>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75} style={styles.statValue}>{stats.newLeadsCount} Khách</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75} style={styles.statLabel}>Trạng Thái Lead</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75} style={styles.subLabel}>Đăng ký mới hôm nay</Text>
            </GlassCard>

            {/* KPI 3: Tỷ lệ lấp đầy lịch Lái thử (Test Drive Rate) */}
            <GlassCard style={styles.statCard}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(249, 115, 22, 0.25)', borderColor: 'rgba(249, 115, 22, 0.45)' }]}>
                <Clock color="#F97316" size={18} />
              </View>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75} style={styles.statValue}>{stats.testDriveRate}%</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75} style={styles.statLabel}>Tỷ Lệ Lái Thử</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75} style={styles.subLabel}>{stats.testDriveCount} lượt hôm nay</Text>
            </GlassCard>

            {/* KPI 4: Dòng tiền đang treo (Pending Pipeline) */}
            <GlassCard style={styles.statCard}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(168, 85, 247, 0.25)', borderColor: 'rgba(168, 85, 247, 0.45)' }]}>
                <DollarSign color="#A855F7" size={18} />
              </View>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75} style={styles.statValue}>{stats.pendingPipeline}</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75} style={styles.statLabel}>Dòng Tiền Treo</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumScaleFactor={0.75} style={styles.subLabel}>Chờ duyệt / Thanh toán đợt cuối</Text>
            </GlassCard>

          </Animated.View>
        </View>

        {/* TARGET VS ACTUAL KPI CARD */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
          <GlassCard style={styles.targetCard} intensity={25}>
            <View style={styles.targetHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Award color="#F59E0B" size={20} />
                <Text style={styles.targetTitle}>Tiến độ đạt mục tiêu tháng</Text>
              </View>
              <Text style={styles.targetValue}>{stats.salesCount} / {stats.targetCount} xe</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <LinearGradient 
                colors={['#10B981', '#3B82F6']} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }}
                style={[styles.progressBar, { width: `${targetProgress}%` }]}
              />
            </View>
            <View style={styles.targetFooter}>
              <Text style={styles.targetStatusText}>Đạt {targetProgress}% mục tiêu doanh số</Text>
              <Text style={styles.targetRemaining}>Còn thiếu {stats.targetCount - stats.salesCount} xe</Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* II.1.2.c BIỂU ĐỒ TRÒN KHUYẾT (DOUGHNUT CHART - NEON COLORS + TÂM NEO THỊ GIÁC) */}
        <Animated.View entering={FadeInDown.delay(300).duration(800)} style={styles.chartContainer}>
          <GlassCard style={styles.glassChartCard}>
            <Text style={styles.chartTitle}>Cơ cấu sản phẩm & Doanh thu</Text>
            
            <View style={styles.doughnutRow}>
              {/* Doughnut SVG Ring */}
              <View style={styles.doughnutWrapper}>
                <Svg width={size} height={size}>
                  {/* Outer circle background */}
                  <Circle cx={size/2} cy={size/2} r={radius} fill="transparent" stroke="#1E293B" strokeWidth={strokeWidth} />
                  
                  {/* Segment 1: Xe Điện (Cyan) */}
                  <Circle 
                    cx={size/2} cy={size/2} r={radius} 
                    fill="transparent" stroke="#06B6D4" strokeWidth={strokeWidth}
                    strokeDasharray={[segment1Stroke, circumference]} strokeDashoffset={segment1Offset - segment1Stroke}
                    strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
                  />
                  
                  {/* Segment 2: Xe Xăng (Orange) */}
                  <Circle 
                    cx={size/2} cy={size/2} r={radius} 
                    fill="transparent" stroke="#F97316" strokeWidth={strokeWidth}
                    strokeDasharray={[segment2Stroke, circumference]} strokeDashoffset={segment2Offset - segment2Stroke}
                    strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
                  />
                  
                  {/* Segment 3: Xe Hạng Sang (Purple) */}
                  <Circle 
                    cx={size/2} cy={size/2} r={radius} 
                    fill="transparent" stroke="#A855F7" strokeWidth={strokeWidth}
                    strokeDasharray={[segment3Stroke, circumference]} strokeDashoffset={segment3Offset - segment3Stroke}
                    strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
                  />

                  {/* Segment 4: Phụ Tùng & Khác (Green) */}
                  <Circle 
                    cx={size/2} cy={size/2} r={radius} 
                    fill="transparent" stroke="#10B981" strokeWidth={strokeWidth}
                    strokeDasharray={[segment4Stroke, circumference]} strokeDashoffset={segment4Offset - segment4Stroke}
                    strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
                  />
                </Svg>

                {/* Tâm biểu đồ khuyết (Neo thị giác) */}
                <View style={styles.doughnutCenter}>
                  <Text style={styles.centerValue}>{stats.salesRevenue}</Text>
                  <Text style={styles.centerLabel}>TỔNG DOANH THU</Text>
                </View>
              </View>

              {/* Legends list */}
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#06B6D4' }]} />
                  <Text style={styles.legendText}>Xe Điện: 58%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#F97316' }]} />
                  <Text style={styles.legendText}>Xe Xăng: 22%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#A855F7' }]} />
                  <Text style={styles.legendText}>Xe Sang: 12%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.legendText}>Phụ Tùng: 8%</Text>
                </View>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* II.1.2.a BIỂU ĐỒ NGANG: PHỄU CHUYỂN ĐỔI KHÁCH HÀNG (CUSTOMER FUNNEL) */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.section}>
          <GlassCard style={styles.funnelCard}>
            <Text style={styles.sectionTitle}>Phễu Chuyển Đổi Khách Hàng</Text>
            <Text style={styles.sectionSubtitle}>Mô phỏng hiệu quả quy trình bán hàng showroom</Text>

            <View style={styles.funnelWrapper}>
              
              {/* Funnel row 1: Khách tiếp cận */}
              <View style={styles.funnelRow}>
                <Text style={styles.funnelLabel}>Tiếp Cận</Text>
                <View style={styles.funnelBarContainer}>
                  <LinearGradient 
                    colors={['#083344', '#0891B2']} 
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                    style={[styles.funnelBar, { width: '100%' }]}
                  >
                    <Text style={styles.funnelBarText}>1.200 lượt</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.funnelPercentage}>100%</Text>
              </View>

              {/* Funnel row 2: Đến showroom */}
              <View style={styles.funnelRow}>
                <Text style={styles.funnelLabel}>Đến SR</Text>
                <View style={styles.funnelBarContainer}>
                  <LinearGradient 
                    colors={['#0F172A', '#0284C7']} 
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                    style={[styles.funnelBar, { width: '75%' }]}
                  >
                    <Text style={styles.funnelBarText}>650 lượt</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.funnelPercentage}>54%</Text>
              </View>

              {/* Funnel row 3: Lái thử */}
              <View style={styles.funnelRow}>
                <Text style={styles.funnelLabel}>Lái Thử Xe</Text>
                <View style={styles.funnelBarContainer}>
                  <LinearGradient 
                    colors={['#1E1B4B', '#2563EB']} 
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                    style={[styles.funnelBar, { width: '55%' }]}
                  >
                    <Text style={styles.funnelBarText}>480 lượt</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.funnelPercentage}>73%</Text>
              </View>

              {/* Funnel row 4: Chốt hợp đồng */}
              <View style={styles.funnelRow}>
                <Text style={styles.funnelLabel}>Chốt HĐ</Text>
                <View style={styles.funnelBarContainer}>
                  <LinearGradient 
                    colors={['#311042', '#A855F7']} 
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                    style={[styles.funnelBar, { width: '30%' }]}
                  >
                    <Text style={styles.funnelBarText}>18 xe</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.funnelPercentage}>3.7%</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* II.1.2.b BIỂU ĐỒ CỘT: TOP 5 MẪU XE BÁN CHẠY NHẤT (BO TRÒN + NEON GLOW TOP 1 + SPACE GROTESK STYLE FONT) */}
        <Animated.View entering={FadeInDown.delay(500).duration(800)} style={styles.section}>
          <GlassCard style={styles.columnCard}>
            <Text style={styles.sectionTitle}>Top 5 Mẫu Xe Bán Chạy Nhất</Text>
            
            <View style={styles.columnWrapper}>
              {/* Col 5: CX5 */}
              <View style={styles.verticalColContainer}>
                <Text style={styles.colValue}>4</Text>
                <View style={[styles.verticalCol, { height: 40, opacity: 0.5 }]} />
                <Text style={styles.colLabel}>CX5</Text>
              </View>

              {/* Col 3: Winner X */}
              <View style={styles.verticalColContainer}>
                <Text style={styles.colValue}>6</Text>
                <View style={[styles.verticalCol, { height: 60, opacity: 0.7 }]} />
                <Text style={styles.colLabel}>Winner</Text>
              </View>

              {/* Col 1: VF8 (NEON GLOW + CƠ CẤU PHÁT SÁNG TOP 1) */}
              <View style={styles.verticalColContainer}>
                <Text style={[styles.colValue, styles.top1Value]}>10</Text>
                <LinearGradient 
                  colors={['#22D3EE', '#06B6D4']} 
                  style={[styles.verticalCol, styles.top1Col]}
                />
                {/* Neon Glow foot */}
                <View style={styles.top1Glow} />
                <Text style={[styles.colLabel, styles.top1Label]}>VF8 👑</Text>
              </View>

              {/* Col 2: VF3 */}
              <View style={styles.verticalColContainer}>
                <Text style={styles.colValue}>8</Text>
                <View style={[styles.verticalCol, { height: 80, opacity: 0.85 }]} />
                <Text style={styles.colLabel}>VF3</Text>
              </View>

              {/* Col 4: SH 160i */}
              <View style={styles.verticalColContainer}>
                <Text style={styles.colValue}>5</Text>
                <View style={[styles.verticalCol, { height: 50, opacity: 0.6 }]} />
                <Text style={styles.colLabel}>SH160</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* URGENT ALERTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nội dung cần xử lý</Text>
            {urgentAlerts.length > 0 && <View style={styles.alertCount}><Text style={styles.alertCountText}>{urgentAlerts.length}</Text></View>}
          </View>
          
          {urgentAlerts.length === 0 ? (
            <GlassCard style={styles.emptyAlert}>
              <CheckCircle color={Theme.colors.success} size={24} />
              <Text style={styles.emptyText}>Mọi thứ đều trong tầm kiểm soát</Text>
            </GlassCard>
          ) : (
            urgentAlerts.map((alert, index) => (
              <Animated.View key={alert.id} entering={FadeInRight.delay(200 + index * 100)} layout={Layout.springify()}>
                <PulseView pulseScale={1.02}>
                  <GlassCard style={styles.alertCard} intensity={20}>
                    <View style={[styles.alertIndicator, { backgroundColor: alert.color }]} />
                    <View style={[styles.alertIcon, { 
                      backgroundColor: alert.color === '#F59E0B' || alert.color === '#F97316' || alert.color === Theme.colors.warning ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                      borderColor: alert.color,
                      borderWidth: 1,
                    }]}>
                      <Zap color={alert.color} size={22} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12, marginRight: 8, flexShrink: 1 }}>
                      <View style={styles.alertHeader}>
                        <Text style={[styles.alertTypeText, { color: alert.color }]}>{alert.type}</Text>
                        <Text style={styles.alertTime}>{alert.time}</Text>
                      </View>
                      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.alertCardTitle}>{alert.title}</Text>
                      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.alertDetail}>{alert.detail}</Text>
                    </View>
                    
                    <Pressable style={styles.detailBtn} onPress={() => handleViewDetail(alert)}>
                      <Text style={styles.detailBtnText}>Xem chi tiết</Text>
                      <ChevronRight color="#3B82F6" size={14} style={{ marginLeft: 2 }} />
                    </Pressable>
                  </GlassCard>
                </PulseView>
              </Animated.View>
            ))
          )}
        </View>

        {/* STAFF STATUS (TRẠNG THÁI NHÂN VIÊN TRỰC) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trạng thái Nhân viên</Text>
            <Text style={styles.activeCount}>{staff.filter(s => s.active).length} đang trực</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.staffScroll}>
            {staff.map((employee, index) => (
              <Animated.View key={employee.id} entering={FadeInDown.delay(400 + index * 100)}>
                <GlassCard style={styles.staffCard}>
                  <View>
                    <Image source={{ uri: employee.avatar }} style={styles.staffAvatar} resizeMode="cover" />
                    {employee.active && <View style={styles.onlineDot} />}
                  </View>
                  <Text style={styles.staffName}>{employee.name}</Text>
                  <Text style={styles.staffState}>{employee.status}</Text>
                </GlassCard>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090E17', paddingHorizontal: Theme.spacing.lg },
  loadingContainer: { flex: 1, backgroundColor: '#090E17', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Theme.colors.subtext, fontSize: 14, marginTop: 16 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: Theme.spacing.xl + 20, 
    marginBottom: Theme.spacing.lg 
  },
  greeting: { color: Theme.colors.text, fontSize: 24, fontWeight: 'bold' },
  dateText: { color: Theme.colors.subtext, fontSize: 13, marginTop: 4 },
  profileIcon: { width: 45, height: 45, borderRadius: 0, overflow: 'hidden', borderWidth: 2, borderColor: Theme.colors.primary },
  avatar: { width: '100%', height: '100%' },

  quickStatsContainer: { marginVertical: Theme.spacing.md },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', padding: 12, alignItems: 'center', marginBottom: 12 },
  iconCircle: { width: 36, height: 36, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
  statLabel: { color: Theme.colors.subtext, fontSize: 11, textAlign: 'center', marginTop: 4, fontWeight: '500' },
  subLabel: { color: Theme.colors.subtext, fontSize: 10, opacity: 0.7, marginTop: 2, textAlign: 'center' },
  growthBadge: { backgroundColor: 'rgba(5, 150, 105, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 0, marginTop: 6 },
  growthText: { color: Theme.colors.success, fontSize: 9, fontWeight: 'bold' },

  targetCard: { padding: 16, marginBottom: 16 },
  targetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  targetTitle: { color: Theme.colors.text, fontSize: 14, fontWeight: '600', marginLeft: 8 },
  targetValue: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold' },
  progressContainer: { height: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 0, marginVertical: 12, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 0 },
  targetFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  targetStatusText: { color: Theme.colors.success, fontSize: 11, fontWeight: '500' },
  targetRemaining: { color: Theme.colors.subtext, fontSize: 11 },

  chartContainer: { marginBottom: 16 },
  glassChartCard: { padding: 16 },
  chartTitle: { color: Theme.colors.text, fontSize: 14, fontWeight: '600', marginBottom: 16 },
  doughnutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  doughnutWrapper: { width: 150, height: 150, justifyContent: 'center', alignItems: 'center' },
  doughnutCenter: { position: 'absolute', top: 30, left: 30, width: 90, height: 90, borderRadius: 45, backgroundColor: '#0B0F19', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  centerValue: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  centerLabel: { color: Theme.colors.subtext, fontSize: 8, marginTop: 2, letterSpacing: 0.5 },
  legendContainer: { marginLeft: 32 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 0, marginRight: 8 },
  legendText: { color: Theme.colors.text, fontSize: 11, fontWeight: '500' },

  section: { marginTop: Theme.spacing.lg },
  sectionTitle: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  sectionSubtitle: { color: Theme.colors.subtext, fontSize: 11, marginTop: 2, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  activeCount: { color: Theme.colors.success, fontSize: 12, fontWeight: '600' },

  funnelCard: { padding: 16 },
  funnelWrapper: { marginTop: 8 },
  funnelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  funnelLabel: { width: 75, color: Theme.colors.subtext, fontSize: 11, fontWeight: 'bold' },
  funnelBarContainer: { flex: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 0, overflow: 'hidden', marginRight: 12 },
  funnelBar: { height: '100%', justifyContent: 'center', paddingLeft: 12, borderRadius: 0 },
  funnelBarText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  funnelPercentage: { width: 35, color: '#06B6D4', fontSize: 11, fontWeight: 'bold', textAlign: 'right' },

  columnCard: { padding: 16 },
  columnWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160, paddingHorizontal: 8, marginTop: 16 },
  verticalColContainer: { width: '16%', alignItems: 'center' },
  colValue: { color: Theme.colors.subtext, fontSize: 11, marginBottom: 4, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold' },
  verticalCol: { width: 14, backgroundColor: 'rgba(6, 182, 212, 0.3)', borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  colLabel: { color: Theme.colors.subtext, fontSize: 9, marginTop: 8, textAlign: 'center' },
  
  top1Value: { color: '#22D3EE', fontWeight: 'bold', fontSize: 13 },
  top1Col: { height: 100, shadowColor: '#06B6D4', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 },
  top1Glow: { width: 18, height: 3, backgroundColor: '#06B6D4', borderRadius: 0, shadowColor: '#06B6D4', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 6 },
  top1Label: { color: '#22D3EE', fontWeight: 'bold' },

  alertCount: { backgroundColor: Theme.colors.error, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 0 },
  alertCountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  emptyAlert: { flexDirection: 'row', alignItems: 'center', padding: 20, justifyContent: 'center' },
  emptyText: { color: Theme.colors.subtext, fontSize: 14, marginLeft: 12 },

  alertCard: { flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 12, overflow: 'hidden' },
  alertIndicator: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  alertIcon: { width: 48, height: 48, borderRadius: 0, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alertTypeText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  alertTime: { color: Theme.colors.subtext, fontSize: 11 },
  alertCardTitle: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  alertDetail: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2 },
  
  detailBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderWidth: 1, 
    borderColor: 'rgba(59, 130, 246, 0.3)', 
    backgroundColor: 'rgba(59, 130, 246, 0.08)', 
    borderRadius: 0,
    marginLeft: 8,
    flexShrink: 0,
  },
  detailBtnText: { 
    color: '#3B82F6', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },

  staffScroll: { paddingBottom: 8 },
  staffCard: { width: 130, padding: 16, alignItems: 'center', marginRight: 12 },
  staffAvatar: { width: 60, height: 60, borderRadius: 0, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 8 },
  onlineDot: { width: 14, height: 14, borderRadius: 0, backgroundColor: Theme.colors.success, position: 'absolute', right: 0, bottom: 10, borderWidth: 3, borderColor: Theme.colors.card },
  staffName: { color: Theme.colors.text, fontSize: 14, fontWeight: 'bold' },
  staffState: { color: Theme.colors.subtext, fontSize: 10, marginTop: 4, textAlign: 'center' },

  quickNavRow: { marginVertical: 8 },
  quickNavBtn: { borderRadius: 0, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.4)' },
  quickNavGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  quickNavText: { color: '#22D3EE', fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
});