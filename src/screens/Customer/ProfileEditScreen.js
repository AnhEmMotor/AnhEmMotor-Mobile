import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/Theme'; // Import useTheme
import { ChevronLeft, User, Phone, Mail, MapPin, Camera, Save } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import ScalePress from '../../components/ScalePress';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// Clean Architecture Layers
import { useDependency } from '../../di/DependencyContext';

export default function ProfileEditScreen({ navigation }) {
  const {
    getProfileUseCase,
    updateProfileUseCase,
    uploadAvatarUseCase,
  } = useDependency();
  const theme = useTheme(); // Use the useTheme hook
  const [profileEntity, setProfileEntity] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    specificAddress: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const entity = await getProfileUseCase.execute();
      setProfileEntity(entity);
      setForm({
        name: entity.name,
        email: entity.email,
        specificAddress: entity.specificAddress,
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân');
    } finally {
      setIsLoading(false);
    }
  };

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedEntity = profileEntity.clone();
      updatedEntity.name = form.name;
      updatedEntity.email = form.email;
      updatedEntity.specificAddress = form.specificAddress;

      await updateProfileUseCase.execute(updatedEntity);
      Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể lưu thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  const pickImage = async () => {
    Alert.alert(
      'Đổi ảnh đại diện',
      'Chọn phương thức',
      [
        { text: 'Chụp ảnh mới', onPress: handleCamera },
        { text: 'Chọn từ thư viện', onPress: handleLibrary },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
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
      updatedEntity.licenseImage = uploadedUri; // Sync with selected avatar uri
      await updateProfileUseCase.execute(updatedEntity);
      setProfileEntity(updatedEntity);
      Alert.alert('Thành công', 'Đã cập nhật ảnh đại diện!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.subtext, marginTop: 15 }}>Đang tải...</Text>
      </View>
    );
  }

  const fields = [
    { key: 'name', label: 'Họ và tên', icon: <User color={theme.colors.primary} size={18} />, placeholder: 'Nhập họ tên...' },
    { key: 'email', label: 'Email', icon: <Mail color={theme.colors.info} size={18} />, placeholder: 'Nhập email...', keyboardType: 'email-address' },
    { key: 'specificAddress', label: 'Địa chỉ nhận xe cụ thể', icon: <MapPin color={theme.colors.warning} size={18} />, placeholder: 'Nhập địa chỉ...' },
  ];

  return (
    <SafeAreaView // Use getStyles for container
      style={getStyles(theme).container}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(500)} style={getStyles(theme).header}>
          <ScalePress style={getStyles(theme).backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft color={theme.colors.text} size={24} />
          </ScalePress>
          <Text style={[getStyles(theme).headerTitle, { color: theme.colors.text }]}>Thông tin cá nhân</Text>
          <ScalePress style={[getStyles(theme).saveBtn, { backgroundColor: theme.colors.primary + '1A' }]} onPress={handleSave} disabled={isSaving}>
            <Save color={theme.colors.primary} size={20} />
          </ScalePress>
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          {/* Avatar */}
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={getStyles(theme).avatarSection}>
            <ScalePress style={getStyles(theme).avatarWrapper} onPress={pickImage} disabled={isSaving}>
              {profileEntity.licenseImage ? (
                <Image source={{ uri: profileEntity.licenseImage }} style={[getStyles(theme).avatarImage, { borderColor: theme.colors.primary }]} />
              ) : (
                <View style={[getStyles(theme).avatarPlaceholder, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                  <User color={theme.colors.subtext + '66'} size={48} />
                </View>
              )}
              <View style={[getStyles(theme).cameraBtn, { backgroundColor: theme.colors.primary, borderColor: theme.colors.background }]}>
                <Camera color="#fff" size={14} />
              </View>
            </ScalePress>
            <Text style={[getStyles(theme).changePhotoText, { color: theme.colors.primary }]}>Đổi ảnh đại diện</Text>
          </Animated.View>

          {/* Locked phone display */}
          <Animated.View entering={FadeInDown.duration(500).delay(150)}>
            <Text style={[getStyles(theme).label, { color: theme.colors.subtext }]}>Số điện thoại tài khoản (Khóa)</Text>
            <GlassCard style={[getStyles(theme).inputCard, { opacity: 0.6 }]}>
              <View style={getStyles(theme).iconBox}><Phone color={theme.colors.success} size={18} /></View>
              <TextInput
                style={[getStyles(theme).input, { color: theme.colors.subtext }]}
                value={profileEntity.phone}
                editable={false}
              />
            </GlassCard>
            <Text style={[getStyles(theme).hintText, { color: theme.colors.subtext }]}>🔒 Vui lòng liên hệ Hotline 1900 6899 để yêu cầu đổi số điện thoại.</Text>
          </Animated.View>

          {/* Form fields */}
          {fields.map((field, index) => (
            <Animated.View key={field.key} entering={FadeInDown.duration(500).delay(200 + index * 80)}>
              <Text style={[getStyles(theme).label, { color: theme.colors.subtext }]}>{field.label}</Text>
              <GlassCard style={getStyles(theme).inputCard}>
                <View style={getStyles(theme).iconBox}>{field.icon}</View>
                <TextInput
                  style={[getStyles(theme).input, { color: theme.colors.text }]}
                  value={form[field.key]}
                  onChangeText={val => update(field.key, val)}
                  placeholder={field.placeholder}
                  placeholderTextColor={theme.colors.subtext}
                  keyboardType={field.keyboardType || 'default'}
                />
              </GlassCard>
            </Animated.View>
          ))}

          <Animated.View entering={FadeInDown.duration(500).delay(600)}> // Use getStyles for submitBtn
            <ScalePress style={[getStyles(theme).submitBtn, isSaving && { opacity: 0.7 }, { backgroundColor: theme.colors.primary }]} onPress={handleSave} disabled={isSaving}>
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

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.xl, marginBottom: theme.spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.card, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', color: theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  saveBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(59,130,246,0.1)', justifyContent: 'center', alignItems: 'center' },

  content: { paddingHorizontal: theme.spacing.md },

  avatarSection: { alignItems: 'center', marginVertical: theme.spacing.xl },
  avatarWrapper: { position: 'relative', width: 100, height: 100 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.card, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.colors.border },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: theme.colors.primary },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.colors.background },
  changePhotoText: { color: theme.colors.primary, fontSize: 13, marginTop: theme.spacing.sm, fontWeight: '600' },

  label: { color: theme.colors.subtext, fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: theme.spacing.md },
  inputCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: 4 },
  iconBox: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  input: { flex: 1, color: theme.colors.text, fontSize: 15, paddingVertical: 12 },
  hintText: { color: theme.colors.subtext, fontSize: 11, marginTop: 6, marginLeft: 4, fontStyle: 'italic' },

  submitBtn: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: theme.radius.md, alignItems: 'center', marginTop: theme.spacing.xl },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
