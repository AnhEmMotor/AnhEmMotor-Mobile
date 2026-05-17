import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

// Clean Architecture Layers
import { ProfileRepositoryImpl } from '../../data/repositories/ProfileRepositoryImpl';
import { GetProfileUseCase } from '../../domain/usecases/GetProfileUseCase';
import { UpdateProfileUseCase } from '../../domain/usecases/UpdateProfileUseCase';
import { UpdateSettingsUseCase } from '../../domain/usecases/UpdateSettingsUseCase';
import { UploadAvatarUseCase } from '../../domain/usecases/UploadAvatarUseCase';
import { UserProfile } from '../../domain/entities/UserProfile';
import { useGlobalState } from '../../../../context/GlobalState';

// Repository and Use Cases instances
const repository = new ProfileRepositoryImpl();
const getProfileUseCase = new GetProfileUseCase(repository);
const updateProfileUseCase = new UpdateProfileUseCase(repository);
const updateSettingsUseCase = new UpdateSettingsUseCase(repository);
const uploadAvatarUseCase = new UploadAvatarUseCase(repository);

// Mock Administrative Regions Database for Viet Nam
export const MOCK_REGIONS = {
  provinces: ['Hồ Chí Minh', 'Đồng Nai', 'Hà Nội', 'Bình Dương'],
  districts: {
    'Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 9', 'Thành phố Thủ Đức', 'Quận Bình Thạnh'],
    'Đồng Nai': ['Thành phố Biên Hòa', 'Huyện Long Thành', 'Huyện Nhơn Trạch', 'Huyện Trảng Bom'],
    'Hà Nội': ['Quận Hoàn Kiếm', 'Quận Cầu Giấy', 'Quận Đống Đa', 'Quận Hai Bà Trưng'],
    'Bình Dương': ['Thành phố Thủ Dầu Một', 'Thành phố Thuận An', 'Thành phố Dĩ An'],
  },
  wards: {
    'Quận 9': ['Phường Hiệp Phú', 'Phường Tăng Nhơn Phú A', 'Phường Tăng Nhơn Phú B', 'Phường Long Thạnh Mỹ'],
    'Thành phố Thủ Đức': ['Phường Thảo Điền', 'Phường An Phú', 'Phường Bình An', 'Phường Linh Trung'],
    'Thành phố Biên Hòa': ['Phường Quyết Thắng', 'Phường Tân Phong', 'Phường Trung Dũng', 'Phường Trảng Dài'],
    'Huyện Long Thành': ['Thị trấn Long Thành', 'Xã An Phước', 'Xã Lộc An', 'Xã Long Đức'],
    'Quận Hoàn Kiếm': ['Phường Hàng Bạc', 'Phường Tràng Tiền', 'Phường Đồng Xuân'],
    'Thành phố Thủ Dầu Một': ['Phường Phú Cường', 'Phường Hiệp Thành', 'Phường Chánh Nghĩa'],
  }
};

export const useProfileController = (navigation, bottomSheetRef) => {
  const { setThemeMode } = useGlobalState();
  const [profile, setProfile] = useState(new UserProfile());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  
  // Field editing state
  const [activeField, setActiveField] = useState(null); // 'name' | 'email' | 'address' | 'license' | 'password' | 'language'
  const [tempData, setTempData] = useState({}); // Stores changes currently being edited in bottom sheet

  // Password fields state
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  // Load Profile on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const data = await getProfileUseCase.execute();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân');
    } finally {
      setIsLoading(false);
    }
  };

  // Open Bottom Sheet to Edit a Field
  const openEditField = (field) => {
    triggerHaptic();
    setActiveField(field);
    
    if (field === 'profile') {
      setTempData({
        name: profile.name,
        email: profile.email,
        birthDate: profile.birthDate || '17/05/1995',
        gender: profile.gender || 'Nam',
        province: profile.province || 'Đồng Nai',
        district: profile.district || 'Thành phố Biên Hòa',
        ward: profile.ward || 'Phường Quyết Thắng',
        specificAddress: profile.specificAddress || '',
        licenseTier: profile.licenseTier || 'A1',
        licenseImage: profile.licenseImage || null,
      });
    } else if (field === 'address') {
      setTempData({
        province: profile.province || 'Đồng Nai',
        district: profile.district || 'Thành phố Biên Hòa',
        ward: profile.ward || 'Phường Quyết Thắng',
        specificAddress: profile.specificAddress || '',
      });
    } else if (field === 'license') {
      setTempData({
        licenseTier: profile.licenseTier || 'A1',
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

  // Save the field being edited
  const handleSaveField = async () => {
    triggerHaptic();
    try {
      setIsSaving(true);
      const updatedProfile = profile.clone();

      if (activeField === 'profile') {
        updatedProfile.name = tempData.name;
        updatedProfile.email = tempData.email;
        updatedProfile.birthDate = tempData.birthDate;
        updatedProfile.gender = tempData.gender || 'Nam';
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
        setThemeMode(tempData.theme); // Đồng bộ chủ đề toàn hệ thống
      } else if (activeField === 'password') {
        // Validate password change
        if (!passwordForm.oldPassword || !passwordForm.newPassword) {
          throw new Error('Vui lòng điền đầy đủ thông tin mật khẩu');
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          throw new Error('Mật khẩu xác nhận không khớp');
        }
        if (passwordForm.newPassword.length < 6) {
          throw new Error('Mật khẩu mới phải từ 6 ký tự trở lên');
        }
        await repository._simulateNetworkLatency(1000); // Simulate API check
        Alert.alert('Thành công', 'Đã đổi mật khẩu thành công!');
      }

      bottomSheetRef.current?.hide();
      setActiveField(null);
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể lưu thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-Save Toggle Switches immediately (Clean Architecture + Toggle UX)
  const handleToggleSetting = async (key, currentValue) => {
    triggerHaptic();
    try {
      const newValue = !currentValue;
      
      // Optimitic UI update
      setProfile(prev => {
        const cloned = prev.clone();
        cloned.settings[key] = newValue;
        return cloned;
      });

      // Update in data layer
      await updateSettingsUseCase.execute({ [key]: newValue });
    } catch (error) {
      console.error(`Toggle ${key} failed:`, error);
      // Rollback UI update
      setProfile(prev => {
        const cloned = prev.clone();
        cloned.settings[key] = currentValue;
        return cloned;
      });
      Alert.alert('Lỗi', 'Không thể cập nhật cấu hình cài đặt.');
    }
  };

  // Upload Photo via Camera or Gallery
  const handleSelectPhoto = async (type) => {
    setAvatarModal(false);
    triggerHaptic();
    try {
      let permissionResult;
      if (type === 'camera') {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (!permissionResult.granted) {
        Alert.alert('Quyền truy cập', 'AnhEmMotor cần quyền truy cập máy ảnh hoặc thư viện để đổi ảnh.');
        return;
      }

      let pickerResult;
      const options = {
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };

      if (type === 'camera') {
        pickerResult = await ImagePicker.launchCameraAsync(options);
      } else {
        pickerResult = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        setIsSaving(true);
        const uploadedUri = await uploadAvatarUseCase.execute(pickerResult.assets[0].uri);
        
        // Save to profile
        const updated = profile.clone();
        updated.licenseImage = uploadedUri; // Or avatar depends
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

  // Selecting cartoon avatars from mock sheet (Fast & engaging)
  const handleSelectCartoonAvatar = async (url) => {
    triggerHaptic();
    try {
      setIsSaving(true);
      const savedUrl = await uploadAvatarUseCase.execute(url);
      
      const updated = profile.clone();
      updated.licenseImage = savedUrl; // Set locally
      const saved = await updateProfileUseCase.execute(updated);
      setProfile(saved);
    } catch (error) {
      console.error('Cartoon avatar select failed:', error);
    } finally {
      setIsSaving(false);
      setAvatarModal(false);
    }
  };

  // Delete Account flow
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
            await repository.clearAllData();
            setIsLoading(false);
            Alert.alert('Thông báo', 'Tài khoản của bạn đã được xóa thành công khỏi hệ thống.', [
              { text: 'OK', onPress: () => navigation.replace('Login') }
            ]);
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    triggerHaptic();
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', onPress: () => navigation.replace('Login') }
    ]);
  };

  const cartoonAvatars = [
    'https://img.freepik.com/free-vector/cute-cool-boy-with-glasses-hoodie-pixel-art-style_475147-155.jpg',
    'https://img.freepik.com/free-vector/cute-girl-with-blue-hair-hoodie-pixel-art-style_475147-154.jpg',
    'https://img.freepik.com/free-vector/cute-robot-pixel-art-style_475147-152.jpg',
    'https://img.freepik.com/free-vector/cute-cat-pixel-art-style_475147-151.jpg',
    'https://img.freepik.com/free-vector/cute-dog-pixel-art-style_475147-153.jpg',
    'https://img.freepik.com/free-vector/cute-panda-pixel-art-style_475147-150.jpg'
  ];

  return {
    profile,
    isLoading,
    isSaving,
    avatarModal,
    setAvatarModal,
    activeField,
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
  };
};
