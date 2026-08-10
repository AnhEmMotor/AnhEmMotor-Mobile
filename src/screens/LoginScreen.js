import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Mail, Lock, Eye, EyeOff, ChevronRight, Moon, Sun } from 'lucide-react-native';
import { Theme, useTheme } from '../theme/Theme';
import { useGlobalState } from '../context/GlobalState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi, getCurrentUserApi } from '../api/customerApi';
import { tokenService } from '../api/httpClient';

// eslint-disable-next-line no-unused-vars
const { _height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const theme = useTheme();
  const colors = theme.colors;
  const { themeMode, setThemeMode } = useGlobalState();
  const toggleTheme = () => setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('@AEM_Remembered_Email');
        const savedPassword = await AsyncStorage.getItem('@AEM_Remembered_Password');
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberPassword(true);
        }
      } catch (e) {
        console.error('Failed to load credentials', e);
      }
    };
    loadRememberedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    setLoading(true);

    try {
      const loginData = await loginApi(email.trim(), password);
      const tokenData = loginData || {};
      const accessToken = tokenData.accessToken;
      const refreshToken = tokenData.refreshToken;

      if (rememberPassword) {
        await AsyncStorage.setItem('@AEM_Remembered_Email', email.trim());
        await AsyncStorage.setItem('@AEM_Remembered_Password', password);
      } else {
        await AsyncStorage.removeItem('@AEM_Remembered_Email');
        await AsyncStorage.removeItem('@AEM_Remembered_Password');
      }

      if (accessToken) {
        await tokenService.saveTokens(accessToken, refreshToken);
      }

      try {
        const userProfile = await getCurrentUserApi();
        const mappedProfile = {
          uid: userProfile.id,
          name: userProfile.fullName || userProfile.userName,
          email: userProfile.email,
          phone: userProfile.phoneNumber,
          gender: userProfile.gender,
          avatar: userProfile.avatarUrl,
          birthDate: userProfile.dateOfBirth,
          settings: {
            theme: 'dark',
            language: 'vi',
            maintenanceNotifications: true,
            biometricLogin: false
          }
        };

        await AsyncStorage.setItem('@AEM_Customer_Profile', JSON.stringify(mappedProfile));
      } catch (userError) {
        console.warn('Failed to fetch user profile after login', userError);
      }

      navigation.navigate('CustomerHome');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Lỗi đăng nhập', error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={theme.isDark ? ['#050505', '#0B0B0B', '#191919'] : ['#FFFFFF', '#F8FAFC', '#E5E7EB']}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.glowTop, { backgroundColor: theme.staticColors.primary + '18' }]} />
      <View style={[styles.glowBottom, { backgroundColor: theme.staticColors.secondary + '14' }]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View entering={FadeInDown.duration(800)} style={[styles.themeToggleContainer, { top: Math.max(insets.top, 20) + 10 }]}>
            <Pressable style={[styles.themeToggleBtn, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : theme.staticColors.primary + '0D' }]} onPress={toggleTheme}>
              {theme.isDark ? <Sun color={colors.text} size={20} /> : <Moon color={colors.text} size={20} />}
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.header}>
            <LinearGradient colors={['#E31B23', '#A50B16']} style={styles.logoCircle}>
              <Text style={styles.logoText}>AE</Text>
            </LinearGradient>
            <Text style={[styles.title, { color: colors.text }]}>AnhEm Motor</Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>Showroom xe mô tô cao cấp</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(800).delay(250)} style={[styles.card, { borderColor: colors.border }]}>
            <BlurView intensity={theme.isDark ? 25 : 50} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            <View style={[styles.cardInner, { backgroundColor: colors.glassBg }]}>
              <Text style={[styles.formTitle, { color: colors.text }]}>Chào mừng trở lại</Text>
              <Text style={[styles.formSubtitle, { color: colors.subtext }]}>Đăng nhập để tiếp tục</Text>

              <View style={[
                styles.inputWrapper,
                { backgroundColor: colors.inputBg, borderColor: colors.border },
                activeInput === 'email' && [styles.inputActive, { borderColor: colors.primary + '80', backgroundColor: colors.primary + '10' }]
              ]}>
                <Mail size={moderateScale(18)} color={activeInput === 'email' ? colors.primary : colors.subtext} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Email của bạn"
                  placeholderTextColor={colors.subtext}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setActiveInput('email')}
                  onBlur={() => setActiveInput(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <View style={[
                styles.inputWrapper,
                { backgroundColor: colors.inputBg, borderColor: colors.border },
                activeInput === 'password' && [styles.inputActive, { borderColor: colors.primary + '80', backgroundColor: colors.primary + '10' }]
              ]}>
                <Lock size={moderateScale(18)} color={activeInput === 'password' ? colors.primary : colors.subtext} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Mật khẩu"
                  placeholderTextColor={colors.subtext}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setActiveInput('password')}
                  onBlur={() => setActiveInput(null)}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword
                    ? <EyeOff size={moderateScale(18)} color={colors.subtext} />
                    : <Eye size={moderateScale(18)} color={colors.subtext} />
                  }
                </Pressable>
              </View>

              <View style={styles.optionsRow}>
                <Pressable style={styles.rememberMe} onPress={() => setRememberPassword(!rememberPassword)}>
                  {rememberPassword ? <Eye size={moderateScale(18)} color={colors.primary} /> : <View style={{ width: moderateScale(18), height: moderateScale(18), borderRadius: moderateScale(3), borderWidth: 1.5, borderColor: colors.subtext, justifyContent: 'center', alignItems: 'center' }} />}
                  <Text style={[styles.rememberText, { color: colors.subtext }]}>Ghi nhớ mật khẩu</Text>
                </Pressable>
                <Pressable style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={[styles.forgotText, { color: colors.primary }]}>Quên mật khẩu?</Text>
                </Pressable>
              </View>

              <Pressable
                style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed, loading && { opacity: 0.7 }]}
                onPress={() => handleLogin()}
                disabled={loading}
              >
                <LinearGradient
                  colors={[theme.staticColors.primary, '#A50B16']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <>
                        <Text style={styles.btnText}>Đăng nhập</Text>
                        <ChevronRight size={moderateScale(18)} color={theme.staticColors.secondary} />
                      </>
                  }
                </LinearGradient>
              </Pressable>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(800).delay(400)} style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <Text style={[styles.footerText, { color: colors.subtext }]}>Chưa có tài khoản? </Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.signupText, { color: colors.primary }]}>Đăng ký miễn phí</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  themeToggleContainer: { position: 'absolute', top: 10, right: 10, zIndex: 10 },
  themeToggleBtn: { padding: 10, borderRadius: 20 },
  glowTop: {
    position: 'absolute', top: verticalScale(-100), left: '30%',
    width: horizontalScale(300), height: horizontalScale(300), borderRadius: horizontalScale(150),
  },
  glowBottom: {
    position: 'absolute', bottom: verticalScale(-80), right: '20%',
    width: horizontalScale(250), height: horizontalScale(250), borderRadius: horizontalScale(125),
  },
  content: { flex: 1 },
  scrollContent: {
    flexGrow: 1, justifyContent: 'center',
    paddingHorizontal: horizontalScale(24), paddingVertical: verticalScale(60),
  },
  header: { alignItems: 'center', marginBottom: verticalScale(32), marginTop: verticalScale(20) },
  logoCircle: {
    width: horizontalScale(72), height: horizontalScale(72), borderRadius: horizontalScale(36),
    justifyContent: 'center', alignItems: 'center', marginBottom: verticalScale(16),
  },
  logoText: { color: '#fff', fontSize: moderateScale(28), fontWeight: '900', letterSpacing: 1 },
  title: { fontSize: moderateScale(26), fontWeight: '700', marginBottom: verticalScale(6) },
  subtitle: { fontSize: moderateScale(14) },
  card: { borderRadius: Theme.radius.lg, overflow: 'hidden', borderWidth: 1, marginBottom: verticalScale(24) },
  cardInner: { padding: moderateScale(24) },
  formTitle: { fontSize: moderateScale(20), fontWeight: '700', marginBottom: verticalScale(4) },
  formSubtitle: { fontSize: moderateScale(13), marginBottom: verticalScale(24) },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Theme.radius.md, marginBottom: verticalScale(14),
    paddingHorizontal: horizontalScale(14), height: verticalScale(52), borderWidth: 1,
  },
  inputActive: { borderWidth: 1 },
  input: { flex: 1, fontSize: moderateScale(15), marginLeft: horizontalScale(10) },
  eyeBtn: { padding: moderateScale(4) },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(20) },
  rememberMe: { flexDirection: 'row', alignItems: 'center' },
  rememberText: { fontSize: moderateScale(13), marginLeft: horizontalScale(6) },
  forgotPassword: {},
  forgotText: { fontSize: moderateScale(13) },
  btnPrimary: { borderRadius: Theme.radius.md, overflow: 'hidden', marginBottom: verticalScale(16) },
  btnPressed: { opacity: 0.85 },
  btnGradient: {
    height: verticalScale(52), flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: moderateScale(15), fontWeight: '600', marginRight: horizontalScale(6) },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: moderateScale(14) },
  signupText: { fontSize: moderateScale(14), fontWeight: '600' },
});
