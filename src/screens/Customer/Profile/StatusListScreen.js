import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useActiveColors } from '../../../theme/Theme';
import { ChevronLeft, Package, Wrench } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import GlassCard from '../../../components/GlassCard';
import { moderateScale } from '../../../utils/responsive';
import { getPersonalOutputDetailApi } from '../../../api/orderApi';
import { resolveMediaUrl } from '../../../utils/imageHelpers';

const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

const getField = (item, camelCase, pascalCase) => item?.[camelCase] ?? item?.[pascalCase];

export default function StatusListScreen({ navigation, route }) {
  const { title, items, type } = route.params || { title: 'Danh sách', items: [], type: 'outputs' };
  const activeColors = useActiveColors();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (type !== 'outputs' || !items.length) return;
    let cancelled = false;
    Promise.all(
      items.map(async (item) => {
        try {
          return [item.id, await getPersonalOutputDetailApi(item.id)];
        } catch (_error) {
          return null;
        }
      })
    ).then((results) => {
      if (!cancelled) {
        setOrderDetails((current) => ({
          ...current,
          ...Object.fromEntries(results.filter(Boolean)),
        }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [items, type]);

  const handleOpenDetail = async (item) => {
    setDetailLoading(true);
    try {
      const detail = orderDetails[item.id] || (await getPersonalOutputDetailApi(item.id));
      setSelectedOrder({ ...detail, expectedDeliveryDate: item.expectedDeliveryDate });
    } catch (error) {
      setSelectedOrder({ error: error.message || 'Không thể tải chi tiết đơn hàng' });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={activeColors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>{title}</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: activeColors.subtext }]}>
              Không có dữ liệu.
            </Text>
          </View>
        ) : (
          items.map((item, index) => {
            const summary = orderDetails[item.id] || item;
            return (
              <Animated.View key={item.id} entering={FadeInDown.delay(index * 100)}>
                <GlassCard style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                      {type === 'repairs' ? (
                        <Wrench color={activeColors.primary} size={20} />
                      ) : (
                        <Package color={activeColors.primary} size={20} />
                      )}
                    </View>
                    <Text style={[styles.cardId, { color: activeColors.text }]}>#{item.id}</Text>
                    <Text style={[styles.cardDate, { color: activeColors.subtext }]}>
                      {new Date(item.createdAt || item.date).toLocaleDateString('vi-VN')}
                    </Text>
                  </View>

                  {type === 'outputs' ? (
                    <View style={styles.productContainer}>
                      {item.productImage ? (
                        <Image
                          source={{ uri: item.productImage }}
                          style={styles.productImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={[
                            styles.productImagePlaceholder,
                            { backgroundColor: activeColors.border },
                          ]}
                        >
                          <Package color={activeColors.subtext} size={24} />
                        </View>
                      )}
                      <View style={styles.productInfo}>
                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>
                            Giá trị đơn hàng:
                          </Text>
                          <Text style={[styles.detailValue, { color: activeColors.text }]}>
                            {formatMoney(getField(summary, 'subtotal', 'Subtotal'))}
                          </Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>
                            Phí vận chuyển:
                          </Text>
                          <Text style={[styles.detailValue, { color: activeColors.text }]}>
                            {formatMoney(getField(summary, 'shippingFee', 'ShippingFee'))}
                          </Text>
                        </View>
                        <View style={[styles.detailRow, { marginTop: 6 }]}>
                          <Text
                            style={[
                              styles.detailLabel,
                              { color: activeColors.text, fontWeight: '600' },
                            ]}
                          >
                            Tổng tiền:
                          </Text>
                          <Text style={[styles.cardTotal, { color: activeColors.primary }]}>
                            {formatMoney(getField(summary, 'total', 'Total'))}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.detailButton, { borderColor: activeColors.primary }]}
                          onPress={() => handleOpenDetail(item)}
                        >
                          <Text style={[styles.detailButtonText, { color: activeColors.primary }]}>
                            Chi tiết
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.productContainer}>
                      {item.productImage ? (
                        <Image
                          source={{ uri: item.productImage }}
                          style={styles.productImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={[
                            styles.productImagePlaceholder,
                            { backgroundColor: activeColors.border },
                          ]}
                        >
                          <Wrench color={activeColors.subtext} size={24} />
                        </View>
                      )}
                      <View style={styles.productInfo}>
                        <Text
                          style={[styles.productName, { color: activeColors.text }]}
                          numberOfLines={2}
                        >
                          {item.vehicleName || item.vehicleInfo || 'Xe bảo dưỡng'}
                        </Text>

                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>
                            Mã phiếu:
                          </Text>
                          <Text style={[styles.detailValue, { color: activeColors.text }]}>
                            {item.maintenanceNumber || `#${item.id}`}
                          </Text>
                        </View>

                        <View style={styles.detailRow}>
                          <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>
                            Dịch vụ:
                          </Text>
                          <Text style={[styles.detailValue, { color: activeColors.text }]}>
                            {item.serviceType || 'Bảo dưỡng định kỳ'}
                          </Text>
                        </View>

                        {item.categoryName && (
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>
                              Loại xe:
                            </Text>
                            <Text style={[styles.detailValue, { color: activeColors.text }]}>
                              {item.categoryName}
                            </Text>
                          </View>
                        )}

                        {item.variantName && (
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>
                              Phiên bản:
                            </Text>
                            <Text style={[styles.detailValue, { color: activeColors.text }]}>
                              {item.variantName}
                            </Text>
                          </View>
                        )}

                        {item.colorName && (
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>
                              Màu sắc:
                            </Text>
                            <Text style={[styles.detailValue, { color: activeColors.text }]}>
                              {item.colorName}
                            </Text>
                          </View>
                        )}

                        {item.vinNumber && (
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>
                              Số VIN:
                            </Text>
                            <Text style={[styles.detailValue, { color: activeColors.text }]}>
                              {item.vinNumber}
                            </Text>
                          </View>
                        )}

                        {item.expectedCompletionDate && (
                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>
                              Hoàn thành (dự kiến):
                            </Text>
                            <Text
                              style={[styles.detailValue, { color: '#10B981', fontWeight: '600' }]}
                            >
                              {new Date(item.expectedCompletionDate).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              - {new Date(item.expectedCompletionDate).toLocaleDateString('vi-VN')}
                            </Text>
                          </View>
                        )}

                        <View style={[styles.detailRow, { marginTop: 6 }]}>
                          <Text
                            style={[
                              styles.detailLabel,
                              { color: activeColors.text, fontWeight: '600' },
                            ]}
                          >
                            Tổng chi phí:
                          </Text>
                          <Text style={[styles.cardTotal, { color: activeColors.primary }]}>
                            {item.totalCost?.toLocaleString() || 0}đ
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </GlassCard>
              </Animated.View>
            );
          })
        )}
      </ScrollView>
      <Modal
        visible={!!selectedOrder || detailLoading}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: activeColors.card }]}>
            {detailLoading ? (
              <ActivityIndicator color={activeColors.primary} size="large" />
            ) : (
              <ScrollView>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: activeColors.text }]}>
                    Chi tiết đơn hàng
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                    <Text style={[styles.closeText, { color: activeColors.primary }]}>Đóng</Text>
                  </TouchableOpacity>
                </View>
                {selectedOrder?.error ? (
                  <Text style={{ color: '#EF4444' }}>{selectedOrder.error}</Text>
                ) : (
                  <>
                    <View style={styles.modalInfo}>
                      <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>
                        Phương thức thanh toán
                      </Text>
                      <Text style={[styles.detailValue, { color: activeColors.text }]}>
                        {getField(selectedOrder, 'paymentMethod', 'PaymentMethod') || 'N/A'}
                      </Text>
                    </View>
                    {selectedOrder?.expectedDeliveryDate && (
                      <View style={styles.modalInfo}>
                        <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>
                          Ngày giao hàng dự kiến
                        </Text>
                        <Text style={[styles.detailValue, { color: '#10B981' }]}>
                          {new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString('vi-VN')}
                        </Text>
                      </View>
                    )}
                    {(getField(selectedOrder, 'products', 'Products') || []).map(
                      (product, index) => {
                        const productName =
                          getField(product, 'productName', 'ProductName') || 'Sản phẩm';
                        const count = getField(product, 'count', 'Count') || 0;
                        const price = getField(product, 'price', 'Price') || 0;
                        return (
                          <View
                            key={getField(product, 'id', 'Id') || index}
                            style={styles.productDetailRow}
                          >
                            <Image
                              source={{
                                uri: resolveMediaUrl(
                                  getField(product, 'coverImageUrl', 'CoverImageUrl')
                                ),
                              }}
                              style={styles.detailImage}
                            />
                            <View style={styles.productDetailInfo}>
                              <Text style={[styles.productName, { color: activeColors.text }]}>
                                {productName}
                              </Text>
                              <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>
                                Số lượng: {count}
                              </Text>
                              <Text style={[styles.detailValue, { color: activeColors.text }]}>
                                {formatMoney(price)} x {count} = {formatMoney(price * count)}
                              </Text>
                            </View>
                          </View>
                        );
                      }
                    )}
                    <View style={styles.modalTotals}>
                      <DetailAmount
                        label="Giá trị đơn hàng"
                        value={getField(selectedOrder, 'subtotal', 'Subtotal')}
                        colors={activeColors}
                      />
                      <DetailAmount
                        label="Phí vận chuyển"
                        value={getField(selectedOrder, 'shippingFee', 'ShippingFee')}
                        colors={activeColors}
                      />
                      <DetailAmount
                        label="Tổng tiền"
                        value={getField(selectedOrder, 'total', 'Total')}
                        colors={activeColors}
                        strong
                      />
                    </View>
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function DetailAmount({ label, value, colors, strong }) {
  return (
    <View style={styles.detailRow}>
      <Text
        style={[styles.detailLabel, { color: colors.text, fontWeight: strong ? '700' : '400' }]}
      >
        {label}:
      </Text>
      <Text style={[styles.cardTotal, { color: strong ? colors.primary : colors.text }]}>
        {formatMoney(value)}
      </Text>
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
  detailButton: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 8,
  },
  detailButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalContent: {
    maxHeight: '88%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productDetailRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
    paddingVertical: 12,
  },
  detailImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  productDetailInfo: {
    flex: 1,
    marginLeft: 12,
  },
  modalTotals: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
    marginTop: 8,
    paddingTop: 12,
  },
});
