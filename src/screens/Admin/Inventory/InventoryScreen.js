import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Pressable } from 'react-native';
import { Theme, useActiveColors } from '../../../theme/Theme';
import { 
  Search, 
  ChevronLeft,
  AlertTriangle,
  Package,
  Info,
  MapPin,
  Phone,
  DollarSign,
  AlertCircle
} from 'lucide-react-native';
import GlassCard from '../../../components/GlassCard';
import Animated, { FadeInUp, FadeInRight, Layout } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import CustomBottomSheet from '../../../components/CustomBottomSheet';

const mockInventory = [
  { id: '1', name: 'Nhớt máy Castrol Power1 1L', sku: 'PK-N-CT01', category: 'Phụ tùng', stock: 5, minLimit: 20, price: '150.000đ', costPrice: '110.000đ', location: 'Kệ A - Tầng 2', supplierName: 'NPP Dầu Nhớt VN', supplierPhone: '0901234567' },
  { id: '2', name: 'Lọc gió Honda Winner X', sku: 'PT-LG-WN01', category: 'Phụ tùng', stock: 2, minLimit: 10, price: '120.000đ', costPrice: '80.000đ', location: 'Kệ B - Tầng 1', supplierName: 'Phụ tùng Honda', supplierPhone: '0912345678' },
  { id: '3', name: 'Gương chiếu hậu SH', sku: 'PT-G-SH2025', category: 'Phụ kiện', stock: 14, minLimit: 5, price: '350.000đ', costPrice: '250.000đ', location: 'Kệ C - Tầng 3', supplierName: 'Phụ kiện Xe Máy HCM', supplierPhone: '0923456789' },
  { id: '4', name: 'Nhớt Motul Scooter 1L', sku: 'PK-N-MT02', category: 'Phụ tùng', stock: 85, minLimit: 15, price: '180.000đ', costPrice: '130.000đ', location: 'Kệ A - Tầng 1', supplierName: 'NPP Dầu Nhớt VN', supplierPhone: '0901234567' },
  { id: '5', name: 'Balo chống nước', sku: 'PK-B-CN01', category: 'Phụ kiện', stock: 8, minLimit: 5, price: '450.000đ', costPrice: '300.000đ', location: 'Tủ kính D', supplierName: 'Givi VN', supplierPhone: '0988776655' },
  { id: '6', name: 'Honda Winner X 2026 Đen', sku: 'XE-HW-X26D', category: 'Xe nguyên chiếc', stock: 3, minLimit: 5, price: '46.000.000đ', costPrice: '42.000.000đ', location: 'Khu vực trưng bày 1', supplierName: 'Honda VN', supplierPhone: '18008001' },
];

const FILTER_TABS = ['Tất cả', 'Phụ tùng', 'Phụ kiện', 'Xe nguyên chiếc'];

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: colors.spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: colors.spacing.xl + 20, marginBottom: colors.spacing.lg },
  backBtn: { width: 38, height: 38, borderRadius: 0, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  title: { color: colors.text, fontSize: 22, fontWeight: 'bold' },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 0, paddingHorizontal: 16, height: 50, marginBottom: colors.spacing.md, borderWidth: 1, borderColor: colors.border },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, color: colors.text, fontSize: 14 },
  
  filterContainer: { flexDirection: 'row', marginBottom: colors.spacing.lg },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 8, backgroundColor: colors.card },
  activeFilterTab: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.subtext, fontSize: 13, fontWeight: '600' },
  activeFilterText: { color: '#fff' },

  sectionContainer: { marginBottom: colors.spacing.lg },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: 'bold', marginLeft: 8, textTransform: 'uppercase' },
  
  alertCard: { padding: 16, marginBottom: 10, borderColor: '#EF4444', borderWidth: 1, backgroundColor: 'rgba(239, 68, 68, 0.05)' },
  itemRow: { padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { color: colors.text, fontSize: 15, fontWeight: 'bold', flex: 1, marginRight: 10 },
  itemSku: { color: colors.subtext, fontSize: 12, marginTop: 4 },
  
  stockBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  stockText: { fontSize: 14, fontWeight: 'bold' },
  
  warningText: { color: '#EF4444', fontSize: 12, marginTop: 8, fontStyle: 'italic' },
  
  footerReminder: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '1A', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.primary + '33', marginTop: 10, marginBottom: 40 },
  footerReminderText: { color: colors.text, fontSize: 13, marginLeft: 12, flex: 1, lineHeight: 20 },

  // Bottom Sheet Styles
  bsSection: { marginBottom: 20 },
  bsLabel: { color: colors.subtext, fontSize: 13, marginBottom: 4 },
  bsValueRow: { flexDirection: 'row', alignItems: 'center' },
  bsValueText: { color: colors.text, fontSize: 16, fontWeight: '600', marginLeft: 10 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 15 }
});

export default function InventoryScreen() {
  const colors = useActiveColors();
  const styles = getStyles(colors);
  
  let navigation;
  try {
    navigation = useNavigation();
  } catch (e) {
    navigation = null;
  }

  const bottomSheetRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = useMemo(() => {
    return mockInventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'Tất cả' || item.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const lowStockItems = filteredItems.filter(item => item.stock <= item.minLimit);
  const normalStockItems = filteredItems.filter(item => item.stock > item.minLimit);

  const openDetails = (item) => {
    setSelectedItem(item);
    bottomSheetRef.current?.show();
  };

  const renderItem = (item, isAlert) => {
    const isCritical = item.stock === 0;
    const isLow = item.stock > 0 && item.stock <= item.minLimit;
    const stockColor = isAlert ? '#EF4444' : colors.success;

    let alertLabel = '';
    if (isCritical) alertLabel = '⚠️ Hết hàng';
    else if (isLow) alertLabel = '⚠️ Sắp hết';

    return (
      <Animated.View key={item.id} entering={FadeInRight} layout={Layout.springify()}>
        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={() => openDetails(item)}
          style={isAlert ? styles.alertCard : styles.itemRow}
        >
          <View style={styles.itemHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemSku}>SKU: {item.sku}</Text>
              {isAlert && (
                <Text style={styles.warningText}>
                  Còn {item.stock} cái (Ngưỡng an toàn: {item.minLimit}) ➔ {alertLabel}
                </Text>
              )}
            </View>
            <View style={[styles.stockBadge, { backgroundColor: isAlert ? 'transparent' : colors.success + '1A' }]}>
              <Text style={[styles.stockText, { color: stockColor }]}>Tồn: {item.stock}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
          {navigation && navigation.canGoBack && navigation.canGoBack() && (
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <ChevronLeft color={colors.text} size={20} />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>Tra Cứu Tồn Kho</Text>
        </Animated.View>

        <View style={styles.searchContainer}>
          <Search color={colors.subtext} size={20} style={styles.searchIcon} />
          <TextInput
            placeholder="Tìm tên sản phẩm, mã SKU..."
            placeholderTextColor={colors.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {FILTER_TABS.map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.filterTab, activeFilter === tab && styles.activeFilterTab]}
                onPress={() => setActiveFilter(tab)}
              >
                <Text style={[styles.filterText, activeFilter === tab && styles.activeFilterText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
          {lowStockItems.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleRow}>
                <AlertTriangle color="#EF4444" size={20} />
                <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>
                  CẢNH BÁO HÀNG SẮP HẾT ({lowStockItems.length})
                </Text>
              </View>
              {lowStockItems.map(item => renderItem(item, true))}
            </View>
          )}

          {normalStockItems.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleRow}>
                <Package color={colors.primary} size={20} />
                <Text style={styles.sectionTitle}>DANH SÁCH HÀNG HÓA ({normalStockItems.length})</Text>
              </View>
              {normalStockItems.map(item => renderItem(item, false))}
            </View>
          )}

          <View style={styles.footerReminder}>
            <Info color={colors.primary} size={24} />
            <Text style={styles.footerReminderText}>
              💡 Mọi thao tác Thêm, Sửa, Xóa và Nhập kho vui lòng thực hiện trên Web Admin.
            </Text>
          </View>
        </ScrollView>
      </View>

      <CustomBottomSheet ref={bottomSheetRef} title="Chi Tiết Sản Phẩm" themeMode="dark">
        {selectedItem && (
          <View style={{ paddingTop: 10 }}>
            <Text style={[styles.itemName, { fontSize: 18, marginBottom: 4, marginRight: 0 }]}>{selectedItem.name}</Text>
            <Text style={[styles.itemSku, { marginBottom: 20 }]}>SKU: {selectedItem.sku}</Text>

            <View style={styles.bsSection}>
              <Text style={styles.bsLabel}>Giá Vốn / Giá Bán Niêm Yết</Text>
              <View style={styles.bsValueRow}>
                <DollarSign color={colors.success} size={18} />
                <Text style={styles.bsValueText}>{selectedItem.costPrice} / {selectedItem.price}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bsSection}>
              <Text style={styles.bsLabel}>Vị Trí Kệ Kho</Text>
              <View style={styles.bsValueRow}>
                <MapPin color={colors.secondary} size={18} />
                <Text style={styles.bsValueText}>{selectedItem.location}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bsSection}>
              <Text style={styles.bsLabel}>Nhà Cung Ứng</Text>
              <View style={[styles.bsValueRow, { marginBottom: 10 }]}>
                <Package color={colors.primary} size={18} />
                <Text style={styles.bsValueText}>{selectedItem.supplierName}</Text>
              </View>
              <View style={styles.bsValueRow}>
                <Phone color={colors.primary} size={18} />
                <Text style={styles.bsValueText}>{selectedItem.supplierPhone}</Text>
              </View>
            </View>
          </View>
        )}
      </CustomBottomSheet>
    </View>
  );
}
