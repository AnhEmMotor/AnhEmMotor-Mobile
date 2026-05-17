import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Filter, ShoppingCart } from 'lucide-react-native';
import { Theme } from '../../../theme/Theme';
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{type !== 'Tất cả' ? type : 'Sản phẩm'}</Text>
          <Text style={styles.headerSubtitle}>{brand !== 'Tất cả' ? brand : 'Tất cả thương hiệu'}</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn}>
          <ShoppingCart color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultsCount}>
          <Text style={styles.countText}>Tìm thấy {filteredProducts.length} sản phẩm</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter color={Theme.colors.primary} size={18} />
            <Text style={styles.filterText}>Lọc thêm</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {filteredProducts.map((item, index) => (
            <Animated.View 
              key={item.id} 
              entering={FadeInDown.duration(600).delay(index * 100)}
              style={styles.cardWrapper}
            >
              <ScalePress onPress={() => navigation.navigate('VehicleDetail', { motor: item })} style={styles.productItemOpen}>
                <Image 
                  source={item.img ? (typeof item.img === 'string' ? { uri: item.img } : item.img) : { uri: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070' }} 
                  style={styles.productImageOpen} 
                />
                <View style={styles.productInfoOpen}>
                  <Text style={styles.productNameOpen} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.productPriceOpen}>{item.price || 'Liên hệ'}</Text>
                </View>
              </ScalePress>
            </Animated.View>
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có sản phẩm nào cho mục này.</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
