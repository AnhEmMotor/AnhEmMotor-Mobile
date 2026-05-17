import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, Clock } from 'lucide-react-native';
import { Theme, useActiveColors } from '../../../../theme/Theme';
import { styles } from '../styles';

export const TimelineItem = ({ item, isLast }) => {
  const activeColors = useActiveColors();

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, { backgroundColor: activeColors.primary }]} />
        {!isLast && <View style={[styles.timelineLine, { backgroundColor: activeColors.border }]} />}
      </View>
      <View style={styles.timelineRight}>
        <View style={[styles.timelineCardOpen, { backgroundColor: activeColors.card }]}>
          <View style={styles.timelineHeader}>
            <Text style={[styles.timelineDate, { color: activeColors.text }]}>{item.date}</Text>
            <View style={styles.timelineActions}>
              <Text style={[styles.timelineType, { color: activeColors.primary }]}>{item.type}</Text>
              <ChevronRight color={activeColors.primary} size={14} />
            </View>
          </View>
          <Text style={[styles.timelineDesc, { color: activeColors.subtext }]}>{item.desc}</Text>
          <View style={[styles.timelineFooter, { borderTopColor: activeColors.border }]}>
            <View style={[styles.timelineTag, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)' }]}>
              <Clock size={12} color={activeColors.subtext} />
              <Text style={[styles.timelineTagText, { color: activeColors.subtext }]}>{item.km}</Text>
            </View>
            <View style={styles.timelineRightInfo}>
              <Text style={[styles.timelinePrice, { color: activeColors.text }]}>{item.price}</Text>
              <TouchableOpacity style={styles.invoiceBtn}>
                <Text style={[styles.invoiceText, { color: activeColors.primary }]}>Xem hóa đơn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
