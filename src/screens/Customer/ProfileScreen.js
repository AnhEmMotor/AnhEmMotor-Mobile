import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Theme } from '../../theme/Theme';
import { Award, ShieldCheck, CreditCard, Settings, LogOut, ChevronRight, User, QrCode, FileText, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../components/GlassCard';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';

export default function ProfileScreen({ navigation }) {
  const [syncEnabled, setSyncEnabled] = React.useState(true);
  const floatValue = useSharedValue(0);

  useEffect(() => {
    floatValue.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: floatValue.value }],
    };
  });

  const menuItems = [
    { icon: <User color={Theme.colors.primary} size={22} />, label: 'Thông tin cá nhân', target: 'ProfileEdit' },
    { icon: <FileText color={Theme.colors.success} size={22} />, label: 'Hóa đơn & Chi tiêu', target: 'Invoice' },
    { icon: <MapPin color={Theme.colors.secondary} size={22} />, label: 'Địa chỉ cứu hộ (SOS)', target: 'RescueAddress' },
    { icon: <ShieldCheck color={Theme.colors.warning} size={22} />, label: 'Bảo hành & Bảo hiểm', target: 'Insurance' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.Text entering={FadeInUp.duration(600)} style={styles.title}>Tài khoản</Animated.Text>

      {/* I.5 PROFILE HEADER */}
      <Animated.View entering={FadeInUp.duration(800).delay(200)} style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080' }} 
            style={styles.avatar}
          />
          <View style={styles.editBadge}>
            <Settings color="#fff" size={12} />
          </View>
        </View>
        <Text style={styles.userNameHeader}>Nguyễn Khôi</Text>
        <Text style={styles.userEmail}>Hạng thành viên: Gold Member ✨</Text>
      </Animated.View>

      {/* I.5 MEMBERSHIP CARD */}
      <Animated.View entering={FadeInDown.duration(800).delay(400)} style={animatedCardStyle}>
        <ScalePress activeScale={0.98}>
          <LinearGradient 
            colors={['#F59E0B', '#D97706', '#B45309']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.membershipCard}
          >
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.memberLevel}>ANH EM GOLD</Text>
                <Text style={styles.memberId}>Member ID: AE-9999</Text>
              </View>
              <QrCode color="#fff" size={40} strokeWidth={1.5} />
            </View>
            
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.pointLabel}>Điểm tích lũy</Text>
                <Text style={styles.pointValue}>2.500 <Text style={styles.pts}>pts</Text></Text>
              </View>
              <View style={styles.cardLabel}>
                <Award color="#fff" size={14} />
                <Text style={styles.premiumText}>Ưu đãi 5%</Text>
              </View>
            </View>
          </LinearGradient>
        </ScalePress>
      </Animated.View>

      {/* I.5 MENU GROUP */}
      <Animated.View entering={FadeInDown.duration(800).delay(600)} style={styles.menuGroup}>
        {menuItems.map((item, index) => (
          <ScalePress 
            key={index} 
            style={styles.menuItemWrapper}
            onPress={() => {
              if (item.target === 'Invoice') navigation.navigate('Invoice');
            }}
          >
            <GlassCard style={styles.menuItem} intensity={10}>
              <View style={styles.menuIcon}>{item.icon}</View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight color={Theme.colors.subtext} size={18} />
            </GlassCard>
          </ScalePress>
        ))}
      </Animated.View>

      {/* I.5 SETTINGS & SYNC */}
      <Animated.Text entering={FadeInDown.duration(800).delay(800)} style={styles.sectionLabel}>Hệ thống & Đồng bộ</Animated.Text>
      <Animated.View entering={FadeInDown.duration(800).delay(900)}>
        <GlassCard style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Tự động đồng bộ</Text>
              <Text style={styles.settingDesc}>Cập nhật ODO & Lịch bảo dưỡng từ hệ thống</Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggle, syncEnabled && styles.toggleOn]} 
              onPress={() => setSyncEnabled(!syncEnabled)}
            >
              <View style={[styles.toggleDot, syncEnabled && styles.toggleDotOn]} />
            </TouchableOpacity>
          </View>
        </GlassCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(800).delay(1000)}>
        <ScalePress style={styles.logoutBtn}>
          <LogOut color={Theme.colors.secondary} size={20} />
          <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
        </ScalePress>
      </Animated.View>
      
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: 20 },
  title: { color: Theme.colors.text, fontSize: 28, fontWeight: 'bold', marginTop: Theme.spacing.xl + 20, marginBottom: 20 },
  
  profileHeader: { alignItems: 'center', marginBottom: 25 },
  avatarWrapper: { position: 'relative', marginBottom: 15 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: Theme.colors.primary },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Theme.colors.primary, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Theme.colors.background },
  userNameHeader: { color: Theme.colors.text, fontSize: 22, fontWeight: 'bold' },
  userEmail: { color: Theme.colors.primary, fontSize: 13, fontWeight: 'bold', marginTop: 4 },
  
  membershipCard: { height: 180, borderRadius: 25, padding: 20, justifyContent: 'space-between', elevation: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  memberLevel: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  memberId: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 4, fontWeight: 'bold' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  pointLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  pointValue: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  pts: { fontSize: 14, fontWeight: 'normal' },
  cardLabel: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  premiumText: { color: '#fff', fontSize: 10, fontWeight: 'bold', marginLeft: 6 },
  
  menuGroup: { marginTop: 30 },
  menuItemWrapper: { marginBottom: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuLabel: { color: Theme.colors.text, fontSize: 15, fontWeight: '600', flex: 1 },

  sectionLabel: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 15 },
  settingsCard: { padding: 15 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingTitle: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold' },
  settingDesc: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2 },
  
  toggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', padding: 2 },
  toggleOn: { backgroundColor: Theme.colors.primary },
  toggleDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleDotOn: { alignSelf: 'flex-end' },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 40, height: 60, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  logoutText: { color: Theme.colors.secondary, fontWeight: 'bold', fontSize: 15, marginLeft: 10 }
});