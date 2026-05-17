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
import { Theme } from '../../../theme/Theme';
import { moderateScale } from '../../../utils/responsive';
import { Search, Filter, Camera, Sparkles, ChevronRight } from 'lucide-react-native';
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

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanPos.value }]
  }));

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.header}>
        <View style={styles.searchContainer}>
          <Search color={Theme.colors.subtext} size={moderateScale(20)} />
          <TextInput 
            placeholder="Tìm phụ tùng, đồ chơi xe..." 
            placeholderTextColor={Theme.colors.subtext}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.aiBtn} onPress={handleAiSearch}>
            <Camera color={Theme.colors.primary} size={moderateScale(18)} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModal(true)}>
          <Filter color="#fff" size={moderateScale(20)} />
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
          <Text style={styles.filterGroupTitle}>Danh mục sản phẩm</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {['Tất cả', 'Xe mới', 'Phụ tùng', 'Phụ kiện', 'Đồ bảo hộ'].map((cat, i) => (
              <ScalePress 
                key={i} 
                style={[styles.chip, activeCategory === cat && styles.activeChip]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.chipText, activeCategory === cat && styles.activeChipText]}>{cat}</Text>
              </ScalePress>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterGroupTitle}>Hãng xe</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {BRANDS.map((brand, i) => (
              <ScalePress 
                key={i} 
                style={[styles.brandChip, activeBrand === brand.name && styles.activeBrandChip]}
                onPress={() => setActiveBrand(brand.name)}
              >
                <Image source={{ uri: brand.image }} style={styles.brandLogo} />
                <Text style={[styles.brandText, activeBrand === brand.name && styles.activeBrandText]}>{brand.name}</Text>
              </ScalePress>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterGroupTitle}>Loại xe</Text>
          <View style={styles.verticalTypeContainer}>
            {MOTOR_TYPES.map((type, i) => (
              <ScalePress 
                key={i} 
                style={[styles.verticalTypeCard, activeType === type.name && styles.activeTypeCard]}
                onPress={() => {
                setActiveType(type.name);
                navigation.navigate('ProductList', { brand: activeBrand, type: type.name });
              }}
              >
                <View style={styles.typeCardInner}>
                  <Image source={{ uri: type.image }} style={styles.typeIconSmall} />
                  <Text style={[styles.typeTextLarge, activeType === type.name && styles.activeTypeTextLarge]}>{type.name}</Text>
                </View>
                <ChevronRight color={activeType === type.name ? Theme.colors.primary : Theme.colors.subtext} size={moderateScale(18)} />
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
          <Animated.View entering={FadeInDown.duration(400)} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Yêu cầu báo giá nhanh ⚡</Text>
            <Text style={styles.modalMotorName}>{selectedMotor?.name}</Text>
            <Text style={styles.modalLabel}>Số điện thoại liên hệ</Text>
            <View style={styles.modalInputOpen}>
              <TextInput
                style={styles.modalTextInput}
                value={quotePhone}
                onChangeText={setQuotePhone}
                placeholder="Ví dụ: 0912 345 678"
                placeholderTextColor={Theme.colors.subtext}
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
