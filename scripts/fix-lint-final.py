import re
import os

def fix_file(filepath, replacements):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = re.sub(old, new, content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. index.js - duplicate registerRootComponent
# Let's just fix it by replacing the whole file, it's short.
index_content = """import { registerRootComponent } from "expo";
import App from "./App";
registerRootComponent(App);"""
# I'll just restore index.js first and then apply the require workaround correctly.
# Wait, no need. If I just write it cleanly:
index_new = """import App from './App';
const { registerRootComponent } = require('expo');
registerRootComponent(App);"""
with open('index.js', 'w', encoding='utf-8') as f:
    f.write(index_new)

# 2. GlobalSettingsModal.js
fix_file('src/components/GlobalSettingsModal.js', [
    (r'const GlobalSettingsModal = \(\{[\s\S]*?\}\) => \{', r'\g<0>\n  const Haptics = require("expo-haptics");')
])

# 3. useProfileController.js
fix_file('src/features/profile/presentation/controller/useProfileController.js', [
    (r'export const useProfileController = \(\) => \{', r'\g<0>\n  const ImagePicker = require("expo-image-picker");\n  const Haptics = require("expo-haptics");')
])

# 4. ProfileEditScreen.js
fix_file('src/screens/Customer/ProfileEditScreen.js', [
    (r'const ProfileEditScreen = \(\) => \{', r'\g<0>\n  const ImagePicker = require("expo-image-picker");'),
    (r'StyleSheet,\s*', '')
])

# 5. AppNavigator.js
fix_file('src/navigation/AppNavigator.js', [
    (r',\s*useGlobalState', '')
])

# 6. NotificationScreen.js
fix_file('src/screens/Customer/Notification/NotificationScreen.js', [
    (r',\s*Bell', '')
])

# 7. SavedNewsScreen.js
fix_file('src/screens/Customer/SavedNewsScreen.js', [
    (r'StyleSheet,\s*', '')
])
