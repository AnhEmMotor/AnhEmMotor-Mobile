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
  Settings,
} from 'lucide-react-native';
import { Theme, useActiveColors } from '../../../theme/Theme';
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
  const { activeBike, showQR, openQR, closeQR, handleNavigateToDetail } = useMyVehicles();
  const activeColors = useActiveColors();

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.header, { justifyContent: 'space-between' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
              <ArrowLeft color={activeColors.text} size={24} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.title, { color: activeColors.text }]}>Nhà xe của bạn</Text>
              <Text style={[styles.subtitle, { color: activeColors.subtext }]}>Quản lý thông tin & lịch sử xe</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 12 }} 
            onPress={() => navigation.navigate('Profile', { openSettings: true })}
          >
            <Settings color={activeColors.text} size={24} />
          </TouchableOpacity>
        </View>
        
        <VehicleProfile 
          bike={activeBike} 
          onShowQR={openQR} 
          onPress={() => handleNavigateToDetail(navigation)}
        />
        
        <WarrantySection bike={activeBike} />
        
        <OperatingSpecs specs={activeBike.operatingSpecs} />
        
        <PredictionSection prediction={activeBike.nextService} />

        <View style={styles.openSection}>
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Nhật ký bảo trì 📅</Text>
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
          <Animated.View entering={FadeInDown} style={[styles.modalContent, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            <Text style={[styles.modalTitle, { color: activeColors.text }]}>Mã định danh xe</Text>
            <View style={styles.qrContainer}>
              <QrCode color={activeColors.primary} size={200} strokeWidth={1.5} />
            </View>
            <Text style={[styles.qrDesc, { color: activeColors.subtext }]}>Dùng mã này để check-in nhanh tại các showroom AnhEmMotor</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={closeQR}>
              <Text style={styles.closeBtnText}>Đóng</Text>
            </TouchableOpacity>
          </Animated.View>
        </BlurView>
      </Modal>
    </View>
  );
}
