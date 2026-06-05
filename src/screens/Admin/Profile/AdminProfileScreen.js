import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Theme, useActiveColors } from '../../../theme/Theme';
import { useGlobalState } from '../../../context/GlobalState';
import { 
  Settings, 
  LogOut, 
  ChevronRight, 
  ChevronLeft,
  User, 
  ShieldCheck, 
  Database, 
  Bell, 
  FileText,
  Smartphone
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../../components/GlassCard';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ScalePress from '../../../components/ScalePress';

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  title: { color: colors.text, fontSize: 32, fontWeight: 'bold' },
  
  profileHeader: { alignItems: 'center', marginBottom: Theme.spacing.xl },
  avatarWrapper: { position: 'relative', marginBottom: Theme.spacing.md },
  avatar: { width: 110, height: 110, borderRadius: 0, borderWidth: 3, borderColor: colors.secondary },
  badge: { position: 'absolute', bottom: 5, right: 5, width: 32, height: 32, borderRadius: 0, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.background },
  userNameHeader: { color: colors.text, fontSize: 24, fontWeight: 'bold' },
  userRole: { color: colors.subtext, fontSize: 14, marginTop: 4 },
  
  statusGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Theme.spacing.xl },
  statusCard: { width: '48%', padding: 16, alignItems: 'center' },
  statusLabel: { color: colors.subtext, fontSize: 11, marginBottom: 4 },
  statusValue: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
 
  menuGroup: { marginTop: Theme.spacing.md },
  menuItemWrapper: { marginBottom: Theme.spacing.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.md },
  menuIcon: { width: 44, height: 44, borderRadius: 0, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.glassBg, justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  menuLabel: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  menuSub: { color: colors.subtext, fontSize: 11, marginTop: 2 },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Theme.spacing.xl, padding: Theme.spacing.md, borderRadius: 0, borderWidth: 1, borderColor: `${colors.error}4D` },
  logoutText: { color: colors.secondary, fontWeight: 'bold', fontSize: 16, marginLeft: 10 }
});

export default function AdminProfileScreen({ navigation }) {
  const colors = useActiveColors();
  const styles = getStyles(colors);
  const { setSettingsOpen } = useGlobalState();

  const adminMenuItems = [
    { icon: <User color={colors.primary} size={22} />, label: 'Thông tin tài khoản Admin', sub: 'Quản lý thông cá nhân & Avatar' },
    { icon: <Database color={colors.success} size={22} />, label: 'Đồng bộ dữ liệu hệ thống', sub: 'Kiểm tra trạng thái API & DB' },
    { icon: <Smartphone color={colors.info} size={22} />, label: 'Quản lý thiết bị POS', sub: 'Kết nối máy in bill & quẹt thẻ' },
    { icon: <Settings color={colors.subtext} size={22} />, label: 'Cài đặt bảo mật', sub: 'Đổi mật khẩu & 2FA' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, paddingBottom: Theme.spacing.xl }} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInUp.duration(600)} style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.canGoBack() && navigation.goBack()}
            style={{ width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.sm, backgroundColor: colors.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)' }}
          >
            <ChevronLeft color={colors.isDark ? '#fff' : '#000'} size={20} />
          </TouchableOpacity>
          <Text style={styles.title}>Quản trị viên</Text>
        </View>
        <TouchableOpacity
          onPress={() => setSettingsOpen(true)}
          style={{ width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)' }}
        >
          <Settings color={colors.isDark ? '#fff' : '#000'} size={20} />
        </TouchableOpacity>
      </Animated.View>

      {/* Admin Header */}
      <Animated.View entering={FadeInUp.duration(800).delay(200)} style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?u=admin' }} 
            style={styles.avatar}
          />
          <LinearGradient 
            colors={[colors.secondary, '#991B1B']} 
            style={styles.badge}
          >
            <ShieldCheck color="#fff" size={14} />
          </LinearGradient>
        </View>
        <Text style={styles.userNameHeader}>System Administrator</Text>
        <Text style={styles.userRole}>Super Admin • Showroom Q.2</Text>
      </Animated.View>

      {/* Status Cards */}
      <View style={styles.statusGrid}>
        <GlassCard style={styles.statusCard}>
          <Text style={styles.statusLabel}>Thời gian trực</Text>
          <Text style={styles.statusValue}>06:45:12</Text>
        </GlassCard>
        <GlassCard style={styles.statusCard}>
          <Text style={styles.statusLabel}>Phiên làm việc</Text>
          <Text style={styles.statusValue}>Ổn định</Text>
        </GlassCard>
      </View>

      {/* Menu chức năng */}
      <Animated.View entering={FadeInDown.duration(800).delay(400)} style={styles.menuGroup}>
        {adminMenuItems.map((item, index) => (
          <ScalePress key={index} style={styles.menuItemWrapper}>
            <GlassCard style={styles.menuItem} intensity={10}>
              <View style={styles.menuIcon}>{item.icon}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <ChevronRight color={colors.subtext} size={18} />
            </GlassCard>
          </ScalePress>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(800).delay(600)}>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}>
          <LogOut color={colors.secondary} size={20} />
          <Text style={styles.logoutText}>Đăng xuất khỏi hệ thống</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}
