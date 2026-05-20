import React, { useRef, useState, useCallback, useEffect } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Modal, 
  StyleSheet, 
  TextInput, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme, useActiveColors } from '../../../theme/Theme';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Award, 
  ChevronRight, 
  Lock, 
  Bell, 
  Shield, 
  Languages, 
  LogOut, 
  Trash2, 
  Camera, 
  Star, 
  PenLine, 
  ShieldAlert, 
  Check,
  Settings,
  FileText,
  Wrench,
  Clock,
  Sparkles,
  Package,
  Truck,
  CheckCircle,
  CreditCard,
  CircleDollarSign,
  Map,
  PlusCircle
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../../components/GlassCard';
import ScalePress from '../../../components/ScalePress';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useAnimatedStyle, 
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import CustomBottomSheet from '../../../components/CustomBottomSheet';
import { styles } from './styles';
import { horizontalScale, verticalScale, moderateScale } from '../../../utils/responsive';
import { useProfileController, MOCK_REGIONS } from '../../../features/profile/presentation/controller/useProfileController';
import { useGlobalState } from '../../../context/GlobalState';

/**
 * @file ProfileScreen.js
 * @framework React Native (Clean Architecture - Presentation Layer)
 * @description Beautiful customer profile screen with high-fidelity click-to-edit bottom sheets.
 */
export default function ProfileScreen({ navigation, route }) {
  const bottomSheetRef = useRef(null);
  
  const {
    profile,
    isLoading,
    isSaving,
    avatarModal,
    setAvatarModal,
    activeField,
    setActiveField,
    tempData,
    setTempData,
    passwordForm,
    setPasswordForm,
    openEditField,
    handleSaveField,
    handleToggleSetting,
    handleSelectPhoto,
    handleSelectCartoonAvatar,
    handleDeleteAccount,
    handleLogout,
    cartoonAvatars,
  } = useProfileController(navigation, bottomSheetRef);

  // Region selection UI active list helper
  const [activeRegionList, setActiveRegionList] = useState(null); // 'provinces' | 'districts' | 'wards'

  // New Shopee-style interactive state modals
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  useEffect(() => {
    if (route?.params?.openSettings) {
      setSettingsOpen(true);
      navigation.setParams({ openSettings: undefined });
    }
  }, [route?.params?.openSettings]);
  const [privilegesModalVisible, setPrivilegesModalVisible] = useState(false);
  const [liveWorkshopModalVisible, setLiveWorkshopModalVisible] = useState(false);
  const [mapTrackingModalVisible, setMapTrackingModalVisible] = useState(false);
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);

  // 🌈 Dynamic Unified System-wide Theme Detection
  const themeColors = useActiveColors();
  const isDark = themeColors.isDark;
  const { setSettingsOpen } = useGlobalState();

  const activeColors = {
    ...themeColors,
    background: isDark ? '#090E17' : '#F1F5F9',
    cardBg: isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
    cardBorder: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
    settingsCardBg: isDark ? 'rgba(255,255,255,0.01)' : '#FFFFFF',
    settingsIconBg: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9',
    settingsIconBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    modalBg: isDark ? '#0F172A' : '#FFFFFF',
    regionItemBorder: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)',
    regionListBg: isDark ? 'rgba(0,0,0,0.2)' : '#F1F5F9',
    formInputBg: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
    formInputBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
    tabSelectorBg: isDark ? 'rgba(255,255,255,0.03)' : '#E2E8F0',
    tabSelectorBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    tabOptionText: isDark ? '#94A3B8' : '#64748B',
    activeTabOptionText: '#FFFFFF',
    listIconBg: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9',
    supportRowBg: isDark ? 'rgba(236,72,153,0.06)' : 'rgba(236,72,153,0.05)',
    supportRowBorder: isDark ? 'rgba(236,72,153,0.15)' : 'rgba(236,72,153,0.1)'
  };

  // Tilt effects for the Premium Membership Card
  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: '0deg' },
        { rotateX: '0deg' },
      ],
    };
  });

  const glareStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.15,
    };
  });

  // Render loading state
  const systemSchemeForLoading = useColorScheme();
  const loadingBg = systemSchemeForLoading === 'dark' ? '#0B0F19' : '#F8FAFC';
  const loadingText = systemSchemeForLoading === 'dark' ? '#94A3B8' : '#64748B';

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: loadingBg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Theme.staticColors.primary} />
        <Text style={{ color: loadingText, marginTop: 15, fontSize: 14 }}>Đang tải thông tin hồ sơ...</Text>
      </View>
    );
  }

  // Safe UI handler for Hotline click
  const handleHotlinePress = () => {
    Alert.alert(
      '🔒 Thay đổi Số Điện Thoại',
      'Vì số điện thoại là thông tin định danh tài khoản, quý khách không thể tự thay đổi trực tiếp. Vui lòng liên hệ Hotline xưởng dịch vụ Biên Hòa để xác thực thông tin.\n\nHotline: 1900 6899',
      [{ text: 'Đóng', style: 'cancel' }]
    );
  };

  // Render Region Lists in Bottom Sheet
  const renderRegionSelector = () => {
    let items = [];
    let currentActive = '';
    
    if (activeRegionList === 'provinces') {
      items = MOCK_REGIONS.provinces;
      currentActive = tempData.province;
    } else if (activeRegionList === 'districts') {
      items = MOCK_REGIONS.districts[tempData.province] || [];
      currentActive = tempData.district;
    } else if (activeRegionList === 'wards') {
      items = MOCK_REGIONS.wards[tempData.district] || [];
      currentActive = tempData.ward;
    }

    return (
      <View style={[styles.regionList, { backgroundColor: activeColors.regionListBg }]}>
        <ScrollView nestedScrollEnabled={true}>
          {items.map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.regionItem, { borderBottomColor: activeColors.regionItemBorder }]}
              onPress={() => {
                if (activeRegionList === 'provinces') {
                  setTempData(prev => ({ 
                    ...prev, 
                    province: item, 
                    district: MOCK_REGIONS.districts[item]?.[0] || '',
                    ward: MOCK_REGIONS.wards[MOCK_REGIONS.districts[item]?.[0]]?.[0] || ''
                  }));
                } else if (activeRegionList === 'districts') {
                  setTempData(prev => ({ 
                    ...prev, 
                    district: item,
                    ward: MOCK_REGIONS.wards[item]?.[0] || ''
                  }));
                } else if (activeRegionList === 'wards') {
                  setTempData(prev => ({ ...prev, ward: item }));
                }
                setActiveRegionList(null); // Close list
              }}
            >
              <Text style={[
                styles.regionItemText, 
                { color: activeColors.subtext },
                currentActive === item && styles.regionItemTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render Date Selectors (Day, Month, Year slider tabs)
  const renderDatePickerFields = () => {
    const parts = (tempData.birthDate || profile.birthDate || '17/05/1995').split('/');
    const d = parseInt(parts[0]) || 17;
    const m = parseInt(parts[1]) || 5;
    const y = parseInt(parts[2]) || 1995;

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 66 }, (_, i) => 2015 - i); // 1950 to 2015

    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={[styles.formLabel, { color: activeColors.text }]}>Ngày sinh nhật</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* Day column */}
          <View style={{ width: '30%', height: 130, backgroundColor: activeColors.formInputBg, borderRadius: 12, borderWidth: 1, borderColor: activeColors.formInputBorder, overflow: 'hidden' }}>
            <Text style={{ textAlign: 'center', color: activeColors.subtext, fontSize: 10, paddingVertical: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>NGÀY</Text>
            <ScrollView nestedScrollEnabled={true}>
              {days.map(day => (
                <TouchableOpacity 
                  key={day} 
                  style={{ padding: 10, alignItems: 'center', backgroundColor: d === day ? Theme.staticColors.primary : 'transparent' }}
                  onPress={() => {
                    const formattedDay = day < 10 ? `0${day}` : `${day}`;
                    const formattedMonth = m < 10 ? `0${m}` : `${m}`;
                    setTempData(prev => ({ ...prev, birthDate: `${formattedDay}/${formattedMonth}/${y}` }));
                  }}
                >
                  <Text style={{ color: d === day ? '#fff' : activeColors.text, fontWeight: d === day ? 'bold' : 'normal' }}>{day}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
 
          {/* Month column */}
          <View style={{ width: '30%', height: 130, backgroundColor: activeColors.formInputBg, borderRadius: 12, borderWidth: 1, borderColor: activeColors.formInputBorder, overflow: 'hidden' }}>
            <Text style={{ textAlign: 'center', color: activeColors.subtext, fontSize: 10, paddingVertical: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>THÁNG</Text>
            <ScrollView nestedScrollEnabled={true}>
              {months.map(month => (
                <TouchableOpacity 
                  key={month} 
                  style={{ padding: 10, alignItems: 'center', backgroundColor: m === month ? Theme.staticColors.primary : 'transparent' }}
                  onPress={() => {
                    const formattedDay = d < 10 ? `0${d}` : `${d}`;
                    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
                    setTempData(prev => ({ ...prev, birthDate: `${formattedDay}/${formattedMonth}/${y}` }));
                  }}
                >
                  <Text style={{ color: m === month ? '#fff' : activeColors.text, fontWeight: m === month ? 'bold' : 'normal' }}>Tháng {month}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
 
          {/* Year column */}
          <View style={{ width: '34%', height: 130, backgroundColor: activeColors.formInputBg, borderRadius: 12, borderWidth: 1, borderColor: activeColors.formInputBorder, overflow: 'hidden' }}>
            <Text style={{ textAlign: 'center', color: activeColors.subtext, fontSize: 10, paddingVertical: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>NĂM</Text>
            <ScrollView nestedScrollEnabled={true}>
              {years.map(year => (
                <TouchableOpacity 
                  key={year} 
                  style={{ padding: 10, alignItems: 'center', backgroundColor: y === year ? Theme.staticColors.primary : 'transparent' }}
                  onPress={() => {
                    const formattedDay = d < 10 ? `0${d}` : `${d}`;
                    const formattedMonth = m < 10 ? `0${m}` : `${m}`;
                    setTempData(prev => ({ ...prev, birthDate: `${formattedDay}/${formattedMonth}/${year}` }));
                  }}
                >
                  <Text style={{ color: y === year ? '#fff' : activeColors.text, fontWeight: y === year ? 'bold' : 'normal' }}>{year}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        <Text style={{ color: activeColors.subtext, fontSize: 11, fontStyle: 'italic', marginTop: 10 }}>💡 Showroom Biên Hòa tự động gửi tặng Voucher Bảo dưỡng vào tháng sinh nhật.</Text>
      </View>
    );
  };

  // Choose appropriate title and contents for editing Bottom Sheet
  const getBottomSheetTitle = () => {
    switch (activeField) {
      case 'profile': return 'Cập nhật Thông Tin Cá Nhân';
      case 'name': return 'Cập nhật Họ và tên';
      case 'birthDate': return 'Chọn Ngày Sinh Nhật';
      case 'email': return 'Thay đổi Email nhận hoá đơn';
      case 'address': return 'Cài đặt Địa chỉ nhận xe';
      case 'license': return 'Thông tin Giấy Phép Lái Xe';
      case 'password': return 'Đổi Mật Khẩu Tài Khoản';
      case 'language': return 'Thay đổi Ngôn Ngữ';
      case 'theme': return 'Cấu hình Giao Diện';
      default: return 'Cập nhật thông tin';
    }
  };

  // Render appropriate edit fields in the Bottom Sheet
  const renderBottomSheetFields = () => {
    switch (activeField) {
      case 'profile':
        return (
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            style={{ maxHeight: 420 }} 
            nestedScrollEnabled={true}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <View style={styles.formContainer}>
              
              {/* 1. Họ và tên */}
              <Text style={[styles.formLabel, { color: activeColors.text }]}>Họ và tên khách hàng</Text>
              <View style={[styles.formInputWrapper, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}>
                <User color={Theme.staticColors.primary} size={18} style={styles.formInputIcon} />
                <TextInput 
                  style={[styles.formInput, { color: activeColors.text }]}
                  value={tempData.name}
                  onChangeText={(val) => setTempData(prev => ({ ...prev, name: val }))}
                  placeholder="Nhập họ và tên..."
                  placeholderTextColor={activeColors.subtext}
                  autoCapitalize="words"
                />
              </View>

              {/* 2. Số điện thoại (Locked) */}
              <Text style={[styles.formLabel, { color: activeColors.text }]}>Số điện thoại đăng nhập (Khóa cứng 🔒)</Text>
              <TouchableOpacity 
                style={[styles.formInputWrapper, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}
                onPress={() => {
                  Alert.alert(
                    'Đổi số điện thoại',
                    'Vì lý do bảo mật tài khoản, số điện thoại đăng nhập được khóa cứng. Xin vui lòng liên hệ Hotline 1900 6899 để gặp kỹ thuật viên hỗ trợ xác minh OTP và cập nhật số điện thoại mới.',
                    [{ text: 'Gọi Hotline 📞', onPress: () => Alert.alert('Đang thực hiện cuộc gọi...', 'Đang gọi 1900 6899') }, { text: 'Để sau', style: 'cancel' }]
                  );
                }}
              >
                <Phone color={Theme.staticColors.warning} size={18} style={styles.formInputIcon} />
                <Text style={[styles.formInput, { color: activeColors.subtext }]}>{profile.phone}</Text>
                <Lock color={Theme.staticColors.warning} size={15} style={{ marginRight: 15 }} />
              </TouchableOpacity>

              {/* 3. Giới tính */}
              <Text style={[styles.formLabel, { color: activeColors.text }]}>Giới tính</Text>
              <View style={[styles.tabSelector, { backgroundColor: activeColors.tabSelectorBg, borderColor: activeColors.tabSelectorBorder }]}>
                <TouchableOpacity 
                  style={[styles.tabOption, tempData.gender === 'Nam' && styles.activeTabOption]}
                  onPress={() => setTempData(prev => ({ ...prev, gender: 'Nam' }))}
                >
                  <Text style={[styles.tabOptionText, { color: tempData.gender === 'Nam' ? activeColors.activeTabOptionText : activeColors.tabOptionText }]}>Nam 🧔</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tabOption, tempData.gender === 'Nữ' && styles.activeTabOption]}
                  onPress={() => setTempData(prev => ({ ...prev, gender: 'Nữ' }))}
                >
                  <Text style={[styles.tabOptionText, { color: tempData.gender === 'Nữ' ? activeColors.activeTabOptionText : activeColors.tabOptionText }]}>Nữ 👩</Text>
                </TouchableOpacity>
              </View>

              {/* 4. Ngày sinh (Embedded wheel picker scroll views) */}
              {renderDatePickerFields()}

              {/* 5. Email */}
              <Text style={[styles.formLabel, { color: activeColors.text }]}>Email nhận hoá đơn PDF</Text>
              <View style={[styles.formInputWrapper, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}>
                <Mail color={Theme.staticColors.primary} size={18} style={styles.formInputIcon} />
                <TextInput 
                  style={[styles.formInput, { color: activeColors.text }]}
                  value={tempData.email}
                  onChangeText={(val) => setTempData(prev => ({ ...prev, email: val }))}
                  placeholder="example@gmail.com"
                  placeholderTextColor={activeColors.subtext}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* 6. Địa chỉ nhận xe */}
              <Text style={[styles.formLabel, { color: activeColors.text }]}>Khu vực hành chính</Text>
              <View style={styles.regionGroup}>
                {/* Province Selector */}
                <TouchableOpacity 
                  style={[styles.regionSelectButton, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}
                  onPress={() => setActiveRegionList(activeRegionList === 'provinces' ? null : 'provinces')}
                >
                  <View>
                    <Text style={[styles.regionSelectLabel, { color: activeColors.subtext }]}>Tỉnh / Thành Phố</Text>
                    <Text style={[styles.regionSelectValue, { color: activeColors.text }]}>{tempData.province || 'Chọn Tỉnh / Thành'}</Text>
                  </View>
                  <ChevronRight color={activeColors.subtext} size={18} />
                </TouchableOpacity>
                {activeRegionList === 'provinces' && renderRegionSelector()}

                {/* District Selector */}
                <TouchableOpacity 
                  style={[styles.regionSelectButton, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}
                  onPress={() => setActiveRegionList(activeRegionList === 'districts' ? null : 'districts')}
                >
                  <View>
                    <Text style={[styles.regionSelectLabel, { color: activeColors.subtext }]}>Quận / Huyện</Text>
                    <Text style={[styles.regionSelectValue, { color: activeColors.text }]}>{tempData.district || 'Chọn Quận / Huyện'}</Text>
                  </View>
                  <ChevronRight color={activeColors.subtext} size={18} />
                </TouchableOpacity>
                {activeRegionList === 'districts' && renderRegionSelector()}

                {/* Ward Selector */}
                <TouchableOpacity 
                  style={[styles.regionSelectButton, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}
                  onPress={() => setActiveRegionList(activeRegionList === 'wards' ? null : 'wards')}
                >
                  <View>
                    <Text style={[styles.regionSelectLabel, { color: activeColors.subtext }]}>Phường / Xã</Text>
                    <Text style={[styles.regionSelectValue, { color: activeColors.text }]}>{tempData.ward || 'Chọn Phường / Xã'}</Text>
                  </View>
                  <ChevronRight color={activeColors.subtext} size={18} />
                </TouchableOpacity>
                {activeRegionList === 'wards' && renderRegionSelector()}
              </View>

              <Text style={[styles.formLabel, { color: activeColors.text }]}>Số nhà, tên đường cụ thể</Text>
              <View style={[styles.formInputWrapper, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}>
                <MapPin color={Theme.staticColors.primary} size={18} style={styles.formInputIcon} />
                <TextInput 
                  style={[styles.formInput, { color: activeColors.text }]}
                  value={tempData.specificAddress}
                  onChangeText={(val) => setTempData(prev => ({ ...prev, specificAddress: val }))}
                  placeholder="Số nhà, ngõ ngách, tên đường..."
                  placeholderTextColor={activeColors.subtext}
                />
              </View>

              {/* 7. Giấy phép lái xe */}
              <Text style={[styles.formLabel, { color: activeColors.text }]}>Hạng bằng lái xe máy</Text>
              <View style={[styles.tabSelector, { backgroundColor: activeColors.tabSelectorBg, borderColor: activeColors.tabSelectorBorder }]}>
                <TouchableOpacity 
                  style={[styles.tabOption, tempData.licenseTier === 'A1' && styles.activeTabOption]}
                  onPress={() => setTempData(prev => ({ ...prev, licenseTier: 'A1' }))}
                >
                  <Text style={[styles.tabOptionText, { color: tempData.licenseTier === 'A1' ? activeColors.activeTabOptionText : activeColors.tabOptionText }]}>HẠNG A1</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tabOption, tempData.licenseTier === 'A2' && styles.activeTabOption]}
                  onPress={() => setTempData(prev => ({ ...prev, licenseTier: 'A2' }))}
                >
                  <Text style={[styles.tabOptionText, { color: tempData.licenseTier === 'A2' ? activeColors.activeTabOptionText : activeColors.tabOptionText }]}>HẠNG A2</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.formLabel, { color: activeColors.text }]}>Ảnh chụp bằng lái (Tùy chọn)</Text>
              <TouchableOpacity 
                style={[styles.licenseImageContainer, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}
                onPress={() => {
                  Alert.alert(
                    'Tải ảnh bằng lái xe',
                    'Chọn nguồn tải ảnh:',
                    [
                      { text: 'Chụp ảnh mới 📷', onPress: () => handleSelectPhoto('camera') },
                      { text: 'Chọn từ thư viện ảnh 🖼️', onPress: () => handleSelectPhoto('gallery') },
                      { text: 'Hủy', style: 'cancel' }
                    ]
                  );
                }}
              >
                {tempData.licenseImage ? (
                  <Image source={{ uri: tempData.licenseImage }} style={styles.licenseImage} resizeMode="cover" />
                ) : (
                  <View style={styles.licenseUploadBtn}>
                    <Camera color={Theme.staticColors.primary} size={32} />
                    <Text style={[styles.licenseUploadText, { color: Theme.staticColors.primary }]}>Tải lên mặt trước bằng lái</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      case 'name':
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.formLabel, { color: activeColors.text }]}>Họ và tên khách hàng</Text>
            <View style={[styles.formInputWrapper, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}>
              <User color={Theme.staticColors.primary} size={18} style={styles.formInputIcon} />
              <TextInput 
                style={[styles.formInput, { color: activeColors.text }]}
                value={tempData.name}
                onChangeText={(val) => setTempData({ ...tempData, name: val })}
                autoFocus={true}
                placeholder="Nhập họ và tên..."
                placeholderTextColor={activeColors.subtext}
                autoCapitalize="words"
              />
            </View>
          </View>
        );

      case 'email':
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.formLabel, { color: activeColors.text }]}>Email nhận hoá đơn PDF</Text>
            <View style={[styles.formInputWrapper, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}>
              <Mail color={Theme.staticColors.primary} size={18} style={styles.formInputIcon} />
              <TextInput 
                style={[styles.formInput, { color: activeColors.text }]}
                value={tempData.email}
                onChangeText={(val) => setTempData({ ...tempData, email: val })}
                autoFocus={true}
                placeholder="example@gmail.com"
                placeholderTextColor={activeColors.subtext}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        );

      case 'birthDate':
        return renderDatePickerFields();

      case 'address':
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.formLabel, { color: activeColors.text }]}>Khu vực hành chính</Text>
            
            <View style={styles.regionGroup}>
              {/* Province Selector */}
              <TouchableOpacity 
                style={[styles.regionSelectButton, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}
                onPress={() => setActiveRegionList(activeRegionList === 'provinces' ? null : 'provinces')}
              >
                <View>
                  <Text style={[styles.regionSelectLabel, { color: activeColors.subtext }]}>Tỉnh / Thành Phố</Text>
                  <Text style={[styles.regionSelectValue, { color: activeColors.text }]}>{tempData.province || 'Chọn Tỉnh / Thành'}</Text>
                </View>
                <ChevronRight color={activeColors.subtext} size={18} />
              </TouchableOpacity>
              {activeRegionList === 'provinces' && renderRegionSelector()}

              {/* District Selector */}
              <TouchableOpacity 
                style={[styles.regionSelectButton, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}
                onPress={() => setActiveRegionList(activeRegionList === 'districts' ? null : 'districts')}
              >
                <View>
                  <Text style={[styles.regionSelectLabel, { color: activeColors.subtext }]}>Quận / Huyện</Text>
                  <Text style={[styles.regionSelectValue, { color: activeColors.text }]}>{tempData.district || 'Chọn Quận / Huyện'}</Text>
                </View>
                <ChevronRight color={activeColors.subtext} size={18} />
              </TouchableOpacity>
              {activeRegionList === 'districts' && renderRegionSelector()}

              {/* Ward Selector */}
              <TouchableOpacity 
                style={[styles.regionSelectButton, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}
                onPress={() => setActiveRegionList(activeRegionList === 'wards' ? null : 'wards')}
              >
                <View>
                  <Text style={[styles.regionSelectLabel, { color: activeColors.subtext }]}>Phường / Xã</Text>
                  <Text style={[styles.regionSelectValue, { color: activeColors.text }]}>{tempData.ward || 'Chọn Phường / Xã'}</Text>
                </View>
                <ChevronRight color={activeColors.subtext} size={18} />
              </TouchableOpacity>
              {activeRegionList === 'wards' && renderRegionSelector()}
            </View>

            <Text style={[styles.formLabel, { color: activeColors.text }]}>Số nhà, tên đường cụ thể</Text>
            <View style={[styles.formInputWrapper, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}>
              <MapPin color={Theme.staticColors.primary} size={18} style={styles.formInputIcon} />
              <TextInput 
                style={[styles.formInput, { color: activeColors.text }]}
                value={tempData.specificAddress}
                onChangeText={(val) => setTempData({ ...tempData, specificAddress: val })}
                placeholder="Số nhà, ngõ ngách, tên đường..."
                placeholderTextColor={activeColors.subtext}
              />
            </View>
          </View>
        );

      case 'license':
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.formLabel, { color: activeColors.text }]}>Hạng bằng lái xe máy</Text>
            
            <View style={[styles.tabSelector, { backgroundColor: activeColors.tabSelectorBg, borderColor: activeColors.tabSelectorBorder }]}>
              <TouchableOpacity 
                style={[styles.tabOption, tempData.licenseTier === 'A1' && styles.activeTabOption]}
                onPress={() => setTempData(prev => ({ ...prev, licenseTier: 'A1' }))}
              >
                <Text style={[styles.tabOptionText, { color: tempData.licenseTier === 'A1' ? activeColors.activeTabOptionText : activeColors.tabOptionText }]}>HẠNG A1 (Dưới 175cc)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabOption, tempData.licenseTier === 'A2' && styles.activeTabOption]}
                onPress={() => setTempData(prev => ({ ...prev, licenseTier: 'A2' }))}
              >
                <Text style={[styles.tabOptionText, { color: tempData.licenseTier === 'A2' ? activeColors.activeTabOptionText : activeColors.tabOptionText }]}>HẠNG A2 (Mô tô Phân khối lớn)</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.formLabel, { color: activeColors.text }]}>Ảnh chụp bằng lái (Mặt trước - Tùy chọn)</Text>
            <TouchableOpacity 
              style={[styles.licenseImageContainer, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}
              onPress={() => {
                Alert.alert(
                  'Tải ảnh bằng lái xe',
                  'Chọn nguồn tải ảnh:',
                  [
                    { text: 'Chụp ảnh mới 📷', onPress: () => handleSelectPhoto('camera') },
                    { text: 'Chọn từ thư viện ảnh 🖼️', onPress: () => handleSelectPhoto('gallery') },
                    { text: 'Hủy', style: 'cancel' }
                  ]
                );
              }}
            >
              {tempData.licenseImage ? (
                <Image source={{ uri: tempData.licenseImage }} style={styles.licenseImage} resizeMode="cover" />
              ) : (
                <View style={styles.licenseUploadBtn}>
                  <Camera color={Theme.staticColors.primary} size={32} />
                  <Text style={[styles.licenseUploadText, { color: Theme.staticColors.primary }]}>Tải lên mặt trước bằng lái</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={{ color: activeColors.subtext, fontSize: 11, fontStyle: 'italic', marginBottom: 10 }}>💡 Dùng để tự động làm thủ tục nhanh khi đăng ký lịch lái thử xe tại showroom.</Text>
          </View>
        );

      case 'password':
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.formLabel, { color: activeColors.text }]}>Mật khẩu cũ</Text>
            <View style={[styles.formInputWrapper, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}>
              <Lock color={Theme.staticColors.primary} size={18} style={styles.formInputIcon} />
              <TextInput 
                style={[styles.formInput, { color: activeColors.text }]}
                value={passwordForm.oldPassword}
                onChangeText={(val) => setPasswordForm({ ...passwordForm, oldPassword: val })}
                secureTextEntry={true}
                placeholder="Nhập mật khẩu hiện tại..."
                placeholderTextColor={activeColors.subtext}
              />
            </View>

            <Text style={[styles.formLabel, { color: activeColors.text }]}>Mật khẩu mới</Text>
            <View style={[styles.formInputWrapper, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}>
              <Lock color={Theme.staticColors.success} size={18} style={styles.formInputIcon} />
              <TextInput 
                style={[styles.formInput, { color: activeColors.text }]}
                value={passwordForm.newPassword}
                onChangeText={(val) => setPasswordForm({ ...passwordForm, newPassword: val })}
                secureTextEntry={true}
                placeholder="Tối thiểu 6 ký tự..."
                placeholderTextColor={activeColors.subtext}
              />
            </View>

            <Text style={[styles.formLabel, { color: activeColors.text }]}>Nhập lại mật khẩu mới</Text>
            <View style={[styles.formInputWrapper, { backgroundColor: activeColors.formInputBg, borderColor: activeColors.formInputBorder }]}>
              <Lock color={Theme.staticColors.success} size={18} style={styles.formInputIcon} />
              <TextInput 
                style={[styles.formInput, { color: activeColors.text }]}
                value={passwordForm.confirmPassword}
                onChangeText={(val) => setPasswordForm({ ...passwordForm, confirmPassword: val })}
                secureTextEntry={true}
                placeholder="Xác nhận lại mật khẩu..."
                placeholderTextColor={activeColors.subtext}
              />
            </View>
          </View>
        );

      case 'language':
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.formLabel, { color: activeColors.text }]}>Chọn ngôn ngữ ứng dụng</Text>
            <View style={[styles.tabSelector, { backgroundColor: activeColors.tabSelectorBg, borderColor: activeColors.tabSelectorBorder }]}>
              <TouchableOpacity 
                style={[styles.tabOption, tempData.language === 'vi' && styles.activeTabOption]}
                onPress={() => setTempData({ language: 'vi' })}
              >
                <Text style={[styles.tabOptionText, { color: tempData.language === 'vi' ? activeColors.activeTabOptionText : activeColors.tabOptionText }]}>Tiếng Việt 🇻🇳</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabOption, tempData.language === 'en' && styles.activeTabOption]}
                onPress={() => setTempData({ language: 'en' })}
              >
                <Text style={[styles.tabOptionText, { color: tempData.language === 'en' ? activeColors.activeTabOptionText : activeColors.tabOptionText }]}>English 🇬🇧</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'theme':
        return (
          <View style={styles.formContainer}>
            <Text style={[styles.formLabel, { color: activeColors.text }]}>Chọn chế độ giao diện ứng dụng</Text>
            <View style={[styles.tabSelector, { backgroundColor: activeColors.tabSelectorBg, borderColor: activeColors.tabSelectorBorder }]}>
              <TouchableOpacity 
                style={[styles.tabOption, tempData.theme === 'light' && styles.activeTabOption]}
                onPress={() => setTempData({ theme: 'light' })}
              >
                <Text style={[styles.tabOptionText, { color: tempData.theme === 'light' ? activeColors.activeTabOptionText : activeColors.tabOptionText }]}>Sáng ☀️</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabOption, tempData.theme === 'dark' && styles.activeTabOption]}
                onPress={() => setTempData({ theme: 'dark' })}
              >
                <Text style={[styles.tabOptionText, { color: tempData.theme === 'dark' ? activeColors.activeTabOptionText : activeColors.tabOptionText }]}>Tối 🌙</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabOption, tempData.theme === 'system' && styles.activeTabOption]}
                onPress={() => setTempData({ theme: 'system' })}
              >
                <Text style={[styles.tabOptionText, { color: tempData.theme === 'system' ? activeColors.activeTabOptionText : activeColors.tabOptionText }]}>Hệ thống ⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      {/* 📱 1. Phần Đỉnh Trang (Header & Top Bar) */}
      <View style={[styles.topBar, { backgroundColor: activeColors.background, borderBottomColor: activeColors.border }]}>
        <Text style={[styles.topBarTitle, { color: activeColors.text }]}>HỒ SƠ CỦA TÔI</Text>
        <TouchableOpacity style={[styles.settingsIconWrapper, { backgroundColor: activeColors.settingsIconBg, borderColor: activeColors.settingsIconBorder }]} onPress={() => setSettingsOpen(true)}>
          <Settings color={activeColors.text} size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 👑 KHỐI 1: HEADER & ĐỊNH DANH (Shopee style) */}
        <Animated.View entering={FadeInUp.duration(600)} style={[styles.shopeeHeader, { backgroundColor: activeColors.cardBg, borderColor: activeColors.border }]}>
          <TouchableOpacity style={styles.shopeeAvatarWrapper} onPress={() => setAvatarModal(true)}>
            <Image 
              source={{ uri: profile.licenseImage || 'https://img.freepik.com/free-vector/cute-cool-boy-with-glasses-hoodie-pixel-art-style_475147-155.jpg' }} 
              style={styles.shopeeAvatar} 
            />
            <View style={styles.shopeeCameraBadge}>
              <Camera color="#fff" size={12} />
            </View>
          </TouchableOpacity>

          <View style={styles.shopeeHeaderText}>
            <Text style={[styles.shopeeName, { color: activeColors.text }]}>{profile.name.toUpperCase()}</Text>
            
            <TouchableOpacity style={styles.shopeeTierBadge} onPress={() => setPrivilegesModalVisible(true)}>
              <Award color="#F59E0B" size={12} fill="#F59E0B" style={{ marginRight: 4 }} />
              <Text style={styles.shopeeTierText}>Vàng (Gold) • Đặc quyền 👑</Text>
              <ChevronRight color="#F59E0B" size={12} style={{ marginLeft: 2 }} />
            </TouchableOpacity>

            <Text style={[styles.shopeeUid, { color: activeColors.subtext }]}>Mã KH: AEM-6899</Text>
          </View>
        </Animated.View>

        {/* 🎟️ KHỐI 4: VÍ TIỆN ÍCH & QUYỀN LỢI (Financial Wallet & Perks) */}
        <View style={[styles.walletBar, { backgroundColor: activeColors.cardBg, borderColor: activeColors.border }]}>
          <TouchableOpacity style={styles.walletItem} onPress={() => setVoucherModalVisible(true)}>
            <CreditCard color={Theme.staticColors.primary} size={18} style={{ marginRight: 6 }} />
            <View>
              <Text style={[styles.walletLabel, { color: activeColors.subtext }]}>Ví Voucher</Text>
              <Text style={[styles.walletValue, { color: activeColors.text }]}>🎟️ 3 Voucher đang có</Text>
            </View>
          </TouchableOpacity>
          
          <View style={[styles.walletDivider, { backgroundColor: activeColors.border }]} />

          <TouchableOpacity style={styles.walletItem} onPress={() => Alert.alert('AEM Xu', 'Bạn đang tích luỹ được 1,200 Xu đặc quyền. Xu có thể dùng để chiết khấu trực tiếp hóa đơn bảo dưỡng xe!')}>
            <CircleDollarSign color="#F59E0B" size={18} style={{ marginRight: 6 }} />
            <View>
              <Text style={[styles.walletLabel, { color: activeColors.subtext }]}>AEM Xu / Điểm</Text>
              <Text style={[styles.walletValue, { color: '#F59E0B' }]}>🪙 1,200 xu</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 📅 KHỐI 2: QUẢN LÝ DỊCH VỤ XE (Workshop Services) */}
        <View style={[styles.blockContainer, { backgroundColor: activeColors.cardBg, borderColor: activeColors.border }]}>
          <Text style={[styles.blockTitle, { color: activeColors.text }]}>📅 QUẢN LÝ DỊCH VỤ XE</Text>
          
          <View style={styles.shopeeRow}>
            {/* Đặt lịch */}
            <TouchableOpacity style={styles.shopeeCol} onPress={() => navigation.navigate('Booking')}>
              <View style={[styles.iconCircle, { backgroundColor: activeColors.settingsIconBg, borderColor: activeColors.settingsIconBorder }]}>
                <FileText color={Theme.staticColors.primary} size={22} />
              </View>
              <Text style={[styles.iconLabel, { color: activeColors.subtext }]}>Đặt lịch</Text>
            </TouchableOpacity>

            {/* Đang sửa */}
            <TouchableOpacity style={styles.shopeeCol} onPress={() => setLiveWorkshopModalVisible(true)}>
              <View style={[styles.iconCircle, { backgroundColor: activeColors.settingsIconBg, borderColor: activeColors.settingsIconBorder }]}>
                <Wrench color={Theme.staticColors.warning} size={22} />
                <View style={styles.redBadge}><Text style={styles.redBadgeText}>🛠️</Text></View>
              </View>
              <Text style={[styles.iconLabel, { color: activeColors.subtext }]}>Đang sửa</Text>
            </TouchableOpacity>

            {/* Chờ nhận */}
            <TouchableOpacity style={styles.shopeeCol} onPress={() => {
              Alert.alert('Chờ nhận xe 🧼', 'Xe máy Honda SH 160i (Biển số: 60-A1 555.55) của bạn đã hoàn thành bảo dưỡng toàn bộ 15 hạng mục & rửa bọt tuyết bóng loáng! Xin mời quý khách tới Bàn kỹ thuật số 3 Biên Hòa để nhận bàn giao.');
            }}>
              <View style={[styles.iconCircle, { backgroundColor: activeColors.settingsIconBg, borderColor: activeColors.settingsIconBorder }]}>
                <Sparkles color="#10B981" size={22} />
                <View style={styles.redBadge}><Text style={styles.redBadgeText}>1</Text></View>
              </View>
              <Text style={[styles.iconLabel, { color: activeColors.subtext }]}>Chờ nhận</Text>
            </TouchableOpacity>

            {/* Đánh giá */}
            <TouchableOpacity style={styles.shopeeCol} onPress={() => Alert.alert('Đánh giá dịch vụ ⭐️', 'Nơi đánh giá chất lượng tay nghề kỹ thuật viên và phục vụ của showroom Biên Hòa sau sửa chữa.')}>
              <View style={[styles.iconCircle, { backgroundColor: activeColors.settingsIconBg, borderColor: activeColors.settingsIconBorder }]}>
                <Star color="#EC4899" size={22} />
              </View>
              <Text style={[styles.iconLabel, { color: activeColors.subtext }]}>Đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🛍️ KHỐI 3: ĐƠN HÀNG PHỤ TÙNG (Order Status) */}
        <View style={[styles.blockContainer, { backgroundColor: activeColors.cardBg, borderColor: activeColors.border }]}>
          <Text style={[styles.blockTitle, { color: activeColors.text }]}>🛍️ ĐƠN HÀNG PHỤ TÙNG & PHỤ KIỆN</Text>
          
          <View style={styles.shopeeRow}>
            {/* Chờ XN */}
            <TouchableOpacity style={styles.shopeeCol} onPress={() => Alert.alert('Trạng thái', 'Đơn hàng nhớt Motul 300V đang chờ nhân viên showroom xác nhận tồn kho.')}>
              <View style={[styles.iconCircle, { backgroundColor: activeColors.settingsIconBg, borderColor: activeColors.settingsIconBorder }]}>
                <Clock color="#94A3B8" size={22} />
              </View>
              <Text style={[styles.iconLabel, { color: activeColors.subtext }]}>Chờ XN</Text>
            </TouchableOpacity>

            {/* Chuẩn bị */}
            <TouchableOpacity style={styles.shopeeCol} onPress={() => Alert.alert('Trạng thái', 'Đơn hàng ốp pô inox carbon đang được đóng gói chuẩn bị giao.')}>
              <View style={[styles.iconCircle, { backgroundColor: activeColors.settingsIconBg, borderColor: activeColors.settingsIconBorder }]}>
                <Package color="#A855F7" size={22} />
                <View style={styles.redBadge}><Text style={styles.redBadgeText}>2</Text></View>
              </View>
              <Text style={[styles.iconLabel, { color: activeColors.subtext }]}>Chuẩn bị</Text>
            </TouchableOpacity>

            {/* Đang giao */}
            <TouchableOpacity style={styles.shopeeCol} onPress={() => setMapTrackingModalVisible(true)}>
              <View style={[styles.iconCircle, styles.glowBorder, { backgroundColor: activeColors.settingsIconBg, borderColor: activeColors.settingsIconBorder }]}>
                <Truck color="#3B82F6" size={22} />
                <View style={styles.blueBadgeDot} />
              </View>
              <Text style={[styles.iconLabel, { color: '#3B82F6', fontWeight: 'bold' }]}>Đang giao</Text>
            </TouchableOpacity>

            {/* Hoàn thành */}
            <TouchableOpacity style={styles.shopeeCol} onPress={() => Alert.alert('Trạng thái', 'Lịch sử lưu trữ các đơn hàng phụ tùng đã nhận.')}>
              <View style={[styles.iconCircle, { backgroundColor: activeColors.settingsIconBg, borderColor: activeColors.settingsIconBorder }]}>
                <CheckCircle color="#10B981" size={22} />
              </View>
              <Text style={[styles.iconLabel, { color: activeColors.subtext }]}>Hoàn thành</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 📜 KHỐI 5: MENU DANH SÁCH DỌC */}
        <View style={[styles.blockContainer, { backgroundColor: activeColors.cardBg, borderColor: activeColors.border }]}>
          <GlassCard style={[styles.settingsCard, { backgroundColor: activeColors.settingsCardBg }]} intensity={isDark ? 8 : 0}>
            {/* Thông tin cá nhân */}
            <TouchableOpacity style={[styles.settingRow, { borderBottomColor: activeColors.border }]} onPress={() => openEditField('profile')}>
              <View style={[styles.settingInfo, { flexDirection: 'row', alignItems: 'center' }]}>
                <View style={[styles.listIconCircle, { backgroundColor: activeColors.listIconBg }]}>
                  <User color="#3B82F6" size={16} />
                </View>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.settingTitle, { color: activeColors.text }]}>Thông tin cá nhân</Text>
                  <Text style={[styles.settingDesc, { color: activeColors.subtext }]} numberOfLines={1} ellipsizeMode="tail">Ngày sinh, Giới tính, Email, Địa chỉ nhận xe</Text>
                </View>
              </View>
              <ChevronRight color={activeColors.subtext} size={18} />
            </TouchableOpacity>

            {/* Nhà xe của tôi */}
            <TouchableOpacity style={[styles.settingRow, { borderBottomColor: activeColors.border }]} onPress={() => navigation.navigate('MyVehicles')}>
              <View style={[styles.settingInfo, { flexDirection: 'row', alignItems: 'center' }]}>
                <View style={[styles.listIconCircle, { backgroundColor: activeColors.listIconBg }]}>
                  <MapPin color="#10B981" size={16} />
                </View>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.settingTitle, { color: activeColors.text }]}>Nhà xe của tôi (My Garage)</Text>
                  <Text style={[styles.settingDesc, { color: activeColors.subtext }]} numberOfLines={1} ellipsizeMode="tail">Quản lý và chuyển đổi nhanh giữa các xe đang sở hữu</Text>
                </View>
              </View>
              <ChevronRight color={activeColors.subtext} size={18} />
            </TouchableOpacity>

            {/* Đăng ký thêm xe mới */}
            <TouchableOpacity style={[styles.settingRow, { borderBottomColor: activeColors.border }]} onPress={() => navigation.navigate('MyVehicles', { openAddModal: true })}>
              <View style={[styles.settingInfo, { flexDirection: 'row', alignItems: 'center' }]}>
                <View style={[styles.listIconCircle, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                  <PlusCircle color="#10B981" size={16} />
                </View>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.settingTitle, { color: activeColors.text }]}>Đăng ký thêm xe mới 🏍️</Text>
                  <Text style={[styles.settingDesc, { color: activeColors.subtext }]} numberOfLines={1} ellipsizeMode="tail">Thêm xe mới vào hệ thống bảo dưỡng thông minh</Text>
                </View>
              </View>
              <ChevronRight color={activeColors.subtext} size={18} />
            </TouchableOpacity>

            {/* Lịch sử mua hàng & Hóa đơn */}
            <TouchableOpacity style={[styles.settingRow, styles.settingRowLast]} onPress={() => navigation.navigate('InvoiceScreen')}>
              <View style={[styles.settingInfo, { flexDirection: 'row', alignItems: 'center' }]}>
                <View style={[styles.listIconCircle, { backgroundColor: activeColors.listIconBg }]}>
                  <FileText color="#F59E0B" size={16} />
                </View>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.settingTitle, { color: activeColors.text }]}>Lịch sử mua hàng & Hóa đơn</Text>
                  <Text style={[styles.settingDesc, { color: activeColors.subtext }]} numberOfLines={1} ellipsizeMode="tail">Xem lại các hóa đơn sửa xe cũ dạng PDF</Text>
                </View>
              </View>
              <ChevronRight color={activeColors.subtext} size={18} />
            </TouchableOpacity>
          </GlassCard>
        </View>

        {/* 💬 Trung tâm hỗ trợ row */}
        <TouchableOpacity style={[styles.supportRow, { backgroundColor: activeColors.supportRowBg, borderColor: activeColors.supportRowBorder }]} onPress={() => navigation.navigate('SupportScreen')}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <Star color="#EC4899" size={20} fill="#EC4899" style={{ marginRight: 10 }} />
            <Text style={[styles.supportRowTitle, { color: activeColors.text, fontSize: 15, fontWeight: 'bold' }]}>Trung tâm hỗ trợ khách hàng</Text>
          </View>
          <ChevronRight color={activeColors.subtext} size={18} />
        </TouchableOpacity>
      </ScrollView>

      {/* ⚙️ MODAL: SYSTEM SETTINGS (CÀI ĐẶT HỆ THỐNG) */}
      <Modal visible={settingsModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setSettingsModalVisible(false)} />
          <View style={[styles.avatarModalSheet, { height: '65%', backgroundColor: activeColors.modalBg, borderColor: activeColors.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }]} />
            <Text style={[styles.modalTitle, { color: activeColors.text, marginBottom: verticalScale(15) }]}>⚙️ CÀI ĐẶT HỆ THỐNG</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              <GlassCard style={{ padding: 5, borderRadius: 12, backgroundColor: activeColors.settingsCardBg }} intensity={isDark ? 5 : 0}>
                {/* Maintenance Notify */}
                <View style={[styles.settingRow, { borderBottomColor: activeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: activeColors.text }]}>Nhắc lịch bảo dưỡng & Kỹ thuật</Text>
                    <Text style={[styles.settingDesc, { color: activeColors.subtext }]}>Nhận cảnh báo thay nhớt, kiểm tra định kỳ</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.toggle, profile.settings.maintenanceNotifications && styles.toggleOn]} 
                    onPress={() => handleToggleSetting('maintenanceNotifications', profile.settings.maintenanceNotifications)}
                  >
                    <View style={[styles.toggleDot, profile.settings.maintenanceNotifications && styles.toggleDotOn]} />
                  </TouchableOpacity>
                </View>

                {/* Biometrics FaceID */}
                <View style={[styles.settingRow, { borderBottomColor: activeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: activeColors.text }]}>Đăng nhập bằng FaceID / Vân tay</Text>
                    <Text style={[styles.settingDesc, { color: activeColors.subtext }]}>Bảo mật cao và mở khoá một chạm tiện lợi</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.toggle, profile.settings.biometricLogin && styles.toggleOn]} 
                    onPress={() => handleToggleSetting('biometricLogin', profile.settings.biometricLogin)}
                  >
                    <View style={[styles.toggleDot, profile.settings.biometricLogin && styles.toggleDotOn]} />
                  </TouchableOpacity>
                </View>

                {/* Change Password */}
                <TouchableOpacity style={[styles.settingRow, { borderBottomColor: activeColors.border }]} onPress={() => {
                  setSettingsModalVisible(false);
                  openEditField('password');
                }}>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: activeColors.text }]}>Đổi mật khẩu bảo mật</Text>
                    <Text style={[styles.settingDesc, { color: activeColors.subtext }]}>Thay đổi mã PIN hoặc mật khẩu định danh</Text>
                  </View>
                  <ChevronRight color={activeColors.subtext} size={18} />
                </TouchableOpacity>

                {/* App Language */}
                <TouchableOpacity style={[styles.settingRow, { borderBottomColor: activeColors.border }]} onPress={() => {
                  setSettingsModalVisible(false);
                  openEditField('language');
                }}>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: activeColors.text }]}>Ngôn ngữ ứng dụng</Text>
                    <Text style={[styles.settingDesc, { color: activeColors.subtext }]}>Đang dùng: {profile.settings.language === 'vi' ? 'Tiếng Việt 🇻🇳' : 'English 🇬🇧'}</Text>
                  </View>
                  <ChevronRight color={activeColors.subtext} size={18} />
                </TouchableOpacity>

                {/* App Theme */}
                <TouchableOpacity style={[styles.settingRow, styles.settingRowLast]} onPress={() => {
                  setSettingsModalVisible(false);
                  openEditField('theme');
                }}>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: activeColors.text }]}>Giao diện ứng dụng</Text>
                    <Text style={[styles.settingDesc, { color: activeColors.subtext }]}>
                      Đang dùng: {profile.settings.theme === 'light' ? 'Sáng ☀️' : profile.settings.theme === 'dark' ? 'Tối 🌙' : 'Hệ thống ⚙️'}
                    </Text>
                  </View>
                  <ChevronRight color={activeColors.subtext} size={18} />
                </TouchableOpacity>
              </GlassCard>

              {/* Danger Zone Pinned under settings */}
              <View style={{ marginTop: 25, marginBottom: 20 }}>
                <TouchableOpacity style={styles.logoutBtn} onPress={() => {
                  setSettingsModalVisible(false);
                  handleLogout();
                }}>
                  <LogOut color={Theme.staticColors.text} size={18} style={{ marginRight: 8 }} />
                  <Text style={styles.logoutText}>Đăng xuất khỏi tài khoản</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.deleteBtn, { marginTop: 10 }]} onPress={() => {
                  setSettingsModalVisible(false);
                  handleDeleteAccount();
                }}>
                  <Trash2 color={Theme.staticColors.secondary} size={18} style={{ marginRight: 8 }} />
                  <Text style={styles.deleteText}>Xóa tài khoản vĩnh viễn</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 👑 MODAL: GOLD MEMBERSHIP PRIVILEGES */}
      <Modal visible={privilegesModalVisible} transparent animationType="fade">
        <View style={[styles.modalOverlay, { justifyContent: 'center' }]}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setPrivilegesModalVisible(false)} />
          <View style={[styles.avatarModalSheet, { width: '88%', height: '55%', alignSelf: 'center', borderRadius: 24, padding: 24 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingBottom: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Award color="#F59E0B" size={24} fill="#F59E0B" style={{ marginRight: 8 }} />
                <Text style={[styles.modalTitle, { marginBottom: 0, color: '#F59E0B' }]}>ĐẶC QUYỀN HẠNG VÀNG</Text>
              </View>
              <TouchableOpacity onPress={() => setPrivilegesModalVisible(false)}>
                <Text style={{ color: Theme.staticColors.subtext, fontSize: 13, fontWeight: 'bold' }}>ĐÓNG</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 15 }}>
              <Text style={{ color: '#fff', fontSize: 13, fontStyle: 'italic', marginBottom: 15, lineHeight: 18 }}>👑 Chúc mừng Nguyễn An Khôi! Bạn đang sở hữu thẻ hội viên Vàng (Gold Member) danh giá của hệ thống AnhEmMotor.</Text>
              
              <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text style={{ color: '#F59E0B', marginRight: 8, fontSize: 16 }}>✦</Text>
                <Text style={{ color: Theme.staticColors.text, fontSize: 13, lineHeight: 18 }}>Giảm giá ngay <Text style={{ color: '#F59E0B', fontWeight: 'bold' }}>10% công thợ & linh kiện</Text> trên mọi hóa đơn sửa chữa tại Biên Hòa.</Text>
              </View>
              
              <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text style={{ color: '#F59E0B', marginRight: 8, fontSize: 16 }}>✦</Text>
                <Text style={{ color: Theme.staticColors.text, fontSize: 13, lineHeight: 18 }}>Tặng miễn phí một chai <Text style={{ color: '#F59E0B', fontWeight: 'bold' }}>Nhớt máy Motul cao cấp</Text> vào tháng sinh nhật của bạn.</Text>
              </View>

              <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text style={{ color: '#F59E0B', marginRight: 8, fontSize: 16 }}>✦</Text>
                <Text style={{ color: Theme.staticColors.text, fontSize: 13, lineHeight: 18 }}>Sử dụng <Text style={{ color: '#F59E0B', fontWeight: 'bold' }}>Phòng chờ VIP Lounge</Text> phục vụ nước ngọt, trà gừng, cà phê máy hạt miễn phí.</Text>
              </View>

              <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text style={{ color: '#F59E0B', marginRight: 8, fontSize: 16 }}>✦</Text>
                <Text style={{ color: Theme.staticColors.text, fontSize: 13, lineHeight: 18 }}>Đặc quyền <Text style={{ color: '#F59E0B', fontWeight: 'bold' }}>Ưu tiên bảo dưỡng</Text>, kỹ thuật viên trưởng trực tiếp xử lý không cần bốc số xếp hàng.</Text>
              </View>

              <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text style={{ color: '#F59E0B', marginRight: 8, fontSize: 16 }}>✦</Text>
                <Text style={{ color: Theme.staticColors.text, fontSize: 13, lineHeight: 18 }}>Hỗ trợ <Text style={{ color: '#F59E0B', fontWeight: 'bold' }}>Xe cứu hộ khẩn cấp 24/7</Text> miễn phí trong bán kính 15km tại khu vực Đồng Nai.</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 🛠️ MODAL: LIVE WORKSHOP PROGRESS (ĐANG SỬA CHỮA) */}
      <Modal visible={liveWorkshopModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setLiveWorkshopModalVisible(false)} />
          <View style={[styles.avatarModalSheet, { height: '62%' }]}>
            <View style={styles.modalHandle} />
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Wrench color={Theme.staticColors.warning} size={22} style={{ marginRight: 8 }} />
                <Text style={[styles.modalTitle, { marginBottom: 0 }]}>TIẾN ĐỘ SỬA XE KHÁCH HÀNG</Text>
              </View>
              <TouchableOpacity onPress={() => setLiveWorkshopModalVisible(false)}>
                <Text style={{ color: Theme.staticColors.subtext, fontSize: 12 }}>ĐÓNG</Text>
              </TouchableOpacity>
            </View>

            {/* Bike details */}
            <GlassCard style={{ padding: 12, borderRadius: 12, marginBottom: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }} intensity={3}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070' }} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>HONDA SH 160i ABS</Text>
                <Text style={{ color: Theme.staticColors.subtext, fontSize: 12, marginTop: 2 }}>Biển số: 60-A1 555.55 • Bàn kỹ thuật 3</Text>
                <Text style={{ color: Theme.staticColors.warning, fontSize: 11, fontWeight: 'bold', marginTop: 4 }}>🛠️ Đang sửa chữa trực tiếp tại xưởng</Text>
              </View>
            </GlassCard>

            {/* Mechanical technician */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(15), borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)', paddingBottom: 12 }}>
              <Image source={{ uri: 'https://img.freepik.com/free-photo/handsome-mechanic-workshop_23-2148316719.jpg' }} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }} />
              <View>
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>KTV: Nguyễn Văn Hùng</Text>
                <Text style={{ color: Theme.staticColors.subtext, fontSize: 11 }}>Trưởng nhóm Kỹ thuật • 8 năm kinh nghiệm (5★)</Text>
              </View>
            </View>

            {/* Stepper Timeline */}
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              <View style={{ paddingLeft: 12 }}>
                {/* Step 1 */}
                <View style={{ flexDirection: 'row', borderLeftWidth: 2, borderColor: '#10B981', paddingLeft: 16, paddingBottom: 15, position: 'relative' }}>
                  <View style={{ position: 'absolute', left: -7, top: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981' }} />
                  <View style={{ marginBottom: 15 }}>
                    <Text style={{ color: '#10B981', fontSize: 12, fontWeight: 'bold' }}>✓ NHẬN XE & KHẢO SÁT LỖI (Đã Xong)</Text>
                    <Text style={{ color: Theme.staticColors.subtext, fontSize: 11, marginTop: 2 }}>08:30 — Khảo sát xước xác vỏ máy, đo dòng điện ắc quy định kỳ.</Text>
                  </View>
                </View>

                {/* Step 2 */}
                <View style={{ flexDirection: 'row', borderLeftWidth: 2, borderColor: '#10B981', paddingLeft: 16, paddingBottom: 15, position: 'relative' }}>
                  <View style={{ position: 'absolute', left: -7, top: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981' }} />
                  <View style={{ marginBottom: 15 }}>
                    <Text style={{ color: '#10B981', fontSize: 12, fontWeight: 'bold' }}>✓ XẢ NHỚT CŨ & VỆ SINH BUỒNG ĐỐT (Đã Xong)</Text>
                    <Text style={{ color: Theme.staticColors.subtext, fontSize: 11, marginTop: 2 }}>08:50 — Đã vệ sinh sạch muội carbon bằng dung dịch NX5000 Nhật Bản.</Text>
                  </View>
                </View>

                {/* Step 3 */}
                <View style={{ flexDirection: 'row', borderLeftWidth: 2, borderColor: Theme.staticColors.warning, paddingLeft: 16, paddingBottom: 15, position: 'relative' }}>
                  <View style={{ position: 'absolute', left: -7, top: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: Theme.staticColors.warning }} />
                  <View style={{ marginBottom: 15 }}>
                    <Text style={{ color: Theme.staticColors.warning, fontSize: 12, fontWeight: 'bold' }}>⚡ THAY ĐĨA PHANH & BỐ THẮNG NISSIN (Đang làm...)</Text>
                    <Text style={{ color: '#fff', fontSize: 11, marginTop: 2 }}>09:15 — Đang tháo má phanh cũ mòn, căn chỉnh đĩa thắng ABS lực bám chuẩn.</Text>
                  </View>
                </View>

                {/* Step 4 */}
                <View style={{ flexDirection: 'row', borderLeftWidth: 2, borderColor: 'rgba(255,255,255,0.08)', paddingLeft: 16, position: 'relative' }}>
                  <View style={{ position: 'absolute', left: -7, top: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>VỆ SINH NỒI, CÔN & RỬA BỌT TUYẾT (Chờ xử lý)</Text>
                    <Text style={{ color: Theme.staticColors.subtext, fontSize: 11, marginTop: 2 }}>Dự kiến hoàn thiện trong vòng 30 phút nữa.</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 🗺️ MODAL: LIVE GPS DELIVERING MAP TRACKING (CHI TIẾT VẬN CHUYỂN TÍCH HỢP MAP) */}
      <Modal visible={mapTrackingModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setMapTrackingModalVisible(false)} />
          <View style={[styles.avatarModalSheet, { height: '82%', padding: 0 }]}>
            {/* Split Screen Nửa trên: Bản đồ GPS Map */}
            <View style={{ height: '42%', backgroundColor: '#0f172a', position: 'relative', overflow: 'hidden', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              
              {/* Fake Live GPS Map graphics (Dark Theme map layout) */}
              {/* Route line */}
              <View style={{ position: 'absolute', top: '50%', left: '15%', right: '15%', height: 4, backgroundColor: 'rgba(59,130,246,0.3)', transform: [{ rotate: '-25deg' }] }} />
              <View style={{ position: 'absolute', top: '48%', left: '15%', right: '35%', height: 4, backgroundColor: '#3B82F6', transform: [{ rotate: '-25deg' }] }} />
              
              {/* Showroom point */}
              <View style={{ position: 'absolute', top: '70%', left: '12%', alignItems: 'center' }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#EC4899', borderWidth: 2, borderColor: '#fff' }} />
                <Text style={{ color: Theme.staticColors.subtext, fontSize: 9, fontWeight: 'bold', marginTop: 4 }}>Kho Biên Hòa</Text>
              </View>

              {/* Customer Home point */}
              <View style={{ position: 'absolute', top: '25%', right: '12%', alignItems: 'center' }}>
                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#10B981', borderWidth: 2.5, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                  <MapPin color="#fff" size={8} />
                </View>
                <Text style={{ color: '#10B981', fontSize: 9, fontWeight: 'bold', marginTop: 4 }}>Nhà của bạn</Text>
              </View>

              {/* Driver Marker (Lái xe di động) */}
              <Animated.View style={{ position: 'absolute', top: '44%', left: '46%', alignItems: 'center' }}>
                <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={{ width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#fff', shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 6 }}>
                  <Truck color="#fff" size={16} />
                </LinearGradient>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#3B82F6', marginTop: 2, alignSelf: 'center' }} />
              </Animated.View>

              {/* Close Button map overlay */}
              <TouchableOpacity onPress={() => setMapTrackingModalVisible(false)} style={{ position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(15,23,42,0.7)', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>×</Text>
              </TouchableOpacity>

              {/* ETA Indicator */}
              <View style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(15,23,42,0.85)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)', flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#3B82F6" style={{ marginRight: 8 }} />
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>🚚 Shipper đang đến • ETA: 12 phút</Text>
              </View>
            </View>

            {/* Split Screen Nửa dưới: Dòng thời gian & Tài xế */}
            <View style={{ flex: 1, padding: 20, backgroundColor: Theme.staticColors.background }}>
              {/* Handle sheet indicator */}
              <View style={[styles.modalHandle, { alignSelf: 'center', marginBottom: 15 }]} />

              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14, marginBottom: 12 }}>THEO DÕI VẬN CHUYỂN PHỤ TÙNG</Text>

              {/* Driver info card */}
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 15 }}>
                <Image source={{ uri: 'https://img.freepik.com/free-photo/courier-man-delivering-packages-delivery-concept_1150-51152.jpg' }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>Tài xế: Trần Minh Hải</Text>
                  <Text style={{ color: Theme.staticColors.subtext, fontSize: 11 }}>Vận chuyển AEM • Xe máy: 60-B1 999.99</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Đang kết nối 📞', 'Hệ thống đang kết nối cuộc gọi thoại an toàn đến shipper Trần Minh Hải...')} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(16,185,129,0.1)', justifyContent: 'center', alignItems: 'center' }}>
                  <Phone color="#10B981" size={16} />
                </TouchableOpacity>
              </View>

              {/* Logistics Timeline logs */}
              <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                {/* 1 */}
                <View style={{ flexDirection: 'row', borderLeftWidth: 1.5, borderColor: '#3B82F6', paddingLeft: 14, paddingBottom: 12, position: 'relative' }}>
                  <View style={{ position: 'absolute', left: -5, top: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', shadowColor: '#3B82F6', shadowRadius: 4, shadowOpacity: 0.8 }} />
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ color: '#3B82F6', fontSize: 12, fontWeight: 'bold' }}>14:05 — Shipper đang giao hàng đến khu vực Phường Quyết Thắng</Text>
                    <Text style={{ color: Theme.staticColors.subtext, fontSize: 10 }}>Hàng đang di chuyển qua đường Cách Mạng Tháng Tám, Biên Hòa.</Text>
                  </View>
                </View>

                {/* 2 */}
                <View style={{ flexDirection: 'row', borderLeftWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)', paddingLeft: 14, paddingBottom: 12, position: 'relative' }}>
                  <View style={{ position: 'absolute', left: -5, top: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>11:20 — Đơn hàng đã xuất kho tổng showroom Biên Hòa</Text>
                    <Text style={{ color: Theme.staticColors.subtext, fontSize: 10 }}>Linh kiện phụ tùng đóng gói đầy đủ hóa đơn bảo hành chính hãng.</Text>
                  </View>
                </View>

                {/* 3 */}
                <View style={{ flexDirection: 'row', borderLeftWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)', paddingLeft: 14, position: 'relative' }}>
                  <View style={{ position: 'absolute', left: -5, top: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>09:30 — Đơn hàng đã đóng gói hoàn tất</Text>
                    <Text style={{ color: Theme.staticColors.subtext, fontSize: 10 }}>Nhân viên phụ tùng AEM kiểm kho & niêm phong màng co chống thấm nước.</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🎟️ MODAL: VÍ VOUCHER (QR VOUCHER SCANNER & CARD) */}
      <Modal visible={voucherModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setVoucherModalVisible(false)} />
          <View style={[styles.avatarModalSheet, { height: '62%' }]}>
            <View style={styles.modalHandle} />
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CreditCard color={Theme.staticColors.primary} size={22} style={{ marginRight: 8 }} />
                <Text style={[styles.modalTitle, { marginBottom: 0 }]}>VÍ VOUCHER QUÀ TẶNG AEM</Text>
              </View>
              <TouchableOpacity onPress={() => setVoucherModalVisible(false)}>
                <Text style={{ color: Theme.staticColors.subtext, fontSize: 12 }}>ĐÓNG</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ color: Theme.staticColors.subtext, fontSize: 11, fontStyle: 'italic', marginBottom: 15 }}>💡 Chọn một Voucher để tạo mã QR thanh toán nhanh tại quầy thu ngân.</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              {/* Voucher 1 */}
              <TouchableOpacity 
                style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.02)', borderLeftWidth: 4, borderLeftColor: '#EC4899', borderRadius: 12, padding: 12, marginBottom: 12, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}
                onPress={() => {
                  Alert.alert('Thành công', 'Đã kích hoạt mã giảm giá công thợ! Mã QR quét đang khả dụng.');
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#EC4899', fontWeight: 'bold', fontSize: 13 }}>[GIẢM 50K] GIẢM GIÁ CÔNG THỢ</Text>
                  <Text style={{ color: '#fff', fontSize: 11, marginTop: 4 }}>Miễn phí 50K tiền công khi đặt bảo dưỡng định kỳ trên App.</Text>
                  <Text style={{ color: Theme.staticColors.subtext, fontSize: 10, marginTop: 4 }}>Hạn dùng: Còn 22 ngày (Áp dụng showroom Biên Hòa)</Text>
                </View>
                <ChevronRight color={Theme.staticColors.subtext} size={18} style={{ alignSelf: 'center' }} />
              </TouchableOpacity>

              {/* Voucher 2 */}
              <TouchableOpacity 
                style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.02)', borderLeftWidth: 4, borderLeftColor: '#10B981', borderRadius: 12, padding: 12, marginBottom: 12, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}
                onPress={() => {
                  Alert.alert('Thành công', 'Đã kích hoạt mã miễn phí rửa xe bọt tuyết siêu sạch!');
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: 13 }}>[MIỄN PHÍ] RỬA XE BỌT TUYẾT SIÊU SẠCH</Text>
                  <Text style={{ color: '#fff', fontSize: 11, marginTop: 4 }}>Tặng 1 suất rửa xe bọt tuyết chuyên sâu làm bóng thân vỏ máy.</Text>
                  <Text style={{ color: Theme.staticColors.subtext, fontSize: 10, marginTop: 4 }}>Hạn dùng: Đặc quyền sinh nhật tháng 5 của bạn</Text>
                </View>
                <ChevronRight color={Theme.staticColors.subtext} size={18} style={{ alignSelf: 'center' }} />
              </TouchableOpacity>

              {/* Voucher 3 */}
              <TouchableOpacity 
                style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.02)', borderLeftWidth: 4, borderLeftColor: '#F59E0B', borderRadius: 12, padding: 12, marginBottom: 18, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}
                onPress={() => {
                  Alert.alert('Thành công', 'Đã kích hoạt mã giảm giá dầu nhớt Motul 15%!');
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: 13 }}>[GIẢM 15%] GIẢM DẦU NHỚT CHÍNH HÃNG</Text>
                  <Text style={{ color: '#fff', fontSize: 11, marginTop: 4 }}>Giảm trực tiếp 15% khi thay nhớt Motul 300V hoặc nhớt hãng Honda.</Text>
                  <Text style={{ color: Theme.staticColors.subtext, fontSize: 10, marginTop: 4 }}>Hạn dùng: Ưu đãi tri ân khách hàng thân thiết</Text>
                </View>
                <ChevronRight color={Theme.staticColors.subtext} size={18} style={{ alignSelf: 'center' }} />
              </TouchableOpacity>

              {/* Simulated QR barcode display */}
              <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 16, alignItems: 'center', marginTop: 10 }}>
                {/* Simulated Barcode */}
                <View style={{ height: 45, width: '90%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'stretch', marginBottom: 8 }}>
                  <View style={{ width: 4, backgroundColor: '#000' }} /><View style={{ width: 1, backgroundColor: '#000' }} /><View style={{ width: 2, backgroundColor: '#000' }} /><View style={{ width: 4, backgroundColor: '#000' }} /><View style={{ width: 1, backgroundColor: '#000' }} /><View style={{ width: 3, backgroundColor: '#000' }} /><View style={{ width: 1, backgroundColor: '#000' }} /><View style={{ width: 4, backgroundColor: '#000' }} /><View style={{ width: 2, backgroundColor: '#000' }} /><View style={{ width: 1, backgroundColor: '#000' }} /><View style={{ width: 3, backgroundColor: '#000' }} /><View style={{ width: 2, backgroundColor: '#000' }} /><View style={{ width: 4, backgroundColor: '#000' }} /><View style={{ width: 1, backgroundColor: '#000' }} /><View style={{ width: 3, backgroundColor: '#000' }} /><View style={{ width: 4, backgroundColor: '#000' }} /><View style={{ width: 1, backgroundColor: '#000' }} /><View style={{ width: 2, backgroundColor: '#000' }} /><View style={{ width: 4, backgroundColor: '#000' }} /><View style={{ width: 1, backgroundColor: '#000' }} />
                </View>
                <Text style={{ color: '#000', fontSize: 11, letterSpacing: 3, fontWeight: 'bold' }}>AEM-VOUCHER-6899-7755</Text>
                
                {/* Scanning green line overlay */}
                <View style={{ height: 1.5, width: '94%', backgroundColor: '#10B981', marginTop: 10, shadowColor: '#10B981', shadowRadius: 3, shadowOpacity: 0.8 }} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL: AVATAR CHANGE SHEET */}
      <Modal visible={avatarModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setAvatarModal(false)} />
          <View style={styles.avatarModalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Thay đổi ảnh đại diện 📸</Text>
            
            {/* Action buttons (Camera / Library) */}
            <View style={styles.avatarActionRow}>
              <TouchableOpacity 
                style={styles.avatarActionButton}
                onPress={() => handleSelectPhoto('camera')}
              >
                <Camera color={Theme.staticColors.primary} size={18} style={{ marginRight: 6 }} />
                <Text style={styles.avatarActionText}>Chụp ảnh mới</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.avatarActionButton}
                onPress={() => handleSelectPhoto('gallery')}
              >
                <Camera color={Theme.staticColors.primary} size={18} style={{ marginRight: 6 }} />
                <Text style={styles.avatarActionText}>Chọn từ thư viện</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalTitle, { fontSize: 14, marginBottom: 15, marginTop: 10 }]}>Hoặc chọn ảnh hoạt hoạ độc quyền 🎨</Text>
            <View style={styles.avatarGrid}>
              {cartoonAvatars.map((url, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  onPress={() => handleSelectCartoonAvatar(url)} 
                  style={[
                    styles.avatarOption, 
                    profile.licenseImage === url && styles.selectedAvatarOption
                  ]}
                >
                  <Image source={{ uri: url }} style={styles.avatarOptionImg} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* CUSTOM BOTTOM SHEET: CORE INFO EDITING (Clean Architecture + Sticky Bottom) */}
      <CustomBottomSheet 
        ref={bottomSheetRef}
        title={getBottomSheetTitle()}
        themeMode={profile.settings?.theme || 'dark'}
        onClose={() => {
          setActiveField(null);
          setActiveRegionList(null);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ width: '100%' }}
        >
          {/* Scrollable Form fields */}
          {renderBottomSheetFields()}

          {/* 📐 STICKY BOTTOM BUTTON: pinned above virtual keyboard */}
          <View style={styles.stickyButtonWrapper}>
            <TouchableOpacity 
              style={[styles.primaryButton, isSaving && styles.buttonDisabled]} 
              disabled={isSaving}
              onPress={handleSaveField}
            >
              {isSaving ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
                  <Text style={styles.primaryButtonText}>Đang lưu thay đổi...</Text>
                </View>
              ) : (
                <Text style={styles.primaryButtonText}>Lưu Cập Nhật Hồ Sơ</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </CustomBottomSheet>
    </SafeAreaView>
  );
}
