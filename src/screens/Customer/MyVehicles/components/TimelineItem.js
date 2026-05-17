import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, Clock } from 'lucide-react-native';
import { Theme } from '../../../../theme/Theme';
import { styles } from '../styles';

export const TimelineItem = ({ item, isLast }) => (
  <View style={styles.timelineItem}>
    <View style={styles.timelineLeft}>
      <View style={styles.timelineDot} />
      {!isLast && <View style={styles.timelineLine} />}
    </View>
    <View style={styles.timelineRight}>
      <View style={styles.timelineCardOpen}>
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineDate}>{item.date}</Text>
          <View style={styles.timelineActions}>
            <Text style={styles.timelineType}>{item.type}</Text>
            <ChevronRight color={Theme.colors.primary} size={14} />
          </View>
        </View>
        <Text style={styles.timelineDesc}>{item.desc}</Text>
        <View style={styles.timelineFooter}>
          <View style={styles.timelineTag}>
            <Clock size={12} color={Theme.colors.subtext} />
            <Text style={styles.timelineTagText}>{item.km}</Text>
          </View>
          <View style={styles.timelineRightInfo}>
            <Text style={styles.timelinePrice}>{item.price}</Text>
            <TouchableOpacity style={styles.invoiceBtn}>
              <Text style={styles.invoiceText}>Xem hóa đơn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  </View>
);
