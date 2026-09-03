import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';

import { UserProfile } from '../../domain/entities/UserProfile';
import { useGlobalState } from '../../../../context/GlobalState';
import { useDependency } from '../../../../di/DependencyContext';
import { resetRoot } from '../../../../navigation/RootNavigation';
import { tokenService } from '../../../../api/httpClient';
import { getPersonalOutputsApi } from '../../../../api/orderApi';
import { getPersonalRepairsApi } from '../../../../api/repairApi';
import { resolveMediaUrl } from '../../../../utils/imageHelpers';

export const MOCK_REGIONS = {
  provinces: ['Hồ Chí Minh', 'Đồng Nai', 'Hà Nội', 'Bình Dương'],
  districts: {
    'Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 9', 'Thành phố Thủ Đức', 'Quận Bình Thạnh'],
    'Đồng Nai': ['Thành phố Biên Hòa', 'Huyện Long Thành', 'Huyện Nhơn Trạch', 'Huyện Trảng Bom'],
    'Hà Nội': ['Quận Hoàn Kiếm', 'Quận Cầu Giấy', 'Quận Đống Đa', 'Quận Hai Bà Trưng'],
    'Bình Dương': ['Thành phố Thủ Dầu Một', 'Thành phố Thuận An', 'Thành phố Dĩ An'],
  },
  wards: {
    'Quận 9': [
      'Phường Hiệp Phú',
      'Phường Tăng Nhơn Phú A',
      'Phường Tăng Nhơn Phú B',
      'Phường Long Thạnh Mỹ',
    ],
    'Thành phố Thủ Đức': [
      'Phường Thảo Điền',
      'Phường An Phú',
      'Phường Bình An',
      'Phường Linh Trung',
    ],
    'Thành phố Biên Hòa': [
      'Phường Quyết Thắng',
      'Phường Tân Phong',
      'Phường Trung Dũng',
      'Phường Trảng Dài',
    ],
    'Huyện Long Thành': ['Thị trấn Long Thành', 'Xã An Phước', 'Xã Lộc An', 'Xã Long Đức'],
    'Quận Hoàn Kiếm': ['Phường Hàng Bạc', 'Phường Tràng Tiền', 'Phường Đồng Xuân'],
    'Thành phố Thủ Dầu Một': ['Phường Phú Cường', 'Phường Hiệp Thành', 'Phường Chánh Nghĩa'],
  },
};

export const useProfileController = (navigation, bottomSheetRef) => {
  const ImagePicker = require('expo-image-picker');
  const Haptics = require('expo-haptics');
  const {
    getProfileUseCase,
    updateProfileUseCase,
    updateSettingsUseCase,
    uploadAvatarUseCase,
    profileRepository: repository,
  } = useDependency();
  const { setThemeMode } = useGlobalState();
  const [profile, setProfile] = useState(new UserProfile());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [activeField, setActiveField] = useState(null);
  const [tempData, setTempData] = useState({});

  const [personalOutputs, setPersonalOutputs] = useState([]);
  const [personalRepairs, setPersonalRepairs] = useState([]);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const loadProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getProfileUseCase.execute();
      setProfile(data);

      try {
        const [outputsRes, repairsRes] = await Promise.all([
          getPersonalOutputsApi(),
          getPersonalRepairsApi(),
        ]);
        const outData =
          outputsRes?.data || outputsRes?.value || (Array.isArray(outputsRes) ? outputsRes : []);
        const repData =
          repairsRes?.data || repairsRes?.value || (Array.isArray(repairsRes) ? repairsRes : []);

        if (Array.isArray(outData)) {
          setPersonalOutputs(
            outData.map((o) => ({
              id: o.id || o.Id,
              statusId: o.statusId || o.StatusId,
              total: o.total || o.Total,
              paymentMethod: o.paymentMethod || o.PaymentMethod,
              createdAt: o.createdAt || o.CreatedAt,
              notes: o.notes || o.Notes,
              productName: o.productName || o.ProductName,
              productImage: resolveMediaUrl(o.productImage || o.ProductImage),
              quantity: o.quantity || o.Quantity,
              expectedDeliveryDate: o.expectedDeliveryDate || o.ExpectedDeliveryDate,
            }))
          );
        }
        if (Array.isArray(repData)) {
          setPersonalRepairs(
            repData.map((r) => ({
              id: r.id || r.Id,
              statusId: r.statusId || r.StatusId,
              maintenanceNumber: r.maintenanceNumber || r.MaintenanceNumber,
              vehicleInfo: r.vehicleInfo || r.VehicleInfo,
              vehicleName: r.vehicleName || r.VehicleName,
              description: r.description || r.Description,
              technicianName: r.technicianName || r.TechnicianName,
              totalCost: r.totalCost || r.TotalCost,
              serviceType: r.serviceType || r.ServiceType,
              notes: r.notes || r.Notes,
              date:
                r.maintenanceDate ||
                r.MaintenanceDate ||
                r.date ||
                r.Date ||
                r.createdAt ||
                r.CreatedAt,
              productImage: resolveMediaUrl(r.productImage || r.ProductImage),
              categoryName: r.categoryName || r.CategoryName,
              variantName: r.variantName || r.VariantName,
              colorName: r.colorName || r.ColorName,
              vinNumber: r.vinNumber || r.VinNumber,
              expectedCompletionDate: r.expectedCompletionDate || r.ExpectedCompletionDate,
            }))
          );
        }
      } catch (err) {
        console.log('Error fetching order/repair data:', err);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân');
    } finally {
      setIsLoading(false);
    }
  }, [getProfileUseCase]);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadProfileData();
    };
    init();
  }, [loadProfileData]);

  const openEditField = (field) => {
    triggerHaptic();
    setActiveField(field);

    if (field === 'profile') {
      setTempData({
        name: profile.name || '',
        email: profile.email || '',
        birthDate: profile.birthDate || '',
        gender: profile.gender || '',
        province: profile.province || '',
        district: profile.district || '',
        ward: profile.ward || '',
        specificAddress: profile.specificAddress || '',
        licenseTier: profile.licenseTier || '',
        licenseImage: profile.licenseImage || null,
      });
    } else if (field === 'address') {
      setTempData({
        province: profile.province || '',
        district: profile.district || '',
        ward: profile.ward || '',
        specificAddress: profile.specificAddress || '',
      });
    } else if (field === 'license') {
      setTempData({
        licenseTier: profile.licenseTier || '',
        licenseImage: profile.licenseImage || null,
      });
    } else if (field === 'name') {
      setTempData({ name: profile.name });
    } else if (field === 'email') {
      setTempData({ email: profile.email });
    } else if (field === 'password') {
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } else if (field === 'language') {
      setTempData({ language: profile.settings.language || 'vi' });
    } else if (field === 'theme') {
      setTempData({ theme: profile.settings.theme || 'dark' });
    }

    bottomSheetRef.current?.show();
  };

  const handleSaveField = async () => {
    triggerHaptic();
    try {
      setIsSaving(true);
      const updatedProfile = profile.clone();

      if (activeField === 'profile') {
        updatedProfile.name = tempData.name;
        updatedProfile.email = tempData.email;
        updatedProfile.birthDate = tempData.birthDate;
        updatedProfile.gender = tempData.gender;
        updatedProfile.province = tempData.province;
        updatedProfile.district = tempData.district;
        updatedProfile.ward = tempData.ward;
        updatedProfile.specificAddress = tempData.specificAddress;
        updatedProfile.licenseTier = tempData.licenseTier;
        updatedProfile.licenseImage = tempData.licenseImage;
        const saved = await updateProfileUseCase.execute(updatedProfile);
        setProfile(saved);
      } else if (activeField === 'name') {
        updatedProfile.name = tempData.name;
        const saved = await updateProfileUseCase.execute(updatedProfile);
        setProfile(saved);
      } else if (activeField === 'email') {
        updatedProfile.email = tempData.email;
        const saved = await updateProfileUseCase.execute(updatedProfile);
        setProfile(saved);
      } else if (activeField === 'address') {
        updatedProfile.province = tempData.province;
        updatedProfile.district = tempData.district;
        updatedProfile.ward = tempData.ward;
        updatedProfile.specificAddress = tempData.specificAddress;
        const saved = await updateProfileUseCase.execute(updatedProfile);
        setProfile(saved);
      } else if (activeField === 'license') {
        updatedProfile.licenseTier = tempData.licenseTier;
        updatedProfile.licenseImage = tempData.licenseImage;
        const saved = await updateProfileUseCase.execute(updatedProfile);
        setProfile(saved);
      } else if (activeField === 'language') {
        const saved = await updateSettingsUseCase.execute({ language: tempData.language });
        setProfile(saved);
      } else if (activeField === 'theme') {
        const saved = await updateSettingsUseCase.execute({ theme: tempData.theme });
        setProfile(saved);
        setThemeMode(tempData.theme);
      } else if (activeField === 'password') {
        if (!passwordForm.oldPassword || !passwordForm.newPassword) {
          throw new Error('Vui lòng điền đầy đủ thông tin mật khẩu');
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          throw new Error('Mật khẩu xác nhận không khớp');
        }
        if (passwordForm.newPassword.length < 6) {
          throw new Error('Mật khẩu mới phải từ 6 ký tự trở lên');
        }
        await repository._simulateNetworkLatency(1000);
        Alert.alert('Thành công', 'Đã đổi mật khẩu thành công!');
      }

      bottomSheetRef.current?.hide();
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể lưu thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSetting = async (key, currentValue) => {
    triggerHaptic();
    try {
      const newValue = !currentValue;

      setProfile((prev) => {
        const cloned = prev.clone();
        cloned.settings[key] = newValue;
        return cloned;
      });

      await updateSettingsUseCase.execute({ [key]: newValue });
    } catch (error) {
      console.error(`Toggle ${key} failed:`, error);
      setProfile((prev) => {
        const cloned = prev.clone();
        cloned.settings[key] = currentValue;
        return cloned;
      });
      Alert.alert('Lỗi', 'Không thể cập nhật cấu hình cài đặt.');
    }
  };

  const handleSelectPhoto = async (type) => {
    triggerHaptic();
    try {
      let permissionResult;
      if (type === 'camera') {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (!permissionResult.granted) {
        Alert.alert(
          'Quyền truy cập',
          'AnhEmMotor cần quyền truy cập máy ảnh hoặc thư viện để đổi ảnh.'
        );
        return;
      }

      let pickerResult;
      const options = { allowsEditing: true, aspect: [1, 1], quality: 0.8 };

      if (type === 'camera') {
        pickerResult = await ImagePicker.launchCameraAsync(options);
      } else {
        pickerResult = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        setIsSaving(true);
        const uploadedUri = await uploadAvatarUseCase.execute(pickerResult.assets[0].uri);

        const updated = profile.clone();
        updated.avatar = uploadedUri;
        const saved = await updateProfileUseCase.execute(updated);
        setProfile(saved);

        triggerHaptic();
      }
    } catch (error) {
      console.error('Image picking failed:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectCartoonAvatar = async (url) => {
    triggerHaptic();
    try {
      setIsSaving(true);
      const savedUrl = await uploadAvatarUseCase.execute(url);

      const updated = profile.clone();
      updated.avatar = savedUrl;
      const saved = await updateProfileUseCase.execute(updated);
      setProfile(saved);
    } catch (error) {
      console.error('Cartoon avatar select failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    triggerHaptic();
    Alert.alert(
      '⚠️ XÓA TÀI KHOẢN VĨNH VIỄN',
      'Hành động này không thể hoàn tác. Mọi thông tin xe máy, lịch bảo dưỡng, và điểm thưởng (12,500 điểm) sẽ bị xóa vĩnh viễn khỏi hệ thống Showroom Biên Hòa.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa Vĩnh Viễn',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            await tokenService.clearTokens();
            await repository.clearAllData();
            setIsLoading(false);
            Alert.alert('Thông báo', 'Tài khoản của bạn đã được xóa thành công khỏi hệ thống.', [
              { text: 'OK', onPress: () => resetRoot('Login') },
            ]);
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    triggerHaptic();
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        onPress: async () => {
          await tokenService.clearTokens();
          resetRoot('Login');
        },
      },
    ]);
  };

  const cartoonAvatars = [
    'https://img.freepik.com/free-vector/cute-cool-boy-with-glasses-hoodie-pixel-art-style_475147-155.jpg',
    'https://img.freepik.com/free-vector/cute-girl-with-blue-hair-hoodie-pixel-art-style_475147-154.jpg',
    'https://img.freepik.com/free-vector/cute-robot-pixel-art-style_475147-152.jpg',
    'https://img.freepik.com/free-vector/cute-cat-pixel-art-style_475147-151.jpg',
    'https://img.freepik.com/free-vector/cute-dog-pixel-art-style_475147-153.jpg',
    'https://img.freepik.com/free-vector/cute-panda-pixel-art-style_475147-150.jpg',
  ];

  return {
    profile,
    isLoading,
    isSaving,
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
    personalOutputs,
    personalRepairs,
  };
};
