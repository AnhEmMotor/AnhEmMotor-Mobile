import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { QrCode, Copy } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Theme, useActiveColors } from '../../../../theme/Theme';
import { copyToClipboard } from '../../../../utils/bikeHelpers';
import { styles } from '../styles';

export const VehicleProfile = ({ bike, onShowQR, onPress }) => {
  const activeColors = useActiveColors();

  return (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.profileSection}>
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.85} 
        style={styles.bikeHeader}
      >
        <View style={styles.bikeInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.bikeName, { color: activeColors.text }]}>{bike.name}</Text>
            <Text style={{ fontSize: 14, color: activeColors.primary, marginLeft: 6 }}>➔</Text>
          </View>
          <Text style={styles.bikePlate}>{bike.plate}</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{bike.status}</Text>
          </View>
        </View>
        <View style={styles.bikeImageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1620939511593-299312d1666c?q=80&w=2070' }} 
            style={styles.bikeThumb} 
            resizeMode="cover"
          />
          <TouchableOpacity onPress={onShowQR} style={[styles.qrBadge, { borderColor: activeColors.background }]}>
            <QrCode color="#fff" size={12} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <View style={[styles.detailGrid, { borderTopColor: activeColors.border }]}>
        <View style={styles.detailRow}>
          <TouchableOpacity style={styles.detailItem} onPress={() => copyToClipboard(bike.vin, 'số khung')}>
            <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Số khung</Text>
            <View style={styles.detailValueRow}>
              <Text style={[styles.detailValue, { color: activeColors.text }]}>{bike.vin}</Text>
              <Copy color={activeColors.subtext} size={10} style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.detailItem, { marginLeft: 20 }]} onPress={() => copyToClipboard(bike.engine, 'số máy')}>
            <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Số máy</Text>
            <View style={styles.detailValueRow}>
              <Text style={[styles.detailValue, { color: activeColors.text }]}>{bike.engine}</Text>
              <Copy color={activeColors.subtext} size={10} style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.detailDivider, { backgroundColor: activeColors.border }]} />

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Màu sắc</Text>
            <Text style={[styles.detailValue, { color: activeColors.text }]}>{bike.color}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Loại xe</Text>
            <Text style={[styles.detailValue, { color: activeColors.text }]}>{bike.type}</Text>
          </View>
        </View>

        <View style={[styles.detailDivider, { backgroundColor: activeColors.border }]} />

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Đăng ký lần đầu</Text>
            <Text style={[styles.detailValue, { color: activeColors.text }]}>{bike.regDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: activeColors.subtext }]}>Phiên bản</Text>
            <Text style={[styles.detailValue, { color: activeColors.text }]}>{bike.version}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
