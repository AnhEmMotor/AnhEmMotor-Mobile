# 🚀 Quick Setup - Map Tracking

## ⚡ Cài Đặt Nhanh (3 Bước)

### Bước 1: Cài Đặt Package
```bash
cd AnhEmMotor-Mobile
npx expo install react-native-maps
```

### Bước 2: Lấy API Key (5 phút)

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới (nếu chưa có)
3. Vào **APIs & Services > Library**
4. Tìm và **Enable**:
   - ✅ Maps SDK for Android
   - ✅ Maps SDK for iOS
5. Vào **APIs & Services > Credentials**
6. Click **Create Credentials > API key**
7. Copy API key

### Bước 3: Thêm API Key

**Cách A - Dùng biến môi trường (Recommended):**

Mở terminal trong thư mục `AnhEmMotor-Mobile`:

**Windows PowerShell:**
```powershell
$env:EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY="your_ios_api_key_here"
$env:EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY="your_android_api_key_here"
```

**Mac/Linux:**
```bash
export EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY="your_ios_api_key_here"
export EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY="your_android_api_key_here"
```

**Cách B - Sửa file `.env`:**

Tạo file `.env` trong thư mục `AnhEmMotor-Mobile`:
```env
EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY=your_ios_api_key_here
EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY=your_android_api_key_here
```

### Bước 4: Rebuild & Run
```bash
# Clean và rebuild
npx expo prebuild --clean

# Chạy trên Android
npx expo run:android

# Hoặc iOS
npx expo run:ios

# Hoặc web (không cần API key)
npx expo start --web
```

---

## ✅ Test Map

Sau khi chạy thành công:

1. Đăng nhập với tài khoản **Admin**
2. Vào tab **"Vận chuyển"** (icon navigation)
3. Bạn sẽ thấy:
   - Bản đồ TP.HCM
   - Marker đỏ (kho)
   - Marker vàng/xanh/xám (đơn hàng)
   - Tuyến đường màu sắc
   - Stats ở trên cùng
4. Tap vào marker → Xem chi tiết đơn hàng

---

## 🔧 Troubleshooting

### ❌ "Google Maps SDK not initialized"
**Giải pháp:**
- Kiểm tra API key đã đúng
- Rebuild: `npx expo prebuild --clean && npx expo run:android`

### ❌ Map blank/trắng
**Giải pháp:**
- Kiểm tra Google Cloud Console → APIs đã enable chưa
- Kiểm tra API key restrictions (nếu có)
- Thử fallback mode (component sẽ tự động switch sang default map)

### ❌ "Maps SDK for iOS not enabled"
**Giải pháp:**
- Vào Google Cloud Console
- Enable "Maps SDK for iOS"

### ❌ Lỗi trên Web
**Giải pháp:**
Web cần thêm script tag. Trong `app.json`, thêm vào `web`:
```json
"web": {
  "favicon": "./assets/favicon.png",
  "extra": {
    "googleMapsApiKey": "YOUR_WEB_API_KEY"
  }
}
```

---

## 📱 Features Đã Có

| Feature | Status |
|---------|--------|
| Bản đồ Việt Nam | ✅ |
| Markers (kho, đơn hàng) | ✅ |
| Polyline (tuyến đường) | ✅ |
| Màu sắc theo trạng thái | ✅ |
| Stats overview | ✅ |
| Detail panel | ✅ |
| Legend | ✅ |
| Error handling | ✅ |
| Fallback mode | ✅ |
| Real-time updates | 🔄 (cần backend) |

---

## 🎯 Next Steps

Sau khi map chạy được:

1. **Kết nối Backend**
   - Thay `mockDeliveryData` bằng API call
   - Tạo endpoints: `/api/admin/deliveries`, `/api/admin/deliveries/:id`

2. **Real-time Tracking**
   - Thêm WebSocket cho vị trí shipper
   - Auto-refresh mỗi 30s

3. **Optimization**
   - Virtualization nếu nhiều orders
   - Clustering markers
   - Cache responses

---

## 📚 Files Liên Quan

- `src/screens/Admin/MapTrackingScreen.js` - Component chính
- `src/navigation/AppNavigator.js` - Navigation config
- `app.json` - Google Maps config
- `MAP_SETUP.md` - Hướng dẫn chi tiết
- `MAP_TRACKING_README.md` - Tài liệu sử dụng

---

**Cần hỗ trợ?** Kiểm tra console logs và Google Cloud Console → APIs.

**Version**: 1.0.0 | **Updated**: 2025-06-15
