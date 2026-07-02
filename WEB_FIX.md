# 🐛 Fix Lỗi Expo Web - "MIME type ('application/json') is not executable"

## Nguyên Nhân

Lỗi này xảy ra khi:
1. Metro bundler trả về JSON thay vì JavaScript bundle
2. Có lỗi trong code khi bundle
3. Cache cũ hoặc corrupted
4. Web cấu hình Google Maps chưa đúng

## 🔧 Các Bước Fix

### **Fix 1: Restart Expo với Clear Cache (Quan Trọng)**

```bash
# Dừng tất cả servers (Ctrl+C trong tất cả terminal)

# Xóa cache
npx expo start -c

# Hoặc
expo start --clear
```

Sau đó, trong trình duyệt, vào `http://localhost:8081` và reload (Ctrl+R hoặc Cmd+R).

---

### **Fix 2: Kiểm tra API Key Configuration**

Đảm bảo `app.json` có web config:

```json
"web": {
  "favicon": "./assets/favicon.png",
  "extra": {
    "googleMapsApiKey": "${EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY}"
  }
}
```

**Set biến môi trường:**
```bash
# Windows PowerShell
$env:EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY="your_web_api_key_here"

# Mac/Linux
export EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY="your_web_api_key_here"
```

**Lưu ý:** Nếu chưa có Web API key, bạn có thể tạo 1 key chung cho cả 3 platforms trong Google Cloud Console.

---

### **Fix 3: Chạy Web với Config Đặc Biệt**

```bash
# Thử chạy với config different
npx expo start --web --dev-client

# Hoặc
expo start --web --no-dev --minify
```

---

### **Fix 4: Kiểm tra Lỗi trong Code**

Nếu có lỗi syntax hoặc runtime, Metro sẽ trả về JSON error.

**Mở console logs:**
1. Mở Developer Tools trong trình duyệt (F12)
2. Vào tab Network
3. Reload page
4. Xem request `index.bundle` - có thể thấy chi tiết lỗi

Hoặc kiểm tra terminal where Expo chạy - có thể thấy error stack.

---

### **Fix 5: Rebuild Native (Nếu Cần)**

Đôi khi lỗi web liên quan đến native modules:

```bash
npx expo prebuild --clean
npx expo start --web
```

---

### **Fix 6: Tạm Thời Chạy Native (Android/iOS)**

Nếu web vẫn lỗi, hãy chạy trên native trước:

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

Native thường ổn định hơn web với react-native-maps.

---

## 🎯 Workflow Khuyến Nghị

### **Để phát triển:**
```bash
# Chạy native (Android/iOS) cho map feature
npx expo run:android
# hoặc
npx expo run:ios
```

### **Để test web:**
```bash
# Đảm bảo có API key web
export EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY="your_key"

# Clear cache và start
npx expo start -c

# Mở browser: http://localhost:8081
```

---

## 📝 Lỗi Phổ Biến & Giải Pháp

| Lỗi | Nguyên nhân | Giải pháp |
|-----|------------|-----------|
| `MIME type ('application/json')` | Cache corrupt hoặc code error | `expo start -c` |
| `Google Maps SDK not initialized` | Thiếu API key | Thêm API key vào `app.json` |
| `Maps SDK for iOS/Android not enabled` | Chưa enable APIs | Vào Google Cloud Console enable |
| `Blank/white screen` | Lỗi runtime | Check console logs, fix code |
| `Failed to load resource` | Network issue | Check internet, firewall |

---

## 🔍 Debug Steps

1. **Check if react-native-maps installed:**
```bash
npm list react-native-maps
```

2. **Verify app.json config:**
```bash
cat app.json | grep -A5 "googleMaps"
```

3. **Check environment variables:**
```bash
echo $EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY  # Mac/Linux
echo $env:EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY  # Windows
```

4. **Test with simple component:**
Tạo file `TestMap.js` đơn giản để test:
```javascript
import MapView from 'react-native-maps';
export default () => <MapView style={{flex: 1}} />;
```

---

## ⚡ Quick Fix Commands

**Full reset:**
```bash
# Windows PowerShell
Stop-Process -Name "node" -Force
npx expo start -c

# Mac/Linux
pkill -f node
npx expo start -c
```

**Clean node_modules và reinstall (nếu cần):**
```bash
rm -rf node_modules package-lock.json
npm install
npx expo start -c
```

---

## 🌐 Web-Specific Notes

Expo Web với Google Maps cần:

1. ✅ API key trong `app.json` > `web.extra.googleMapsApiKey`
2. ✅ Biến môi trường `EXPO_PUBLIC_GOOGLE_MAPS_WEB_API_KEY`
3. ✅ Rebuild nếu thay đổi `app.json`
4. ✅ Clear cache sau khi thêm API key

**Nếu không có Web API key**, component sẽ tự động fallback sang OpenStreetMap (default provider).

---

## ✅ After Fix

 Sau khi fix thành công, bạn sẽ thấy:
- ✅ Map hiển thị (Google Maps hoặc OSM)
- ✅ Markers và polyline
- ✅ Stats overview
- ✅ Detail panel khi tap marker

---

## 📞 Still Having Issues?

1. Share error logs từ:
   - Terminal (Expo server)
   - Browser console (F12)
   - `http://localhost:8081/--/log`

2. Check versions:
```bash
npx expo --version
npm list react-native-maps
```

3. Try minimal reproduction:
   - Tạo new Expo project
   - Install react-native-maps
   - Add simple MapView

---

**Last Updated**: 2025-06-15
