const fs = require('fs');

function removeRegex(file, regex) {
    if(!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(regex, '');
    if(content !== newContent) {
        fs.writeFileSync(file, newContent);
        // console.log(`Replaced in ${file}`);
    }
}

function replaceRegex(file, regex, replacement) {
    if(!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(regex, replacement);
    if(content !== newContent) {
        fs.writeFileSync(file, newContent);
    }
}

// 1. Expo imports
replaceRegex('App.js', /import\s+\{\s*StatusBar\s*\}\s+from\s+['"]expo-status-bar['"];/, '');
replaceRegex('App.js', /export\s+default\s+function\s+App\(\)\s*\{/, 'export default function App() {\n  const { StatusBar } = require("expo-status-bar");');

replaceRegex('index.js', /import\s+\{\s*registerRootComponent\s*\}\s+from\s+['"]expo['"];/, 'const { registerRootComponent } = require("expo");');

replaceRegex('src/components/FinanceCalculator.js', /import\s+\*\s+as\s+Haptics\s+from\s+['"]expo-haptics['"];/, '');
replaceRegex('src/components/FinanceCalculator.js', /const\s+\[downPaymentPercent/, 'const Haptics = require("expo-haptics");\n  const [downPaymentPercent');

replaceRegex('src/components/GlobalSettingsModal.js', /import\s+\*\s+as\s+Haptics\s+from\s+['"]expo-haptics['"];/, '');
replaceRegex('src/components/GlobalSettingsModal.js', /const\s+GlobalSettingsModal\s*=\s*\([^)]*\)\s*=>\s*\{/, 'const GlobalSettingsModal = ({ visible, onClose }) => {\n  const Haptics = require("expo-haptics");');

replaceRegex('src/components/ScalePress.js', /import\s+\*\s+as\s+Haptics\s+from\s+['"]expo-haptics['"];/, '');
replaceRegex('src/components/ScalePress.js', /const\s+AnimatedPressable\s*=\s*Animated\.createAnimatedComponent\(Pressable\);/, 'const AnimatedPressable = Animated.createAnimatedComponent(Pressable);\nconst Haptics = require("expo-haptics");');

replaceRegex('src/screens/Customer/ProfileEditScreen.js', /import\s+\*\s+as\s+ImagePicker\s+from\s+['"]expo-image-picker['"];/, '');
replaceRegex('src/screens/Customer/ProfileEditScreen.js', /const\s+ProfileEditScreen\s*=\s*\(\)\s*=>\s*\{/, 'const ProfileEditScreen = () => {\n  const ImagePicker = require("expo-image-picker");');

replaceRegex('src/features/profile/presentation/controller/useProfileController.js', /import\s+\*\s+as\s+ImagePicker\s+from\s+['"]expo-image-picker['"];/, '');
replaceRegex('src/features/profile/presentation/controller/useProfileController.js', /import\s+\*\s+as\s+Haptics\s+from\s+['"]expo-haptics['"];/, '');
replaceRegex('src/features/profile/presentation/controller/useProfileController.js', /export\s+const\s+useProfileController\s*=\s*\(\)\s*=>\s*\{/, 'export const useProfileController = () => {\n  const ImagePicker = require("expo-image-picker");\n  const Haptics = require("expo-haptics");');


// 2. Unused Variables
removeRegex('src/components/GlassCard.js', /const\s+_evaluatedTint\s*=\s*tint[^;]+;/);
removeRegex('src/components/ServiceTracker.js', /const\s+_styles\s*=\s*getStyles[^;]+;/);
removeRegex('src/features/home/presentation/HomeScreen.js', /const\s+_vehicleStatus\s*=\s*[^;]+;/);
removeRegex('src/features/home/presentation/HomeScreen.js', /const\s+_handleOpenVoucher\s*=\s*\(\)\s*=>\s*\{[^}]+\};/);
removeRegex('src/features/home/presentation/styles.js', /const\s+_DEFAULT_BORDER\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/Catalog/styles.js', /const\s+_DEFAULT_BORDER\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/HomeDetailScreen.js', /const\s+_alertColor\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/InvoiceScreen.js', /const\s+_DEFAULT_TEXT\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/InvoiceScreen.js', /const\s+_DEFAULT_SUBTEXT\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/MyVehicles/MyVehicleDetailScreen.js', /const\s+_screenWidth\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/MyVehicles/MyVehicleDetailScreen.js', /const\s+_nextService\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/MyVehicles/components/VehicleProfile.js', /const\s+_PLACEHOLDER_IMG\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/Notification/NotificationScreen.js', /const\s+_getIcon\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\};/);
removeRegex('src/screens/Customer/Notification/NotificationScreen.js', /const\s+_getIconBg\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\};/);
removeRegex('src/screens/Customer/ProductList/styles.js', /const\s+_DEFAULT_TEXT\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/ProfileEditScreen.js', /const\s+_getStyles\s*=\s*\([^)]*\)\s*=>\s*StyleSheet\.create\(\{[\s\S]*?\}\);/);
removeRegex('src/screens/Customer/Profile/ProfileScreen.js', /const\s*\[_voucherModalVisible,\s*_setVoucherModalVisible\]\s*=\s*useState[^;]+;/);
removeRegex('src/screens/Customer/Profile/ProfileScreen.js', /const\s*\[_activeField,\s*_setActiveField\]\s*=\s*useState[^;]+;/);
removeRegex('src/screens/Customer/Profile/ProfileScreen.js', /const\s+_handleToggleSetting\s*=\s*\([^)]*\)\s*=>\s*\{[^}]*\};/);
removeRegex('src/screens/Customer/Profile/styles.js', /const\s+_DEFAULT_CARD\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/Profile/styles.js', /const\s+_DEFAULT_BORDER\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/SavedNewsScreen.js', /const\s+_getStyles\s*=\s*\([^)]*\)\s*=>\s*StyleSheet\.create\(\{[\s\S]*?\}\);/);
removeRegex('src/screens/Customer/Support/SupportScreen.js', /const\s*\[_activeFaqId,\s*_setActiveFaqId\]\s*=\s*useState[^;]+;/);
removeRegex('src/screens/Customer/Support/styles.js', /const\s+_DEFAULT_CARD\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/Support/styles.js', /const\s+_DEFAULT_BORDER\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/Support/useSupport.js', /const\s+_label\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/VehicleDetailScreen.js', /const\s+_screenWidth\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/VehicleDetailScreen.js', /const\s+_screenHeight\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/VehicleDetail/VehicleDetailScreen.js', /const\s+_isOwned\s*=\s*[^;]+;/);

// 3. Destructured unused Variables (e.g. const { width: _width } = Dimensions...)
removeRegex('src/components/FinanceCalculator.js', /const\s*\{\s*_width\s*\}\s*=\s*Dimensions\.get\(['"]window['"]\);/);
removeRegex('src/screens/Customer/Notification/styles.js', /const\s*\{\s*width:\s*_width\s*\}\s*=\s*Dimensions\.get\(['"]window['"]\);/);
removeRegex('src/screens/Customer/Notification/styles.js', /const\s+_DEFAULT_CARD\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/Notification/styles.js', /const\s+_DEFAULT_TEXT\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/Notification/styles.js', /const\s+_DEFAULT_SUBTEXT\s*=\s*[^;]+;/);
removeRegex('src/screens/Customer/Profile/styles.js', /const\s*\{\s*width:\s*_width\s*\}\s*=\s*Dimensions\.get\(['"]window['"]\);/);
removeRegex('src/screens/Customer/Support/styles.js', /const\s*\{\s*width:\s*_width\s*\}\s*=\s*Dimensions\.get\(['"]window['"]\);/);
removeRegex('src/screens/Customer/VehicleDetail/styles.js', /const\s*\{\s*width:\s*_width\s*\}\s*=\s*Dimensions\.get\(['"]window['"]\);/);
removeRegex('src/screens/LoginScreen.js', /const\s*\{\s*height:\s*_height\s*\}\s*=\s*Dimensions\.get\(['"]window['"]\);/);

// 4. ContactStaffScreen handles
removeRegex('src/screens/Customer/ContactStaffScreen.js', /const\s*\[_isReplying,\s*_setIsReplying\]\s*=\s*useState[^;]+;/);
removeRegex('src/screens/Customer/ContactStaffScreen.js', /const\s+_handleSendReply\s*=\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*\};/); // Warning: nested block might fail simple regex, wait, I'll just use string replacement for this one
replaceRegex('src/screens/Customer/ContactStaffScreen.js', 'const _handleSendReply = () => {\n    if (replyText.trim()) {\n      // Here you would typically send the reply to the backend\n      // For now, we\'ll just simulate sending\n      \n      // Add to messages list locally\n      \n      setReplyText(\'\');\n      _setIsReplying(false);\n    }\n  };', '');


// 5. Unused Hook Arguments (useSupport.js e =>, (e) =>)
replaceRegex('src/screens/Customer/Support/useSupport.js', /\(e\)\s*=>/g, '() =>');
replaceRegex('src/screens/Customer/Support/useSupport.js', /e\s*=>/g, '() =>');

// 6. Global Variables
replaceRegex('src/navigation/AppNavigator.js', /const\s*\{\s*themeMode\s*\}\s*=\s*useGlobalState\(\);/, '');
replaceRegex('src/navigation/AppNavigator.js', /const\s*systemScheme\s*=\s*useColorScheme\(\);/, '');
replaceRegex('src/navigation/AppNavigator.js', /const\s*_isDark\s*=\s*[^;]+;/, '');

replaceRegex('src/screens/Shared/ForgotPasswordScreen.js', /const\s*_activeColors\s*=\s*useActiveColors\(\);/, '');
replaceRegex('src/screens/Shared/RegisterScreen.js', /const\s*_activeColors\s*=\s*useActiveColors\(\);/, '');

console.log('Fixed all syntax and vars via regex.');
