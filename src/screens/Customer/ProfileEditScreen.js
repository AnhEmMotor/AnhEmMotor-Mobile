import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TextInput, KeyboardAvoidingView, Platform, Image, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../theme/Theme';
import { ChevronLeft, User, Phone, Mail, MapPin, Camera, Save } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import ScalePress from '../../components/ScalePress';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ProfileEditScreen({ navigation }) {
  const [form, setForm] = useState({
    name: 'Nguyễn Khôi',
    phone: '0912 345 678',
    email: 'nguyenkhoi.ae@gmail.com',
    address: '123 Lê Văn Việt, Quận 9, TP.HCM',
  });
  const [image, setImage] = useState('https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080');

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const fields = [
    { key: 'name', label: 'Họ và tên', icon: <User color={Theme.colors.primary} size={18} />, placeholder: 'Nhập họ tên...' },
    { key: 'phone', label: 'Số điện thoại', icon: <Phone color={Theme.colors.success} size={18} />, placeholder: 'Nhập SĐT...', keyboardType: 'phone-pad' },
    { key: 'email', label: 'Email', icon: <Mail color={Theme.colors.info} size={18} />, placeholder: 'Nhập email...', keyboardType: 'email-address' },
    { key: 'address', label: 'Địa chỉ thường trú', icon: <MapPin color={Theme.colors.warning} size={18} />, placeholder: 'Nhập địa chỉ...' },
  ];

  const handleSave = () => {
    navigation.goBack();
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
      alert('Xin lỗi, chúng tôi cần quyền truy cập camera!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Xin lỗi, chúng tôi cần quyền truy cập thư viện ảnh!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

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
          <ScalePress style={styles.saveBtn} onPress={handleSave}>
            <Save color={Theme.colors.primary} size={20} />
          </ScalePress>
        </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Avatar */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.avatarSection}>
          <ScalePress style={styles.avatarWrapper} onPress={pickImage}>
            {image ? (
                <Image source={{ uri: image }} style={styles.avatarImage} />
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
            {field.hint && (
              <Text style={styles.hintText}>💡 {field.hint}</Text>
            )}
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.duration(500).delay(700)}>
          <ScalePress style={styles.submitBtn} onPress={handleSave}>
            <Text style={styles.submitText}>Lưu thông tin</Text>
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
