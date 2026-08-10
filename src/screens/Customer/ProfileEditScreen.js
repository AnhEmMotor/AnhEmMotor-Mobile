import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../theme/Theme';
import { ChevronLeft, User, Phone, Mail, MapPin, Camera, Save } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import ScalePress from '../../components/ScalePress';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useDependency } from '../../di/DependencyContext';

export default function ProfileEditScreen({ navigation }) {
  const ImagePicker = require('expo-image-picker');
  const { getProfileUseCase, updateProfileUseCase, uploadAvatarUseCase } = useDependency();
  const { theme, getStyles } = useTheme();
  const styles = getStyles(theme);
  const [profileEntity, setProfileEntity] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    specificAddress: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const entity = await getProfileUseCase.execute();
      setProfileEntity(entity);
      setForm({
        name: entity.name,
        email: entity.email,
        specificAddress: entity.specificAddress,
      });
    } catch (_error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân');
    } finally {
      setIsLoading(false);
    }
  }, [getProfileUseCase]);

  useEffect(() => {
    const init = async () => {
      await loadData();
    };
    init();
  }, [loadData]);

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedEntity = profileEntity.clone();
      updatedEntity.name = form.name;
      updatedEntity.email = form.email;
      updatedEntity.specificAddress = form.specificAddress;

      await updateProfileUseCase.execute(updatedEntity);
      Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể lưu thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  const pickImage = async () => {
    Alert.alert('Đổi ảnh đại diện', 'Chọn phương thức', [
      { text: 'Chụp ảnh mới', onPress: handleCamera },
      { text: 'Chọn từ thư viện', onPress: handleLibrary },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Xin lỗi, chúng tôi cần quyền truy cập camera!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      await updateAvatar(result.assets[0].uri);
    }
  };

  const handleLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Xin lỗi, chúng tôi cần quyền truy cập thư viện ảnh!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      await updateAvatar(result.assets[0].uri);
    }
  };

  const updateAvatar = async (uri) => {
    try {
      setIsSaving(true);
      const uploadedUri = await uploadAvatarUseCase.execute(uri);

      const updatedEntity = profileEntity.clone();
      updatedEntity.licenseImage = uploadedUri;
      await updateProfileUseCase.execute(updatedEntity);
      setProfileEntity(updatedEntity);
      Alert.alert('Thành công', 'Đã cập nhật ảnh đại diện!');
    } catch (_error) {
      Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.subtext, marginTop: 15 }}>Đang tải...</Text>
      </View>
    );
  }

  const fields = [
    {
      key: 'name',
      label: 'Họ và tên',
      icon: <User color={theme.colors.primary} size={18} />,
      placeholder: 'Nhập họ tên...',
    },
    {
      key: 'email',
      label: 'Email',
      icon: <Mail color={theme.colors.info} size={18} />,
      placeholder: 'Nhập email...',
      keyboardType: 'email-address',
    },
    {
      key: 'specificAddress',
      label: 'Địa chỉ nhận xe cụ thể',
      icon: <MapPin color={theme.colors.warning} size={18} />,
      placeholder: 'Nhập địa chỉ...',
    },
  ];

  return (
    <SafeAreaView style={getStyles(theme).container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {}
        <Animated.View entering={FadeInUp.duration(500)} style={getStyles(theme).header}>
          <ScalePress style={getStyles(theme).backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft color={theme.colors.text} size={24} />
          </ScalePress>
          <Text style={[getStyles(theme).headerTitle, { color: theme.colors.text }]}>
            Thông tin cá nhân
          </Text>
          <ScalePress
            style={[getStyles(theme).saveBtn, { backgroundColor: theme.colors.primary + '1A' }]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Save color={theme.colors.primary} size={20} />
          </ScalePress>
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {}
          <Animated.View
            entering={FadeInDown.duration(500).delay(100)}
            style={getStyles(theme).avatarSection}
          >
            <ScalePress
              style={getStyles(theme).avatarWrapper}
              onPress={pickImage}
              disabled={isSaving}
            >
              {profileEntity.licenseImage ? (
                <Image
                  source={{ uri: profileEntity.licenseImage }}
                  style={[getStyles(theme).avatarImage, { borderColor: theme.colors.primary }]}
                />
              ) : (
                <View
                  style={[
                    getStyles(theme).avatarPlaceholder,
                    { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                  ]}
                >
                  <User color={theme.colors.subtext + '66'} size={48} />
                </View>
              )}
              <View
                style={[
                  getStyles(theme).cameraBtn,
                  { backgroundColor: theme.colors.primary, borderColor: theme.colors.background },
                ]}
              >
                <Camera color="#fff" size={14} />
              </View>
            </ScalePress>
            <Text style={[getStyles(theme).changePhotoText, { color: theme.colors.primary }]}>
              Đổi ảnh đại diện
            </Text>
          </Animated.View>

          {}
          <Animated.View entering={FadeInDown.duration(500).delay(150)}>
            <Text style={[getStyles(theme).label, { color: theme.colors.subtext }]}>
              Số điện thoại tài khoản (Khóa)
            </Text>
            <GlassCard style={[getStyles(theme).inputCard, { opacity: 0.6 }]}>
              <View style={getStyles(theme).iconBox}>
                <Phone color={theme.colors.success} size={18} />
              </View>
              <TextInput
                style={[getStyles(theme).input, { color: theme.colors.subtext }]}
                value={profileEntity.phone}
                editable={false}
              />
            </GlassCard>
            <Text style={[getStyles(theme).hintText, { color: theme.colors.subtext }]}>
              🔒 Vui lòng liên hệ Hotline 1900 6899 để yêu cầu đổi số điện thoại.
            </Text>
          </Animated.View>

          {}
          {fields.map((field, index) => (
            <Animated.View
              key={field.key}
              entering={FadeInDown.duration(500).delay(200 + index * 80)}
            >
              <Text style={[getStyles(theme).label, { color: theme.colors.subtext }]}>
                {field.label}
              </Text>
              <GlassCard style={getStyles(theme).inputCard}>
                <View style={getStyles(theme).iconBox}>{field.icon}</View>
                <TextInput
                  style={[getStyles(theme).input, { color: theme.colors.text }]}
                  value={form[field.key]}
                  onChangeText={(val) => update(field.key, val)}
                  placeholder={field.placeholder}
                  placeholderTextColor={theme.colors.subtext}
                  keyboardType={field.keyboardType || 'default'}
                />
              </GlassCard>
            </Animated.View>
          ))}

          <Animated.View entering={FadeInDown.duration(500).delay(600)}>
            <ScalePress
              style={[
                getStyles(theme).submitBtn,
                isSaving && { opacity: 0.7 },
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={getStyles(theme).submitText}>Lưu thông tin</Text>
              )}
            </ScalePress>
          </Animated.View>

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
