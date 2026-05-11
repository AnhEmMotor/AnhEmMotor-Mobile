import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Image, Modal, Pressable } from 'react-native';
import { Theme } from '../../theme/Theme';
import { 
  ScanLine, 
  Package, 
  Search, 
  QrCode, 
  ChevronRight, 
  RefreshCcw, 
  Tag, 
  Edit3, 
  X,
  Truck,
  CheckCircle,
  Store
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../components/GlassCard';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInRight, 
  Layout, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming 
} from 'react-native-reanimated';

export default function InventoryScreen() {
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const scanPos = useSharedValue(0);
  
  React.useEffect(() => {
    if (isScanning) {
      scanPos.value = withRepeat(withTiming(280, { duration: 2000 }), -1, true);
    } else {
      scanPos.value = 0;
    }
  }, [isScanning]);

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanPos.value }]
  }));

  const inventory = [
    { id: '1', name: 'Kawasaki Z1000', vin: 'VIN-9921', price: '420.000.000đ', status: 'Trưng bày', color: Theme.colors.success, icon: Store },
    { id: '2', name: 'Honda CBR150R', vin: 'VIN-8842', price: '72.000.000đ', status: 'Đã cọc', color: Theme.colors.warning, icon: Tag },
    { id: '3', name: 'Ducati Panigale V4', vin: 'VIN-7715', price: '950.000.000đ', status: 'Đang về', color: Theme.colors.info, icon: Truck },
    { id: '4', name: 'Yamaha R1 2023', vin: 'VIN-5531', price: '750.000.000đ', status: 'Đã giao', color: Theme.colors.subtext, icon: CheckCircle },
  ];

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  const openPriceEdit = (bike) => {
    setSelectedBike(bike);
    setShowPriceModal(true);
  };

  return (
    <View style={styles.container}>
      {/* II.4 HEADER & SYNC STATUS (PRINCIPLE: REAL-TIME SYNC) */}
      <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
        <View>
          <Text style={styles.title}>Kho Xe Thực 🏍️</Text>
          <Pressable style={styles.syncRow} onPress={handleSync}>
            <RefreshCcw color={syncing ? Theme.colors.primary : Theme.colors.success} size={12} />
            <Text style={[styles.syncText, syncing && { color: Theme.colors.primary }]}>
              {syncing ? 'Đang đồng bộ Management...' : 'Dữ liệu khớp với hệ thống'}
            </Text>
          </Pressable>
        </View>
        <TouchableOpacity style={styles.qrBtn} onPress={() => setIsScanning(true)}>
          <QrCode color="#fff" size={24} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* II.4 QUÉT MÃ QR XE (UI STRATEGY: FAST ACCESS) */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.scanSection}>
          <Pressable onPress={() => setIsScanning(true)}>
            <GlassCard style={styles.scanCard} intensity={25}>
              <View style={styles.scanContent}>
                <View style={styles.scanIconBox}>
                  <ScanLine color={Theme.colors.secondary} size={32} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.scanTitle}>Quét mã nhận diện xe</Text>
                  <Text style={styles.scanSub}>Xem nhanh giá & khuyến mãi hiện hành</Text>
                </View>
                <ChevronRight color={Theme.colors.subtext} size={20} />
              </View>
            </GlassCard>
          </Pressable>
        </Animated.View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Search color={Theme.colors.subtext} size={20} style={styles.searchIcon} />
          <TextInput 
            placeholder="Tìm theo tên xe hoặc số khung..." 
            placeholderTextColor={Theme.colors.subtext}
            style={styles.searchInput}
          />
        </View>

        {/* II.4 TRẠNG THÁI XE THỰC TẾ (NO GAPS POLICY) */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh mục Showroom</Text>
            <Text style={styles.countText}>{inventory.length} xe</Text>
          </View>
          {inventory.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInRight.delay(300 + index * 100)} layout={Layout.springify()}>
              <GlassCard style={styles.bikeCard}>
                <View style={styles.bikeMain}>
                  <View style={[styles.statusIndicator, { backgroundColor: item.color }]} />
                  <View style={styles.bikeInfo}>
                    <Text style={styles.bikeName}>{item.name}</Text>
                    <Text style={styles.bikeVin}>{item.vin}</Text>
                    <View style={styles.statusRow}>
                      <item.icon color={item.color} size={14} />
                      <Text style={[styles.statusLabel, { color: item.color }]}>{item.status}</Text>
                    </View>
                  </View>
                  <View style={styles.priceSection}>
                    <Text style={styles.priceValue}>{item.price}</Text>
                    {/* II.4 CẬP NHẬT GIÁ NHANH (3-TAP RULE) */}
                    <TouchableOpacity style={styles.editBtn} onPress={() => openPriceEdit(item)}>
                      <Edit3 color={Theme.colors.primary} size={14} />
                      <Text style={styles.editText}>Sửa giá</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* QR SCANNER SIMULATION MODAL */}
      <Modal visible={isScanning} transparent animationType="slide">
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame}>
            <Animated.View style={[styles.scanLineAnim, scanStyle]} />
          </View>
          <Text style={styles.scanHint}>Căn chỉnh mã QR trong khung</Text>
          <Pressable style={styles.closeScan} onPress={() => setIsScanning(false)}>
            <X color="#fff" size={32} />
          </Pressable>
        </View>
      </Modal>

      {/* PRICE UPDATE MODAL (UI PRINCIPLE: CLEAR ACTIONS) */}
      <Modal visible={showPriceModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Điều chỉnh giá thị trường</Text>
              <TouchableOpacity onPress={() => setShowPriceModal(false)}>
                <X color={Theme.colors.text} size={24} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalBikeName}>{selectedBike?.name}</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencyPrefix}>VNĐ</Text>
                <TextInput 
                  defaultValue={selectedBike?.price.replace('.000.000đ', '').replace(/\./g, '')}
                  keyboardType="numeric"
                  style={styles.modalInput}
                />
              </View>
              <View style={styles.syncWarning}>
                <RefreshCcw color={Theme.colors.warning} size={14} />
                <Text style={styles.syncWarningText}>Giá mới sẽ cập nhật đồng thời lên App Khách hàng & Website.</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={() => {
              handleSync();
              setShowPriceModal(false);
            }}>
              <Text style={styles.saveText}>Xác nhận điều chỉnh</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  title: { color: Theme.colors.text, fontSize: 28, fontWeight: 'bold' },
  syncRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  syncText: { color: Theme.colors.success, fontSize: 11, marginLeft: 6, fontWeight: '500' },
  qrBtn: { backgroundColor: Theme.colors.secondary, width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  scanSection: { marginVertical: Theme.spacing.md },
  scanCard: { padding: 0, overflow: 'hidden' },
  scanContent: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  scanIconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(227, 27, 35, 0.1)', justifyContent: 'center', alignItems: 'center' },
  scanTitle: { color: Theme.colors.text, fontSize: 17, fontWeight: 'bold' },
  scanSub: { color: Theme.colors.subtext, fontSize: 13, marginTop: 2 },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.card, borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: Theme.spacing.lg, borderWidth: 1, borderColor: Theme.colors.border },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, color: Theme.colors.text, fontSize: 15 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  countText: { color: Theme.colors.subtext, fontSize: 12 },

  bikeCard: { padding: 0, marginBottom: 12, overflow: 'hidden' },
  bikeMain: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingRight: 16 },
  statusIndicator: { width: 6, height: 50, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  bikeInfo: { flex: 1, marginLeft: 16 },
  bikeName: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  bikeVin: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  statusLabel: { fontSize: 11, fontWeight: 'bold', marginLeft: 6 },

  priceSection: { alignItems: 'flex-end' },
  priceValue: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  editBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  editText: { color: Theme.colors.primary, fontSize: 12, fontWeight: 'bold', marginLeft: 6 },

  scanOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 280, height: 280, borderWidth: 2, borderColor: Theme.colors.secondary, borderRadius: 24, overflow: 'hidden', justifyContent: 'center' },
  scanLineAnim: { width: '100%', height: 2, backgroundColor: Theme.colors.secondary, boxShadow: `0 0 10px ${Theme.colors.secondary}`, elevation: 5 },
  scanHint: { color: '#fff', marginTop: 32, fontSize: 16, fontWeight: '500' },
  closeScan: { position: 'absolute', top: 60, right: 30, zIndex: 10, padding: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
  modalContent: { padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold' },
  modalBody: { marginBottom: 32 },
  modalBikeName: { color: Theme.colors.primary, fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, height: 70, paddingHorizontal: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  currencyPrefix: { color: Theme.colors.subtext, fontSize: 18, fontWeight: 'bold', marginRight: 12 },
  modalInput: { flex: 1, color: Theme.colors.text, fontSize: 28, fontWeight: 'bold' },
  syncWarning: { flexDirection: 'row', alignItems: 'center', marginTop: 16, backgroundColor: 'rgba(217, 119, 6, 0.1)', padding: 12, borderRadius: 12 },
  syncWarningText: { color: Theme.colors.warning, fontSize: 11, marginLeft: 8, flex: 1, lineHeight: 16 },
  saveBtn: { backgroundColor: Theme.colors.secondary, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 8, boxShadow: `0 4px 8px rgba(220, 38, 38, 0.3)` },
  saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});