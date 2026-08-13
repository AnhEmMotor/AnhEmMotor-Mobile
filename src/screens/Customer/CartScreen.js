import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActiveColors } from '../../theme/Theme';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react-native';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/stringHelpers';

export default function CartScreen({ navigation }) {
  const activeColors = useActiveColors();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const renderItem = ({ item }) => (
    <View style={[styles.cartItem, { backgroundColor: activeColors.card }]}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: activeColors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        {item.colorName ? (
          <Text style={[styles.itemVariant, { color: activeColors.subtext }]}>
            Màu: {item.colorName}
          </Text>
        ) : null}
        <Text style={[styles.itemPrice, { color: activeColors.primary }]}>
          {formatCurrency(item.price)} đ
        </Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={[styles.qtyBtn, { backgroundColor: activeColors.background }]}
            onPress={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
          >
            <Minus size={16} color={activeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.qtyText, { color: activeColors.text }]}>{item.quantity}</Text>
          <TouchableOpacity
            style={[styles.qtyBtn, { backgroundColor: activeColors.background }]}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus size={16} color={activeColors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => removeFromCart(item.id)}
          >
            <Trash2 size={20} color="#E31B23" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: activeColors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color={activeColors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Giỏ hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: activeColors.subtext }]}>Giỏ hàng trống</Text>
          <TouchableOpacity
            style={[styles.btnShopping, { backgroundColor: activeColors.primary }]}
            onPress={() => navigation.navigate('CustomerHome', { screen: 'Catalog' })}
          >
            <Text style={styles.btnShoppingText}>Tiếp tục mua sắm</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
          <View style={[styles.footer, { backgroundColor: activeColors.card, borderTopColor: activeColors.border }]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: activeColors.text }]}>Tổng tiền:</Text>
              <Text style={[styles.totalPrice, { color: activeColors.primary }]}>
                {formatCurrency(getCartTotal())} đ
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.checkoutBtn, { backgroundColor: activeColors.primary }]}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutBtnText}>Tiến hành thanh toán</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
  },
  btnShopping: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnShoppingText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemVariant: {
    fontSize: 12,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    padding: 6,
    borderRadius: 4,
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  deleteBtn: {
    marginLeft: 'auto',
    padding: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
