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
import { Mail, Lock, Eye, EyeOff, ChevronRight, Shield, Moon, Sun } from 'lucide-react-native';
import { Theme, useActiveColors, useTheme } from '../theme/Theme';
import { useGlobalState } from '../context/GlobalState';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const theme = useTheme();
  const colors = theme.colors;
  const { themeMode, setThemeMode } = useGlobalState();
  const toggleTheme = () => setThemeMode(themeMode === 'dark' ? 'light' : 'dark');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Soft gradient background matching theme */}
      <LinearGradient
        colors={theme.isDark ? ['#050505', '#0B0B0B', '#191919'] : ['#FFFFFF', '#F8FAFC', '#E5E7EB']}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative ambient glow */}
      <View style={[styles.glowTop, { backgroundColor: theme.staticColors.primary + '18' }]} />
      <View style={[styles.glowBottom, { backgroundColor: theme.staticColors.secondary + '14' }]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Theme Toggle Button */}
          <Animated.View entering={FadeInDown.duration(800)} style={styles.themeToggleContainer}>
             <Pressable style={[styles.themeToggleBtn, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : theme.staticColors.primary + '0D' }]} onPress={toggleTheme}>
              {theme.isDark ? <Sun color={colors.text} size={20} /> : <Moon color={colors.text} size={20} />}
            </Pressable>
          </Animated.View>

          {/* Brand Header */}
          <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.header}>
            <LinearGradient
              colors={['#E31B23', '#A50B16']}
              style={styles.logoCircle}
            >
              <Text style={styles.logoText}>AE</Text>
            </LinearGradient>
            <Text style={[styles.title, { color: colors.text }]}>AnhEm Motor</Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>Showroom xe mô tô cao cấp</Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View entering={FadeInDown.duration(800).delay(250)} style={[styles.card, { borderColor: colors.border }]}>            
            <BlurView intensity={theme.isDark ? 25 : 50} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            <View style={[styles.cardInner, { backgroundColor: colors.glassBg }]}>              
              <Text style={[styles.formTitle, { color: colors.text }]}>Chào mừng trở lại</Text>
              <Text style={[styles.formSubtitle, { color: colors.subtext }]}>Đăng nhập để tiếp tục</Text>

              {/* Email Input */}
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
                />
              </View>

              {/* Password Input */}
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
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  {showPassword
                    ? <EyeOff size={moderateScale(18)} color={colors.subtext} />
                    : <Eye size={moderateScale(18)} color={colors.subtext} />
                  }
                </Pressable>
              </View>

              <Pressable style={styles.forgotPassword}>
                <Text style={[styles.forgotText, { color: colors.primary }]}>Quên mật khẩu?</Text>
              </Pressable>

              {/* Customer Login */}
              <Pressable
                style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPressed]}
                onPress={() => navigation.navigate('CustomerHome')}
              >
                <LinearGradient
                  colors={[theme.staticColors.primary, '#A50B16']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.btnText}>Đăng nhập Khách Hàng</Text>
                  <ChevronRight size={moderateScale(18)} color={theme.staticColors.secondary} />
                </LinearGradient>
              </Pressable>

              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]} />
                <Text style={[styles.dividerText, { color: colors.subtext }]}>hoặc</Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]} />
              </View>

              {/* Admin Login */}
              <Pressable
                style={({ pressed }) => [
                  styles.btnAdmin,
                  pressed && styles.btnPressed,
                  {
                    borderColor: theme.isDark ? colors.border : theme.staticColors.primary + '1A',
                    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : theme.staticColors.primary + '0D',
                  }
                ]}
                onPress={() => navigation.navigate('AdminHome')}
              >
                <Shield size={moderateScale(16)} color={theme.staticColors.primary} style={{ marginRight: horizontalScale(8) }} />
                <Text style={[styles.btnAdminText, { color: theme.staticColors.primary }]}>Vào với quyền Quản Trị</Text>
              </Pressable>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={FadeInUp.duration(800).delay(400)} style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.subtext }]}>Chưa có tài khoản? </Text>
            <Pressable>
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

  header: { alignItems: 'center', marginBottom: verticalScale(32), marginTop: verticalScale(20) },
  logoCircle: {
    width: horizontalScale(72), height: horizontalScale(72), borderRadius: horizontalScale(36),
    justifyContent: 'center', alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  logoText: { color: '#fff', fontSize: moderateScale(28), fontWeight: '900', letterSpacing: 1 },
  title: { fontSize: moderateScale(26), fontWeight: '700', marginBottom: verticalScale(6) },
  subtitle: { fontSize: moderateScale(14) },

  card: {
    borderRadius: Theme.radius.lg, overflow: 'hidden',
    borderWidth: 1,
    marginBottom: verticalScale(24),
  },
  cardInner: { padding: moderateScale(24) },

  formTitle: { fontSize: moderateScale(20), fontWeight: '700', marginBottom: verticalScale(4) },
  formSubtitle: { fontSize: moderateScale(13), marginBottom: verticalScale(24) },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Theme.radius.md, marginBottom: verticalScale(14),
    paddingHorizontal: horizontalScale(14), height: verticalScale(52),
    borderWidth: 1,
  },
  inputActive: { borderWidth: 1 },
  input: { flex: 1, fontSize: moderateScale(15), marginLeft: horizontalScale(10) },
  eyeBtn: { padding: moderateScale(4) },

  forgotPassword: { alignSelf: 'flex-end', marginBottom: verticalScale(20) },
  forgotText: { fontSize: moderateScale(13) },

  btnPrimary: { borderRadius: Theme.radius.md, overflow: 'hidden', marginBottom: verticalScale(16) },
  btnPressed: { opacity: 0.85 },
  btnGradient: {
    height: verticalScale(52), flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: moderateScale(15), fontWeight: '600', marginRight: horizontalScale(6) },

  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(16) },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: moderateScale(12), paddingHorizontal: horizontalScale(12) },

  btnAdmin: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: verticalScale(50), borderRadius: Theme.radius.md,
    borderWidth: 1,
  },
  btnAdminText: { fontSize: moderateScale(14), fontWeight: '500' },

  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: moderateScale(14) },
  signupText: { fontSize: moderateScale(14), fontWeight: '600' },
});

