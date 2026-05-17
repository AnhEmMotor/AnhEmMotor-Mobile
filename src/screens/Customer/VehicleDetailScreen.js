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
import { Theme } from '../../theme/Theme';
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        overScrollMode="always"
      >
        {/* IMAGE HEADER / 360 AREA */}
        <View style={styles.header}>
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
              entering={FadeIn.duration(800)}
              source={currentImage} 
              style={styles.mainImage} 
              resizeMode="contain"
            />
            
            {motor?.frames && (
              <View style={styles.rotationBadge}>
                <RotateCcw color="#fff" size={14} />
                <Text style={styles.rotationText}>Vuốt ngang để xoay 360°</Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
          >
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <ChevronLeft color="#fff" size={24} />
          </TouchableOpacity>
        </View>

        {/* CONTENT AREA */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{motor?.name || 'Motorcycle'}</Text>
              <Text style={styles.category}>{motor?.brand} • High Performance</Text>
            </View>
            <Text style={styles.price}>{motor?.price}</Text>
          </View>

          {/* COLOR SELECTOR */}
          {!isOwned && motor?.colors && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Màu sắc</Text>
              <View style={styles.colorGrid}>
                {motor.colors.map(c => (
                  <TouchableOpacity 
                    key={c.id} 
                    style={[styles.colorItem, selectedColor === c.id && styles.activeColor]}
                    onPress={() => setSelectedColor(c.id)}
                  >
                    <View style={[styles.colorDot, { backgroundColor: c.hex }]} />
                    <Text style={[styles.colorLabel, selectedColor === c.id && styles.activeLabel]}>{c.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* TAB SYSTEM */}
          <View style={styles.tabBar}>
            {['overview', 'specs', 'finance'].map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab === 'overview' ? 'Tổng quan' : tab === 'specs' ? 'Thông số' : 'Trả góp'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'overview' && (
            <Animated.View entering={FadeInDown} style={styles.tabContent}>
              <Text style={styles.description}>{motor?.description}</Text>
              <GlassCard style={styles.featureCard}>
                <View style={styles.featureItem}>
                  <Zap color={Theme.colors.primary} size={22} />
                  <View style={styles.fInfo}>
                    <Text style={styles.fTitle}>Công nghệ Sugomi</Text>
                    <Text style={styles.fDesc}>Thiết kế tối ưu khí động học và sức mạnh.</Text>
                  </View>
                </View>
                <View style={styles.featureItem}>
                  <ShieldCheck color="#10B981" size={22} />
                  <View style={styles.fInfo}>
                    <Text style={styles.fTitle}>Bảo hành 3 năm</Text>
                    <Text style={styles.fDesc}>Chính sách bảo hành toàn diện từ AnhEmMotor.</Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          )}

          {activeTab === 'specs' && (
            <Animated.View entering={FadeInDown} style={styles.specGrid}>
              {motor?.specs?.map((s, i) => (
                <View key={i} style={styles.specItem}>
                  <Text style={styles.specVal}>{s.value}</Text>
                  <Text style={styles.specLabel}>{s.label}</Text>
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
          <View style={styles.actionArea}>
            <ScalePress style={styles.mainBtn} onPress={() => navigation.navigate('Booking')}>
              <LinearGradient colors={[Theme.colors.primary, '#1E3A8A']} style={styles.gradient}>
                <Text style={styles.btnText}>{isOwned ? 'Đặt lịch bảo dưỡng' : 'Đăng ký lái thử ngay'}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  
  header: { height: 400, backgroundColor: '#fff', position: 'relative' },
  imageWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainImage: { width: '90%', height: '80%' },
  rotationBadge: { position: 'absolute', bottom: 30, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  rotationText: { color: '#fff', fontSize: 11, marginLeft: 6, fontWeight: 'bold' },
  
  backBtn: { position: 'absolute', top: 50, left: 20, width: 44, height: 44, borderRadius: 22, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  
  content: { padding: 20, backgroundColor: Theme.colors.background, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  name: { color: Theme.colors.text, fontSize: 24, fontWeight: 'bold', flex: 1, marginRight: 15 },
  category: { color: Theme.colors.subtext, fontSize: 13, marginTop: 4 },
  price: { color: Theme.colors.primary, fontSize: 20, fontWeight: 'bold' },

  section: { marginBottom: 25 },
  sectionTitle: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  colorGrid: { flexDirection: 'row' },
  colorItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 12, marginRight: 10, borderWidth: 1, borderColor: 'transparent' },
  activeColor: { borderColor: Theme.colors.primary, backgroundColor: 'rgba(0,122,255,0.1)' },
  colorDot: { width: 14, height: 14, borderRadius: 7, marginRight: 8 },
  colorLabel: { color: Theme.colors.subtext, fontSize: 13, fontWeight: '600' },
  activeLabel: { color: Theme.colors.text },

  tabBar: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 15, padding: 5, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: Theme.colors.card },
  tabText: { color: Theme.colors.subtext, fontWeight: 'bold', fontSize: 13 },
  activeTabText: { color: Theme.colors.primary },

  tabContent: { minHeight: 200 },
  description: { color: Theme.colors.subtext, fontSize: 15, lineHeight: 24, marginBottom: 20 },
  featureCard: { padding: 20 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  fInfo: { marginLeft: 15 },
  fTitle: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  fDesc: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2 },

  specGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  specItem: { width: '48%', backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 15, marginBottom: 15 },
  specVal: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  specLabel: { color: Theme.colors.subtext, fontSize: 11, marginTop: 4 },

  actionArea: { marginTop: 30, alignItems: 'center' },
  mainBtn: { width: '100%', height: 60, borderRadius: 18, overflow: 'hidden' },
  gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footerHint: { color: Theme.colors.subtext, fontSize: 11, marginTop: 15, fontStyle: 'italic' }
});

