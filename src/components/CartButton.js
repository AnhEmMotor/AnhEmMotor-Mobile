import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import { useActiveColors } from '../theme/Theme';
import { moderateScale } from '../utils/responsive';

export default function CartButton({ onPress, iconSize = moderateScale(20), style }) {
  const activeColors = useActiveColors();
  const { getCartCount } = useCart();
  const count = getCartCount();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <ShoppingCart color={activeColors.text} size={iconSize} />
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: activeColors.primary }]}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 6,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
