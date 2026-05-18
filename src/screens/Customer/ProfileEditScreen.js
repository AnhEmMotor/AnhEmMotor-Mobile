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
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../theme/Theme';
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
      <View style={{ flex: 1, backgroundColor: Theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={{ color: Theme.colors.subtext, marginTop: 15 }}>Đang tải...</Text>
      </View>
    );
  }

  const fields = [
    { key: 'name', label: 'Họ và tên', icon: <User color={Theme.colors.primary} size={18} />, placeholder: 'Nhập họ tên...' },
    { key: 'email', label: 'Email', icon: <Mail color={Theme.colors.info} size={18} />, placeholder: 'Nhập email...', keyboardType: 'email-address' },
    { key: 'specificAddress', label: 'Địa chỉ nhận xe cụ thể', icon: <MapPin color={Theme.colors.warning} size={18} />, placeholder: 'Nhập địa chỉ...' },
  ];

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <ScalePress style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft color={Theme.colors.text} size={24} />
          </ScalePress>
          <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
          <ScalePress style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
            <Save color={Theme.colors.primary} size={20} />
          </ScalePress>
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          {/* Avatar */}
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.avatarSection}>
            <ScalePress style={styles.avatarWrapper} onPress={pickImage} disabled={isSaving}>
              {profileEntity.licenseImage ? (
                <Image source={{ uri: profileEntity.licenseImage }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User color="rgba(255,255,255,0.4)" size={48} />
                </View>
              )}
              <View style={styles.cameraBtn}>
                <Camera color="#fff" size={14} />
              </View>
            </ScalePress>
            <Text style={styles.changePhotoText}>Đổi ảnh đại diện</Text>
          </Animated.View>

          {/* Locked phone display */}
          <Animated.View entering={FadeInDown.duration(500).delay(150)}>
            <Text style={styles.label}>Số điện thoại tài khoản (Khóa)</Text>
            <GlassCard style={[styles.inputCard, { opacity: 0.6 }]}>
              <View style={styles.iconBox}><Phone color={Theme.colors.success} size={18} /></View>
              <TextInput
                style={[styles.input, { color: Theme.colors.subtext }]}
                value={profileEntity.phone}
                editable={false}
              />
            </GlassCard>
            <Text style={styles.hintText}>🔒 Vui lòng liên hệ Hotline 1900 6899 để yêu cầu đổi số điện thoại.</Text>
          </Animated.View>

          {/* Form fields */}
          {fields.map((field, index) => (
            <Animated.View key={field.key} entering={FadeInDown.duration(500).delay(200 + index * 80)}>
              <Text style={styles.label}>{field.label}</Text>
              <GlassCard style={styles.inputCard}>
                <View style={styles.iconBox}>{field.icon}</View>
                <TextInput
                  style={styles.input}
                  value={form[field.key]}
                  onChangeText={val => update(field.key, val)}
                  placeholder={field.placeholder}
                  placeholderTextColor={Theme.colors.subtext}
                  keyboardType={field.keyboardType || 'default'}
                />
              </GlassCard>
            </Animated.View>
          ))}

          <Animated.View entering={FadeInDown.duration(500).delay(600)}>
            <ScalePress style={[styles.submitBtn, isSaving && { opacity: 0.7 }]} onPress={handleSave} disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitText}>Lưu thông tin</Text>
              )}
            </ScalePress>
          </Animated.View>

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Theme.spacing.md, marginTop: Theme.spacing.xl, marginBottom: Theme.spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.card, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', color: Theme.colors.text, fontSize: 18, fontWeight: 'bold' },
  saveBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(59,130,246,0.1)', justifyContent: 'center', alignItems: 'center' },

  content: { paddingHorizontal: Theme.spacing.md },

  avatarSection: { alignItems: 'center', marginVertical: Theme.spacing.xl },
  avatarWrapper: { position: 'relative', width: 100, height: 100 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: Theme.colors.card, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Theme.colors.border },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: Theme.colors.primary },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: Theme.colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Theme.colors.background },
  changePhotoText: { color: Theme.colors.primary, fontSize: 13, marginTop: Theme.spacing.sm, fontWeight: '600' },

  label: { color: Theme.colors.subtext, fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: Theme.spacing.md },
  inputCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Theme.spacing.md, paddingVertical: 4 },
  iconBox: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  input: { flex: 1, color: Theme.colors.text, fontSize: 15, paddingVertical: 12 },
  hintText: { color: Theme.colors.subtext, fontSize: 11, marginTop: 6, marginLeft: 4, fontStyle: 'italic' },

  submitBtn: { backgroundColor: Theme.colors.primary, padding: 16, borderRadius: Theme.radius.md, alignItems: 'center', marginTop: Theme.spacing.xl },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
