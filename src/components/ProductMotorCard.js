import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ScalePress from './ScalePress';
import GlassCard from './GlassCard';
import { useActiveColors } from '../theme/Theme';
import { moderateScale } from '../utils/responsive';

export default function ProductMotorCard({ motor, onPress }) {
  const activeColors = useActiveColors();
  const name = motor.name || motor.productName || 'San pham';
  const price = motor.price || 'Lien he';
  const brand = motor.brandName || '';
  const type = motor.typeName || '';
  const img = motor.img || motor.imageUrl || '';

  return (
    <ScalePress onPress={onPress}>
      <GlassCard contentStyle={styles.content}>
        {img ? (
          <Image source={{ uri: img }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: activeColors.background }]}>
            <Text style={{ color: activeColors.subtext, fontSize: moderateScale(12) }}>Khong co anh</Text>
          </View>
        )}
        <Text style={[styles.name, { color: activeColors.text }]} numberOfLines={2}>{name}</Text>
        <View style={styles.metaRow}>
          {brand ? <Text style={[styles.meta, { color: activeColors.subtext }]}>{brand}</Text> : null}
          {brand && type ? <Text style={[styles.dot, { color: activeColors.border }]}> | </Text> : null}
          {type ? <Text style={[styles.meta, { color: activeColors.subtext }]}>{type}</Text> : null}
        </View>
        <Text style={[styles.price, { color: activeColors.primary }]}>{price}</Text>
      </GlassCard>
    </ScalePress>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: moderateScale(10),
  },
  image: {
    width: '100%',
    height: moderateScale(120),
    borderRadius: 8,
    marginBottom: moderateScale(8),
    backgroundColor: 'transparent',
  },
  imagePlaceholder: {
    width: '100%',
    height: moderateScale(120),
    borderRadius: 8,
    marginBottom: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    marginBottom: moderateScale(4),
    lineHeight: moderateScale(18),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(6),
  },
  meta: {
    fontSize: moderateScale(11),
  },
  dot: {
    fontSize: moderateScale(11),
  },
  price: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
});
