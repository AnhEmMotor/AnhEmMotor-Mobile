import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LogOut, Trash2, ChevronRight, Settings, Bell, Shield, Languages, Eye } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetRoot, navigationRef } from '../navigation/RootNavigation';
import { useGlobalState } from '../context/GlobalState';
import { useTheme } from '../theme/Theme'; // Import the new useTheme hook
import GlassCard from './GlassCard';

const STORAGE_KEY = '@AEM_Customer_Profile';

export default function GlobalSettingsModal() {
  const { isSettingsOpen, setSettingsOpen, themeMode, setThemeMode } = useGlobalState();
  const theme = useTheme(); // Use the new useTheme hook

  // Local settings state
  const [loading, setLoading] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [profileSettings, setProfileSettings] = useState({
    maintenanceNotifications: true,
    biometricLogin: false,
    language: 'vi',
    theme: theme.isDark ? 'dark' : 'light' // Initialize with current theme
  });

  // Haptic feedback
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
    }
  };

  // Load settings when modal is opened
  useEffect(() => {
    if (isSettingsOpen) {
      loadSettings();
    }
  }, [isSettingsOpen]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.settings) {
          setProfileSettings({
            maintenanceNotifications: parsed.settings.maintenanceNotifications !== false,
            biometricLogin: !!parsed.settings.biometricLogin,
            language: parsed.settings.language || 'vi',
            theme: parsed.settings.theme || 'dark'
          });
        }
      }
    } catch (err) {
      console.error('[GlobalSettingsModal] Lỗi tải cài đặt:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save specific settings key
  const handleToggleSetting = async (key, currentValue) => {
    triggerHaptic();
    const newValue = !currentValue;

    // Optimistic state update
    const updatedSettings = {
      ...profileSettings,
      [key]: newValue
    };
    setProfileSettings(updatedSettings);

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let parsed = stored ? JSON.parse(stored) : {};
      parsed.settings = {
        ...(parsed.settings || {}),
        [key]: newValue
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (err) {
      console.error('[GlobalSettingsModal] Lỗi lưu cấu hình:', err);
      Alert.alert('Lỗi', 'Không thể lưu cài đặt.');
      // Rollback
      setProfileSettings(prev => ({ ...prev, [key]: currentValue }));
    }
  };

  // Handle language switch
  const handleLanguageSelect = () => {
    triggerHaptic();
    Alert.alert(
      'Chọn Ngôn Ngữ / Select Language',
      'Vui lòng chọn ngôn ngữ hiển thị:',
      [
        {
          text: 'Tiếng Việt 🇻🇳',
          onPress: () => updateSpecificSetting('language', 'vi')
        },
        {
          text: 'English 🇬🇧',
          onPress: () => updateSpecificSetting('language', 'en')
        },
        { text: 'Hủy / Cancel', style: 'cancel' }
      ]
    );
  };

  // Handle theme toggle between light and dark
  const handleThemeToggle = async () => {
    triggerHaptic();
    const nextTheme = profileSettings.theme === 'dark' ? 'light' : 'dark';

    const updatedSettings = {
      ...profileSettings,
      theme: nextTheme
    };
    setProfileSettings(updatedSettings);
    setThemeMode(nextTheme);

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let parsed = stored ? JSON.parse(stored) : {};
      parsed.settings = {
        ...(parsed.settings || {}),
        theme: nextTheme
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (err) {
      console.error('[GlobalSettingsModal] Lỗi lưu cấu hình theme:', err);
    }
  };

  const updateSpecificSetting = async (key, value) => {
    const updatedSettings = {
      ...profileSettings,
      [key]: value
    };
    setProfileSettings(updatedSettings);

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let parsed = stored ? JSON.parse(stored) : {};
      parsed.settings = {
        ...(parsed.settings || {}),
        [key]: value
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (err) {
      console.error('[GlobalSettingsModal] Lỗi lưu cấu hình:', err);
    }
  };

  // Logout flow
  const handleLogout = () => {
    triggerHaptic();
    setLogoutModalVisible(true);
  };

  const cancelLogout = () => {
    triggerHaptic();
    setLogoutModalVisible(false);
  };

  const confirmLogout = () => {
    triggerHaptic();
    setLogoutModalVisible(false);
    setSettingsOpen(false);

    if (navigationRef && typeof navigationRef.isReady === 'function' && navigationRef.isReady()) {
      resetRoot('Login');
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
      attempts += 1;
      if (navigationRef && typeof navigationRef.isReady === 'function' && navigationRef.isReady()) {
        resetRoot('Login');
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn('[GlobalSettingsModal] resetRoot failed: navigationRef not ready after retries');
      }
    }, 100);
  };

  // Delete Account flow
  const handleDeleteAccount = () => {
    triggerHaptic();
    Alert.alert(
      '⚠️ XÓA TÀI KHOẢN VĨNH VIỄN',
      'Hành động này không thể hoàn tác. Mọi thông tin xe máy, lịch bảo dưỡng, và điểm thưởng (1,200 điểm) sẽ bị xóa vĩnh viễn khỏi hệ thống Showroom Biên Hòa.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa Vĩnh Viễn',
          style: 'destructive',
          onPress: async () => {
            try {
              setSettingsOpen(false);
              await AsyncStorage.removeItem(STORAGE_KEY);
              Alert.alert('Thông báo', 'Tài khoản của bạn đã được xóa thành công khỏi hệ thống.', [
                { text: 'OK', onPress: () => resetRoot('Login') }
              ]);
            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={isSettingsOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setSettingsOpen(false)}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={35} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />

        {/* Backdrop Tap closer */}
        <TouchableOpacity style={styles.modalBackdrop} onPress={() => setSettingsOpen(false)} />

        {/* Modal Container Card */}
        <View style={[styles.modalSheet, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={[styles.modalHandle, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }]} />

          <View style={styles.modalHeader}>
            <Settings color={theme.colors.primary} size={22} style={{ marginRight: 8 }} />
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>⚙️ CÀI ĐẶT HỆ THỐNG</Text>
          </View>

          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Use theme.colors.card for background, or a specific modal card background if defined in theme.colors */}
              <GlassCard style={{ padding: 6, borderRadius: theme.radius.lg, backgroundColor: theme.colors.card }} intensity={theme.isDark ? 8 : 0}>

                {/* 1. Maintenance notifications */}
                <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
                  <View style={[styles.rowIcon, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : theme.staticColors.primary + '48' }]}>
                    <Bell color={theme.colors.primary} size={18} />
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Nhắc lịch bảo dưỡng & Kỹ thuật</Text>
                    <Text style={[styles.settingDesc, { color: theme.colors.subtext }]}>Nhận cảnh báo thay nhớt, kiểm tra định kỳ</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.toggle, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : theme.staticColors.primary + '48' }, profileSettings.maintenanceNotifications && { backgroundColor: theme.colors.primary }]}
                    onPress={() => handleToggleSetting('maintenanceNotifications', profileSettings.maintenanceNotifications)}
                  >
                    <View style={[styles.toggleDot, profileSettings.maintenanceNotifications && styles.toggleDotOn]} />
                  </TouchableOpacity>
                </View>

                {/* 2. Biometrics check */}
                <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
                  <View style={[styles.rowIcon, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : theme.staticColors.primary + '48' }]}>
                    <Shield color="#10B981" size={18} />
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Đăng nhập bằng FaceID / Vân tay</Text>
                    <Text style={[styles.settingDesc, { color: theme.colors.subtext }]}>Bảo mật cao và mở khoá một chạm tiện lợi</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.toggle, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : theme.staticColors.primary + '48' }, profileSettings.biometricLogin && { backgroundColor: theme.colors.primary }]}
                    onPress={() => handleToggleSetting('biometricLogin', profileSettings.biometricLogin)}
                  >
                    <View style={[styles.toggleDot, profileSettings.biometricLogin && styles.toggleDotOn]} />
                  </TouchableOpacity>
                </View>

                {/* 3. Ngôn ngữ */}
                <TouchableOpacity style={[styles.settingRow, { borderBottomColor: theme.colors.border }]} onPress={handleLanguageSelect}>
                  <View style={[styles.rowIcon, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : theme.staticColors.primary + '48' }]}>
                    <Languages color="#F59E0B" size={18} />
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Ngôn ngữ ứng dụng</Text>
                    <Text style={[styles.settingDesc, { color: theme.colors.subtext }]}>Đang dùng: {profileSettings.language === 'vi' ? 'Tiếng Việt 🇻🇳' : 'English 🇬🇧'}</Text>
                  </View>
                  <ChevronRight color={theme.colors.subtext} size={18} />
                </TouchableOpacity>

                {/* 4. Giao diện theme */}
                <View style={[styles.settingRow, styles.settingRowLast]}>
                  <View style={[styles.rowIcon, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : theme.staticColors.primary + '48' }]}>
                    <Eye color="#EC4899" size={18} />
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Giao diện ứng dụng</Text>
                    <Text style={[styles.settingDesc, { color: theme.colors.subtext }]}>
                      Đang dùng: {profileSettings.theme === 'dark' ? 'Tối 🌙' : 'Sáng ☀️'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.toggle, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : theme.staticColors.primary + '48' }, profileSettings.theme === 'dark' && { backgroundColor: theme.colors.primary }]}
                    onPress={handleThemeToggle}
                  >
                    <View style={[styles.toggleDot, profileSettings.theme === 'dark' && styles.toggleDotOn]} />
                  </TouchableOpacity>
                </View>
              </GlassCard>

              {/* Danger Zone */}
              <View style={{ marginTop: 25 }}>
                <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme.colors.primary }]} onPress={handleLogout}>
                  <LogOut color="#FFF" size={16} style={{ marginRight: 8 }} />
                  <Text style={styles.logoutText}>Đăng xuất khỏi tài khoản</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: theme.colors.error + '14', borderColor: theme.colors.error + '48' }]} onPress={handleDeleteAccount}>
                  <Trash2 color={theme.colors.error} size={16} style={{ marginRight: 8 }} />
                  <Text style={[styles.deleteText, { color: theme.colors.error }]}>Xóa tài khoản vĩnh viễn</Text>
                </TouchableOpacity>
              </View>
              </ScrollView>
          )}
        </View>

        {logoutModalVisible && (
          <View style={styles.logoutModalOverlay}>
            <View style={[styles.logoutModalCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }] }>
              <Text style={[styles.logoutModalTitle, { color: theme.colors.text }]}>Xác nhận đăng xuất</Text>
              <Text style={[styles.logoutModalMessage, { color: theme.colors.subtext }]}>Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?</Text>

              <View style={styles.logoutModalButtons}>
                <TouchableOpacity
                  style={[styles.logoutModalBtn, styles.logoutModalCancel, { borderColor: theme.colors.border }]}
                  onPress={cancelLogout}
                >
                  <Text style={[styles.logoutModalCancelText, { color: theme.colors.text }]}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.logoutModalBtn, styles.logoutModalConfirm, { backgroundColor: theme.colors.primary }]}
                  onPress={confirmLogout}
                >
                  <Text style={[styles.logoutModalConfirmText, { color: '#FFF' }]}>Đăng xuất</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalSheet: {
    height: '62%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 20,
  },
  modalHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    marginBottom: 3,
  },
  settingDesc: {
    fontSize: 11.5,
    lineHeight: 15,
  },
  toggle: {
    width: 46,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 2,
    justifyContent: 'center',
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: 0 }],
  },
  toggleDotOn: {
    transform: [{ translateX: 22 }],
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // This is already present, no change needed
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // This is already present, no change needed
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 24,
  },
  logoutModalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  logoutModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  logoutModalMessage: {
    fontSize: 14,
    marginBottom: 16,
  },
  logoutModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  logoutModalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  logoutModalCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  logoutModalConfirm: {
  },
  logoutModalCancelText: {
    color: '#374151',
    fontWeight: '600',
  },
  logoutModalConfirmText: {
    color: '#FFF',
    fontWeight: '700',
  },
});
