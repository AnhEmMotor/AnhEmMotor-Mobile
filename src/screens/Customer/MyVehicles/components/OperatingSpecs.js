import React from 'react';
import { View, Text } from 'react-native';
import { History, AlertCircle } from 'lucide-react-native';
import { Theme, useActiveColors } from '../../../../theme/Theme';
import { styles } from '../styles';

export const OperatingSpecs = ({ specs }) => {
  const activeColors = useActiveColors();

  return (
    <View style={styles.openSection}>
      <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Thông số vận hành ⚙️</Text>
      <View style={styles.specList}>
        <View style={styles.specItem}>
          <View style={[styles.specIcon, { backgroundColor: activeColors.isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' }]}>
            <History color={activeColors.primary} size={18} />
          </View>
          <View style={styles.specInfo}>
            <Text style={[styles.specLabel, { color: activeColors.subtext }]}>Loại nhớt khuyến nghị</Text>
            <Text style={[styles.specValue, { color: activeColors.text }]}>{specs.oil}</Text>
          </View>
        </View>
        <View style={styles.specItem}>
          <View style={[styles.specIcon, { backgroundColor: activeColors.isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' }]}>
            <AlertCircle color={activeColors.primary} size={18} />
          </View>
          <View style={styles.specInfo}>
            <Text style={[styles.specLabel, { color: activeColors.subtext }]}>Áp suất lốp tiêu chuẩn</Text>
            <Text style={[styles.specValue, { color: activeColors.text }]}>{specs.tirePressure}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
