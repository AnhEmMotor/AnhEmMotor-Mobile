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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Mail, Lock, Eye, EyeOff, Check, Clock } from 'lucide-react-native';
import { Theme, useActiveColors, useTheme } from '../../theme/Theme';
import { horizontalScale, verticalScale, moderateScale } from '../../utils/responsive';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ForgotPasswordScreen({ navigation }) {
  const theme = useTheme();
  const colors = theme.colors;
  const activeColors = useActiveColors();

  const [step, setStep] = useState(1); // 1: phone, 2: OTP, 3: reset password
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  const canSendOtp = phone.length >= 9; // basic validation
  const canReset = newPass && newPass === confirmPass;

  const handleSendOtp = () => {
    if (canSendOtp) {
      // TODO: call backend to send OTP
      setStep(2);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      // TODO: verify OTP with backend
      setStep(3);
    }
  };

  const handleResetPassword = () => {
    if (canReset) {
      // TODO: call backend to set new password
      navigation.navigate('Login');
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
          <Animated.View entering={FadeInDown.duration(800)} style={styles.card}>
            <BlurView intensity={theme.isDark ? 25 : 50} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            <View style={[styles.cardInner, { backgroundColor: colors.glassBg }]}>
              <Text style={[styles.formTitle, { color: colors.text }]}>Quên mật khẩu</Text>
              <Text style={[styles.formSubtitle, { color: colors.subtext }]}>Nhập số điện thoại để nhận OTP</Text>

              {step === 1 && (
                <>
                  {/* Phone Input */}
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: colors.inputBg, borderColor: colors.border },
                      activeInput === 'phone' && [styles.inputActive, { borderColor: colors.primary + '80', backgroundColor: colors.primary + '10' }],
                    ]}
                  >
                    <Mail size={moderateScale(18)} color={activeInput === 'phone' ? colors.primary : colors.subtext} />
                    {/* +84 prefix */}
                    <View style={[styles.phonePrefixWrapper, { borderColor: colors.border }]}>
                      <Text style={[styles.phonePrefix, { color: colors.text }]}>+84</Text>
                    </View>
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="9x xxx xxxx"
                      placeholderTextColor={colors.subtext}
                      value={phone}
                      onChangeText={(text) => setPhone(text.replace(/^0/, ''))}
                      keyboardType="phone-pad"
                      maxLength={9}
                      onFocus={() => setActiveInput('phone')}
                      onBlur={() => setActiveInput(null)}
                    />
                  </View>
                  <Pressable
                    style={[styles.btnPrimary, !canSendOtp && styles.btnDisabled]}
                    disabled={!canSendOtp}
                    onPress={handleSendOtp}
                  >
                    <LinearGradient
                      colors={[theme.staticColors.primary, '#A50B16']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.btnGradient}
                    >
                      <Text style={styles.btnText}>Gửi OTP</Text>
                    </LinearGradient>
                  </Pressable>
                </>
              )}

              {step === 2 && (
                <>
                  {/* OTP Input */}
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: colors.inputBg, borderColor: colors.border },
                      activeInput === 'otp' && [styles.inputActive, { borderColor: colors.primary + '80', backgroundColor: colors.primary + '10' }],
                    ]}
                  >
                    <Clock size={moderateScale(18)} color={activeInput === 'otp' ? colors.primary : colors.subtext} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Mã OTP (6 chữ số)"
                      placeholderTextColor={colors.subtext}
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="numeric"
                      maxLength={6}
                      onFocus={() => setActiveInput('otp')}
                      onBlur={() => setActiveInput(null)}
                    />
                  </View>
                  <Pressable style={styles.btnPrimary} onPress={handleVerifyOtp}>
                    <LinearGradient
                      colors={[theme.staticColors.primary, '#A50B16']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.btnGradient}
                    >
                      <Text style={styles.btnText}>Xác nhận OTP</Text>
                    </LinearGradient>
                  </Pressable>
                </>
              )}

              {step === 3 && (
                <>
                  {/* New Password */}
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: colors.inputBg, borderColor: colors.border },
                      activeInput === 'newPass' && [styles.inputActive, { borderColor: colors.primary + '80', backgroundColor: colors.primary + '10' }],
                    ]}
                  >
                    <Lock size={moderateScale(18)} color={activeInput === 'newPass' ? colors.primary : colors.subtext} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Mật khẩu mới"
                      placeholderTextColor={colors.subtext}
                      value={newPass}
                      onChangeText={setNewPass}
                      secureTextEntry={!showPassword}
                      onFocus={() => setActiveInput('newPass')}
                      onBlur={() => setActiveInput(null)}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                      {showPassword ? <EyeOff size={moderateScale(18)} color={colors.subtext} /> : <Eye size={moderateScale(18)} color={colors.subtext} />}
                    </Pressable>
                  </View>
                  {/* Confirm Password */}
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: colors.inputBg, borderColor: colors.border },
                      activeInput === 'confirmPass' && [styles.inputActive, { borderColor: colors.primary + '80', backgroundColor: colors.primary + '10' }],
                    ]}
                  >
                    <Lock size={moderateScale(18)} color={activeInput === 'confirmPass' ? colors.primary : colors.subtext} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Xác nhận mật khẩu"
                      placeholderTextColor={colors.subtext}
                      value={confirmPass}
                      onChangeText={setConfirmPass}
                      secureTextEntry={!showPassword}
                      onFocus={() => setActiveInput('confirmPass')}
                      onBlur={() => setActiveInput(null)}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                      {showPassword ? <EyeOff size={moderateScale(18)} color={colors.subtext} /> : <Eye size={moderateScale(18)} color={colors.subtext} />}
                    </Pressable>
                  </View>
                  <Pressable
                    style={[styles.btnPrimary, !canReset && styles.btnDisabled]}
                    disabled={!canReset}
                    onPress={handleResetPassword}
                  >
                    <LinearGradient
                      colors={[theme.staticColors.primary, '#A50B16']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.btnGradient}
                    >
                      <Text style={styles.btnText}>Đặt lại mật khẩu</Text>
                    </LinearGradient>
                  </Pressable>
                </>
              )}
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
  card: { borderRadius: Theme.radius.lg, overflow: 'hidden', borderWidth: 1, marginBottom: verticalScale(24) },
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
  btnPrimary: { borderRadius: Theme.radius.md, overflow: 'hidden', marginBottom: verticalScale(16) },
  btnDisabled: { opacity: 0.5 },
  btnGradient: { height: verticalScale(52), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: moderateScale(15), fontWeight: '600', marginRight: horizontalScale(6) },
});
