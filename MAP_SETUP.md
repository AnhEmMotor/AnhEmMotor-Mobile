# Hướng Dẫn Cài Đặt Google Maps cho AnhEmMotor Mobile

## 1. Cài Đặt Package

Trước tiên, cần cài đặt `react-native-maps` cho Expo project:

```bash
cd AnhEmMotor-Mobile
npx expo install react-native-maps
```

## 2. Lấy Google Maps API Key

### Bước 1: Tạo Project trên Google Cloud Console
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện tại
3. Kích hoạt các APIs sau:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
   - **Places API** (nếu cần tìm kiếm địa điểm)

### Bước 2: Tạo API Key
1. Vào **APIs & Services > Credentials**
2. Click **Create Credentials > API Key**
3. Sao chép API key được tạo

### Bước 3: Cấu Hình API Key Restrictions (Quan trọng)
Để bảo mật, nên giới hạn API key:

**For Android:**
- Thêm restriction: **Android apps**
- Thêm package name: `com.anhemmotor.mobile`
- Thêm SHA-1 certificate fingerprint

**For iOS:**
- Thêm restriction: **iOS apps**
- Thêm Bundle ID: `com.anhemmotor.mobile`

**For Web (nếu cần):**
- Thêm restriction: **HTTP referrers**
- Thêm domain của bạn

## 3. Cấu Hình cho Expo

### File `app.json` hoặc `app.config.js`

Thêm configuration cho Google Maps API key:

```json
{
  "expo": {
    "name": "AnhEmMotor-Mobile",
    "slug": "anhemmotormobile",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"],
    "ios": {
      "bundleIdentifier": "com.anhemmotor.mobile",
      "config": {
        "googleMapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY_HERE"
      }
    },
    "android": {
      "package": "com.anhemmotor.mobile",
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY_HERE"
        }
      }
    }
  }
}
```

**Lưu ý:** Thay `YOUR_GOOGLE_MAPS_API_KEY_HERE` bằng API key thực tế.

## 4. Cấu Hình Trong Code

### MapTrackingScreen Component

Component đã được tạo sẵn tại:
```
src/screens/Admin/MapTrackingScreen.js
```

Component này bao gồm các tính năng:
- ✅ Hiển thị bản đồ Việt Nam (center TP.HCM)
- ✅ Marker cho kho chính và các địa điểm giao hàng
- ✅ Polyline (tuyến đường) màu sắc theo trạng thái:
  - Vàng: Đang giao
  - Xanh: Đã giao
  - Xám: Chờ giao
- ✅ Thống kê tổng quan (số đơn theo trạng thái)
- ✅ Panel chi tiết khi chọn marker
- ✅ Hiển thị tiến độ vận chuyển (%)
- ✅ Legend (chú thích màu)
- ✅ Circle hiển thị vùng hoạt động cho đơn hàng đang giao

### Định nghĩa màu trạng thái:

```javascript
const getStatusColor = (status) => {
  switch (status) {
    case 'in_transit':
      return '#F59E0B'; // Vàng
    case 'delivered':
      return '#22C55E'; // Xanh lá
    case 'pending':
      return '#6B7280'; // Xám
    default:
      return '#6B7280';
  }
};
```

## 5. Dữ liệu Mẫu

Component sử dụng `mockDeliveryData` để demo. Trong thực tế, bạn cần thay bằng API call:

```javascript
const mockDeliveryData = {
  orders: [
    {
      id: 'ORD001',
      customerName: 'Nguyễn Văn A',
      status: 'in_transit',
      progress: 65,
      route: [
        { latitude: 10.8231, longitude: 106.6297, label: 'Kho chính - Q.10' },
        { latitude: 10.8396, longitude: 106.6609, label: 'Khách hàng 1 - Q.1' },
      ],
      currentLocation: { latitude: 10.8396, longitude: 106.6609 },
      // ...
    }
  ],
  warehouse: {
    location: { latitude: 10.8231, longitude: 106.6297 }
  }
};
```

## 6. Tích Hợp với Navigation

MapTrackingScreen đã được thêm vào:
- **Admin Tabs**: Tab mới "Vận chuyển" với icon Navigation
- **Stack Navigator**: Route `AdminMapTracking` để navigate từ các screen khác

### Sử dụng Navigation:

```javascript
// Điều hướng đến MapTrackingScreen
navigation.navigate('AdminMapTracking');

// Hoặc từ bất kỳ đâu
navigation.push('AdminMapTracking');
```

## 7. Tích Hợp với Backend

Để kết nối với backend API:

1. Tạo API endpoints:
   - `GET /api/admin/deliveries` - Lấy danh sách đơn vận chuyển
   - `GET /api/admin/deliveries/:id` - Lấy chi tiết đơn
   - `GET /api/admin/deliveries/stats` - Lấy thống kê

2. Thay `mockDeliveryData` bằng API call:

```javascript
const [deliveryData, setDeliveryData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/deliveries`);
      const data = await response.json();
      setDeliveryData(data);
    } catch (error) {
      console.error('Error fetching delivery data:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

3. Real-time updates (optional):
   - Sử dụng WebSocket để cập nhật vị trí shipper realtime
   - Polling API mỗi 30 giây

## 8. Tối Ưu Hiệu Năng

- **Chỉ render markers cho những đơn hàng đang hiển thị** (use memoization)
- **Lazy load map** khi component mount
- **Giới hạn số lượng orders** trên map (ví dụ: chỉ show đơn trong 24h)
- **Cache API responses** để giảm network calls

## 9. Customization

### Thay đổi bản đồ:
```javascript
<MapView
  mapType="standard" // 'standard', 'satellite', 'hybrid', 'terrain'
/>
```

### Thêm controls:
```javascript
<MapView
  showsUserLocation={true}
  showsMyLocationButton={true}
  showsCompass={true}
  showsScale={true}
  zoomControlEnabled={true} // Android only
/>
```

### Custom marker:
Thay thế default marker bằng custom component trong `renderOrderMarker()`.

## 10. Troubleshooting

### Lỗi "Google Maps SDK not initialized":
- Kiểm tra API key đã được thêm vào `app.json` đúng chưa
- Rebuild app: `npx expo prebuild --clean` rồi rebuild

### Lỗi "Maps SDK for iOS not enabled":
- Kích hoạt Maps SDK for iOS trong Google Cloud Console

### Lỗi trên Web:
- Với expo web, cần thêm `<script>` tag vào `index.html`:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

## 11. Chi Phí Google Maps

Google Maps có free tier:
- **$200 credit mỗi tháng** (miễn phí)
- Maps SDK for Mobile: ~$0.50 / 1000 loads (sau 1st $200)
- Places API: ~$0.17 / 1000 requests

Theo dõi usage tại Google Cloud Console > Billing.

## 12. Files Đã Tạo/Thay Đổi

### Mới:
- `src/screens/Admin/MapTrackingScreen.js` - Component chính
- `MAP_SETUP.md` - File hướng dẫn này

### Đã chỉnh sửa:
- `src/navigation/AppNavigator.js` - Thêm route và tab

## 13. Next Steps

1. ✅ Cài đặt `react-native-maps`
2. ✅ Lấy Google Maps API key
3. ✅ Thêm API key vào `app.json`
4. ✅ Rebuild app
5. 🔄 Kết nối với backend API thực tế
6. 🔄 Thêm realtime tracking với WebSocket
7. 🔄 Tối ưu performance với virtualization (nếu có nhiều orders)

---

**Lưu ý:** Đây là setup cơ bản. Trong môi trường production, cần:
- Bảo mật API key (không commit vào git)
- Thêm error handling đầy đủ
- Test trên cả iOS, Android, Web
- Optimize bundle size
