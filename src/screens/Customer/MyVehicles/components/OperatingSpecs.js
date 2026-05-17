import React from 'react';
import { View, Text } from 'react-native';
import { History, AlertCircle } from 'lucide-react-native';
import { Theme } from '../../../../theme/Theme';
import { styles } from '../styles';

export const OperatingSpecs = ({ specs }) => (
  <View style={styles.openSection}>
    <Text style={styles.sectionTitle}>Thông số vận hành ⚙️</Text>
    <View style={styles.specList}>
      <View style={styles.specItem}>
        <View style={styles.specIcon}>
          <History color={Theme.colors.primary} size={18} />
        </View>
        <View style={styles.specInfo}>
          <Text style={styles.specLabel}>Loại nhớt khuyến nghị</Text>
          <Text style={styles.specValue}>{specs.oil}</Text>
        </View>
      </View>
      <View style={styles.specItem}>
        <View style={styles.specIcon}>
          <AlertCircle color={Theme.colors.primary} size={18} />
        </View>
        <View style={styles.specInfo}>
          <Text style={styles.specLabel}>Áp suất lốp tiêu chuẩn</Text>
          <Text style={styles.specValue}>{specs.tirePressure}</Text>
        </View>
      </View>
    </View>
  </View>
);
