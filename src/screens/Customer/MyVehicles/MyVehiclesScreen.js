import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {
  QrCode,
  ArrowLeft,
  Settings,
  Plus,
} from 'lucide-react-native';
import { Theme, useActiveColors } from '../../../theme/Theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { styles } from './styles';
import { useMyVehicles } from './useMyVehicles';
import { useGlobalState } from '../../../context/GlobalState';
import { VehicleProfile } from './components/VehicleProfile';
import { WarrantySection } from './components/WarrantySection';
import { OperatingSpecs } from './components/OperatingSpecs';
import { PredictionSection } from './components/PredictionSection';
import { TimelineItem } from './components/TimelineItem';

/**
 * @file MyVehiclesScreen.js
 * @framework React Native (Clean Architecture - Presentation Layer)
 */
export default function MyVehiclesScreen({ navigation, route }) {
  const {
    bikes,
    activeBike,
    showQR,
    openQR,
    closeQR,
    selectBike,
    addNewVehicle,
    handleNavigateToDetail,
  } = useMyVehicles();

  const activeColors = useActiveColors();
  const { setSettingsOpen } = useGlobalState();

  // Add new vehicle form states
  const [formVisible, setFormVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newVin, setNewVin] = useState('');
  const [newColor, setNewColor] = useState('');

  // Auto-open modal if navigated with openAddModal parameter
  React.useEffect(() => {
    if (route?.params?.openAddModal) {
      setFormVisible(true);
      // Reset navigation parameter so it doesn't trigger repeatedly on subsequent focus
      navigation.setParams({ openAddModal: undefined });
    }
  }, [route?.params?.openAddModal]);

  const handleSubmit = () => {
    if (!newName.trim() || !newPlate.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập Tên xe và Biển số xe.');
      return;
    }
    addNewVehicle({
      name: newName.trim(),
      plate: newPlate.trim(),
      vin: newVin.trim(),
      color: newColor.trim(),
    });
    // Reset form states
    setNewName('');
    setNewPlate('');
    setNewVin('');
    setNewColor('');
    setFormVisible(false);
    Alert.alert('Thành công 🎉', `Đã thêm xe mới "${newName}" vào tài khoản của bạn!`);
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={[styles.header, { justifyContent: 'space-between' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
              <ArrowLeft color={activeColors.text} size={24} />
            </TouchableOpacity>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[styles.title, { color: activeColors.text }]} numberOfLines={1} ellipsizeMode="tail">Nhà xe của bạn</Text>
              <Text style={[styles.subtitle, { color: activeColors.subtext }]} numberOfLines={1} ellipsizeMode="tail">Quản lý thông tin & lịch sử xe</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 12 }} 
            onPress={() => setSettingsOpen(true)}
          >
            <Settings color={activeColors.text} size={24} />
          </TouchableOpacity>
        </View>

        {/* Horizontal Vehicle Switcher & Add Button */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
            {bikes.map((bike) => {
              const isSelected = bike.id === activeBike.id;
              return (
                <TouchableOpacity
                  key={bike.id}
                  onPress={() => selectBike(bike.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor: isSelected 
                      ? activeColors.primary 
                      : (activeColors.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: isSelected 
                      ? activeColors.primary 
                      : (activeColors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                  }}
                >
                  <Text style={{ 
                    color: isSelected ? '#FFFFFF' : activeColors.text, 
                    fontWeight: 'bold', 
                    fontSize: 13 
                  }}>
                    {bike.name} ({bike.plate.split(' ').pop() || bike.plate})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        
        {/* Dynamic Active Bike Profile Card */}
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
          {activeBike.timeline && activeBike.timeline.map((item, idx) => (
            <TimelineItem 
              key={item.id} 
              item={item} 
              isLast={idx === activeBike.timeline.length - 1} 
            />
          ))}
        </View>
 
        {/* Large Add New Vehicle Button at the Bottom */}
        <TouchableOpacity
          onPress={() => setFormVisible(true)}
          style={{
            marginHorizontal: 20,
            marginTop: 25,
            height: 52,
            borderRadius: 14,
            backgroundColor: activeColors.isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.08)',
            borderWidth: 1,
            borderColor: activeColors.isDark ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.15)',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#10B981',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Plus color="#10B981" size={20} style={{ marginRight: 8 }} />
          <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: 15 }}>
            Đăng ký thêm xe mới
          </Text>
        </TouchableOpacity>

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

      {/* DYNAMIC REGISTER NEW VEHICLE MODAL */}
      <Modal visible={formVisible} transparent animationType="slide">
        <BlurView intensity={85} tint="dark" style={styles.modalOverlay}>
          <Animated.View entering={FadeInDown} style={[styles.modalContent, { backgroundColor: activeColors.card, borderColor: activeColors.border, width: '90%', padding: 24 }]}>
            <Text style={[styles.modalTitle, { color: activeColors.text, marginBottom: 4 }]}>Đăng ký xe mới 🏍️</Text>
            <Text style={{ color: activeColors.subtext, fontSize: 13, textAlign: 'center', marginBottom: 20 }}>
              Thêm xe vào hệ thống bảo dưỡng thông minh của AnhEmMotor.
            </Text>

            <View style={{ width: '100%', marginBottom: 15 }}>
              <Text style={{ color: activeColors.text, fontSize: 12, fontWeight: 'bold', marginBottom: 6 }}>Tên xe *</Text>
              <TextInput
                placeholder="Ví dụ: Honda Vario 160"
                placeholderTextColor={activeColors.isDark ? '#6B7280' : '#9CA3AF'}
                value={newName}
                onChangeText={setNewName}
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: activeColors.border,
                  paddingHorizontal: 14,
                  color: activeColors.text,
                  backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                }}
              />
            </View>

            <View style={{ width: '100%', marginBottom: 15 }}>
              <Text style={{ color: activeColors.text, fontSize: 12, fontWeight: 'bold', marginBottom: 6 }}>Biển số xe *</Text>
              <TextInput
                placeholder="Ví dụ: 60-B1 999.99"
                placeholderTextColor={activeColors.isDark ? '#6B7280' : '#9CA3AF'}
                value={newPlate}
                onChangeText={setNewPlate}
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: activeColors.border,
                  paddingHorizontal: 14,
                  color: activeColors.text,
                  backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                }}
              />
            </View>

            <View style={{ width: '100%', marginBottom: 15 }}>
              <Text style={{ color: activeColors.text, fontSize: 12, fontWeight: 'bold', marginBottom: 6 }}>Số khung (VIN) (Tùy chọn)</Text>
              <TextInput
                placeholder="Ví dụ: VR160-2026-VNBK777"
                placeholderTextColor={activeColors.isDark ? '#6B7280' : '#9CA3AF'}
                value={newVin}
                onChangeText={setNewVin}
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: activeColors.border,
                  paddingHorizontal: 14,
                  color: activeColors.text,
                  backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                }}
              />
            </View>

            <View style={{ width: '100%', marginBottom: 24 }}>
              <Text style={{ color: activeColors.text, fontSize: 12, fontWeight: 'bold', marginBottom: 6 }}>Màu sắc (Tùy chọn)</Text>
              <TextInput
                placeholder="Ví dụ: Đen Nhám"
                placeholderTextColor={activeColors.isDark ? '#6B7280' : '#9CA3AF'}
                value={newColor}
                onChangeText={setNewColor}
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: activeColors.border,
                  paddingHorizontal: 14,
                  color: activeColors.text,
                  backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <TouchableOpacity 
                style={{ 
                  flex: 1,
                  height: 48, 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
                  borderRadius: 12,
                  marginRight: 10,
                  borderWidth: 1,
                  borderColor: activeColors.border
                }} 
                onPress={() => {
                  setFormVisible(false);
                  setNewName('');
                  setNewPlate('');
                  setNewVin('');
                  setNewColor('');
                }}
              >
                <Text style={{ color: activeColors.text, fontWeight: 'bold' }}>Hủy bỏ</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ 
                  flex: 1,
                  height: 48, 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  backgroundColor: activeColors.primary, 
                  borderRadius: 12 
                }} 
                onPress={handleSubmit}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </BlurView>
      </Modal>
    </View>
  );
}
