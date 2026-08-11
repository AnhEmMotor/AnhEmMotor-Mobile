import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActiveColors } from '../../theme/Theme';
import { ArrowLeft, MapPin, Phone, User, CreditCard } from 'lucide-react-native';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/stringHelpers';
import { createSalesOrderApi } from '../../api/orderApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CheckoutScreen({ navigation }) {
  const activeColors = useActiveColors();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('@AEM_Customer_Profile');
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setFormData({
            ...formData,
            name: profile.name || profile.fullName || '',
            phone: profile.phone || profile.phoneNumber || '',
            address: profile.address || profile.specificAddress || '',
          });
        }
      } catch (e) {}
    };
    loadProfile();
  }, []);

  const handleCheckout = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin giao hàng.');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Lỗi', 'Giỏ hàng trống.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        CustomerName: formData.name,
        CustomerPhone: formData.phone,
        CustomerAddress: formData.address,
        Notes: formData.notes,
        PaymentMethod: 'COD', // Default to COD for now
        ProvinceId: null, // Depending on the actual data structure
        WardCode: null,
        products: cartItems.map(item => ({
          ProductVariantId: item.variantId || null,
          ProductVariantColorId: item.colorId || null,
          Count: item.quantity
        }))
      };

      await createSalesOrderApi(payload);
      
      clearCart();
      navigation.reset({
        index: 1,
        routes: [{ name: 'CustomerHome' }, { name: 'OrderSuccess' }],
      });
    } catch (error) {
      Alert.alert('Thất bại', error.message || 'Có lỗi xảy ra khi đặt hàng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: activeColors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color={activeColors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Thông tin giao hàng</Text>
        <View style={[styles.card, { backgroundColor: activeColors.card }]}>
          <View style={styles.inputGroup}>
            <User color={activeColors.subtext} size={20} />
            <TextInput
              style={[styles.input, { color: activeColors.text }]}
              placeholder="Họ và tên"
              placeholderTextColor={activeColors.subtext}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>
          <View style={[styles.inputGroup, { borderTopWidth: 1, borderTopColor: activeColors.border }]}>
            <Phone color={activeColors.subtext} size={20} />
            <TextInput
              style={[styles.input, { color: activeColors.text }]}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              placeholderTextColor={activeColors.subtext}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
          </View>
          <View style={[styles.inputGroup, { borderTopWidth: 1, borderTopColor: activeColors.border }]}>
            <MapPin color={activeColors.subtext} size={20} />
            <TextInput
              style={[styles.input, { color: activeColors.text }]}
              placeholder="Địa chỉ giao hàng"
              placeholderTextColor={activeColors.subtext}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Ghi chú đơn hàng (Tùy chọn)</Text>
        <View style={[styles.card, { backgroundColor: activeColors.card }]}>
          <TextInput
            style={[styles.textArea, { color: activeColors.text }]}
            placeholder="Nhập ghi chú cho người bán..."
            placeholderTextColor={activeColors.subtext}
            multiline
            numberOfLines={4}
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Phương thức thanh toán</Text>
        <View style={[styles.card, { backgroundColor: activeColors.card }]}>
          <View style={styles.paymentMethod}>
            <CreditCard color={activeColors.primary} size={24} />
            <Text style={[styles.paymentMethodText, { color: activeColors.text }]}>
              Thanh toán khi nhận hàng (COD)
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Tóm tắt đơn hàng</Text>
        <View style={[styles.card, { backgroundColor: activeColors.card }]}>
          {cartItems.map((item, index) => (
            <View key={item.id} style={[styles.summaryItem, index > 0 && { borderTopWidth: 1, borderTopColor: activeColors.border }]}>
              <Text style={[styles.summaryItemName, { color: activeColors.text }]} numberOfLines={1}>
                {item.quantity}x {item.name}
              </Text>
              <Text style={[styles.summaryItemPrice, { color: activeColors.text }]}>
                {formatCurrency(item.price * item.quantity)} đ
              </Text>
            </View>
          ))}
          <View style={[styles.summaryTotal, { borderTopWidth: 1, borderTopColor: activeColors.border }]}>
            <Text style={[styles.summaryTotalLabel, { color: activeColors.text }]}>Tổng thanh toán:</Text>
            <Text style={[styles.summaryTotalPrice, { color: activeColors.primary }]}>
              {formatCurrency(getCartTotal())} đ
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: activeColors.card, borderTopColor: activeColors.border }]}>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: activeColors.primary }, loading && { opacity: 0.7 }]}
          onPress={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>Đặt hàng</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
  },
  textArea: {
    padding: 16,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  paymentMethodText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  summaryItemName: {
    flex: 1,
    fontSize: 14,
    marginRight: 16,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryTotalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  submitBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
