import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Image, Modal, Pressable, ActivityIndicator } from 'react-native';
import { Theme } from '../../../theme/Theme';
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
  Store,
  Layers,
  Wrench,
  AlertTriangle,
  PlusCircle,
  Filter,
  ChevronLeft
} from 'lucide-react-native';
import GlassCard from '../../../components/GlassCard';
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
import { useNavigation } from '@react-navigation/native';

export default function InventoryScreen() {
  let navigation;
  try {
    navigation = useNavigation();
  } catch (e) {
    navigation = null;
  }
  const [activeSubTab, setActiveSubTab] = useState('bikes'); // 'bikes' or 'parts'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBikeId, setExpandedBikeId] = useState('1'); // Default expand first bike matrix
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

  // Ma trận kho xe theo màu sắc (Specification check)
  const [bikeMatrix, setBikeMatrix] = useState([
    {
      id: '1',
      name: 'Honda Winner X 2026',
      price: '46.000.000đ',
      vin: 'AEM-W122',
      colors: [
        { name: 'Đỏ nhám', stock: 2, status: 'Còn hàng', colorCode: '#B91C1C' },
        { name: 'Xanh xi măng', stock: 0, status: 'Hết hàng', colorCode: '#64748B' },
        { name: 'Đen bóng', stock: 5, status: 'Còn hàng', colorCode: '#1F2937' },
        { name: 'Trắng bạc', stock: 1, status: 'Sắp hết', colorCode: '#CBD5E1' },
      ]
    },
    {
      id: '2',
      name: 'Honda SH 160i Thể Thao',
      price: '102.000.000đ',
      vin: 'AEM-S998',
      colors: [
        { name: 'Đen mờ', stock: 1, status: 'Sắp hết', colorCode: '#111827' },
        { name: 'Đỏ thể thao', stock: 3, status: 'Còn hàng', colorCode: '#DC2626' },
        { name: 'Xám xi măng', stock: 0, status: 'Hết hàng', colorCode: '#94A3B8' },
      ]
    },
    {
      id: '3',
      name: 'Kawasaki Z1000',
      price: '420.000.000đ',
      vin: 'AEM-K992',
      colors: [
        { name: 'Xanh Lime', stock: 2, status: 'Còn hàng', colorCode: '#84CC16' },
        { name: 'Đen nhám', stock: 1, status: 'Sắp hết', colorCode: '#374151' },
      ]
    },
    {
      id: '4',
      name: 'Yamaha Exciter 155 VVA',
      price: '52.000.000đ',
      vin: 'AEM-E553',
      colors: [
        { name: 'Xanh GP', stock: 4, status: 'Còn hàng', colorCode: '#1D4ED8' },
        { name: 'Xám đen', stock: 0, status: 'Hết hàng', colorCode: '#4B5563' },
      ]
    }
  ]);

  // Kho phụ tùng thay thế & Cảnh báo tồn kho tối thiểu
  const [partsInventory, setPartsInventory] = useState([
    { id: '1', name: 'Dầu nhớt Motul 10W40', stock: 12, minLimit: 5, category: 'Dầu nhớt', price: '250.000đ' },
    { id: '2', name: 'Má phanh Nissin Winner', stock: 2, minLimit: 5, category: 'Má phanh', price: '180.000đ' },
    { id: '3', name: 'Lọc gió SH 160i', stock: 15, minLimit: 8, category: 'Lọc gió', price: '120.000đ' },
    { id: '4', name: 'Bugi NGK Iridium', stock: 3, minLimit: 10, category: 'Hệ thống điện', price: '95.000đ' },
  ]);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1500);
  };

  // Nút 1-chạm nhập hàng nhanh cho phụ tùng bị thiếu hụt
  const handleRestockPart = (partId) => {
    setPartsInventory(prev => prev.map(part => {
      if (part.id === partId) {
        return { ...part, stock: part.stock + 10 };
      }
      return part;
    }));
  };

  const openPriceEdit = (bike) => {
    setSelectedBike(bike);
    setShowPriceModal(true);
  };

  // Filter vehicles/parts based on search query
  const filteredBikes = bikeMatrix.filter(bike => 
    bike.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredParts = partsInventory.filter(part => 
    part.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
      {/* HEADER */}
      <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {navigation && navigation.canGoBack && navigation.canGoBack() && (
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <ChevronLeft color={Theme.colors.text} size={20} />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1, marginLeft: navigation && navigation.canGoBack && navigation.canGoBack() ? 12 : 0 }}>
            <Text style={styles.title}>Quản Lý Kho 📦</Text>
            <Pressable style={styles.syncRow} onPress={handleSync}>
              <RefreshCcw color={syncing ? Theme.colors.primary : Theme.colors.success} size={12} />
              <Text style={[styles.syncText, syncing && { color: Theme.colors.primary }]}>
                {syncing ? 'Đang đồng bộ Cloud...' : 'Dữ liệu tồn kho khớp 100%'}
              </Text>
            </Pressable>
          </View>
        </View>
        <TouchableOpacity style={styles.qrBtn} onPress={() => setIsScanning(true)}>
          <QrCode color="#fff" size={24} />
        </TouchableOpacity>
      </Animated.View>

      {/* SEARCH AND FILTERS */}
      <View style={styles.searchContainer}>
        <Search color={Theme.colors.subtext} size={20} style={styles.searchIcon} />
        <TextInput
          placeholder={activeSubTab === 'bikes' ? "Tìm nhanh dòng xe (Winner, SH...)" : "Tìm phụ tùng (Dầu nhớt, má phanh...)"}
          placeholderTextColor={Theme.colors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginRight: 10 }}>
            <X color={Theme.colors.subtext} size={16} />
          </TouchableOpacity>
        )}
        <Pressable style={styles.filterBtn}>
          <Filter color={Theme.colors.text} size={18} />
        </Pressable>
      </View>

      {/* KHO XE & PHỤ TÙNG SUB-TABS */}
      <View style={styles.subTabContainer}>
        <TouchableOpacity
          style={[styles.subTab, activeSubTab === 'bikes' && styles.activeSubTab]}
          onPress={() => {
            setActiveSubTab('bikes');
            setSearchQuery('');
          }}
        >
          <Layers color={activeSubTab === 'bikes' ? '#fff' : Theme.colors.subtext} size={16} />
          <Text style={[styles.subTabText, activeSubTab === 'bikes' && styles.activeSubTabText]}>Ma Trận Kho Xe</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTab, activeSubTab === 'parts' && styles.activeSubTab]}
          onPress={() => {
            setActiveSubTab('parts');
            setSearchQuery('');
          }}
        >
          <Wrench color={activeSubTab === 'parts' ? '#fff' : Theme.colors.subtext} size={16} />
          <Text style={[styles.subTabText, activeSubTab === 'parts' && styles.activeSubTabText]}>Kho Phụ Tùng</Text>
        </TouchableOpacity>
      </View>

      {activeSubTab === 'bikes' ? (
          
          /* 🏍️ SECTION 1: KHO XE - MA TRẬN MÀU SẮC */
          <View>
            {/* QR SCAN BANNER */}
            <Animated.View entering={FadeInDown.delay(100)} style={styles.scanSection}>
              <Pressable onPress={() => setIsScanning(true)}>
                <GlassCard style={styles.scanCard} intensity={15}>
                  <View style={styles.scanContent}>
                    <View style={styles.scanIconBox}>
                      <ScanLine color={Theme.colors.secondary} size={28} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={styles.scanTitle}>Quét mã nhận diện VIN 🏷️</Text>
                      <Text style={styles.scanSub}>Định vị vị trí xe tại Showroom Biên Hòa</Text>
                    </View>
                    <ChevronRight color={Theme.colors.subtext} size={18} />
                  </View>
                </GlassCard>
              </Pressable>
            </Animated.View>

            <View style={styles.listSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Danh mục sản phẩm</Text>
                <Text style={styles.countText}>{filteredBikes.length} Dòng xe</Text>
              </View>

              {filteredBikes.map((item, index) => {
                const isExpanded = expandedBikeId === item.id;
                const totalStock = item.colors.reduce((sum, c) => sum + c.stock, 0);

                return (
                  <Animated.View key={item.id} entering={FadeInRight.delay(index * 100)} layout={Layout.springify()}>
                    <GlassCard style={[styles.bikeCard, isExpanded && styles.expandedBikeCard]}>
                      <Pressable onPress={() => setExpandedBikeId(isExpanded ? null : item.id)}>
                        <View style={styles.bikeMain}>
                          <View style={styles.bikeInfoCol}>
                            <Text style={styles.bikeName}>{item.name}</Text>
                            <Text style={styles.bikeVin}>Mã VIN: {item.vin} • <Text style={{ color: Theme.colors.primary, fontWeight: 'bold' }}>{totalStock} xe trong kho</Text></Text>
                          </View>
                          <View style={styles.priceSection}>
                            <Text style={styles.priceValue}>{item.price}</Text>
                            <TouchableOpacity style={styles.editPriceBtn} onPress={(e) => {
                              e.stopPropagation();
                              openPriceEdit(item);
                            }}>
                              <Edit3 color={Theme.colors.primary} size={12} />
                              <Text style={styles.editPriceText}>Sửa giá</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Pressable>

                      {/* MA TRẬN MÀU SẮC DỰA TRÊN ĐẶC TẢ SPEC */}
                      {isExpanded && (
                        <View style={styles.colorMatrixContainer}>
                          <Text style={styles.matrixTitle}>Bảng số lượng xe chi tiết theo màu sắc:</Text>
                          <View style={styles.matrixGrid}>
                            {item.colors.map((color, cIdx) => (
                              <View key={cIdx} style={[
                                styles.colorMatrixCapsule,
                                color.stock === 0 && styles.outOfStockCapsule,
                                color.stock === 1 && styles.lowStockCapsule
                              ]}>
                                <View style={styles.capsuleLeft}>
                                  <View style={[styles.colorDot, { backgroundColor: color.colorCode }]} />
                                  <Text style={[styles.colorName, color.stock === 0 && styles.outOfStockText]}>{color.name}</Text>
                                </View>
                                <View style={styles.capsuleRight}>
                                  <Text style={[
                                    styles.colorStockCount,
                                    color.stock === 0 && { color: Theme.colors.subtext },
                                    color.stock === 1 && { color: '#F59E0B' },
                                    color.stock > 1 && { color: Theme.colors.success }
                                  ]}>
                                    {color.stock === 0 ? 'Hết hàng' : `${color.stock} xe`}
                                  </Text>
                                </View>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    </GlassCard>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        ) : (
          
          /* ⚙️ SECTION 2: KHO PHỤ TÙNG & CẢNH BÁO TỐN KHO TỐI THIỂU */
          <View style={styles.listSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Danh mục Phụ tùng chính hãng</Text>
              <Text style={styles.countText}>{filteredParts.length} Mặt hàng</Text>
            </View>

            {filteredParts.map((item, index) => {
              const isLowStock = item.stock < item.minLimit;
              return (
                <Animated.View key={item.id} entering={FadeInRight.delay(index * 100)} layout={Layout.springify()}>
                  <GlassCard style={[
                    styles.partCard, 
                    isLowStock && styles.partCardLowStock
                  ]}>
                    <View style={styles.partHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.partName}>{item.name}</Text>
                        <Text style={styles.partCategory}>{item.category} • Giá: {item.price}</Text>
                      </View>
                      
                      {/* Cảnh báo nhấp nháy tồn kho tối thiểu */}
                      {isLowStock ? (
                        <View style={styles.lowStockBadge}>
                          <AlertTriangle color="#EF4444" size={12} />
                          <Text style={styles.lowStockBadgeText}>🚨 Dưới ngưỡng ({item.minLimit})</Text>
                        </View>
                      ) : (
                        <View style={styles.stableStockBadge}>
                          <Text style={styles.stableStockBadgeText}>Ổn định</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.partFooter}>
                      <View style={styles.stockInfoCol}>
                        <Text style={styles.stockLabel}>Tồn kho hiện tại:</Text>
                        <Text style={[
                          styles.stockValueText,
                          isLowStock ? { color: '#EF4444', fontWeight: 'bold' } : { color: Theme.colors.success }
                        ]}>
                          {item.stock} cái
                        </Text>
                      </View>

                      {/* Nút 1-chạm nhập hàng nhanh khắc phục thiếu hụt phụ tùng */}
                      <TouchableOpacity 
                        style={[
                          styles.restockBtn,
                          isLowStock ? { backgroundColor: Theme.colors.success } : { backgroundColor: 'rgba(255,255,255,0.06)' }
                        ]}
                        onPress={() => handleRestockPart(item.id)}
                      >
                        <PlusCircle color="#fff" size={14} />
                        <Text style={styles.restockBtnText}>
                          {isLowStock ? 'Nhập hàng nhanh (+10)' : 'Nhập kho thêm'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </GlassCard>
                </Animated.View>
              );
            })}
          </View>
        )
      }

      {/* QR SCANNER SIMULATION MODAL */}
      <Modal visible={isScanning} transparent animationType="slide">
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame}>
            <Animated.View style={[styles.scanLineAnim, scanStyle]} />
          </View>
          <Text style={styles.scanHint}>Đang quét mã vạch phụ tùng/VIN xe...</Text>
          <Pressable style={styles.closeScan} onPress={() => setIsScanning(false)}>
            <X color="#fff" size={32} />
          </Pressable>
        </View>
      </Modal>

      {/* PRICE UPDATE MODAL */}
      <Modal visible={showPriceModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Điều chỉnh giá thị trường</Text>
              <TouchableOpacity onPress={() => setShowPriceModal(false)}>
                <X color={Theme.colors.text} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
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
                  <Text style={styles.syncWarningText}>Giá mới sẽ đồng bộ đồng thời lên App Khách hàng & Website AnhEmMotor.</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={() => {
                handleSync();
                setShowPriceModal(false);
              }}>
                <Text style={styles.saveText}>Xác nhận điều chỉnh giá</Text>
              </TouchableOpacity>
            </ScrollView>
          </GlassCard>
        </View>
      </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: Theme.spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Theme.spacing.xl + 20, marginBottom: Theme.spacing.lg },
  backBtn: { width: 38, height: 38, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  title: { color: Theme.colors.text, fontSize: 26, fontWeight: 'bold' },
  syncRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  syncText: { color: Theme.colors.success, fontSize: 11, marginLeft: 6, fontWeight: '500' },
  qrBtn: { backgroundColor: Theme.colors.secondary, width: 44, height: 44, borderRadius: 0, justifyContent: 'center', alignItems: 'center' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.card, borderRadius: 0, paddingHorizontal: 16, height: 50, marginBottom: Theme.spacing.md, borderWidth: 1, borderColor: Theme.colors.border },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, color: Theme.colors.text, fontSize: 14 },
  filterBtn: { padding: 4 },

  subTabContainer: { flexDirection: 'row', backgroundColor: Theme.colors.card, borderRadius: 0, padding: 4, marginBottom: Theme.spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  subTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 0 },
  activeSubTab: { backgroundColor: '#3B82F6' },
  subTabText: { color: Theme.colors.subtext, fontWeight: '600', marginLeft: 8, fontSize: 13 },
  activeSubTabText: { color: '#fff' },

  scanSection: { marginBottom: Theme.spacing.md },
  scanCard: { padding: 0, overflow: 'hidden' },
  scanContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  scanIconBox: { width: 48, height: 48, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(227, 27, 35, 0.2)', backgroundColor: 'rgba(227, 27, 35, 0.1)', justifyContent: 'center', alignItems: 'center' },
  scanTitle: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold' },
  scanSub: { color: Theme.colors.subtext, fontSize: 12, marginTop: 2 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { color: Theme.colors.text, fontSize: 16, fontWeight: 'bold' },
  countText: { color: Theme.colors.subtext, fontSize: 12 },

  bikeCard: { padding: 16, marginBottom: 12, overflow: 'hidden' },
  expandedBikeCard: { borderColor: 'rgba(59, 130, 246, 0.25)', borderWidth: 1 },
  bikeMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bikeInfoCol: { flex: 1 },
  bikeName: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold' },
  bikeVin: { color: Theme.colors.subtext, fontSize: 12, marginTop: 4 },
  
  priceSection: { alignItems: 'flex-end', marginLeft: 10 },
  priceValue: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold' },
  editPriceBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 6, backgroundColor: 'rgba(59, 130, 246, 0.08)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 0, borderWidth: 0.5, borderColor: 'rgba(59, 130, 246, 0.2)' },
  editPriceText: { color: Theme.colors.primary, fontSize: 11, fontWeight: 'bold', marginLeft: 4 },

  colorMatrixContainer: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  matrixTitle: { color: Theme.colors.subtext, fontSize: 12, fontWeight: 'bold', marginBottom: 10 },
  matrixGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  colorMatrixCapsule: { width: '48%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 0, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' },
  outOfStockCapsule: { backgroundColor: 'rgba(255,255,255,0.01)', opacity: 0.5 },
  lowStockCapsule: { borderColor: 'rgba(245, 158, 11, 0.2)', backgroundColor: 'rgba(245, 158, 11, 0.02)' },
  capsuleLeft: { flexDirection: 'row', alignItems: 'center' },
  colorDot: { width: 10, height: 10, borderRadius: 0, marginRight: 6 },
  colorName: { color: Theme.colors.text, fontSize: 11, fontWeight: '500' },
  outOfStockText: { color: Theme.colors.subtext },
  colorStockCount: { fontSize: 11, fontWeight: 'bold' },

  partCard: { padding: 16, marginBottom: 12, overflow: 'hidden' },
  partCardLowStock: { borderColor: 'rgba(239, 68, 68, 0.25)', borderWidth: 1 },
  partHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  partName: { color: Theme.colors.text, fontSize: 15, fontWeight: 'bold' },
  partCategory: { color: Theme.colors.subtext, fontSize: 12, marginTop: 4 },
  
  lowStockBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 0 },
  lowStockBadgeText: { color: '#EF4444', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  stableStockBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 0 },
  stableStockBadgeText: { color: '#10B981', fontSize: 10, fontWeight: 'bold' },

  partFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  stockInfoCol: { flexDirection: 'row', alignItems: 'center' },
  stockLabel: { color: Theme.colors.subtext, fontSize: 12 },
  stockValueText: { fontSize: 13, marginLeft: 6 },
  restockBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 0 },
  restockBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 6 },

  scanOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 280, height: 280, borderWidth: 2, borderColor: Theme.colors.secondary, borderRadius: 0, overflow: 'hidden', justifyContent: 'center' },
  scanLineAnim: { width: '100%', height: 2, backgroundColor: Theme.colors.secondary, elevation: 5 },
  scanHint: { color: '#fff', marginTop: 32, fontSize: 15, fontWeight: '500' },
  closeScan: { position: 'absolute', top: 60, right: 30, zIndex: 10, padding: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
  modalContent: { padding: 24, borderTopWidth: 2, borderTopColor: Theme.colors.primary, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { color: Theme.colors.text, fontSize: 20, fontWeight: 'bold' },
  modalBody: { marginBottom: 32 },
  modalBikeName: { color: Theme.colors.primary, fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 0, height: 60, paddingHorizontal: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  currencyPrefix: { color: Theme.colors.subtext, fontSize: 16, fontWeight: 'bold', marginRight: 12 },
  modalInput: { flex: 1, color: Theme.colors.text, fontSize: 24, fontWeight: 'bold' },
  syncWarning: { flexDirection: 'row', alignItems: 'center', marginTop: 16, backgroundColor: 'rgba(217, 119, 6, 0.1)', padding: 12, borderRadius: 0, borderWidth: 1, borderColor: 'rgba(217, 119, 6, 0.2)' },
  syncWarningText: { color: Theme.colors.warning, fontSize: 11, marginLeft: 8, flex: 1, lineHeight: 16 },
  saveBtn: { backgroundColor: Theme.colors.secondary, height: 50, borderRadius: 0, justifyContent: 'center', alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 15, fontWeight: 'bold' }
});
