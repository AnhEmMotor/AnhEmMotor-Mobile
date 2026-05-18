import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Theme } from '../../../theme/Theme';
import { 
  Settings, 
  LogOut, 
  ChevronRight, 
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

export default function AdminProfileScreen({ navigation }) {
  const adminMenuItems = [
    { icon: <User color={Theme.colors.primary} size={22} />, label: 'Thông tin tài khoản Admin', sub: 'Quản lý thông cá nhân & Avatar' },
    { icon: <Database color={Theme.colors.success} size={22} />, label: 'Đồng bộ dữ liệu hệ thống', sub: 'Kiểm tra trạng thái API & DB' },
    { icon: <Smartphone color={Theme.colors.info} size={22} />, label: 'Quản lý thiết bị POS', sub: 'Kết nối máy in bill & quẹt thẻ' },
    { icon: <Settings color={Theme.colors.subtext} size={22} />, label: 'Cài đặt bảo mật', sub: 'Đổi mật khẩu & 2FA' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
        <Text style={styles.title}>Quản trị viên</Text>
      </Animated.View>

      {/* Admin Header */}
      <Animated.View entering={FadeInUp.duration(800).delay(200)} style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?u=admin' }} 
            style={styles.avatar}
          />
          <LinearGradient 
            colors={[Theme.colors.secondary, '#991B1B']} 
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
              <ChevronRight color={Theme.colors.subtext} size={18} />
            </GlassCard>
          </ScalePress>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(800).delay(600)}>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}>
          <LogOut color={Theme.colors.secondary} size={20} />
          <Text style={styles.logoutText}>Đăng xuất khỏi hệ thống</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  title: { color: Theme.colors.text, fontSize: 32, fontWeight: 'bold' },
  
  profileHeader: { alignItems: 'center', marginBottom: Theme.spacing.xl },
  avatarWrapper: { position: 'relative', marginBottom: Theme.spacing.md },
  avatar: { width: 110, height: 110, borderRadius: 0, borderWidth: 3, borderColor: Theme.colors.secondary },
  badge: { position: 'absolute', bottom: 5, right: 5, width: 32, height: 32, borderRadius: 0, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: Theme.colors.background },
  userNameHeader: { color: Theme.colors.text, fontSize: 24, fontWeight: 'bold' },
  userRole: { color: Theme.colors.subtext, fontSize: 14, marginTop: 4 },
  
  statusGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Theme.spacing.xl },
  statusCard: { width: '48%', padding: 16, alignItems: 'center' },
  statusLabel: { color: Theme.colors.subtext, fontSize: 11, marginBottom: 4 },
  statusValue: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
 
  menuGroup: { marginTop: Theme.spacing.md },
  menuItemWrapper: { marginBottom: Theme.spacing.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.md },
  menuIcon: { width: 44, height: 44, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: Theme.spacing.md },
  menuLabel: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  menuSub: { color: Theme.colors.subtext, fontSize: 11, marginTop: 2 },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Theme.spacing.xl, padding: Theme.spacing.md, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  logoutText: { color: Theme.colors.secondary, fontWeight: 'bold', fontSize: 16, marginLeft: 10 }
});
