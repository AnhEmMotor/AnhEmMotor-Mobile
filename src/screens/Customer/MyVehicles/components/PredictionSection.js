import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Wrench } from 'lucide-react-native';
import { useActiveColors } from '../../../../theme/Theme';
import { styles } from '../styles';

const safeItems = (prediction) => {
  const items = prediction?.items;
  return Array.isArray(items) && items.length > 0 ? items.join(', ') : 'Chưa có dữ liệu';
};

export const PredictionSection = ({ prediction }) => {
  const activeColors = useActiveColors();

  return (
    <View style={styles.openSection}>
      <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Dự báo bảo dưỡng 🔮</Text>
      <View style={styles.predictionRow}>
        <View style={styles.predictionHighlight}>
          <Wrench color={activeColors.primary} size={24} />
          <View style={styles.predictionMeta}>
            <Text style={[styles.predictionTarget, { color: activeColors.text }]}>
              Mốc {prediction?.odo ?? '—'}
            </Text>
            <Text style={[styles.predictionDate, { color: activeColors.primary }]}>
              Trước {prediction?.date ?? '—'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bookNowBtnOpen}>
          <Text style={styles.bookNowText}>Đặt lịch</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.predictionBodyOpen, { backgroundColor: activeColors.card }]}>
        <Text style={[styles.predictionLabel, { color: activeColors.text }]}>
          Hạng mục: {safeItems(prediction)}
        </Text>
      </View>
    </View>
  );
};
