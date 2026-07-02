export default {
  "expo": {
    "name": "AnhEmMotorMobile",
    "slug": "AnhEmMotorMobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "config": {
        "googleMapsApiKey": process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY || "dummy_ios_key"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "config": {
        "googleMaps": {
          "apiKey": process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY || "dummy_android_key"
        }
      },
      "permissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.RECORD_AUDIO"
      ],
      "package": "com.anonymous.AnhEmMotorMobile"
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "extra": {
        "googleMapsApiKey": process.env.EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY || "dummy_web_key"
      }
    },
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Ứng dụng cần truy cập thư viện ảnh để bạn có thể cập nhật ảnh đại diện.",
          "cameraPermission": "Ứng dụng cần truy cập camera để bạn có thể chụp ảnh đại diện mới."
        }
      ]
    ]
  }
};