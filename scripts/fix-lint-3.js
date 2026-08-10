const fs = require('fs');

function fix(file, from, to) {
    if(!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(from, to);
    fs.writeFileSync(file, content);
}

// 1. AppNavigator.js
fix('src/navigation/AppNavigator.js', 'useColorScheme, ', '');
fix('src/navigation/AppNavigator.js', ', useGlobalState', '');

// 2. index.js - move require
fix('index.js', 'const { registerRootComponent } = require("expo");\nregisterRootComponent(App);', 'registerRootComponent(App);');
fix('index.js', 'import App from \'./App\';', 'import App from \'./App\';\n\nconst { registerRootComponent } = require("expo");');

// 3. FinanceCalculator.js
fix('src/components/FinanceCalculator.js', 'Dimensions, ', '');

// 4. GlobalSettingsModal.js
fix('src/components/GlobalSettingsModal.js', 'const GlobalSettingsModal = ({\n  visible,\n  onClose\n}) => {', 'const GlobalSettingsModal = ({\n  visible,\n  onClose\n}) => {\n  const Haptics = require("expo-haptics");');
fix('src/components/GlobalSettingsModal.js', 'const GlobalSettingsModal = ({ visible, onClose }) => {', 'const GlobalSettingsModal = ({ visible, onClose }) => {\n  const Haptics = require("expo-haptics");');

// 5. useProfileController.js
fix('src/features/profile/presentation/controller/useProfileController.js', 'export const useProfileController = () => {', 'export const useProfileController = () => {\n  const ImagePicker = require("expo-image-picker");\n  const Haptics = require("expo-haptics");');

// 6. ProfileEditScreen.js
fix('src/screens/Customer/ProfileEditScreen.js', 'StyleSheet, ', '');
fix('src/screens/Customer/ProfileEditScreen.js', 'const ProfileEditScreen = () => {', 'const ProfileEditScreen = () => {\n  const ImagePicker = require("expo-image-picker");');

// 7. SavedNewsScreen.js
fix('src/screens/Customer/SavedNewsScreen.js', 'StyleSheet, ', '');

// 8. ForgotPasswordScreen & RegisterScreen
fix('src/screens/Shared/ForgotPasswordScreen.js', 'useActiveColors, ', '');
fix('src/screens/Shared/RegisterScreen.js', 'useActiveColors, ', '');

// 9. NotificationScreen.js - syntax error
// Let's just fix it manually using view_file or git restore. Wait, since it's just one syntax error, I'll `git restore` it and do it properly!
