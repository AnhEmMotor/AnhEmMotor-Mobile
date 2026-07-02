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
import { Mail, Lock, Eye, EyeOff, ChevronRight, Shield, Moon, Sun, CheckSquare, Square } from 'lucide-react-native';
import { Theme, useActiveColors, useTheme } from '../theme/Theme';
import { useGlobalState } from '../context/GlobalState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

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

// Tạo timeout 10 giây riêng cho request login
const loginController = new AbortController();
const loginTimeoutId = setTimeout(() => loginController.abort(), 10000);

try {
// 1. Đăng nhập
const loginResponse = await fetch(`${API_BASE_URL}/api/v1/Auth/login`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Accept': 'application/json',
},
body: JSON.stringify({
usernameOrEmail: email.trim(),
password: password,
}),
signal: loginController.signal,
});

const loginData = await loginResponse.json();

if (loginResponse.ok && (loginData.isSuccess === undefined || loginData.isSuccess === true)) {
clearTimeout(loginTimeoutId);

// Lưu thông tin đăng nhập vào AsyncStorage
const tokenData = loginData.value || loginData;
const accessToken = tokenData.accessToken;

if (rememberPassword) {
  await AsyncStorage.setItem('@AEM_Remembered_Email', email.trim());
  await AsyncStorage.setItem('@AEM_Remembered_Password', password);
} else {
  await AsyncStorage.removeItem('@AEM_Remembered_Email');
  await AsyncStorage.removeItem('@AEM_Remembered_Password');
}

if (accessToken) {
await AsyncStorage.setItem('accessToken', accessToken);
}
if (tokenData.refreshToken) {
await AsyncStorage.setItem('refreshToken', tokenData.refreshToken);
}

// 2. Lấy thông tin user để phân quyền và lưu trữ
if (accessToken) {
const userController = new AbortController();
const userTimeoutId = setTimeout(() => userController.abort(), 10000);

try {
const userResponse = await fetch(`${API_BASE_URL}/api/v1/User/me`, {
method: 'GET',
headers: {
'Accept': 'application/json',
'Authorization': `Bearer ${accessToken}`,
},
signal: userController.signal,
});

clearTimeout(userTimeoutId);

if (userResponse.ok) {
const userData = await userResponse.json();
const userProfile = userData.value || userData;

// Map dữ liệu từ Backend sang định dạng của Mobile app và lưu
const mappedProfile = {
uid: userProfile.id,
name: userProfile.fullName || userProfile.userName,
email: userProfile.email,
phone: userProfile.phoneNumber,
gender: userProfile.gender,
avatar: userProfile.avatarUrl,
birthDate: userProfile.dateOfBirth,
permissions: userProfile.permissions || [],
settings: {
theme: 'dark',
language: 'vi',
maintenanceNotifications: true,
biometricLogin: false
}
};

await AsyncStorage.setItem('@AEM_Customer_Profile', JSON.stringify(mappedProfile));

// Chuyển hướng dựa vào quyền
if (userProfile.permissions && userProfile.permissions.length > 0) {
navigation.navigate('AdminHome');
} else {
navigation.navigate('CustomerHome');
}
} else {
// Mặc định vào CustomerHome nếu không lấy được profile
navigation.navigate('CustomerHome');
}
} catch (userError) {
clearTimeout(userTimeoutId);
if (userError.name === 'AbortError') {
Alert.alert('Lỗi quá thời gian', 'Không thể tải thông tin người dùng. Vui lòng thử lại.');
} else {
navigation.navigate('CustomerHome');
}
}
} else {
navigation.navigate('CustomerHome');
}
} else {
const errorMessage = loginData.error?.message || loginData.title || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
Alert.alert('Lỗi đăng nhập', errorMessage);
}
} catch (error) {
console.error('Login error:', error);
if (error.name === 'AbortError') {
Alert.alert('Lỗi quá thời gian', 'Máy chủ không phản hồi. Vui lòng kiểm tra lại kết nối mạng hoặc đảm bảo máy chủ Backend đang chạy.');
} else {
Alert.alert('Lỗi kết nối', 'Không thể kết nối đến máy chủ. Hãy chắc chắn rằng API_BASE_URL đang cấu hình đúng IP máy tính của bạn.');
}
} finally {
clearTimeout(loginTimeoutId);
setLoading(false);
}
};

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
<Animated.View entering={FadeInDown.duration(800)} style={[styles.themeToggleContainer, { top: Math.max(insets.top, 20) + 10 }]}>
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
editable={!loading}
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
  <Pressable 
    style={styles.rememberMe} 
    onPress={() => setRememberPassword(!rememberPassword)}
  >
    {rememberPassword ? (
      <CheckSquare size={moderateScale(18)} color={colors.primary} />
    ) : (
      <Square size={moderateScale(18)} color={colors.subtext} />
    )}
    <Text style={[styles.rememberText, { color: colors.subtext }]}>Ghi nhớ mật khẩu</Text>
  </Pressable>

  <Pressable style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
    <Text style={[styles.forgotText, { color: colors.primary }]}>Quên mật khẩu?</Text>
  </Pressable>
</View>

{/* Login Button */}
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
{loading ? (
<ActivityIndicator color="#fff" />
) : (
<>
<Text style={styles.btnText}>Đăng nhập</Text>
<ChevronRight size={moderateScale(18)} color={theme.staticColors.secondary} />
</>
)}
</LinearGradient>
</Pressable>
</View>
</Animated.View>

{/* Footer */}
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
borderRadius: Theme.radius.lg, overflow: 'hidden', borderWidth: 1,
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

optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(20) },
rememberMe: { flexDirection: 'row', alignItems: 'center' },
rememberText: { fontSize: moderateScale(13), marginLeft: horizontalScale(6) },

forgotPassword: { },
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
