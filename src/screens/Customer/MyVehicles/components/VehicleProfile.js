import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { QrCode, Copy } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Theme } from '../../../../theme/Theme';
import { copyToClipboard } from '../../../../utils/bikeHelpers';
import { styles } from '../styles';

export const VehicleProfile = ({ bike, onShowQR }) => (
  <Animated.View entering={FadeInDown.delay(200)} style={styles.profileSection}>
    <View style={styles.bikeHeader}>
      <View style={styles.bikeInfo}>
        <Text style={styles.bikeName}>{bike.name}</Text>
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
        <TouchableOpacity onPress={onShowQR} style={styles.qrBadge}>
          <QrCode color="#fff" size={12} />
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.detailGrid}>
      <View style={styles.detailRow}>
        <TouchableOpacity style={styles.detailItem} onPress={() => copyToClipboard(bike.vin, 'số khung')}>
          <Text style={styles.detailLabel}>Số khung</Text>
          <View style={styles.detailValueRow}>
            <Text style={styles.detailValue}>{bike.vin}</Text>
            <Copy color={Theme.colors.subtext} size={10} style={{ marginLeft: 4 }} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.detailItem, { marginLeft: 20 }]} onPress={() => copyToClipboard(bike.engine, 'số máy')}>
          <Text style={styles.detailLabel}>Số máy</Text>
          <View style={styles.detailValueRow}>
            <Text style={styles.detailValue}>{bike.engine}</Text>
            <Copy color={Theme.colors.subtext} size={10} style={{ marginLeft: 4 }} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.detailDivider} />

      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Màu sắc</Text>
          <Text style={styles.detailValue}>{bike.color}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Loại xe</Text>
          <Text style={styles.detailValue}>{bike.type}</Text>
        </View>
      </View>

      <View style={styles.detailDivider} />

      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Đăng ký lần đầu</Text>
          <Text style={styles.detailValue}>{bike.regDate}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Phiên bản</Text>
          <Text style={styles.detailValue}>{bike.version}</Text>
        </View>
      </View>
    </View>
  </Animated.View>
);
