import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import { Theme } from '../../theme/Theme';
import { Search, Filter, Zap, Camera, Sparkles, CheckCircle } from 'lucide-react-native';
import Skeleton from '../../components/Skeleton';
import { MOCK_MOTORS } from '../../constants/MockData';
import GlassCard from '../../components/GlassCard';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming 
} from 'react-native-reanimated';
import ScalePress from '../../components/ScalePress';

export default function CatalogScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [quoteModal, setQuoteModal] = useState(false);
  const [selectedMotor, setSelectedMotor] = useState(null);
  const [quotePhone, setQuotePhone] = useState('');
  const [aiScanning, setAiScanning] = useState(false);

  const scanPos = useSharedValue(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    scanPos.value = withRepeat(withTiming(250, { duration: 2000 }), -1, true);
    return () => clearTimeout(timer);
  }, []);

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanPos.value }]
  }));

  const openQuote = (motor) => { setSelectedMotor(motor); setQuoteModal(true); };
  const closeQuote = () => { setQuoteModal(false); setQuotePhone(''); };

  const handleAiSearch = () => {
    setAiScanning(true);
    setTimeout(() => setAiScanning(false), 3000);
  };

  return (
    <View style={styles.container}>
      {/* I.3 SEARCH BAR WITH AI (IMAGE/TEXT) */}
      <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.header}>
        <View style={styles.searchContainer}>
          <Search color={Theme.colors.subtext} size={20} />
          <TextInput 
            placeholder="Tìm phụ tùng, đồ chơi xe..." 
            placeholderTextColor={Theme.colors.subtext}
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.aiBtn} onPress={handleAiSearch}>
            <Camera color={Theme.colors.primary} size={18} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter color="#fff" size={20} />
        </TouchableOpacity>
      </Animated.View>

      {/* I.3 AI SEARCH BANNER */}
      <Animated.View entering={FadeInUp.duration(600).delay(150)}>
        <ScalePress style={styles.aiBanner} onPress={handleAiSearch}>
          <Sparkles color="#F59E0B" size={16} />
          <Text style={styles.aiBannerText}>AI đang phân tích phụ tùng tương thích với xe bạn</Text>
        </ScalePress>
      </Animated.View>

      {/* CATEGORY CHIPS */}
      <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.chipContainerWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {['Tất cả', 'Xe mới', 'Phụ tùng', 'Phụ kiện', 'Đồ bảo hộ'].map((cat, i) => (
            <ScalePress key={i} style={[styles.chip, i === 0 && styles.activeChip]}>
              <Text style={[styles.chipText, i === 0 && styles.activeChipText]}>{cat}</Text>
            </ScalePress>
          ))}
        </ScrollView>
      </Animated.View>

      {/* I.3 CATALOG GRID (COMPATIBILITY MATRIX) */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.motorCardWrapper}>
              <View style={styles.skeletonCard}>
                <Skeleton width="100%" height={120} borderRadius={Theme.radius.md} />
                <View style={{marginTop: 10}}>
                  <Skeleton width="80%" height={18} />
                  <View style={{marginTop: 8}}>
                    <Skeleton width="50%" height={14} />
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          MOCK_MOTORS.map((item, index) => (
            <Animated.View 
              key={item.id} 
              entering={FadeInDown.duration(600).delay(index * 100)}
              style={styles.motorCardWrapper}
            >
              <ScalePress 
                onPress={() => navigation.navigate('VehicleDetail', { motor: item })}
              >
                <GlassCard style={styles.motorCard} intensity={15}>
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: item.img }} style={styles.motorImg} resizeMode="cover" />
                    {index % 2 === 0 && (
                      <View style={styles.compatBadge}>
                        <CheckCircle color="#fff" size={10} />
                        <Text style={styles.compatText}>Hợp với Z1000</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.motorName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.motorPrice}>{item.price}</Text>
                  
                  {/* I.3 YÊU CẦU TƯ VẤN (QUOTE REQUEST) */}
                  <ScalePress style={styles.quoteBtn} onPress={(e) => { e.stopPropagation?.(); openQuote(item); }}>
                    <Zap color="#fff" size={12} />
                    <Text style={styles.quoteBtnText}>Nhận báo giá</Text>
                  </ScalePress>
                </GlassCard>
              </ScalePress>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* AI SCANNING MODAL */}
      <Modal visible={aiScanning} transparent animationType="fade">
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame}>
            <Animated.View 
              style={[styles.scanLine, scanStyle]} 
            />
          </View>
          <Text style={styles.scanText}>AI đang nhận diện phụ tùng...</Text>
        </View>
      </Modal>

      {/* QUOTE MODAL */}
      <Modal visible={quoteModal} transparent animationType="slide" onRequestClose={closeQuote}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={closeQuote} />
          <Animated.View entering={FadeInDown.duration(400)} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Yêu cầu báo giá nhanh ⚡</Text>
            <Text style={styles.modalMotorName}>{selectedMotor?.name}</Text>
            
            <Text style={styles.modalLabel}>Số điện thoại liên hệ</Text>
            <GlassCard style={styles.modalInput}>
              <TextInput
                style={styles.modalTextInput}
                value={quotePhone}
                onChangeText={setQuotePhone}
                placeholder="Ví dụ: 0912 345 678"
                placeholderTextColor={Theme.colors.subtext}
                keyboardType="phone-pad"
              />
            </GlassCard>
            <Text style={styles.modalHint}>AnhEmMotor sẽ liên hệ lại tư vấn chính sách trả góp & ưu đãi mới nhất.</Text>
            
            <ScalePress style={styles.modalSendBtn} onPress={closeQuote}>
              <Text style={styles.modalSendText}>Gửi yêu cầu ngay</Text>
            </ScalePress>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { flexDirection: 'row', marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.sm },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.card, borderRadius: 16, paddingHorizontal: 15, height: 50, marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  searchInput: { color: Theme.colors.text, marginLeft: 10, flex: 1 },
  aiBtn: { padding: 6, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 10 },
  filterBtn: { backgroundColor: Theme.colors.primary, width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  
  aiBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245, 158, 11, 0.1)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginBottom: Theme.spacing.md, alignSelf: 'flex-start' },
  aiBannerText: { color: '#F59E0B', fontSize: 12, fontWeight: 'bold', marginLeft: 8 },
  
  chipContainerWrapper: { height: 50, marginBottom: Theme.spacing.md },
  chipContainer: { flexDirection: 'row' },
  chip: { paddingHorizontal: 20, height: 40, borderRadius: 20, backgroundColor: Theme.colors.card, justifyContent: 'center', marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  activeChip: { backgroundColor: Theme.colors.primary, borderColor: Theme.colors.primary },
  chipText: { color: Theme.colors.subtext, fontWeight: '600', fontSize: 13 },
  activeChipText: { color: '#fff' },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 100 },
  motorCardWrapper: { width: '48%', marginBottom: Theme.spacing.md },
  motorCard: { padding: Theme.spacing.sm, borderRadius: 20, overflow: 'hidden' },
  imageWrapper: { position: 'relative', width: '100%', height: 130, borderRadius: 12, overflow: 'hidden', marginBottom: Theme.spacing.sm, backgroundColor: '#fff' },
  motorImg: { width: '100%', height: '100%' },
  
  compatBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: Theme.colors.success, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, flexDirection: 'row', alignItems: 'center' },
  compatText: { color: '#fff', fontSize: 8, fontWeight: 'bold', marginLeft: 4 },

  motorName: { color: Theme.colors.text, fontWeight: 'bold', fontSize: 15 },
  motorPrice: { color: Theme.colors.primary, fontSize: 14, marginVertical: 4, fontWeight: 'bold' },
  quoteBtn: { backgroundColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 12, marginTop: 8 },
  quoteBtnText: { color: Theme.colors.text, fontSize: 12, fontWeight: 'bold', marginLeft: 6 },

  scanOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 250, height: 250, borderWidth: 2, borderColor: Theme.colors.primary, borderRadius: 30, overflow: 'hidden' },
  scanLine: { width: '100%', height: 2, backgroundColor: Theme.colors.primary, boxShadow: `0 0 10px ${Theme.colors.primary}`, elevation: 5 },
  scanText: { color: '#fff', marginTop: 30, fontSize: 16, fontWeight: 'bold' },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)' },
  modalSheet: { backgroundColor: '#0F172A', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 60 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center', marginBottom: 24 },
  modalTitle: { color: Theme.colors.text, fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  modalMotorName: { color: Theme.colors.primary, fontSize: 16, fontWeight: 'bold', marginBottom: 30 },
  modalLabel: { color: Theme.colors.subtext, fontSize: 14, marginBottom: 12 },
  modalInput: { padding: 16, marginBottom: 12 },
  modalTextInput: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  modalHint: { color: Theme.colors.subtext, fontSize: 13, lineHeight: 20, marginBottom: 30 },
  modalSendBtn: { backgroundColor: Theme.colors.primary, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modalSendText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});