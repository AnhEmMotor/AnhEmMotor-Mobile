import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { QrCode, ArrowLeft, Settings, Plus } from 'lucide-react-native';
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

export default function MyVehiclesScreen({ navigation, route }) {
  const {
    bikes,
    activeBike,
    showQR,
    openQR,
    closeQR,
    selectBike,
    addNewVehicle,
    registering,
    registerError,
    handleNavigateToDetail,
    loading,
    error,
    hasVehicles,
    retryLoadVehicles,
  } = useMyVehicles();

  const activeColors = useActiveColors();
  const { setSettingsOpen } = useGlobalState();

  const [formVisible, setFormVisible] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [newVin, setNewVin] = useState('');
  const [newEngine, setNewEngine] = useState('');
  const [newColor, setNewColor] = useState('');

  React.useEffect(() => {
    if (route?.params?.openAddModal) {
      setTimeout(() => setFormVisible(true), 0);
      setTimeout(() => navigation.setParams({ openAddModal: undefined }), 0);
    }
  }, [route?.params?.openAddModal, navigation]);

  const handleSubmit = async () => {
    if (!newPlate.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập Biển số xe.');
      return;
    }

    try {
      const registered = await addNewVehicle({
        name: '',
        licensePlate: newPlate.trim().toUpperCase(),
        vin: newVin.trim() || undefined,
        engineNumber: newEngine.trim() || undefined,
        color: newColor.trim() || undefined,
        currentOdo: 0,
      });

      setNewPlate('');
      setNewVin('');
      setNewEngine('');
      setNewColor('');
      setFormVisible(false);

      Alert.alert(
        'Thành công 🎉',
        `Đã đăng ký xe biển số "${registered.plate || newPlate}" thành công!`
      );
    } catch (registrationError) {
      Alert.alert(
        'Lỗi đăng ký xe',
        registrationError?.message || 'Đã có lỗi xảy ra khi đăng ký xe.'
      );
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: activeColors.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <ActivityIndicator size="large" color={activeColors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {}
        <View style={[styles.header, { justifyContent: 'space-between' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.backBtn,
                {
                  backgroundColor: activeColors.isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.03)',
                },
              ]}
            >
              <ArrowLeft color={activeColors.text} size={24} />
            </TouchableOpacity>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text
                style={[styles.title, { color: activeColors.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Nhà xe của bạn
              </Text>
              <Text
                style={[styles.subtitle, { color: activeColors.subtext }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Quản lý thông tin & lịch sử xe
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: activeColors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              borderRadius: 12,
            }}
            onPress={() => setSettingsOpen(true)}
          >
            <Settings color={activeColors.text} size={24} />
          </TouchableOpacity>
        </View>

        {error ? (
          <View
            style={{
              padding: 24,
              margin: 20,
              borderRadius: 20,
              backgroundColor: activeColors.card,
              borderWidth: 1,
              borderColor: activeColors.border,
            }}
          >
            <Text
              style={{
                color: activeColors.text,
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 10,
              }}
            >
              Có lỗi khi tải dữ liệu
            </Text>
            <Text style={{ color: activeColors.subtext, fontSize: 14, marginBottom: 20 }}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={retryLoadVehicles}
              style={{
                backgroundColor: activeColors.primary,
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : !hasVehicles ? (
          <View
            style={{
              padding: 24,
              margin: 20,
              borderRadius: 20,
              backgroundColor: activeColors.card,
              borderWidth: 1,
              borderColor: activeColors.border,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: activeColors.text,
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 10,
              }}
            >
              Bạn chưa có xe nào
            </Text>
            <Text
              style={{
                color: activeColors.subtext,
                fontSize: 14,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              Hãy thêm xe để quản lý bảo dưỡng, bảo hành và lịch sử dịch vụ từ AnhEmMotor.
            </Text>
            <TouchableOpacity
              onPress={() => setFormVisible(true)}
              style={{
                backgroundColor: activeColors.primary,
                paddingVertical: 14,
                paddingHorizontal: 32,
                borderRadius: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>Thêm xe ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0 }}
                contentContainerStyle={{ alignItems: 'center' }}
              >
                {bikes.map((bike) => {
                  const isSelected = activeBike && bike.id === activeBike.id;
                  return (
                    <TouchableOpacity
                      key={bike.id}
                      onPress={() => selectBike(bike.id)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: isSelected
                          ? Theme.staticColors.primary
                          : activeColors.isDark
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(0,0,0,0.04)',
                        marginRight: 10,
                        borderWidth: 1,
                        borderColor: isSelected
                          ? Theme.staticColors.primary
                          : activeColors.isDark
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(0,0,0,0.05)',
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected ? '#FFFFFF' : activeColors.text,
                          fontWeight: 'bold',
                          fontSize: 13,
                        }}
                      >
                        {bike.name || bike.plate}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {}
            <VehicleProfile
              bike={activeBike}
              onShowQR={openQR}
              onPress={() => handleNavigateToDetail(navigation)}
            />

            <WarrantySection bike={activeBike} />
            {activeBike.operatingSpecs && <OperatingSpecs specs={activeBike.operatingSpecs} />}
            {activeBike.nextService && <PredictionSection prediction={activeBike.nextService} />}

            <View style={styles.openSection}>
              <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
                Nhật ký bảo trì 📅
              </Text>
              {activeBike.timeline &&
                activeBike.timeline.map((item, idx) => (
                  <TimelineItem
                    key={item.id}
                    item={item}
                    isLast={idx === activeBike.timeline.length - 1}
                  />
                ))}
            </View>
          </>
        )}

        {}
        {hasVehicles && (
          <TouchableOpacity
            onPress={() => setFormVisible(true)}
            style={{
              marginHorizontal: 20,
              marginTop: 25,
              height: 52,
              borderRadius: 14,
              backgroundColor: activeColors.isDark
                ? 'rgba(16,185,129,0.15)'
                : 'rgba(16,185,129,0.08)',
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
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {}
      <Modal visible={showQR} transparent animationType="fade">
        <BlurView intensity={80} tint="dark" style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeQR} />
          <Animated.View
            entering={FadeInDown}
            style={[
              styles.modalContent,
              { backgroundColor: activeColors.sheetBg, borderColor: activeColors.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: activeColors.text }]}>Mã định danh xe</Text>
            <View style={styles.qrContainer}>
              <QrCode color={activeColors.primary} size={200} strokeWidth={1.5} />
            </View>
            <Text style={[styles.qrDesc, { color: activeColors.subtext }]}>
              Dùng mã này để check-in nhanh tại các showroom AnhEmMotor
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={closeQR}>
              <Text style={styles.closeBtnText}>Đóng</Text>
            </TouchableOpacity>
          </Animated.View>
        </BlurView>
      </Modal>

      {}
      <Modal visible={formVisible} transparent animationType="slide">
        <BlurView intensity={85} tint="dark" style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setFormVisible(false)} />
          <Animated.View
            entering={FadeInDown}
            style={[
              styles.modalContent,
              {
                backgroundColor: activeColors.sheetBg,
                borderColor: activeColors.border,
                width: '90%',
                padding: 24,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: activeColors.text, marginBottom: 4 }]}>
              Đăng ký xe mới 🏍️
            </Text>
            <Text
              style={{
                color: activeColors.subtext,
                fontSize: 13,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              Thêm xe vào hệ thống bảo dưỡng thông minh.
            </Text>

            {}
            <View style={{ width: '100%', marginBottom: 15 }}>
              <Text
                style={{
                  color: activeColors.text,
                  fontSize: 12,
                  fontWeight: 'bold',
                  marginBottom: 6,
                }}
              >
                Biển số xe *
              </Text>
              <TextInput
                placeholder="Ví dụ: 60-B1 999.99"
                placeholderTextColor={activeColors.isDark ? '#6B7280' : '#9CA3AF'}
                value={newPlate}
                onChangeText={setNewPlate}
                autoCapitalize="characters"
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: activeColors.border,
                  paddingHorizontal: 14,
                  color: activeColors.text,
                  backgroundColor: activeColors.isDark
                    ? 'rgba(255,255,255,0.02)'
                    : 'rgba(0,0,0,0.01)',
                }}
              />
            </View>

            {}
            <View style={{ width: '100%', marginBottom: 15 }}>
              <Text
                style={{
                  color: activeColors.text,
                  fontSize: 12,
                  fontWeight: 'bold',
                  marginBottom: 6,
                }}
              >
                Số khung (VIN) (Tùy chọn)
              </Text>
              <TextInput
                placeholder="Ví dụ: VR160-2026-VNBK777"
                placeholderTextColor={activeColors.isDark ? '#6B7280' : '#9CA3AF'}
                value={newVin}
                onChangeText={setNewVin}
                autoCapitalize="characters"
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: activeColors.border,
                  paddingHorizontal: 14,
                  color: activeColors.text,
                  backgroundColor: activeColors.isDark
                    ? 'rgba(255,255,255,0.02)'
                    : 'rgba(0,0,0,0.01)',
                }}
              />
            </View>

            {}
            <View style={{ width: '100%', marginBottom: 15 }}>
              <Text
                style={{
                  color: activeColors.text,
                  fontSize: 12,
                  fontWeight: 'bold',
                  marginBottom: 6,
                }}
              >
                Số máy (Tùy chọn)
              </Text>
              <TextInput
                placeholder="Ví dụ: MD375ABC123456"
                placeholderTextColor={activeColors.isDark ? '#6B7280' : '#9CA3AF'}
                value={newEngine}
                onChangeText={setNewEngine}
                autoCapitalize="characters"
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: activeColors.border,
                  paddingHorizontal: 14,
                  color: activeColors.text,
                  backgroundColor: activeColors.isDark
                    ? 'rgba(255,255,255,0.02)'
                    : 'rgba(0,0,0,0.01)',
                }}
              />
            </View>

            {}
            <View style={{ width: '100%', marginBottom: 24 }}>
              <Text
                style={{
                  color: activeColors.text,
                  fontSize: 12,
                  fontWeight: 'bold',
                  marginBottom: 6,
                }}
              >
                Màu sắc (Tùy chọn)
              </Text>
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
                  backgroundColor: activeColors.isDark
                    ? 'rgba(255,255,255,0.02)'
                    : 'rgba(0,0,0,0.01)',
                }}
              />
            </View>

            {}
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 48,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: activeColors.isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.03)',
                  borderRadius: 12,
                  marginRight: 10,
                  borderWidth: 1,
                  borderColor: activeColors.border,
                }}
                onPress={() => {
                  setFormVisible(false);
                  setNewPlate('');
                  setNewVin('');
                  setNewEngine('');
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
                  borderRadius: 12,
                  opacity: registering ? 0.65 : 1,
                }}
                onPress={handleSubmit}
                disabled={registering}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                  {registering ? 'Đang đăng ký...' : 'Đăng ký'}
                </Text>
              </TouchableOpacity>
            </View>

            {registerError ? (
              <Text style={{ color: '#F97316', marginTop: 12, textAlign: 'center' }}>
                {registerError}
              </Text>
            ) : null}
          </Animated.View>
        </BlurView>
      </Modal>
    </View>
  );
}
