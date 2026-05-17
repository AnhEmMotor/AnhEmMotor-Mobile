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
import { Mail, Lock, Eye, EyeOff, ChevronRight, Shield } from 'lucide-react-native';
import { Theme } from '../theme/Theme';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  return (
    <View style={styles.container}>
      {/* Soft gradient background */}
      <LinearGradient
        colors={['#0A0F1E', '#0F172A', '#1E293B']}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative ambient glow */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Brand Header */}
          <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.header}>
            <LinearGradient
              colors={['#E31B23', '#9B1219']}
              style={styles.logoCircle}
            >
              <Text style={styles.logoText}>AE</Text>
            </LinearGradient>
            <Text style={styles.title}>AnhEm Motor</Text>
            <Text style={styles.subtitle}>Showroom xe mô tô cao cấp</Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View entering={FadeInDown.duration(800).delay(250)} style={styles.card}>
            <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.cardInner}>
              <Text style={styles.formTitle}>Chào mừng trở lại</Text>
              <Text style={styles.formSubtitle}>Đăng nhập để tiếp tục</Text>

              {/* Email Input */}
              <View style={[styles.inputWrapper, activeInput === 'email' && styles.inputActive]}>
                <Mail size={moderateScale(18)} color={activeInput === 'email' ? Theme.colors.primary : Theme.colors.subtext} />
                <TextInput
                  style={styles.input}
                  placeholder="Email của bạn"
                  placeholderTextColor={Theme.colors.subtext}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setActiveInput('email')}
                  onBlur={() => setActiveInput(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View style={[styles.inputWrapper, activeInput === 'password' && styles.inputActive]}>
                <Lock size={moderateScale(18)} color={activeInput === 'password' ? Theme.colors.primary : Theme.colors.subtext} />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu"
                  placeholderTextColor={Theme.colors.subtext}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setActiveInput('password')}
                  onBlur={() => setActiveInput(null)}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword
                    ? <EyeOff size={moderateScale(18)} color={Theme.colors.subtext} />
                    : <Eye size={moderateScale(18)} color={Theme.colors.subtext} />
                  }
                </Pressable>
              </View>

              <Pressable style={styles.forgotPassword}>
                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
              </Pressable>

              {/* Customer Login */}
              <Pressable
                style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
                onPress={() => navigation.navigate('CustomerHome')}
              >
                <LinearGradient
                  colors={['#1A6EFF', '#0052D4']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.btnText}>Đăng nhập Khách Hàng</Text>
                  <ChevronRight size={moderateScale(18)} color="#fff" />
                </LinearGradient>
              </Pressable>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>hoặc</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Admin Login */}
              <Pressable
                style={({ pressed }) => [styles.btnAdmin, pressed && styles.btnPressed]}
                onPress={() => navigation.navigate('AdminHome')}
              >
                <Shield size={moderateScale(16)} color={Theme.colors.subtext} style={{ marginRight: horizontalScale(8) }} />
                <Text style={styles.btnAdminText}>Vào với quyền Quản Trị</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={FadeInUp.duration(800).delay(400)} style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản? </Text>
            <Pressable>
              <Text style={styles.signupText}>Đăng ký miễn phí</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },

  glowTop: {
    position: 'absolute', top: verticalScale(-100), left: '30%',
    width: horizontalScale(300), height: horizontalScale(300), borderRadius: horizontalScale(150),
    backgroundColor: 'rgba(0,82,212,0.12)',
  },
  glowBottom: {
    position: 'absolute', bottom: verticalScale(-80), right: '20%',
    width: horizontalScale(250), height: horizontalScale(250), borderRadius: horizontalScale(125),
    backgroundColor: 'rgba(227,27,35,0.08)',
  },

  content: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(24),
    paddingVertical: verticalScale(60),
  },

  header: { alignItems: 'center', marginBottom: verticalScale(32) },
  logoCircle: {
    width: horizontalScale(72), height: horizontalScale(72), borderRadius: horizontalScale(36),
    justifyContent: 'center', alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  logoText: { color: '#fff', fontSize: moderateScale(28), fontWeight: '900', letterSpacing: 1 },
  title: { color: '#F1F5F9', fontSize: moderateScale(26), fontWeight: '700', marginBottom: verticalScale(6) },
  subtitle: { color: Theme.colors.subtext, fontSize: moderateScale(14) },

  card: {
    borderRadius: Theme.radius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: verticalScale(24),
  },
  cardInner: { padding: moderateScale(24) },

  formTitle: { color: '#F1F5F9', fontSize: moderateScale(20), fontWeight: '700', marginBottom: verticalScale(4) },
  formSubtitle: { color: Theme.colors.subtext, fontSize: moderateScale(13), marginBottom: verticalScale(24) },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.7)',
    borderRadius: Theme.radius.md, marginBottom: verticalScale(14),
    paddingHorizontal: horizontalScale(14), height: verticalScale(52),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  inputActive: { borderColor: 'rgba(26,110,255,0.5)', backgroundColor: 'rgba(26,110,255,0.06)' },
  input: { flex: 1, color: '#F1F5F9', fontSize: moderateScale(15), marginLeft: horizontalScale(10) },
  eyeBtn: { padding: moderateScale(4) },

  forgotPassword: { alignSelf: 'flex-end', marginBottom: verticalScale(20) },
  forgotText: { color: Theme.colors.primary, fontSize: moderateScale(13) },

  btnPrimary: { borderRadius: Theme.radius.md, overflow: 'hidden', marginBottom: verticalScale(16) },
  btnPressed: { opacity: 0.85 },
  btnGradient: {
    height: verticalScale(52), flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: moderateScale(15), fontWeight: '600', marginRight: horizontalScale(6) },

  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(16) },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  dividerText: { color: Theme.colors.subtext, fontSize: moderateScale(12), paddingHorizontal: horizontalScale(12) },

  btnAdmin: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: verticalScale(50), borderRadius: Theme.radius.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  btnAdminText: { color: Theme.colors.subtext, fontSize: moderateScale(14), fontWeight: '500' },

  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: Theme.colors.subtext, fontSize: moderateScale(14) },
  signupText: { color: Theme.colors.primary, fontSize: moderateScale(14), fontWeight: '600' },
});

