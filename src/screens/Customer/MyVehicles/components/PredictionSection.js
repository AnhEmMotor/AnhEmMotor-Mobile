import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Wrench } from 'lucide-react-native';
import { Theme } from '../../../../theme/Theme';
import { styles } from '../styles';

export const PredictionSection = ({ prediction }) => (
  <View style={styles.openSection}>
    <Text style={styles.sectionTitle}>Dự báo bảo dưỡng 🔮</Text>
    <View style={styles.predictionRow}>
      <View style={styles.predictionHighlight}>
        <Wrench color={Theme.colors.primary} size={24} />
        <View style={styles.predictionMeta}>
          <Text style={styles.predictionTarget}>Mốc {prediction.odo}</Text>
          <Text style={styles.predictionDate}>Trước {prediction.date}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookNowBtnOpen}>
        <Text style={styles.bookNowText}>Đặt lịch</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.predictionBodyOpen}>
      <Text style={styles.predictionLabel}>Hạng mục: {prediction.items.join(', ')}</Text>
    </View>
  </View>
);
