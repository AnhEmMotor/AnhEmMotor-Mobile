import React, { useCallback } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useActiveColors } from '../../../theme/Theme';
import { moderateScale } from '../../../utils/responsive';
import { Search, Filter } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import ScalePress from '../../../components/ScalePress';
import ProductMotorCard from '../../../components/ProductMotorCard';
import Skeleton from '../../../components/Skeleton';
import EmptyState from '../../../components/EmptyState';
import { PackageOpen } from 'lucide-react-native';
import { useCatalog } from './useCatalog';

export default function CatalogScreen({ navigation }) {
  const {
    loading,
    fetchError,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    CATEGORIES,
    BRANDS,
    filteredMotors,
    activeCategoryId,
    setActiveCategoryId,
    activeBrandId,
    setActiveBrandId,
    refreshProducts,
  } = useCatalog();

  const activeColors = useActiveColors();

  useFocusEffect(
    useCallback(() => {
      refreshProducts();
    }, [refreshProducts])
  );

  const showSkeleton = loading && filteredMotors.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: activeColors.background }} edges={['top']}>
      <Animated.View
        entering={FadeInUp.duration(600).delay(100)}
        style={{
          paddingHorizontal: moderateScale(16),
          paddingTop: moderateScale(12),
          backgroundColor: activeColors.card,
          flexDirection: 'row',
          alignItems: 'center',
          gap: moderateScale(8),
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: activeColors.background,
            borderRadius: moderateScale(10),
            paddingHorizontal: moderateScale(12),
            paddingVertical: moderateScale(8),
          }}
        >
          <Search color={activeColors.subtext} size={moderateScale(20)} />
          <TextInput
            placeholder="Tìm phụ tùng, đồ chơi xe..."
            placeholderTextColor={activeColors.subtext}
            style={{
              flex: 1,
              color: activeColors.text,
              marginLeft: moderateScale(8),
              fontSize: moderateScale(14),
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
            padding: moderateScale(10),
            borderRadius: moderateScale(10),
          }}
          onPress={() => {
            const modes = ['Newest', 'PriceAsc', 'PriceDesc'];
            const idx = modes.indexOf(sortBy);
            setSortBy(modes[(idx + 1) % modes.length]);
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(4) }}>
            <Filter color={activeColors.isDark ? '#fff' : '#000'} size={moderateScale(18)} />
            <Text
              style={{
                color: activeColors.isDark ? '#fff' : '#000',
                fontSize: moderateScale(11),
                fontWeight: '500',
              }}
            >
              {sortBy === 'Newest' ? 'Mới' : sortBy === 'PriceAsc' ? 'Giá ↑' : 'Giá ↓'}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: moderateScale(16), gap: moderateScale(14) }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshProducts}
            tintColor={activeColors.primary}
          />
        }
      >
        <View>
          <Text
            style={{
              color: activeColors.text,
              fontWeight: '600',
              marginBottom: moderateScale(8),
              fontSize: moderateScale(14),
            }}
          >
            Danh mục
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((cat) => (
              <ScalePress
                key={cat.id ?? 'all'}
                style={{
                  paddingHorizontal: moderateScale(14),
                  paddingVertical: moderateScale(8),
                  borderRadius: moderateScale(20),
                  backgroundColor:
                    activeCategoryId === cat.id ? activeColors.primary : activeColors.card,
                  borderWidth: 1,
                  borderColor:
                    activeCategoryId === cat.id ? activeColors.primary : activeColors.border,
                  marginRight: moderateScale(6),
                }}
                onPress={() => setActiveCategoryId(cat.id)}
              >
                <Text
                  style={{
                    color: activeCategoryId === cat.id ? '#fff' : activeColors.text,
                    fontSize: moderateScale(13),
                    fontWeight: activeCategoryId === cat.id ? '600' : '400',
                  }}
                >
                  {cat.name}
                </Text>
              </ScalePress>
            ))}
          </ScrollView>
        </View>

        <View>
          <Text
            style={{
              color: activeColors.text,
              fontWeight: '600',
              marginBottom: moderateScale(8),
              fontSize: moderateScale(14),
            }}
          >
            Thương hiệu
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ScalePress
              style={{
                paddingHorizontal: moderateScale(14),
                paddingVertical: moderateScale(8),
                borderRadius: moderateScale(20),
                backgroundColor:
                  activeBrandId === 'Tất cả' || activeBrandId === null
                    ? activeColors.primary
                    : activeColors.card,
                borderWidth: 1,
                borderColor:
                  activeBrandId === 'Tất cả' || activeBrandId === null
                    ? activeColors.primary
                    : activeColors.border,
                marginRight: moderateScale(6),
              }}
              onPress={() => setActiveBrandId(null)}
            >
              <Text
                style={{
                  color:
                    activeBrandId === 'Tất cả' || activeBrandId === null
                      ? '#fff'
                      : activeColors.text,
                  fontSize: moderateScale(13),
                  fontWeight: activeBrandId === 'Tất cả' || activeBrandId === null ? '600' : '400',
                }}
              >
                Tất cả
              </Text>
            </ScalePress>
            {BRANDS.map((brand) => {
              const isActive = activeBrandId === brand.id || activeBrandId === brand.name;
              return (
                <ScalePress
                  key={brand.id}
                  onPress={() => setActiveBrandId(brand.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: moderateScale(12),
                    paddingVertical: moderateScale(8),
                    borderRadius: moderateScale(20),
                    backgroundColor: isActive ? activeColors.primary : activeColors.card,
                    borderWidth: 1,
                    borderColor: isActive ? activeColors.primary : activeColors.border,
                    marginRight: moderateScale(6),
                    gap: moderateScale(6),
                  }}
                >
                  {brand.logoUrl ? (
                    <Image
                      source={{ uri: brand.logoUrl }}
                      style={{ width: moderateScale(18), height: moderateScale(18) }}
                      resizeMode="contain"
                    />
                  ) : null}
                  <Text
                    style={{
                      color: isActive ? '#fff' : activeColors.text,
                      fontSize: moderateScale(13),
                      fontWeight: isActive ? '600' : '400',
                    }}
                    numberOfLines={1}
                  >
                    {brand.name}
                  </Text>
                </ScalePress>
              );
            })}
          </ScrollView>
        </View>

        {fetchError ? (
          <View style={{ alignItems: 'center', padding: moderateScale(32) }}>
            <Text
              style={{
                color: activeColors.subtext,
                textAlign: 'center',
                marginBottom: moderateScale(16),
              }}
            >
              {fetchError}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: activeColors.primary,
                paddingHorizontal: moderateScale(24),
                paddingVertical: moderateScale(12),
                borderRadius: moderateScale(8),
              }}
              onPress={refreshProducts}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : showSkeleton ? (
          <View style={{ gap: moderateScale(12) }}>
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={{
                  backgroundColor: activeColors.card,
                  borderRadius: moderateScale(12),
                  padding: moderateScale(12),
                  gap: moderateScale(10),
                }}
              >
                <Skeleton
                  width="100%"
                  height={moderateScale(130)}
                  borderRadius={moderateScale(8)}
                />
                <Skeleton width="80%" height={moderateScale(16)} borderRadius={4} />
                <Skeleton width="40%" height={moderateScale(14)} borderRadius={4} />
              </View>
            ))}
          </View>
        ) : (
          <View style={{ gap: moderateScale(12) }}>
            {filteredMotors.map((motor, idx) => (
              <Animated.View key={motor.id} entering={FadeInUp.duration(500).delay(idx * 50)}>
                <ProductMotorCard
                  motor={motor}
                  onPress={() => navigation.navigate('VehicleDetail', { motor })}
                />
              </Animated.View>
            ))}
          </View>
        )}

        {!fetchError && !showSkeleton && filteredMotors.length === 0 && (
          <EmptyState
            icon={PackageOpen}
            title="Không tìm thấy sản phẩm"
            message={
              searchQuery
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                : 'Hiện tại chưa có sản phẩm phù hợp'
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
