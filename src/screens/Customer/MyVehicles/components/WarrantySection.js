import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { Theme } from '../../../../theme/Theme';
import { calculateWarrantyDays, formatDate } from '../../../../utils/bikeHelpers';
import { styles } from '../styles';

export const WarrantySection = ({ bike }) => (
  <View style={styles.openSection}>
    <Text style={styles.sectionTitle}>Bảo hành & Bảo hiểm 🛡️</Text>
    <View style={styles.warrantyMain}>
      <View>
        <Text style={styles.warrantyLabel}>Bảo hành còn lại</Text>
        <Text style={styles.warrantyDays}>{calculateWarrantyDays(bike.warrantyUntil)} <Text style={styles.daysUnit}>ngày</Text></Text>
      </View>
      <ShieldCheck color={Theme.colors.success} size={40} opacity={0.6} />
    </View>
    
    <View style={styles.warrantyPeriod}>
      <View style={styles.periodItem}>
        <Text style={styles.periodLabel}>Từ ngày</Text>
        <Text style={styles.periodValue}>{formatDate(bike.warrantyFrom)}</Text>
      </View>
      <View style={styles.periodDivider} />
      <View style={styles.periodItem}>
        <Text style={styles.periodLabel}>Đến ngày</Text>
        <Text style={styles.periodValue}>{formatDate(bike.warrantyUntil)}</Text>
      </View>
    </View>

    <View style={styles.insuranceSection}>
      <View style={styles.insuranceHeader}>
        <View>
          <Text style={styles.insuranceLabel}>Bảo hiểm dân sự bắt buộc</Text>
          <Text style={styles.insuranceStatus}>
            Còn hạn đến {formatDate(bike.insuranceUntil)}
          </Text>
        </View>
        <ShieldCheck color={Theme.colors.success} size={20} />
      </View>
      <TouchableOpacity style={styles.buyInsuranceBtn}>
        <Text style={styles.buyInsuranceText}>Gia hạn ngay</Text>
      </TouchableOpacity>
    </View>
  </View>
);
