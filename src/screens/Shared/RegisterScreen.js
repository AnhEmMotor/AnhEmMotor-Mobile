import React, { useState } from 'react';
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
import { Mail, Lock, Eye, EyeOff, Check } from 'lucide-react-native';
import { Theme, useActiveColors, useTheme } from '../../theme/Theme';
import { horizontalScale, verticalScale, moderateScale } from '../../utils/responsive';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { API_BASE_URL } from '../../config';

export default function RegisterScreen({ navigation }) {
  const theme = useTheme();
  const colors = theme.colors;
  const activeColors = useActiveColors();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [loading, setLoading] = useState(false);

  const canSubmit =
    name && email && password && password === confirmPassword && termsAccepted;

  const handleRegister = async () => {
    if (!canSubmit) return;
    
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          fullName: name.trim(),
          email: email.trim(),
          password: password
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok && (data.isSuccess === undefined || data.isSuccess === true)) {
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        const errorMsg = data.error?.message || data.title || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin (Mật khẩu cần chữ hoa, thường, số, ký tự đặc biệt).';
        Alert.alert('Lỗi đăng ký', errorMsg);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        Alert.alert('Lỗi kết nối', 'Máy chủ không phản hồi. Vui lòng thử lại sau.');
      } else {
        Alert.alert('Lỗi hệ thống', 'Không thể kết nối đến máy chủ. Hãy chắc chắn backend đang chạy.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background gradient */}
      <LinearGradient
        colors={theme.isDark ? ['#050505', '#0B0B0B', '#191919'] : ['#FFFFFF', '#F8FAFC', '#E5E7EB']}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient glows */}
      <View style={[styles.glowTop, { backgroundColor: theme.staticColors.primary + '18' }]} />
      <View style={[styles.glowBottom, { backgroundColor: theme.staticColors.secondary + '14' }]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View entering={FadeInDown.duration(800)} style={styles.card}>
            <BlurView intensity={theme.isDark ? 25 : 50} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            <View style={[styles.cardInner, { backgroundColor: colors.glassBg }]}>
              <Text style={[styles.formTitle, { color: colors.text }]}>Tạo tài khoản</Text>
              <Text style={[styles.formSubtitle, { color: colors.subtext }]}>Điền thông tin để bắt đầu</Text>

              {/* Name Input */}
              <Animated.View entering={FadeInUp.duration(600).delay(100)}>
                <View
                  style={[
                    styles.inputWrapper,
                    { backgroundColor: colors.inputBg, borderColor: colors.border },
                    activeInput === 'name' && [styles.inputActive, { borderColor: colors.primary + '80', backgroundColor: colors.primary + '10' }],
                  ]}
                >
                  <Mail size={moderateScale(18)} color={activeInput === 'name' ? colors.primary : colors.subtext} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Tên của bạn"
                    placeholderTextColor={colors.subtext}
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setActiveInput('name')}
                    onBlur={() => setActiveInput(null)}
                  />
                </View>
              </Animated.View>

              {/* Email Input */}
              <Animated.View entering={FadeInUp.duration(600).delay(200)}>
                <View
                  style={[
                    styles.inputWrapper,
                    { backgroundColor: colors.inputBg, borderColor: colors.border },
                    activeInput === 'email' && [styles.inputActive, { borderColor: colors.primary + '80', backgroundColor: colors.primary + '10' }],
                  ]}
                >
                  <Mail size={moderateScale(18)} color={activeInput === 'email' ? colors.primary : colors.subtext} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Email của bạn"
                    placeholderTextColor={colors.subtext}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setActiveInput('email')}
                    onBlur={() => setActiveInput(null)}
                    editable={!loading}
                  />
                </View>
              </Animated.View>

              {/* Password Input */}
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.inputBg, borderColor: colors.border },
                  activeInput === 'password' && [styles.inputActive, { borderColor: colors.primary + '80', backgroundColor: colors.primary + '10' }],
                ]}
              >
                <Lock size={moderateScale(18)} color={activeInput === 'password' ? colors.primary : colors.subtext} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Mật khẩu"
                  placeholderTextColor={colors.subtext}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setActiveInput('password')}
                  onBlur={() => setActiveInput(null)}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword ? <EyeOff size={moderateScale(18)} color={colors.subtext} /> : <Eye size={moderateScale(18)} color={colors.subtext} />}
                </Pressable>
              </View>

              {/* Confirm Password Input */}
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.inputBg, borderColor: colors.border },
                  activeInput === 'confirm' && [styles.inputActive, { borderColor: colors.primary + '80', backgroundColor: colors.primary + '10' }],
                ]}
              >
                <Lock size={moderateScale(18)} color={activeInput === 'confirm' ? colors.primary : colors.subtext} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Xác nhận mật khẩu"
                  placeholderTextColor={colors.subtext}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setActiveInput('confirm')}
                  onBlur={() => setActiveInput(null)}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword ? <EyeOff size={moderateScale(18)} color={colors.subtext} /> : <Eye size={moderateScale(18)} color={colors.subtext} />}
                </Pressable>
              </View>

              {/* Terms Checkbox */}
              <Pressable onPress={() => setTermsAccepted(!termsAccepted)} style={styles.checkboxContainer}>
                <View style={[styles.checkboxBox, termsAccepted && { backgroundColor: colors.primary }]}>
                  {termsAccepted && <Check size={moderateScale(14)} color={colors.glassBg} />}
                </View>
                <Text style={[styles.checkboxText, { color: colors.subtext }]}>Tôi đồng ý với các điều khoản</Text>
              </Pressable>

              {/* Register Button */}
              <Pressable
                style={[styles.btnPrimary, (!canSubmit || loading) && styles.btnDisabled]}
                disabled={!canSubmit || loading}
                onPress={handleRegister}
              >
                <LinearGradient
                  colors={[theme.staticColors.primary, '#A50B16']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>Đăng ký</Text>
                  )}
                </LinearGradient>
              </Pressable>

              {/* Link back to login */}
              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: colors.subtext }]}>Đã có tài khoản? </Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                  <Text style={[styles.signupText, { color: colors.primary }]}>Đăng nhập</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(24),
    paddingVertical: verticalScale(60),
  },
  glowTop: {
    position: 'absolute',
    top: verticalScale(-100),
    left: '30%',
    width: horizontalScale(300),
    height: horizontalScale(300),
    borderRadius: horizontalScale(150),
    backgroundColor: 'rgba(0,82,212,0.12)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: verticalScale(-80),
    right: '20%',
    width: horizontalScale(250),
    height: horizontalScale(250),
    borderRadius: horizontalScale(125),
    backgroundColor: 'rgba(227,27,35,0.08)',
  },
  card: {
    borderRadius: Theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: verticalScale(24),
  },
  cardInner: { padding: moderateScale(24) },
  formTitle: { fontSize: moderateScale(20), fontWeight: '700', marginBottom: verticalScale(4) },
  formSubtitle: { fontSize: moderateScale(13), marginBottom: verticalScale(24) },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.radius.md,
    marginBottom: verticalScale(14),
    paddingHorizontal: horizontalScale(14),
    height: verticalScale(52),
    borderWidth: 1,
  },
  inputActive: { borderWidth: 1 },
  input: { flex: 1, fontSize: moderateScale(15), marginLeft: horizontalScale(6) },
  eyeBtn: { padding: moderateScale(4) },
  phonePrefixWrapper: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: horizontalScale(8),
    marginLeft: horizontalScale(8),
    marginRight: horizontalScale(4),
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  phonePrefix: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  checkboxBox: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderWidth: 1,
    borderColor: '#777',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(8),
  },
  checkboxText: { fontSize: moderateScale(13) },
  btnPrimary: { borderRadius: Theme.radius.md, overflow: 'hidden', marginBottom: verticalScale(16) },
  btnDisabled: { opacity: 0.5 },
  btnGradient: {
    height: verticalScale(52),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: moderateScale(15), fontWeight: '600', marginRight: horizontalScale(6) },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: verticalScale(12) },
  footerText: { fontSize: moderateScale(14) },
  signupText: { fontSize: moderateScale(14), fontWeight: '600' },
});
