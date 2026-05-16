import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, Modal, Platform } from 'react-native';
import { Theme } from '../../theme/Theme';
import { 
  Award, ShieldCheck, CreditCard, Settings, LogOut, 
  ChevronRight, User, QrCode, FileText, MapPin, 
  TrendingUp, Wallet, Star, PenLine
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import GlassCard from '../../components/GlassCard';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';
import { Accelerometer } from 'expo-sensors';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [avatarModal, setAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('https://img.freepik.com/free-vector/cute-cool-boy-with-glasses-hoodie-pixel-art-style_475147-155.jpg');
  
  const avatars = [
    'https://img.freepik.com/free-vector/cute-cool-boy-with-glasses-hoodie-pixel-art-style_475147-155.jpg',
    'https://img.freepik.com/free-vector/cute-girl-with-blue-hair-hoodie-pixel-art-style_475147-154.jpg',
    'https://img.freepik.com/free-vector/cute-robot-pixel-art-style_475147-152.jpg',
    'https://img.freepik.com/free-vector/cute-cat-pixel-art-style_475147-151.jpg',
    'https://img.freepik.com/free-vector/cute-dog-pixel-art-style_475147-153.jpg',
    'https://img.freepik.com/free-vector/cute-panda-pixel-art-style_475147-150.jpg'
  ];

  const [{ x, y }, setData] = useState({ x: 0, y: 0 });
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);

  useEffect(() => {
    let subscription = null;

    async function subscribe() {
      if (Platform.OS === 'web') {
        return;
      }

      const available = await Accelerometer.isAvailableAsync().catch(() => false);
      if (!available) {
        return;
      }

      subscription = Accelerometer.addListener(data => {
        setData(data);
        tiltX.value = withSpring(data.x * 10); // Reduced tilt to avoid gesture interference
        tiltY.value = withSpring(data.y * 10);
      });
      Accelerometer.setUpdateInterval(50);
    }

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${tiltX.value}deg` },
        { rotateX: `${-tiltY.value}deg` },
      ],
    };
  });

  const glareStyle = useAnimatedStyle(() => {
    const translateX = interpolate(tiltX.value, [-10, 10], [-50, 50], Extrapolate.CLAMP);
    const translateY = interpolate(tiltY.value, [-10, 10], [-50, 50], Extrapolate.CLAMP);
    return {
      transform: [{ translateX }, { translateY }],
      opacity: interpolate(Math.abs(tiltX.value) + Math.abs(tiltY.value), [0, 20], [0.1, 0.4]),
    };
  });

  const menuItems = [
    { icon: <User color={Theme.colors.primary} size={22} />, label: 'Thông tin cá nhân', target: 'ProfileEdit' },
    { icon: <Wallet color={Theme.colors.success} size={22} />, label: 'Tài chính & Tài sản', target: 'FinancialHub' },
    { icon: <FileText color="#F59E0B" size={22} />, label: 'Lịch sử giao dịch', target: 'Invoice' },
    { icon: <ShieldCheck color={Theme.colors.warning} size={22} />, label: 'Bảo mật & Quyền riêng tư', target: 'Security' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.Text entering={FadeInUp.duration(600)} style={styles.title}>Cá nhân</Animated.Text>

        {/* PROFILE HEADER */}
        <Animated.View entering={FadeInUp.duration(800).delay(200)} style={styles.profileHeader}>
          <TouchableOpacity 
            style={styles.avatarWrapper} 
            onPress={() => setAvatarModal(true)}
          >
            <Image 
              source={{ uri: selectedAvatar }} 
              style={styles.avatar}
            />
            <View style={styles.editBadge}>
              <PenLine color="#fff" size={12} />
            </View>
            <View style={styles.vipBadge}>
              <Star color="#fff" size={10} fill="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userNameHeader}>Nguyễn Khôi</Text>
          <Text style={styles.userStatus}>VIP Member • Đã đồng hành 2 năm</Text>
        </Animated.View>

        {/* METALLIC MEMBERSHIP CARD (SENSOR-BASED) */}
        <Animated.View entering={FadeInDown.duration(800).delay(400)} style={[styles.cardWrapper, animatedCardStyle]}>
          <ScalePress activeScale={0.95} onPress={() => {}}>
            <LinearGradient 
              colors={['#475569', '#1e293b', '#0f172a']} 
              style={styles.membershipCard}
            >
              <Animated.View style={[styles.glare, glareStyle]}>
                <LinearGradient 
                  colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>

              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.cardBrand}>ANH EM MOTOR</Text>
                    <Text style={styles.cardTier}>PLATINUM ELITE</Text>
                  </View>
                  <View style={styles.chip} />
                </View>
                
                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.cardHolder}>NGUYEN KHOI</Text>
                    <Text style={styles.cardNumber}>**** **** **** 9999</Text>
                  </View>
                  <QrCode color="#fff" size={32} opacity={0.6} />
                </View>
              </View>
            </LinearGradient>
          </ScalePress>
        </Animated.View>

        {/* QUICK STATS */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statItem}>
              <Text style={styles.statLabel}>Điểm thưởng</Text>
              <Text style={styles.statValue}>12,500</Text>
          </GlassCard>
          <GlassCard style={styles.statItem}>
              <Text style={styles.statLabel}>Hạng thẻ</Text>
              <Text style={[styles.statValue, { color: '#94a3b8' }]}>Platinum</Text>
          </GlassCard>
        </View>

        {/* MENU GROUP */}
        <View style={styles.menuGroup}>
          {menuItems.map((item, index) => (
            <ScalePress 
              key={index} 
              style={styles.menuItemWrapper}
              onPress={() => navigation.navigate(item.target)}
            >
              <GlassCard style={styles.menuItem} intensity={10}>
                <View style={styles.menuIcon}>{item.icon}</View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <ChevronRight color={Theme.colors.subtext} size={18} />
              </GlassCard>
            </ScalePress>
          ))}
        </View>

        {/* SYSTEM SETTINGS */}
        <Text style={styles.sectionLabel}>Cài đặt</Text>
        <GlassCard style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Thông báo đẩy</Text>
              <Text style={styles.settingDesc}>Nhận nhắc nhở bảo trì & ưu đãi</Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggle, syncEnabled && styles.toggleOn]} 
              onPress={() => setSyncEnabled(!syncEnabled)}
            >
              <View style={[styles.toggleDot, syncEnabled && styles.toggleDotOn]} />
            </TouchableOpacity>
          </View>
        </GlassCard>

        <ScalePress style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
          <LogOut color={Theme.colors.secondary} size={20} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </ScalePress>
        
        <View style={{ height: 150 }} />
      </ScrollView>

      {/* AVATAR SELECTION MODAL */}
      <Modal visible={avatarModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setAvatarModal(false)} />
          <View style={styles.avatarModalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Chọn ảnh đại diện hoạt họa 🎨</Text>
            <View style={styles.avatarGrid}>
              {avatars.map((url, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  onPress={() => {
                    setSelectedAvatar(url);
                    setAvatarModal(false);
                  }}
                  style={[styles.avatarOption, selectedAvatar === url && styles.selectedAvatarOption]}
                >
                  <Image source={{ uri: url }} style={styles.avatarOptionImg} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  title: { color: Theme.colors.text, fontSize: 28, fontWeight: 'bold', marginTop: Theme.spacing.xl + 20, marginBottom: 20 },
  
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#94a3b8' },
  vipBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#F59E0B', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Theme.colors.background },
  userNameHeader: { color: Theme.colors.text, fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  userStatus: { color: Theme.colors.subtext, fontSize: 13, marginTop: 4 },
  
  cardWrapper: { marginBottom: 30 },
  membershipCard: { height: 200, borderRadius: 20, overflow: 'hidden', padding: 25, elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
  glare: { ...StyleSheet.absoluteFillObject, width: '200%', height: '200%', top: '-50%', left: '-50%' },
  cardContent: { flex: 1, justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardBrand: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  cardTier: { color: '#fff', fontSize: 18, fontWeight: '900', marginTop: 4, letterSpacing: 1 },
  chip: { width: 45, height: 35, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardHolder: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold' },
  cardNumber: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 4, letterSpacing: 2 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statItem: { width: '48%', padding: 15, alignItems: 'center' },
  statLabel: { color: Theme.colors.subtext, fontSize: 11, marginBottom: 4 },
  statValue: { color: Theme.colors.primary, fontSize: 18, fontWeight: 'bold' },
  
  menuGroup: { marginBottom: 30 },
  menuItemWrapper: { marginBottom: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuLabel: { color: Theme.colors.text, fontSize: 15, fontWeight: '600', flex: 1 },

  sectionLabel: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  settingsCard: { padding: 20 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingTitle: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold' },
  settingDesc: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2 },
  
  toggle: { width: 44, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', padding: 2 },
  toggleOn: { backgroundColor: Theme.colors.primary },
  toggleDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleDotOn: { alignSelf: 'flex-end' },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, height: 60, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  logoutText: { color: Theme.colors.secondary, fontWeight: 'bold', fontSize: 15, marginLeft: 10 },

  editBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: Theme.colors.primary, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Theme.colors.background, zIndex: 1 },
  
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)' },
  avatarModalSheet: { backgroundColor: '#0F172A', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 60 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center', marginBottom: 24 },
  modalTitle: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  avatarOption: { width: '30%', aspectRatio: 1, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.03)', padding: 10, marginBottom: 15, borderWidth: 2, borderColor: 'transparent' },
  selectedAvatarOption: { borderColor: Theme.colors.primary, backgroundColor: 'rgba(0,122,255,0.1)' },
  avatarOptionImg: { width: '100%', height: '100%', borderRadius: 15 }
});
