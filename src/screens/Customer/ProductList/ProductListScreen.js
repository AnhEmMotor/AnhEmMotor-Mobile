import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Filter, ShoppingCart, Settings } from 'lucide-react-native';
import { Theme, useActiveColors } from '../../../theme/Theme';
import { moderateScale } from '../../../utils/responsive';
import ScalePress from '../../../components/ScalePress';
import GlassCard from '../../../components/GlassCard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from './styles';
import { useProductList } from './useProductList';

/**
 * @file ProductListScreen.js
 * @framework React Native (Clean Architecture - Presentation Layer)
 */
export default function ProductListScreen({ route, navigation }) {
  const { brand, type, filteredProducts } = useProductList(route);
  const activeColors = useActiveColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: activeColors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          style={[styles.backBtn, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
        >
          <ArrowLeft color={activeColors.text} size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: activeColors.text }]}>{type !== 'Tất cả' ? type : 'Sản phẩm'}</Text>
          <Text style={[styles.headerSubtitle, { color: activeColors.subtext }]}>{brand !== 'Tất cả' ? brand : 'Tất cả thương hiệu'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            accessible
            accessibilityRole="button"
            accessibilityLabel="Giỏ hàng"
            onPress={() => navigation.navigate('Cart')}
            style={[styles.cartBtn, { marginRight: 10, backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
          >
            <ShoppingCart color={activeColors.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            accessible
            accessibilityRole="button"
            accessibilityLabel="Cài đặt"
            style={[styles.cartBtn, { padding: 8, backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 12 }]}
            onPress={() => navigation.navigate('CustomerHome', { screen: 'Profile', params: { openSettings: true } })}
          >
            <Settings color={activeColors.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}>
        <View style={styles.resultsCount}>
          <Text style={[styles.countText, { color: activeColors.subtext }]}>Tìm thấy {filteredProducts.length} sản phẩm</Text>
          <TouchableOpacity
            accessible
            accessibilityRole="button"
            accessibilityLabel="Lọc sản phẩm"
            style={[styles.filterBtn, { backgroundColor: activeColors.isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)' }]}
          >
            <Filter color={activeColors.primary} size={18} />
            <Text style={[styles.filterText, { color: activeColors.primary }]}>Lọc thêm</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {filteredProducts.map((item, index) => (
            <Animated.View 
              key={item.id} 
              entering={FadeInDown.duration(600).delay(index * 100)}
              style={styles.cardWrapper}
            >
              <ScalePress
                accessibilityRole="button"
                accessible
                accessibilityLabel={`Mở chi tiết ${item.name}`}
                onPress={() => navigation.navigate('VehicleDetail', { motor: item })}
                style={[
                  styles.productItemOpen,
                  {
                    backgroundColor: activeColors.card,
                    // borderRadius: 12,
                    // borderWidth: 1,
                    // borderColor: activeColors.border,
                    overflow: 'hidden',
                    padding: 8
                  }
                ]}
              >
                <Image
                  accessible
                  accessibilityLabel={`Hình ${item.name}`}
                  source={item.img ? (typeof item.img === 'string' ? { uri: item.img } : item.img) : { uri: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070' }}
                  style={[styles.productImageOpen, { borderRadius: 8 }]}
                  resizeMode="cover"
                />
                <View style={styles.productInfoOpen}>
                  <Text style={[styles.productNameOpen, { color: activeColors.text }]} numberOfLines={2}>{item.name}</Text>
                  <Text style={[styles.productPriceOpen, { color: activeColors.primary }]}>{item.price || 'Liên hệ'}</Text>
                </View>
              </ScalePress>
            </Animated.View>
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: activeColors.subtext }]}>Chưa có sản phẩm nào cho mục này.</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
