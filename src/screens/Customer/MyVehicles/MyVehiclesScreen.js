import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  QrCode,
  ArrowLeft,
} from 'lucide-react-native';
import { Theme } from '../../../theme/Theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { styles } from './styles';
import { useMyVehicles } from './useMyVehicles';
import { VehicleProfile } from './components/VehicleProfile';
import { WarrantySection } from './components/WarrantySection';
import { OperatingSpecs } from './components/OperatingSpecs';
import { PredictionSection } from './components/PredictionSection';
import { TimelineItem } from './components/TimelineItem';

/**
 * @file MyVehiclesScreen.js
 * @framework React Native (Clean Architecture - Presentation Layer)
 */
export default function MyVehiclesScreen({ navigation }) {
  const { activeBike, showQR, openQR, closeQR } = useMyVehicles();

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Nhà xe của bạn</Text>
            <Text style={styles.subtitle}>Quản lý thông tin & lịch sử xe</Text>
          </View>
        </View>
        
        <VehicleProfile bike={activeBike} onShowQR={openQR} />
        
        <WarrantySection bike={activeBike} />
        
        <OperatingSpecs specs={activeBike.operatingSpecs} />
        
        <PredictionSection prediction={activeBike.nextService} />

        <View style={styles.openSection}>
          <Text style={styles.sectionTitle}>Nhật ký bảo trì 📅</Text>
          {activeBike.timeline.map((item, idx) => (
            <TimelineItem 
              key={item.id} 
              item={item} 
              isLast={idx === activeBike.timeline.length - 1} 
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* QR MODAL */}
      <Modal visible={showQR} transparent animationType="fade">
        <BlurView intensity={80} tint="dark" style={styles.modalOverlay}>
          <Animated.View entering={FadeInDown} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mã định danh xe</Text>
            <View style={styles.qrContainer}>
              <QrCode color={Theme.colors.primary} size={200} strokeWidth={1.5} />
            </View>
            <Text style={styles.qrDesc}>Dùng mã này để check-in nhanh tại các showroom AnhEmMotor</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={closeQR}>
              <Text style={styles.closeBtnText}>Đóng</Text>
            </TouchableOpacity>
          </Animated.View>
        </BlurView>
      </Modal>
    </View>
  );
}
