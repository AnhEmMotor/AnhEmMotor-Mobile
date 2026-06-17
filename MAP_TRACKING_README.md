# Tích Hợp Bản Đồ Vận Chuyển - AnhEmMotor Mobile

## Tổng Quan

Tính năng **Map Tracking** giúp theo dõi tuyến đường giao hàng và tiến độ vận chuyển trong thời gian thực, tương tự như các app thương mại điện tử.

## Các Tính Năng

### 1. Hiển Thị Bản Đồ
- Bản đồ Việt Nam (Google Maps)
- Center tại TP.HCM (có thể zoom, pan)
- Hỗ trợ iOS, Android, Web

### 2. Markers
- 🏪 **Kho chính**: Marker đỏ, hiển thị vị trí kho xuất phát
- 🚚 **Đơn hàng đang giao**: Marker vàng với icon Truck
- ✅ **Đơn hàng đã giao**: Marker xanh lá với icon CheckCircle
- ⏰ **Đơn hàng chờ giao**: Marker xám với icon Clock

### 3. Tuyến Đường (Polyline)
- Màu sắc theo trạng thái đơn hàng
- Line rời (dashed) cho đơn hàng chưa bắt đầu
- Line liền cho đơn hàng đang/đã giao
- Hiển thị toàn bộ route từ kho đến từng điểm

### 4. Thống Kê
- Tổng số đơn
- Đang giao
- Đã giao
- Chờ giao

### 5. Panel Chi Tiết
Khi chọn marker:
- Thông tin khách hàng
- Tiến độ (%)
- Danh sách sản phẩm
- Tuyến đường chi tiết với tọa độ
- Thời gian dự kiến
- Nút xem chi tiết đơn hàng

### 6. Legend
Chú thích màu sắc ở góc phải bản đồ

## Cài Đặt

Xem file `MAP_SETUP.md` để biết:
- Cài đặt react-native-maps
- Lấy Google Maps API key
- Cấu hình cho Expo
- Kết nối với backend

## Sử Dụng

### Điều Hướng

Từ Admin:
1. Đăng nhập với tài khoản Admin
2. Tab bar dưới cùng → Chọn tab "Vận chuyển" (icon navigation)
3. Hoặc navigate từ code:
```javascript
navigation.navigate('AdminMapTracking');
```

### Dữ Liệu Hiển Thị

Hiện tại sử dụng **dữ liệu mock**. Để kết nối với backend thực tế, xem phần "Tích Hợp Backend" trong `MAP_SETUP.md`.

## Cấu Trúc Code

```
src/
├── screens/
│   └── Admin/
│       └── MapTrackingScreen.js  ← Main component
├── navigation/
│   └── AppNavigator.js           ← Navigation config
```

## Tùy Chỉnh

### Thay đổi màu sắc trạng thái:
```javascript
// Trong MapTrackingScreen.js
const getStatusColor = (status) => {
  switch (status) {
    case 'in_transit': return '#F59E0B'; // Vàng
    case 'delivered': return '#22C55E'; // Xanh
    case 'pending': return '#6B7280';   // Xám
  }
};
```

### Thay đổi center bản đồ:
```javascript
const defaultRegion = {
  latitude: 10.8231,  // TP.HCM
  longitude: 106.6297,
  latitudeDelta: 0.145,
  longitudeDelta: 0.145,
};
```

### Thêm loại marker mới:
Thêm vào switch case trong `getStatusIcon()` và `getStatusLabel()`.

## API Integration

Định nghĩa data structure từ backend:

```javascript
{
  "warehouse": {
    "name": "Kho chính",
    "location": { "latitude": 10.8231, "longitude": 106.6297 },
    "address": "Địa chỉ kho"
  },
  "orders": [
    {
      "id": "ORD001",
      "customerName": "Nguyễn Văn A",
      "phone": "0901234567",
      "status": "in_transit",  // pending, in_transit, delivered
      "progress": 65,  // 0-100%
      "route": [
        { "latitude": 10.8231, "longitude": 106.6297, "label": "Kho" },
        { "latitude": 10.8396, "longitude": 106.6609, "label": "Khách 1" }
      ],
      "currentLocation": { "latitude": 10.8396, "longitude": 106.6609 },
      "estimatedArrival": "14:30",
      "items": [
        { "name": "Sản phẩm", "quantity": 2 }
      ]
    }
  ],
  "stats": {
    "total": 15,
    "inTransit": 8,
    "delivered": 5,
    "pending": 2
  }
}
```

## Troubleshooting

### Map không hiển thị:
1. Kiểm tra API key đã thêm vào `app.json`
2. Chạy `npx expo prebuild --clean`
3. Rebuild app

### Marker không xuất hiện:
- Kiểm tra coordinates có hợp lệ không
- Kiểm tra data structure

### Lỗi trên Web:
Thêm script tag vào `public/index.html` (xem MAP_SETUP.md)

## Performance Tips

1. **Virtualization**: Nếu có nhiều orders (>100), dùng FlatList với các marker động
2. **Clustering**: Group markers gần nhau thành cluster
3. **Lazy loading**: Chỉ load orders trong phạm vi hiển thị
4. **Cache**: Cache API responses với AsyncStorage

## Next Features (TODO)

- [ ] Real-time location tracking cho shipper
- [ ] Geofencing - thông báo khi đến khu vực
- [ ] Route optimization - đề xuất tuyến tối ưu
- [ ] Push notification khi gần đến
- [ ] Offline mode với cached maps
- [ ] Export route report
- [ ] Heatmap cho khu vực nhu cầu cao

## Support

Nếu gặp vấn đề:
1. Check console logs
2. Verify Google Maps API key
3. Review Google Cloud Console > APIs
4. Kiểm tra network connectivity

---

**Version**: 1.0.0
**Last Updated**: 2025-06-15
