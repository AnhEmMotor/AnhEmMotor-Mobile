1. Tầng 1: Định danh tài sản (Vehicle Identity)
Khách hàng cần thấy ngay chiếc xe chính chủ của mình với các thông tin độc nhất (không trùng lặp với bất kỳ ai):

Hình ảnh thực tế theo đúng màu xe: Nếu khách mua SH màu Xám Xi Măng, ảnh hiển thị phải là màu Xám Xi Măng, không dùng ảnh đại diện chung chung của hãng.

Biển số xe cá nhân: Hiển thị lớn, bo khung mô phỏng biển số thật (Ví dụ: 60-A1 555.55 tại Biên Hòa).

Số khung / Số máy: Thông tin pháp lý quan trọng để đối chiếu khi đi làm thủ tục hoặc kiểm tra bảo hành gốc từ hãng.

Biệt danh của xe (Tùy chọn): Cho phép khách tự đặt tên vui vẻ cho xe (Ví dụ: "Vợ hai", "Chiến mã").

⏳ 2. Tầng 2: Trạng thái Vận hành & Bảo hành (Live Status)
Số Km đã đi (ODO Dự kiến): Hệ thống dựa vào dữ liệu lần sửa cuối ở xưởng và thuật toán chạy trung bình ngày để hiển thị số ODO ước tính hiện tại.

Thời hạn bảo hành còn lại: Thay vì ghi ngày tháng khô khan, hãy dùng một thanh tiến độ (Progress Bar) kèm số ngày đếm ngược: "Còn 425 ngày bảo hành chính hãng". Điều này nhắc nhở khách hàng về quyền lợi của họ.

🛠️ 3. Tầng 3: Sức khỏe & Nhật ký "Xe Sạch" (Health Monitor)
Đây là phần lõi tạo ra dòng tiền quay lại xưởng dịch vụ cho cửa hàng:

Trạng thái bộ phận (Dự báo hao mòn): Hiển thị danh sách các linh kiện tiêu hao theo dạng thanh màu sắc (Xanh: Tốt / Vàng: Sắp đến hạn / Đỏ: Cần thay ngay):

Nhớt máy: Còn khoảng 500 km.

Má phanh: Trạng thái Tốt.

Lọc gió: Cần kiểm tra.

Lối tắt xem "Bệnh án": Nút bấm dẫn thẳng vào lịch sử tất cả các lần sửa chữa, hóa đơn đã chi tại AnhEmMotor của riêng chiếc xe này.

📄 4. Tầng 4: Hồ sơ Pháp lý & Hành chính (Legal Documents)
Nơi lưu trữ các giấy tờ số hóa để khách hàng có thể lục lại cứu cánh trong các tình huống khẩn cấp trên đường:

Bảo hiểm dân sự bắt buộc: Hiển thị ngày hết hạn. Nếu sắp hết hạn, hệ thống sẽ đổi sang màu cam/đỏ kèm nút gia hạn nhanh.

Hóa đơn điện tử mua xe (e-Invoice): File PDF lưu trữ ngày xuống tiền mua xe để đối chiếu thuế bạ.

Trạng thái giấy tờ (Nếu là xe mới mua đang chờ biển): Hiển thị tiến độ duyệt hồ sơ gốc, bấm vào sẽ nhảy về luồng hành chính ở Tab 3.

📱 5. Tầng 5: Cụm hành động nhanh ở đáy màn hình (Sticky Bottom Actions)
Ghim cố định ở đáy màn hình 2 nút bấm có tần suất sử dụng cao nhất đối với một chiếc xe đang vận hành:

📅 Nút chính (Màu nổi bật): [ Đặt lịch bảo dưỡng xe này ] — Bấm vào hệ thống tự động điền sẵn thông tin xe, biển số vào form đặt lịch, khách chỉ việc chọn giờ đến xưởng Biên Hòa.

📖 Nút phụ (Dạng viền): [ Sách hướng dẫn sử dụng (User Manual) ] — Bản số hóa hướng dẫn thông số áp suất lốp, cách mở cốp thông minh, cách dùng Smartkey của đúng đời xe đó để khách tự tra cứu khi cần.

🎨 Bố cục trực quan hóa nhanh trên Mobile UI:
Plaintext
┌────────────────────────────────────────┐
│ ❮  Chi tiết chiếc xe của tôi           │
├────────────────────────────────────────┤
│                [ 🛵 ]                  │ ◄── Đúng màu xe khách mua
│           HONDA SH 125i                │
│       [ Biển số: 60-A1 555.55 ]        │ ◄── Khung biển số giả lập
├────────────────────────────────────────┤
│ ⏳ Trạng thái: 5,200 km (ODO)          │
│ 🛡️ Bảo hành: [██████░░░░] Còn 14 tháng  │
├────────────────────────────────────────┤
│ 🩺 Sức khỏe phụ tùng                   │
│   • Nhớt máy:   ⚠️ Còn 300km cần thay  │ ◄── Dự báo hao mòn thông minh
│   • Má phanh:   ✓ Đang tốt             │
├────────────────────────────────────────┤
│ 📄 Giấy tờ của xe                      │
│   • Bảo hiểm xe: Hết hạn 20/05/2026   │
│   • Hóa đơn mua xe điện tử (PDF)     ➔ │
├────────────────────────────────────────┤
│  [ ĐẶT LỊCH SỬA CHỮA ]   [ SÁCH HDSD ] │ ◄── Cụm nút Sticky cố định đáy
└────────────────────────────────────────┘
Sự khác biệt lớn nhất ở đây là tính "Cá nhân hóa và Động". Trang chi tiết sản phẩm thì ai nhìn cũng giống nhau, còn trang chi tiết xe này đổi thay theo từng cây số mà khách hàng lăn bánh trên đường.