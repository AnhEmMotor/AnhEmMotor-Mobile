import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Platform,
  StatusBar
} from 'react-native';
import { useTheme } from '../../theme/Theme'; // Import useTheme
import { 
  ChevronLeft, 
  ShieldCheck, 
  Zap, 
  RotateCcw
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import GlassCard from '../../components/GlassCard';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';
import FinanceCalculator from '../../components/FinanceCalculator';
import Toast from '../../components/Toast';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function VehicleDetailScreen({ navigation, route }) {
  const { motor, isOwned } = route.params || {};
  const theme = useTheme(); // Use the useTheme hook
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedColor, setSelectedColor] = useState(motor?.colors?.[0]?.id || 'default');
  const [rotationIndex, setRotationIndex] = useState(0);
  const toastRef = useRef(null);
  
  const lastX = useRef(0);
  const motorFrames = motor?.frames || [motor?.img];

  // Raw Responder System - Higher reliability than PanGestureHandler for scrolling
  const handleTouchStart = (e) => {
    lastX.current = e.nativeEvent.pageX;
  };

  const handleTouchMove = (e) => {
    const currentX = e.nativeEvent.pageX;
    const diff = lastX.current - currentX;
    const sensitivity = 20;

    if (Math.abs(diff) > sensitivity) {
      const direction = diff > 0 ? 1 : -1;
      setRotationIndex(prev => {
        let next = (prev + direction) % motorFrames.length;
        if (next < 0) next = motorFrames.length - 1;
        return next;
      });
      lastX.current = currentX;
    }
  };

  const currentImage = motor?.frames 
    ? motorFrames[rotationIndex] 
    : (motor?.colors?.find(c => c.id === selectedColor)?.img || motor?.img);

  return (
    <View style={getStyles(theme).container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        overScrollMode="always"
      >
        {/* IMAGE HEADER / 360 AREA */}
        <View style={getStyles(theme).header}>
          <View
            style={styles.imageWrapper}
            onMoveShouldSetResponder={(evt) => {
              const { dx, dy } = evt.nativeEvent;
              return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
            }}
            onResponderGrant={handleTouchStart}
            onResponderMove={handleTouchMove}
          >
            <Animated.Image 
              entering={FadeIn.duration(800)} // This is fine
              source={currentImage} 
              style={getStyles(theme).mainImage} 
              resizeMode="contain"
            />
            
            {motor?.frames && (
              <View style={getStyles(theme).rotationBadge}>
                <RotateCcw color="#fff" size={14} />
                <Text style={getStyles(theme).rotationText}>Vuốt ngang để xoay 360°</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={getStyles(theme).backBtn}
            onPress={() => navigation.goBack()}
          >
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <ChevronLeft color="#fff" size={24} />
          </TouchableOpacity>
        </View>

        {/* CONTENT AREA */}
        <View style={[getStyles(theme).content, { backgroundColor: theme.colors.background }]}>
          <View style={getStyles(theme).titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[getStyles(theme).name, { color: theme.colors.text }]}>{motor?.name || 'Motorcycle'}</Text>
              <Text style={[getStyles(theme).category, { color: theme.colors.subtext }]}>{motor?.brand} • High Performance</Text>
            </View>
            <Text style={[getStyles(theme).price, { color: theme.colors.primary }]}>{motor?.price}</Text>
          </View>

          {/* COLOR SELECTOR */}
          {!isOwned && motor?.colors && (
            <View style={getStyles(theme).section}>
              <Text style={[getStyles(theme).sectionTitle, { color: theme.colors.text }]}>Màu sắc</Text>
              <View style={getStyles(theme).colorGrid}>
                {motor.colors.map(c => (
                  <TouchableOpacity 
                    key={c.id} 
                    style={[styles.colorItem, selectedColor === c.id && styles.activeColor]}
                    onPress={() => setSelectedColor(c.id)}
                  >
                    <View style={[styles.colorDot, { backgroundColor: c.hex }]} />
                    <Text style={[getStyles(theme).colorLabel, { color: theme.colors.subtext }, selectedColor === c.id && getStyles(theme).activeLabel]}>{c.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* TAB SYSTEM */}
          <View style={[getStyles(theme).tabBar, { backgroundColor: theme.colors.border + '33' }]}>
            {['overview', 'specs', 'finance'].map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab === 'overview' ? 'Tổng quan' : tab === 'specs' ? 'Thông số' : 'Trả góp'} {/* Use getStyles for tabText */}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'overview' && (
            <Animated.View entering={FadeInDown} style={getStyles(theme).tabContent}>
              <Text style={[getStyles(theme).description, { color: theme.colors.subtext }]}>{motor?.description}</Text>
              <GlassCard style={[getStyles(theme).featureCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} intensity={15}>
                <View style={getStyles(theme).featureItem}>
                  <Zap color={theme.colors.primary} size={22} />
                  <View style={getStyles(theme).fInfo}>
                    <Text style={[getStyles(theme).fTitle, { color: theme.colors.text }]}>Công nghệ Sugomi</Text>
                    <Text style={[getStyles(theme).fDesc, { color: theme.colors.subtext }]}>Thiết kế tối ưu khí động học và sức mạnh.</Text>
                  </View>
                </View>
                <View style={getStyles(theme).featureItem}>
                  <ShieldCheck color="#10B981" size={22} />
                  <View style={getStyles(theme).fInfo}>
                    <Text style={[getStyles(theme).fTitle, { color: theme.colors.text }]}>Bảo hành 3 năm</Text>
                    <Text style={[getStyles(theme).fDesc, { color: theme.colors.subtext }]}>Chính sách bảo hành toàn diện từ AnhEmMotor.</Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          )}

          {activeTab === 'specs' && (
            <Animated.View entering={FadeInDown} style={getStyles(theme).specGrid}>
              {motor?.specs?.map((s, i) => (
                <View key={i} style={[getStyles(theme).specItem, { backgroundColor: theme.colors.card + '33' }]}>
                  <Text style={[getStyles(theme).specVal, { color: theme.colors.text }]}>{s.value}</Text>
                  <Text style={[getStyles(theme).specLabel, { color: theme.colors.subtext }]}>{s.label}</Text>
                </View>
              ))}
            </Animated.View>
          )}

          {activeTab === 'finance' && (
            <Animated.View entering={FadeInDown}>
              <FinanceCalculator 
                vehiclePrice={450000000} 
                onAction={() => toastRef.current?.show('Yêu cầu đã được gửi!')}
              />
            </Animated.View>
          )}

          {/* BOTTOM ACTIONS - INSIDE SCROLLVIEW */}
          <View style={getStyles(theme).actionArea}>
            <ScalePress style={getStyles(theme).mainBtn} onPress={() => navigation.navigate('Booking')}>
              <LinearGradient colors={[theme.colors.primary, theme.colors.primary + 'AA']} style={getStyles(theme).gradient}>
                <Text style={getStyles(theme).btnText}>{isOwned ? 'Đặt lịch bảo dưỡng' : 'Đăng ký lái thử ngay'}</Text>
              </LinearGradient>
            </ScalePress>
            <Text style={styles.footerHint}>* Giá trên đã bao gồm VAT, chưa bao gồm phí trước bạ.</Text>
          </View>
        </View>
      </ScrollView>

      <Toast ref={toastRef} />
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  
  header: { height: 400, backgroundColor: theme.colors.card, position: 'relative' },
  imageWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '90%', height: '80%' },
  rotationBadge: { position: 'absolute', bottom: 30, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  rotationText: { color: '#fff', fontSize: 11, marginLeft: 6, fontWeight: 'bold' },
  
  backBtn: { position: 'absolute', top: 50, left: 20, width: 44, height: 44, borderRadius: 22, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  
  content: { padding: theme.spacing.md, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', flex: 1, marginRight: 15 },
  category: { fontSize: 13, marginTop: 4 },
  price: { fontSize: 20, fontWeight: 'bold' },

  section: { marginBottom: theme.spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  colorGrid: { flexDirection: 'row' },
  colorItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.border + '33', padding: 10, borderRadius: 12, marginRight: 10, borderWidth: 1, borderColor: 'transparent' },
  activeColor: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '1A' },
  colorDot: { width: 14, height: 14, borderRadius: 7, marginRight: 8 },
  colorLabel: { fontSize: 13, fontWeight: '600' },
  activeLabel: { color: theme.colors.text },

  tabBar: { flexDirection: 'row', borderRadius: 15, padding: 5, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: theme.colors.card },
  tabText: { color: theme.colors.subtext, fontWeight: 'bold', fontSize: 13 },
  activeTabText: { color: theme.colors.primary },

  tabContent: { minHeight: 200 },
  description: { fontSize: 15, lineHeight: 24, marginBottom: 20 },
  featureCard: { padding: theme.spacing.md, borderRadius: theme.radius.lg, borderWidth: 1 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md },
  fInfo: { marginLeft: 15 },
  fTitle: { fontSize: 16, fontWeight: 'bold' },
  fDesc: { fontSize: 12, marginTop: 2 },

  specGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', flex: 1 },
  specItem: { width: '48%', padding: 20, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: theme.colors.border },
  specVal: { fontSize: 18, fontWeight: 'bold' },
  specLabel: { fontSize: 11, marginTop: 4 },

  actionArea: { marginTop: theme.spacing.xl, alignItems: 'center' },
  mainBtn: { width: '100%', height: 60, borderRadius: 18, overflow: 'hidden', marginBottom: theme.spacing.sm },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footerHint: { color: theme.colors.subtext, fontSize: 11, fontStyle: 'italic' }
});


