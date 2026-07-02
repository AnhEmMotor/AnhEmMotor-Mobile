import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { Theme, useActiveColors } from '../../../../theme/Theme';
import { calculateWarrantyDays, formatDate } from '../../../../utils/bikeHelpers';
import { styles } from '../styles';

export const WarrantySection = ({ bike }) => {
  const activeColors = useActiveColors();

  return (
    <View style={styles.openSection}>
      <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Bảo hành & Bảo hiểm 🛡️</Text>
      <View style={styles.warrantyMain}>
        <View>
          <Text style={[styles.warrantyLabel, { color: activeColors.subtext }]}>Bảo hành còn lại</Text>
          <Text style={[styles.warrantyDays, { color: activeColors.text }]}>{calculateWarrantyDays(bike.warrantyUntil)} <Text style={[styles.daysUnit, { color: activeColors.subtext }]}>ngày</Text></Text>
        </View>
        <ShieldCheck color={activeColors.success} size={40} opacity={0.6} />
      </View>
      
      <View style={[styles.warrantyPeriod, { backgroundColor: activeColors.card }]}>
        <View style={styles.periodItem}>
          <Text style={[styles.periodLabel, { color: activeColors.subtext }]}>Từ ngày</Text>
          <Text style={[styles.periodValue, { color: activeColors.text }]}>{formatDate(bike.warrantyFrom)}</Text>
        </View>
        <View style={[styles.periodDivider, { backgroundColor: activeColors.border }]} />
        <View style={styles.periodItem}>
          <Text style={[styles.periodLabel, { color: activeColors.subtext }]}>Đến ngày</Text>
          <Text style={[styles.periodValue, { color: activeColors.text }]}>{formatDate(bike.warrantyUntil)}</Text>
        </View>
      </View>

      <View style={[styles.insuranceSection, { backgroundColor: activeColors.card }]}>
        <View style={styles.insuranceHeader}>
          <View>
            <Text style={[styles.insuranceLabel, { color: activeColors.subtext }]}>Bảo hiểm dân sự bắt buộc</Text>
            <Text style={[styles.insuranceStatus, { color: activeColors.text }]}>
              Còn hạn đến {formatDate(bike.insuranceUntil)}
            </Text>
          </View>
          <ShieldCheck color={activeColors.success} size={20} />
        </View>
        <TouchableOpacity style={styles.buyInsuranceBtn}>
          <Text style={styles.buyInsuranceText}>Gia hạn ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
