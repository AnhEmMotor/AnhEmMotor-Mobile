📱 Cấu trúc Luồng Trang Chủ (Cập nhật)

1. Header (Thanh đầu trang)

Lời chào cá nhân hóa: Chào theo tên khách hàng (Ví dụ: "Xin chào, Anh Long").

Icon Hồ sơ cá nhân: Nằm ở góc phải, chạm vào để dẫn thẳng đến màn hình cập nhật thông tin/ví giấy tờ.

Icon Thông báo (Bell Icon): Hiển thị số lượng thông báo mới về lịch bảo dưỡng hoặc voucher.

2. Module Hồ sơ xe / Tiến độ nhận xe (Dynamic State)

Đây là khu vực chiếm diện tích lớn và thu hút ánh nhìn nhất, tự động thay đổi theo trạng thái của khách hàng:

Trường hợp 1 (Khách đã có xe):

Hiển thị: Hình ảnh xe + Tên xe + Biển số (Ví dụ: SH 125i - 60-A1 555.55).

Thông số nhanh: ODO hiện tại và số ngày/số km còn lại đến kỳ bảo dưỡng tiếp theo.

Cụm nút bấm hành động mượt mà: [Đặt lịch ngay] và [Lịch sử xe sạch].

Trường hợp 2 (Khách vừa cọc xe, đang chờ giao):

Khối này tự động biến thành Thanh tiến độ nhận xe liên kết trực tiếp với Sales Pipeline trên CRM (Ví dụ: Đang làm biển số Biên Hòa $\rightarrow$ Dự kiến giao: 2 ngày nữa).

3. Module Nhắc nhở (Priority Alerts)

Chỉ xuất hiện khi có cảnh báo mang tính chất hành chính hoặc kỹ thuật.

Nội dung: Ghi chú rõ ràng dạng thẻ (Card) như: "Bảo hiểm dân sự của xe 60-A1 555.55 sắp hết hạn trong 5 ngày" hoặc "Lọc gió xe Winner X đã đến kỳ thay thế".

Nếu không có cảnh báo nào, module này sẽ tự động ẩn đi để giao diện thông thoáng.

4. Module Khuyến mãi & Voucher (Kích cầu)

Banner Ưu đãi: Dạng Slider vuốt ngang để giới thiệu các chiến dịch lớn (Ví dụ: Ra mắt dòng xe mới, sự kiện tri ân tại showroom).

Voucher "Dành riêng cho bạn": Các thẻ ưu đãi phụ kiện hoặc dịch vụ sửa chữa được hiển thị trực quan kèm mã QR thu nhỏ, sắp xếp theo dạng danh sách cuộn ngang (X-Scroll).