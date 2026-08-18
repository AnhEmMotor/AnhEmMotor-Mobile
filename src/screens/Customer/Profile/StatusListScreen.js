import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useActiveColors } from '../../../theme/Theme';
import { ChevronLeft, Package, Wrench } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import GlassCard from '../../../components/GlassCard';
import { moderateScale, verticalScale } from '../../../utils/responsive';

export default function StatusListScreen({ navigation, route }) {
  const { title, items, type } = route.params || { title: 'Danh sách', items: [], type: 'outputs' };
  const activeColors = useActiveColors();
  const isDark = activeColors.isDark;

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={activeColors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>
          {title}
        </Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: activeColors.subtext }]}>Không có dữ liệu.</Text>
          </View>
        ) : (
          items.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInDown.delay(index * 100)}>
              <GlassCard style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    {type === 'repairs' ? <Wrench color={activeColors.primary} size={20} /> : <Package color={activeColors.primary} size={20} />}
                  </View>
                  <Text style={[styles.cardId, { color: activeColors.text }]}>
                    #{item.id}
                  </Text>
                  <Text style={[styles.cardDate, { color: activeColors.subtext }]}>
                    {new Date(item.createdAt || item.date).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
                
                {type === 'outputs' ? (
                  <View style={styles.productContainer}>
                    {item.productImage ? (
                      <Image source={{ uri: item.productImage }} style={styles.productImage} resizeMode="cover" />
                    ) : (
                      <View style={[styles.productImagePlaceholder, { backgroundColor: activeColors.border }]}>
                        <Package color={activeColors.subtext} size={24} />
                      </View>
                    )}
                    <View style={styles.productInfo}>
                      <Text style={[styles.productName, { color: activeColors.text }]} numberOfLines={2}>
                        {item.productName || 'Đơn hàng mua sắm'}
                      </Text>
                      
                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Số lượng:</Text>
                        <Text style={[styles.detailValue, { color: activeColors.text }]}>{item.quantity || 1}</Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Thanh toán:</Text>
                        <Text style={[styles.detailValue, { color: activeColors.text }]}>{item.paymentMethod || 'N/A'}</Text>
                      </View>
                      
                      {item.expectedDeliveryDate && (
                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Dự kiến giao:</Text>
                          <Text style={[styles.detailValue, { color: '#10B981', fontWeight: '600' }]}>
                            {new Date(item.expectedDeliveryDate).toLocaleDateString('vi-VN')}
                          </Text>
                        </View>
                      )}
                      
                      <View style={[styles.detailRow, { marginTop: 6 }]}>
                        <Text style={[styles.detailLabel, { color: activeColors.text, fontWeight: '600' }]}>Thành tiền:</Text>
                        <Text style={[styles.cardTotal, { color: activeColors.primary }]}>
                          {item.total?.toLocaleString()}đ
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.productContainer}>
                    {item.productImage ? (
                      <Image source={{ uri: item.productImage }} style={styles.productImage} resizeMode="cover" />
                    ) : (
                      <View style={[styles.productImagePlaceholder, { backgroundColor: activeColors.border }]}>
                        <Wrench color={activeColors.subtext} size={24} />
                      </View>
                    )}
                    <View style={styles.productInfo}>
                      <Text style={[styles.productName, { color: activeColors.text }]} numberOfLines={2}>
                        {item.vehicleName || item.vehicleInfo || 'Xe bảo dưỡng'}
                      </Text>
                      
                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Mã phiếu:</Text>
                        <Text style={[styles.detailValue, { color: activeColors.text }]}>{item.maintenanceNumber || `#${item.id}`}</Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Dịch vụ:</Text>
                        <Text style={[styles.detailValue, { color: activeColors.text }]}>{item.serviceType || 'Bảo dưỡng định kỳ'}</Text>
                      </View>

                      {item.categoryName && (
                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Loại xe:</Text>
                          <Text style={[styles.detailValue, { color: activeColors.text }]}>{item.categoryName}</Text>
                        </View>
                      )}

                      {item.variantName && (
                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Phiên bản:</Text>
                          <Text style={[styles.detailValue, { color: activeColors.text }]}>{item.variantName}</Text>
                        </View>
                      )}

                      {item.colorName && (
                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Màu sắc:</Text>
                          <Text style={[styles.detailValue, { color: activeColors.text }]}>{item.colorName}</Text>
                        </View>
                      )}

                      {item.vinNumber && (
                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Số VIN:</Text>
                          <Text style={[styles.detailValue, { color: activeColors.text }]}>{item.vinNumber}</Text>
                        </View>
                      )}
                      
                      {item.expectedCompletionDate && (
                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Hoàn thành (dự kiến):</Text>
                          <Text style={[styles.detailValue, { color: '#10B981', fontWeight: '600' }]}>
                            {new Date(item.expectedCompletionDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(item.expectedCompletionDate).toLocaleDateString('vi-VN')}
                          </Text>
                        </View>
                      )}
                      
                      <View style={[styles.detailRow, { marginTop: 6 }]}>
                        <Text style={[styles.detailLabel, { color: activeColors.text, fontWeight: '600' }]}>Tổng chi phí:</Text>
                        <Text style={[styles.cardTotal, { color: activeColors.primary }]}>
                          {item.totalCost?.toLocaleString() || 0}đ
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </GlassCard>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardId: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  cardDate: {
    fontSize: 14,
  },
  cardBody: {
    paddingLeft: 48,
  },
  cardTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDesc: {
    fontSize: 14,
  },
  productContainer: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  productImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
  },
});
