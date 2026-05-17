import React from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image,
  Modal 
} from 'react-native';
import { Theme, useActiveColors } from '../../../theme/Theme';
import { moderateScale } from '../../../utils/responsive';
import { Search, Filter, Camera, Sparkles, ChevronRight, Settings } from 'lucide-react-native';
import Skeleton from '../../../components/Skeleton';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle } from 'react-native-reanimated';
import ScalePress from '../../../components/ScalePress';
import { styles } from './styles';
import { useCatalog } from './useCatalog';

/**
 * @file CatalogScreen.js
 * @framework React Native (Clean Architecture - Presentation Layer)
 */
export default function CatalogScreen({ navigation }) {
  const {
    loading,
    quoteModal,
    filterModal,
    selectedMotor,
    quotePhone,
    setQuotePhone,
    aiScanning,
    activeCategory,
    setActiveCategory,
    activeBrand,
    setActiveBrand,
    activeType,
    setActiveType,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    scanPos,
    BRANDS,
    MOTOR_TYPES,
    filteredMotors,
    openQuote,
    closeQuote,
    handleAiSearch,
    setFilterModal,
  } = useCatalog();

  const activeColors = useActiveColors();

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanPos.value }]
  }));

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: activeColors.card }]}>
          <Search color={activeColors.subtext} size={moderateScale(20)} />
          <TextInput 
            placeholder="Tìm phụ tùng, đồ chơi xe..." 
            placeholderTextColor={activeColors.subtext}
            style={[styles.searchInput, { color: activeColors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.aiBtn} onPress={handleAiSearch}>
            <Camera color={activeColors.primary} size={moderateScale(18)} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModal(true)}>
          <Filter color="#fff" size={moderateScale(20)} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterBtn, { marginLeft: moderateScale(8) }]} 
          onPress={() => navigation.navigate('Profile', { openSettings: true })}
        >
          <Settings color="#fff" size={moderateScale(20)} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <Animated.View entering={FadeInUp.duration(600).delay(150)}>
          <ScalePress style={styles.aiBanner} onPress={handleAiSearch}>
            <Sparkles color="#F59E0B" size={moderateScale(16)} />
            <Text style={styles.aiBannerText}>AI đang phân tích phụ tùng tương thích với xe bạn</Text>
          </ScalePress>
        </Animated.View>

        <View style={styles.filterSection}>
          <Text style={[styles.filterGroupTitle, { color: activeColors.text }]}>Danh mục sản phẩm</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {['Tất cả', 'Xe mới', 'Phụ tùng', 'Phụ kiện', 'Đồ bảo hộ'].map((cat, i) => (
              <ScalePress 
                key={i} 
                style={[
                  styles.chip, 
                  { backgroundColor: activeColors.card, borderColor: activeColors.border },
                  activeCategory === cat && [styles.activeChip, { backgroundColor: activeColors.primary, borderColor: activeColors.primary }]
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.chipText, { color: activeColors.subtext }, activeCategory === cat && [styles.activeChipText, { color: '#fff' }]]}>{cat}</Text>
              </ScalePress>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={[styles.filterGroupTitle, { color: activeColors.text }]}>Hãng xe</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {BRANDS.map((brand, i) => (
              <ScalePress 
                key={i} 
                style={[
                  styles.brandChip, 
                  { backgroundColor: activeColors.card, borderColor: 'transparent' },
                  activeBrand === brand.name && [styles.activeBrandChip, { borderColor: activeColors.primary, backgroundColor: activeColors.isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' }]
                ]}
                onPress={() => setActiveBrand(brand.name)}
              >
                <Image source={{ uri: brand.image }} style={styles.brandLogo} />
                <Text style={[styles.brandText, { color: activeColors.subtext }, activeBrand === brand.name && [styles.activeBrandText, { color: activeColors.primary }]]}>{brand.name}</Text>
              </ScalePress>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={[styles.filterGroupTitle, { color: activeColors.text }]}>Loại xe</Text>
          <View style={styles.verticalTypeContainer}>
            {MOTOR_TYPES.map((type, i) => (
              <ScalePress 
                key={i} 
                style={[
                  styles.verticalTypeCard, 
                  { backgroundColor: activeColors.card, borderColor: activeColors.border },
                  activeType === type.name && [styles.activeTypeCard, { borderColor: activeColors.primary, backgroundColor: activeColors.isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.08)' }]
                ]}
                onPress={() => {
                  setActiveType(type.name);
                  navigation.navigate('ProductList', { brand: activeBrand, type: type.name });
                }}
              >
                <View style={styles.typeCardInner}>
                  <Image source={{ uri: type.image }} style={styles.typeIconSmall} />
                  <Text style={[styles.typeTextLarge, { color: activeColors.text }, activeType === type.name && [styles.activeTypeTextLarge, { color: activeColors.primary }]]}>{type.name}</Text>
                </View>
                <ChevronRight color={activeType === type.name ? activeColors.primary : activeColors.subtext} size={moderateScale(18)} />
              </ScalePress>
            ))}
          </View>
        </View>

        <View style={styles.grid}>
          {/* Product list removed as per user request */}
        </View>
      </ScrollView>

      {/* MODALS */}
      <Modal visible={aiScanning} transparent animationType="fade">
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame}>
            <Animated.View style={[styles.scanLine, scanStyle]} />
          </View>
          <Text style={styles.scanText}>AI đang nhận diện phụ tùng...</Text>
        </View>
      </Modal>

      <Modal visible={quoteModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={closeQuote} />
          <Animated.View entering={FadeInDown.duration(400)} style={[styles.modalSheet, { backgroundColor: activeColors.card }]}>
            <View style={[styles.modalHandle, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
            <Text style={[styles.modalTitle, { color: activeColors.text }]}>Yêu cầu báo giá nhanh ⚡</Text>
            <Text style={styles.modalMotorName}>{selectedMotor?.name}</Text>
            <Text style={[styles.modalLabel, { color: activeColors.subtext }]}>Số điện thoại liên hệ</Text>
            <View style={[styles.modalInputOpen, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
              <TextInput
                style={[styles.modalTextInput, { color: activeColors.text }]}
                value={quotePhone}
                onChangeText={setQuotePhone}
                placeholder="Ví dụ: 0912 345 678"
                placeholderTextColor={activeColors.subtext}
                keyboardType="phone-pad"
              />
            </View>
            <TouchableOpacity style={styles.modalSendBtn} onPress={closeQuote}>
              <Text style={styles.modalSendText}>Gửi yêu cầu ngay</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
